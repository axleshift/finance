import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const TestForm = () => {
  const apiURL = 'http://127.0.0.1:8000'
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'name') setName(value)
    else if (name === 'description') setDescription(value)
    else if (name === 'status') setStatus(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log(name)
    console.log(description)
    console.log(status)
    try {
      const response = await axios.post(`${apiURL}/api/invoices`, {
        name,
        description,
        status,
      })
      console.log('Response:', response.data)
      // Reset form fields after submission if needed
      toast.success('Created Successfully')
      setName('')
      setDescription('')
      setStatus('')
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <div>
      <h1>Form Title</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            className="input"
            placeholder="Enter Name"
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            value={description}
            onChange={handleChange}
            className="input"
            placeholder="Enter Description"
          />
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <input
            type="text"
            name="status"
            value={status}
            onChange={handleChange}
            className="input"
            placeholder="Enter Status"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Test Submit
        </button>
      </form>
    </div>
  )
}

export default TestForm
