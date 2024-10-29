import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'

const FreightAudit = () => {
  const [financialData] = useState({
    incomeStatement: {
      totalRevenue: 0,
      cogs: 0,
      operatingExpenses: 0,
      netIncome: 0,
    },
    balanceSheet: {
      totalAssets: 0,
      totalLiabilities: 0,
      equity: 0,
    },
    cashFlow: {
      cashFromOperations: 0,
      cashUsedForInvestments: 0,
      cashFromFinancing: 0,
    },
    financialRatios: {
      currentRatio: 0,
      netProfitMargin: 0,
      returnOnEquity: 0,
    },
  })

  return (
    <div style={{ padding: '20px' }}>
      <h1>Freight Audit</h1>

      {/* Income Statement */}
      <CCard>
        <CCardBody>
          <CCardTitle>Training Cost Reports</CCardTitle>
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Metric</CTableHeaderCell>
                <CTableHeaderCell>Amount ($)</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>Total Revenue</CTableDataCell>
                <CTableDataCell>{financialData.incomeStatement.totalRevenue}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>COGS</CTableDataCell>
                <CTableDataCell>{financialData.incomeStatement.cogs}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Operating Expenses</CTableDataCell>
                <CTableDataCell>{financialData.incomeStatement.operatingExpenses}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Net Income</CTableDataCell>
                <CTableDataCell>{financialData.incomeStatement.netIncome}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Balance Sheet */}
      <CCard style={{ marginTop: '20px' }}>
        <CCardBody>
          <CCardTitle>Payroll Cost Reports</CCardTitle>
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Metric</CTableHeaderCell>
                <CTableHeaderCell>Amount ($)</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>Total Assets</CTableDataCell>
                <CTableDataCell>{financialData.balanceSheet.totalAssets}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Total Liabilities</CTableDataCell>
                <CTableDataCell>{financialData.balanceSheet.totalLiabilities}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Equity</CTableDataCell>
                <CTableDataCell>{financialData.balanceSheet.equity}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Cash Flow Statement */}
      <CCard style={{ marginTop: '20px' }}>
        <CCardBody>
          <CCardTitle>Cash Flow Statement</CCardTitle>
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Metric</CTableHeaderCell>
                <CTableHeaderCell>Amount ($)</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>Cash from Operations</CTableDataCell>
                <CTableDataCell>{financialData.cashFlow.cashFromOperations}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Cash Used for Investments</CTableDataCell>
                <CTableDataCell>{financialData.cashFlow.cashUsedForInvestments}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Cash from Financing</CTableDataCell>
                <CTableDataCell>{financialData.cashFlow.cashFromFinancing}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Financial Ratios */}
      <CCard style={{ marginTop: '20px' }}>
        <CCardBody>
          <CCardTitle>Financial Ratios</CCardTitle>
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Metric</CTableHeaderCell>
                <CTableHeaderCell>Value</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>Current Ratio</CTableDataCell>
                <CTableDataCell>{financialData.financialRatios.currentRatio}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Net Profit Margin</CTableDataCell>
                <CTableDataCell>
                  {(financialData.financialRatios.netProfitMargin * 100).toFixed(2)}%
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell>Return on Equity (ROE)</CTableDataCell>
                <CTableDataCell>
                  {(financialData.financialRatios.returnOnEquity * 100).toFixed(2)}%
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CButton color="primary" style={{ marginTop: '20px' }}>
        Generate Report
      </CButton>
    </div>
  )
}

export default FreightAudit
