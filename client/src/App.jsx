import { Routes } from 'react-router-dom'
import { commonRoutes } from './Routes/common.routes'
import { PrivateRoute } from './Routes/private.routes'

export default function App() {
  return (
    <>
    <PrivateRoute isAuthenticated={true} isAdmin={false}>
    <Routes>
      {commonRoutes}
    </Routes>
    </PrivateRoute>
    </>
  )
}
