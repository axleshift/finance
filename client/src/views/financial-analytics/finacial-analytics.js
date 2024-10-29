import React from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartScatter,
  CChartRadar,
} from '@coreui/react-chartjs'
import { DocsCallout } from 'src/components'

const FinancialAnalytics = () => {
  const random = () => Math.round(Math.random() * 100)

  return (
    <CRow>
        <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Revenue</CCardHeader>
          <CCardBody>
            <CChartBar
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'GitHub Commits',
                    backgroundColor: '#f87979',
                    data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                  },
                ],
              }}
              labels="months"
            />
          </CCardBody>
        </CCard>
      </CCol>
       <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Revenue and Expenses</CCardHeader>
          <CCardBody>
            <CChartLine
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'Revenue',
                    backgroundColor: 'rgba(220, 220, 220, 0.2)',
                    borderColor: 'rgba(220, 220, 220, 1)',
                    pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                    pointBorderColor: '#fff',
                    data: [random(), random(), random(), random(), random(), random(), random()],
                  },
                  {
                    label: 'Expenses',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgba(151, 187, 205, 1)',
                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                    pointBorderColor: '#fff',
                    data: [random(), random(), random(), random(), random(), random(), random()],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Product Prices vs Expenses</CCardHeader>
          <CCardBody>
            <CChartScatter
              data={{
                datasets: [{
                    label: 'Scatter Dataset',
                    data: [{
                      x: -10,
                      y: 0
                    }, {
                      x: 0,
                      y: 10
                    }, {
                      x: 10,
                      y: 5
                    }, {
                      x: 0.5,
                      y: 5.5
                    }],
                }],
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
                    data: [random(), random(), random(), random(), random(), random(), random()],
                  },
                  {
                    label: 'Revenue',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgba(151, 187, 205, 1)',
                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                    pointBorderColor: '#fff',
                    data: [random(), random(), random(), random(), random(), random(), random()],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Operational and Non-operational Expenses</CCardHeader>
          <CCardBody>
            <CChartDoughnut
              data={{
                labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
                datasets: [
                  {
                    backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                    data: [40, 20, 80, 10],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Expenses Breakdown</CCardHeader>
          <CCardBody>
            <CChartPie
              data={{
                labels: ['Red', 'Green', 'Yellow'],
                datasets: [
                  {
                    data: [300, 50, 100],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      
        
     
        
      </CCol>
    </CRow>
  )
}

export default FinancialAnalytics
