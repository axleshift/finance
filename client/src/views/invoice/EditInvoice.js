import React, { useEffect, useState } from 'react'
import { CRow, CCol, CFormInput, CButton, CFormSelect } from '@coreui/react'
import axios from 'axios'
import { apiURL } from '../../context/client_store'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

const EditInvoice = () => {
  const [data, setData] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()

  // State for invoice
  const [invoice, setInvoice] = useState({
    id: '',
    firstName: '',
    lastName: '',
    address: '',
    invoices: '',
    email: '',
    phone: '',
    paymentMethod: '',
    selectedCurrency: 'PHP',
    status: 'Pending',
    products: [{ name: '', price: '', quantity: '' }],
    totalAmount: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/invoice/getSpecificId/${id}`)
      const fetchedData = response.data.data

      console.log(fetchedData)

      // Set the invoice data with fetched values
      setInvoice({
        id: fetchedData?._id || '',
        firstName: fetchedData?.firstName || '',
        lastName: fetchedData.lastName || '',
        address: fetchedData.address || '',
        invoices: fetchedData.invoices || '',
        email: fetchedData.email || '',
        phone: fetchedData.phone || '',
        paymentMethod: fetchedData.paymentMethod || '',
        selectedCurrency: fetchedData.selectedCurrency || 'PHP',
        status: fetchedData.status || 'Pending',
        products: products.length > 0 ? products : [{ name: '', price: '', quantity: '' }],
        totalAmount: fetchedData.totalAmount || 0,
      })
    } catch (error) {
      console.log(error?.response?.data?.message)
    }
  }
  // Update state for input changes
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
    calculateTotal(newProducts)
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
    try {
      await axios.put(`${apiURL}/api/invoices/${id}`, invoice)
      navigate(`/invoice-details/${id}`)
      toast.success('Invoice updated successfully!')
    } catch (error) {
      console.log(error)
      toast.error('Failed to update invoice')
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="text-red-500">Edit Invoice</h2>
      <form onSubmit={handleSubmit}>
        <CRow>
          <CCol>
            <label>Invoice Number</label>
            <CFormInput
              type="text"
              name="id"
              value={invoice?.id}
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
              value={invoice?.firstName}
              onChange={handleChange}
              required
            />
          </CCol>
          <CCol>
            <label>Last Name</label>
            <CFormInput
              type="text"
              name="lastName"
              value={invoice?.lastName}
              onChange={handleChange}
              required
            />
          </CCol>
        </CRow>

        <div className="row ">
          <div className="col ">
            <CRow>
              <CCol>
                <label>Status</label>
                <CFormSelect name="status" value={invoice.status} onChange={handleChange}>
                  <option value="Pending" selected>
                    Pending
                  </option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </CFormSelect>
              </CCol>
            </CRow>
          </div>

          <div className="col ">
            <CRow>
              <CCol>
                <label>Email</label>
                <CFormInput
                  type="email"
                  name="email"
                  value={invoice?.email}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>
          </div>
        </div>
        <CRow>
          <CCol>
            <label>Address</label>
            <CFormInput
              type="text"
              name="address"
              value={invoice?.address}
              onChange={handleChange}
              required
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol>
            <label>Phone</label>
            <CFormInput
              type="phone"
              name="phone"
              value={invoice?.phone}
              onChange={handleChange}
              required
            />
          </CCol>
        </CRow>

        <div className="row">
          <div className="col">
            <CRow>
              <CCol>
                <label>Currency</label>
                <CFormSelect
                  name="selectedCurrency"
                  value={invoice.selectedCurrency}
                  onChange={handleChange}
                >
                  <option value="PHP" selected>
                    PHP
                  </option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="INR">INR</option>
                </CFormSelect>
              </CCol>
            </CRow>
          </div>

          <div className="col">
            <CRow>
              <CCol>
                <label>Payment Method</label>
                <CFormSelect
                  name="paymentMethod"
                  value={invoice?.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="GCash" selected>
                    GCash
                  </option>
                  <option value="Cash On Delivery">Cash On Delivery</option>
                  <option value="Bank Account">Bank Account</option>
                </CFormSelect>
              </CCol>
            </CRow>
          </div>
        </div>
        {/* Other fields here */}

        <h3 className="py-3">Products</h3>
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
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleRemoveProduct(index)}
              >
                Remove
              </button>
            </CCol>
          </CRow>
        ))}

        <button type="button" className="btn btn-primary my-3" onClick={handleAddProduct}>
          Add Product
        </button>

        <h4>
          Total Amount: {invoice.totalAmount} {invoice.selectedCurrency}
        </h4>

        <CRow>
          <CCol>
            <div className="d-flex justify-content-center">
              <button className="btn btn-primary" type="submit">
                Update Invoice
              </button>
            </div>
          </CCol>
        </CRow>
      </form>
    </div>
  )
}

export default EditInvoice
