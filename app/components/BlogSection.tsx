import Image from 'next/image';
import Link from 'next/link';
import { Blog } from '../data/blogs';

interface BlogSectionProps {
  blogs: Blog[];
}

export default function BlogSection({ blogs }: BlogSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {blogs.map((blog) => (
        <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative w-full aspect-square">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-blue-900">{blog.title}</h3>
            <p className="text-gray-600 mb-4">{blog.description}</p>
            <Link href={blog.url} className="text-blue-600 font-medium hover:text-blue-800">
              Read More →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}