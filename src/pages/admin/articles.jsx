import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../../lib/supabase"
import { toast } from "react-hot-toast"
import { Plus, Pencil, Trash2, Loader2, Image } from "lucide-react"
import { uploadImage, deleteImage } from "../../lib/storage"
import { useAuth } from "../../contexts/AuthContext"

export function ArticlesAdmin() {
  const [editingArticle, setEditingArticle] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const queryClient = useQueryClient()
  const { user } = useAuth()

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log('Current session:', session)
      console.log('Auth error:', error)
    }
    checkAuth()
  }, [])

  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Articles query error:', error)
        throw error
      }
      return data
    }
  })

  // Check for default article on component mount
  useEffect(() => {
    const checkDefaultArticle = async () => {
      const { data: defaultArticle, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_default', true)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking for default article:', error)
        return
      }

      if (!defaultArticle) {
        // Create default article if none exists
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

        // Invalidate the query to refresh the articles list
        queryClient.invalidateQueries({ queryKey: ['articles'] })
      }
    }

    checkDefaultArticle()
  }, [queryClient])

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      toast.success('Article deleted successfully', {
        position: 'top-center',
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      })
    },
    onError: (error) => {
      toast.error('Failed to delete article', {
        position: 'top-center',
        duration: 3000,
        style: {
          background: '#ef4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      })
      console.error('Delete error:', error)
    }
  })

  const addUpdateMutation = useMutation({
    mutationFn: async (article) => {
      try {
        // Check authentication status
        const { data: { session }, error: authError } = await supabase.auth.getSession()
        if (authError) throw authError
        if (!session) throw new Error('No active session')

        console.log('Current user:', session.user)
        console.log('Article data:', article)

        let imageUrl = article.image_url

        // Upload new image if provided
        if (imageFile) {
          // Delete old image if exists
          if (article.image_url) {
            try {
              await deleteImage(article.image_url)
            } catch (error) {
              console.error('Error deleting old image:', error)
            }
          }

          // Upload new image
          imageUrl = await uploadImage(imageFile)
        }

        const articleData = {
          ...article,
          image_url: imageUrl,
          // Ensure slug is generated if not provided
          slug: article.slug || article.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
          // Add user_id to track ownership
          user_id: session.user.id
        }

        console.log('Saving article with data:', articleData)

        if (article.id) {
          const { data, error } = await supabase
            .from('articles')
            .update(articleData)
            .eq('id', article.id)
            .select()
          
          if (error) {
            console.error('Update error:', error)
            throw error
          }
          return data
        } else {
          const { data, error } = await supabase
            .from('articles')
            .insert(articleData)
            .select()
          
          if (error) {
            console.error('Insert error:', error)
            throw error
          }
          return data
        }
      } catch (error) {
        console.error('Mutation error:', error)
        throw error
      }
    },
    onSuccess: (data) => {
      console.log('Article saved successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      setEditingArticle(null)
      setImageFile(null)
      toast.success('Article saved successfully!', {
        position: 'top-center',
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      })
    },
    onError: (error) => {
      console.error('Save error details:', error)
      toast.error(`Failed to save article: ${error.message}`, {
        position: 'top-center',
        duration: 5000,
        style: {
          background: '#ef4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      })
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const article = {
      title: formData.get('title'),
      content: formData.get('content'),
      excerpt: formData.get('excerpt'),
      category: formData.get('category'),
      author: formData.get('author'),
      read_time: formData.get('read_time'),
      image_url: editingArticle?.image_url,
      is_default: formData.get('is_default') === 'on',
      // Generate slug from title
      slug: formData.get('title')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    if (editingArticle) {
      article.id = editingArticle.id
    }

    addUpdateMutation.mutate(article)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      // Preview the image
      const reader = new FileReader()
      reader.onloadend = () => {
        const preview = document.getElementById('image-preview')
        if (preview) {
          preview.src = reader.result
          preview.classList.remove('hidden')
        }
      }
      reader.readAsDataURL(file)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">Manage Articles</h1>
        <button
          onClick={() => setEditingArticle({})}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Add Article
        </button>
      </div>

      {editingArticle && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8">
          <div className="bg-card rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              {editingArticle.id ? 'Edit Article' : 'Add Article'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingArticle.title}
                  className="w-full px-3 py-2 rounded-md border bg-background"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  name="content"
                  defaultValue={editingArticle.content}
                  className="w-full px-3 py-2 rounded-md border bg-background"
                  rows={6}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1">
                    <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                      <div className="text-center">
                        <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                  </label>
                  <img
                    id="image-preview"
                    src={editingArticle.image_url}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg hidden"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_default"
                  id="is_default"
                  defaultChecked={editingArticle.is_default}
                  className="rounded border-gray-300"
                />
                <label htmlFor="is_default" className="text-sm">
                  Set as default article
                </label>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg border hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addUpdateMutation.isPending}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {addUpdateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {articles?.map((article) => (
          <div key={article.id} className="bg-card rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold">{article.title}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingArticle(article)}
                  className="p-1 hover:text-primary"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteMutation.mutate(article.id)}
                  className="p-1 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {article.content}
            </p>
            {article.is_default && (
              <span className="inline-block mt-2 px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                Default Article
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 