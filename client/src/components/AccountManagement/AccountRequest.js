import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { apiURL } from '../../context/client_store'
const AccountRequest = () => {
  // const [accountData, setAccountData] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedData, setSelectedData] = useState(null)
  const [visibleView, setVisibleView] = useState(false)

  useEffect(() => {
    // fetchAccountData()
  })
  const fetchAccountData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/user`)
      setAccountData(response.data)
    } catch (error) {}
  }

  const accountData = [
    {
      fullName: 'Adrey Japheth P. Locaylocay',
      email: 'helloworld32130@gmail.com',
    },
    {
      fullName: 'Adrey Japheth P. Locaylocay',
      email: 'helloworld32130@gmail.com',
    },
    {
      fullName: 'Adrey Japheth P. Locaylocay',
      email: 'helloworld32130@gmail.com',
    },
    {
      fullName: 'Adrey Japheth P. Locaylocay',
      email: 'helloworld32130@gmail.com',
    },
    {
      fullName: 'Adrey Japheth P. Locaylocay',
      email: 'helloworld32130@gmail.com',
    },
  ]

  useEffect(() => {
    const table = new DataTable('#myTable', {
      data: accountData,
      columns: [
        {
          title: 'Full Name',
          data: 'fullName',
        },
        {
          title: 'Email',
          data: 'email',
        },
        {
          title: 'Action',
          data: null,
          render: (data) => {
            return `<div>
                <button class="btn btn-primary text-xs px-2 py-1 mx-1 viewBtn" id="viewBtn_${data._id}">
                  View
                </button>
                <button class="btn btn-danger text-xs px-2 py-1 mx-1 deleteBtn" id="deleteBtn_${data._id}">
                  Delete
                </button>
              </div>`
          },
        },
      ],
      order: [[0, 'desc']],
      rowCallBack: (row, data) => {
        const viewBtn = row.querySelector(`#viewBtn_${data._id}`)

        viewBtn?.addEventListener('click', () => handleView(data._id))
      },
    })

    return () => {
      table.destroy()
    }
  }, [accountData])

  const handleView = (id) => {
    const selected = accountData.find((item) => item._id === id)

    setSelectedData(selected)
    setVisibleView(true)
  }

  return (
    <div>
      <h1>Account Lists</h1>

      <table id="myTable1" className="display"></table>
    </div>
  )
}

export default AccountRequest
