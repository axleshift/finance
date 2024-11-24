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
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()
  const [isTokenVerified, setIsTokenVerified] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const theme = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)[0]

    if (theme) setColorMode(theme)
    else if (!isColorModeSet()) setColorMode(storedTheme)
  }, [storedTheme, isColorModeSet, setColorMode])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/user/account`, {
          headers: { token: token },
        })
        setUserData(response.data)
        console.log(response.data)
      } catch (error) {
        console.error(error?.response?.data?.message)
      }
    }

    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token')
      if (!storedToken && location.pathname !== '/login') {
        navigate('/login')
        return
      }
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

    const handleInvalidToken = () => {
      localStorage.removeItem('token')
      setIsTokenVerified(false)
      navigate('/login')
    }

    if (!isTokenVerified) verifyToken()
    if (!userData) fetchUserData()
  }, [navigate, location.pathname, isTokenVerified, token, userData])

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
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
