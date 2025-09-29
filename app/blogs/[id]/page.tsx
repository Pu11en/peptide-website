'use client';

import Link from 'next/link';
import { blogs } from '../../data/blogs';
import { notFound } from 'next/navigation';
import { use } from 'react';

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  // Properly unwrap params with React.use()
  const id = use(params).id;
  
  // Find the blog post by ID
  const blog = blogs.find(blog => blog.id === id);
  
  // If blog post not found, return 404
  if (!blog) {
    notFound();
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-blue-900 w-full min-h-screen">
      {/* Home Button - Fixed at top left */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Home
        </Link>
      </div>

      <div className="container mx-auto px-4 py-20 pb-40">
        <div className="max-w-4xl mx-auto">
          {/* Back to Blogs Button */}
          <Link href="/blogs" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to All Blogs
          </Link>
          
          {/* Blog Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-white mb-4 text-center">{blog.title}</h1>
            <div className="flex items-center text-gray-400 text-sm mb-6 justify-center">
              <span>{blog.date}</span>
            </div>
          </div>
          
          {/* Featured Image */}
          <div className="mb-8 rounded-lg overflow-hidden shadow-xl">
            <img 
              src={blog.image} 
              alt={blog.title} 
              className="w-full h-auto object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/blog-placeholder.jpg";
              }}
            />
          </div>
          
          {/* Blog Content */}
          <div className="prose prose-lg prose-invert max-w-none bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 shadow-xl leading-relaxed">
            {blog.content ? (
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            ) : (
              <p>{blog.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}