import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Search, Bookmark, MessageCircle, Shield, Users } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center text-white">
            <div className="flex justify-center items-center mb-6">
              <Globe className="w-16 h-16 mr-4" />
              <h1 className="text-5xl font-bold">GlobalNews</h1>
            </div>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Your trusted source for global news and insights. Stay informed with real-time updates from around the world.
            </p>
            <div className="space-x-4">
              <Button 
                size="lg" 
                className="bg-white text-news-blue hover:bg-gray-100"
                onClick={handleLogin}
                data-testid="button-login"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-news-blue"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-news-gray mb-4">
            Stay Connected to the World
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover news from every corner of the globe with our comprehensive filtering and personalization features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-news-blue/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-news-blue" />
              </div>
              <CardTitle>Country-Based Filtering</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Filter news by country to get localized updates and regional perspectives on global events.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-news-green/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-news-green" />
              </div>
              <CardTitle>Smart Search</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Find specific articles with our powerful search functionality that scans headlines and content.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-news-red/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Bookmark className="w-6 h-6 text-news-red" />
              </div>
              <CardTitle>Save Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Bookmark interesting articles to read later and build your personal news collection.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Community Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Join the conversation with comments and discussions on articles that matter to you.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Trusted Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Access news from verified and reputable sources worldwide for reliable information.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <CardTitle>Personal Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Customize your news experience with personalized feeds and preferred countries.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-news-gray mb-4">
            Ready to Start Your Global News Journey?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Join thousands of readers who trust GlobalNews for their daily dose of world events.
          </p>
          <Button 
            size="lg" 
            className="bg-news-blue hover:bg-blue-700"
            onClick={handleLogin}
            data-testid="button-cta-login"
          >
            Sign In to Get Started
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-news-gray text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Globe className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-bold">GlobalNews</h3>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Your trusted source for global news and insights. Stay informed with real-time updates from around the world.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <div className="space-y-2 text-gray-300">
                <div className="hover:text-white transition-colors cursor-pointer">Politics</div>
                <div className="hover:text-white transition-colors cursor-pointer">Business</div>
                <div className="hover:text-white transition-colors cursor-pointer">Technology</div>
                <div className="hover:text-white transition-colors cursor-pointer">Health</div>
                <div className="hover:text-white transition-colors cursor-pointer">Sports</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-gray-300">
                <div className="hover:text-white transition-colors cursor-pointer">Help Center</div>
                <div className="hover:text-white transition-colors cursor-pointer">Contact Us</div>
                <div className="hover:text-white transition-colors cursor-pointer">Privacy Policy</div>
                <div className="hover:text-white transition-colors cursor-pointer">Terms of Service</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-600 pt-8 mt-8 text-center text-gray-300">
            <p>&copy; 2024 GlobalNews. All rights reserved. | Powered by NewsAPI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
