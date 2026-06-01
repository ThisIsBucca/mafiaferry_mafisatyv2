'use client'

import { useEffect, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "../../../lib/supabase"
import { toast } from "react-hot-toast"
import { Plus, Pencil, Trash2, Loader2, X, Ship, MapPin, Calendar, Clock, Timer, FileText } from "lucide-react"

const shipOptions = [
  { value: "MV Kilindoni", label: "MV Kilindoni" },
  { value: "MV Songosongo", label: "MV Songosongo" },
  { value: "MV Bucca,mashua", label: "MV Bucca,mashua" },
  { value: "MV Amana,tukutuku", label: "MV Amana,tukutuku" },
  { value: "MV bwejuu", label: "MV bwejuu" },
]

const routeOptions = [
  { value: "Mafia Island - Nyamisati", label: "Mafia Island - Nyamisati" },
  { value: "Nyamisati - Mafia Island", label: "Nyamisati - Mafia Island" },
  { value: "Mafia Island - Dar es salaam", label: "Mafia Island - Dar es salaam" },
  { value: "Dar es salaam - Mafia Island", label: "Dar es salaam - Mafia Island" },
  { value: "Mafia Island - Zanzibar", label: "Mafia Island - Zanzibar" },
  { value: "Zanzibar - Mafia Island", label: "Zanzibar - Mafia Island" },
  { value: "Kisiju - Mafia Island", label: "Kisiju - Mafia Island" },
  { value: "Mafia Island - Kisiju", label: "Mafia Island - Kisiju" },
  { value: "Kilwa,somanga - Mafia Island", label: "Kilwa,somanga - Mafia Island" },
  { value: "Mafia Island - Kilwa,somanga", label: "Mafia Island - Kilwa,somanga" },
]

const dayOptions = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
]

const durationOptions = [
  { value: "2 hours", label: "2 hours" },
  { value: "3 hours", label: "3 hours" },
  { value: "4 hours", label: "4 hours" },
  { value: "5 hours", label: "5 hours" },
  { value: "6 hours", label: "6 hours" },
]

export default function SchedulesAdmin() {
  const [editingSchedule, setEditingSchedule] = useState(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (editingSchedule) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }
    return () => document.body.classList.remove("overflow-hidden")
  }, [editingSchedule])

  const { data: schedules, isLoading } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedules")
        .select("*")
        .order("created_at", { ascending: true })
      if (error) throw error
      return data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("schedules").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] })
      toast.success("Schedule deleted successfully")
    },
    onError: (error) => {
      toast.error("Failed to delete schedule")
      console.error("Delete error:", error)
    },
  })

  const addUpdateMutation = useMutation({
    mutationFn: async (schedule) => {
      if (schedule.id) {
        const { error } = await supabase.from("schedules").update(schedule).eq("id", schedule.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("schedules").insert(schedule)
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] })
      setEditingSchedule(null)
      toast.success("Schedule saved successfully!")
    },
    onError: (error) => {
      toast.error("Failed to save schedule")
      console.error("Save error:", error)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const schedule = {
      ship_name: formData.get("ship_name"),
      route: formData.get("route"),
      days: formData.get("days"),
      date: formData.get("date"),
      departure: formData.get("departure"),
      arrival: formData.get("arrival"),
      duration: formData.get("duration"),
      notes: formData.get("notes"),
    }
    if (editingSchedule?.id) {
      schedule.id = editingSchedule.id
    }
    addUpdateMutation.mutate(schedule)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary to-accent" />
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Manage Schedules</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-4">Add and manage ferry schedules</p>
        </div>
        <button
          onClick={() => setEditingSchedule({})}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add Schedule
        </button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {editingSchedule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setEditingSchedule(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border/40 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-card z-10 flex items-center justify-between p-5 border-b border-border/20">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Ship className="h-4 w-4 text-primary" strokeWidth={2} />
                  </div>
                  <h2 className="text-base font-bold text-foreground">
                    {editingSchedule?.id ? "Edit Schedule" : "New Schedule"}
                  </h2>
                </div>
                <button
                  onClick={() => setEditingSchedule(null)}
                  className="btn-icon h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/90">
                    <Ship className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
                    Ship Name
                  </label>
                  <select
                    name="ship_name"
                    defaultValue={editingSchedule?.ship_name || ""}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    required
                  >
                    <option value="">Select a ship</option>
                    {shipOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/90">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
                    Route
                  </label>
                  <select
                    name="route"
                    defaultValue={editingSchedule?.route || ""}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    required
                  >
                    <option value="">Select a route</option>
                    {routeOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/90">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
                      Days
                    </label>
                    <select
                      name="days"
                      defaultValue={editingSchedule?.days || ""}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      required
                    >
                      <option value="">Select day</option>
                      {dayOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/90">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      defaultValue={editingSchedule?.date || ""}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/90">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
                      Departure
                    </label>
                    <input
                      type="time"
                      name="departure"
                      defaultValue={editingSchedule?.departure || ""}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/90">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
                      Arrival
                    </label>
                    <input
                      type="time"
                      name="arrival"
                      defaultValue={editingSchedule?.arrival || ""}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/90">
                    <Timer className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
                    Duration
                  </label>
                  <select
                    name="duration"
                    defaultValue={editingSchedule?.duration || ""}
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    required
                  >
                    <option value="">Select duration</option>
                    {durationOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/90">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
                    Notes <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                  </label>
                  <textarea
                    name="notes"
                    defaultValue={editingSchedule?.notes || ""}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                    rows={3}
                    placeholder="Enter any additional notes..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingSchedule(null)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addUpdateMutation.isPending}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {addUpdateMutation.isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      "Save Schedule"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {schedules?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Ship className="h-10 w-10 mx-auto mb-3 opacity-30" strokeWidth={1.5} />
            <p className="text-sm">No schedules yet</p>
          </div>
        ) : (
          schedules?.map((schedule, i) => (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group rounded-xl border border-border/40 bg-card p-4 hover:shadow-md hover:border-primary/20 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Ship className="h-4 w-4 text-primary" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{schedule.ship_name}</h3>
                    <p className="text-xs text-muted-foreground">{schedule.route}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingSchedule(schedule)}
                    className="btn-icon !bg-primary text-primary-foreground h-8 w-8 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(schedule.id)}
                    className="btn-icon h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3 w-3" strokeWidth={2} />
                  <span>{schedule.days}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3 w-3" strokeWidth={2} />
                  <span>{schedule.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3 w-3" strokeWidth={2} />
                  <span>{schedule.departure} - {schedule.arrival}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Timer className="h-3 w-3" strokeWidth={2} />
                  <span>{schedule.duration}</span>
                </div>
              </div>
              {schedule.notes && (
                <p className="mt-2 text-xs text-muted-foreground italic border-t border-border/20 pt-2">
                  {schedule.notes}
                </p>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-xl border border-border/40 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/20 bg-muted/30">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ship</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Route</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Days</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Departure</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Arrival</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Duration</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notes</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {schedules?.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-sm text-muted-foreground">
                    No schedules yet
                  </td>
                </tr>
              ) : (
                schedules?.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{schedule.ship_name}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{schedule.route}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{schedule.days}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{schedule.date}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{schedule.departure}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{schedule.arrival}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{schedule.duration}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground max-w-[150px] truncate">{schedule.notes || "—"}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingSchedule(schedule)}
                          className="btn-icon h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                        >
                          <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(schedule.id)}
                          className="btn-icon h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
