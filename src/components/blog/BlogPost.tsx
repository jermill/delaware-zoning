import Link from 'next/link';
import { FiClock, FiCalendar, FiUser, FiArrowLeft } from 'react-icons/fi';
import { BlogPost as BlogPostType } from '@/lib/blog';

interface BlogPostProps {
  post: BlogPostType;
  children: React.ReactNode;
}

export default function BlogPost({ post, children }: BlogPostProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-delaware-blue font-semibold mb-6 hover:gap-3 transition-all"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      {/* Category Badge */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-delaware-blue text-white text-xs font-semibold uppercase tracking-wide rounded-full">
          {post.category}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
        {post.title}
      </h1>

      {/* Description */}
      <p className="text-xl text-gray-600 mb-6">{post.description}</p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <FiUser className="w-4 h-4" />
          <span>{post.author}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiCalendar className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiClock className="w-4 h-4" />
          <span>{post.readingTime}</span>
        </div>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* MDX Content */}
      <div className="prose prose-lg prose-delaware max-w-none">
        {children}
      </div>

      {/* CTA Section */}
      <div className="mt-12 p-8 bg-gradient-to-br from-delaware-blue to-blue-700 rounded-xl text-white">
        <h3 className="text-2xl font-bold mb-3">Ready to Search Delaware Zoning?</h3>
        <p className="text-blue-100 mb-6">
          Get instant zoning information for any Delaware property. Start with 5 free searches today.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-delaware-gold text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all"
        >
          Try Delaware Zoning Free
        </Link>
      </div>
    </article>
  );
}
