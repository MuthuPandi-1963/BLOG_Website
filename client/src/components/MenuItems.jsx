
export default function MenuItems({isAuthenticated = false,categories,setActiveCategory,activeCategory ,mobileView = false ,setIsMenuOpen}) {
  return (
    <>
    {mobileView ?
    <div className="hidden md:ml-6 md:flex md:items-center md:space-x-1">
              {isAuthenticated && categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeCategory === category.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {category.name}
                  </button>
                );
              })}
            </div>
            :
            <>
            {isAuthenticated && categories.map((category) => {
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
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  >
                  <Icon className="h-5 w-5 mr-3" />
                  {category.name}
                </button>
              );
            })}
          </>
          }
    </>

  )
}


