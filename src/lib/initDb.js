import { supabase, publicSupabase } from './supabase'

export async function initializeDatabase() {
  try {
    // First check if the articles table exists using a public query
    const { error: checkError } = await publicSupabase
      .from('articles')
      .select('count')
      .limit(0)

    // If the table exists and is accessible, we don't need to initialize
    if (!checkError) {
      console.log('Articles table already exists and is accessible')
      return
    }

    // If we need to create the table, we need an authenticated session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      console.warn('No authenticated session for database initialization')
      return
    }

    // Create articles table if needed
    const { error: articlesError } = await supabase.rpc('create_articles_table')
    if (articlesError) {
      if (articlesError.message?.includes('already exists')) {
        console.log('Articles table already exists')
      } else {
        console.error('Error creating articles table:', articlesError)
        return
      }
    }

    // Check for default article using public client
    const { data: existingArticle, error: defaultCheckError } = await publicSupabase
      .from('articles')
      .select('id')
      .eq('is_default', true)
      .single()

    if (defaultCheckError && defaultCheckError.code !== 'PGRST116') {
      console.error('Error checking for default article:', defaultCheckError)
      return
    }

    // Create default article if needed
    if (!existingArticle) {
      const { error: insertError } = await supabase
        .from('articles')
        .insert([
          {
            title: 'Welcome to Mafia Island',
            content: `Mafia Island is a hidden gem in the Indian Ocean, located off the coast of Tanzania. Known for its pristine beaches, rich marine life, and laid-back atmosphere, it offers a perfect escape from the hustle and bustle of everyday life.

Key Features:
- Stunning coral reefs perfect for snorkeling and diving
- Abundant marine life including whale sharks and sea turtles
- Beautiful white sand beaches
- Rich cultural heritage and friendly local communities
- Excellent fishing opportunities

Whether you're looking for adventure, relaxation, or a unique cultural experience, Mafia Island has something for everyone. Come discover this tropical paradise!`,
            image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            is_default: true,
            user_id: session.user.id,
            slug: 'welcome-to-mafia-island',
            category: 'Tourism',
            author: 'Mafia Ferry Team',
            read_time: '5 min read',
            excerpt: 'Discover the hidden gem of Tanzania - Mafia Island',
          }
        ])

      if (insertError) {
        console.error('Error creating default article:', insertError)
        return
      }
    }

    console.log('Database initialization completed successfully')
  } catch (error) {
    console.error('Unexpected error during database initialization:', error)
  }
}