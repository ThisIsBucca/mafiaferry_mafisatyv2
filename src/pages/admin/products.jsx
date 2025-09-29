import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";
import { Image } from "lucide-react";

export default function ProductsAdmin() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", image_url: "", description: "", phone: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Save product (insert/update)
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
      resetForm();
      toast.success("Product saved");
    },
    onError: (error) => toast.error(error.message),
  });

  // Delete product
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

  // Helpers
  const resetForm = () => {
    setEditing(null);
    setForm({ name: "", price: "", image_url: "", description: "", phone: "" });
    setImageFile(null);
    setImagePreview("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleEdit = (product) => {
    setEditing(product);
    setForm(product);
    setImagePreview(product.image_url || "");
    setImageFile(null);
  };

  // Upload image to Supabase Storage and return public URL
  const uploadImage = async (file, productName) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${productName}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = form.image_url;

    // Upload if new file selected
    if (imageFile) {
      try {
        toast.loading("Uploading image...", { id: "upload" });
        imageUrl = await uploadImage(imageFile, form.name);
        toast.success("Image uploaded", { id: "upload" });
      } catch (err) {
        toast.error("Image upload failed");
        console.error("Image upload error:", err);
        return;
      }
    }

    if (!imageUrl) {
      toast.error("Image is required");
      return;
    }
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }

    // Check auth
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("You must be logged in to add a product");
      return;
    }

    const productData = { ...form, image_url: imageUrl };
    if (editing?.id) productData.id = editing.id;

    mutation.mutate(productData);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary/80 to-accent/80 bg-clip-text text-transparent drop-shadow-md">
        Manage Products (Ad Carousel)
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        className="mb-8 flex flex-col gap-8 px-6 sm:px-10 py-6 max-w-2xl mx-auto bg-white/80 dark:bg-card/80 backdrop-blur-2xl rounded-2xl shadow-xl border border-primary/10"
      >
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            Name <span className="text-destructive">*</span>
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg border border-primary/20 bg-background/70 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all shadow"
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            Price <span className="text-destructive">*</span>
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg border border-primary/20 bg-background/70 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all shadow"
            placeholder="TZS 25,000"
            value={form.price}
            onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            Image <span className="text-destructive">*</span>
          </div>
          <label className={`block cursor-pointer group ${dragActive ? "ring-2 ring-primary" : ""}`}>
            <div className="flex items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-all duration-200 bg-background/60 group-hover:border-primary/60 group-hover:bg-primary/10 relative overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="text-center pointer-events-none select-none">
                  <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary" />
                  <p className="text-sm text-muted-foreground group-hover:text-primary">Click to upload or drag & drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </label>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-2">Description</label>
          <textarea
            className="w-full px-3 py-2 rounded-lg border border-primary/20 bg-background/70 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all shadow min-h-[80px]"
            placeholder="Product description"
            value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-2">Phone</label>
          <input
            className="w-full px-3 py-2 rounded-lg border border-primary/20 bg-background/70 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all shadow"
            placeholder="Contact phone"
            value={form.phone}
            onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={resetForm}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-primary/20 bg-background/70 hover:bg-muted/60 shadow"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-primary/90 to-accent/80 text-primary-foreground shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            {mutation.isPending ? "Saving..." : editing ? "Update" : "Add"}
          </button>
        </div>
      </form>

      {/* Product List */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading && <p>Loading...</p>}
        {products?.map((product) => (
          <div
            key={product.id}
            className="bg-card/80 backdrop-blur-lg rounded-2xl shadow-xl border border-primary/10 p-6 group flex flex-col"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-40 object-cover rounded-xl border border-primary/10 shadow mb-4"
            />
            <div className="font-bold text-lg mb-1">{product.name}</div>
            <div className="text-primary font-semibold mb-1">{product.price}</div>
            <div className="text-muted-foreground text-sm mb-2">{product.description}</div>
            <div className="text-xs text-accent mb-2">{product.phone}</div>
            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => handleEdit(product)}
                className="px-3 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20"
              >
                Edit
              </button>
              <button
                onClick={() => deleteMutation.mutate(product.id)}
                className="px-3 py-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
