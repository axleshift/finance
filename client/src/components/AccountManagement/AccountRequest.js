import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from 'datatables.net-dt'
import { apiURL } from '../../context/client_store'
import {
  CButton,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormSelect,
} from '@coreui/react'
import { toast } from 'react-toastify'

const AccountRequest = () => {
  const [accountData, setAccountData] = useState([])
  const [visibleDelete, setVisibleDelete] = useState(false)
  const [visibleView, setVisibleView] = useState(false)
  const [visibleAdd, setVisibleAdd] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null)
  const [selectedData, setSelectedData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    image: null,
  })
  const [newAccount, setNewAccount] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    image: null,
  })

  useEffect(() => {
    fetchAccountData()
  }, [])

  const fetchAccountData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/accountRequest`)
      setAccountData(response.data)
    } catch (error) {
      console.error('Error fetching account data:', error)
    }
  }

  useEffect(() => {
    const table = new DataTable('#myTable', {
      data: accountData,
      columns: [
        { title: 'Full Name', data: 'fullName' },
        { title: 'Email', data: 'email' },
        {
          title: 'Action',
          data: null,
          render: (data) => {
            return `
              <div>
                <button class="btn btn-primary text-xs px-2 py-1 mx-1 viewBtn" id="viewBtn_${data._id}">
                  View
                </button>
                <button class="btn btn-danger text-xs px-2 py-1 mx-1 deleteBtn" id="deleteBtn_${data._id}">
                  Delete
                </button>
              </div>
            `
          },
        },
      ],
      order: [[0, 'desc']],
      createdRow: (row, data) => {
        const viewBtn = row.querySelector(`#viewBtn_${data._id}`)
        const deleteBtn = row.querySelector(`#deleteBtn_${data._id}`)

        viewBtn?.addEventListener('click', () => handleView(data._id))
        deleteBtn?.addEventListener('click', () => handleDelete(data._id))
      },
    })

    return () => {
      table.destroy()
    }
  }, [accountData])

  const handleView = (id) => {
    const selected = accountData.find((item) => item._id === id)
    setSelectedData(selected || { fullName: '', email: '', password: '', role: '', image: null })
    setVisibleView(true)
  }

  const handleDelete = (id) => {
    setSelectedInvoiceId(id)
    setVisibleDelete(true)
  }

  const confirmDelete = async () => {
    try {
      await axios.delete(`${apiURL}/api/accountRequest/${selectedInvoiceId}`)
      setAccountData((prevData) => prevData.filter((item) => item._id !== selectedInvoiceId))
      toast.warn('Deleted Successfully!')
    } catch (error) {
      console.error('Failed to delete account:', error)
    }
    setVisibleDelete(false)
  }

  const handleAddRequest = async () => {
    const formData = new FormData()
    formData.append('fullName', newAccount.fullName)
    formData.append('email', newAccount.email)

    if (newAccount.image) {
      formData.append('image', newAccount.image)
    }

    try {
      await axios.post(`${apiURL}/api/accountRequest`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      fetchAccountData() // Refresh the data after adding the request
      toast.success('Account Request Added Successfully!')
      setVisibleAdd(false)
      setNewAccount({ fullName: '', email: '', password: '', role: '', image: null }) // Reset the form fields
    } catch (error) {
      console.error('Failed to add account request:', error)
      toast.error('Failed to add account request')
    }
  }

  const handleCreateAccount = async () => {
    const formData = new FormData()

    // Append data correctly
    formData.append('fullName', selectedData.fullName)
    formData.append('email', selectedData.email)
    formData.append('password', selectedData.password)
    formData.append('role', selectedData.role)
    if (selectedData.image) {
      formData.append('image', selectedData.image) // Append image only if it exists
    }

    try {
      await axios.post(`${apiURL}/api/user/create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('Account Created Successfully!')
      setVisibleView(false) // Close modal after creating account
    } catch (error) {
      console.error('Failed to create account:', error)
      toast.error('Failed to create account')
    }
  }

  return (
    <div>
      <h1>Account Request</h1>

      <CButton className="mb-3 btn btn-primary" onClick={() => setVisibleAdd(true)}>
        Add Request
      </CButton>

      <table id="myTable" className="display text-dark">
        <thead className="text-light bg-primary">
          <tr>
            <th>Full Name</th>
            <th>email</th>
            <th>Action</th>
          </tr>
        </thead>
      </table>

      {/* View Modal */}
      <CModal alignment="center" visible={visibleView} onClose={() => setVisibleView(false)}>
        <CModalHeader>
          <CModalTitle>View Account Request</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              label="Full Name"
              value={selectedData.fullName}
              onChange={(e) => setSelectedData({ ...selectedData, fullName: e.target.value })}
              className="mb-3"
            />
            <CFormInput
              type="email"
              label="Email"
              value={selectedData.email}
              onChange={(e) => setSelectedData({ ...selectedData, email: e.target.value })}
              className="mb-3"
            />
            <CFormInput
              type="password"
              label="Password"
              value={selectedData.password}
              onChange={(e) => setSelectedData({ ...selectedData, password: e.target.value })}
              className="mb-3"
            />
            <CFormSelect
              label="Role"
              value={selectedData.role}
              onChange={(e) => setSelectedData({ ...selectedData, role: e.target.value })}
              className="mb-3"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="technician">Technician</option>
              <option value="staff">Staff</option>
              <option value="user">User</option>
            </CFormSelect>
            <CFormInput
              type="file"
              label="Upload Image"
              accept="image/*"
              onChange={(e) => setSelectedData({ ...selectedData, image: e.target.files[0] })}
              className="mb-3"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleView(false)}>
            Close
          </CButton>
          <CButton color="success" onClick={handleCreateAccount}>
            Create Account
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal alignment="center" visible={visibleDelete} onClose={() => setVisibleDelete(false)}>
        <CModalHeader>
          <CModalTitle>Delete Account</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this account?</p>
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

      {/* Add Request Modal */}
      <CModal alignment="center" visible={visibleAdd} onClose={() => setVisibleAdd(false)}>
        <CModalHeader>
          <CModalTitle>Add Account Request</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              label="Full Name"
              value={newAccount.fullName}
              onChange={(e) => setNewAccount({ ...newAccount, fullName: e.target.value })}
              placeholder="Enter full name"
              className="mb-3"
            />
            <CFormInput
              type="email"
              label="Email"
              value={newAccount.email}
              onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
              placeholder="Enter email"
            />
            {/* <CFormInput
              type="file"
              label="Upload Image"
              accept="image/*"
              onChange={(e) => setNewAccount({ ...newAccount, image: e.target.files[0] })}
              className="mb-3"
            /> */}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleAdd(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleAddRequest}>
            Add Request
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default AccountRequest
