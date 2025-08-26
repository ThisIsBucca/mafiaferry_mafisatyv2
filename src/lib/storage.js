import { FileType } from 'lucide-react'
import { supabase } from './supabase'

export async function uploadImage(file) {
  try {
    // Debug: log file object and type
    console.log('uploadImage received file:', file)
    if (!(file instanceof File)) {
      console.error('uploadImage: Not a File object:', file)
      throw new Error('Invalid file: Please select an image file from your device.')
    }
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError) throw authError
    if (!session) throw new Error('No active session')

    // Generate a unique filename
    const fileExt = file.name.split('.').pop().toLowerCase()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = fileName // Save directly to root of 'images' bucket

    // Set correct content-type for common image types
    let contentType = file.type
    if (!contentType || contentType === 'application/json') {
      if (fileExt === 'jpg' || fileExt === 'jpeg') contentType = 'image/jpeg'
      else if (fileExt === 'png') contentType = 'image/png'
      else if (fileExt === 'gif') contentType = 'image/gif'
      else if (fileExt === 'webp') contentType = 'image/webp'
      else {
        console.warn('File is not a supported image type:', file.name)
        throw new Error('Only image files (jpg, jpeg, png, gif, webp) are allowed.')
      }
    }
    if (!contentType.startsWith('image/')) {
      console.warn('Attempted to upload non-image file:', file.name, contentType)
      throw new Error('Only image files are allowed.')
    }

    // Upload the file
    const { data, error } = await supabase.storage
      .from('article-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: contentType
      })

    if (error) {
      console.error('Storage upload error:', error)
      throw error
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('article-images')
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
      .from('article-images')
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