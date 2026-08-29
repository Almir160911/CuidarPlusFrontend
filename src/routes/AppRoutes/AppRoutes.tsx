import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import type { ReactNode } from 'react'

import { AppLayout } from '../../layouts/AppLayout/AppLayout'

import LoginPage from '../../pages/Login/LoginPage/LoginPage'
import { ForgotPasswordPage } from '../../pages/ForgotPassword/ForgotPasswordPage'
import { ResetPasswordPage } from '../../pages/ResetPassword/ResetPasswordPage'
import { RegisterPage } from '../../pages/Register/RegisterPage'
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
import { MyElderlyPage } from '../../pages/MyElderly/MyElderlyPage'

import { authService } from '../../services/auth.service'

interface RouteProps {
  children: ReactNode
}

function isGlobalAdmin(): boolean {
  const role =
    authService.getUser()?.role?.toLowerCase()

  return (
    role === 'systemadmin' ||
    role === 'familyadmin'
  )
}

function PrivateRoute({
  children,
}: RouteProps) {
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

function AdminRoute({
  children,
}: RouteProps) {
  if (!isGlobalAdmin()) {
    return (
      <Navigate
        to="/minhas-pessoas"
        replace
      />
    )
  }

  return children
}

function HomeRoute() {
  if (isGlobalAdmin()) {
    return <DashboardPage />
  }

  return (
    <Navigate
      to="/minhas-pessoas"
      replace
    />
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />

      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
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
          element={<HomeRoute />}
        />

        <Route
          path="minhas-pessoas"
          element={<MyElderlyPage />}
        />

        <Route
          path="idosos/:id"
          element={<ElderlyRecordPage />}
        />

        <Route
          path="agendamentos"
          element={<UnifiedCalendarPage />}
        />

        <Route
          path="idosos"
          element={
            <AdminRoute>
              <ElderlyPage />
            </AdminRoute>
          }
        />

        <Route
          path="medicamentos"
          element={
            <AdminRoute>
              <MedicationsPage />
            </AdminRoute>
          }
        />

        <Route
          path="cuidados"
          element={
            <AdminRoute>
              <CareLogsPage />
            </AdminRoute>
          }
        />

        <Route
          path="sinais-vitais"
          element={
            <AdminRoute>
              <VitalSignsPage />
            </AdminRoute>
          }
        />

        <Route
          path="consultas"
          element={
            <AdminRoute>
              <MedicalAppointmentsPage />
            </AdminRoute>
          }
        />

        <Route
          path="alertas"
          element={
            <AdminRoute>
              <AlertsPage />
            </AdminRoute>
          }
        />

        <Route
          path="relatorios"
          element={
            <AdminRoute>
              <ReportsPage />
            </AdminRoute>
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
