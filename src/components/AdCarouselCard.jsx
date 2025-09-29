import { useState, useEffect } from "react";

export default function AdCarouselCard({ products }) {
  const [productIndex, setProductIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProductIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [products.length]);

  const product = products[productIndex];

  return (
    <div className="w-full max-w-xl mx-auto bg-gradient-to-br from-yellow-50 via-white/80 to-primary/10 dark:from-black/40 dark:via-background/80 dark:to-primary/10 rounded-3xl flex flex-col items-center justify-center px-6 py-10 shadow-2xl border-0 glassmorphism relative overflow-hidden">
      <h3 className="text-2xl font-extrabold mb-4 text-primary drop-shadow tracking-tight">Matangazo ya Bidhaa</h3>
      <div className="relative w-full flex flex-col items-center">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-56 h-56 object-cover rounded-2xl border-4 border-primary/20 shadow-xl mb-4 bg-background/60 transition-all duration-300"
        />
        <div className="text-2xl font-bold text-foreground mb-1 drop-shadow-lg">{product.name}</div>
        <div className="text-primary text-xl font-extrabold mb-2">{product.price}</div>
        <div className="text-base text-muted-foreground mb-3 italic max-w-xs text-center">{product.description}</div>
        <div className="text-sm font-semibold text-accent mb-4">Wasiliana: <a href={`tel:${product.phone}`} className="underline hover:text-primary">{product.phone}</a></div>
        <div className="flex gap-2 mt-2">
          <button
            aria-label="Previous product"
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary shadow-sm transition-all duration-150"
            onClick={() => setProductIndex((productIndex - 1 + products.length) % products.length)}
          >&#8592;</button>
          <button
            aria-label="Next product"
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary shadow-sm transition-all duration-150"
            onClick={() => setProductIndex((productIndex + 1) % products.length)}
          >&#8594;</button>
        </div>
        <div className="flex gap-1 mt-3 justify-center">
          {products.map((_, idx) => (
            <span
              key={idx}
              className={`inline-block w-3 h-3 rounded-full ${idx === productIndex ? 'bg-primary' : 'bg-primary/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
