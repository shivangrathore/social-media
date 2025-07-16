export function extractHashtags(content: string | null): string[] {
  if (!content) {
    return [];
  }
  const hashtagMatches =
    content?.match(/#([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)/g) || [];
  const hashtags = hashtagMatches.map((tag) => tag.slice(1).toLowerCase());
  const unique = new Set(hashtags);
  return Array.from(unique);
}
