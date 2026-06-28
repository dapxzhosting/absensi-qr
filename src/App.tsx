import Dashboard from './pages/Dashboard'
import SeedPage from './pages/SeedPage'

const page = window.location.pathname === '/seed' ? 'seed' : 'dashboard'

export default function App() {
  if (page === 'seed') return <SeedPage />
  return <Dashboard />
}
