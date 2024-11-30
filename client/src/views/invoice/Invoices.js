import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { apiURL } from '../../context/client_store'
import { toast } from 'react-toastify'
import DataTable from 'datatables.net-dt'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const Invoices = () => {
  const [invoiceData, setInvoiceData] = useState([])
  const [visibleReject, setVisibleReject] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null)

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
          { title: 'Invoice#', data: 'invoiceNumber' },
          { title: 'First Name', data: 'firstName' },
          { title: 'Last Name', data: 'lastName' },
          { title: 'Currency', data: 'selectedCurrency' },
          { title: 'Status', data: 'status' },
          // { title: 'Email', data: 'email' },
          { title: 'Payment Method', data: 'paymentMethod' },
          { title: 'Total Amount', data: 'totalAmount' },
          // {
          //   title: 'Products',
          //   data: 'products',
          //   render: (data) => {
          //     if (!Array.isArray(data)) return 'N/A' // Handle cases where products might not be an array
          //     return data
          //       .map(
          //         (product) => `
          //           <div>
          //             ${product?.name || 'Unnamed Product'}: $${product?.price} x ${product?.quantity}
          //           </div>
          //         `,
          //       )
          //       .join('')
          //   },
          // },
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
          viewBtn?.addEventListener('click', () => navigate(`/invoice-details/${data._id}`))
          editBtn?.addEventListener('click', () => navigate(`/edit_invoice/${data._id}`))
        },
      })
      // <button class="bg-green-500 text-xs text-white px-2 py-1 rounded-lg mx-1 approveBtn" ${
      //   isPaid ? "style='display:none;'" : ''
      // } id="approveBtn_${data.id}">
      //   Approve
      // </button>
      // <button class="bg-red-500 text-xs text-white px-2 py-1 rounded-lg mx-1 rejectBtn" ${
      //   isPaid ? "style='display:none;'" : ''
      // } id="rejectBtn_${data.id}">
      //   Reject
      // </button>

      return () => {
        table.destroy()
      }
    }
  }, [invoiceData])

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

  return (
    <div>
      <h1>Invoice</h1>
      <table id="myTable" className="display w-full text-sm bg-primary text-dark font-bold">
        <thead className="bg-primary text-light"></thead>
      </table>

      {/* Rejection Confirmation Modal */}
      <CModal alignment="center" visible={visibleReject} onClose={() => setVisibleReject(false)}>
        <CModalHeader>
          <CModalTitle>Reject Invoice</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to reject this invoice?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleReject(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={confirmRejection}>
            Confirm Rejection
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal alignment="center" visible={visibleDelete} onClose={() => setVisibleDelete(false)}>
        <CModalHeader>
          <CModalTitle>Delete Invoice</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this invoice?</p>
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
    </div>
  )
}

export default Invoices
