"use client";

import { useState, useEffect } from "react";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { PatientDashboard } from "./components/PatientDashboard";
import { AIChat } from "./components/AIChat";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { EmployerDashboard } from "./components/EmployerDashboard";
import { ThemeToggle } from "./components/ThemeToggle";
import { LoginScreen } from "./components/LoginScreen";
import { useAuth } from "./hooks/useAuth";

type Screen =
  | "login"
  | "onboarding"
  | "patient"
  | "chat"
  | "doctor"
  | "employer"
  | "vitals"
  | "consultations"
  | "emergency";
type UserRole = "patient" | "doctor" | "employer" | null;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isDark, setIsDark] = useState<boolean | null>(null);

  const { user, isAuthenticated, logout } = useAuth();

  // ✅ Handle authentication + role routing
  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role as UserRole;
      setUserRole(role);
      switch (role) {
        case "patient":
          setCurrentScreen("patient");
          break;
        case "doctor":
          setCurrentScreen("doctor");
          break;
        case "employer":
          setCurrentScreen("employer");
          break;
        default:
          setCurrentScreen("login");
      }
    } else {
      setUserRole(null);
      setCurrentScreen("login");
    }
  }, [isAuthenticated, user]);

  // ✅ Handle role selection
  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    switch (role) {
      case "patient":
        setCurrentScreen("patient");
        break;
      case "doctor":
        setCurrentScreen("doctor");
        break;
      case "employer":
        setCurrentScreen("employer");
        break;
    }
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleLogout = () => {
    logout();
    setUserRole(null);
    setCurrentScreen("login");
  };

  // ✅ SAFE THEME TOGGLE (no localStorage at declaration time)
  const toggleTheme = () => {
    setIsDark((prev) => {
      const newIsDark = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newIsDark ? "dark" : "light");
      }
      return newIsDark;
    });
  };

  // ✅ Load saved theme safely
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(saved === "dark" || (!saved && prefersDark));
  }, []);

  // ✅ Apply dark mode class
  useEffect(() => {
    if (isDark === null) return;
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // ✅ Render screen logic
  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return <LoginScreen onRoleSelect={handleRoleSelect} />;
    }
  }
}
