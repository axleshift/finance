import DataTable from 'datatables.net-dt'
import React, { useEffect, useState } from 'react'
import {
  CButton,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { toast } from 'react-toastify'
import axios from 'axios'
import client_store from '../../context/client_store'
import { apiURL } from '../../context/client_store'

const ChartOfAccountsList = () => {
  const [loading, setLoading] = useState(false)
  const [visibleView, setVisibleView] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false)
  const [selectedData, setSelectedData] = useState(null)
  const [accountsData, setAccountsData] = useState([])
  const [visibleAddAccount, setVisibleAddAccount] = useState(false)
  const [requestIdToDelete, setRequestIdToDelete] = useState(null)

  // Sample data for freight management chart of accounts
  const sampleAccounts = [
    {
      _id: '1',
      accountCode: '40100',
      accountName: 'Linehaul Revenue',
      category: 'Revenue',
      subcategory: 'Core Services',
      description: 'Primary transport fees for FTL/LTL shipments',
      isFuelRelated: false,
      perMileTracking: false,
      lastUpdated: '2023-10-15T08:30:00Z',
      status: 'Active',
    },
    {
      _id: '2',
      accountCode: '40110',
      accountName: 'Fuel Surcharge Income',
      category: 'Revenue',
      subcategory: 'Surcharges',
      description: 'Pass-through fuel fees billed to clients',
      isFuelRelated: true,
      perMileTracking: true,
      lastUpdated: '2023-10-15T08:30:00Z',
      status: 'Active',
    },
    {
      _id: '3',
      accountCode: '40130',
      accountName: 'Detention Fees',
      category: 'Revenue',
      subcategory: 'Accessorials',
      description: 'Charges when customer delays loading/unloading >2 hours',
      isFuelRelated: false,
      perMileTracking: false,
      lastUpdated: '2023-10-14T10:15:00Z',
      status: 'Active',
    },
    {
      _id: '4',
      accountCode: '60310',
      accountName: 'Diesel Fuel Expense',
      category: 'Expense',
      subcategory: 'Fuel',
      description: 'Over-the-road diesel purchases (excludes DEF)',
      isFuelRelated: true,
      perMileTracking: true,
      lastUpdated: '2023-10-16T09:45:00Z',
      status: 'Active',
    },
    {
      _id: '5',
      accountCode: '60315',
      accountName: 'IFTA Fuel Taxes',
      category: 'Expense',
      subcategory: 'Fuel Taxes',
      description: 'Quarterly state/provincial fuel taxes',
      isFuelRelated: true,
      perMileTracking: false,
      lastUpdated: '2023-10-16T09:45:00Z',
      status: 'Active',
    },
    {
      _id: '6',
      accountCode: '60620',
      accountName: 'Truck Maintenance - Tires',
      category: 'Expense',
      subcategory: 'Fleet Maintenance',
      description: 'Tire replacement and repairs for fleet vehicles',
      isFuelRelated: false,
      perMileTracking: true,
      lastUpdated: '2023-10-13T14:20:00Z',
      status: 'Active',
    },
    {
      _id: '7',
      accountCode: '15100',
      accountName: 'Semi-Trucks',
      category: 'Asset',
      subcategory: 'Fleet Equipment',
      description: 'Depreciable value of owned trucks (5-year lifespan)',
      isFuelRelated: false,
      perMileTracking: false,
      lastUpdated: '2023-10-12T11:10:00Z',
      status: 'Active',
    },
    {
      _id: '8',
      accountName: 'Trailer Leases',
      accountCode: '60700',
      category: 'Expense',
      subcategory: 'Equipment Rental',
      description: 'Monthly trailer leasing costs',
      isFuelRelated: false,
      perMileTracking: true,
      lastUpdated: '2023-10-11T13:25:00Z',
      status: 'Inactive',
    },
    {
      _id: '9',
      accountCode: '20250',
      accountName: 'Accrued IFTA Taxes',
      category: 'Liability',
      subcategory: 'Tax Payables',
      description: 'Estimated quarterly fuel taxes owed',
      isFuelRelated: true,
      perMileTracking: false,
      lastUpdated: '2023-10-10T16:30:00Z',
      status: 'Active',
    },
    {
      _id: '10',
      accountCode: '50100',
      accountName: 'Driver Wages',
      category: 'Expense',
      subcategory: 'Payroll',
      description: 'Company driver base pay (excludes owner-operators)',
      isFuelRelated: false,
      perMileTracking: true,
      lastUpdated: '2023-10-09T08:15:00Z',
      status: 'Active',
    },
  ]

  useEffect(() => {
    // In a real app, you would fetch from API:
    // const fetchAccounts = async () => {
    //   try {
    //     const response = await axios.get(`${apiURL}/api/accounts`)
    //     setAccountsData(response.data)
    //   } catch (error) {
    //     console.log(error?.response?.data)
    //   }
    // }
    // fetchAccounts()

    // Using sample data for demonstration
    setAccountsData(sampleAccounts)
  }, [])

  useEffect(() => {
    const table = new DataTable('#accountsTable', {
      data: accountsData,
      columns: [
        { title: 'Account Code', data: 'accountCode' },
        { title: 'Account Name', data: 'accountName' },
        { title: 'Category', data: 'category' },
        { title: 'Subcategory', data: 'subcategory' },
        {
          title: 'Fuel Related',
          data: 'isFuelRelated',
          render: (data) => (data ? 'Yes' : 'No'),
        },
        {
          title: 'Status',
          data: 'status',
          render: (data) => {
            return `<span class="badge ${data === 'Active' ? 'bg-success' : 'bg-secondary'}">
              ${data}
            </span>`
          },
        },
        {
          title: 'Action',
          data: null,
          render: (data) => {
            return `
              <div>
                <button class="btn btn-info text-white btn-sm viewBtn" id="viewBtn_${data._id}">
                  <i class="fa fa-eye"></i>
                </button>
              
              </div>`
          },
        },
      ],
      order: [[0, 'asc']], // Sort by account code
      rowCallback: (row, data) => {
        const viewBtn = row.querySelector(`#viewBtn_${data._id}`)
        const deleteBtn = row.querySelector(`#deleteBtn_${data._id}`)

        viewBtn?.addEventListener('click', () => handleView(data._id))
        deleteBtn?.addEventListener('click', () => handleDelete(data._id))
      },
    })

    return () => {
      table.destroy()
    }
  }, [accountsData])

  //   <button class="btn btn-danger text-white btn-sm deleteBtn" id="deleteBtn_${data._id}">
  //   <i class="fa fa-trash"></i>
  // </button>
  const handleView = (id) => {
    const selected = accountsData.find((item) => item._id === id)
    setSelectedData(selected)
    setVisibleView(true)
  }

  const handleDelete = (id) => {
    setRequestIdToDelete(id)
    setVisibleDelete(true)
  }

  const confirmationDelete = async () => {
    try {
      // In a real app:
      // const response = await axios.delete(`${apiURL}/api/accounts/${requestIdToDelete}`)
      // toast.warn(response?.data.message)

      // For demo, just filter out the deleted item
      setAccountsData(accountsData.filter((item) => item._id !== requestIdToDelete))
      toast.warn('Account deleted successfully')
    } catch (error) {
      toast.error('Failed to delete account')
    }
    setVisibleDelete(false)
  }

  return (
    <div>
      <h1>Chart of Accounts Management</h1>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={() => setVisibleAddAccount(true)}>
          Add New Account
        </button>
      </div>

      <table id="accountsTable" className="display text-black" style={{ width: '100%' }}>
        <thead className="text-white bg-primary">
          <tr>
            <th>Account Code</th>
            <th>Account Name</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Fuel Related</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
      </table>

      {/* View Modal */}
      <CModal
        alignment="center"
        scrollable
        visible={visibleView}
        onClose={() => setVisibleView(false)}
      >
        <CModalHeader>
          <CModalTitle>Account Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedData ? (
            <div>
              <p>
                <strong>Account Code:</strong> {selectedData.accountCode}
              </p>
              <p>
                <strong>Account Name:</strong> {selectedData.accountName}
              </p>
              <p>
                <strong>Category:</strong> {selectedData.category}
              </p>
              <p>
                <strong>Subcategory:</strong> {selectedData.subcategory}
              </p>
              <p>
                <strong>Description:</strong> {selectedData.description}
              </p>
              <p>
                <strong>Fuel Related:</strong> {selectedData.isFuelRelated ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Per Mile Tracking:</strong> {selectedData.perMileTracking ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Last Updated:</strong> {new Date(selectedData.lastUpdated).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={`badge ${selectedData.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}
                >
                  {selectedData.status}
                </span>
              </p>
            </div>
          ) : (
            <p>No data available</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleView(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal alignment="center" visible={visibleDelete} onClose={() => setVisibleDelete(false)}>
        <CModalHeader>
          <CModalTitle>Delete Account</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this account? This action cannot be undone.</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleDelete(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={confirmationDelete}>
            Confirm Delete
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Add Account Modal */}
      <CModal scrollable visible={visibleAddAccount} onClose={() => setVisibleAddAccount(false)}>
        <CModalHeader>
          <CModalTitle>Add New Account</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormInput
                type="text"
                id="accountCode"
                label="Account Code"
                placeholder="e.g., 40100"
              />
            </div>
            <div className="mb-3">
              <CFormInput
                type="text"
                id="accountName"
                label="Account Name"
                placeholder="e.g., Linehaul Revenue"
              />
            </div>
            {/* Add other form fields similarly */}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleAddAccount(false)}>
            Cancel
          </CButton>
          <CButton color="primary">Save Account</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default ChartOfAccountsList
