import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/goats', label: 'Goats' },
  { to: '/feeding', label: 'Feeding' },
  { to: '/health', label: 'Health' },
  { to: '/expense', label: 'Expense' },
  { to: '/sales', label: 'Sales' },
]

export const Sidebar = () => {
  return (
    <aside className="hidden h-full w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white/80 px-4 py-6 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80 md:flex">
      <div className="mb-6 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold">
          M
        </span>
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Goat Farm
          </div>
          <div className="text-xs text-gray-500">Management System</div>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 text-sm">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center rounded-md px-3 py-2 transition-colors ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

