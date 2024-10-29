import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    CTable,
    CTableBody,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
} from '@coreui/react'

const UsersList = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/users')
            setUsers(response.data)
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }

    return (
        <div>
            <h1>User List</h1>
            <CTable striped hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Created At</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {users.map((user) => (
                        <CTableRow key={user.id}>
                            <CTableDataCell>{user.id}</CTableDataCell>
                            <CTableDataCell>{user.name}</CTableDataCell>
                            <CTableDataCell>{user.email}</CTableDataCell>
                            <CTableDataCell>
                                {new Date(user.created_at).toLocaleDateString()}
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
        </div>
    )
}

export default UsersList