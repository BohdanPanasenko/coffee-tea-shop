import { useState, useEffect, createContext, useContext } from 'react'

const AuthContext = createContext()

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
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
        setUser(userWithLogin) 
        localStorage.setItem('user', JSON.stringify(userWithLogin))
    }

    const logout = () => {
        setUser(null) 
        localStorage.removeItem('user')
    }

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
