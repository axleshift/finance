import { create } from 'zustand'
import axios from 'axios'

export const apiURL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5054'
    : 'https://backend-finance.axleshift.com'
const client_store = create((set) => ({
  token: localStorage.getItem('token') || null,
  fetchUserData: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ error: 'Token not found in localStorage', loading: false })
      return
    }

    try {
      set({ loading: true })
      const response = await axios.get(`${apiURL}/api/user`, {
        headers: {
          token: token,
        },
      })
      set({ userData: response.data, loading: false, error: null })
    } catch (err) {
      set({ error: 'Failed to fetch user data', loading: false })
    }
  },
}))

export default client_store
