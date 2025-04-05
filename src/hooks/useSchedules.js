import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useSchedules() {
  const queryClient = useQueryClient()

  const schedulesQuery = useQuery({
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

  const createSchedule = useMutation({
    mutationFn: async (newSchedule) => {
      const { data, error } = await supabase
        .from('schedules')
        .insert(newSchedule)
        .select()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
    }
  })

  return {
    schedules: schedulesQuery.data ?? [],
    isLoading: schedulesQuery.isLoading,
    isError: schedulesQuery.isError,
    error: schedulesQuery.error,
    createSchedule
  }
} 