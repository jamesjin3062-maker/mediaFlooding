import { CreatorGuideArticle } from "@/components/articles/creator-guide-article";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { applyBlogCopy, blogPosts, getBlogPost, getBlogPostMetadata } from "@/lib/blog-posts";
import { getCreatorGuide } from "@/lib/creator-guides";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  const t = await getTranslations("blog");
  return getBlogPostMetadata(applyBlogCopy(post, (key) => t(key)));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const guide = getCreatorGuide(slug);
  if (!guide) notFound();
  return <CreatorGuideArticle guide={guide} />;
}
