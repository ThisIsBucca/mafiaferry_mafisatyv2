import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../../lib/supabase"
import { toast } from "react-hot-toast"
import { Plus, Pencil, Trash2, Loader2, Image } from "lucide-react"
import { uploadImage, deleteImage } from "../../lib/storage"
import { useAuth } from "../../contexts/AuthContext"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export function ArticlesAdmin() {
  const [editingArticle, setEditingArticle] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [contentValue, setContentValue] = useState('')
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
          try {
            imageUrl = await uploadImage(imageFile)
            console.log('Returned publicUrl from uploadImage:', imageUrl)
            if (!imageUrl) {
              throw new Error('Image upload failed: No URL returned')
            }
            console.log('Image uploaded, URL to be saved in article:', imageUrl)
          } catch (uploadError) {
            console.error('Image upload error:', uploadError)
            throw new Error('Image upload failed. Please try again.')
          }
        }

        // Ensure required fields
        if (!article.title || !article.content) {
          throw new Error('Title and content are required')
        }

        const articleData = {
          ...article,
          image_url: imageUrl,
          slug: article.slug || article.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
          user_id: session.user.id
        }

        if (article.id) {
          const { data, error } = await supabase
            .from('articles')
            .update([articleData])
            .eq('id', article.id)
            .select()
          
          if (error) {
            console.error('Update error:', error)
            throw error
          }
          return data
        } else {
          // Remove id if present (should not be sent on insert)
          delete articleData.id
          const { data, error } = await supabase
            .from('articles')
            .insert([articleData])
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

  useEffect(() => {
    if (editingArticle) {
      setContentValue(editingArticle.content || '')
    }
  }, [editingArticle])

  // Lock background scroll when modal is open
  useEffect(() => {
    if (editingArticle) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
      setContentValue('')
      setImageFile(null)
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [editingArticle])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const article = {
      title: formData.get('title'),
      content: contentValue,
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

  const handleCloseModal = () => {
    setEditingArticle(null)
    setContentValue('')
    setImageFile(null)
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
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary/80 to-accent/80 bg-clip-text text-transparent drop-shadow-md">
          Manage Articles
        </h1>
        <button
          onClick={() => setEditingArticle({})}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary/90 to-accent/80 text-primary-foreground shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Add Article
        </button>
      </div>

      {/* Modal Overlay */}
      {editingArticle && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
          <div className="relative bg-card/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-primary/20 p-0 sm:p-0 w-full max-w-2xl max-h-[95vh] overflow-y-auto glassmorphism">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-muted-foreground hover:text-primary rounded-full p-1 bg-background/70 shadow"
              aria-label="Close"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" /></svg>
            </button>
            <h2 className="text-xl font-semibold mb-2 pt-8 text-center bg-gradient-to-r from-primary/80 to-accent/80 bg-clip-text text-transparent drop-shadow">
              {editingArticle.id ? 'Edit Article' : 'Add Article'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 px-6 sm:px-10 py-6">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-primary mb-2">Title <span className="text-destructive">*</span></label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  defaultValue={editingArticle?.title || ''}
                  placeholder="Enter article title"
                  className="w-full px-3 py-2 rounded-lg border border-primary/20 bg-background/70 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all text-base shadow"
                />
              </div>
              {/* Image Upload */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Image</div>
                <label className="block cursor-pointer group">
                  <div className="flex items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-all duration-200 bg-background/60 group-hover:border-primary/60 group-hover:bg-primary/10 relative overflow-hidden">
                    <div className="text-center pointer-events-none select-none">
                      <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary" />
                      <p className="text-sm text-muted-foreground group-hover:text-primary">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </label>
                <img
                  id="image-preview"
                  src={(() => { console.log('Preview image src:', editingArticle.image_url); return editingArticle.image_url })()}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-xl border border-primary/10 shadow-lg mt-2 bg-background/60 transition-all duration-200"
                />
              </div>
              {/* Content Field Only - Advanced Layout */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">Content</span>
                  <span className="ml-auto text-xs text-muted-foreground italic">Rich text supported</span>
                </div>
                <div className="relative rounded-2xl border border-primary/30 bg-gradient-to-br from-background/80 via-primary/5 to-accent/10 shadow-xl focus-within:ring-2 focus-within:ring-primary/40 transition-all overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={contentValue}
                    onChange={setContentValue}
                    className="rounded-2xl min-h-[260px] max-h-[420px] focus:outline-none focus:ring-0 text-lg font-sans quill-cool"
                    placeholder="Write your article content here..."
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'align': [] }],
                        ['link', 'image'],
                        ['clean']
                      ]
                    }}
                    formats={[
                      'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
                      'color', 'background', 'list', 'bullet', 'align', 'link', 'image'
                    ]}
                  />
                  <div className="absolute -top-3 left-4 bg-background/90 px-2 text-xs text-primary font-semibold rounded shadow pointer-events-none select-none">Main Content</div>
                  <style>{`
                    .quill-cool .ql-toolbar {
                      background: linear-gradient(90deg, var(--tw-gradient-stops));
                      --tw-gradient-from: #f0f4ff;
                      --tw-gradient-to: #e0e7ff;
                      border-radius: 1rem 1rem 0 0;
                      border: none;
                      box-shadow: 0 2px 8px 0 rgba(80,120,255,0.07);
                      padding: 0.5rem 1rem;
                    }
                    .quill-cool .ql-container {
                      background: transparent;
                      border: none;
                      font-size: 1.08rem;
                      min-height: 200px;
                      border-radius: 0 0 1rem 1rem;
                      padding: 1rem;
                    }
                    .quill-cool .ql-editor {
                      background: transparent;
                      color: #222;
                      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
                      min-height: 200px;
                    }
                    .quill-cool .ql-toolbar button {
                      border-radius: 0.5rem;
                      transition: background 0.2s;
                    }
                    .quill-cool .ql-toolbar button:hover, .quill-cool .ql-toolbar button.ql-active {
                      background: #e0e7ff;
                    }
                  `}</style>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg border border-primary/20 bg-background/70 hover:bg-muted/60 shadow"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addUpdateMutation.isPending}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-primary/90 to-accent/80 text-primary-foreground shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 disabled:opacity-50"
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {articles?.map((article) => {
          console.log('Article image_url:', article.image_url, 'Title:', article.title)
          return (
            <div key={article.id} className="bg-card/80 backdrop-blur-lg rounded-2xl shadow-xl border border-primary/10 p-6 group transition-all duration-200 hover:shadow-2xl hover:border-primary/30 glassmorphism flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-primary/80 to-accent/80 bg-clip-text text-transparent drop-shadow">
                  {article.title}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingArticle(article)}
                    className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary shadow-sm transition-all duration-150"
                    aria-label="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(article.id)}
                    className="p-2 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive shadow-sm transition-all duration-150"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {article.image_url && (
                <img
                  src={(() => { console.log('Article card image src:', article.image_url); return article.image_url })()}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-xl border border-primary/10 shadow mb-4"
                />
              )}
              <p className="text-sm text-muted-foreground whitespace-pre-line mb-2 flex-1">
                {article.content}
              </p>
              {article.is_default && (
                <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-primary/20 to-accent/20 text-primary rounded-full shadow">
                  Default Article
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}