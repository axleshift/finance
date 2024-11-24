import React from 'react'
import PropTypes from 'prop-types'
import { CWidgetStatsE, CRow, CCol } from '@coreui/react'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'

const WidgetsBrand = (props) => {
  const titleStyle = {
    fontSize: '1.2rem', // Custom font size for title
    fontWeight: 'bold', // Optional: make title bold
  }

  const valueStyle = {
    fontSize: '1.5rem', // Custom font size for value
    fontWeight: '600', // Slightly bold for emphasis
    color: '#6261CC', // Optional: set a custom color for the value
  }

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol xs={6}>
        <CWidgetStatsE
          className="mb-3"
          chart={
            <CChartBar
              className="mx-auto"
              style={{ height: '40px', width: '80px' }}
              data={{
                labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M'],
                datasets: [
                  {
                    backgroundColor: '#321fdb',
                    borderColor: 'transparent',
                    borderWidth: 1,
                    data: [41, 78, 51, 66, 74, 42, 89, 97, 87, 84, 78, 88, 67, 45, 47],
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
              }}
            />
          }
          title={<span style={titleStyle}>SALES</span>} // Apply custom title style
          value={<span style={valueStyle}>₱3,250.00</span>} // Apply custom value style
        />
      </CCol>
      <CCol xs={6}>
        <CWidgetStatsE
          className="mb-3"
          chart={
            <CChartLine
              className="mx-auto"
              style={{ height: '40px', width: '80px' }}
              data={{
                labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M'],
                datasets: [
                  {
                    backgroundColor: 'transparent',
                    borderColor: '#321fdb',
                    borderWidth: 2,
                    data: [41, 78, 51, 66, 74, 42, 89, 97, 87, 84, 78, 88, 67, 45, 47],
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                elements: {
                  line: {
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
              }}
            />
          }
          title={<span style={titleStyle}>TOTAL SPENT</span>} // Apply custom title style
          value={<span style={valueStyle}>₱3,000.00</span>} // Apply custom value style
        />
      </CCol>
    </CRow>
  )
}

WidgetsBrand.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsBrand
