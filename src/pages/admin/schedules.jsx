import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../../lib/supabase"
import { toast } from "react-hot-toast"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"

export default function SchedulesAdmin() {
  const [editingSchedule, setEditingSchedule] = useState(null)
  const queryClient = useQueryClient()

  // Predefined options for form fields
  const shipOptions = [
    { value: "MV Kilindoni", label: "MV Kilindoni" },
    { value: "MV Songosongo", label: "MV Songosongo" },
    { value: "MV Bucca,mashua", label: "MV Bucca,mashua" },
    { value: "MV Amana,tukutuku", label: "MV Amana,tukutuku" },
    { value: "MV bwejuu", label: "MV bwejuu" }
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
    { value: "Mafia Island - Kilwa,somanga", label: "Mafia Island - Kilwa,somanga" }
  ]
  ]

  const dayOptions = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" }
  ]

  const durationOptions = [
    { value: "2 hours", label: "2 hours" },
    { value: "3 hours", label: "3 hours" },
    { value: "4 hours", label: "4 hours" },
    { value: "5 hours", label: "5 hours" },
    { value: "6 hours", label: "6 hours" }
  ]

  const { data: schedules, isLoading } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .order('created_at', { ascending: true })
      
      if (error) throw error
      return data
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
      toast.success('Schedule deleted successfully')
    },
    onError: (error) => {
      toast.error('Failed to delete schedule')
      console.error('Delete error:', error)
    }
  })

  const addUpdateMutation = useMutation({
    mutationFn: async (schedule) => {
      if (schedule.id) {
        const { error } = await supabase
          .from('schedules')
          .update(schedule)
          .eq('id', schedule.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('schedules')
          .insert(schedule)
        
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
      setEditingSchedule(null)
      toast.success('Schedule saved successfully!', {
        position: 'top-center',
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      })
    },
    onError: (error) => {
      toast.error('Failed to save schedule', {
        position: 'top-center',
        duration: 3000,
        style: {
          background: '#ef4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      })
      console.error('Save error:', error)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const schedule = {
      ship_name: formData.get('ship_name'),
      route: formData.get('route'),
      days: formData.get('days'),
      departure: formData.get('departure'),
      arrival: formData.get('arrival'),
      duration: formData.get('duration'),
      notes: formData.get('notes')
    }

    if (editingSchedule) {
      schedule.id = editingSchedule.id
    }

    addUpdateMutation.mutate(schedule)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">Manage Schedules</h1>
        <button
          onClick={() => setEditingSchedule({})}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Add Schedule
        </button>
      </div>

      {editingSchedule && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8">
          <div className="bg-card rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              {editingSchedule.id ? 'Edit Schedule' : 'Add Schedule'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ship Name</label>
                <select
                  name="ship_name"
                  defaultValue={editingSchedule.ship_name}
                  className="w-full px-3 py-2 rounded-md border bg-background"
                  required
                >
                  <option value="">Select a ship</option>
                  {shipOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Route</label>
                <select
                  name="route"
                  defaultValue={editingSchedule.route}
                  className="w-full px-3 py-2 rounded-md border bg-background"
                  required
                >
                  <option value="">Select a route</option>
                  {routeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Days</label>
                <select
                  name="days"
                  defaultValue={editingSchedule.days}
                  className="w-full px-3 py-2 rounded-md border bg-background"
                  required
                >
                  <option value="">Select days</option>
                  {dayOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Departure Time</label>
                <input
                  type="time"
                  name="departure"
                  defaultValue={editingSchedule.departure}
                  className="w-full px-3 py-2 rounded-md border bg-background"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Arrival Time</label>
                <input
                  type="time"
                  name="arrival"
                  defaultValue={editingSchedule.arrival}
                  className="w-full px-3 py-2 rounded-md border bg-background"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <select
                  name="duration"
                  defaultValue={editingSchedule.duration}
                  className="w-full px-3 py-2 rounded-md border bg-background"
                  required
                >
                  <option value="">Select duration</option>
                  {durationOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Notes <span className="text-muted-foreground text-xs">(optional)</span>
                </label>
                <textarea
                  name="notes"
                  defaultValue={editingSchedule.notes}
                  className="w-full px-3 py-2 rounded-md border bg-background"
                  rows={3}
                  placeholder="Enter any additional notes or information (optional)"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSchedule(null)}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg border hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addUpdateMutation.isPending}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {addUpdateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile View - Card Layout */}
      <div className="lg:hidden space-y-4">
        {schedules?.map((schedule) => (
          <div key={schedule.id} className="bg-card rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{schedule.ship_name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingSchedule(schedule)}
                  className="p-1 hover:text-primary"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteMutation.mutate(schedule.id)}
                  className="p-1 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Route:</span> {schedule.route}</p>
              <p><span className="font-medium">Days:</span> {schedule.days}</p>
              <p><span className="font-medium">Departure:</span> {schedule.departure}</p>
              <p><span className="font-medium">Arrival:</span> {schedule.arrival}</p>
              <p><span className="font-medium">Duration:</span> {schedule.duration}</p>
              {schedule.notes && (
                <p><span className="font-medium">Notes:</span> {schedule.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Table Layout */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 sm:px-4">Ship Name</th>
              <th className="text-left py-2 px-2 sm:px-4">Route</th>
              <th className="text-left py-2 px-2 sm:px-4">Days</th>
              <th className="text-left py-2 px-2 sm:px-4">Departure</th>
              <th className="text-left py-2 px-2 sm:px-4">Arrival</th>
              <th className="text-left py-2 px-2 sm:px-4">Duration</th>
              <th className="text-left py-2 px-2 sm:px-4">Notes</th>
              <th className="text-right py-2 px-2 sm:px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules?.map((schedule) => (
              <tr key={schedule.id} className="border-b">
                <td className="py-2 px-2 sm:px-4">{schedule.ship_name}</td>
                <td className="py-2 px-2 sm:px-4">{schedule.route}</td>
                <td className="py-2 px-2 sm:px-4">{schedule.days}</td>
                <td className="py-2 px-2 sm:px-4">{schedule.departure}</td>
                <td className="py-2 px-2 sm:px-4">{schedule.arrival}</td>
                <td className="py-2 px-2 sm:px-4">{schedule.duration}</td>
                <td className="py-2 px-2 sm:px-4">{schedule.notes}</td>
                <td className="py-2 px-2 sm:px-4 text-right">
                  <button
                    onClick={() => setEditingSchedule(schedule)}
                    className="p-1 hover:text-primary"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(schedule.id)}
                    className="p-1 hover:text-destructive ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 