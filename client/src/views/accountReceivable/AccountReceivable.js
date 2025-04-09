import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { apiURL } from '../../context/client_store'
import { toast } from 'react-toastify'
import DataTable from 'datatables.net-dt'
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CBadge,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import client_store from '../../context/client_store'

// ... (Keep your existing dummyAccountReceivables array) ...

const AccountReceivables = () => {
  const [receivablesData, setReceivablesData] = useState([])
  const [visibleDelete, setVisibleDelete] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [visibleView, setVisibleView] = useState(false)
  const [selectedReceivableId, setSelectedReceivableId] = useState(null)
  const [selectedReceivable, setSelectedReceivable] = useState(null)
  const [isQrCodeModalVisible, setIsQrCodeModalVisible] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { userData } = client_store()
  const navigate = useNavigate()

  // Initialize new receivable template
  const newReceivableTemplate = {
    invoiceNumber: '',
    customer: '',
    amountDue: 0,
    currency: 'USD',
    paymentTerms: 'Net 30',
    dueDate: new Date().toISOString().split('T')[0],
    paymentStatus: 'Pending',
    paymentMethod: 'Bank Transfer',
  }
  const [newReceivable, setNewReceivable] = useState(newReceivableTemplate)

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

  // Simulate API fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setReceivablesData(dummyAccountReceivables)
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Initialize DataTable
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
              const statusClasses = {
                Paid: 'bg-success',
                Pending: 'bg-warning',
                Overdue: 'bg-danger',
                'Partially Paid': 'bg-info',
                Cancelled: 'bg-secondary',
              }
              return `<span class="badge ${statusClasses[data] || 'bg-secondary'}">${data}</span>`
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
              const isSuperAdmin = userData?.role === 'super-admin'
              return `
                <div class="d-flex justify-content-center align-items-center gap-2">
                  <button class="btn btn-sm btn-info viewBtn text-white" id="viewBtn_${data._id}">
                    View
                  </button>
                  ${
                    isSuperAdmin
                      ? `<button class="btn btn-sm btn-warning editBtn text-white" id="editBtn_${data._id}">
                          Edit
                        </button>
                        <button class="btn btn-sm btn-danger deleteBtn text-white" id="deleteBtn_${data._id}">
                          📁
                        </button>`
                      : ''
                  }
                </div>
              `
            },
          },
        ],
        order: [[0, 'desc']],
        rowCallback: (row, data) => {
          const viewBtn = row.querySelector(`#viewBtn_${data._id}`)
          const editBtn = row.querySelector(`#editBtn_${data._id}`)
          const deleteBtn = row.querySelector(`#deleteBtn_${data._id}`)

          viewBtn?.addEventListener('click', () => {
            setSelectedReceivable(data)
            setVisibleView(true)
          })

          editBtn?.addEventListener('click', () => {
            setSelectedReceivable(data)
            setVisibleEdit(true)
          })

          if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
              setSelectedReceivableId(data._id)
              setVisibleDelete(true)
            })
          }
        },
      })

      return () => table.destroy()
    }
  }, [receivablesData, isLoading, navigate, userData])

  // Handlers
  const handleCreateSubmit = () => {
    const newId = `INV-${Date.now()}`
    const createdReceivable = {
      ...newReceivable,
      _id: newId,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${newId}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      balanceDue: newReceivable.amountDue,
      amountPaid: 0,
    }

    setReceivablesData([createdReceivable, ...receivablesData])
    toast.success('Receivable created successfully!')
    setNewReceivable(newReceivableTemplate)
    setVisibleCreate(false)
  }

  const handleEditSubmit = () => {
    setReceivablesData((prev) =>
      prev.map((item) => (item._id === selectedReceivable._id ? selectedReceivable : item)),
    )
    toast.success('Receivable updated successfully!')
    setVisibleEdit(false)
  }

  const confirmDelete = () => {
    setReceivablesData((prev) => prev.filter((item) => item._id !== selectedReceivableId))
    toast.success('Receivable Archive successfully!')
    setVisibleDelete(false)
  }

  const handleStatusUpdate = ({ id, updateStatus }) => {
    setReceivablesData((prev) =>
      prev.map((item) => (item._id === id ? { ...item, paymentStatus: updateStatus } : item)),
    )
    toast.success(`Status updated to ${updateStatus}`)
    setVisibleView(false)
  }

  // Close modals on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setVisibleCreate(false)
        setVisibleEdit(false)
        setVisibleDelete(false)
        setVisibleView(false)
        setIsQrCodeModalVisible(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Account Receivables</h1>
        <CButton color="primary" onClick={() => setVisibleCreate(true)}>
          + Create New
        </CButton>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <table
            id="myTable"
            className="display w-full text-sm bg-primary text-dark font-bold"
            style={{ width: '100%' }}
          >
            <thead className="bg-primary text-light"></thead>
          </table>

          {/* Create Modal */}
          <CModal visible={visibleCreate} onClose={() => setVisibleCreate(false)}>
            <CModalHeader>
              <CModalTitle>Create New Receivable</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm>
                <div className="mb-3">
                  <CFormLabel>Invoice Number</CFormLabel>
                  <CFormInput
                    value={newReceivable.invoiceNumber}
                    onChange={(e) =>
                      setNewReceivable({ ...newReceivable, invoiceNumber: e.target.value })
                    }
                    placeholder="INV-2023-XXXX"
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel>Customer</CFormLabel>
                  <CFormInput
                    value={newReceivable.customer}
                    onChange={(e) =>
                      setNewReceivable({ ...newReceivable, customer: e.target.value })
                    }
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <CFormLabel>Amount Due</CFormLabel>
                    <CFormInput
                      type="number"
                      value={newReceivable.amountDue}
                      onChange={(e) =>
                        setNewReceivable({
                          ...newReceivable,
                          amountDue: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <CFormLabel>Currency</CFormLabel>
                    <CFormSelect
                      value={newReceivable.currency}
                      onChange={(e) =>
                        setNewReceivable({ ...newReceivable, currency: e.target.value })
                      }
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </CFormSelect>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <CFormLabel>Payment Terms</CFormLabel>
                    <CFormSelect
                      value={newReceivable.paymentTerms}
                      onChange={(e) =>
                        setNewReceivable({ ...newReceivable, paymentTerms: e.target.value })
                      }
                    >
                      <option value="Net 15">Net 15</option>
                      <option value="Net 30">Net 30</option>
                      <option value="Net 45">Net 45</option>
                      <option value="Due on Receipt">Due on Receipt</option>
                    </CFormSelect>
                  </div>
                  <div className="col-md-6">
                    <CFormLabel>Due Date</CFormLabel>
                    <CFormInput
                      type="date"
                      value={newReceivable.dueDate}
                      onChange={(e) =>
                        setNewReceivable({ ...newReceivable, dueDate: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CForm>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisibleCreate(false)}>
                Cancel
              </CButton>
              <CButton color="primary" onClick={handleCreateSubmit}>
                Create
              </CButton>
            </CModalFooter>
          </CModal>

          {/* Edit Modal */}
          {selectedReceivable && (
            <CModal visible={visibleEdit} onClose={() => setVisibleEdit(false)}>
              <CModalHeader>
                <CModalTitle>Edit Receivable</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CForm>
                  <div className="mb-3">
                    <CFormLabel>Invoice Number</CFormLabel>
                    <CFormInput
                      value={selectedReceivable.invoiceNumber}
                      onChange={(e) =>
                        setSelectedReceivable({
                          ...selectedReceivable,
                          invoiceNumber: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <CFormLabel>Customer</CFormLabel>
                    <CFormInput
                      value={selectedReceivable.customer}
                      onChange={(e) =>
                        setSelectedReceivable({ ...selectedReceivable, customer: e.target.value })
                      }
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <CFormLabel>Amount Due</CFormLabel>
                      <CFormInput
                        type="number"
                        value={selectedReceivable.amountDue}
                        onChange={(e) =>
                          setSelectedReceivable({
                            ...selectedReceivable,
                            amountDue: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <CFormLabel>Status</CFormLabel>
                      <CFormSelect
                        value={selectedReceivable.paymentStatus}
                        onChange={(e) =>
                          setSelectedReceivable({
                            ...selectedReceivable,
                            paymentStatus: e.target.value,
                          })
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Partially Paid">Partially Paid</option>
                        <option value="Cancelled">Cancelled</option>
                      </CFormSelect>
                    </div>
                  </div>
                </CForm>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setVisibleEdit(false)}>
                  Cancel
                </CButton>
                <CButton color="primary" onClick={handleEditSubmit}>
                  Update
                </CButton>
              </CModalFooter>
            </CModal>
          )}

          {/* View Modal */}
          <CModal
            alignment="center"
            scrollable
            visible={visibleView}
            onClose={() => setVisibleView(false)}
            size="lg"
          >
            <CModalHeader>
              <CModalTitle>Invoice Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
              {selectedReceivable ? (
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Invoice Number:</strong> {selectedReceivable.invoiceNumber}
                    </p>
                    <p>
                      <strong>Customer:</strong> {selectedReceivable.customer}
                    </p>
                    <p>
                      <strong>Amount Due:</strong> ${selectedReceivable.amountDue.toFixed(2)}
                    </p>
                    <p>
                      <strong>Amount Paid:</strong> $
                      {selectedReceivable.amountPaid?.toFixed(2) || '0.00'}
                    </p>
                    <p>
                      <strong>Balance Due:</strong>
                      <span
                        className={
                          selectedReceivable.balanceDue > 0 ? 'text-danger' : 'text-success'
                        }
                      >
                        ${selectedReceivable.balanceDue.toFixed(2)}
                      </span>
                    </p>
                    <p>
                      <strong>Currency:</strong> {selectedReceivable.currency}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Payment Terms:</strong> {selectedReceivable.paymentTerms}
                    </p>
                    <p>
                      <strong>Due Date:</strong>{' '}
                      {new Date(selectedReceivable.dueDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <CBadge
                        color={
                          selectedReceivable.paymentStatus === 'Paid'
                            ? 'success'
                            : selectedReceivable.paymentStatus === 'Pending'
                              ? 'warning'
                              : selectedReceivable.paymentStatus === 'Overdue'
                                ? 'danger'
                                : selectedReceivable.paymentStatus === 'Partially Paid'
                                  ? 'info'
                                  : 'secondary'
                        }
                        className="ms-2"
                      >
                        {selectedReceivable.paymentStatus}
                      </CBadge>
                    </p>
                    <p>
                      <strong>Payment Method:</strong> {selectedReceivable.paymentMethod || 'N/A'}
                    </p>
                    <p>
                      <strong>Payment Date:</strong>{' '}
                      {selectedReceivable.paymentDate
                        ? new Date(selectedReceivable.paymentDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="col-12 mt-3">
                    <p>
                      <strong>Notes:</strong> {selectedReceivable.notes}
                    </p>
                    <div className="text-center">
                      <img
                        src={selectedReceivable.qrCode}
                        alt="QR Code"
                        style={{ width: '150px', height: '150px', cursor: 'pointer' }}
                        onClick={() => {
                          setQrCodeUrl(selectedReceivable.qrCode)
                          setIsQrCodeModalVisible(true)
                        }}
                      />
                      <p className="text-muted">Click QR code to enlarge</p>
                    </div>
                  </div>

                  {userData?.role === 'super-admin' && (
                    <div className="col-12 mt-3 d-flex justify-content-center gap-3">
                      <CButton
                        color="success"
                        onClick={() =>
                          handleStatusUpdate({
                            id: selectedReceivable._id,
                            updateStatus: 'Paid',
                          })
                        }
                      >
                        Mark as Paid
                      </CButton>
                      <CButton
                        color="danger"
                        onClick={() =>
                          handleStatusUpdate({
                            id: selectedReceivable._id,
                            updateStatus: 'Cancelled',
                          })
                        }
                      >
                        Cancel Invoice
                      </CButton>
                    </div>
                  )}
                </div>
              ) : (
                <p>No data available</p>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisibleView(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>

          {/* Delete Modal */}
          <CModal visible={visibleDelete} onClose={() => setVisibleDelete(false)}>
            <CModalHeader>
              <CModalTitle>Confirm Archive</CModalTitle>
            </CModalHeader>
            <CModalBody>Are you sure you want archive this receivable?</CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisibleDelete(false)}>
                Cancel
              </CButton>
              <CButton color="danger" onClick={confirmDelete}>
                Archive
              </CButton>
            </CModalFooter>
          </CModal>

          {/* QR Code Modal */}
          <CModal visible={isQrCodeModalVisible} onClose={() => setIsQrCodeModalVisible(false)}>
            <CModalHeader>
              <CModalTitle>Invoice QR Code</CModalTitle>
            </CModalHeader>
            <CModalBody className="text-center">
              <img src={qrCodeUrl} alt="QR Code" style={{ width: '300px', height: '300px' }} />
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setIsQrCodeModalVisible(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
        </>
      )}
    </div>
  )
}

export default AccountReceivables
