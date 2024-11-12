import React, { useState } from 'react'
import { CRow, CCol, CFormInput, CButton, CFormSelect } from '@coreui/react'
import axios from 'axios'
import { apiURL } from '../../context/client_store'
import { toast } from 'react-toastify'

const GenerateInvoice = () => {
  const [invoice, setInvoice] = useState({
    firstName: '',
    lastName: '',
    address: '',
    invoices: '',
    // showReceipt: false,
    // editInvoice: false,
    selectedCurrency: 'USD',
    status: 'Paid',
    products: [{ name: '', price: '', quantity: '' }],
    totalAmount: 0,
  })

  // Update state for any input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setInvoice({
      ...invoice,
      [name]: value,
    })
  }

  // Handle product fields change
  const handleProductChange = (index, e) => {
    const newProducts = [...invoice.products]
    newProducts[index][e.target.name] = e.target.value
    setInvoice({
      ...invoice,
      products: newProducts,
    })
    calculateTotal(newProducts)
  }

  // Add new product row
  const handleAddProduct = () => {
    setInvoice({
      ...invoice,
      products: [...invoice.products, { name: '', price: '', quantity: '' }],
    })
  }

  // Remove product row and update total
  const handleRemoveProduct = (index) => {
    const newProducts = invoice.products.filter((_, i) => i !== index)
    setInvoice({
      ...invoice,
      products: newProducts,
    })
    calculateTotal(newProducts) // Recalculate total after removing a product
  }

  // Calculate total amount
  const calculateTotal = (products) => {
    const total = products.reduce((sum, product) => {
      return sum + parseFloat(product.price || 0) * parseInt(product.quantity || 0)
    }, 0)
    setInvoice({
      ...invoice,
      totalAmount: total,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(invoice)

    const response = await axios.post(`${apiURL}/api/invoices`, invoice)

    toast.success('Created invoice successfully!')
    // Here you can send the form data to an API or handle the submission
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="text-red-500">Create Invoice</h2>
      <form onSubmit={handleSubmit}>
        <CRow>
          <CCol>
            <label>Invoice Number</label>
            <CFormInput
              type="text"
              name="invoices"
              value={invoice.invoices}
              onChange={handleChange}
              required
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol>
            <label>First Name</label>
            <CFormInput
              type="text"
              name="firstName"
              value={invoice.firstName}
              onChange={handleChange}
              required
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol>
            <label>Last Name</label>
            <CFormInput
              type="text"
              name="lastName"
              value={invoice.lastName}
              onChange={handleChange}
              required
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol>
            <label>Address</label>
            <CFormInput
              type="text"
              name="address"
              value={invoice.address}
              onChange={handleChange}
              required
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol>
            <label>Status</label>
            <CFormSelect name="status" value={invoice.status} onChange={handleChange}>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Unpaid">Unpaid</option>
            </CFormSelect>
          </CCol>
        </CRow>

        <CRow>
          <CCol>
            <label>Currency</label>
            <CFormSelect
              name="selectedCurrency"
              value={invoice.selectedCurrency}
              onChange={handleChange}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
            </CFormSelect>
          </CCol>
        </CRow>

        <h3>Products</h3>
        {invoice.products.map((product, index) => (
          <CRow key={index} style={{ marginBottom: '10px' }}>
            <CCol>
              <CFormInput
                type="text"
                name="name"
                value={product.name}
                onChange={(e) => handleProductChange(index, e)}
                placeholder="Product Name"
                required
              />
            </CCol>
            <CCol>
              <CFormInput
                type="number"
                name="price"
                value={product.price}
                onChange={(e) => handleProductChange(index, e)}
                placeholder="Price"
                required
              />
            </CCol>
            <CCol>
              <CFormInput
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={(e) => handleProductChange(index, e)}
                placeholder="Quantity"
                required
              />
            </CCol>
            <CCol>
              <buttton
                className="btn btn-primary"
                type="button"
                onClick={() => handleRemoveProduct(index)}
              >
                Remove
              </buttton>
            </CCol>
          </CRow>
        ))}
        <CButton type="button" onClick={handleAddProduct}>
          Add Product
        </CButton>

        <h4>
          Total Amount: {invoice.totalAmount} {invoice.selectedCurrency}
        </h4>

        <CRow>
          <CCol>
            <label>Show Receipt</label>
            <input
              type="checkbox"
              name="showReceipt"
              checked={invoice.showReceipt}
              onChange={() => setInvoice({ ...invoice, showReceipt: !invoice.showReceipt })}
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol>
            <label>Edit Invoice</label>
            <input
              type="checkbox"
              name="editInvoice"
              checked={invoice.editInvoice}
              onChange={() => setInvoice({ ...invoice, editInvoice: !invoice.editInvoice })}
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol>
            <button className="btn btn-primary" type="submit">
              Create Invoice
            </button>
          </CCol>
        </CRow>
      </form>
    </div>
  )
}

export default GenerateInvoice
