import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import { CChartBar, CChartLine, CChartDoughnut } from '@coreui/react-chartjs'
import axios from 'axios'
import { apiURL } from '../../context/client_store'
import WidgetsBrand from '../widgets/WidgetsBrand'

const FinancialAnalytics = () => {
  const [salesData, setSalesData] = useState(Array(12).fill(0))
  const [revenueData, setRevenueData] = useState(Array(12).fill(0))
  const [predictedRevenue, setPredictedRevenue] = useState(0)
  const [predictedSales, setPredictedSales] = useState(0)
  const [futurePrediction, setFuturePrediction] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/salesAndRevenue/monthly-sales-revenue`)
        const data = response.data
        console.log(data)

        const sales = Array(12).fill(0)
        const revenue = Array(12).fill(0)

        data.forEach((item) => {
          const monthIndex = new Date(`${item.month} 1, 2024`).getMonth()
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
    fetchFutureData()
  }, [])

  const fetchFutureData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/testGemini/sales-forecast`)
      const { futurePrediction } = response.data

      console.log(futurePrediction)

      const revenueMatch = futurePrediction.match(/Revenue:\s(\d+)/)
      const salesMatch = futurePrediction.match(/Sales:\s(\d+)/)

      const predictedRevenue = revenueMatch ? parseInt(revenueMatch[1]) : 0
      const predictedSales = salesMatch ? parseInt(salesMatch[1]) : 0

      setPredictedSales(predictedSales)
      setPredictedRevenue(predictedRevenue)

      setSalesData((prev) => [...prev, predictedSales])
      setRevenueData((prev) => [...prev, predictedRevenue])
    } catch (error) {
      console.error('Error fetching future prediction:', error)
    }
  }

  return (
    <CRow>
      {/* Widgets */}
      {/* <WidgetsBrand /> */}

      {/* Sales Chart */}
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Monthly Sales</CCardHeader>
          <CCardBody>
            <CChartLine
              data={{
                labels: [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ],
                datasets: [
                  {
                    label: 'Sales',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    pointBorderColor: '#fff',
                    data: salesData,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Monthly Sales Trend',
                  },
                },
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>

      {/* Revenue Chart */}
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Monthly Revenue</CCardHeader>
          <CCardBody>
            <CChartBar
              data={{
                labels: [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ],
                datasets: [
                  {
                    label: 'Revenue',
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    data: revenueData,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Monthly Revenue',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>

      {/* Profit vs Revenue Chart */}
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Profit vs Revenue</CCardHeader>
          <CCardBody>
            <CChartLine
              data={{
                labels: [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ],
                datasets: [
                  {
                    label: 'Sales',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    pointBorderColor: '#fff',
                    data: salesData,
                  },
                  {
                    label: 'Revenue',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                    pointBorderColor: '#fff',
                    data: revenueData,
                  },
                ],
              }}
              options={{
                responsive: true,
                interaction: {
                  mode: 'index',
                  intersect: false,
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Sales vs Revenue Comparison',
                  },
                },
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                  },
                },
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>

      {/* Future Prediction Chart */}
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Next Month Forecast</CCardHeader>
          <CCardBody>
            <div style={{ height: '250px' }}>
              <CChartBar
                data={{
                  labels: ['Forecasted Values'],
                  datasets: [
                    {
                      label: 'Sales',
                      backgroundColor: '#4bc0c0',
                      data: [predictedSales],
                    },
                    {
                      label: 'Revenue',
                      backgroundColor: '#ff6384',
                      data: [predictedRevenue],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `${context.dataset.label}: ${context.raw.toLocaleString()}`
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function (value) {
                          return value.toLocaleString()
                        },
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="mt-3">
              <p className="mb-2">
                <strong>Predicted Sales:</strong> {predictedSales.toLocaleString()}
              </p>
              <p className="mb-0">
                <strong>Predicted Revenue:</strong> {predictedRevenue.toLocaleString()}
              </p>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default FinancialAnalytics
