import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { apiURL } from '../../context/client_store'
import { toast } from 'react-toastify'
import DataTable from 'datatables.net-dt'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { FaQrcode } from 'react-icons/fa' // Import QR code icon

const ReviewPayment = () => {
  const [invoiceData, setInvoiceData] = useState([])
  const [visibleReject, setVisibleReject] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [isQrCodeModalVisible, setIsQrCodeModalVisible] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    fetchInvoiceData()
  }, [])

  const fetchInvoiceData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/invoice/getAll`)
      setInvoiceData(response.data.data)
      console.log(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch invoice data')
    }
  }

  useEffect(() => {
    if (invoiceData.length > 0) {
      const table = new DataTable('#myTable', {
        data: invoiceData,
        columns: [
          { title: 'Invoice#', data: 'invoiceNumber', render: (data) => `${data ? data : 'N/A'}` },
          { title: 'TrackingId', data: 'trackingId', render: (data) => `${data ? data : 'N/A'}` },
          {
            title: 'Currency',
            data: 'selectedCurrency',
            render: (data) => `${data ? data : 'N/A'}`,
          },
          { title: 'Status', data: 'status', render: (data) => `${data ? data : 'N/A'}` },
          {
            title: 'Payment Method',
            data: 'paymentMethod',
            render: (data) => `${data ? data : 'N/A'}`,
          },
          {
            title: 'Total Amount',
            data: 'totalAmount',
            render: (data) => `${data ? data : 'N/A'}`,
          },
          {
            title: 'QR Code',
            data: 'qrCode',
            render: (data, type, row) => {
              if (!data) return 'N/A'
              return `
                <button class="qr-code-btn" title="View QR Code">
                  <i class="fas fa-qrcode"></i> <!-- Using inline icon for DataTables -->
                </button>
              `
            },
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
                </div>
              `
            },
          },
        ],
        order: [[0, 'desc']],
        rowCallback: (row, data) => {
          const approveBtn = row.querySelector(`#approveBtn_${data.id}`)
          const rejectBtn = row.querySelector(`#rejectBtn_${data.id}`)
          const payBtn = row.querySelector(`#payBtn_${data.id}`)
          const deleteBtn = row.querySelector(`#deleteBtn_${data._id}`)
          const viewBtn = row.querySelector(`#viewBtn_${data._id}`)
          const editBtn = row.querySelector(`#editBtn_${data._id}`)
          const qrCodeBtn = row.querySelector('.qr-code-btn')

          approveBtn?.addEventListener('click', () => handleApproval(data.id))
          rejectBtn?.addEventListener('click', () => handleRejection(data.id))
          payBtn?.addEventListener('click', () => handlePayment(data.id))
          deleteBtn?.addEventListener('click', () => handleDelete(data._id))
          viewBtn?.addEventListener('click', () => {
            const invoiceDetailsUrl = `/invoice-details?id=${data._id}`
            navigate(invoiceDetailsUrl)
          })
          editBtn?.addEventListener('click', () => navigate(`/edit_invoice/${data._id}`))

          // Add click event for QR code button
          if (qrCodeBtn && data.qrCode) {
            qrCodeBtn.addEventListener('click', () => {
              setQrCodeUrl(data.qrCode)
              setIsQrCodeModalVisible(true)
            })
          }

          // Cleanup event listeners when component re-renders
          return () => {
            if (qrCodeBtn) {
              qrCodeBtn.removeEventListener('click', () => {
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
  }, [invoiceData])

  const handleApproval = (id) => {
    console.log(`Approving invoice with ID: ${id}`)
  }

  const handleRejection = (id) => {
    setSelectedInvoiceId(id)
    setVisibleReject(true)
  }

  const handlePayment = (id) => {
    console.log(`Processing payment for invoice with ID: ${id}`)
  }

  const handleDelete = async (id) => {
    console.log(id)
    setSelectedInvoiceId(id)
    setVisibleDelete(true)
  }

  const confirmRejection = () => {
    console.log(`Rejecting invoice with ID: ${selectedInvoiceId}`)
    setVisibleReject(false)
  }

  const confirmDelete = async () => {
    console.log(`Deleting invoice with ID: ${selectedInvoiceId}`)
    try {
      await axios.delete(`${apiURL}/api/invoice/delete/${selectedInvoiceId}`)
      toast.warn('Deleted Successfully')
      fetchInvoiceData()
      setInvoiceData((prevData) => prevData.filter((invoice) => invoice.id !== selectedInvoiceId))
    } catch (error) {
      toast.error('Failed to delete invoice')
      console.log(error?.response?.data?.message)
    }
    setVisibleDelete(false)
  }

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsQrCodeModalVisible(false)
      }
    }
    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [])

  const closeQrCodeModal = () => {
    setIsQrCodeModalVisible(false)
  }

  return (
    <div>
      <h1>Review Payment Transactions</h1>
      <table id="myTable" className="display w-full text-sm bg-primary text-dark font-bold">
        <thead className="bg-primary text-light"></thead>
      </table>

      {/* QR Code Modal */}
      <CModal
        alignment="center"
        visible={isQrCodeModalVisible}
        onClose={closeQrCodeModal}
        size="lg"
      >
        <CModalHeader closeButton>
          <CModalTitle>Scan QR Code</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center">
          <div className="mb-3">
            <img
              src={qrCodeUrl}
              alt="Scan this QR code"
              style={{ maxWidth: '100%', height: 'auto', margin: '0 auto' }}
            />
          </div>
          <p className="text-muted">Scan this QR code to complete your payment</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeQrCodeModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Rejection Confirmation Modal */}
      <CModal alignment="center" visible={visibleReject} onClose={() => setVisibleReject(false)}>
        <CModalHeader>
          <CModalTitle>Reject Invoice</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to reject this invoice?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleReject(false)}>
            Close
          </CButton>
          <CButton color="danger" onClick={confirmRejection}>
            Reject
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal alignment="center" visible={visibleDelete} onClose={() => setVisibleDelete(false)}>
        <CModalHeader>
          <CModalTitle>Delete Invoice</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this invoice?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleDelete(false)}>
            Close
          </CButton>
          <CButton color="danger" onClick={confirmDelete}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Add some CSS for the QR code button */}
      <style>{`
        .qr-code-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.5rem;
          color: #4299e1; /* blue color */
          padding: 0.25rem;
        }
        .qr-code-btn:hover {
          color: #2b6cb0; /* darker blue on hover */
        }
        .fa-qrcode {
          display: inline-block;
        }
      `}</style>
    </div>
  )
}

export default ReviewPayment
