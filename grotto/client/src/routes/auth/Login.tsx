import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [emailShake, setEmailShake] = useState(false)
  const [passwordShake, setPasswordShake] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function shake(setter: (v: boolean) => void) {
    setter(true)
    setTimeout(() => setter(false), 300)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    let valid = true

    if (!emailRe.test(email.trim())) {
      setEmailError(true)
      shake(setEmailShake)
      valid = false
    } else {
      setEmailError(false)
    }

    if (password.length < 8) {
      setPasswordError(true)
      shake(setPasswordShake)
      valid = false
    } else {
      setPasswordError(false)
    }

    if (!valid) return

    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md text-left">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-md bg-foreground/10 border border-border-media flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="10" width="3" height="5" rx="1" fill="currentColor" className="text-foreground/55" />
              <rect x="6" y="6" width="3" height="9" rx="1" fill="currentColor" className="text-foreground/70" />
              <rect x="11" y="2" width="3" height="13" rx="1" fill="currentColor" className="text-foreground/90" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Grotto</h1>
        </div>

        <div className="bg-card border border-border-media rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-2 text-center">Welcome back</h2>
          <p className="text-muted-foreground text-sm mb-6 text-center">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-6">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 bg-secondary border border-border-media rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all',
                    emailError && 'border-destructive',
                    emailShake && 'animate-shake',
                  )}
                />
              </div>
              {emailError && (
                <p className="text-xs text-destructive mt-1.5">Please enter a valid email address.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={cn(
                    'w-full pl-10 pr-10 py-2.5 bg-secondary border border-border-media rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all',
                    passwordError && 'border-destructive',
                    passwordShake && 'animate-shake',
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-destructive mt-1.5">Password must be at least 8 characters.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in…' : 'Sign in'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border-media" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border-media" />
          </div>

          <p className="text-sm text-center text-muted-foreground">
            New to Grotto?{' '}
            <Link to="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
