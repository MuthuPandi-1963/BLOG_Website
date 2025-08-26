import Navigation from "@/components/ui/navigation";
import NewsCard from "../components/ui/news_card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown } from "lucide-react";
import CountryFilter from "../components/country_filter";
import ArticleModal from "../components/article_modal";

export default function Home() {
  // fake sample data just for UI rendering
  const featuredArticle = {
    id: 1,
    title: "Global Economy Shows Signs of Recovery",
    description: "Markets are stabilizing as international trade picks up momentum...",
    country: "US",
    publishedAt: new Date().toISOString(),
  };

  const sampleArticles = [
    {
      id: 2,
      title: "Tech Innovations 2025",
      description: "AI-powered tools are reshaping industries worldwide.",
      country: "UK",
      publishedAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Sports Highlights",
      description: "Historic win celebrated across the nation.",
      country: "IN",
      publishedAt: new Date().toISOString(),
    },
    {
      id: 4,
      title: "Healthcare Advances",
      description: "New vaccines promise a healthier future.",
      country: "CA",
      publishedAt: new Date().toISOString(),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <CountryFilter />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Hero Section */}
            {featuredArticle && (
              <section className="mb-12" data-testid="hero-section">
                <div className="hero-gradient rounded-2xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 
                        10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 
                        1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-4">
                      <span className="bg-news-red text-white px-3 py-1 rounded-full text-sm font-medium mr-4 animate-pulse">
                        FEATURED
                      </span>
                      <span className="text-blue-200 text-sm">
                        {featuredArticle.country} •{" "}
                        {new Date(featuredArticle.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                      {featuredArticle.description}
                    </p>
                    <Button className="bg-white text-news-blue hover:bg-gray-100">
                      Read Full Story{" "}
                      <ChevronDown className="ml-2 h-4 w-4 rotate-[-90deg]" />
                    </Button>
                  </div>
                </div>
              </section>
            )}

            {/* News Grid */}
            <section data-testid="news-grid">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-news-gray">
                  Latest Global News
                </h2>
                <div className="flex items-center space-x-4">
                  <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-news-blue focus:border-transparent">
                    <option value="">All Categories</option>
                    <option value="business">Business</option>
                    <option value="technology">Technology</option>
                    <option value="health">Health</option>
                    <option value="sports">Sports</option>
                    <option value="entertainment">Entertainment</option>
                  </select>
                </div>
              </div>

              {/* Articles Grid */}
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                data-testid="articles-grid"
              >
                {sampleArticles.map((article) => (
                  <NewsCard key={article.id} article={article} />

                ))}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-12">
                <Button className="bg-news-blue hover:bg-blue-700">
                  Load More Articles
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Example modal left empty */}
      <ArticleModal isOpen={false} />
    </div>
  );
}
