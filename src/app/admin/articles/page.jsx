'use client'

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../../../lib/supabase"
import { toast } from "react-hot-toast"
import { Plus, Pencil, Trash2, Loader2, Image, Bold, Italic, Underline, Strikethrough, List, ListOrdered, Quote, Link as LinkIcon, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, RemoveFormatting } from "lucide-react"
import { uploadImage, deleteImage } from "../../../lib/storage"
import { useAuth } from "../../../contexts/AuthContext"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExt from '@tiptap/extension-underline'
import LinkExt from '@tiptap/extension-link'
import ImageExt from '@tiptap/extension-image'
import TextAlignExt from '@tiptap/extension-text-align'
import { TextStyle as TextStyleExt } from '@tiptap/extension-text-style'
import ColorExt from '@tiptap/extension-color'
import HighlightExt from '@tiptap/extension-highlight'
import PlaceholderExt from '@tiptap/extension-placeholder'

function ToolbarButton({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-md transition-colors ${active ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10 text-muted-foreground'}`}
    >
      {children}
    </button>
  )
}

export default function ArticlesAdmin() {
  const [editingArticle, setEditingArticle] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [contentValue, setContentValue] = useState('')
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      UnderlineExt,
      LinkExt.configure({ openOnClick: false }),
      ImageExt,
      TextAlignExt.configure({ types: ['heading', 'paragraph'] }),
      TextStyleExt,
      ColorExt,
      HighlightExt.configure({ multicolor: true }),
      PlaceholderExt.configure({ placeholder: 'Write your article content here...' }),
    ],
    content: contentValue,
    onUpdate: ({ editor }) => {
      setContentValue(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editingArticle && editor) {
      setContentValue(editingArticle.content || '')
      editor.commands.setContent(editingArticle.content || '')
    }
  }, [editingArticle, editor])

  const { data: articles, isLoading } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) throw error
      return data
    },
  })

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    category: "News",
    image_url: "",
    author: "",
    read_time: "",
    published: false,
  })

  useEffect(() => {
    if (editingArticle) {
      setForm({
        title: editingArticle.title || "",
        slug: editingArticle.slug || "",
        excerpt: editingArticle.excerpt || "",
        category: editingArticle.category || "News",
        image_url: editingArticle.image_url || "",
        author: editingArticle.author || "",
        read_time: editingArticle.read_time || "",
        published: editingArticle.published ?? false,
      })
    }
  }, [editingArticle])

  const createMutation = useMutation({
    mutationFn: async (newArticle) => {
      const { data, error } = await supabase.from("articles").insert(newArticle).select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] })
      toast.success("Article created successfully")
      setEditingArticle(null)
      resetForm()
    },
    onError: (error) => toast.error(error.message),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase.from("articles").update(updates).eq("id", id).select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] })
      toast.success("Article updated successfully")
      setEditingArticle(null)
      resetForm()
    },
    onError: (error) => toast.error(error.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("articles").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] })
      toast.success("Article deleted successfully")
    },
    onError: (error) => toast.error(error.message),
  })

  const resetForm = () => {
    setForm({
      title: "", slug: "", excerpt: "", category: "News",
      image_url: "", author: "", read_time: "", published: false,
    })
    setContentValue('')
    setImageFile(null)
    if (editor) {
      editor.commands.setContent('')
    }
  }

  const handleImageUpload = async () => {
    if (!imageFile) return
    try {
      const url = await uploadImage(imageFile)
      setForm({ ...form, image_url: url })
      toast.success("Image uploaded")
    } catch (error) {
      toast.error("Image upload failed")
    }
  }

  useEffect(() => {
    if (imageFile) handleImageUpload()
  }, [imageFile])

  const removeImage = async () => {
    if (form.image_url) {
      try { await deleteImage(form.image_url) } catch {}
    }
    setForm({ ...form, image_url: "" })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let slug = form.slug
    if (!slug) {
      slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }

    const payload = {
      ...form,
      slug,
      content: contentValue,
      author: form.author || user?.email || 'Admin',
      user_id: user?.id,
    }

    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, ...payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const Toolbar = () => (
    <div className="flex flex-wrap gap-0.5 p-2 border-b bg-muted/30">
      <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} active={editor?.isActive('heading', { level: 1 })} title="Heading 1"><Heading1 className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 className="h-4 w-4" /></ToolbarButton>
      <span className="w-px h-6 bg-border mx-1 self-center" />
      <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')} title="Bold"><Bold className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')} title="Italic"><Italic className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive('underline')} title="Underline"><Underline className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().toggleStrike().run()} active={editor?.isActive('strike')} title="Strikethrough"><Strikethrough className="h-4 w-4" /></ToolbarButton>
      <span className="w-px h-6 bg-border mx-1 self-center" />
      <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')} title="Bullet List"><List className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')} title="Ordered List"><ListOrdered className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')} title="Quote"><Quote className="h-4 w-4" /></ToolbarButton>
      <span className="w-px h-6 bg-border mx-1 self-center" />
      <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('left').run()} active={editor?.isActive({ textAlign: 'left' })} title="Align Left"><AlignLeft className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('center').run()} active={editor?.isActive({ textAlign: 'center' })} title="Center"><AlignCenter className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('right').run()} active={editor?.isActive({ textAlign: 'right' })} title="Align Right"><AlignRight className="h-4 w-4" /></ToolbarButton>
      <span className="w-px h-6 bg-border mx-1 self-center" />
      <ToolbarButton onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear Formatting"><RemoveFormatting className="h-4 w-4" /></ToolbarButton>
      <div className="relative inline-flex items-center">
        <ToolbarButton title="Text Color">
          <input type="color" onInput={(e) => editor?.chain().focus().setColor(e.target.value).run()} value={editor?.getAttributes('textStyle').color || '#000000'} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
          <span className="text-xs font-bold" style={{ color: editor?.getAttributes('textStyle').color || 'currentColor' }}>A</span>
        </ToolbarButton>
      </div>
      <ToolbarButton onClick={() => {
        const url = window.prompt('Enter image URL:')
        if (url) editor?.chain().focus().setImage({ src: url }).run()
      }} title="Insert Image"><Image className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton onClick={() => {
        const url = window.prompt('Enter URL:')
        if (url) editor?.chain().focus().setLink({ href: url }).run()
      }} active={editor?.isActive('link')} title="Link"><LinkIcon className="h-4 w-4" /></ToolbarButton>
    </div>
  )

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex items-center justify-between mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">Articles</h1>
        <button
          onClick={() => { setEditingArticle(null); resetForm() }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
        >
          <Plus className="h-4 w-4" />
          Add Article
        </button>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles?.map((article) => (
          <div key={article.id} className="bg-card rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base truncate">{article.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{article.category}</p>
              </div>
              <div className="flex gap-1 ml-2 shrink-0">
                <button onClick={() => setEditingArticle(article)} className="p-1.5 rounded-md hover:bg-accent transition-colors">
                  <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                <button onClick={() => deleteMutation.mutate(article.id)} className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-destructive">
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
            {article.image_url && (
              <img src={article.image_url} alt={article.title} className="w-full h-32 object-cover rounded-lg mb-3" />
            )}
            <p className="text-xs text-muted-foreground">
              {article.published ? 'Published' : 'Draft'} | {new Date(article.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {(editingArticle || false) && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">{editingArticle ? "Edit Article" : "Add Article"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background" placeholder="Auto-generated if empty" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Excerpt</label>
                <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background" rows={2} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Author</label>
                  <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Read Time</label>
                  <input type="text" value={form.read_time} onChange={(e) => setForm({ ...form, read_time: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background" placeholder="e.g. 5 min read" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Featured Image</label>
                <div className="flex gap-2 items-center">
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-sm" />
                  <input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Or paste URL..." className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm" />
                  {form.image_url && (
                    <button type="button" onClick={removeImage} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {form.image_url && (
                  <img src={form.image_url} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-2" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <div className="border rounded-lg overflow-hidden">
                  <Toolbar />
                  <EditorContent editor={editor} className="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none" />
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-gray-300" />
                <span className="text-sm font-medium">Published</span>
              </label>

              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50">
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={() => { setEditingArticle(null); resetForm() }} className="px-4 py-2 border rounded-lg hover:bg-accent">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
