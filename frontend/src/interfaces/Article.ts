import { Bookmark } from "./Bookmark";
import { CommentWithUser } from "./Comments";

export type Article = {
    id: string;
    createdAt: Date | null;
    title: string;
    description: string | null;
    content: string | null;
    url: string;
    urlToImage: string | null;
    source: string;
    author: string | null;
    publishedAt: Date;
    country: string;
    category: string | null;
}

export type ArticleWithDetails = Article & {
  bookmarks: Bookmark[];
  comments: CommentWithUser[];
  isBookmarked?: boolean;
  commentCount?: number;
};