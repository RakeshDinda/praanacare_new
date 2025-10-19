"use client"

import { useState, useCallback } from "react"
import { apiClient } from "@/lib/api-client"

export interface User {
  id: string
  email: string
  name: string
  role: "patient" | "doctor" | "employer"
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  })

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token")
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.login(email, password)
      if (response.error) {
        setError(response.error)
        return { success: false }
      }
      setUser(response.user)
      setToken(response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
      localStorage.setItem("token", response.token)
      return { success: true, redirectPath: response.redirectPath }
    } catch (err) {
      setError("Login failed")
      return { success: false }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name: string, role: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.register(email, password, name, role)
      if (response.error) {
        setError(response.error)
        return false
      }
      setUser(response.user)
      setToken(response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
      localStorage.setItem("token", response.token)
      return true
    } catch (err) {
      setError("Registration failed")
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }, [])

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }
}
