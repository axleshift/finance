import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'axios'
import { toast } from 'react-toastify'
import { apiURL } from '../../../context/client_store'

const Register = () => {
  const [data, setData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', // Default role, could be 'user', 'admin', etc.
    phone: '',
    address: '',
  })

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate if passwords match
    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      const response = await axios.post(`${apiURL}/api/user/register`, data)
      // Handle successful registration here
      console.log(response)
      toast.success(response.data.message)
    } catch (error) {
      // Handle errors
      console.error('Registration error:', error)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Full Name"
                      name="fullName"
                      value={data.fullName}
                      onChange={handleChange}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      name="email"
                      value={data.email}
                      onChange={handleChange}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={data.password}
                      onChange={handleChange}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      name="confirmPassword"
                      value={data.confirmPassword}
                      onChange={handleChange}
                    />
                  </CInputGroup>

                  {/* New Input Fields for Role, Phone, and Address */}
                  <CRow>
                    <CCol>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Role</CInputGroupText>
                        <CFormInput
                          placeholder="Role"
                          name="role"
                          value={data.role}
                          onChange={handleChange}
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>📞</CInputGroupText>
                        <CFormInput
                          placeholder="Phone Number"
                          name="phone"
                          value={data.phone}
                          onChange={handleChange}
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>🏠</CInputGroupText>
                    <CFormInput
                      placeholder="Address"
                      name="address"
                      value={data.address}
                      onChange={handleChange}
                    />
                  </CInputGroup>

                  <div className="d-grid">
                    <CButton color="success" type="submit">
                      Create Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
