import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Button } from './ui/Button'

export const Navbar = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white/60 px-4 backdrop-blur dark:border-gray-800 dark:bg-gray-900/60">
      <div className="md:hidden">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold">
          GF
        </span>
      </div>
      <div className="flex-1 px-2 text-sm text-gray-500 dark:text-gray-400 md:px-0">
        Welcome to Goat Farm Management
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={toggleTheme}>
          {theme === 'light' ? 'Dark' : 'Light'} mode
        </Button>
        {user && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/30 dark:text-emerald-400">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="hidden text-sm text-gray-700 dark:text-gray-200 md:inline">
              {user.username}
            </span>
          </div>
        )}
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  )
}

