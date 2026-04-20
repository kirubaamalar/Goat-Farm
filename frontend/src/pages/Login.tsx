import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import goatImg from "../assets/goat.png"

export const Login = () => {
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login(username, password)
      navigate('/', { replace: true })
    } catch (err: any) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* 🔥 Background Image */}
      <img
        src={goatImg}
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />

      {/* 🔥 Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40"></div>

      {/* 🔥 Animated Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md mx-4"
      >

        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-8">

          {/* 🔥 Logo */}
          <div className="text-center mb-6">
            <span className="px-4 py-1 border border-white/30 rounded-full text-sm text-white/90">
              🐐 Malar Goat Farm
            </span>
          </div>

          {/* 🔥 Title */}
          <h2 className="text-3xl font-semibold text-center text-white mb-2">
            Welcome Back
          </h2>

          <p className="text-gray-300 text-center mb-6">
            Manage your farm operations like a pro
          </p>

          {/* 🔥 FORM */}
          <form onSubmit={onSubmit} className="space-y-5">

            {/* Username */}
            <div className="relative">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              />

              {/* 👁 Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-300 hover:text-white"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            {error && (
              <p className="text-red-300 text-sm text-center">{error}</p>
            )}

            {/* 🔥 Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold shadow-lg hover:shadow-yellow-500/40 transition"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}