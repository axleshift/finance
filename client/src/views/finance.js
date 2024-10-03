import React, { useState } from 'react'
import { CRow, CCol, CFormInput } from '@coreui/react'

const NameForm = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const handleFirstNameChange = (e) => setFirstName(e.target.value)
  const handleLastNameChange = (e) => setLastName(e.target.value)

  return (
    <div>
      <CRow>
        <CCol xs>
          <CFormInput
            placeholder="First name"
            aria-label="First name"
            value={firstName}
            onChange={handleFirstNameChange}
          />
        </CCol>
        <CCol xs>
          <CFormInput
            placeholder="Last name"
            aria-label="Last name"
            value={lastName}
            onChange={handleLastNameChange}
          />
        </CCol>
      </CRow>
      <div>
        <h2>Entered Name:</h2>
        <p>{`${firstName} ${lastName}`}</p>
      </div>
    </div>
  )
}

export default NameForm
