import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useArticles() {
  const queryClient = useQueryClient()

  const articlesQuery = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  const createArticle = useMutation({
    mutationFn: async (newArticle) => {
      const { data, error } = await supabase
        .from('articles')
        .insert(newArticle)
        .select()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    }
  })

  return {
    articles: articlesQuery.data ?? [],
    isLoading: articlesQuery.isLoading,
    isError: articlesQuery.isError,
    error: articlesQuery.error,
    createArticle
  }
} 