import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CRow,
  CCol,
  CWidgetStatsF,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import DataTable from 'datatables.net-dt'
import CIcon from '@coreui/icons-react'
import { cilChartPie } from '@coreui/icons'
import axios from 'axios'
import { apiURL } from '../../context/client_store'
import { toast } from 'react-toastify'

const FreightAudit = () => {
  const [payrollData, setPayrollData] = useState([])
  const [visibleDelete, setVisibleDelete] = useState(false)
  const [visibleView, setVisibleView] = useState(false)
  const [selectedPayroll, setSelectedPayroll] = useState(null)
  const [selectedPayrollId, setSelectedPayrollId] = useState(null)

  // Fetch payroll data
  useEffect(() => {
    fetchPayroll()
  }, [])

  const fetchPayroll = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/payroll`)
      setPayrollData(response.data)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch payroll data')
    }
  }

  // Initialize DataTable
  useEffect(() => {
    const table = new DataTable('#myTable', {
      data: payrollData,
      columns: [
        { title: 'Employee Name', data: 'employeeName' },
        { title: 'Salary', data: 'salary' },
        { title: 'Overtime Hours', data: 'overtimeHours' },
        { title: 'Overtime Pay', data: 'overtimePay' },
        { title: 'Bonuses', data: 'bonuses' },
        { title: 'Net Pay', data: 'netPay' },
        { title: 'Payment Status', data: 'paymentStatus' },
        { title: 'Payment Date', data: 'paymentDate' },
        {
          title: 'Action',
          data: null,
          render: (data) => {
            return `
              <div>
                <button class="btn btn-info text-white btn-sm viewBtn" id="viewBtn_${data._id}">
                  View
                </button>
                <button class="btn btn-danger text-white btn-sm deleteBtn" id="deleteBtn_${data._id}">
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

        viewBtn?.addEventListener('click', () => handleView(data))
        deleteBtn?.addEventListener('click', () => handleDelete(data._id))
      },
    })

    return () => {
      table.destroy()
    }
  }, [payrollData])

  const handleView = (data) => {
    setSelectedPayroll(data)
    setVisibleView(true)
  }

  const handleDelete = (id) => {
    setSelectedPayrollId(id)
    setVisibleDelete(true)
  }

  const confirmDelete = async () => {
    try {
      await axios.delete(`${apiURL}/api/payroll/${selectedPayrollId}`)
      toast.warn('Deleted Successfully')
      fetchPayroll()
    } catch (error) {
      toast.error('Failed to delete payroll data')
    }
    setVisibleDelete(false)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Freight Audit</h1>
      <CRow>
        <CCol xs={3}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cilChartPie} height={24} />}
            title="Total Revenue"
            value="0" // Placeholder value
          />
        </CCol>
      </CRow>
      <h2>Payroll Information</h2>
      <table id="myTable" className="display text-dark">
        <thead className="text-light bg-primary"></thead>
      </table>

      {/* Delete Confirmation Modal */}
      <CModal alignment="center" visible={visibleDelete} onClose={() => setVisibleDelete(false)}>
        <CModalHeader>
          <CModalTitle>Delete Payroll</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this payroll record?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleDelete(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={confirmDelete}>
            Confirm Delete
          </CButton>
        </CModalFooter>
      </CModal>

      {/* View Modal */}
      <CModal alignment="center" visible={visibleView} onClose={() => setVisibleView(false)}>
        <CModalHeader>
          <CModalTitle>View Payroll Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedPayroll && (
            <div>
              <p>
                <strong>Employee Name:</strong> {selectedPayroll.employeeName}
              </p>
              <p>
                <strong>Salary:</strong> {selectedPayroll.salary}
              </p>
              <p>
                <strong>Overtime Hours:</strong> {selectedPayroll.overtimeHours}
              </p>
              <p>
                <strong>Overtime Pay:</strong> {selectedPayroll.overtimePay}
              </p>
              <p>
                <strong>Bonuses:</strong> {selectedPayroll.bonuses}
              </p>
              <p>
                <strong>Net Pay:</strong> {selectedPayroll.netPay}
              </p>
              <p>
                <strong>Payment Status:</strong> {selectedPayroll.paymentStatus}
              </p>
              <p>
                <strong>Payment Date:</strong> {selectedPayroll.paymentDate}
              </p>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleView(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default FreightAudit
