import DataTable from 'datatables.net-dt'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { apiURL } from '../../context/client_store'
import { toast } from 'react-toastify'

const FreighAudit = () => {
  const [freigthData, setFreigthData] = useState([])

  const fetchFreightAuditData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/freightAudit`)
      console.log(response.data)
      setFreigthData(response.data)
    } catch (error) {
      toast.error('Failed to fetch invoice data')
    }
  }

  useEffect(() => {
    fetchFreightAuditData()
  }, [])

  useEffect(() => {
    const table = new DataTable('#myTable', {
      data: freigthData,
      columns: [
        { title: 'Invoice #', data: 'invoiceNumber' },
        { title: 'Carrier Name', data: 'carrierName' },
        { title: 'Department', data: 'department' },
        { title: 'Shipment Date', data: 'shipmentDate' },
        { title: 'Total Charge', data: 'totalCharge' },
        { title: 'Expected Charge', data: 'expectedCharge' },
        { title: 'Discrepancy Amount', data: 'discrepancyAmount' },
        { title: 'Financial Impact', data: 'financialImpact' },
        { title: 'Payment Status', data: 'paymentStatus' },
        { title: 'Status', data: 'status' },
        { title: 'Notes', data: 'notes' },
      ],
      order: [[0, 'desc']],
    })

    return () => {
      table.destroy()
    }
  }, [freigthData])

  return (
    <div className="p-4">
      <table id="myTable" className="display w-full text-sm bg-primary text-dark font-bold">
        <thead className="bg-primary text-light"></thead>
      </table>
    </div>
  )
}

export default FreighAudit
