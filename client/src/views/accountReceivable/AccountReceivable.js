import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { apiURL } from '../../context/client_store'
import { toast } from 'react-toastify'
import DataTable from 'datatables.net-dt'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

// Dummy data array matching AccountReceivable schema
const dummyAccountReceivables = [
  {
    _id: '1',
    invoiceNumber: 'INV-2023-1001',
    customer: 'Acme Corporation',
    shipment: 'SHIP-1001',
    amountDue: 1250.5,
    currency: 'USD',
    paymentTerms: 'Net 30',
    dueDate: '2023-12-15',
    paymentStatus: 'Pending',
    paymentMethod: 'Bank Transfer',
    amountPaid: 0,
    paymentDate: null,
    balanceDue: 1250.5,
    taxDetails: {
      taxAmount: 125.05,
      taxType: 'VAT',
    },
    lateFee: 0,
    notes: 'Initial invoice for Q4 services',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=INV-2023-1001',
    auditTrail: [
      {
        action: 'Created',
        performedBy: 'admin@acme.com',
        timestamp: '2023-11-15T09:30:00Z',
      },
    ],
    createdBy: 'admin@acme.com',
    createdAt: '2023-11-15T09:30:00Z',
    updatedAt: '2023-11-15T09:30:00Z',
  },
  {
    _id: '2',
    invoiceNumber: 'INV-2023-1002',
    customer: 'Globex Inc',
    shipment: 'SHIP-1002',
    amountDue: 3200.0,
    currency: 'EUR',
    paymentTerms: 'Net 15',
    dueDate: '2023-11-30',
    paymentStatus: 'Partially Paid',
    paymentMethod: 'Credit Card',
    amountPaid: 1600.0,
    paymentDate: '2023-11-20',
    balanceDue: 1600.0,
    taxDetails: {
      taxAmount: 0,
      taxType: 'None',
    },
    lateFee: 0,
    notes: 'Marketing services invoice',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=INV-2023-1002',
    auditTrail: [
      {
        action: 'Created',
        performedBy: 'sales@globex.com',
        timestamp: '2023-11-10T14:15:00Z',
      },
      {
        action: 'Partial Payment',
        performedBy: 'finance@globex.com',
        timestamp: '2023-11-20T10:45:00Z',
      },
    ],
    createdBy: 'sales@globex.com',
    createdAt: '2023-11-10T14:15:00Z',
    updatedAt: '2023-11-20T10:45:00Z',
  },
  {
    _id: '3',
    invoiceNumber: 'INV-2023-1003',
    customer: 'Initech LLC',
    shipment: 'SHIP-1003',
    amountDue: 875.25,
    currency: 'GBP',
    paymentTerms: 'Prepaid',
    dueDate: '2023-12-01',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    amountPaid: 875.25,
    paymentDate: '2023-11-05',
    balanceDue: 0,
    taxDetails: {
      taxAmount: 87.53,
      taxType: 'GST',
    },
    lateFee: 0,
    notes: 'Annual subscription renewal',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=INV-2023-1003',
    auditTrail: [
      {
        action: 'Created',
        performedBy: 'billing@initech.com',
        timestamp: '2023-11-01T11:20:00Z',
      },
      {
        action: 'Payment Received',
        performedBy: 'system',
        timestamp: '2023-11-05T09:10:00Z',
      },
    ],
    createdBy: 'billing@initech.com',
    createdAt: '2023-11-01T11:20:00Z',
    updatedAt: '2023-11-05T09:10:00Z',
  },
  {
    _id: '4',
    invoiceNumber: 'INV-2023-1004',
    customer: 'Umbrella Corp',
    shipment: 'SHIP-1004',
    amountDue: 4200.75,
    currency: 'USD',
    paymentTerms: 'Net 45',
    dueDate: '2023-10-30',
    paymentStatus: 'Overdue',
    paymentMethod: 'Bank Transfer',
    amountPaid: 0,
    paymentDate: null,
    balanceDue: 4200.75,
    taxDetails: {
      taxAmount: 420.08,
      taxType: 'VAT',
    },
    lateFee: 50.0,
    notes: 'Overdue - please contact accounts payable',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=INV-2023-1004',
    auditTrail: [
      {
        action: 'Created',
        performedBy: 'finance@umbrella.com',
        timestamp: '2023-09-15T13:45:00Z',
      },
      {
        action: 'Late Fee Applied',
        performedBy: 'system',
        timestamp: '2023-11-01T00:00:00Z',
      },
    ],
    createdBy: 'finance@umbrella.com',
    createdAt: '2023-09-15T13:45:00Z',
    updatedAt: '2023-11-01T00:00:00Z',
  },
  {
    _id: '5',
    invoiceNumber: 'INV-2023-1005',
    customer: 'Stark Industries',
    shipment: 'SHIP-1005',
    amountDue: 15000.0,
    currency: 'USD',
    paymentTerms: 'Net 30',
    dueDate: '2024-01-15',
    paymentStatus: 'Pending',
    paymentMethod: 'Check',
    amountPaid: 0,
    paymentDate: null,
    balanceDue: 15000.0,
    taxDetails: {
      taxAmount: 0,
      taxType: 'None',
    },
    lateFee: 0,
    notes: 'Quarterly retainer fee',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=INV-2023-1005',
    auditTrail: [
      {
        action: 'Created',
        performedBy: 'admin@stark.com',
        timestamp: '2023-12-15T10:30:00Z',
      },
    ],
    createdBy: 'admin@stark.com',
    createdAt: '2023-12-15T10:30:00Z',
    updatedAt: '2023-12-15T10:30:00Z',
  },
  {
    _id: '6',
    invoiceNumber: 'INV-2023-1006',
    customer: 'Wayne Enterprises',
    shipment: 'SHIP-1006',
    amountDue: 7500.0,
    currency: 'USD',
    paymentTerms: 'Net 30',
    dueDate: '2023-11-25',
    paymentStatus: 'Cancelled',
    paymentMethod: null,
    amountPaid: 0,
    paymentDate: null,
    balanceDue: 7500.0,
    taxDetails: {
      taxAmount: 750.0,
      taxType: 'VAT',
    },
    lateFee: 0,
    notes: 'Order cancelled by customer',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=INV-2023-1006',
    auditTrail: [
      {
        action: 'Created',
        performedBy: 'sales@wayne.com',
        timestamp: '2023-10-25T15:20:00Z',
      },
      {
        action: 'Cancelled',
        performedBy: 'manager@wayne.com',
        timestamp: '2023-11-10T11:15:00Z',
      },
    ],
    createdBy: 'sales@wayne.com',
    createdAt: '2023-10-25T15:20:00Z',
    updatedAt: '2023-11-10T11:15:00Z',
  },
  {
    _id: '7',
    invoiceNumber: 'INV-2023-1007',
    customer: 'Oscorp Industries',
    shipment: 'SHIP-1007',
    amountDue: 3250.5,
    currency: 'USD',
    paymentTerms: 'Net 15',
    dueDate: '2023-12-10',
    paymentStatus: 'Partially Paid',
    paymentMethod: 'Credit Card',
    amountPaid: 1625.25,
    paymentDate: '2023-11-28',
    balanceDue: 1625.25,
    taxDetails: {
      taxAmount: 325.05,
      taxType: 'VAT',
    },
    lateFee: 0,
    notes: 'Split payment requested',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=INV-2023-1007',
    auditTrail: [
      {
        action: 'Created',
        performedBy: 'billing@oscorp.com',
        timestamp: '2023-11-25T09:45:00Z',
      },
      {
        action: 'Partial Payment',
        performedBy: 'client@oscorp.com',
        timestamp: '2023-11-28T14:30:00Z',
      },
    ],
    createdBy: 'billing@oscorp.com',
    createdAt: '2023-11-25T09:45:00Z',
    updatedAt: '2023-11-28T14:30:00Z',
  },
  {
    _id: '8',
    invoiceNumber: 'INV-2023-1008',
    customer: 'Cyberdyne Systems',
    shipment: 'SHIP-1008',
    amountDue: 9800.0,
    currency: 'EUR',
    paymentTerms: 'Net 45',
    dueDate: '2024-01-30',
    paymentStatus: 'Pending',
    paymentMethod: null,
    amountPaid: 0,
    paymentDate: null,
    balanceDue: 9800.0,
    taxDetails: {
      taxAmount: 980.0,
      taxType: 'VAT',
    },
    lateFee: 0,
    notes: 'Annual maintenance contract',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=INV-2023-1008',
    auditTrail: [
      {
        action: 'Created',
        performedBy: 'contracts@cyberdyne.com',
        timestamp: '2023-12-15T16:20:00Z',
      },
    ],
    createdBy: 'contracts@cyberdyne.com',
    createdAt: '2023-12-15T16:20:00Z',
    updatedAt: '2023-12-15T16:20:00Z',
  },
  {
    _id: '9',
    invoiceNumber: 'INV-2023-1009',
    customer: 'Monsters Inc',
    shipment: 'SHIP-1009',
    amountDue: 5400.0,
    currency: 'USD',
    paymentTerms: 'Net 30',
    dueDate: '2023-12-20',
    paymentStatus: 'Pending',
    paymentMethod: 'Bank Transfer',
    amountPaid: 0,
    paymentDate: null,
    balanceDue: 5400.0,
    taxDetails: {
      taxAmount: 540.0,
      taxType: 'VAT',
    },
    lateFee: 0,
    notes: 'Scare equipment purchase',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=INV-2023-1009',
    auditTrail: [
      {
        action: 'Created',
        performedBy: 'sully@monsters.com',
        timestamp: '2023-11-20T08:15:00Z',
      },
    ],
    createdBy: 'sully@monsters.com',
    createdAt: '2023-11-20T08:15:00Z',
    updatedAt: '2023-11-20T08:15:00Z',
  },
  {
    _id: '10',
    invoiceNumber: 'INV-2023-1010',
    customer: 'Wonka Industries',
    shipment: 'SHIP-1010',
    amountDue: 12500.0,
    currency: 'GBP',
    paymentTerms: 'Net 60',
    dueDate: '2024-02-15',
    paymentStatus: 'Pending',
    paymentMethod: null,
    amountPaid: 0,
    paymentDate: null,
    balanceDue: 12500.0,
    taxDetails: {
      taxAmount: 0,
      taxType: 'None',
    },
    lateFee: 0,
    notes: 'Chocolate factory supplies',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=INV-2023-1010',
    auditTrail: [
      {
        action: 'Created',
        performedBy: 'wonka@wonka.com',
        timestamp: '2023-12-16T10:00:00Z',
      },
    ],
    createdBy: 'wonka@wonka.com',
    createdAt: '2023-12-16T10:00:00Z',
    updatedAt: '2023-12-16T10:00:00Z',
  },
]

