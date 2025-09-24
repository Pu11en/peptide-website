import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { convertGoogleDriveUrl, cleanHtmlContent, extractFirstParagraph } from '@/app/utils/imageUtils';

// Secret key for authentication (should be stored in environment variables in production)
const API_SECRET = 'incredible-peptides-blog-secret';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Clean HTML content from n8n
    const cleanedContent = cleanHtmlContent(body.content);
    
    // Extract first paragraph from HTML content
    const firstParagraph = extractFirstParagraph(cleanedContent);

    // Process image URL if it's from Google Drive or external source
    const imageUrl = body.image 
      ? convertGoogleDriveUrl(body.image)
      : '/images/blog-placeholder.jpg';

    // Create a new blog post object
    const newBlog = {
      id: `blog-${Date.now()}`,
      title: body.title,
      description: firstParagraph, // Auto-generate from first paragraph of HTML
      content: cleanedContent, // Store cleaned HTML content
      image: imageUrl,
      date: body.date || new Date().toISOString().split('T')[0],
      url: `/blogs/blog-${Date.now()}`
    };

    // Read the current blogs file
    const filePath = path.join(process.cwd(), 'app', 'data', 'blogs.ts');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the current blogs array
    const blogsMatch = fileContent.match(/export const blogs: Blog\[\] = (\[[\s\S]*?\]);/);
    if (!blogsMatch) {
      return NextResponse.json({ error: 'Failed to parse blogs file' }, { status: 500 });
    }
    
    // Parse the current blogs array and add the new blog at the beginning
    let currentBlogs;
    try {
      // This is a simplified approach - in production, you'd want a more robust solution
      // Convert the TS array string to valid JSON by replacing single quotes with double quotes
      const jsonString = blogsMatch[1].replace(/'/g, '"').replace(/(\w+):/g, '"$1":');
      currentBlogs = JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing blogs:', error);
      return NextResponse.json({ error: 'Failed to parse blogs data' }, { status: 500 });
    }
    
    // Add the new blog to the beginning of the array
    currentBlogs.unshift(newBlog);
    
    // Keep only the latest 10 blogs
    const updatedBlogs = currentBlogs.slice(0, 10);
    
    // Format the blogs array as TypeScript
    const updatedBlogsString = JSON.stringify(updatedBlogs, null, 2)
      .replace(/"([^"]+)":/g, '$1:') // Convert "key": to key:
      .replace(/"/g, "'"); // Replace double quotes with single quotes
    
    // Update the blogs file
    const updatedFileContent = fileContent.replace(
      /export const blogs: Blog\[\] = \[[\s\S]*?\];/,
      `export const blogs: Blog[] = ${updatedBlogsString};`
    );
    
    fs.writeFileSync(filePath, updatedFileContent);
    
    return NextResponse.json({ success: true, blog: newBlog });
  } catch (error) {
    console.error('Error processing blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET endpoint to retrieve all blogs
export async function GET() {
  try {
    // Read the current blogs file
    const filePath = path.join(process.cwd(), 'app', 'data', 'blogs.ts');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the current blogs array
    const blogsMatch = fileContent.match(/export const blogs: Blog\[\] = (\[[\s\S]*?\]);/);
    if (!blogsMatch) {
      return NextResponse.json({ error: 'Failed to parse blogs file' }, { status: 500 });
    }
    
    // Parse the current blogs array
    let blogs;
    try {
      // Convert the TS array string to valid JSON
      const jsonString = blogsMatch[1].replace(/'/g, '"').replace(/(\w+):/g, '"$1":');
      blogs = JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing blogs:', error);
      return NextResponse.json({ error: 'Failed to parse blogs data' }, { status: 500 });
    }
    
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error('Error retrieving blogs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}