export function getLocalizedArticle(article, locale) {
  if (!article) return article
  if (locale !== 'sw') return article
  return {
    ...article,
    title: article.title_sw || article.title,
    content: article.content_sw || article.content,
    excerpt: article.excerpt_sw || article.excerpt,
  }
}

export function getLocalizedArticles(articles, locale) {
  if (!articles) return articles
  if (locale !== 'sw') return articles
  return articles.map(a => getLocalizedArticle(a, locale))
}
