import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../../lib/supabase"
import { Plus, Pencil, Trash, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

export function SchedulesAdmin() {
  const [isEditing, setIsEditing] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const queryClient = useQueryClient()

  // Fetch schedules
  const { data: schedules, isLoading } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  // Delete schedule mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['schedules'])
      toast.success('Schedule deleted successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete schedule')
    }
  })

  // Add/Update schedule mutation
  const scheduleMutation = useMutation({
    mutationFn: async (data) => {
      if (data.id) {
        // Update existing schedule
        const { data: updatedData, error } = await supabase
          .from('schedules')
          .update({
            ship_name: data.ship_name,
            route: data.route,
            days: data.days,
            departure: data.departure,
            arrival: data.arrival,
            duration: data.duration,
            notes: data.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id)
          .select()
        
        if (error) throw error
        return updatedData
      } else {
        // Insert new schedule
        const { data: newData, error } = await supabase
          .from('schedules')
          .insert([{
            ship_name: data.ship_name,
            route: data.route,
            days: data.days,
            departure: data.departure,
            arrival: data.arrival,
            duration: data.duration,
            notes: data.notes,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
        
        if (error) throw error
        return newData
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['schedules'])
      setIsEditing(false)
      setEditingSchedule(null)
      toast.success(editingSchedule ? 'Schedule updated successfully' : 'Schedule added successfully')
    },
    onError: (error) => {
      console.error('Error saving schedule:', error)
      toast.error(error.message || 'Failed to save schedule')
    }
  })

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      ship_name: formData.get('ship_name'),
      route: formData.get('route'),
      days: formData.get('days'),
      departure: formData.get('departure'),
      arrival: formData.get('arrival'),
      duration: formData.get('duration'),
      notes: formData.get('notes')
    }
    
    // Add id if editing
    if (editingSchedule) {
      data.id = editingSchedule.id
    }
    
    // Validate required fields
    if (!data.ship_name || !data.route || !data.days || !data.departure || !data.arrival || !data.duration) {
      toast.error('Please fill in all required fields')
      return
    }
    
    scheduleMutation.mutate(data)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Schedules</h1>
        <button
          onClick={() => {
            setEditingSchedule(null)
            setIsEditing(true)
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Add Schedule
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left p-4">Ship Name</th>
                <th className="text-left p-4">Route</th>
                <th className="text-left p-4">Days</th>
                <th className="text-left p-4">Departure</th>
                <th className="text-left p-4">Arrival</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {schedules?.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-muted/50">
                  <td className="p-4">{schedule.ship_name}</td>
                  <td className="p-4">{schedule.route}</td>
                  <td className="p-4">{schedule.days}</td>
                  <td className="p-4">{schedule.departure}</td>
                  <td className="p-4">{schedule.arrival}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingSchedule(schedule)
                          setIsEditing(true)
                        }}
                        className="p-2 hover:bg-muted rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id)}
                        className="p-2 hover:bg-muted rounded-lg text-red-500"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 w-full max-w-md border-l bg-background p-6 overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">
              {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ship Name</label>
                <select
                  name="ship_name"
                  defaultValue={editingSchedule?.ship_name}
                  className="w-full rounded-lg border p-2 bg-background"
                  required
                >
                  <option value="">Select a ship</option>
                  <option value="MV Mafia Island">MV Mafia Island</option>
                  <option value="MV Kilindoni">MV Kilindoni</option>
                  <option value="MV Nyamisati">MV Nyamisati</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Route</label>
                <select
                  name="route"
                  defaultValue={editingSchedule?.route}
                  className="w-full rounded-lg border p-2 bg-background"
                  required
                >
                  <option value="">Select a route</option>
                  <option value="Mafia Island → Nyamisati">Mafia Island → Nyamisati</option>
                  <option value="Nyamisati → Mafia Island">Nyamisati → Mafia Island</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Days</label>
                <select
                  name="days"
                  defaultValue={editingSchedule?.days}
                  className="w-full rounded-lg border p-2 bg-background"
                  required
                >
                  <option value="">Select days</option>
                  <option value="Monday, Wednesday, Friday">Monday, Wednesday, Friday</option>
                  <option value="Tuesday, Thursday, Saturday">Tuesday, Thursday, Saturday</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Weekends">Weekends</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Departure Time</label>
                <select
                  name="departure"
                  defaultValue={editingSchedule?.departure}
                  className="w-full rounded-lg border p-2 bg-background"
                  required
                >
                  <option value="">Select departure time</option>
                  <option value="06:00">06:00 AM</option>
                  <option value="07:00">07:00 AM</option>
                  <option value="08:00">08:00 AM</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Arrival Time</label>
                <select
                  name="arrival"
                  defaultValue={editingSchedule?.arrival}
                  className="w-full rounded-lg border p-2 bg-background"
                  required
                >
                  <option value="">Select arrival time</option>
                  <option value="08:00">08:00 AM</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                  <option value="18:00">06:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <select
                  name="duration"
                  defaultValue={editingSchedule?.duration}
                  className="w-full rounded-lg border p-2 bg-background"
                  required
                >
                  <option value="">Select duration</option>
                  <option value="2 hours">2 hours</option>
                  <option value="2.5 hours">2.5 hours</option>
                  <option value="3 hours">3 hours</option>
                  <option value="3.5 hours">3.5 hours</option>
                  <option value="4 hours">4 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  name="notes"
                  defaultValue={editingSchedule?.notes}
                  placeholder="Add any additional information or special instructions"
                  className="w-full rounded-lg border p-2 h-24 bg-background"
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setEditingSchedule(null)
                  }}
                  className="px-4 py-2 rounded-lg hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduleMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {scheduleMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    'Save Schedule'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 