import React, { useEffect, useState } from 'react'
import {
  CWidgetStatsF,
  CRow,
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilChartPie } from '@coreui/icons'
import axios from 'axios'
import { apiURL } from '../../context/client_store'
import client_store from '../../context/client_store'

const cashData = [
  { title: 'Total Cash of the Company', value: '$100,000', color: 'primary' },
  { title: 'Cash Deposit', value: '$25,000', color: 'success' },
  { title: 'Cash Withdrawal', value: '$15,000', color: 'danger' },
]

const CashSummary = () => {
  const { userData, fetchUserData } = client_store()

  useEffect(() => {
    fetchUserData()
  }, [])
  console.log(userData)
  const [operation, setOperation] = useState('') // To differentiate Deposit/Withdraw
  const [amountModalVisible, setAmountModalVisible] = useState(false)
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [transactionAmount, setTransactionAmount] = useState('')
  const [password, setPassword] = useState('')

  const handleTransaction = async () => {
    // Logic for handling Deposit/Withdraw
    console.log(`${operation} Amount:`, transactionAmount)
    console.log('Password:', password)

    if (operation === 'Deposit') {
      try {
        const response = await axios.post(`${apiURL}/api/deposit/create`, {
          // email
          password: password,
          totalAmount: transactionAmount,
        })
      } catch (error) {}
    } else {
      try {
      } catch (error) {}
    }
    setPasswordModalVisible(false)
    setTransactionAmount('')
    setPassword('')
  }

  const openTransactionModals = (transactionType) => {
    setOperation(transactionType)
    setAmountModalVisible(true)
  }

  return (
    <CRow>
      {cashData.map((cashItem, index) => (
        <CCol xs={4} key={index}>
          <CWidgetStatsF
            className="mb-3"
            color={cashItem.color}
            icon={<CIcon icon={cilChartPie} height={24} />}
            title={cashItem.title}
            value={cashItem.value}
            onClick={() =>
              cashItem.title === 'Cash Deposit'
                ? openTransactionModals('Deposit')
                : cashItem.title === 'Cash Withdrawal' && openTransactionModals('Withdraw')
            }
            style={{ cursor: 'pointer' }}
          />
        </CCol>
      ))}

      {/* Amount Modal */}
      <CModal
        alignment="center"
        visible={amountModalVisible}
        onClose={() => setAmountModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Enter {operation === 'Deposit' ? 'Deposit' : 'Withdraw'} Amount</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="number"
            placeholder={`Enter ${operation.toLowerCase()} amount`}
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAmountModalVisible(false)}>
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={() => {
              setAmountModalVisible(false)
              setPasswordModalVisible(true)
            }}
          >
            Next
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Password Modal */}
      <CModal
        alignment="center"
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Enter Password</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setPasswordModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleTransaction}>
            Confirm {operation}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default CashSummary
