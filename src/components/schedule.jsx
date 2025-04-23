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
import { useState, useEffect } from "react"

const TIMEZONE = "Africa/Dar_es_Salaam"

const dayMap = {
  'Monday': { index: 0, swahili: 'Jumatatu' },
  'Tuesday': { index: 1, swahili: 'Jumanne' },
  'Wednesday': { index: 2, swahili: 'Jumatano' },
  'Thursday': { index: 3, swahili: 'Alhamisi' },
  'Friday': { index: 4, swahili: 'Ijumaa' },
  'Saturday': { index: 5, swahili: 'Jumamosi' },
  'Sunday': { index: 6, swahili: 'Jumapili' }
}

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
  const mafiaTime = formatInTimeZone(now, TIMEZONE, 'yyyy-MM-dd HH:mm:ss')
  return new Date(mafiaTime)
}

const getTimeOfDay = (hours) => {
  if (hours >= 5 && hours < 12) return 'Asubuhi'
  if (hours >= 12 && hours < 17) return 'Mchana'
  if (hours >= 17 && hours < 20) return 'Jioni'
  return 'Usiku'
}

const formatSwahiliDate = (date) => {
  const dateInTZ = new Date(date.toLocaleString('en-US', { timeZone: TIMEZONE }))
  const day = format(dateInTZ, 'EEEE')
  const month = format(dateInTZ, 'MMMM')
  const dayNum = format(dateInTZ, 'd')
  const year = format(dateInTZ, 'yyyy')
  
  return `${dayMap[day].swahili}, ${dayNum} ${swahiliMonths[month]}, ${year}`
}

function CurrentMafiaTime() {
  const [currentTime, setCurrentTime] = useState(getCurrentMafiaTime())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentMafiaTime())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="text-xs text-muted-foreground text-center">
      Muda wote unaonyeshwa kwa wakati wa Mafia Island (EAT): {format(currentTime, 'h:mm a')}
    </div>
  )
}

