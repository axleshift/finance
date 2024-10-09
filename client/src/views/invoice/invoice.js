import React, { useState } from 'react'
import {} from '@coreui/react'

const Invoice = () => {
  // State for payment status
  const [status, setStatus] = useState('Pending')

  // Sample invoice data
  const invoice = {
    number: '09629941794',
    name: 'Denmark Nini',
    address: 'Caloocan City',
    date: 'October 9, 2024',
    products: [
      { name: 'Shoes', quantity: 2, price: 250 },
      { name: 'T-shirt', quantity: 1, price: 500 },
    ],
    getTotal() {
      return this.products.reduce((total, item) => total + item.quantity * item.price, 0)
    },
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Upper left: Invoice details */}
      <div style={{ borderBottom: '1px solid black', paddingBottom: '10px' }}>
        <h2>Invoice</h2>
        <p>
          <strong>Name:</strong> {invoice.name}
        </p>
        <p>
          <strong>Address:</strong> {invoice.address}
        </p>
        <p>
          <strong>Invoice Number:</strong> {invoice.number}
        </p>
        <p>
          <strong>Date:</strong> {invoice.date}
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
            {invoice.products.map((product, index) => (
              <tr key={index}>
                <td style={styles.cell}>{product.name}</td>
                <td style={styles.cell}>{product.quantity}</td>
                <td style={styles.cell}>${product.price}</td>
                <td style={styles.cell}>${product.quantity * product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary and Status */}
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <p>
            <strong>Total Amount: ${invoice.getTotal()}</strong>
          </p>
          <p>
            <strong>Status:</strong> {status}
          </p>
          {status === 'Pending' && (
            <button style={styles.button} onClick={() => setStatus('Paid')}>
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

export default Invoice
