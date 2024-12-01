import React, { useEffect, useState } from 'react'
import { CRow, CCol, CFormInput, CButton, CFormSelect } from '@coreui/react'
import axios from 'axios'
import { apiURL } from '../../context/client_store'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

const EditInvoice = () => {
  const navigate = useNavigate()
  const { id } = useParams()

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

      setInvoice({
        id: fetchedData?._id || '',
        firstName: fetchedData?.firstName || '',
        lastName: fetchedData?.lastName || '',
        address: fetchedData?.address || '',
        invoices: fetchedData?.invoices || '',
        email: fetchedData?.email || '',
        phone: fetchedData?.phone || '',
        paymentMethod: fetchedData?.paymentMethod || '',
        selectedCurrency: fetchedData?.selectedCurrency || 'PHP',
        status: fetchedData?.status || 'Pending',
        products:
          fetchedData?.products?.length > 0
            ? fetchedData.products
            : [{ name: '', price: '', quantity: '' }],
        totalAmount: fetchedData?.totalAmount || 0,
      })
    } catch (error) {
      console.error('Error fetching invoice:', error?.response?.data?.message || error.message)
      toast.error('Failed to fetch invoice data.')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setInvoice((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProductChange = (index, e) => {
    const { name, value } = e.target
    const updatedProducts = [...invoice.products]
    updatedProducts[index][name] = value
    setInvoice((prev) => ({
      ...prev,
      products: updatedProducts,
    }))
    calculateTotal(updatedProducts)
  }

  const handleAddProduct = () => {
    setInvoice((prev) => ({
      ...prev,
      products: [...prev.products, { name: '', price: '', quantity: '' }],
    }))
  }

  const handleRemoveProduct = (index) => {
    const updatedProducts = invoice.products.filter((_, i) => i !== index)
    setInvoice((prev) => ({
      ...prev,
      products: updatedProducts,
    }))
    calculateTotal(updatedProducts)
  }

  const calculateTotal = (products) => {
    const total = products.reduce((sum, product) => {
      return sum + parseFloat(product.price || 0) * parseInt(product.quantity || 0)
    }, 0)
    setInvoice((prev) => ({
      ...prev,
      totalAmount: total,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(invoice)
    try {
      await axios.put(`${apiURL}/api/invoice/update/${id}`, invoice)
      toast.success('Invoice updated successfully!')
      navigate(`/invoice-details/${id}`)
    } catch (error) {
      console.error('Error updating invoice:', error?.response?.data?.message || error.message)
      toast.error('Failed to update invoice.')
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="text-red-500">Edit Invoice</h2>
      <form onSubmit={handleSubmit}>
        <CRow>
          <CCol>
            <label>Invoice Number</label>
            <CFormInput type="text" name="id" value={invoice.id} onChange={handleChange} required />
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
            <label>Status</label>
            <CFormSelect name="status" value={invoice.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </CFormSelect>
          </CCol>
          <CCol>
            <label>Email</label>
            <CFormInput
              type="email"
              name="email"
              value={invoice.email}
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
          <CCol>
            <label>Phone</label>
            <CFormInput
              type="text"
              name="phone"
              value={invoice.phone}
              onChange={handleChange}
              required
            />
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
              <option value="PHP">PHP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
            </CFormSelect>
          </CCol>
          <CCol>
            <label>Payment Method</label>
            <CFormSelect name="paymentMethod" value={invoice.paymentMethod} onChange={handleChange}>
              <option value="GCash">GCash</option>
              <option value="Cash On Delivery">Cash On Delivery</option>
              <option value="Bank Account">Bank Account</option>
            </CFormSelect>
          </CCol>
        </CRow>

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
            <CButton color="primary" type="submit">
              Update Invoice
            </CButton>
          </CCol>
        </CRow>
      </form>
    </div>
  )
}

export default EditInvoice
