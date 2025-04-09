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

  const defaultArticleQuery = useQuery({
    queryKey: ['default-article'],
    queryFn: async () => {
      // First check if default article exists
      const { data: existingArticle, error: checkError } = await supabase
        .from('articles')
        .select('*')
        .eq('is_default', true)
        .single()
      
      if (checkError && checkError.code !== 'PGRST116') throw checkError

      // If no default article exists, create one
      if (!existingArticle) {
        const defaultArticle = {
          title: 'Welcome to Mafia Island',
          content: `Mafia Island is a hidden gem in the Indian Ocean, located off the coast of Tanzania. Known for its pristine beaches, rich marine life, and laid-back atmosphere, it offers a perfect escape from the hustle and bustle of everyday life.

Key Features:
- Stunning coral reefs perfect for snorkeling and diving
- Abundant marine life including whale sharks and sea turtles
- Beautiful white sand beaches
- Rich cultural heritage and friendly local communities
- Excellent fishing opportunities

Whether you're looking for adventure, relaxation, or a unique cultural experience, Mafia Island has something for everyone. Come discover this tropical paradise!`,
          excerpt: 'Discover the hidden gem of Tanzania - Mafia Island, with its pristine beaches, rich marine life, and unique cultural experiences.',
          category: 'Tourism',
          image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          author: 'Mafia Ferry Team',
          read_time: '5 min read',
          is_default: true,
          slug: 'welcome-to-mafia-island'
        }

        const { data: newArticle, error: insertError } = await supabase
          .from('articles')
          .insert(defaultArticle)
          .select()
          .single()

        if (insertError) throw insertError
        return newArticle
      }

      return existingArticle
    }
  })

  const createArticle = useMutation({
    mutationFn: async (newArticle) => {
      // Generate slug from title if not provided
      if (!newArticle.slug) {
        newArticle.slug = newArticle.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      }

      const { data, error } = await supabase
        .from('articles')
        .insert(newArticle)
        .select()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      queryClient.invalidateQueries({ queryKey: ['default-article'] })
    }
  })

  return {
    articles: articlesQuery.data ?? [],
    defaultArticle: defaultArticleQuery.data,
    isLoading: articlesQuery.isLoading || defaultArticleQuery.isLoading,
    isError: articlesQuery.isError || defaultArticleQuery.isError,
    error: articlesQuery.error || defaultArticleQuery.error,
    createArticle
  }
} 