import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../../lib/supabase"
import { Plus, Pencil, Trash, Loader2, Image } from "lucide-react"
import toast from "react-hot-toast"

export function ArticlesAdmin() {
  const [isEditing, setIsEditing] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const queryClient = useQueryClient()

  // Fetch articles
  const { data: articles, isLoading } = useQuery({
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

  // Delete article mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['articles'])
      toast.success('Article deleted successfully')
    }
  })

  // Add/Update article mutation
  const articleMutation = useMutation({
    mutationFn: async ({ formData, imageFile }) => {
      let imageUrl = null

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError, data } = await supabase.storage
          .from('articles')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError
        imageUrl = data.path
      }

      if (formData.id) {
        // Update existing article
        const { error } = await supabase
          .from('articles')
          .update({
            title: formData.title,
            content: formData.content,
            excerpt: formData.excerpt,
            category: formData.category,
            image_url: imageUrl || formData.image_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', formData.id)

        if (error) throw error
      } else {
        // Insert new article
        const { error } = await supabase
          .from('articles')
          .insert([{
            title: formData.title,
            content: formData.content,
            excerpt: formData.excerpt,
            category: formData.category,
            image_url: imageUrl,
            author: formData.author,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])

        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['articles'])
      setIsEditing(false)
      setEditingArticle(null)
      toast.success(editingArticle ? 'Article updated successfully' : 'Article added successfully')
    }
  })

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Manage Articles</h1>
        <button
          onClick={() => {
            setEditingArticle(null)
            setIsEditing(true)
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Article
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6">
          {articles?.map((article) => (
            <div key={article.id} className="rounded-xl border bg-card p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {article.image_url && (
                  <div className="w-full sm:w-24 h-40 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/articles/${article.image_url}`}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-lg">{article.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {article.category}
                    </span>
                    <span>By {article.author}</span>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center gap-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => {
                      setEditingArticle(article)
                      setIsEditing(true)
                    }}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Edit article"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this article?')) {
                        deleteMutation.mutate(article.id)
                      }
                    }}
                    className="p-2 hover:bg-muted rounded-lg text-red-500 transition-colors"
                    title="Delete article"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="fixed inset-y-0 right-0 w-full sm:max-w-md md:max-w-lg border-l bg-background p-4 sm:p-6 overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">
              {editingArticle ? 'Edit Article' : 'Add New Article'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              const imageFile = formData.get('image')
              const data = {
                title: formData.get('title'),
                content: formData.get('content'),
                excerpt: formData.get('excerpt'),
                category: formData.get('category'),
                author: formData.get('author')
              }
              
              if (editingArticle) {
                data.id = editingArticle.id
                data.image_url = editingArticle.image_url
              }
              
              articleMutation.mutate({ formData: data, imageFile })
            }} 
            className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingArticle?.title}
                  className="w-full rounded-lg border p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Excerpt</label>
                <textarea
                  name="excerpt"
                  defaultValue={editingArticle?.excerpt}
                  className="w-full rounded-lg border p-2 h-20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  name="content"
                  defaultValue={editingArticle?.content}
                  className="w-full rounded-lg border p-2 h-32"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  defaultValue={editingArticle?.category}
                  className="w-full rounded-lg border p-2"
                  required
                >
                  <option value="">Select category</option>
                  <option value="transport">Transport</option>
                  <option value="tourism">Tourism</option>
                  <option value="events">Events</option>
                  <option value="news">News</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <input
                  type="text"
                  name="author"
                  defaultValue={editingArticle?.author}
                  className="w-full rounded-lg border p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full rounded-lg border p-2"
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setEditingArticle(null)
                  }}
                  className="px-4 py-2 rounded-lg hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={articleMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {articleMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    'Save Article'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 