import React from 'react'

export default function UserIcon({user}) {
  return (
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
  )
}
