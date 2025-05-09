import DataTable from 'datatables.net-dt'
import React, { useEffect, useState } from 'react'
import {
  CButton,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'
import { toast } from 'react-toastify'
import axios from 'axios'
import client_store from '../../context/client_store'
import { apiURL } from '../../context/client_store'

const BudgetList = () => {
  const [loading, setLoading] = useState(false)
  const [visibleView, setVisibleView] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false)
  const [visibleDeclineReason, setVisibleDeclineReason] = useState(false)
  const [selectedData, setSelectedData] = useState(null)
  const [budgetData, setBudgetData] = useState([])
  const [visibleAddBudget, setVisibleAddBudget] = useState(false)
  const [status, setStatus] = useState(null)
  const [requestIdToDelete, setRequestIdToDelete] = useState(null)
  const [declineReason, setDeclineReason] = useState('')

  const { token, userData } = client_store()

  const fetchBudgetData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/budgetRequest`)
      const onProcessData = response.data.filter(
        (item) => item.status === 'On Process' && item.isArichived === false,
      )
      setBudgetData(onProcessData)
    } catch (error) {
      console.log(error?.response?.data)
    }
  }

  useEffect(() => {
    fetchBudgetData()
  }, [])

  useEffect(() => {
    const table = new DataTable('#myTable', {
      data: budgetData,
      columns: [
        { title: 'Request ID', data: 'requestId' },
        { title: 'Department', data: 'department' },
        { title: 'Type of Request', data: 'typeOfRequest' },
        { title: 'Category', data: 'category' },
        { title: 'Total Request', data: 'totalRequest' },
        { title: 'Documents', data: 'documents' },
        {
          title: 'Status',
          data: null,
          render: (data) => {
            return `<span class="${data?.status === 'On Process' ? 'badge text-bg-primary' : 'badge text-bg-primary'}">
          ${data?.status === 'On Process' ? 'On_Process' : 'N/A'}
          </span>`
          },
        },
        { title: 'Comment', data: 'comment', render: (data) => `${data ? data : 'N/A'}` },
        {
          title: 'Action',
          data: null,
          render: (data) => {
            const isSuperAdmin = userData?.role === 'super-admin'
            return `
              <div class="d-flex justify-content-center align-items-center gap-2">
                <button class="btn btn-info text-white btn-sm viewBtn" id="viewBtn_${data._id}">
                  <i class="fa fa-eye"></i>
                </button>
                ${
                  isSuperAdmin
                    ? `<button class="btn btn-danger text-white btn-sm deleteBtn" id="deleteBtn_${data._id}">
                    📁
                  </button>`
                    : ''
                }
              </div>`
          },
        },
      ],
      order: [[0, 'desc']],
      rowCallback: (row, data) => {
        const viewBtn = row.querySelector(`#viewBtn_${data._id}`)
        const deleteBtn = row.querySelector(`#deleteBtn_${data._id}`)

        viewBtn?.addEventListener('click', () => handleView(data._id))
        deleteBtn?.addEventListener('click', () => handleDelete(data._id))
      },
    })

    return () => {
      table.destroy()
    }
  }, [budgetData])

  const handleView = (id) => {
    const selected = budgetData.find((item) => item._id === id)
    setSelectedData(selected)
    setVisibleView(true)
  }

  const handleDelete = (id) => {
    setRequestIdToDelete(id)
    setVisibleDelete(true)
  }

  const confirmationDelete = async () => {
    try {
      const response = await axios.delete(`${apiURL}/api/budgetRequest/${requestIdToDelete}`)
      toast.warn(response?.data.message)
      fetchBudgetData()
    } catch (error) {
      toast.error('Failed to delete budget')
    }
    setVisibleDelete(false)
  }

  const handleStatusUpdate = async ({ id, updateStatus, reason }) => {
    try {
      const response = await axios.post(
        `${apiURL}/api/budgetRequest/updateStatus/${id}`,
        {
          department: 'Finance',
          status: updateStatus,
          ...(updateStatus === 'Declined' && { reason: reason }),
        },
        {
          headers: { token: token },
        },
      )

      fetchBudgetData()
      setVisibleView(false)
      setVisibleDeclineReason(false)
      setDeclineReason('')
      toast.success(response?.data.message)
    } catch (error) {
      toast.error(error?.response.data.message)
    }
  }

  const kupsData = [
    {
      title: 'Operating Expenses',
      amount: '₱1,015,164.60',
      description: 'Regular operational costs and day-to-day expenses',
      color: 'primary',
    },
    {
      title: 'Capital Expenditure',
      amount: '₱422,985.25',
      description: 'Long-term investments in assets and infrastructure',
      color: 'info',
    },
    {
      title: 'Emergency Budget',
      amount: '₱84,597.05',
      description: 'Funds reserved for unexpected situations',
      color: 'warning',
    },
    {
      title: 'Budget Request',
      amount: budgetData.length,
      color: 'success',
    },
  ]

  return (
    <div>
      <h1>Budget Management</h1>
      <div>
        <CRow>
          {kupsData.map((budget, index) => (
            <CCol md={3} key={index}>
              <CCard className={`mb-4 border-top-${budget.color} border-top-3`}>
                <CCardHeader>
                  <h5>{budget.title}</h5>
                </CCardHeader>
                <CCardBody>
                  <div className="text-center">
                    <h2 className="mb-3">{budget.amount}</h2>
                    {budget.description && (
                      <p className="text-medium-emphasis">{budget.description}</p>
                    )}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      </div>
      <table id="myTable" className="display w-full text-sm bg-primary text-dark font-bold">
        <thead className="bg-primary text-light"></thead>
      </table>

      {/* View Modal */}
      <CModal
        alignment="center"
        scrollable
        visible={visibleView}
        onClose={() => setVisibleView(false)}
      >
        <CModalHeader>
          <CModalTitle>View Budget Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedData ? (
            <div>
              <p>
                <strong>Request ID:</strong> {selectedData.requestId}
              </p>
              <p>
                <strong>Department:</strong> {selectedData.department}
              </p>
              <p>
                <strong>Type of Request:</strong> {selectedData.typeOfRequest}
              </p>
              <p>
                <strong>Category:</strong> {selectedData.category}
              </p>
              <p>
                <strong>Reason:</strong> {selectedData.reason}
              </p>
              <p>
                <strong>Total Request:</strong> ${selectedData.totalRequest}
              </p>
              <p>
                <strong>Documents:</strong> {selectedData.documents}
              </p>
              <p>
                <strong>Status:</strong> {selectedData.status}
              </p>
              <p>
                <strong>Comment:</strong> {selectedData.comment}
              </p>
              <div className="d-flex justify-content-center align-items-center gap-2">
                <button
                  className={`btn bg-primary text-white font-bold`}
                  onClick={() =>
                    handleStatusUpdate({ id: selectedData?._id, updateStatus: 'Approved' })
                  }
                >
                  Approve
                </button>
                <button
                  className={`btn bg-danger text-light font-bold`}
                  onClick={() => setVisibleDeclineReason(true)}
                >
                  Decline
                </button>
              </div>
            </div>
          ) : (
            <p>No data available</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setVisibleView(false)
            }}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Decline Reason Modal */}
      <CModal
        alignment="center"
        visible={visibleDeclineReason}
        onClose={() => setVisibleDeclineReason(false)}
      >
        <CModalHeader>
          <CModalTitle>Reason for Decline</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <label htmlFor="declineReason" className="form-label">
                Please provide the reason for declining this request:
              </label>
              <CFormInput
                type="text"
                id="declineReason"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Enter reason for decline"
                required
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setVisibleDeclineReason(false)
              setDeclineReason('')
            }}
          >
            Cancel
          </CButton>
          <CButton
            color="danger"
            onClick={() => {
              if (!declineReason.trim()) {
                toast.error('Please provide a reason for declining')
                return
              }
              handleStatusUpdate({
                id: selectedData?._id,
                updateStatus: 'Declined',
                reason: declineReason,
              })
            }}
            disabled={!declineReason.trim()}
          >
            Confirm Decline
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal alignment="center" visible={visibleDelete} onClose={() => setVisibleDelete(false)}>
        <CModalHeader>
          <CModalTitle>Archive Budget</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to Archive this budget?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleDelete(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={confirmationDelete}>
            Confirm Archive
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Add Modal */}
      <CModal scrollable visible={visibleAddBudget} onClose={() => setVisibleAddBudget(false)}>
        <CModalHeader>
          <CModalTitle>Add Budget</CModalTitle>
        </CModalHeader>
        <CModalBody>{/* Form content for adding a new budget goes here */}</CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setVisibleAddBudget(false)
            }}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default BudgetList
