import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Ship, Clock, Calendar, Info, Loader2, AlertCircle, RefreshCcw } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { publicSupabase } from "../lib/supabase"
import {
  format,
  parse,
  startOfWeek,
  addDays,
  isAfter,
  isBefore,
  isSameDay,
  addWeeks,
  differenceInMinutes,
  differenceInHours,
  setHours,
  setMinutes,
  formatDistanceToNow
} from "date-fns"
import { formatInTimeZone } from 'date-fns-tz'

const TIMEZONE = "Africa/Dar_es_Salaam"

const getCurrentMafiaTime = () => {
  const now = new Date()
  return new Date(formatInTimeZone(now, TIMEZONE, 'yyyy-MM-dd HH:mm:ss'))
}

const getDayInCurrentWeek = (dayName, time) => {
  const currentDate = getCurrentMafiaTime()
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 }) // Week starts on Monday
  const [hours, minutes] = time.split(':').map(Number)
  
  // Map day names to numbers (0-6)
  const dayMap = {
    'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3,
    'Friday': 4, 'Saturday': 5, 'Sunday': 6
  }
  
  // Get the target day's date in current week
  let targetDate = addDays(startOfCurrentWeek, dayMap[dayName])
  targetDate = setHours(setMinutes(targetDate, minutes), hours)
  
  // If the day/time has passed this week, get next week's date
  if (isBefore(targetDate, currentDate)) {
    targetDate = addWeeks(targetDate, 1)
  }
  
  return targetDate
}

const getNextDepartureDate = (days, departureTime) => {
  const operatingDays = days.split(',').map(day => day.trim())
  const now = getCurrentMafiaTime()
  
  // Get all possible next departure dates
  const possibleDates = operatingDays.map(day => getDayInCurrentWeek(day, departureTime))
  
  // Find the next valid departure date
  return possibleDates
    .filter(date => isAfter(date, now))
    .sort((a, b) => a - b)[0]
}

const getTimeOfDay = (hours) => {
  if (hours >= 5 && hours < 12) return 'Morning'
  if (hours >= 12 && hours < 17) return 'Afternoon'
  if (hours >= 17 && hours < 20) return 'Evening'
  return 'Night'
}

const getJourneyStatus = (days, departureTime) => {
  const now = getCurrentMafiaTime()
  const nextDeparture = getNextDepartureDate(days, departureTime)
  
  if (!nextDeparture) {
    const [hours] = departureTime.split(':').map(Number)
    return {
      status: 'No Schedule',
      className: 'bg-gray-100/10 text-gray-500 border-gray-200/20',
      timeRemaining: '',
      localTime: `${format(parse(departureTime, 'HH:mm', new Date()), 'h:mm a')} (${getTimeOfDay(hours)})`,
      nextDepartureDate: 'Schedule unavailable'
    }
  }

  const minutesUntilDeparture = differenceInMinutes(nextDeparture, now)
  const hoursUntilDeparture = differenceInHours(nextDeparture, now)
  
  const formatTimeRemaining = () => {
    if (minutesUntilDeparture <= 0) return ''
    return formatDistanceToNow(nextDeparture, { addSuffix: true })
  }

  const departureHours = nextDeparture.getHours()
  const localTime = `${format(nextDeparture, 'h:mm a')} (${getTimeOfDay(departureHours)})`
  const nextDepartureDate = format(nextDeparture, 'EEEE, MMMM d, yyyy')
  const timeRemaining = formatTimeRemaining()

  if (hoursUntilDeparture > 2) {
    return {
      status: 'Upcoming',
      className: 'bg-emerald-100/10 text-emerald-500 border-emerald-200/20',
      timeRemaining,
      localTime,
      nextDepartureDate
    }
  } else if (minutesUntilDeparture > 0) {
    return {
      status: 'Departing Soon',
      className: 'bg-yellow-100/10 text-yellow-500 border-yellow-200/20',
      timeRemaining,
      localTime,
      nextDepartureDate
    }
  } else {
    return {
      status: 'Departed',
      className: 'bg-red-100/10 text-red-500 border-red-200/20',
      timeRemaining: '',
      localTime,
      nextDepartureDate
    }
  }
}

export function Schedule() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const { data: schedules, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['public-schedules'],
    queryFn: async () => {
      const { data, error } = await publicSupabase
        .from('schedules')
        .select('*')
        .order('created_at', { ascending: true })
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <section className="py-20" id="schedule">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Loading Schedules</span>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="py-20" id="schedule">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive mb-8">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Schedule Error</span>
            </div>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-20" id="schedule">
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 sm:mb-8">
            <Ship className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">Live Schedule</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Ferry Schedule
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-muted-foreground">Upcoming: More than 2 hours until departure</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="text-xs text-muted-foreground">Departing Soon: Less than 2 hours remaining</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-xs text-muted-foreground">Departed: Journey has started</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-xs text-muted-foreground">Scheduled: Not operating today</span>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:gap-8 lg:grid-cols-2">
          {schedules?.map((schedule, index) => (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl sm:rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative rounded-xl sm:rounded-2xl border bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-primary/5 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-semibold">{schedule.ship_name}</h3>
                    {(() => {
                      const { status, className, timeRemaining } = getJourneyStatus(schedule.days, schedule.departure)
                      return (
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded-md border text-xs font-medium ${className}`}>
                            {status}
                          </div>
                          {timeRemaining && (
                            <div className={`px-2 py-1 rounded-md border text-xs font-medium ${className}`}>
                              {timeRemaining}
                            </div>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                </div>
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Route</p>
                        <h4 className="text-sm sm:text-base font-medium">{schedule.route}</h4>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-xs text-muted-foreground">Journey Duration</p>
                        <span className="text-xs sm:text-sm">{schedule.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Operating Days</p>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                          <span className="text-xs sm:text-sm">{schedule.days}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Next Departure</p>
                        <div className="flex flex-col gap-1">
                          {(() => {
                            const { localTime, nextDepartureDate } = getJourneyStatus(schedule.days, schedule.departure)
                            return (
                              <>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                                  <span className="text-xs sm:text-sm">{localTime}</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span>{nextDepartureDate}</span>
                                </div>
                              </>
                            )
                          })()}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Additional Information</p>
                      <div className="rounded-lg border border-red-200/20 bg-red-50/10 p-3">
                        <div className="flex items-start gap-1.5 sm:gap-2">
                          <Info className="w-3 h-3 sm:w-4 sm:h-4 text-red-500/70 mt-0.5" />
                          <span className="text-xs sm:text-sm text-red-900/70 dark:text-red-300/90">
                            {schedule.notes || 'No additional notes'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground text-center">
                        All times shown in Mafia Island local time (EAT)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}