import type { Metadata } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${API_BASE}/posts/${slug}`, { cache: 'no-store' });
    if (!res.ok) return { title: 'BirgeBolis' };
    const post = await res.json();
    const description = post.excerpt || (post.content?.replace(/<[^>]*>/g, '').slice(0, 160) + '...');
    const authorName = post.author?.displayName || post.author?.username || '';

    return {
      title: `${post.title} — BirgeBolis`,
      description,
      openGraph: {
        title: post.title,
        description,
        type: 'article',
        authors: [authorName],
        publishedTime: post.publishedAt,
        tags: post.tags?.map((t: any) => t.name) || [],
        siteName: 'BirgeBolis',
      },
      twitter: {
        card: 'summary',
        title: post.title,
        description,
      },
    };
  } catch {
    return { title: 'BirgeBolis' };
  }
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
