import { supabase } from './supabase'

export async function uploadImage(file, folder = 'articles') {
  try {
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError) throw authError
    if (!session) throw new Error('No active session')

    // Generate a unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload the file
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Storage upload error:', error)
      throw error
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export async function deleteImage(url) {
  try {
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError) throw authError
    if (!session) throw new Error('No active session')

    // Extract the file path from the URL
    const filePath = url.split('/').pop()
    
    const { error } = await supabase.storage
      .from('images')
      .remove([filePath])

    if (error) {
      console.error('Storage delete error:', error)
      throw error
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
} 