'use client';

import Link from 'next/link';
import { blogs } from '../data/blogs';

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900">
      {/* Home Button - Fixed at top left */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Home
        </Link>
      </div>

      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-2 text-white">Research & Education</h1>
        <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
          Stay informed with the latest peptide research and educational resources
        </p>
        
        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-gray-800/70 rounded-lg overflow-hidden shadow-lg border border-blue-800/30 hover:border-blue-500/50 transition-all h-full flex flex-col">
              <div className="relative w-full aspect-square">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/blog-placeholder.jpg";
                  }}
                />
              </div>
              <div className="p-5 flex-grow flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-white">{blog.title}</h3>
                    <span className="text-xs text-gray-400">{blog.date}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-4 flex-grow">
                    {blog.description}
                  </p>
                  {blog.content && (
                    <div className="hidden">
                      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    </div>
                  )}
                  <Link href={blog.url} className="text-blue-400 text-sm hover:text-blue-300 inline-flex items-center mt-auto">
                    Read Article
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
            </div>
          ))}
        </div>
        
        {/* Back to Home Button */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}