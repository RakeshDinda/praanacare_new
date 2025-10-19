"use client"

import { useState, useEffect } from "react"
import { OnboardingScreen } from "./components/OnboardingScreen"
import { PatientDashboard } from "./components/PatientDashboard"
import { AIChat } from "./components/AIChat"
import { DoctorDashboard } from "./components/DoctorDashboard"
import { EmployerDashboard } from "./components/EmployerDashboard"
import { ThemeToggle } from "./components/ThemeToggle"
import { LoginScreen } from "./components/LoginScreen"
import { useAuth } from "./hooks/useAuth"

type Screen =
  | "login"
  | "onboarding"
  | "patient"
  | "chat"
  | "doctor"
  | "employer"
  | "vitals"
  | "consultations"
  | "emergency"
type UserRole = "patient" | "doctor" | "employer" | null

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login")
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme")
      return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    }
    return false
  })

  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user) {
      // Immediately set role and screen based on user data
      const role = user.role as UserRole
      setUserRole(role)
      switch (role) {
        case "patient":
          setCurrentScreen("patient")
          break
        case "doctor":
          setCurrentScreen("doctor")
          break
        case "employer":
          setCurrentScreen("employer")
          break
        default:
          setCurrentScreen("login")
      }
    } else {
      setUserRole(null)
      setCurrentScreen("login")
    }
  }, [isAuthenticated, user])

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role)
    switch (role) {
      case "patient":
        setCurrentScreen("patient")
        break
      case "doctor":
        setCurrentScreen("doctor")
        break
      case "employer":
        setCurrentScreen("employer")
        break
    }
  }

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen)
  }

  const handleLogout = () => {
    logout()
    setUserRole(null)
    setCurrentScreen("login")
  }

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    localStorage.setItem("theme", newIsDark ? "dark" : "light")
  }

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return <LoginScreen onRoleSelect={handleRoleSelect} />
      case "onboarding":
        return <OnboardingScreen onRoleSelect={handleRoleSelect} />
      case "patient":
        return <PatientDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
      case "chat":
        return <AIChat onNavigate={handleNavigate} />
      case "doctor":
        return <DoctorDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
      case "employer":
        return <EmployerDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
      default:
        return <LoginScreen onRoleSelect={handleRoleSelect} />
    }
  }

  return (
    <div className="size-full relative">
      {/* Theme Toggle - Fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </div>

      {renderScreen()}
    </div>
  )
}
