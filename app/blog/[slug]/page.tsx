import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getBlogPost, getAllBlogPosts } from '@/lib/blog'
import TableOfContents from '@/components/TableOfContents'
import ShareButtons from '@/components/ShareButtons'
import AuthorBio from '@/components/AuthorBio'
import { formatDate } from '@/lib/utils'
import { BlogPost } from '@/types'

interface BlogPostPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug)
  if (!post) return {}

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      type: 'article',
      publishedTime: post.publishedDate,
      modifiedTime: post.updatedDate,
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle,
      description: post.seoDescription,
      images: [post.coverImage],
    },
  }
}

const components = {
  h1: (props: any) => <h1 {...props} className="text-4xl font-bold mt-8 mb-4 text-primary" />,
  h2: (props: any) => <h2 {...props} className="text-3xl font-semibold mt-6 mb-3 text-primary" />,
  h3: (props: any) => <h3 {...props} className="text-2xl font-medium mt-4 mb-2 text-primary" />,
  p: (props: any) => <p {...props} className="mb-4 text-foreground" />,
  ul: (props: any) => <ul {...props} className="list-disc pl-6 mb-4 text-foreground" />,
  ol: (props: any) => <ol {...props} className="list-decimal pl-6 mb-4 text-foreground" />,
  li: (props: any) => <li {...props} className="mb-2 text-foreground" />,
  a: (props: any) => <a {...props} className="text-primary hover:underline" />,
  blockquote: (props: any) => (
    <blockquote {...props} className="border-l-4 border-primary/30 pl-4 italic my-4 text-foreground" />
  ),
  code: (props: any) => (
    <code {...props} className="bg-muted rounded px-1 py-0.5 font-mono text-sm text-foreground" />
  ),
  pre: (props: any) => (
    <pre {...props} className="bg-muted rounded p-4 overflow-x-auto my-4 text-foreground" />
  ),
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 bg-background text-foreground">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-primary">{post.title}</h1>
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <time dateTime={post.publishedDate}>
            {formatDate(post.publishedDate)}
          </time>
          <span className="mx-2">•</span>
          <span>{post.readingTime} min read</span>
        </div>
        <Image
          src={post.coverImage}
          alt={post.title}
          width={1200}
          height={630}
          className="rounded-lg"
        />
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
          <TableOfContents content={post.content} />
        </aside>

        <div className="md:w-3/4">
          <MDXRemote source={post.content} components={components} />

          <footer className="mt-12">
            <div className="border-t border-border pt-8">
              <AuthorBio author={post.author} />
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-primary">Share this article</h3>
              <ShareButtons url={`https://sazeai.com/blog/${params.slug}`} title={post.title} />
            </div>
          </footer>
        </div>
      </div>
    </article>
  )
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}