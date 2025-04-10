import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useArticles() {
  const queryClient = useQueryClient()

  // Verify table structure
  const verifyTable = async () => {
    console.log('Verifying articles table...')
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, content, slug, created_at, read_time, image_url, category, author')
      .limit(1)
    
    if (error) {
      console.error('Error verifying articles table:', error)
      throw error
    }
    
    console.log('Articles table verified:', data)
    return data
  }

  const articlesQuery = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      console.log('=== Fetching Articles ===')
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching articles:', error)
        throw error
      }
      
      console.log('Fetched articles:', data?.map(a => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        created_at: a.created_at,
        content: a.content?.substring(0, 50) + '...'
      })))
      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  })

  const defaultArticleQuery = useQuery({
    queryKey: ['default-article'],
    queryFn: async () => {
      console.log('Fetching default article...')
      const { data: existingArticle, error: checkError } = await supabase
        .from('articles')
        .select('*')
        .eq('is_default', true)
        .single()
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error fetching default article:', checkError)
        throw checkError
      }
      
      console.log('Fetched default article:', existingArticle)
      return existingArticle
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  const createDefaultArticle = useMutation({
    mutationFn: async () => {
      // Check authentication
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      if (authError) throw authError
      if (!session) throw new Error('No active session')

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
        slug: 'welcome-to-mafia-island',
        user_id: session.user.id
      }

      const { data: newArticle, error: insertError } = await supabase
        .from('articles')
        .insert(defaultArticle)
        .select()
        .single()

      if (insertError) throw insertError
      return newArticle
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      queryClient.invalidateQueries({ queryKey: ['default-article'] })
    }
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
    defaultArticle: defaultArticleQuery.data,
    isLoading: articlesQuery.isLoading || defaultArticleQuery.isLoading,
    isError: articlesQuery.isError || defaultArticleQuery.isError,
    error: articlesQuery.error || defaultArticleQuery.error,
    createArticle,
    createDefaultArticle,
    updateArticle
  }
} 