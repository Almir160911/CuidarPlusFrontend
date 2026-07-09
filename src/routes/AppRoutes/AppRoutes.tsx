import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../../layouts/AppLayout/AppLayout'
import { LoginPage } from '../../pages/Login/LoginPage/LoginPage'
import { DashboardPage } from '../../pages/Dashboard/DashboardPage/DashboardPage'
import { ElderlyPage } from '../../pages/Elderly//ElderlyPage'
import { PlaceholderPage } from '../../pages/Dashboard/PlaceholderPage/PlaceholderPage'
import { authService } from '../../services/auth.service'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return children
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="idosos" element={<ElderlyPage />} />
        <Route path="medicamentos" element={<PlaceholderPage title="Medicamentos" />} />
        <Route path="agendamentos" element={<PlaceholderPage title="Agendamentos de Medicamentos" />} />
        <Route path="cuidados" element={<PlaceholderPage title="Diário de Cuidados" />} />
        <Route path="sinais-vitais" element={<PlaceholderPage title="Sinais Vitais" />} />
        <Route path="consultas" element={<PlaceholderPage title="Consultas Médicas" />} />
        <Route path="alertas" element={<PlaceholderPage title="Alertas" />} />
        <Route path="relatorios" element={<PlaceholderPage title="Relatórios" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}