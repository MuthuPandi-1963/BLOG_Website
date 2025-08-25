import { Article } from "@/interfaces/Article";
import { Bookmark } from "@/interfaces/Bookmark";
import { User } from "@/interfaces/User";
import { QueryClient, QueryFunction } from "@tanstack/react-query";

// API Response Types
export interface NewsResponse {
  articles: ArticleWithDetails[];
  hasMore?: boolean;
}

export interface UsersResponse {
  users: User[];
}

export interface CommentsResponse {
  comments: CommentWithUser[];
}

export interface StatsResponse {
  stats: { country: string; count: number }[];
}

export interface BookmarksResponse {
  bookmarks: ArticleWithDetails[];
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export type CommentWithUser = Comment & {
  user: Pick<User, "id" | "firstName" | "lastName" | "email">;
};

export type ArticleWithDetails = Article & {
  bookmarks: Bookmark[];
  comments: CommentWithUser[];
  isBookmarked?: boolean;
  commentCount?: number;
};
