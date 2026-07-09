import { Outlet } from 'react-router-dom'
import { Sidebar } from '../../components/layout/Sidebar/Sidebar'
import { Topbar } from '../../components/layout/Topbar/Topbar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar />

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}