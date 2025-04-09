import { supabase } from './supabase'

export async function initializeDatabase() {
  try {
    // Create articles table
    const { error: articlesError } = await supabase.rpc('create_articles_table')
    if (articlesError) {
      console.error('Error creating articles table:', articlesError)
      return
    }

    // Check if default article exists
    const { data: existingArticle, error: checkError } = await supabase
      .from('articles')
      .select('id')
      .eq('is_default', true)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for default article:', checkError)
      return
    }

    // If no default article exists, create one
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
            is_default: true
          }
        ])

      if (insertError) {
        console.error('Error creating default article:', insertError)
        return
      }
    }

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
  }
} 