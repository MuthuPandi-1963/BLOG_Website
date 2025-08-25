import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, Share2, MessageCircle, ExternalLink } from "lucide-react";
import { ArticleWithDetails } from "@/interfaces/Article";

interface NewsCardProps {
  article: ArticleWithDetails;
  onClick: () => void;
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

export default function NewsCard({ article, onClick }: NewsCardProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(article.isBookmarked || false);

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

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description || undefined,
        url: article.url,
      });
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(article.url);
      toast({
        title: "Link Copied",
        description: "Article URL copied to clipboard",
      });
    }
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  const countryFlag = COUNTRY_FLAGS[article.country] || '🌍';
  const publishedDate = new Date(article.publishedAt);
  const timeAgo = getTimeAgo(publishedDate);

  return (
    <Card 
      className="news-card cursor-pointer"
      onClick={onClick}
      data-testid={`news-card-${article.id}`}
    >
      {/* Article Image */}
      {article.urlToImage && (
        <img 
          src={article.urlToImage}
          alt={article.title}
          className="news-card-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
          data-testid={`img-article-${article.id}`}
        />
      )}
      
      <CardContent className="p-6">
        {/* Header with country and bookmark */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span className="text-lg mr-2">{countryFlag}</span>
            <span className="text-sm text-gray-500 font-medium" data-testid={`text-country-${article.id}`}>
              {article.country}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            disabled={bookmarkMutation.isPending}
            className={`transition-colors ${
              isBookmarked 
                ? 'text-news-red hover:text-red-700' 
                : 'text-gray-400 hover:text-news-red'
            }`}
            data-testid={`button-bookmark-${article.id}`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-news-gray mb-2 line-clamp-2 hover:text-news-blue transition-colors">
          {article.title}
        </h3>

        {/* Description */}
        {article.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {article.description}
          </p>
        )}

        {/* Footer with source, time, and actions */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <span data-testid={`text-source-${article.id}`}>{article.source}</span>
            <span className="mx-2">•</span>
            <span data-testid={`text-time-${article.id}`}>{timeAgo}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExternalLink}
              className="hover:text-news-blue transition-colors p-0 h-auto w-auto"
              data-testid={`button-external-${article.id}`}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="hover:text-news-blue transition-colors p-0 h-auto w-auto"
              data-testid={`button-share-${article.id}`}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <span className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              <span data-testid={`text-comment-count-${article.id}`}>
                {article.commentCount || 0}
              </span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return date.toLocaleDateString();
}
