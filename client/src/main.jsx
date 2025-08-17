import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Catalog from './pages/Catalog.jsx'
import ProductPage from './pages/ProductPage.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Profile from './pages/Profile.jsx'
import Auth from './pages/Auth.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Catalog /> },
      { path: 'product/:slug', element: <ProductPage /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'profile', element: <Profile /> },
      { path: 'auth', element: <Auth /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
