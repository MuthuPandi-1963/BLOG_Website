import { BsGlobeCentralSouthAsia } from "react-icons/bs";

export default function Footer() {
  return (
    <>
    <footer className="bg-news-gray text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <BsGlobeCentralSouthAsia className="w-8 h-8 mr-3" />
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
    </>
  )
}
