import React, { Suspense, useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import axios from 'axios'
import { apiURL } from './context/client_store'
import client_store from './context/client_store'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { token } = client_store()
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
  const [isTokenVerified, setIsTokenVerified] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const theme = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)[0]

    if (theme) setColorMode(theme)
    else if (!isColorModeSet()) setColorMode(storedTheme)
  }, [storedTheme, isColorModeSet, setColorMode])

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token')
      if (!storedToken && !['/login', '/register'].includes(location.pathname)) {
        navigate('/login')
        return
      }

      if (storedToken) {
        try {
          const response = await axios.post(`${apiURL}/api/verifyToken`, { token: storedToken })
          if (response.data.valid) {
            setIsTokenVerified(true)
          } else {
            handleInvalidToken()
          }
        } catch (error) {
          handleInvalidToken()
        }
      }
    }

    const handleInvalidToken = () => {
      localStorage.removeItem('token')
      setIsTokenVerified(false)
      if (!['/login', '/register'].includes(location.pathname)) {
        navigate('/login')
      }
    }

    verifyToken()
  }, [location.pathname, navigate])

  return (
    <div>
      <ToastContainer />
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route path="*" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
