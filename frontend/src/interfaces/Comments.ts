import { User } from "./User";

export type Comment = {
    id: string;
    createdAt: Date | null;
    content: string;
    userId: string;
    articleId: string;
}

export  type CommentWithUser = Comment & {
  user: Pick<User, "id" | "firstName" | "lastName" | "email">;
};