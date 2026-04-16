import { Outlet } from 'react-router-dom'
import { Sidebar } from '../Sidebar'
import { Navbar } from '../Navbar'

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-50">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

