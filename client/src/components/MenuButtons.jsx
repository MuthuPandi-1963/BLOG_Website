import { Button } from "../components/ui/button";
export default function MenuButtons({ isAuthenticated = false }) {
  return (
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
                onClick={() => console.log("Hii")}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          )}

          {/* User Info */}
          <UserIcon user={user} />

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
          <div className="grid mx-4 gap-2">
            <Button className="ring-1">Login</Button>
            <Button className=" text-black font-semibold  bg-white ring-1 ring-blue-400">
              Signup
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
