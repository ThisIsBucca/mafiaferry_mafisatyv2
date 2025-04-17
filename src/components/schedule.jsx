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

// Map day names to numbers (0-6) and Swahili translations
const dayMap = {
  'Monday': { index: 0, swahili: 'Jumatatu' },
  'Tuesday': { index: 1, swahili: 'Jumanne' },
  'Wednesday': { index: 2, swahili: 'Jumatano' },
  'Thursday': { index: 3, swahili: 'Alhamisi' },
  'Friday': { index: 4, swahili: 'Ijumaa' },
  'Saturday': { index: 5, swahili: 'Jumamosi' },
  'Sunday': { index: 6, swahili: 'Jumapili' }
}

// Add Swahili month names
const swahiliMonths = {
  'January': 'Januari',
  'February': 'Februari',
  'March': 'Machi',
  'April': 'Aprili',
  'May': 'Mei',
  'June': 'Juni',
  'July': 'Julai',
  'August': 'Agosti',
  'September': 'Septemba',
  'October': 'Oktoba',
  'November': 'Novemba',
  'December': 'Desemba'
}

// Function to translate duration to Swahili
const translateDuration = (duration) => {
  if (!duration) return ''
  return duration
    .replace('hours', 'masaa')
    .replace('hour', 'saa')
    .replace('minutes', 'dakika')
    .replace('minute', 'dakika')
    .replace('days', 'siku')
    .replace('day', 'siku')
}

const getCurrentMafiaTime = () => {
  const now = new Date()
  return new Date(formatInTimeZone(now, TIMEZONE, 'yyyy-MM-dd HH:mm:ss'))
}

const getDayInCurrentWeek = (dayName, time) => {
  const currentDate = getCurrentMafiaTime()
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 }) // Week starts on Monday
  const [hours, minutes] = time.split(':').map(Number)
  
  // Get the target day's date in current week
  let targetDate = addDays(startOfCurrentWeek, dayMap[dayName].index)
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
  if (hours >= 5 && hours < 12) return 'Asubuhi'
  if (hours >= 12 && hours < 17) return 'Mchana'
  if (hours >= 17 && hours < 20) return 'Jioni'
  return 'Usiku'
}

// Add Swahili time format
const formatSwahiliDate = (date) => {
  const day = format(date, 'EEEE')
  const month = format(date, 'MMMM')
  const dayNum = format(date, 'd')
  const year = format(date, 'yyyy')
  
  return `${dayMap[day].swahili}, ${dayNum} ${swahiliMonths[month]}, ${year}`
}

const getJourneyStatus = (days, departureTime) => {
  const now = getCurrentMafiaTime()
  const nextDeparture = getNextDepartureDate(days, departureTime)
  
  if (!nextDeparture) {
    const [hours] = departureTime.split(':').map(Number)
    return {
      status: 'Hakuna Ratiba',
      className: 'bg-gray-100/10 text-gray-500 border-gray-200/20',
      timeRemaining: '',
      localTime: `${format(parse(departureTime, 'HH:mm', new Date()), 'h:mm a')} (${getTimeOfDay(hours)})`,
      nextDepartureDate: 'Ratiba haipatikani'
    }
  }

  const minutesUntilDeparture = differenceInMinutes(nextDeparture, now)
  const hoursUntilDeparture = differenceInHours(nextDeparture, now)
  
  const formatTimeRemaining = () => {
    if (minutesUntilDeparture <= 0) return ''
    const timeStr = formatDistanceToNow(nextDeparture, { addSuffix: true })
    // Translate time remaining to Swahili
    return timeStr
      .replace('in ', 'kwa ')
      .replace('about ', 'takriban ')
      .replace('less than ', 'chini ya ')
      .replace('over ', 'zaidi ya ')
      .replace('almost ', 'karibu ')
      .replace('days', 'siku')
      .replace('day', 'siku')
      .replace('hours', 'masaa')
      .replace('hour', 'saa')
      .replace('minutes', 'dakika')
      .replace('minute', 'dakika')
  }

  const departureHours = nextDeparture.getHours()
  const localTime = `${format(nextDeparture, 'h:mm a')} (${getTimeOfDay(departureHours)})`
  const nextDepartureDate = formatSwahiliDate(nextDeparture)
  const timeRemaining = formatTimeRemaining()

  if (hoursUntilDeparture > 2) {
    return {
      status: 'Inakuja',
      className: 'bg-emerald-100/10 text-emerald-500 border-emerald-200/20',
      timeRemaining,
      localTime,
      nextDepartureDate
    }
  } else if (minutesUntilDeparture > 0) {
    return {
      status: 'Inatoka Hivi Karibuni',
      className: 'bg-yellow-100/10 text-yellow-500 border-yellow-200/20',
      timeRemaining,
      localTime,
      nextDepartureDate
    }
  } else {
    return {
      status: 'Imetoka',
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
              <span className="text-sm font-medium">Inapakia Ratiba</span>
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
              <span className="text-sm font-medium">Hitilafu ya Ratiba</span>
            </div>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Jaribu Tena
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
            <span className="text-xs sm:text-sm font-medium">Ratiba ya Moja kwa Moja</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Ratiba za Vyombo vya Majini
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Mashua | Meli | Vyombo vya Usafiri wa Majini
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-muted-foreground">Inakuja: Zaidi ya masaa 2 hadi kuondoka</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="text-xs text-muted-foreground">Inatoka Hivi Karibuni: Chini ya masaa 2 iliyobaki</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-xs text-muted-foreground">Imetoka: Safari imeanza</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-xs text-muted-foreground">Imeratibiwa: Haiendeshwi leo</span>
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
                        <p className="text-xs text-muted-foreground">Njia</p>
                        <h4 className="text-sm sm:text-base font-medium">{schedule.route}</h4>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-xs text-muted-foreground">Muda wa Safari</p>
                        <span className="text-xs sm:text-sm">{translateDuration(schedule.duration)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Siku ya Safari</p>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                          <span className="text-xs sm:text-sm">
                            {schedule.days.split(',').map(day => dayMap[day.trim()].swahili).join(', ')}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Kuondoka Kijijini</p>
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
                      <p className="text-xs text-muted-foreground">Taarifa za Ziada</p>
                      <div className="rounded-lg border border-red-200/20 bg-red-50/10 p-3">
                        <div className="flex items-start gap-1.5 sm:gap-2">
                          <Info className="w-3 h-3 sm:w-4 sm:h-4 text-red-500/70 mt-0.5" />
                          <span className="text-xs sm:text-sm text-red-900/70 dark:text-red-300/90">
                            {schedule.notes || 'Hakuna maelezo ya ziada'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground text-center">
                        Muda wote unaonyeshwa kwa wakati wa Mafia Island (EAT)
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