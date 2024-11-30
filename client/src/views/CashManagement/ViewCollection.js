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
import { toast } from 'react-toastify'
import { FaRegPlusSquare } from 'react-icons/fa'

const CashSummary = () => {
  const { userData, fetchUserData } = client_store()

  // State variables
  const [operation, setOperation] = useState('') // To differentiate Deposit/Withdraw
  const [amountModalVisible, setAmountModalVisible] = useState(false)
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [transactionAmount, setTransactionAmount] = useState('')
  const [password, setPassword] = useState('')
  const [totalCompanyCash, setTotalCompanyCash] = useState(null)

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData()
    fetchTotalCompanyCash()
  }, [])

  // Fetch total cash of the company
  const fetchTotalCompanyCash = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/totalCash`)
      setTotalCompanyCash(response.data)
    } catch (error) {
      console.error('Error fetching total company cash:', error?.response?.data?.message || error)
    }
  }

  // Handle deposit or withdrawal
  const handleTransaction = async () => {
    if (!transactionAmount || !password) {
      toast.error('Please enter an amount and password.')
      return
    }

    try {
      const endpoint =
        operation === 'Deposit' ? `${apiURL}/api/deposit/create` : `${apiURL}/api/withdraw/create`

      const payload = {
        email: userData?.email,
        password,
        totalAmount: transactionAmount,
      }

      const response = await axios.post(endpoint, payload)
      toast.success(response.data.message)

      // Refresh total cash after transaction
      fetchTotalCompanyCash()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Transaction failed.')
    }

    // Reset modal states
    setPasswordModalVisible(false)
    setTransactionAmount('')
    setPassword('')
  }

  // Open transaction modals
  const openTransactionModals = (transactionType) => {
    setOperation(transactionType)
    setAmountModalVisible(true)
  }

  // Dynamic cash data
  const cashData = [
    {
      title: 'Total Cash of the Company',
      value: totalCompanyCash !== null ? `$${totalCompanyCash}` : 'Loading...',
      color: 'primary',
    },
    { title: 'Cash Deposit', color: 'success' },
    { title: 'Cash Withdrawal', color: 'danger' },
  ]

  return (
    <CRow>
      {cashData.map((cashItem, index) => (
        <CCol xs={4} key={index}>
          <CWidgetStatsF
            className="mb-3"
            color={cashItem.color}
            icon={<CIcon icon={cilChartPie} height={24} />}
            title={cashItem.title}
            value={cashItem.value || ''}
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
          <CModalTitle>Enter {operation} Amount</CModalTitle>
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
