import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CBadge,
  CButton,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImage,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import client_store from '../../context/client_store'

import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [visibleProfile, setVisibleProfile] = useState(false)
  const { userData, fetchUserData } = client_store()
  const handleLogout = async () => {
    localStorage.removeItem('token')
    navigate('/login')
  }
  useEffect(() => {
    fetchUserData()
  }, [])

  const handleProfile = () => {
    setVisibleProfile(true) // Open the modal
  }

  console.log(userData)
  return (
    <div>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          <CAvatar src={userData?.image} size="md" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          {/* <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
          <CDropdownItem href="#">
            <CIcon icon={cilBell} className="me-2" />
            Updates
            <CBadge color="info" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilEnvelopeOpen} className="me-2" />
            Messages
            <CBadge color="success" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilTask} className="me-2" />
            Tasks
            <CBadge color="danger" className="ms-2">
              42
            </CBadge>
          </CDropdownItem> */}
          <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
          <CDropdownItem onClick={handleProfile}>
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilSettings} className="me-2" />
            Settings
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem onClick={handleLogout}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Logout
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      {/* Profile Modal */}
      <CModal alignment="center" visible={visibleProfile} onClose={() => setVisibleProfile(false)}>
        <CModalHeader>
          <CModalTitle>Profile Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>
            <div className="clearfix py-3">
              <CImage align="center" rounded src={userData?.image} width={200} height={200} />
            </div>
            <p>
              <strong>Full Name:</strong> {userData?.fullName}
            </p>
            <p>
              <strong>Email:</strong> {userData?.email}
            </p>
            <p>
              <strong>Role:</strong> {userData?.role}
            </p>
            <p>
              <strong>Phone:</strong> {userData?.phone}
            </p>
            <p>
              <strong>Address:</strong> {userData?.address}
            </p>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleProfile(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default AppHeaderDropdown
