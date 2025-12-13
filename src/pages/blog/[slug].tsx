import { GetStaticProps, GetStaticPaths } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import Layout from '@/components/layout/Layout';
import BlogPost from '@/components/blog/BlogPost';
import RelatedPosts from '@/components/blog/RelatedPosts';
import SEOHead from '@/components/seo/SEOHead';
import ArticleSchema from '@/components/seo/schemas/ArticleSchema';
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema';
import {
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts,
  BlogPost as BlogPostType,
  BlogPostMetadata,
} from '@/lib/blog';

interface BlogPostPageProps {
  post: BlogPostType;
  mdxSource: MDXRemoteSerializeResult;
  relatedPosts: BlogPostMetadata[];
}

export default function BlogPostPage({ post, mdxSource, relatedPosts }: BlogPostPageProps) {
  return (
    <>
      <SEOHead
        title={`${post.title} | Delaware Zoning Blog`}
        description={post.description}
        keywords={post.keywords?.join(', ') || post.tags.join(', ')}
        ogType="article"
        article={{
          publishedTime: post.date,
          author: post.author,
          tags: post.tags,
        }}
        ogImage={post.image}
      />
      <ArticleSchema
        title={post.title}
        description={post.description}
        publishedTime={post.date}
        author={post.author}
        url={`/blog/${post.slug}`}
        image={post.image || '/images/og-image.png'}
        keywords={post.tags}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />

      <Layout>
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <BlogPost post={post}>
              <MDXRemote {...mdxSource} />
            </BlogPost>

            <RelatedPosts posts={relatedPosts} />
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllPostSlugs();

  return {
    paths: slugs.map((slug) => ({
      params: { slug },
    })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  const mdxSource = await serialize(post.content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      ],
    },
  });

  const relatedPosts = getRelatedPosts(slug, 3);

  return {
    props: {
      post,
      mdxSource,
      relatedPosts,
    },
    revalidate: 3600, // Revalidate every hour
  };
};

