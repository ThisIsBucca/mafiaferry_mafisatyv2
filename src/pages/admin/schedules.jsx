import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../../lib/supabase"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"

export default function SchedulesAdmin() {
  const [editingSchedule, setEditingSchedule] = useState(null)
  const queryClient = useQueryClient()

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
      toast.success('Schedule saved successfully')
    },
    onError: (error) => {
      toast.error('Failed to save schedule')
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Schedules</h1>
        <button
          onClick={() => setEditingSchedule({})}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Add Schedule
        </button>
      </div>

      {editingSchedule && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingSchedule.id ? 'Edit Schedule' : 'Add Schedule'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ship Name</label>
                <input
                  type="text"
                  name="ship_name"
                  defaultValue={editingSchedule.ship_name}
                  className="w-full px-3 py-2 rounded-md border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Route</label>
                <input
                  type="text"
                  name="route"
                  defaultValue={editingSchedule.route}
                  className="w-full px-3 py-2 rounded-md border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Days</label>
                <input
                  type="text"
                  name="days"
                  defaultValue={editingSchedule.days}
                  className="w-full px-3 py-2 rounded-md border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Departure Time</label>
                <input
                  type="time"
                  name="departure"
                  defaultValue={editingSchedule.departure}
                  className="w-full px-3 py-2 rounded-md border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Arrival Time</label>
                <input
                  type="time"
                  name="arrival"
                  defaultValue={editingSchedule.arrival}
                  className="w-full px-3 py-2 rounded-md border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <input
                  type="text"
                  name="duration"
                  defaultValue={editingSchedule.duration}
                  className="w-full px-3 py-2 rounded-md border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  name="notes"
                  defaultValue={editingSchedule.notes}
                  className="w-full px-3 py-2 rounded-md border"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSchedule(null)}
                  className="px-4 py-2 rounded-lg border hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addUpdateMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Ship Name</th>
              <th className="text-left py-2">Route</th>
              <th className="text-left py-2">Days</th>
              <th className="text-left py-2">Departure</th>
              <th className="text-left py-2">Arrival</th>
              <th className="text-left py-2">Duration</th>
              <th className="text-left py-2">Notes</th>
              <th className="text-right py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules?.map((schedule) => (
              <tr key={schedule.id} className="border-b">
                <td className="py-2">{schedule.ship_name}</td>
                <td className="py-2">{schedule.route}</td>
                <td className="py-2">{schedule.days}</td>
                <td className="py-2">{schedule.departure}</td>
                <td className="py-2">{schedule.arrival}</td>
                <td className="py-2">{schedule.duration}</td>
                <td className="py-2">{schedule.notes}</td>
                <td className="py-2 text-right">
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