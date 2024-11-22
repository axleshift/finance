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
import { apiURL } from '../../context/client_store'

const BudgetList = () => {
  const [loading, setLoading] = useState(false)
  const [visibleView, setVisibleView] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false)
  const [selectedData, setSelectedData] = useState(null)
  const [budgetData, setBudgetData] = useState([])
  const [visibleAddBudget, setVisibleAddBudget] = useState(false)
  const [status, setStatus] = useState(null)

  const fetchBudgetData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/budget`)
      setBudgetData(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error?.response?.data)
    }
  }

  console.log(visibleAddBudget)

  useEffect(() => {
    fetchBudgetData()
  }, [])

  useEffect(() => {
    const table = new DataTable('#myTable', {
      data: budgetData,
      columns: [
        { title: 'ID', data: '_id' },
        { title: 'Fiscal Year', data: 'fiscalYear' },
        { title: 'Total Budget', data: 'totalBudget' },
        { title: 'Used Budget', data: 'usedBudget' },
        { title: 'Remaining Budget', data: 'remainingBudget' },
        {
          title: 'Status',
          data: 'status',
          render: (data) => {
            return data ? data : '<span>Pending</span>'
          },
        },
        {
          title: 'Action',
          data: null,
          render: (data) => {
            return `
              <div>
                <button class="btn btn-primary text-xs px-2 py-1 mx-1 viewBtn" id="viewBtn_${data._id}">
                  View
                </button>
                <button class="btn btn-danger text-xs px-2 py-1 mx-1 deleteBtn" id="deleteBtn_${data._id}">
                  Delete
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiURL}/api/budget/${id}`)
      toast.warn('Deleted Successfully')
      fetchBudgetData()
    } catch (error) {
      toast.error('Failed to delete budget')
      console.log(error?.response?.data?.message)
    }
    setVisibleDelete(false)
  }

  const handleStatusUpdate = async (id) => {
    console.log(id)
    try {
      const response = await axios.put(`${apiURL}/api/budget/updateStatus/${id}`, {
        status: 'Approved',
      })
      toast.success('Status Update Successfully!')
    } catch (error) {
      toast.error('Failed to update status')
      console.log(error?.response?.data?.message)
    }
  }

  return (
    <div>
      <h1>Budget Management</h1>

      <div>
        <button className="btn btn-primary my-2" onClick={() => setVisibleAddBudget(true)}>
          Add Budget
        </button>
      </div>
      <table id="myTable" className="display w-full text-sm bg-primary text-dark font-bold"></table>

      {/* View Modal */}
      <CModal scrollable visible={visibleView} onClose={() => setVisibleView(false)}>
        <CModalHeader>
          <CModalTitle>View Budget Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedData ? (
            <div>
              <p>
                <strong>Fiscal Year:</strong> {selectedData.fiscalYear}
              </p>
              <p>
                <strong>Total Budget:</strong> ${selectedData.totalBudget}
              </p>
              <p>
                <strong>Used Budget:</strong> ${selectedData.usedBudget}
              </p>
              <p>
                <strong>Remaining Budget:</strong> ${selectedData.remainingBudget}
              </p>
              <h5>Transportation Costs:</h5>
              {selectedData.transportationCosts.map((cost, index) => (
                <div key={index}>
                  <p>Mode: {cost.modeOfTransport}</p>
                  <p>Allocated: ${cost.allocatedAmount}</p>
                  <p>Spent: ${cost.spentAmount}</p>
                </div>
              ))}

              <div className="d-flex justify-content-center align-items-center">
                <button
                  className="btn btn-primary"
                  onClick={() => handleStatusUpdate(selectedData._id)}
                >
                  {selectedData?.status ? selectedData?.status : 'Approve'}
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

      {/* Delete Confirmation Modal */}
      <CModal visible={visibleDelete} onClose={() => setVisibleDelete(false)}>
        <CModalHeader>
          <CModalTitle>Delete Budget</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this budget?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleDelete(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={() => handleDelete(selectedData)}>
            Confirm Delete
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Add Modal */}
      <CModal scrollable visible={visibleAddBudget} onClose={() => setVisibleAddBudget(false)}>
        <CModalHeader>
          <CModalTitle>View Budget Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>
            <div className="row">
              <div className="col">
                <CForm>
                  <CFormInput
                    type="email"
                    id="exampleFormControlInput1"
                    label="Email address"
                    placeholder="name@example.com"
                    aria-describedby="exampleFormControlInputHelpInline"
                  />
                </CForm>
              </div>
              <div className="col">
                <CForm>
                  <CFormInput
                    type="email"
                    id="exampleFormControlInput1"
                    label="Email address"
                    placeholder="name@example.com"
                    aria-describedby="exampleFormControlInputHelpInline"
                  />
                </CForm>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <CForm>
                  <CFormInput
                    type="email"
                    id="exampleFormControlInput1"
                    label="Email address"
                    placeholder="name@example.com"
                    aria-describedby="exampleFormControlInputHelpInline"
                  />
                </CForm>
              </div>
              <div className="col">
                <CForm>
                  <CFormInput
                    type="email"
                    id="exampleFormControlInput1"
                    label="Email address"
                    placeholder="name@example.com"
                    aria-describedby="exampleFormControlInputHelpInline"
                  />
                </CForm>
              </div>
            </div>
          </div>
        </CModalBody>
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
