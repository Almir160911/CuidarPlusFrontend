import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import type { ReactNode } from 'react'

import { AppLayout } from '../../layouts/AppLayout/AppLayout'

import LoginPage from '../../pages/Login/LoginPage/LoginPage'
import { DashboardPage } from '../../pages/Dashboard/DashboardPage/DashboardPage'
import { PlaceholderPage } from '../../pages/Dashboard/PlaceholderPage/PlaceholderPage'
import { ElderlyPage } from '../../pages/Elderly/ElderlyPage'
import { ElderlyRecordPage } from '../../pages/ElderlyRecord/ElderlyRecordPage'
import { UnifiedCalendarPage } from '../../pages/UnifiedCalendar/UnifiedCalendarPage'
import { MedicalAppointmentsPage } from '../../pages/MedicalAppointments/MedicalAppointmentsPage'
import { AlertsPage } from '../../pages/Alerts/AlertsPage'

import { authService } from '../../services/auth.service'

interface PrivateRouteProps {
  children: ReactNode
}

function PrivateRoute({
  children,
}: PrivateRouteProps) {
  if (!authService.isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return children
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route
          index
          element={<DashboardPage />}
        />

        <Route
          path="idosos"
          element={<ElderlyPage />}
        />

        <Route
          path="idosos/:id"
          element={<ElderlyRecordPage />}
        />

        <Route
          path="medicamentos"
          element={
            <PlaceholderPage title="Medicamentos" />
          }
        />

        <Route
          path="agendamentos"
          element={
            <UnifiedCalendarPage />
          }
        />

        <Route
          path="cuidados"
          element={
            <PlaceholderPage title="Diário de Cuidados" />
          }
        />

        <Route
          path="sinais-vitais"
          element={
            <PlaceholderPage title="Sinais Vitais" />
          }
        />

        <Route
          path="consultas"
          element={<MedicalAppointmentsPage />}
        />

        <Route
          path="alertas"
          element={<AlertsPage />}
        />

        <Route
          path="relatorios"
          element={
            <PlaceholderPage title="Relatórios" />
          }
        />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  )
}
