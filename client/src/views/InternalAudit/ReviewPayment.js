import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { apiURL } from '../../context/client_store'
import { toast } from 'react-toastify'
import DataTable from 'datatables.net-dt'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

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
          { title: 'Total Amount', data: 'totalAmount' },
          {
            title: 'QR Code',
            data: 'qrCode', // Assuming qrCode is part of the invoice data
            render: (data, type, row) => {
              const qrCodeUrl = row.qrCode ? row.qrCode : 'N/A' // Check if qrCode is available in the data
              return `<img src="${qrCodeUrl}" width="100" alt="QR Code" class="qr-code-img" />` // Render the QR code with class
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

          approveBtn?.addEventListener('click', () => handleApproval(data.id))
          rejectBtn?.addEventListener('click', () => handleRejection(data.id))
          payBtn?.addEventListener('click', () => handlePayment(data.id))
          deleteBtn?.addEventListener('click', () => handleDelete(data._id))
          viewBtn?.addEventListener('click', () => {
            const invoiceDetailsUrl = `/invoice-details?id=${data._id}`
            navigate(invoiceDetailsUrl)
          })
          editBtn?.addEventListener('click', () => navigate(`/edit_invoice/${data._id}`))

          // Adding event listener to QR Code image click to show modal
          const qrCodeImg = row.querySelector('.qr-code-img')
          if (qrCodeImg) {
            qrCodeImg.addEventListener('click', () => {
              setQrCodeUrl(data.qrCode) // Set QR code URL for modal
              setIsQrCodeModalVisible(true) // Show modal
            })
          }

          // Cleanup event listeners when component re-renders
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
  }, [invoiceData])

  // </button>
  // <button class="bg-gray-500 text-xs btn btn-danger text-white px-2 py-1 rounded-lg mx-1 deleteBtn" id="deleteBtn_${data._id}">
  //   Delete
  // </button>
  const handleApproval = (id) => {
    console.log(`Approving invoice with ID: ${id}`)
    // Logic to approve invoice (e.g., API call)
  }

  const handleRejection = (id) => {
    setSelectedInvoiceId(id) // Set selected ID for modal
    setVisibleReject(true) // Open rejection confirmation modal
  }

  const handlePayment = (id) => {
    console.log(`Processing payment for invoice with ID: ${id}`)
    // Logic to handle payment (e.g., API call)
  }

  const handleDelete = async (id) => {
    console.log(id)
    setSelectedInvoiceId(id) // Set selected ID for modal
    setVisibleDelete(true) // Open delete confirmation modal
  }

  const confirmRejection = () => {
    console.log(`Rejecting invoice with ID: ${selectedInvoiceId}`)
    setVisibleReject(false)
    // Logic to reject invoice (e.g., API call)
  }

  const confirmDelete = async () => {
    console.log(`Deleting invoice with ID: ${selectedInvoiceId}`)
    try {
      await axios.delete(`${apiURL}/api/invoice/delete/${selectedInvoiceId}`)
      toast.warn('Deleted Successfully')
      fetchInvoiceData()
      setInvoiceData((prevData) => prevData.filter((invoice) => invoice.id !== selectedInvoiceId)) // Update state to remove deleted invoice
    } catch (error) {
      toast.error('Failed to delete invoice')
      console.log(error?.response?.data?.message)
    }
    setVisibleDelete(false)
  }

  // Close QR code modal when ESC key is pressed
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
      <CModal alignment="center" visible={isQrCodeModalVisible} onClose={closeQrCodeModal}>
        <CModalHeader>
          <CModalTitle>QR Code</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <img
            src={qrCodeUrl} // Use qrCodeUrl for the modal
            alt="Full-size QR Code"
            style={{ width: '100%', height: 'auto' }}
          />
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
    </div>
  )
}

export default ReviewPayment
