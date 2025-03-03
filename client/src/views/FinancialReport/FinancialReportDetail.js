import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { apiURL } from '../../context/client_store'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
} from '@coreui/react'

const FinancialReportDetail = () => {
  const [financialData, setFinancialData] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/financialReport/get/${id}`)
        setFinancialData(response.data)
      } catch (error) {
        console.log(error?.response.data.message)
      }
    }
    fetchData()
  }, [id])

  if (!financialData) {
    return <p>Loading financial data...</p>
  }

  return (
    <CCard className="p-3 shadow-lg">
      <CCardHeader>
        <h1 className="text-2xl font-bold text-primary">Financial Report</h1>
        <p className="text-muted">Date: {financialData.date}</p>
      </CCardHeader>
      <CCardBody>
        {/* Narrative Report */}
        <CCard className="mb-4 p-3 bg-light">
          <h2 className="text-lg font-semibold">Narrative Report</h2>
          <p>
            Financial Narrative Report - {financialData.date} <br />
            Revenue: ₱{financialData.revenue.toLocaleString()} | Expenses: ₱
            {financialData.totalExpenses.toLocaleString()} | Net Income: ₱
            {financialData.netIncome.toLocaleString()}.
          </p>
        </CCard>

        {/* Balance Sheet */}
        <h2 className="mt-4 text-xl font-bold text-primary">Balance Sheet</h2>
        <CTable striped bordered responsive>
          <CTableBody>
            <CTableRow>
              <CTableHeaderCell>Assets</CTableHeaderCell>
              <CTableDataCell>Cash: ₱{financialData.cash.toLocaleString()}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>Liabilities</CTableHeaderCell>
              <CTableDataCell>
                Accounts Payable: ₱{financialData.accountsPayable.toLocaleString()}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>Equity</CTableHeaderCell>
              <CTableDataCell>
                Owner’s Equity: ₱{financialData.ownersEquity.toLocaleString()}
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>

        {/* Income Statement */}
        <h2 className="mt-4 text-xl font-bold text-primary">Income Statement</h2>
        <CTable striped bordered responsive>
          <CTableBody>
            <CTableRow>
              <CTableHeaderCell>Revenue</CTableHeaderCell>
              <CTableDataCell>₱{financialData.revenue.toLocaleString()}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>Operating Expenses</CTableHeaderCell>
              <CTableDataCell>
                ₱
                {(
                  financialData.driverSalaries +
                  financialData.fuelCosts +
                  financialData.insuranceCosts +
                  financialData.officeAndAdmin
                ).toLocaleString()}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>Net Profit</CTableHeaderCell>
              <CTableDataCell>₱{financialData.netIncome.toLocaleString()}</CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>

        {/* Cash Flow */}
        <h2 className="mt-4 text-xl font-bold text-primary">Cash Flow</h2>
        <CTable striped bordered responsive>
          <CTableBody>
            <CTableRow>
              <CTableHeaderCell>Cash Inflows</CTableHeaderCell>
              <CTableDataCell>₱{financialData.revenue.toLocaleString()}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>Operating Cash Outflows</CTableHeaderCell>
              <CTableDataCell>
                ₱{(financialData.totalExpenses + financialData.maintenanceCosts).toLocaleString()}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>Ending Balance</CTableHeaderCell>
              <CTableDataCell>
                ₱{financialData.totalLiabilitiesAndEquity.toLocaleString()}
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCardBody>
      <div className="text-center mt-4">
        <CButton color="primary">Export to PDF</CButton>
      </div>
    </CCard>
  )
}

export default FinancialReportDetail
