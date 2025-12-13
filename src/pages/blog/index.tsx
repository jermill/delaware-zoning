import { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import BlogCard from '@/components/blog/BlogCard';
import SEOHead from '@/components/seo/SEOHead';
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema';
import { getAllPosts, BlogPostMetadata } from '@/lib/blog';
import { FiBook } from 'react-icons/fi';

interface BlogIndexProps {
  posts: BlogPostMetadata[];
}

export default function BlogIndex({ posts }: BlogIndexProps) {
  return (
    <>
      <SEOHead
        title="Delaware Zoning Blog | Expert Guides & Resources"
        description="Learn everything about Delaware zoning codes, permits, and regulations. Expert guides for realtors, developers, and property investors in Delaware."
        keywords="Delaware zoning guide, zoning regulations, zoning codes explained, Delaware real estate, zoning tutorials"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
        ]}
      />

      <Layout>
        <div className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-delaware-blue to-blue-700 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-4">
                <FiBook className="w-8 h-8" />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Delaware Zoning Blog
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Expert Guides & Resources
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl">
                Everything you need to know about Delaware zoning codes, permits, and regulations.
                Written by experts for realtors, developers, and property investors.
              </p>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {posts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <FiBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Blog Posts Coming Soon
                </h2>
                <p className="text-gray-600">
                  We're preparing comprehensive guides about Delaware zoning. Check back soon!
                </p>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="bg-white border-t border-gray-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Search Delaware Zoning?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Get instant zoning information for any Delaware property. Start with 5 free searches.
              </p>
              <a
                href="/"
                className="inline-block px-8 py-4 bg-delaware-blue text-white font-semibold rounded-lg hover:bg-blue-800 transition-all"
              >
                Try Delaware Zoning Free
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts();

  return {
    props: {
      posts,
    },
    revalidate: 3600, // Revalidate every hour
  };
};