export function Schedule() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  
  const [selectedDate, setSelectedDate] = useState('today')
  const [, setForceUpdate] = useState({})
  
  useEffect(() => {
    const timer = setInterval(() => {
      setForceUpdate({})
    }, 60000)

    return () => clearInterval(timer)
  }, [])
  
  const getSelectedDate = () => {
    const now = getCurrentMafiaTime()
    let targetDate
    
    if (selectedDate === 'today') {
      targetDate = now
    } else if (selectedDate === 'tomorrow') {
      targetDate = addDays(now, 1)
    } else if (selectedDate === 'dayAfterTomorrow') {
      targetDate = addDays(now, 2)
    } else {
      targetDate = now
    }
    
    return targetDate
  }

  const getSelectedDateText = () => {
    const dateObj = getSelectedDate()
    const dayName = format(dateObj, 'EEEE')
    const dayNum = format(dateObj, 'd')
    const month = format(dateObj, 'MMMM')
    const year = format(dateObj, 'yyyy')
    
    return `${dayMap[dayName].swahili}, ${dayNum} ${swahiliMonths[month]}, ${year}`
  }

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

  const filteredSchedules = schedules?.filter(schedule => {
    try {
      if (!schedule.date) {
        console.log('Schedule missing date:', schedule.id)
        return false
      }
      
      const selectedDateObj = getSelectedDate()
      const selectedDateStr = format(selectedDateObj, 'yyyy-MM-dd')
      return schedule.date === selectedDateStr
    } catch (error) {
      console.error('Error parsing date for schedule:', schedule.id, error)
      return false
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
            <span className="text-xs sm:text-sm font-medium">Ratiba ya Usafiri</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Ratiba za Vyombo vya Majini
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Mashua | Meli | Vyombo vya Usafiri wa Majini
          </p>
          
          <div className="overflow-x-auto mb-8 max-w-md mx-auto">
            <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
              <tbody>
                <tr className="bg-primary/10">
                  <td className="py-3 px-4 text-center font-medium border-r border-primary/20">
                    <button
                      onClick={() => setSelectedDate('today')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedDate === 'today' 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      Leo
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center font-medium border-r border-primary/20">
                    <button
                      onClick={() => setSelectedDate('tomorrow')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedDate === 'tomorrow' 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      Kesho
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center font-medium">
                    <button
                      onClick={() => setSelectedDate('dayAfterTomorrow')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedDate === 'dayAfterTomorrow' 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      Kesho Kutwa
                    </button>
                  </td>
                </tr>
                <tr className="bg-primary/5 border-t border-primary/20">
                  <td colSpan="3" className="py-3 px-4 text-center">
                    <div className="text-lg font-medium text-primary">
                      {getSelectedDateText()}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {!filteredSchedules || filteredSchedules.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground mb-8">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Hakuna Vyombo vinavyosafiri {selectedDate === 'today' ? 'Leo' : selectedDate === 'tomorrow' ? 'Kesho' : 'Kesho Kutwa'}</span>
            </div>
            <p className="text-muted-foreground">
              Hakuna vyombo vya usafiri wa majini vinavyosafiri {selectedDate === 'today' ? 'leo' : selectedDate === 'tomorrow' ? 'kesho' : 'kesho kutwa'}. Tafadhali angalia ratiba ya siku nyingine.
            </p>
          </motion.div>
        ) : (
          <div className={`grid gap-4 sm:gap-8 ${
            filteredSchedules.length === 1 
              ? 'grid-cols-1 max-w-4xl mx-auto' 
              : 'grid-cols-1 md:grid-cols-2'
          }`}>
            {filteredSchedules.map((schedule, index) => {
              // Format departure time
              const departureTime = new Date(schedule.date)
              const [hours, minutes] = schedule.departure.split(':').map(Number)
              departureTime.setHours(hours, minutes)
              const localTime = `${format(departureTime, 'h:mm a')} (${getTimeOfDay(hours)})`
              
              return (
                <motion.div
                  key={schedule.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`relative group ${
                    filteredSchedules.length === 1 ? 'max-w-4xl mx-auto w-full' : ''
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl sm:rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className={`relative rounded-xl sm:rounded-2xl border bg-card/50 backdrop-blur-sm overflow-hidden ${
                    filteredSchedules.length === 1 ? 'p-6 sm:p-8' : ''
                  }`}>
                    <div className={`px-4 sm:px-6 py-3 sm:py-4 bg-primary/5 border-b ${
                      filteredSchedules.length === 1 ? 'mb-6' : ''
                    }`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${
                          filteredSchedules.length === 1 ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
                        }`}>{schedule.ship_name}</h3>
                      </div>
                    </div>
                    <div className={`p-4 sm:p-6 space-y-4 ${
                      filteredSchedules.length === 1 ? 'sm:space-y-6' : 'space-y-3 sm:space-y-4'
                    }`}>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Njia</p>
                            <h4 className={`font-medium ${
                              filteredSchedules.length === 1 ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
                            }`}>{schedule.route}</h4>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="text-xs text-muted-foreground">Muda wa Safari</p>
                            <span className={`${
                              filteredSchedules.length === 1 ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                            }`}>{translateDuration(schedule.duration)}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`grid ${
                        filteredSchedules.length === 1 ? 'grid-cols-1 md:grid-cols-2 gap-6' : 'grid-cols-2 gap-3 sm:gap-4'
                      }`}>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">Siku ya Safari</p>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                              <span className={`${
                                filteredSchedules.length === 1 ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                              }`}>
                                {formatSwahiliDate(new Date(schedule.date))}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">Kuondoka Kijijini</p>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                                <span className={`${
                                  filteredSchedules.length === 1 ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                                }`}>{localTime}</span>
                              </div>
                              <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>{formatSwahiliDate(new Date(schedule.date))}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">Taarifa za Ziada</p>
                          <div className="rounded-lg border border-red-200/20 bg-red-50/10 p-3">
                            <div className="flex items-start gap-1.5 sm:gap-2">
                              <Info className="w-3 h-3 sm:w-4 sm:h-4 text-red-500/70 mt-0.5" />
                              <span className={`${
                                filteredSchedules.length === 1 ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                              } text-red-900/70 dark:text-red-300/90`}>
                                {schedule.notes || 'Hakuna maelezo ya ziada'}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <CurrentMafiaTime />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}