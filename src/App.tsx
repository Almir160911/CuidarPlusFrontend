import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}