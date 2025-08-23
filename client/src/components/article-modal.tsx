import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient, type CommentsResponse } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Share2, 
  Bookmark, 
  ExternalLink, 
  MessageCircle, 
  ThumbsUp, 
  Send,
  Loader2,
  X
} from "lucide-react";
import type { ArticleWithDetails, CommentWithUser } from "@shared/schema";

interface ArticleModalProps {
  article: ArticleWithDetails;
  isOpen: boolean;
  onClose: () => void;
}

const COUNTRY_FLAGS: Record<string, string> = {
  'United States': '🇺🇸',
  'United Kingdom': '🇬🇧',
  'Germany': '🇩🇪',
  'France': '🇫🇷',
  'Japan': '🇯🇵',
  'Canada': '🇨🇦',
  'Australia': '🇦🇺',
  'India': '🇮🇳',
  'Brazil': '🇧🇷',
  'Russia': '🇷🇺',
  'China': '🇨🇳',
  'Italy': '🇮🇹',
  'Spain': '🇪🇸',
  'Mexico': '🇲🇽',
  'South Korea': '🇰🇷',
};

export default function ArticleModal({ article, isOpen, onClose }: ArticleModalProps) {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(article.isBookmarked || false);

  // Fetch comments
  const { data: commentsData, isLoading: commentsLoading } = useQuery<CommentsResponse>({
    queryKey: [`/api/articles/${article.id}/comments`],
    enabled: isOpen,
    retry: false,
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", `/api/articles/${article.id}/comments`, { content });
    },
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: [`/api/articles/${article.id}/comments`] });
      toast({
        title: "Comment Added",
        description: "Your comment has been posted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  // Bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (isBookmarked) {
        await apiRequest("DELETE", `/api/bookmarks/${article.id}`);
        return false;
      } else {
        await apiRequest("POST", "/api/bookmarks", { articleId: article.id });
        return true;
      }
    },
    onSuccess: (newBookmarkStatus) => {
      setIsBookmarked(newBookmarkStatus);
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      toast({
        title: newBookmarkStatus ? "Bookmarked" : "Removed",
        description: newBookmarkStatus 
          ? "Article saved to your bookmarks" 
          : "Article removed from bookmarks",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    },
  });

  const handleAddComment = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to add comments",
        variant: "destructive",
      });
      return;
    }

    if (!commentText.trim()) {
      toast({
        title: "Comment Required",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    addCommentMutation.mutate(commentText);
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to bookmark articles",
        variant: "destructive",
      });
      return;
    }
    bookmarkMutation.mutate();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: article.url,
      });
    } else {
      navigator.clipboard.writeText(article.url);
      toast({
        title: "Link Copied",
        description: "Article URL copied to clipboard",
      });
    }
  };

  const handleExternalLink = () => {
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  const countryFlag = COUNTRY_FLAGS[article.country] || '🌍';
  const publishedDate = new Date(article.publishedAt);
  const comments = commentsData?.comments || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        data-testid="article-modal"
      >
        <DialogHeader>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{countryFlag}</span>
              <div>
                <span className="text-sm text-gray-500 font-medium">
                  {article.country}
                </span>
                <div className="text-xs text-gray-400">
                  {article.source} • {publishedDate.toLocaleDateString()}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-modal"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <DialogTitle className="text-3xl font-bold text-news-gray mb-6 leading-tight">
          {article.title}
        </DialogTitle>

        {/* Article Image */}
        {article.urlToImage && (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-64 object-cover rounded-xl mb-8"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
            data-testid="img-article-modal"
          />
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-8">
          {article.description && (
            <p className="text-lg text-gray-700 leading-relaxed">
              {article.description}
            </p>
          )}
          {article.content && article.content !== article.description && (
            <div className="mt-4">
              {article.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          )}
        </div>

        {/* Article Actions */}
        <div className="border-t border-gray-200 pt-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleShare}
                data-testid="button-share-modal"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={handleBookmark}
                disabled={bookmarkMutation.isPending}
                className={isBookmarked ? 'text-news-red' : ''}
                data-testid="button-bookmark-modal"
              >
                <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button
                variant="outline"
                onClick={handleExternalLink}
                data-testid="button-external-modal"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Read Original
              </Button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-xl font-semibold text-news-gray mb-6">
            Comments
            {comments.length > 0 && (
              <span className="text-gray-500 text-base font-normal ml-2">
                ({comments.length})
              </span>
            )}
          </h3>

          {/* Comment Form */}
          {isAuthenticated ? (
            <div className="mb-8" data-testid="comment-form">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts on this article..."
                className="resize-none"
                rows={3}
                data-testid="textarea-comment"
              />
              <div className="flex justify-end mt-3">
                <Button
                  onClick={handleAddComment}
                  disabled={addCommentMutation.isPending || !commentText.trim()}
                  className="bg-news-blue hover:bg-blue-700"
                  data-testid="button-post-comment"
                >
                  {addCommentMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Post Comment
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-3">Sign in to join the conversation</p>
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="bg-news-blue hover:bg-blue-700"
                data-testid="button-login-to-comment"
              >
                Sign In
              </Button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6" data-testid="comments-list">
            {commentsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment: CommentWithUser) => (
                <div key={comment.id} className="flex space-x-4" data-testid={`comment-${comment.id}`}>
                  <Avatar>
                    <AvatarFallback className="bg-news-blue text-white">
                      {comment.user.firstName?.[0]?.toUpperCase() || 
                       comment.user.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-news-gray">
                        {comment.user.firstName && comment.user.lastName
                          ? `${comment.user.firstName} ${comment.user.lastName}`
                          : comment.user.email
                        }
                      </span>
                      <span className="text-sm text-gray-500">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{comment.content}</p>
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-news-blue"
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Like
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-news-blue"
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No comments yet</p>
                <p className="text-sm mt-1">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
