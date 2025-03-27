
import React, { useState } from "react"
import Link from "next/link"

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="p-6 bg-blue-600 text-white">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        
        <nav className="p-6 space-y-1">
          <Link 
            href="/dashboard" 
            className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Overview
          </Link>
          <Link 
            href="/dashboard/bookings" 
            className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            My Bookings
          </Link>
          <Link 
            href="/dashboard/account" 
            className="block px-4 py-2 rounded-lg text-blue-600 bg-blue-50 font-medium"
          >
            Account Info
          </Link>
          <Link 
            href="/dashboard/help" 
            className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Help & Support
          </Link>
        </nav>
      </div>
      
      {/* Content */}
      <div className="flex-1 md:ml-64">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <button 
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, User</span>
            <button className="p-2 rounded-full bg-gray-100">
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>image.png
            <button className="p-1 rounded-full bg-gray-200">
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </header>
        
        <main className="container mx-auto py-6">
          {children}
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 md:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}

export default DashboardLayout 