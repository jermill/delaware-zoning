import Link from 'next/link';
import { BlogPostMetadata } from '@/lib/blog';
import { FiArrowRight } from 'react-icons/fi';

interface RelatedPostsProps {
  posts: BlogPostMetadata[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="mb-3">
              <span className="text-xs font-semibold text-delaware-blue uppercase tracking-wide">
                {post.category}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-delaware-blue transition-colors line-clamp-2">
              {post.title}
            </h3>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {post.description}
            </p>
            
            <div className="flex items-center gap-2 text-delaware-blue font-semibold text-sm group-hover:gap-3 transition-all">
              Read More
              <FiArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