const AccountReceivables = () => {
  const [receivablesData, setReceivablesData] = useState([])
  const [visibleDelete, setVisibleDelete] = useState(false)
  const [selectedReceivableId, setSelectedReceivableId] = useState(null)
  const [isQrCodeModalVisible, setIsQrCodeModalVisible] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()

  // Define the missing function
  const closeQrCodeModal = () => {
    setIsQrCodeModalVisible(false)
  }

  useEffect(() => {
    // Simulate API call with dummy data
    const timer = setTimeout(() => {
      setReceivablesData(dummyAccountReceivables)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (receivablesData.length > 0 && !isLoading) {
      const table = new DataTable('#myTable', {
        data: receivablesData,
        columns: [
          { title: 'Invoice#', data: 'invoiceNumber' },
          { title: 'Customer', data: 'customer' },
          { title: 'Amount Due', data: 'amountDue', render: (data) => `$${data.toFixed(2)}` },
          { title: 'Currency', data: 'currency' },
          {
            title: 'Status',
            data: 'paymentStatus',
            render: (data) => {
              let statusClass = ''
              switch (data) {
                case 'Paid':
                  statusClass = 'bg-success'
                  break
                case 'Pending':
                  statusClass = 'bg-warning'
                  break
                case 'Overdue':
                  statusClass = 'bg-danger'
                  break
                case 'Partially Paid':
                  statusClass = 'bg-info'
                  break
                case 'Cancelled':
                  statusClass = 'bg-secondary'
                  break
                default:
                  statusClass = 'bg-secondary'
              }
              return `<span class="badge ${statusClass}">${data}</span>`
            },
          },
          {
            title: 'Due Date',
            data: 'dueDate',
            render: (data) => new Date(data).toLocaleDateString(),
          },
          {
            title: 'Balance Due',
            data: 'balanceDue',
            render: (data) =>
              `<span class="${data > 0 ? 'text-danger' : 'text-success'}">$${data.toFixed(2)}</span>`,
          },

          {
            title: 'Action',
            data: null,
            render: (data) => {
              return `
                <div>
                  <button class="bg-teal-500 text-xs btn btn-warning text-white px-2 py-1 rounded-lg mx-1 viewBtn" id="editBtn_${data._id}">
                    Edit
                  </button>
                  <button class="bg-teal-500 text-xs btn btn-info text-white px-2 py-1 rounded-lg mx-1 viewBtn" id="viewBtn_${data._id}">
                    View
                  </button>
                  <button class="bg-gray-500 text-xs btn btn-danger text-white px-2 py-1 rounded-lg mx-1 deleteBtn" id="deleteBtn_${data._id}">
                    Delete
                  </button>
                </div>
              `
            },
          },
        ],
        order: [[0, 'desc']],
        rowCallback: (row, data) => {
          const deleteBtn = row.querySelector(`#deleteBtn_${data._id}`)
          const viewBtn = row.querySelector(`#viewBtn_${data._id}`)
          const editBtn = row.querySelector(`#editBtn_${data._id}`)
          const qrCodeImg = row.querySelector('.qr-code-img')

          deleteBtn?.addEventListener('click', () => handleDelete(data._id))
          viewBtn?.addEventListener('click', () => {
            navigate(`/account-receivables/${data._id}`)
          })
          editBtn?.addEventListener('click', () => {
            navigate(`/account-receivables/edit/${data._id}`)
          })

          if (qrCodeImg) {
            qrCodeImg.addEventListener('click', () => {
              setQrCodeUrl(data.qrCode)
              setIsQrCodeModalVisible(true)
            })
          }

          return () => {
            if (qrCodeImg) {
              qrCodeImg.removeEventListener('click', () => {
                setQrCodeUrl(data.qrCode)
                setIsQrCodeModalVisible(true)
              })
            }
          }
        },
      })

      return () => {
        table.destroy()
      }
    }
  }, [receivablesData, isLoading, navigate])

  const handleDelete = async (id) => {
    setSelectedReceivableId(id)
    setVisibleDelete(true)
  }

  const confirmDelete = async () => {
    try {
      // In a real app, you would call the API here
      setReceivablesData((prev) => prev.filter((item) => item._id !== selectedReceivableId))
      toast.success('Receivable deleted successfully')
    } catch (error) {
      toast.error('Failed to delete receivable')
      console.error('Delete error:', error)
    }
    setVisibleDelete(false)
  }

  // Close QR code modal when ESC key is pressed
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        closeQrCodeModal()
      }
    }
    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [])

  return (
    <div>
      <h1>Account Receivables</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <table id="myTable" className="display w-full text-sm bg-primary text-dark font-bold">
            <thead className="bg-primary text-light"></thead>
          </table>

          {/* Delete Confirmation Modal */}
          <CModal
            alignment="center"
            visible={visibleDelete}
            onClose={() => setVisibleDelete(false)}
          >
            <CModalHeader>
              <CModalTitle>Delete Receivable</CModalTitle>
            </CModalHeader>
            <CModalBody>Are you sure you want to delete this receivable?</CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisibleDelete(false)}>
                Close
              </CButton>
              <CButton color="danger" onClick={confirmDelete}>
                Delete
              </CButton>
            </CModalFooter>
          </CModal>
        </>
      )}
    </div>
  )
}

export default AccountReceivables
