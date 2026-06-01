'use client'

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import { toast } from "react-hot-toast";
import { Image } from "lucide-react";

export default function ProductsAdmin() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", image_url: "", description: "", phone: "" });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newProduct) => {
      const { data, error } = await supabase.from("products").insert(newProduct).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["products"] }); toast.success("Product created"); setEditing(null); setForm({ name: "", price: "", image_url: "", description: "", phone: "" }); },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase.from("products").update(updates).eq("id", id).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["products"] }); toast.success("Product updated"); setEditing(null); setForm({ name: "", price: "", image_url: "", description: "", phone: "" }); },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["products"] }); toast.success("Product deleted"); },
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing.id, ...form });
    } else {
      createMutation.mutate(form);
    }
  };

  const startEdit = (product) => {
    setEditing(product);
    setForm({ name: product.name, price: product.price?.toString() || "", image_url: product.image_url || "", description: product.description || "", phone: product.phone || "" });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex items-center justify-between mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">Products</h1>
        <button onClick={() => { setEditing(null); setForm({ name: "", price: "", image_url: "", description: "", phone: "" }); }} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm sm:text-base">
          Add Product
        </button>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => (
          <div key={product.id} className="bg-card rounded-lg shadow p-4 sm:p-6">
            {product.image_url && (
              <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
            )}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                {product.price && <p className="text-lg font-bold text-primary">${product.price}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(product)} className="p-1.5 rounded-md hover:bg-accent">Edit</button>
                <button onClick={() => deleteMutation.mutate(product.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive">Delete</button>
              </div>
            </div>
            {product.description && <p className="text-sm text-muted-foreground mt-2">{product.description}</p>}
            {product.phone && <p className="text-sm text-primary mt-1">{product.phone}</p>}
          </div>
        ))}
      </div>

      {(editing || false) && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">{editing ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-background" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50">
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={() => { setEditing(null); setForm({ name: "", price: "", image_url: "", description: "", phone: "" }); }} className="px-4 py-2 border rounded-lg hover:bg-accent">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
