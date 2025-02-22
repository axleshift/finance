import DataTable from 'datatables.net-dt'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { apiURL } from '../../context/client_store'

const ReviewPayable = () => {
  const [budgetData, setBudgetData] = useState([])

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/budgetRequest`)
        setBudgetData(response.data) // Store fetched data in state
      } catch (error) {
        console.error('Error fetching budget data:', error)
      }
    }
    fetchBudgetData()
  }, [])

  useEffect(() => {
    if (!budgetData.length) return // Ensure data exists before initializing DataTable

    const table = new DataTable('#myTable', {
      data: budgetData,
      columns: [
        {
          title: 'Request ID',
          data: 'requestId',
        },
        {
          title: 'Department',
          data: 'department',
        },
        {
          title: 'Type of Request',
          data: 'typeOfRequest',
        },
        {
          title: 'Category',
          data: 'category',
        },
        {
          title: 'Reason',
          data: 'reason',
        },
        {
          title: 'Total Request',
          data: 'totalRequest',
        },
        {
          title: 'Documents',
          data: 'documents',
        },
        {
          title: 'Status',
          data: null,
          render: (data) => {
            return `<button class="btn ${
              data?.status === 'Approved' ? 'btn-success text-white' : 'btn-secondary'
            }">
              ${data?.status === 'Approved' ? data.status : 'Pending'}
            </button>`
          },
        },
        {
          title: 'Comment',
          data: 'comment',
        },
        {
          title: 'Action',
          data: null,
          render: (data) => {
            return `
              <div>
                <button class="btn btn-primary text-xs px-2 py-1 mx-1 viewBtn" data-id="${data._id}">
                  View
                </button>
                <button class="btn btn-danger text-light text-xs px-2 py-1 mx-1 deleteBtn" data-id="${data._id}">
                  Delete
                </button>
              </div>`
          },
        },
      ],
      order: [[0, 'desc']],
    })

    return () => {
      table.destroy()
    }
  }, [budgetData])

  const handleView = (id) => {
    console.log('View:', id)
    // Implement view logic here
  }

  const handleDelete = (id) => {
    console.log('Delete:', id)
    // Implement delete logic here
  }

  return (
    <div>
      <table id="myTable" className="display">
        {' '}
      </table>
    </div>
  )
}

export default ReviewPayable
