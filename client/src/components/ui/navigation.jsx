import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Search, Bookmark, LogOut, Settings } from "lucide-react";

export default function Navigation() {
  // 🔹 Static states (simulate auth)
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    isAdmin: false,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleLogin = () => {
    setIsAuthenticated(true);
    setUser({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      isAdmin: true,
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
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
                >
                  <Bookmark className="w-5 h-5" />
                </Button>

                {/* Admin Link (if admin) */}
                {user?.isAdmin && (
                  <Link to={"/admin"}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-600 hover:text-news-blue transition-colors"
                      onClick = {()=>console.log("Hii")
                      }
                    >
                      <Settings className="w-5 h-5" />
                    </Button>
                  </Link>
                )}

                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-news-blue rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.email}
                  </span>
                </div>

                {/* Logout */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  className="bg-news-blue text-white hover:bg-blue-700"
                  onClick={handleLogin}
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
