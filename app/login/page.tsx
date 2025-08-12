"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { login } from "./actions"
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react"
import { useState } from "react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    try {
      await login(formData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Animated Background with Zenger Colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,69,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(124,58,237,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-400/15 to-violet-600/15 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-300/10 to-amber-400/10 rounded-full blur-2xl animate-pulse delay-2000" />
        </div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-violet-400/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-purple-400/30 rotate-45 animate-pulse delay-700"></div>
        <div className="absolute bottom-32 left-40 w-5 h-5 bg-yellow-400/40 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-violet-500/40 animate-pulse delay-500"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
          staggerChildren: 0.1,
        }}
        className="w-full max-w-md relative z-10"
      >
        {/* Enhanced Login Card with Zenger styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <Card className="w-full border-0 shadow-2xl bg-white/90 backdrop-blur-xl relative overflow-hidden hover:shadow-3xl transition-all duration-500">
            {/* Enhanced card background gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 via-white/50 to-purple-50/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-100/30 to-transparent opacity-60" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-violet-600" />

            <CardHeader className="space-y-4 pb-8 relative z-10">
              <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-3 text-slate-800">
                <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg shadow-lg">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                Sign In
              </CardTitle>
              <CardDescription className="text-center text-base text-slate-600 font-medium">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 space-y-8">
              <form action={handleSubmit} className="space-y-7">
                {/* Enhanced Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="space-y-3"
                >
                  <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2 text-slate-700">
                    <div className="p-1 bg-violet-100 rounded">
                      <Mail className="w-4 h-4 text-violet-600" />
                    </div>
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      className="h-14 pl-12 pr-4 text-base border-2 border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300 group-hover:border-violet-300 hover:bg-white placeholder:text-slate-400"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors duration-200" />
                  </div>
                </motion.div>

                {/* Enhanced Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="space-y-3"
                >
                  <Label htmlFor="password" className="text-base font-semibold flex items-center gap-2 text-slate-700">
                    <div className="p-1 bg-violet-100 rounded">
                      <Lock className="w-4 h-4 text-violet-600" />
                    </div>
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter your password"
                      className="h-14 pl-12 pr-12 text-base border-2 border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300 group-hover:border-violet-300 hover:bg-white placeholder:text-slate-400"
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors duration-200" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-violet-500 transition-colors duration-200 p-1 rounded-md hover:bg-violet-50"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                {/* Enhanced Login Button with Zenger branding */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="pt-6"
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 text-base font-semibold rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 hover:from-violet-700 hover:via-purple-700 hover:to-violet-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 relative z-10">
                        Sign In
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Additional footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-center pt-4 border-t border-slate-100"
              >
                <p className="text-sm text-slate-500">
                  Secure login portal
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}