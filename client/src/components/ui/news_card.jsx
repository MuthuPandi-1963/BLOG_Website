import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, MessageCircle, ExternalLink } from "lucide-react";

// interface NewsCardProps {
//   article: {
//     id: string | number;
//     title: string;
//     description?: string;
//     url: string;
//     urlToImage?: string;
//     country: string;
//     source: string;
//     publishedAt: string;
//     commentCount?: number;
//   };
//   onClick: () => void;
// }

const COUNTRY_FLAGS = {
  "United States": "🇺🇸",
  "United Kingdom": "🇬🇧",
  "Germany": "🇩🇪",
  "France": "🇫🇷",
  "Japan": "🇯🇵",
  "Canada": "🇨🇦",
  "Australia": "🇦🇺",
  "India": "🇮🇳",
  "Brazil": "🇧🇷",
  "Russia": "🇷🇺",
  "China": "🇨🇳",
  "Italy": "🇮🇹",
  "Spain": "🇪🇸",
  "Mexico": "🇲🇽",
  "South Korea": "🇰🇷",
};

export default function NewsCard({ article, onClick }) {
  const countryFlag = COUNTRY_FLAGS[article.country] || "🌍";
  const publishedDate = new Date(article.publishedAt);

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
            const target = e.target ;
            target.style.display = "none";
          }}
          data-testid={`img-article-${article.id}`}
        />
      )}

      <CardContent className="p-6">
        {/* Header with country and bookmark */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span className="text-lg mr-2">{countryFlag}</span>
            <span
              className="text-sm text-gray-500 font-medium"
              data-testid={`text-country-${article.id}`}
            >
              {article.country}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-news-red transition-colors"
            data-testid={`button-bookmark-${article.id}`}
          >
            <Bookmark className="w-4 h-4" />
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
            <span data-testid={`text-source-${article.id}`}>
              {article.source}
            </span>
            <span className="mx-2">•</span>
            <span data-testid={`text-time-${article.id}`}>
              {publishedDate.toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-news-blue transition-colors p-0 h-auto w-auto"
              data-testid={`button-external-${article.id}`}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
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
