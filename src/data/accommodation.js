const wa = (msg) =>
  `https://wa.me/255688883219?text=${encodeURIComponent(msg)}`;

export const accommodationList = [
  {
    name: "Afro Beach Bungalows",
    tier: "budget",
    description:
      "Simple yet charming beachfront bungalows with direct access to powdery white sands. Perfect for backpackers and solo travelers looking for an authentic island stay without breaking the bank.",
    priceRange: "$",
    images: ["/images/afro-beach-1.jpg", "/images/afro-beach-2.jpg", "/images/afro-beach-3.jpg"],
    location: "Kilindoni",
    highlights: ["Beachfront access", "Basic amenities", "Authentic vibe"],
    waMessage: wa("Hi! I'm interested in booking Afro Beach Bungalows."),
  },
  {
    name: "Juani Beach Bungalows",
    tier: "budget",
    description:
      "Laid-back bungalows set on the pristine shores of Juani Island. A peaceful retreat for nature lovers seeking solitude and untouched beaches.",
    priceRange: "$",
    images: ["/images/juani-bungalow-1.jpg", "/images/juani-bungalow-2.jpg", "/images/juani-bungalow-3.jpg"],
    location: "Juani Island",
    highlights: ["Secluded beach", "Nature escape", "Snorkeling nearby"],
    waMessage: wa("Hi! I'm interested in booking Juani Beach Bungalows."),
  },
  {
    name: "Maweni Bungalows",
    tier: "budget",
    description:
      "Cozy budget-friendly bungalows nestled along the coast. Enjoy stunning sunsets and a relaxed atmosphere just steps from the ocean.",
    priceRange: "$",
    images: ["/images/maweni-1.jpg", "/images/maweni-2.jpg"],
    location: "Kilindoni",
    highlights: ["Sunset views", "Ocean steps away", "Affordable rates"],
    waMessage: wa("Hi! I'm interested in booking Maweni Bungalows."),
  },
  {
    name: "Maisarah Beach Lodge",
    tier: "mid-range",
    description:
      "A comfortable beachfront lodge offering well-appointed rooms and warm hospitality. Ideal for couples and families who want a relaxing mid-range escape.",
    priceRange: "$$",
    images: ["/images/maisalah22.jpg"],
    location: "Kilindoni",
    highlights: ["Beachfront dining", "Spacious rooms", "Family friendly"],
    waMessage: wa("Hi! I'm interested in booking Maisarah Beach Lodge."),
  },
  {
    name: "Butiama Bustani",
    tier: "mid-range",
    description:
      "A boutique garden lodge blending Swahili charm with modern comfort. Set amid lush tropical gardens with easy access to the marine park.",
    priceRange: "$$",
    images: ["/images/butiama-1.jpg", "/images/butiama-2.jpg", "/images/butiama-4.png"],
    location: "Kilindoni",
    highlights: ["Garden setting", "Swahili architecture", "Marine park access"],
    waMessage: wa("Hi! I'm interested in booking Butiama Bustani."),
  },
  {
    name: "Mafia Dream Lodge",
    tier: "mid-range",
    description:
      "Stylish beachside lodge with a relaxed atmosphere and personalized service. A favorite among travelers seeking value and comfort in paradise.",
    priceRange: "$$",
    images: ["/images/mafia-dream-1.jpg"],
    location: "Kilindoni",
    highlights: ["Beachside location", "Personalized service", "Great value"],
    waMessage: wa("Hi! I'm interested in booking Mafia Dream Lodge."),
  },
  {
    name: "Kivulini Lodge",
    tier: "mid-range",
    description:
      "A hidden gem tucked away along the coast, offering peaceful surroundings and genuine island hospitality. Perfect for unwinding after a day of adventure.",
    priceRange: "$$",
    images: ["/images/kivulini-1.jpg", "/images/kivulini-2.jpg"],
    location: "Utende",
    highlights: ["Quiet & peaceful", "Coastal views", "Island hospitality"],
    waMessage: wa("Hi! I'm interested in booking Kivulini Lodge."),
  },
  {
    name: "Kileleni Lodge",
    tier: "mid-range",
    description:
      "Hilltop lodge offering breathtaking panoramic views of the ocean and surrounding islands. A serene retreat with a touch of adventure.",
    priceRange: "$$",
    images: ["/images/kileleni-lodge-1.jpg", "/images/kileleni-lodge-2.jpg", "/images/kileleni-lodge-3.jpg"],
    location: "Kilindoni",
    highlights: ["Panoramic views", "Hilltop location", "Sunset decks"],
    waMessage: wa("Hi! I'm interested in booking Kileleni Lodge."),
  },
  {
    name: "Basecamp Mafia Lodge",
    tier: "luxury",
    description:
      "An upscale eco-lodge set on a private beach, combining contemporary design with sustainable practices. Experience premium comfort surrounded by pristine nature.",
    priceRange: "$$$",
    images: ["/images/basecamp-2.png", "/images/basecamp-1.png"],
    location: "Utende",
    highlights: ["Private beach", "Eco-luxury", "Premium dining"],
    waMessage: wa("Hi! I'm interested in booking Basecamp Mafia Lodge."),
  },
  {
    name: "Polepole Lodge",
    tier: "luxury",
    description:
      "An exclusive beachfront boutique lodge meaning 'slowly slowly' in Swahili. Every detail is crafted for relaxation, from the open-air restaurant to the ocean-view villas.",
    priceRange: "$$$",
    images: ["/images/polepole-3.jpg", "/images/polepole-1.jpg"],
    location: "Utende",
    highlights: ["Boutique luxury", "Ocean-view villas", "Gourmet cuisine"],
    waMessage: wa("Hi! I'm interested in booking Polepole Lodge."),
  },
  {
    name: "Kinasi Lodge",
    tier: "luxury",
    description:
      "Mafia Island's premier luxury lodge set on a hillside overlooking Chole Bay. World-class service, elegant suites, and exceptional dive experiences await.",
    priceRange: "$$$",
    images: ["/images/kinasi-1.jpg", "/images/kinasi-2.jpg", "/images/kinasi-3.jpg"],
    location: "Utende",
    highlights: ["Premier luxury", "Chole Bay views", "World-class diving"],
    waMessage: wa("Hi! I'm interested in booking Kinasi Lodge."),
  },
  {
    name: "Chole Mjini Tree House Lodge",
    tier: "luxury",
    description:
      "An extraordinary treehouse lodge on Chole Island, built among ancient baobab and tamarind trees. A truly unique eco-luxury experience unlike anywhere else.",
    priceRange: "$$$",
    images: ["/images/chole-mjini-2.jpg", "/images/chole-mjini-3.jpg"],
    location: "Chole Island",
    highlights: ["Treehouse stays", "Unique experience", "Eco-luxury"],
    waMessage: wa("Hi! I'm interested in booking Chole Mjini Tree House Lodge."),
  },
  {
    name: "Butiama Beach Lodge",
    tier: "luxury",
    description:
      "A refined beachfront lodge offering elegant Swahili-inspired architecture, exceptional service, and direct beach access. The epitome of island luxury.",
    priceRange: "$$$",
    images: ["/images/butiama-3.jpg"],
    location: "Kilindoni",
    highlights: ["Swahili elegance", "Direct beach access", "Exceptional service"],
    waMessage: wa("Hi! I'm interested in booking Butiama Beach Lodge."),
  },
];
