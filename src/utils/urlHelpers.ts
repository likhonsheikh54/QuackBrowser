/**
 * Helper functions for URL operations
 */

/**
 * Check if a string is a valid URL
 * @param url The URL to validate
 * @returns boolean indicating if the URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', // fragment locator
      'i'
    );
    
    return pattern.test(url);
  } catch (e) {
    return false;
  }
};

/**
 * Add protocol to URL if missing
 * @param url The URL to format
 * @returns URL with protocol
 */
export const getUrlWithProtocol = (url: string): string => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
};

/**
 * Extract domain name from URL
 * @param url The URL to extract domain from
 * @returns The domain name
 */
export const getDomainFromUrl = (url: string): string => {
  try {
    if (!url) return '';
    
    // Add protocol if missing to make URL object work
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    const parsedUrl = new URL(url);
    let domain = parsedUrl.hostname;
    
    // Remove 'www.' if present
    if (domain.startsWith('www.')) {
      domain = domain.substring(4);
    }
    
    return domain;
  } catch (e) {
    // Return original URL if parsing fails
    return url;
  }
};

/**
 * Format URL for display purposes (e.g., remove protocol)
 * @param url The URL to format
 * @returns Formatted URL for display
 */
export const formatUrlForDisplay = (url: string): string => {
  try {
    if (!url) return '';
    
    // Handle basic search engine URLs
    if (url.includes('google.com/search?q=')) {
      const searchParams = new URL(url).searchParams;
      const query = searchParams.get('q');
      return query ? `Google: ${query}` : url;
    }
    
    if (url.includes('duckduckgo.com/?q=')) {
      const searchParams = new URL(url).searchParams;
      const query = searchParams.get('q');
      return query ? `DuckDuckGo: ${query}` : url;
    }
    
    if (url.includes('bing.com/search?q=')) {
      const searchParams = new URL(url).searchParams;
      const query = searchParams.get('q');
      return query ? `Bing: ${query}` : url;
    }
    
    // Remove protocol and trailing slashes
    let formatted = url
      .replace(/^https?:\/\//, '')
      .replace(/\/$/, '');
    
    return formatted;
  } catch (e) {
    return url;
  }
};

/**
 * Check if URL is a search engine results page
 * @param url The URL to check
 * @returns Boolean indicating if the URL is a search engine results page
 */
export const isSearchResultsPage = (url: string): boolean => {
  return (
    url.includes('google.com/search?') ||
    url.includes('duckduckgo.com/?q=') ||
    url.includes('bing.com/search?')
  );
}; 