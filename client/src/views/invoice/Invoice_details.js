import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { apiURL } from '../../context/client_store'
import { toast } from 'react-toastify'

const Invoice_details = () => {
  // State for payment status
  const [status, setStatus] = useState('Pending')
  const { id } = useParams()
  const [data, setData] = useState(null)
  // const [products, setProducts] = useState([])

  useEffect(() => {
    fetchSpecificId()
  }, [])

  const fetchSpecificId = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/invoice/getSpecificId/${id}`)
      console.log(response.data.data)

      // Parse products JSON string if it exists
      setData(response.data.data)
      setProducts(invoiceData.products)
      setStatus(invoiceData.status)
      console.log(invoiceData)
    } catch (error) {
      console.log(error?.response.data.message)
    }
  }

  const handleUpdateStatus = async (invoiceId) => {
    const status = 'Paid'
    console.log(invoiceId)
    try {
      const response = await axios.put(`${apiURL}/api/invoice/status/${invoiceId}`, { status })
      fetchSpecificId()
      toast.success('Updated Successfully!')
    } catch (error) {
      console.log(error?.response?.data.message)
      toast.error(error?.response?.data.message)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Upper left: Invoice details */}
      <div style={{ borderBottom: '1px solid black', paddingBottom: '10px' }}>
        <h2>Invoice</h2>
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
            {data?.products.map((product, index) => (
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
          <p>
            <strong>Status:</strong> <span className="btn btn-primary">{data?.status}</span>
          </p>
          {data?.status === 'Pending' && (
            <button
              className="btn btn-primary"
              style={styles.button}
              onClick={() => handleUpdateStatus(id)}
            >
              Mark as Paid
            </button>
          )}
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
