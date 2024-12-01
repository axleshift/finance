import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import {
  CChartBar,
  CChartLine,
  CChartScatter,
  CChartDoughnut,
  CChartPie,
} from '@coreui/react-chartjs'
import axios from 'axios'
import { apiURL } from '../../context/client_store'
import WidgetsBrand from '../widgets/WidgetsBrand'
const FinancialAnalytics = () => {
  const [salesData, setSalesData] = useState(Array(12).fill(0)) // Sales for 12 months
  const [revenueData, setRevenueData] = useState(Array(12).fill(0)) // Revenue for 12 months

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/salesAndRevenue/monthly-sales-revenue`)
        const data = response.data
        console.log(data)
        // Prepare data for charts
        const sales = Array(12).fill(0)
        const revenue = Array(12).fill(0)

        data.forEach((item) => {
          const monthIndex = new Date(`${item.month} 1, 2024`).getMonth() // Map month (1-12) to array index (0-11)
          sales[monthIndex] = item.totalSales
          revenue[monthIndex] = item.totalRevenue
        })

        setSalesData(sales)
        setRevenueData(revenue)
      } catch (error) {
        console.error('Error fetching financial data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <CRow>
      {/* Sales Chart */}
      <WidgetsBrand />
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Sales</CCardHeader>
          <CCardBody>
            <CChartLine
              data={{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                ],
                datasets: [
                  {
                    label: 'Sales',
                    backgroundColor: 'rgba(220, 220, 220, 0.2)',
                    borderColor: 'rgba(220, 220, 220, 1)',
                    pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                    pointBorderColor: '#fff',
                    data: salesData, // Bind sales data
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      {/* Revenue Chart */}
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Revenue</CCardHeader>
          <CCardBody>
            <CChartBar
              data={{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                ],
                datasets: [
                  {
                    label: 'Revenue',
                    backgroundColor: '#f87979',
                    data: revenueData, // Bind revenue data
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      {/* Other charts */}
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Product Prices vs Expenses</CCardHeader>
          <CCardBody>
            <CChartScatter
              data={{
                datasets: [
                  {
                    label: 'Scatter Dataset',
                    data: [
                      { x: -10, y: 0 },
                      { x: 0, y: 10 },
                      { x: 10, y: 5 },
                      { x: 0.5, y: 5.5 },
                    ],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Profit and Revenue</CCardHeader>
          <CCardBody>
            <CChartLine
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'Profit',
                    backgroundColor: 'rgba(220, 220, 220, 0.2)',
                    borderColor: 'rgba(220, 220, 220, 1)',
                    pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                    pointBorderColor: '#fff',
                    data: salesData, // Using salesData as an example here
                  },
                  {
                    label: 'Revenue',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgba(151, 187, 205, 1)',
                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                    pointBorderColor: '#fff',
                    data: revenueData, // Using revenueData here
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      {/* Additional charts can be added as necessary */}
    </CRow>
  )
}

export default FinancialAnalytics
