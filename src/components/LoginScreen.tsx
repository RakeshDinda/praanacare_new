"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "motion/react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Heart, Stethoscope, Building2, Brain, AlertCircle } from "lucide-react"
import { useAuth } from "../hooks/useAuth"

interface LoginScreenProps {
  onRoleSelect: (role: "patient" | "doctor" | "employer") => void
}

export function LoginScreen({ onRoleSelect }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor" | "employer" | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isLogin) {
        const result = await login(email, password)
        if (result.success) {
          // Let the server decide the role and path
          const role = result.redirectPath.includes('doctor') ? 'doctor' : 
                      result.redirectPath.includes('employer') ? 'employer' : 'patient'
          onRoleSelect(role)
        } else {
          setError("Invalid credentials")
        }
      } else {
        if (!selectedRole) {
          setError("Please select a role")
          setLoading(false)
          return
        }
        const result = await register(email, password, name, selectedRole)
        if (result.success) {
          onRoleSelect(selectedRole)
        } else {
          setError("Registration failed")
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const demoCredentials = [
    { email: "patient@example.com", password: "password123", role: "patient" as const },
    { email: "doctor@example.com", password: "password123", role: "doctor" as const },
    { email: "employer@example.com", password: "password123", role: "employer" as const },
  ]

  const handleDemoLogin = async (demoEmail: string, demoPassword: string, role: "patient" | "doctor" | "employer") => {
    setLoading(true)
    setError("")
    const success = await login(demoEmail, demoPassword)
    if (success) {
      onRoleSelect(role)
    } else {
      setError("Demo login failed")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background grid-pattern flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-6"
      >
        {/* Logo */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center space-x-3"
          >
            <Brain className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              PraanaCare
            </h1>
          </motion.div>
          <p className="text-muted-foreground">AI-Powered Occupational Health</p>
        </div>

        {/* Login/Register Form */}
        <Card className="glass-card border border-primary/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="glass-card border-primary/30"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-card border-primary/30"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-card border-primary/30"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Select Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { role: "patient" as const, label: "Worker", icon: Heart },
                      { role: "doctor" as const, label: "Doctor", icon: Stethoscope },
                      { role: "employer" as const, label: "Employer", icon: Building2 },
                    ].map((option) => (
                      <button
                        key={option.role}
                        type="button"
                        onClick={() => setSelectedRole(option.role)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedRole === option.role
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <option.icon className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg"
              >
                {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Or try demo</span>
              </div>
            </div>

            {/* Demo Buttons */}
            <div className="space-y-2">
              {demoCredentials.map((demo) => (
                <Button
                  key={demo.role}
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin(demo.email, demo.password, demo.role)}
                  disabled={loading}
                  className="w-full border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
                >
                  Demo: {demo.role.charAt(0).toUpperCase() + demo.role.slice(1)}
                </Button>
              ))}
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError("")
                }}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">Secure • HIPAA Compliant • AI-Powered Healthcare</p>
      </motion.div>
    </div>
  )
}
