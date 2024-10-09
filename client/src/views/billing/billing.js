import React, { useState } from 'react'
import { CRow, CCol, CFormInput, CButton, CFormSelect } from '@coreui/react'

// Currency converter function
const convertCurrency = (amount, currency) => {
  const rates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.76,
    PHP: 1,
  }

  return (amount * rates[currency]).toFixed(2)
}

// Receipt Component
const Receipt = ({ invoice, selectedCurrency }) => {
  if (!invoice) return null

  const convertedTotal = convertCurrency(invoice.totalAmount, selectedCurrency)

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px 0' }}>
      <h2>Invoice Receipt</h2>
      <p>
        <strong>Invoice #:</strong> {invoice.invoiceNumber}
      </p>
      <p>
        <strong>Name:</strong> {invoice.customerName}
      </p>
      <p>
        <strong>Address:</strong> {invoice.address}
      </p>
      <p>
        <strong>Date:</strong> {invoice.date}
      </p>
      <h4>Purchase Details</h4>
      {invoice.products.map((product, index) => (
        <div key={index}>
          <p>
            <strong>Product:</strong> {product.name}
          </p>
          <p>
            <strong>Price per Item:</strong> {selectedCurrency}{' '}
            {convertCurrency(product.price, selectedCurrency)}
          </p>
          <p>
            <strong>Quantity:</strong> {product.quantity}
          </p>
          <p>
            <strong>Subtotal:</strong> {selectedCurrency}{' '}
            {convertCurrency(product.quantity * product.price, selectedCurrency)}
          </p>
        </div>
      ))}
      <p>
        <strong>Total:</strong> {selectedCurrency} {convertedTotal}
      </p>
      <p>
        <strong>Status:</strong>{' '}
        <span style={{ color: invoice.status === 'Paid' ? 'green' : 'red' }}>{invoice.status}</span>
      </p>
    </div>
  )
}

