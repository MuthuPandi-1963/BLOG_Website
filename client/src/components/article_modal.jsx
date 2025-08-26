import { useState } from "react";
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
  X,
} from "lucide-react";

// interface ArticleModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

const MOCK_ARTICLE = {
  id: 1,
  title: "Breaking News: React Simplified",
  description: "This is a dummy article description for preview purposes.",
  content: `Here is the article content. It can span multiple paragraphs.

Second paragraph with more details.`,
  url: "https://example.com",
  urlToImage: "https://placehold.co/800x400",
  source: "World News Digest",
  country: "United States",
  publishedAt: new Date().toISOString(),
};

const MOCK_COMMENTS = [
  {
    id: 1,
    user: { firstName: "Jane", lastName: "Doe", email: "jane@example.com" },
    createdAt: new Date().toISOString(),
    content: "This is a great article!",
  },
  {
    id: 2,
    user: { firstName: "John", lastName: "Smith", email: "john@example.com" },
    createdAt: new Date().toISOString(),
    content: "I completely agree with the points made here.",
  },
];

export default function ArticleModal({ isOpen, onClose }) {
  const [commentText, setCommentText] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    alert("Comment added: " + commentText);
    setCommentText("");
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    alert("Shared article: " + MOCK_ARTICLE.url);
  };

  const handleExternalLink = () => {
    window.open(MOCK_ARTICLE.url, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🇺🇸</span>
              <div>
                <span className="text-sm text-gray-500 font-medium">
                  {MOCK_ARTICLE.country}
                </span>
                <div className="text-xs text-gray-400">
                  {MOCK_ARTICLE.source} •{" "}
                  {new Date(MOCK_ARTICLE.publishedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <DialogTitle className="text-3xl font-bold text-news-gray mb-6 leading-tight">
          {MOCK_ARTICLE.title}
        </DialogTitle>

        {/* Article Image */}
        {MOCK_ARTICLE.urlToImage && (
          <img
            src={MOCK_ARTICLE.urlToImage}
            alt={MOCK_ARTICLE.title}
            className="w-full h-64 object-cover rounded-xl mb-8"
          />
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-8">
          {MOCK_ARTICLE.description && (
            <p className="text-lg text-gray-700 leading-relaxed">
              {MOCK_ARTICLE.description}
            </p>
          )}
          {MOCK_ARTICLE.content && (
            <div className="mt-4">
              {MOCK_ARTICLE.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Article Actions */}
        <div className="border-t border-gray-200 pt-6 mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              onClick={handleBookmark}
              className={isBookmarked ? "text-news-red" : ""}
            >
              <Bookmark
                className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`}
              />
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
            <Button variant="outline" onClick={handleExternalLink}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Read Original
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-xl font-semibold text-news-gray mb-6">
            Comments ({MOCK_COMMENTS.length})
          </h3>

          {/* Comment Form */}
          <div className="mb-8">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts on this article..."
              className="resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-3">
              <Button
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className="bg-news-blue hover:bg-blue-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {MOCK_COMMENTS.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <Avatar>
                  <AvatarFallback className="bg-news-blue text-white">
                    {comment.user.firstName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-news-gray">
                      {comment.user.firstName} {comment.user.lastName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
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
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
