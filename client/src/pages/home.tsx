import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import CountryFilter from "@/components/country-filter";
import NewsCard from "@/components/news-card";
import ArticleModal from "@/components/article-modal";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown } from "lucide-react";
import type { ArticleWithDetails } from "@shared/schema";

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<ArticleWithDetails | null>(null);
  const [page, setPage] = useState(1);
  const [allArticles, setAllArticles] = useState<ArticleWithDetails[]>([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/news', { country: selectedCountry, category: selectedCategory, page, limit: 20 }],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey as [string, any];
      const searchParams = new URLSearchParams();
      
      if (params.country) searchParams.append('country', params.country);
      if (params.category) searchParams.append('category', params.category);
      searchParams.append('page', params.page.toString());
      searchParams.append('limit', params.limit.toString());

      const response = await fetch(`/api/news?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      return response.json();
    },
  });

  // Update articles when data changes
  useEffect(() => {
    if (data?.articles) {
      if (page === 1) {
        setAllArticles(data.articles);
      } else {
        setAllArticles(prev => [...prev, ...data.articles]);
      }
    }
  }, [data, page]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setPage(1);
    setAllArticles([]);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
    setAllArticles([]);
  };

  const handleLoadMore = () => {
    if (data?.hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleArticleSelect = (article: ArticleWithDetails) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  const featuredArticle = allArticles[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <CountryFilter 
              selectedCountry={selectedCountry}
              selectedCategory={selectedCategory}
              onCountryChange={handleCountryChange}
              onCategoryChange={handleCategoryChange}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Hero Section */}
            {featuredArticle && (
              <section className="mb-12" data-testid="hero-section">
                <div className="hero-gradient rounded-2xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-4">
                      <span className="bg-news-red text-white px-3 py-1 rounded-full text-sm font-medium mr-4 animate-pulse">
                        FEATURED
                      </span>
                      <span className="text-blue-200 text-sm">
                        {featuredArticle.country} • {new Date(featuredArticle.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                      {featuredArticle.description}
                    </p>
                    <Button 
                      className="bg-white text-news-blue hover:bg-gray-100"
                      onClick={() => handleArticleSelect(featuredArticle)}
                      data-testid="button-read-featured"
                    >
                      Read Full Story <ChevronDown className="ml-2 h-4 w-4 rotate-[-90deg]" />
                    </Button>
                  </div>
                </div>
              </section>
            )}

            {/* News Grid */}
            <section data-testid="news-grid">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-news-gray">Latest Global News</h2>
                <div className="flex items-center space-x-4">
                  <select 
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-news-blue focus:border-transparent"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    data-testid="select-category"
                  >
                    <option value="">All Categories</option>
                    <option value="business">Business</option>
                    <option value="technology">Technology</option>
                    <option value="health">Health</option>
                    <option value="sports">Sports</option>
                    <option value="entertainment">Entertainment</option>
                  </select>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && page === 1 && (
                <div className="flex justify-center items-center py-12" data-testid="loading-articles">
                  <Loader2 className="h-8 w-8 animate-spin text-news-blue" />
                  <span className="ml-2 text-gray-600">Loading news articles...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-12" data-testid="error-articles">
                  <p className="text-red-600 mb-4">Failed to load news articles</p>
                  <Button onClick={() => refetch()} variant="outline">
                    Try Again
                  </Button>
                </div>
              )}

              {/* Articles Grid */}
              {allArticles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="articles-grid">
                  {allArticles.slice(1).map((article) => (
                    <NewsCard 
                      key={article.id}
                      article={article}
                      onClick={() => handleArticleSelect(article)}
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && allArticles.length === 0 && !error && (
                <div className="text-center py-12" data-testid="empty-articles">
                  <p className="text-gray-600 mb-4">No articles found</p>
                  <p className="text-sm text-gray-500">
                    {selectedCountry || selectedCategory 
                      ? 'Try adjusting your filters or search for different terms.'
                      : 'Check back later for new articles.'
                    }
                  </p>
                </div>
              )}

              {/* Load More Button */}
              {data?.hasMore && allArticles.length > 0 && (
                <div className="text-center mt-12">
                  <Button 
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="bg-news-blue hover:bg-blue-700"
                    data-testid="button-load-more"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More Articles
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal 
          article={selectedArticle}
          isOpen={!!selectedArticle}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
