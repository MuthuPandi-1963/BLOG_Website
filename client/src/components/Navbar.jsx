import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Search,
  User,
  Bookmark,
  Home,
  Globe,
  Briefcase,
  Heart,
  Monitor,
  TrendingUp,
} from "lucide-react";
import Logo from "./Logo";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("home");
  const isAuthenticated = true;

  const categories = [
    { id: "home", name: "Home", icon: Home },
    { id: "world", name: "World", icon: Globe },
    { id: "business", name: "Business", icon: Briefcase },
    { id: "health", name: "Health", icon: Heart },
    { id: "technology", name: "Technology", icon: Monitor },
    { id: "trending", name: "Trending", icon: TrendingUp },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex w-full justify-between h-16">
          {/* Logo and categories */}
          <div className="flex-1  w-full flex items-center">
            {/* Logo */}
            <Logo />

            {/* Desktop categories */}
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-1">
              {isAuthenticated &&
                categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeCategory === category.id
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {category.name}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Search and user actions */}
          <div className="flex-1 flex items-center justify-end">
            {/* Search bar */}
            <div className="flex items-center border border-gray-300 rounded-sm px-2 py-1 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                className="pl-2 outline-none"
              />
            </div>

            {/* User actions */}
            <div className="hidden md:ml-4 md:flex md:items-center">
              {isAuthenticated ? (
                <>
                  <button className="p-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none">
                    <Bookmark className="h-5 w-5" />
                  </button>
                  <button className="ml-2 p-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none">
                    <User className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <div className="flex gap-x-2">
                  <Button className="ring-1">Login</Button>
                  <Button className=" text-black font-semibold  bg-white ring-1 ring-blue-400">
                    Signup
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {/* Mobile search */}
            <div className="relative mt-3 mb-4 mx-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Mobile categories */}
            {isAuthenticated &&
              categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      activeCategory === category.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {category.name}
                  </button>
                );
              })}

            {/* Mobile user actions */}
            <div className="pt-4 pb-3 border-t border-gray-200 mt-4">
              {isAuthenticated ? (
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      Guest User
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      viewer@example.com
                    </div>
                  </div>
                  <button className="ml-auto p-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                    <Bookmark className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="grid mx-4 gap-2">
                  <Button className="ring-1">Login</Button>
                  <Button className=" text-black font-semibold  bg-white ring-1 ring-blue-400">
                    Signup
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
