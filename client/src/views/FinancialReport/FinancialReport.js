import React, { useEffect, useState } from 'react'
import DataTable from 'datatables.net'
import axios from 'axios'
import { apiURL } from '../../context/client_store'
const FinancialReport = () => {
  const [data, setData] = useState([])

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/financialReport/getAll`)

      console.log(response.data)
      setData(response.data)
    } catch (error) {}
  }

  useEffect(() => {
    fetchData()
  }, [])
  useEffect(() => {
    const table = new DataTable('#myTable', {
      data: data,
      columns: [
        {
          title: ' # Id',
          data: '_id',
          render: (data) => `${data ? data : 'N/A'}`,
        },
        {
          title: 'Date',
          data: 'createdAt',
          render: (data) => `${data ? new Date(data).toLocaleDateString() : 'N/A'}`,
        },
        {
          title: 'Net Income',
          data: 'netIncome',
          render: (data) => `${data ? `₱${data}` : 'N/A'}`,
        },
        {
          title: 'Total Liabilities And Equity',
          data: 'totalLiabilitiesAndEquity',
          render: (data) => `${data ? `₱${data}` : 'N/A'}`,
        },
        {
          title: 'Action',
          data: null,
          render: (data) => {
            return `
<div>
                  <button class="bg-teal-500 text-xs btn btn-info text-white px-2 py-1 rounded-lg mx-1 viewBtn" id="viewBtn_${data._id}">
                    View
                  </button>

                </div>`
          },
        },
      ],
      order: [[0], 'desc'],
    })

    return () => {
      table.destroy()
    }
  }, [data])

  return (
    <div>
      <table id="myTable"></table>
    </div>
  )
}

export default FinancialReport
