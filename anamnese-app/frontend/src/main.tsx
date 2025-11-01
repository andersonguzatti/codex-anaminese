import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App'
import { bootstrapCurrentUser } from './lib/api'
import HomePage from './pages/HomePage'
import AnamnesisListPage from './pages/AnamnesisListPage'
import NewIntakePage from './pages/NewIntakePage'
import AnamnesisDetailsPage from './pages/AnamnesisDetailsPage'
import ProfilePage from './pages/ProfilePage'
import AccessManagementPage from './pages/AccessManagementPage'

bootstrapCurrentUser()

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/perfil', element: <ProfilePage /> },
      { path: '/gestao-acessos', element: <AccessManagementPage /> },
      { path: '/anamnese', element: <AnamnesisListPage /> },
      { path: '/anamnese/new', element: <NewIntakePage /> },
      { path: '/anamnese/:id', element: <AnamnesisDetailsPage /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
