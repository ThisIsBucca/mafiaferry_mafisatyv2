import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, publicSupabase } from '../lib/supabase'

export function useArticles() {
  const queryClient = useQueryClient()

  const articlesQuery = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await publicSupabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  const createArticle = useMutation({
    mutationFn: async (newArticle) => {
      console.log('=== Creating Article ===')
      console.log('New article data:', newArticle)
      
      // Check authentication
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      if (authError) throw authError
      if (!session) throw new Error('No active session')

      // Generate unique slug from title
      const baseSlug = newArticle.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      
      // Add timestamp to ensure uniqueness
      const timestamp = Date.now()
      const uniqueSlug = `${baseSlug}-${timestamp}`

      console.log('Generated slug:', {
        baseSlug,
        timestamp,
        uniqueSlug
      })

      const articleData = {
        title: newArticle.title,
        content: newArticle.content,
        slug: uniqueSlug,
        user_id: session.user.id,
        // Optional fields with defaults
        excerpt: newArticle.excerpt || '',
        category: newArticle.category || 'General',
        image_url: newArticle.image_url || '',
        author: newArticle.author || 'Mafia Ferry Team',
        read_time: newArticle.read_time || '5 min read',
        is_default: newArticle.is_default || false,
        // Timestamps will be handled by the database defaults
      }

      console.log('Article data to insert:', articleData)

      const { data, error } = await supabase
        .from('articles')
        .insert(articleData)
        .select()
      
      if (error) {
        console.error('Error creating article:', error)
        throw error
      }
      
      console.log('Created article:', data[0])
      return data
    },
    onSuccess: () => {
      console.log('Article created successfully, invalidating queries')
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    }
  })

  const updateArticle = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      console.log('=== Updating Article ===')
      console.log('Article ID:', id)
      console.log('Updates:', updates)
      
      // Check authentication
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      if (authError) throw authError
      if (!session) throw new Error('No active session')

      // Get current article to preserve slug if not being updated
      const { data: currentArticle, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      const articleData = {
        ...updates,
        // Only update slug if explicitly provided
        slug: updates.slug || currentArticle.slug,
        // Ensure required fields are present
        title: updates.title || currentArticle.title,
        content: updates.content || currentArticle.content,
        // Preserve user_id
        user_id: currentArticle.user_id,
        // Update timestamp
        updated_at: new Date().toISOString()
      }

      console.log('Article data to update:', articleData)

      const { data, error } = await supabase
        .from('articles')
        .update(articleData)
        .eq('id', id)
        .select()
      
      if (error) {
        console.error('Error updating article:', error)
        throw error
      }
      
      console.log('Updated article:', data[0])
      return data
    },
    onSuccess: () => {
      console.log('Article updated successfully, invalidating queries')
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    }
  })

  return {
    articles: articlesQuery.data ?? [],
    isLoading: articlesQuery.isLoading,
    isError: articlesQuery.isError,
    error: articlesQuery.error,
    createArticle,
    updateArticle
  }
}