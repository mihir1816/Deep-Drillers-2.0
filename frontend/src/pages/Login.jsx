"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LogIn, Mail, Lock, AlertCircle, Loader, Shield } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

// Admin credentials - you can modify these as needed
const adminCredentials = [
  { email: "admin@evrental.com", password: "admin123" },
  { email: "superadmin@evrental.com", password: "super456" },
  { email: "manager@evrental.com", password: "manager789" }
]

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isAdminLogin, setIsAdminLogin] = useState(false)

  // Function to check if credentials match admin credentials
  const isAdminCredentials = (email, password) => {
    return adminCredentials.some(admin => 
      admin.email === email && admin.password === password
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Check if admin login is selected and credentials match
      if (isAdminLogin) {
        if (isAdminCredentials(formData.email, formData.password)) {
          // Admin login successful
          localStorage.setItem("token", "admin-token") // You can generate a proper token
          localStorage.setItem("user", JSON.stringify({
            _id: "admin",
            email: formData.email,
            role: "admin"
          }))
          localStorage.setItem("userId", "admin")

          // Notify other components about auth state change
          window.dispatchEvent(new Event("authChange"))

          toast.success("Admin login successful!")
          navigate("/admin")
          return
        } else {
          setError("Invalid admin credentials")
          toast.error("Invalid admin credentials")
          setLoading(false)
          return
        }
      }

      // Regular user login - existing API call
      const response = await axios.post("https://evrental.vercel.app/api/auth/login", formData)

      console.log("Login successful:", response.data)

      // Store token and user data in localStorage
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      const userId = response.data.user._id;
      localStorage.setItem("userId", userId);

      // Notify other components about auth state change
      window.dispatchEvent(new Event("authChange"))

      // Show success message
      toast.success("Login successful!")

      // Redirect to dashboard
      navigate("/")
    } catch (error) {
      console.error("Login error:", error)

      setError(error.response?.data?.message || error.message || "Login failed. Please try again.")

      toast.error(error.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <div className={`p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto ${
              isAdminLogin ? 'bg-red-100' : 'bg-green-100'
            }`}>
              {isAdminLogin ? (
                <Shield className={`h-8 w-8 ${isAdminLogin ? 'text-red-600' : 'text-green-600'}`} />
              ) : (
                <LogIn className={`h-8 w-8 ${isAdminLogin ? 'text-red-600' : 'text-green-600'}`} />
              )}
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {isAdminLogin ? 'Admin Login' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-gray-600">
              {isAdminLogin ? 'Sign in with admin credentials' : 'Sign in to your account to continue'}
            </p>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Admin Login Checkbox */}
            <div className="flex items-center">
              <input
                id="admin-login"
                name="admin-login"
                type="checkbox"
                checked={isAdminLogin}
                onChange={(e) => setIsAdminLogin(e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="admin-login" className="ml-2 block text-sm text-gray-700 font-medium">
                Admin Login
              </label>
              <Shield className="h-4 w-4 text-red-500 ml-1" />
            </div>

            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={`pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none ${
                      isAdminLogin 
                        ? 'focus:ring-red-500 focus:border-transparent' 
                        : 'focus:ring-green-500 focus:border-transparent'
                    }`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={isAdminLogin ? "Enter admin email" : "Enter your email"}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className={`pl-10 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none ${
                      isAdminLogin 
                        ? 'focus:ring-red-500 focus:border-transparent' 
                        : 'focus:ring-green-500 focus:border-transparent'
                    }`}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={isAdminLogin ? "Enter admin password" : "Enter your password"}
                  />
                </div>
              </div>
            </div>

            {!isAdminLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-green-600 hover:text-green-500">
                    Forgot your password?
                  </a>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                isAdminLogin 
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                  : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors`}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  {isAdminLogin ? 'Signing in as Admin...' : 'Signing in...'}
                </>
              ) : (
                <>
                  {isAdminLogin && <Shield className="h-4 w-4 mr-2" />}
                  {isAdminLogin ? 'Sign in as Admin' : 'Sign in'}
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-green-600 hover:text-green-500 font-medium">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login