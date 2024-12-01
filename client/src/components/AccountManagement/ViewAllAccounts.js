import DataTable from 'datatables.net-dt'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { apiURL } from '../../context/client_store'
import {
  CAvatar,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { toast } from 'react-toastify'

const ViewAllAccounts = () => {
  const [usersData, setUsersData] = useState([])
  const [visibleView, setVisibleView] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false)
  const [selectedData, setSelectedData] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [newData, setNewData] = useState({
    _id: '',
    fullName: '',
    email: '',
    password: '',
    role: '',
    image: '',
  })

  useEffect(() => {
    fetchAllUser()
  }, [])

  const fetchAllUser = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/user/`)
      setUsersData(response?.data)
    } catch (error) {
      console.log(error?.response?.data?.message)
    }
  }

  useEffect(() => {
    const table = new DataTable('#myTable', {
      data: usersData,
      columns: [
        {
          title: 'Image',
          data: null,
          render: (data) => {
            return `
              <img class="w-50 rounded" src="${data?.image || '/default-avatar.png'}" alt="User Image" />
            `
          },
        },
        {
          title: '#Id',
          data: null,
          render: (data) => (data?.userNumber ? data?.userNumber : 'N/A'),
        },
        { title: 'Full Name', data: 'fullName' },
        { title: 'Email', data: 'email' },
        { title: 'Role', data: 'role' },
        {
          title: 'Action',
          data: null,
          render: (data) => {
            return `
              <div>
                <button class="bg-teal-500 text-xs btn btn-warning text-white px-2 py-1 rounded-lg mx-1 " id="editBtn_${data._id}">
                  Edit
                </button>
                <button class="bg-teal-500 text-xs btn btn-info text-white px-2 py-1 rounded-lg mx-1 " id="viewBtn_${data._id}">
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
      columnDefs: [
        {
          targets: 0, // Image column
          width: '150px', // Set the width of the Image column
          className: 'text-center', // Optional: Centers content
        },
      ],
      order: [[1, 'desc']],
      rowCallback: (row, data) => {
        const viewBtn = row.querySelector(`#viewBtn_${data._id}`)
        const editBtn = row.querySelector(`#editBtn_${data._id}`)
        const deleteBtn = row.querySelector(`#deleteBtn_${data._id}`)

        viewBtn?.addEventListener('click', () => handleView(data._id))
        editBtn?.addEventListener('click', () => handleEdit(data._id))
        deleteBtn?.addEventListener('click', () => openDeleteModal(data._id))
      },
    })

    return () => {
      table.destroy()
    }
  }, [usersData])

  const handleView = (id) => {
    setVisibleView(true)
    const selected = usersData.find((item) => item._id === id)
    setSelectedData(selected || { fullName: '', email: '', password: '', role: '', image: '' })
  }

  const handleEdit = (id) => {
    const selected = usersData.find((item) => item._id === id)
    setNewData({
      _id: selected?._id,
      fullName: selected?.fullName,
      email: selected?.email,
      password: '',
      role: selected?.role,
      image: selected?.image || '',
    })
    setVisibleEdit(true)
  }

  const openDeleteModal = (id) => {
    setDeleteId(id)
    setVisibleDelete(true)
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${apiURL}/api/user/delete/${deleteId}`)
      toast.success('User deleted successfully!')
      fetchAllUser()
      setVisibleDelete(false)
    } catch (error) {
      console.log('Error deleting user:', error)
    }
  }

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData()
      formData.append('fullName', newData.fullName)
      formData.append('email', newData.email)
      formData.append('password', newData.password)
      formData.append('role', newData.role)
      if (newData.image && typeof newData.image !== 'string') {
        formData.append('image', newData.image)
      }

      await axios.put(`${apiURL}/api/user/update/${newData?._id}`, formData)
      toast.success('Updated Successfully!')
      fetchAllUser() // Refresh the user list after editing
      setVisibleEdit(false)
    } catch (error) {
      console.log('Error updating user:', error)
    }
  }

  return (
    <div>
      <h1>View All Accounts</h1>
      <table id="myTable" className="display w-full text-sm bg-primary text-dark font-bold"></table>

      {/* View Modal */}
      <CModal alignment="center" visible={visibleView} onClose={() => setVisibleView(false)}>
        <CModalHeader>
          <CModalTitle>View Account Request</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p>
                  <strong>Full Name:</strong> {selectedData?.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedData?.email}
                </p>
                <p>
                  <strong>Role:</strong> {selectedData?.role}
                </p>
              </div>

              {/* Center the avatar image */}
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ width: '100%' }}
              >
                <img
                  src={selectedData?.image || '/default-avatar.png'}
                  className="w-50"
                  alt="User Image"
                />
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleView(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Modal */}
      <CModal alignment="center" visible={visibleEdit} onClose={() => setVisibleEdit(false)}>
        <CModalHeader>
          <CModalTitle>Edit Account</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div>
              <CFormInput
                label="Full Name"
                value={newData.fullName}
                onChange={(e) => setNewData({ ...newData, fullName: e.target.value })}
              />
              <CFormInput
                label="Email"
                value={newData.email}
                onChange={(e) => setNewData({ ...newData, email: e.target.value })}
              />
              <CFormInput
                label="Password"
                type="password"
                value={newData.password}
                onChange={(e) => setNewData({ ...newData, password: e.target.value })}
              />
              <CFormSelect
                label="Role"
                value={newData.role}
                onChange={(e) => setNewData({ ...newData, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="technician">Technician</option>
                <option value="staff">Staff</option>
                <option value="user">User</option>
              </CFormSelect>
              <CFormInput
                type="file"
                label="Upload Image"
                accept="image/*"
                onChange={(e) => setNewData({ ...newData, image: e.target.files[0] })}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleEdit(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSaveEdit}>
            Save changes
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Modal */}
      <CModal alignment="center" visible={visibleDelete} onClose={() => setVisibleDelete(false)}>
        <CModalHeader>
          <CModalTitle>Delete Account</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this account?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleDelete(false)}>
            Close
          </CButton>
          <CButton color="danger" onClick={handleDelete}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default ViewAllAccounts
