'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { Users, Calendar, FileText, Settings, AlertTriangle, ArrowUpRight, Ship, TrendingUp, Clock, Activity } from "lucide-react"
import { useSchedules } from "../../hooks/useSchedules"
import { useArticles } from "../../hooks/useArticles"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] },
})

export default function Dashboard() {
  const { schedules, isLoading: schedulesLoading } = useSchedules()
  const { articles, isLoading: articlesLoading } = useArticles()

  const stats = [
    { title: "Total Bookings", value: "1,234", icon: Calendar, change: "+12%", color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { title: "Active Users", value: "567", icon: Users, change: "+8%", color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    { title: "News Articles", value: articles?.length || "—", icon: FileText, change: articlesLoading ? "..." : null, color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { title: "Schedules", value: schedules?.length || "—", icon: Ship, change: schedulesLoading ? "..." : null, color: "text-amber-500", bgColor: "bg-amber-500/10" },
  ]

  const quickActions = [
    { label: "Schedules", href: "/admin/schedules", icon: Calendar, desc: "Manage ferry timings" },
    { label: "Articles", href: "/admin/articles", icon: FileText, desc: "Write & publish" },
    { label: "Products", href: "/admin/products", icon: Settings, desc: "Manage listings" },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div {...fadeUp(0)}>
        <div className="flex items-center gap-3 mb-1">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary to-accent" />
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
        </div>
        <p className="text-sm text-muted-foreground ml-4">Overview of your MafiaFerry platform</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            {...fadeUp(0.05 * i)}
            className="group relative overflow-hidden rounded-xl border border-border/40 bg-card p-4 sm:p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-24 h-24 -translate-y-8 translate-x-8 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300" style={{ background: `hsl(var(--primary))` }} />
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} strokeWidth={2} />
              </div>
              {stat.change && (
                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <motion.div {...fadeUp(0.25)} className="lg:col-span-1">
          <div className="h-full rounded-xl border border-border/40 bg-card p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-primary" strokeWidth={2} />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Quick Actions</h2>
            </div>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex items-center gap-3 p-3 rounded-lg border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <action.icon className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" strokeWidth={2} />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div {...fadeUp(0.3)} className="lg:col-span-2">
          <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/20">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" strokeWidth={2} />
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Recent Bookings</h2>
              </div>
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">Today</span>
            </div>
            <div className="divide-y divide-border/10">
              {[1, 2, 3, 4, 5].map((booking, i) => (
                <motion.div
                  key={booking}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className="flex items-center justify-between p-3 sm:p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">{booking}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Booking #{booking}</p>
                      <p className="text-xs text-muted-foreground">Mafia Island → Dar es Salaam</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Confirmed
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Stats */}
      <motion.div {...fadeUp(0.4)}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-card p-4 sm:p-5 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 rounded-lg bg-blue-500/10 shrink-0">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Schedules</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{schedulesLoading ? <span className="text-muted-foreground animate-pulse">···</span> : schedules?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-card p-4 sm:p-5 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 rounded-lg bg-purple-500/10 shrink-0">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Published Articles</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{articlesLoading ? <span className="text-muted-foreground animate-pulse">···</span> : articles?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-card p-4 sm:p-5 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 rounded-lg bg-amber-500/10 shrink-0">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Active Alerts</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">0</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div {...fadeUp(0.45)}>
        <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
          <div className="flex items-center gap-2 p-4 sm:p-5 border-b border-border/20">
            <Activity className="h-4 w-4 text-primary" strokeWidth={2} />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Recent Activity</h2>
          </div>
          <div className="divide-y divide-border/10">
            {schedules?.length > 0 ? (
              schedules.slice(0, 5).map((schedule, i) => (
                <motion.div
                  key={schedule.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center justify-between p-3 sm:p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{schedule.ship_name}</p>
                      <p className="text-xs text-muted-foreground">{schedule.route}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
                </motion.div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Ship className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
