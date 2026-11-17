import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";
import { creatorGuides } from "@/lib/creator-guides";

export { HOSTED_APP_URL, getSiteUrl } from "@/lib/site";

export interface BlogPost {
  /** Set for editorial content not yet translated; do not localize only its title. */
  language?: "en";
  slug: string;
  image?: { src: string; alt: string; width: number; height: number };
  title: string;
  description: string;
  eyebrow: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  author: string;
  keywords: string[];
  summary: string;
}

export const blogPosts: BlogPost[] = creatorGuides.map((guide) => guide.post);

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

/** Overlay translated title, description, and listing copy. Keywords stay English. */
export function applyBlogCopy(post: BlogPost, translate: (key: string) => string): BlogPost {
  if (post.language) return post;
  const slug = post.slug;
  return {
    ...post,
    title: translate(`${slug}.title`),
    description: translate(`${slug}.description`),
    eyebrow: translate(`${slug}.eyebrow`),
    category: translate(`${slug}.category`),
    readingTime: translate(`${slug}.readingTime`),
    summary: translate(`${slug}.summary`),
    image: post.image ? { ...post.image, alt: translate(`${slug}.imageAlt`) } : undefined,
  };
}

export function getBlogPostMetadata(post: BlogPost): Metadata {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/blog/${post.slug}`;

  return {
    title: { absolute: `${post.title} | SupoClip` },
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      siteName: "SupoClip",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.keywords,
      images: post.image ? [{ url: post.image.src, width: post.image.width, height: post.image.height, alt: post.image.alt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      images: post.image ? [{ url: post.image.src, alt: post.image.alt }] : undefined,
      title: post.title,
      description: post.description,
    },
  };
}
