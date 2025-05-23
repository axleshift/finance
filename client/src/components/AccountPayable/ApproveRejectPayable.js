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
} from '@coreui/react'
import { toast } from 'react-toastify'

import axios from 'axios'
import client_store from '../../context/client_store'
import { apiURL } from '../../context/client_store'

const ApproveRejectPayable = () => {
  const [loading, setLoading] = useState(false)
  const [visibleView, setVisibleView] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false)
  const [selectedData, setSelectedData] = useState(null)
  const [budgetData, setBudgetData] = useState([])
  const [visibleAddBudget, setVisibleAddBudget] = useState(false)
  const [status, setStatus] = useState(null)
  const [requestIdToDelete, setRequestIdToDelete] = useState(null) // Store requestId for deletion

  const { token } = client_store()

  useEffect(() => {
    fetchBudgetData()
  }, [])
  const fetchBudgetData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/budgetRequest/approveRejectPayables`)
      const filterData = response.data.filter((item) => item.isArichived === false)
      console.log(filterData)
      setBudgetData(filterData)
    } catch (error) {
      console.log(error?.response?.data)
    }
  }

  useEffect(() => {
    const table = new DataTable('#myTable', {
      data: budgetData,
      columns: [
        { title: 'Request ID', data: 'requestId', render: (data) => `${data ? data : 'N/A'}` },
        { title: 'Department', data: 'department', render: (data) => `${data ? data : 'N/A'}` },
        {
          title: 'Type of Request',
          data: 'typeOfRequest',
          render: (data) => `${data ? data : 'N/A'}`,
        },
        { title: 'Category', data: 'category', render: (data) => `${data ? data : 'N/A'}` },
        { title: 'Reason', data: 'reason', render: (data) => `${data ? data : 'N/A'}` },
        { title: 'Total Request', data: 'totalRequest' },
        { title: 'Documents', data: 'documents', render: (data) => `${data ? data : 'N/A'}` },
        {
          title: 'Status',
          data: null,
          render: (data) => {
            return `<span class="btn ${data?.status === 'Approved' ? 'badge rounded-pill  text-bg-success' : data?.status === 'Declined' ? 'badge rounded-pill  text-bg-danger' : 'btn-secondary text-white'}">
            ${data?.status}
          </span>`
          },
        },
        { title: 'Comment', data: 'comment', render: (data) => `${data ? data : 'No comment'}` },
        {
          title: 'Action',
          data: null,
          render: (data) => {
            return `
              <div class="d-flex justify-content-center align-items-center gap-2"> 
                <button class="btn btn-info text-white btn-sm viewBtn" id="viewBtn_${data._id}">
                                    <i class="fa fa-eye"></i>
                </button>
                <button class="btn btn-danger text-white btn-sm deleteBtn" id="deleteBtn_${data._id}">
📁
                </button>
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
    setRequestIdToDelete(id) // Set the requestId to delete
    setVisibleDelete(true) // Show the delete confirmation modal
  }

  const confirmationDelete = async () => {
    try {
      const response = await axios.delete(`${apiURL}/api/budgetRequest/${requestIdToDelete}`)
      toast.warn(response?.data.message)
      fetchBudgetData()
    } catch (error) {
      toast.error('Failed to delete budget')
    }
    setVisibleDelete(false) // Close the modal after deleting
  }

  const handleStatusUpdate = async (requestId) => {
    try {
      const response = await axios.post(
        `${apiURL}/api/budgetRequest/onProcessStatus/${requestId}`,
        { department: 'Finance' },
        {
          headers: { token: token },
        },
      )
      const updatedBudgetData = budgetData.map((item) =>
        item.requestId === requestId ? { ...item, status: 'Approved' } : item,
      )
      setBudgetData(updatedBudgetData)
      fetchBudgetData()
      setVisibleView(false)
      toast.success(response?.data.message)
    } catch (error) {
      toast.error(error?.response.data.message)
    }
  }

  return (
    <div>
      <h1>Approved/Rejected Payables</h1>
      <div>
        {/* <button className="btn btn-primary my-2" onClick={() => setVisibleAddBudget(true)}>
          Add Budget
        </button> */}
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
              {/* <div className="d-flex justify-content-center align-items-center">
                <button
                  className={` ${selectedData.status === 'Approved' ? 'btn border-2 border-primary  bg-white text-dark font-bold' : 'btn btn-primary '}`}
                  onClick={() => handleStatusUpdate(selectedData?._id)}
                >
                  {selectedData.status === 'Approved' ? 'Approved' : 'Approve'}
                </button>
              </div> */}
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

export default ApproveRejectPayable
