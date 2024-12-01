import { CCol, CRow } from '@coreui/react'
import React from 'react'

const Profile = () => {
  return (
    <div>
      <div>
        <h3 className="py-3">Hello, Test2</h3>
        <h6 className="italic text-sm">Change your profile information & password from here...</h6>
      </div>
      <CRow className="">
        <CCol>
          Profile Image
          <img src="" alt="" />

          
        </CCol>
        <CCol>
          Profile Image
          <img src="" alt="" />
        </CCol>
        <CCol></CCol>
      </CRow>
    </div>
  )
}

export default Profile
