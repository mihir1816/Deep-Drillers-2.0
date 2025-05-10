"use client"
import { FaBell, FaUser, FaSearch, FaMoon, FaSun } from "react-icons/fa"

const Header = ({ toggleTheme, isDarkMode }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
      <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 w-64">
        <FaSearch className="text-gray-500 dark:text-gray-400" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="ml-2 bg-transparent border-none focus:outline-none w-full dark:text-gray-200"
        />
      </div>

      <div className="flex items-center space-x-6">
        <button 
          onClick={toggleTheme}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? 
            <FaSun className="text-yellow-500" /> : 
            <FaMoon className="text-gray-600 dark:text-gray-300" />
          }
        </button>

        <div className="relative cursor-pointer">
          <FaBell className="text-gray-600 dark:text-gray-300 text-xl" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </div>

        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="bg-gray-200 dark:bg-gray-600 w-10 h-10 rounded-full flex items-center justify-center">
            <FaUser className="text-gray-600 dark:text-gray-300" />
          </div>
          <div>
            <h4 className="text-sm font-medium dark:text-gray-200">Admin User</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header