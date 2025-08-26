import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";

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

  const mutation = useMutation({
    mutationFn: async (product) => {
      if (product.id) {
        const { error } = await supabase.from("products").update(product).eq("id", product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert([product]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditing(null);
      setForm({ name: "", price: "", image_url: "", description: "", phone: "" });
      toast.success("Product saved");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ ...form, id: editing?.id });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Manage Products (Ad Carousel)</h1>
      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/80 p-6 rounded-xl shadow">
        <input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        <input className="border p-2 rounded" placeholder="Price" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
        <input className="border p-2 rounded" placeholder="Image URL" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} required />
        <input className="border p-2 rounded" placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        <textarea className="border p-2 rounded col-span-1 md:col-span-2" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        <div className="col-span-1 md:col-span-2 flex gap-2 mt-2">
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded">{editing ? "Update" : "Add"}</button>
          {editing && <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setEditing(null); setForm({ name: "", price: "", image_url: "", description: "", phone: "" }); }}>Cancel</button>}
        </div>
      </form>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? <div>Loading...</div> : products?.map(product => (
          <div key={product.id} className="bg-white/90 rounded-xl shadow p-4 flex flex-col items-center">
            <img src={product.image_url} alt={product.name} className="w-32 h-32 object-cover rounded mb-2" />
            <div className="font-bold text-lg">{product.name}</div>
            <div className="text-primary font-semibold">{product.price}</div>
            <div className="text-sm text-muted-foreground mb-1">{product.description}</div>
            <div className="text-xs text-accent mb-2">{product.phone}</div>
            <div className="flex gap-2 mt-2">
              <button className="bg-primary/10 text-primary px-3 py-1 rounded" onClick={() => { setEditing(product); setForm(product); }}>Edit</button>
              <button className="bg-destructive/10 text-destructive px-3 py-1 rounded" onClick={() => deleteMutation.mutate(product.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
