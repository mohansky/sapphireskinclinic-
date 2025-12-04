/**
 * Extracts the slug from a URL path in Astro
 * @param url The URL object from Astro.url
 * @returns The slug string without leading or trailing slashes
 */
export function getSlugFromPath(url: URL): string {
    // Get the pathname from the URL
    const path = url.pathname;
    
    // Remove leading and trailing slashes
    const slug = path.replace(/^\/|\/$/g, '');
    
    // If it's the homepage (empty string after removing slashes), return 'home'
    return slug || 'home';
  }
  
export function getLastSegment(url: URL): string {
    const path = url.pathname;
    const segments = path.split('/').filter(Boolean);
    return segments.pop() || 'home';
  }