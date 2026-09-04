import {
  useEffect,
  useState,
} from 'react'
import {
  Outlet,
  useLocation,
} from 'react-router-dom'

import { Sidebar } from '../../components/layout/Sidebar/Sidebar'
import { Topbar } from '../../components/layout/Topbar/Topbar'
import { OnboardingTutorial } from '../../components/onboarding/OnboardingTutorial'

export function AppLayout() {
  const location = useLocation()

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileMenuOpen) {
      return
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow =
      'hidden'

    return () => {
      document.body.style.overflow =
        previousOverflow
    }
  }, [mobileMenuOpen])

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() =>
          setMobileMenuOpen(false)
        }
      />

      <div className="lg:pl-72">
        <Topbar
          onMenuClick={() =>
            setMobileMenuOpen(true)
          }
        />

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <OnboardingTutorial />
    </div>
  )
}
