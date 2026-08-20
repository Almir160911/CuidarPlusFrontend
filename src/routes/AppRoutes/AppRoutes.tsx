import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import type { ReactNode } from 'react'

import { AppLayout } from '../../layouts/AppLayout/AppLayout'

import LoginPage from '../../pages/Login/LoginPage/LoginPage'
import { DashboardPage } from '../../pages/Dashboard/DashboardPage/DashboardPage'
import { ElderlyPage } from '../../pages/Elderly/ElderlyPage'
import { ElderlyRecordPage } from '../../pages/ElderlyRecord/ElderlyRecordPage'
import { UnifiedCalendarPage } from '../../pages/UnifiedCalendar/UnifiedCalendarPage'
import { MedicalAppointmentsPage } from '../../pages/MedicalAppointments/MedicalAppointmentsPage'
import { AlertsPage } from '../../pages/Alerts/AlertsPage'
import { ReportsPage } from '../../pages/Reports/ReportsPage'
import { MedicationsPage } from '../../pages/Medications/MedicationsPage'
import { CareLogsPage } from '../../pages/CareLogs/CareLogsPage'
import { VitalSignsPage } from '../../pages/VitalSigns/VitalSignsPage'

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
          element={<MedicationsPage />}
        />

        <Route
          path="agendamentos"
          element={
            <UnifiedCalendarPage />
          }
        />

        <Route
          path="cuidados"
          element={<CareLogsPage />}
        />

        <Route
          path="sinais-vitais"
          element={<VitalSignsPage />}
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
          element={<ReportsPage />}
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
