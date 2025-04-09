import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom' // Add useLocation hook to get query params
import axios from 'axios'
import { apiURL } from '../../context/client_store'
import Store from '../../context/client_store'
import { toast } from 'react-toastify'

const Invoice_details = () => {
  // State for payment status
  const [status, setStatus] = useState('Pending')
  const { search } = useLocation()

  const queryParams = new URLSearchParams(search) // Parse the query params
  const invoiceId = queryParams.get('id') // Get the invoice ID from query params
  const [data, setData] = useState(null)
  const { token } = Store()

  const router = useNavigate()

  useEffect(() => {
    if (invoiceId) {
      fetchSpecificId(invoiceId)
    }
  }, [invoiceId])

  const fetchSpecificId = async (id) => {
    try {
      const response = await axios.get(`${apiURL}/api/invoice/getSpecificId/${id}`)
      console.log(response.data.data)

      // Set data to the state
      setData(response.data.data)
      setStatus(response.data.data.status) // Set status based on fetched data
    } catch (error) {
      console.log(error?.response?.data?.message)
      toast.error('Failed to fetch invoice details!')
    }
  }

  const handleUpdateStatus = async () => {
    const updatedStatus = 'Paid'
    try {
      const response = await axios.put(`${apiURL}/api/invoice/status/${invoiceId}`, {
        status: updatedStatus,
      })
      fetchSpecificId(invoiceId) // Re-fetch the invoice data to update the status
      toast.success('Updated Successfully!')
    } catch (error) {
      console.log(error?.response?.data?.message)
      toast.error(error?.response?.data?.message)
    }
  }

  const handleUpdateAudit = async () => {
    const updatedStatus = 'Paid'
    try {
      const response = await axios.post(
        `${apiURL}/api/invoice/updateAudit/${invoiceId}`,
        {
          status: updatedStatus,
        },
        { headers: { token: token } },
      )
      router('/reviewPaymentTransactions')
      fetchSpecificId(invoiceId) // Re-fetch the invoice data to update the status

      toast.success('Updated Successfully!')
    } catch (error) {
      console.log(error?.response?.data?.message)
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Upper left: Invoice details */}

      <div className="d-flex justify-content-between">
        <div style={{ borderBottom: '1px solid black', paddingBottom: '10px' }}>
          <h2>Invoices</h2>
          <p>
            <strong>Name:</strong> {data?.firstName} {data?.lastName}
          </p>
          <p>
            <strong>Address:</strong> {data?.address}
          </p>
          <p>
            <strong>Invoice Number:</strong> {data?.invoiceNumber}
          </p>
          <p>
            <strong>Email:</strong> {data?.email}
          </p>
          <p>
            <strong>Date:</strong>
            {new Date(data?.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div>
          <img
            width={150}
            src="https://th.bing.com/th/id/OIP.sRDxelheGapUF3Q9NlEJ6gHaEg?rs=1&pid=ImgDetMain"
            alt=""
          />
        </div>
      </div>

      {/* Bottom section: Product details */}
      <div style={{ marginTop: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={styles.cell}>Product Name</th>
              <th style={styles.cell}>Quantity</th>
              <th style={styles.cell}>Price</th>
              <th style={styles.cell}>Total</th>
            </tr>
          </thead>
          <tbody>
            {data?.products?.map((product, index) => (
              <tr key={index}>
                <td style={styles.cell}>{product?.name}</td>
                <td style={styles.cell}>{product?.quantity}</td>
                <td style={styles.cell}>${product?.price}</td>
                <td style={styles.cell}>${product?.quantity * product?.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary and Status */}
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <p>
            <strong>Total Amount: ${data?.totalAmount}</strong>
          </p>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button onClick={handleUpdateAudit} className="btn btn-success text-light">
              <span className="">Audit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Styles object for table cells and buttons
const styles = {
  cell: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
}

export default Invoice_details
