const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }

  return res.json();
}

// Auth
export const login = (email: string, password: string) =>
  apiFetch<{ accessToken: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const register = (data: { email: string; username: string; password: string; bio?: string }) =>
  apiFetch<{ accessToken: string; user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const getProfile = () => apiFetch<User>('/auth/profile');

export const updateUserProfile = (data: {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  darkMode?: boolean;
  accentColor?: string;
}) =>
  apiFetch<User>('/auth/profile', { method: 'PATCH', body: JSON.stringify(data) });

export const changePassword = (data: { currentPassword: string; newPassword: string }) =>
  apiFetch<{ message: string }>('/auth/password', { method: 'PATCH', body: JSON.stringify(data) });

// Posts
export const getPosts = (params?: Record<string, string | number>) => {
  const query = params
    ? '?' + new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== '')
          .map(([k, v]) => [k, String(v)]),
      ).toString()
    : '';
  return apiFetch<{ data: Post[]; meta: PaginationMeta }>(`/posts${query}`);
};

export const getPostBySlug = (slug: string) => apiFetch<Post>(`/posts/${slug}`);

export const trackPostView = (slug: string) =>
  apiFetch(`/posts/${slug}/view`, { method: 'POST' });

export const createPost = (data: CreatePostData) =>
  apiFetch<Post>('/posts', { method: 'POST', body: JSON.stringify(data) });

export const updatePost = (id: number, data: Partial<CreatePostData>) =>
  apiFetch<Post>(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

export const deletePost = (id: number) =>
  apiFetch(`/posts/${id}`, { method: 'DELETE' });

export const getAuthorStats = () =>
  apiFetch<AuthorStats>('/posts/author/stats');

// Likes
export const toggleLike = (postId: number) =>
  apiFetch<{ liked: boolean; totalLikes: number }>(`/posts/${postId}/like`, { method: 'POST' });

export const getPostLikes = (postId: number) =>
  apiFetch<{ totalLikes: number; isLiked: boolean }>(`/posts/${postId}/likes`);

// Comments
export const getComments = (postId: number, page = 1) =>
  apiFetch<{ data: Comment[]; meta: PaginationMeta }>(`/posts/${postId}/comments?page=${page}`);

export const createComment = (postId: number, body: string) =>
  apiFetch<Comment>(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });

// Tags
export const getTags = () => apiFetch<Tag[]>('/tags');

// Profiles
export const getPublicProfile = (username: string) =>
  apiFetch<PublicProfile>(`/profiles/${username}`);

export const getUserPosts = (authorId: number, page = 1) =>
  getPosts({ authorId, page, limit: 10 });

// AI
export const analyzePost = (postId: number, mode: string) =>
  apiFetch<AnalysisResult>('/ai/analyze', {
    method: 'POST',
    body: JSON.stringify({ postId, mode }),
  });

// Types
export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  darkMode: boolean;
  accentColor: string;
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: string;
  views: number;
  publishedAt?: string;
  createdAt: string;
  author: User;
  tags: Tag[];
  comments?: Comment[];
}

export interface Comment {
  id: number;
  body: string;
  createdAt: string;
  author: User;
}

export interface PublicProfile {
  id: number;
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  role: string;
  createdAt: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  status?: string;
  tagIds?: number[];
  tagNames?: string[];
}

export interface AuthorStats {
  posts: {
    id: number;
    title: string;
    slug: string;
    status: string;
    views: number;
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    publishedAt?: string;
  }[];
  totals: {
    totalPosts: number;
    totalPublished: number;
    totalDrafts: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
  };
}

export interface AnalysisResult {
  nlp: {
    keywords: string[];
    entities: string[];
    sentiment: { score: number; label: string };
    keyPhrases: string[];
    wordCount: number;
    readingTimeMinutes: number;
  };
  aiResponse: string;
  mode: string;
}
