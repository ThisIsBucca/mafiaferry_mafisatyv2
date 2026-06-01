export default async function sitemap() {
  const baseUrl = "https://mafiaferry.vercel.app"

  const staticPages = [
    { url: baseUrl, freq: "daily", priority: 1.0 },
    { url: `${baseUrl}/blog`, freq: "weekly", priority: 0.8 },
    { url: `${baseUrl}/how-to-get-to-mafia-island`, freq: "monthly", priority: 0.9 },
    { url: `${baseUrl}/mafia-island-marine-park`, freq: "monthly", priority: 0.8 },
    { url: `${baseUrl}/whale-shark-tours`, freq: "monthly", priority: 0.8 },
    { url: `${baseUrl}/nyamisati-ferry`, freq: "monthly", priority: 0.8 },
    { url: `${baseUrl}/faq`, freq: "monthly", priority: 0.7 },
    { url: `${baseUrl}/admin/login`, freq: "monthly", priority: 0.3 },
    { url: `${baseUrl}/admin`, freq: "monthly", priority: 0.2 },
    { url: `${baseUrl}/admin/schedules`, freq: "monthly", priority: 0.2 },
    { url: `${baseUrl}/admin/articles`, freq: "monthly", priority: 0.2 },
    { url: `${baseUrl}/admin/products`, freq: "monthly", priority: 0.2 },
  ]

  const blogSlugs = [
    "mafia-ferry-guide",
    "how-to-get-to-mafia-island",
    "mafia-island-whale-shark-season",
    "mafia-island-vs-zanzibar",
    "best-time-to-visit-mafia-island",
    "mafia-island-marine-park-guide",
    "things-to-do-in-mafia-island",
    "nyamisati-ferry-ultimate-guide",
    "ras-mkumbi-bweni-mafia-island",
    "chole-island-day-trip-mafia",
    "blue-lagoon-sandbank-mafia-island",
    "budget-travel-guide-mafia-island",
    "mafia-island-beaches-guide",
  ]

  const sitemapEntries = [
    ...staticPages.map(({ url, freq, priority }) => ({
      url,
      lastModified: new Date(),
      changeFrequency: freq,
      priority,
      alternates: {
        languages: {
          en: url,
          sw: url,
        },
      },
    })),
    ...blogSlugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/blog/${slug}`,
          sw: `${baseUrl}/blog/${slug}`,
        },
      },
    })),
  ]

  return sitemapEntries
}
