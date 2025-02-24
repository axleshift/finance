import axios from 'axios'
import DataTable from 'datatables.net-dt'
import React, { useEffect, useState } from 'react'
import { apiURL } from '../../context/client_store'
import { toast } from 'react-toastify'
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

const ViewAuditHistory = () => {
  const [inflowData, setInflowData] = useState([])
  const [selectedData, setSelectedData] = useState(null)
  const [visibleView, setVisibleView] = useState(false)

  const fetchInflowData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/inflow/getAll`)
      console.log(response.data)
      setInflowData(response.data)
    } catch (error) {
      console.log(error?.response.data.message)
    }
  }

  useEffect(() => {
    fetchInflowData()
  }, [])

  useEffect(() => {
    const table = new DataTable('#myTable', {
      data: inflowData,
      columns: [
        {
          title: 'Date Time',
          data: 'dateTime',
          render: (data) => `${data ? new Date(data).toLocaleDateString() : 'N/A'}`,
        },
        { title: 'Auditor', data: 'auditorId', render: (data) => `${data ? data : 'N/A'}` },
        { title: 'Auditor Id', data: 'auditor', render: (data) => `${data ? data : 'N/A'}` },
        {
          title: 'Invoice Id',
          data: 'invoiceId',
          render: (data) => `${data ? data : 'N/A'}`,
        },
        {
          title: 'Customer Name',
          data: 'customerName',
          render: (data) => `${data ? data : 'N/A'}`,
        },
        { title: 'Total Amount', data: 'totalAmount', render: (data) => `${data ? data : 'N/A'}` },
        {
          title: 'Action',
          data: null,
          render: (data) => {
            return `<div><button class="btn btn-info text-white btn-sm viewBtn" id="viewBtn_${data._id}">
                                    <i class="fa fa-eye"></i>
                </button></div>`
          },
        },
      ],

      rowCallback: (row, data) => {
        const viewBtn = row.querySelector(`#viewBtn_${data._id}`)

        viewBtn.addEventListener('click', () => handleView(data._id))
      },
    })
    return () => {
      table.destroy()
    }
  }, [inflowData])

  const handleView = (id) => {
    const selected = inflowData.find((item) => item._id === id)
    setSelectedData(selected)
    setVisibleView(true)
  }
  return (
    <div>
      <div className="my-2">
        <h1>Approved/Rejected Payables</h1>
      </div>
      <table id="myTable" className="display w-full text-sm  bg-primary text-dark font-bold">
        <thead className="text-light"></thead>
      </table>
      {/* View Modal */}
      <CModal
        alignment="center"
        scrollable
        visible={visibleView}
        onClose={() => setVisibleView(false)}
      >
        <CModalHeader>
          <CModalTitle>Audit Preview</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedData ? (
            <div>
              <p>
                <strong>Invoice ID:</strong> {selectedData?.invoiceId}
              </p>
              <p>
                <strong>Date Time:</strong> {new Date(selectedData?.dateTime).toLocaleDateString()}
              </p>
              <p>
                <strong>Auditor ID:</strong> {selectedData?.auditorId}
              </p>
              <p>
                <strong>Auditor:</strong> {selectedData?.auditor}
              </p>
              <p>
                <strong>Customer Name:</strong> {selectedData?.customerName}
              </p>
              <p>
                <strong>Total Amount:</strong> ${selectedData?.totalAmount}
              </p>
            </div>
          ) : (
            <p>No data available</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setVisibleView(false)
            }}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default ViewAuditHistory
