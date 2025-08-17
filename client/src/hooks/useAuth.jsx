import { useState, useEffect, createContext, useContext } from 'react'

// Create a context for authentication
const AuthContext = createContext()

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on component mount
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        if (userData.isLoggedIn) {
          setUser(userData)
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData) => {
    const userWithLogin = { ...userData, isLoggedIn: true }
    setUser(userWithLogin) // This will trigger re-render in all components
    localStorage.setItem('user', JSON.stringify(userWithLogin))
  }

  const logout = () => {
    setUser(null) // This will trigger re-render in all components
    localStorage.removeItem('user')
  }

  // Calculate isLoggedIn as a computed value that will be reactive
  const isLoggedIn = Boolean(user && user.isLoggedIn)

  const value = {
    user,
    isLoading,
    isLoggedIn,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
