import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Search, Bookmark, LogOut, Settings } from "lucide-react";
import type { User } from "@shared/schema";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50" data-testid="navigation-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center" data-testid="link-home">
              <Globe className="text-news-blue w-8 h-8 mr-3" />
              <h1 className="text-2xl font-bold text-news-blue">GlobalNews</h1>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-news-blue focus:border-transparent"
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Bookmarks */}
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-gray-600 hover:text-news-blue transition-colors"
                  data-testid="button-bookmarks"
                >
                  <Bookmark className="w-5 h-5" />
                </Button>

                {/* Admin Link (if admin) */}
                {user?.isAdmin && (
                  <Link href="/admin">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-600 hover:text-news-blue transition-colors"
                      data-testid="link-admin"
                    >
                      <Settings className="w-5 h-5" />
                    </Button>
                  </Link>
                )}

                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-news-blue rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700" data-testid="text-user-name">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user?.email
                    }
                  </span>
                </div>

                {/* Logout */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                  data-testid="button-logout"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  className="bg-news-blue text-white hover:bg-blue-700"
                  onClick={handleLogin}
                  data-testid="button-sign-in"
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
