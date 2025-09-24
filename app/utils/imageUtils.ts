/**
 * Utility functions for handling images and content in the blog system
 */

/**
 * Converts a Google Drive link to a direct image URL
 * Supports links in the format:
 * - https://drive.google.com/file/d/{fileId}/view?usp=drive_link
 * - https://drive.google.com/open?id={fileId}
 * 
 * @param url The Google Drive URL
 * @returns A direct image URL that can be used in img tags
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return '';
  
  // Remove any backticks that might be in the URL (from n8n formatting)
  url = url.replace(/`/g, '');
  
  // Check if it's a Google Drive URL
  if (!url.includes('drive.google.com')) {
    return url; // Return the original URL if not a Google Drive link
  }

  let fileId = '';

  // Extract file ID from different Google Drive URL formats
  if (url.includes('/file/d/')) {
    // Format: https://drive.google.com/file/d/{fileId}/view
    const match = url.match(/\/file\/d\/([^\/]+)/);
    if (match && match[1]) {
      fileId = match[1];
    }
  } else if (url.includes('id=')) {
    // Format: https://drive.google.com/open?id={fileId}
    const match = url.match(/id=([^&]+)/);
    if (match && match[1]) {
      fileId = match[1];
    }
  }

  if (!fileId) {
    console.warn('Could not extract file ID from Google Drive URL:', url);
    return url;
  }

  // Return the direct link format
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

/**
 * Cleans HTML content from n8n
 * - Removes backticks from URLs
 * - Sanitizes content
 * 
 * @param content The HTML content from n8n
 * @returns Cleaned HTML content
 */
export function cleanHtmlContent(content: string): string {
  if (!content) return '';
  
  // Remove HTML comment markers
  content = content.replace(/<!-- Newsletter Content Starts Here -->/g, '');
  
  // Fix URLs with backticks
  content = content.replace(/href=" `([^`]+)` "/g, 'href="$1"');
  
  // Clean any other backticks in the content
  content = content.replace(/`/g, '');
  
  return content;
}

/**
 * Extracts the first paragraph text from HTML content
 * 
 * @param htmlContent The HTML content
 * @returns The first paragraph text (without HTML tags)
 */
export function extractFirstParagraph(htmlContent: string): string {
  if (!htmlContent) return '';
  
  // Find the first paragraph
  const match = htmlContent.match(/<p>(.*?)<\/p>/);
  if (match && match[1]) {
    // Remove any HTML tags from the paragraph text
    const text = match[1].replace(/<[^>]*>/g, '');
    return text.substring(0, 150) + '...';
  }
  
  // Fallback: just get the first 150 characters of text
  const textOnly = htmlContent.replace(/<[^>]*>/g, '');
  return textOnly.substring(0, 150) + '...';
}