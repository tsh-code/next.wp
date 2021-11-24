export function getExcerptFromContent(content: string) {
  const index = content.indexOf("<!--more-->");

  return index > -1 ? content.slice(0, index) + '<a class="read-more">Read more</a>' : content;
}
