import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Ship, Clock, Calendar, Info, Loader2, AlertCircle, RefreshCcw } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { publicSupabase } from "../lib/supabase"

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
                  <h3 className="text-lg sm:text-xl font-semibold">{schedule.ship_name}</h3>
                </div>
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm sm:text-base font-medium">{schedule.route}</h4>
                    <span className="text-xs sm:text-sm text-muted-foreground">{schedule.duration}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{schedule.days}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{schedule.departure}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate">{schedule.notes || 'No additional notes'}</span>
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