const NameForm = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [productName, setProductName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(0)
  const [products, setProducts] = useState([])
  const [address, setAddress] = useState('')
  const [invoices, setInvoices] = useState([])
  const [showReceipt, setShowReceipt] = useState(null)
  const [editInvoice, setEditInvoice] = useState(null)
  const [selectedCurrency, setSelectedCurrency] = useState('USD')

  const handleCurrencyChange = (e) => setSelectedCurrency(e.target.value)

  const handleFirstNameChange = (e) => setFirstName(e.target.value)
  const handleLastNameChange = (e) => setLastName(e.target.value)
  const handleProductNameChange = (e) => setProductName(e.target.value)
  const handleQuantityChange = (e) => setQuantity(Number(e.target.value))
  const handlePriceChange = (e) => setPrice(Number(e.target.value))
  const handleAddressChange = (e) => setAddress(e.target.value)

  // Add product to the list of products
  const handleAddProduct = () => {
    if (productName && quantity > 0 && price > 0) {
      const newProduct = {
        name: productName,
        quantity,
        price,
      }
      setProducts([...products, newProduct])
      setProductName('')
      setQuantity(1)
      setPrice(0)
    } else {
      alert('Please provide valid product name, quantity, and price.')
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const totalAmount = products.reduce((acc, product) => acc + product.price * product.quantity, 0)

    const invoiceData = {
      invoiceNumber: editInvoice ? editInvoice.invoiceNumber : invoices.length + 1,
      date: new Date().toLocaleDateString(),
      customerName: `${firstName} ${lastName}`,
      address,
      products,
      totalAmount,
      status: 'Pending', // Default status is 'Pending'
    }

    if (editInvoice) {
      const updatedInvoices = invoices.map((invoice) =>
        invoice.invoiceNumber === editInvoice.invoiceNumber ? invoiceData : invoice,
      )
      setInvoices(updatedInvoices)
      setEditInvoice(null)
    } else {
      setInvoices([...invoices, invoiceData])
    }

    setFirstName('')
    setLastName('')
    setProducts([])
    setAddress('')
    setShowReceipt(invoiceData) // Show the receipt for the new invoice
  }

  const handleEdit = (invoice) => {
    setEditInvoice(invoice)
    setFirstName(invoice.customerName.split(' ')[0])
    setLastName(invoice.customerName.split(' ')[1])
    setProducts(invoice.products)
    setAddress(invoice.address)
  }

  const handleDelete = (invoiceNumber) => {
    const confirmed = window.confirm('Are you sure you want to delete this invoice?')
    if (confirmed) {
      const updatedInvoices = invoices.filter((invoice) => invoice.invoiceNumber !== invoiceNumber)
      setInvoices(updatedInvoices)
    }
  }

  // Function to mark invoice as Paid and update the receipt
  const handlePaid = (invoiceNumber) => {
    const updatedInvoices = invoices.map((invoice) =>
      invoice.invoiceNumber === invoiceNumber ? { ...invoice, status: 'Paid' } : invoice,
    )
    setInvoices(updatedInvoices)

    // Update the receipt if the current invoice is the one being marked as paid
    const updatedInvoice = updatedInvoices.find(
      (invoice) => invoice.invoiceNumber === invoiceNumber,
    )
    setShowReceipt(updatedInvoice)
  }

  const handleSave = () => {
    const wantsReceipt = window.confirm('Do you want to generate an invoice receipt?')
    if (wantsReceipt && invoices.length > 0) {
      const latestInvoice = invoices[invoices.length - 1]
      setShowReceipt(latestInvoice)
    }
  }

  return (
    <>
      <div>
        <CRow>
          <CCol xs>
            <CFormSelect value={selectedCurrency} onChange={handleCurrencyChange}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="PHP">PHP (Philippine Peso)</option>
            </CFormSelect>
          </CCol>
        </CRow>

        <CRow>
          <CCol xs>
            <CFormInput
              placeholder="First name"
              aria-label="First name"
              value={firstName}
              onChange={handleFirstNameChange}
            />
          </CCol>
          <CCol xs>
            <CFormInput
              placeholder="Last name"
              aria-label="Last name"
              value={lastName}
              onChange={handleLastNameChange}
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol xs>
            <CFormInput
              placeholder="Address"
              aria-label="Address"
              value={address}
              onChange={handleAddressChange}
              required
            />
          </CCol>
        </CRow>

        <h1>Invoice Generator</h1>

        {/* Product input */}
        <CRow>
          <CCol xs>
            <CFormInput
              placeholder="Product Name"
              aria-label="Product Name"
              value={productName}
              onChange={handleProductNameChange}
              required
            />
          </CCol>
          <CCol xs>
            <CFormInput
              type="number"
              placeholder="Quantity"
              aria-label="Quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              required
            />
          </CCol>
          <CCol xs>
            <CFormInput
              type="number"
              placeholder="Price per Item"
              aria-label="Price"
              value={price}
              onChange={handlePriceChange}
              min="0"
              required
            />
          </CCol>
          <CCol xs>
            <CButton color="primary" onClick={handleAddProduct} style={{ width: '100%' }}>
              Add Product
            </CButton>
          </CCol>
        </CRow>

        <h3>Products Added:</h3>
        <ul>
          {products.map((product, index) => (
            <li key={index}>
              {product.name} - {product.quantity} x {selectedCurrency}{' '}
              {convertCurrency(product.price, selectedCurrency)}
            </li>
          ))}
        </ul>

        <CButton color="primary" onClick={handleSubmit} style={{ marginTop: '20px' }}>
          Generate Invoice
        </CButton>

        <h2>Invoices</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Invoice #</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Customer</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Address</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Products</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Total</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.invoiceNumber}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {invoice.invoiceNumber}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{invoice.customerName}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{invoice.address}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {invoice.products.map((product, index) => (
                    <div key={index}>
                      {product.name} - {product.quantity} x {selectedCurrency}{' '}
                      {convertCurrency(product.price, selectedCurrency)}
                    </div>
                  ))}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {selectedCurrency} {convertCurrency(invoice.totalAmount, selectedCurrency)}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  <span style={{ color: invoice.status === 'Paid' ? 'green' : 'red' }}>
                    {invoice.status}
                  </span>
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  <CButton
                    color="warning"
                    onClick={() => handleEdit(invoice)}
                    style={{ marginRight: '10px' }}
                  >
                    Edit
                  </CButton>
                  <CButton
                    color="success"
                    onClick={() => handlePaid(invoice.invoiceNumber)}
                    style={{ marginRight: '10px' }}
                    disabled={invoice.status === 'Paid'}
                  >
                    Paid
                  </CButton>
                  <CButton color="danger" onClick={() => handleDelete(invoice.invoiceNumber)}>
                    Delete
                  </CButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showReceipt && <Receipt invoice={showReceipt} selectedCurrency={selectedCurrency} />}

        <CButton color="success" onClick={handleSave} style={{ marginTop: '20px', width: '100%' }}>
          Save
        </CButton>
      </div>
    </>
  )
}

export default NameForm
