export function getYouTubeEmbedUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Un ID brut fait 11 caracteres alphanumeriques/-/_
  if (/^[\w-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`;
  }

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (url.hostname.includes('youtube.com')) {
      if (url.pathname.startsWith('/embed/')) return trimmed;
      if (url.pathname.startsWith('/shorts/')) {
        const id = url.pathname.split('/')[2];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      const id = url.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  } catch {
    return null;
  }

  return null;
}