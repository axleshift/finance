import React, { useEffect, useState } from 'react'
import axios from 'axios'

const FinancialReportDetail = () => {
  const [financialData, setFinancialData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/financialReport/getAll`)

        console.log(response.data)
        setFinancialData(response.data)
      } catch (error) {
        console.log(error?.response.data.message)
      }
    }

    fetchData()
  }, [])

  if (!financialData) {
    return <p>Loading financial data...</p>
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-blue-700">Financial Report</h1>
      <p className="text-gray-500">Date: {financialData.date}</p>

      {/* Narrative Report */}
      <div className="mt-4 p-4 border rounded bg-gray-100">
        <h2 className="text-lg font-semibold">Narrative Report</h2>
        <p className="text-gray-700">
          Financial Narrative Report - {financialData.date} <br />
          This report summarizes financial performance for the period ending {financialData.date}.
          Revenue: ₱{financialData.revenue.toLocaleString()} with total expenses of ₱
          {financialData.totalExpenses.toLocaleString()}. Net income stands at ₱
          {financialData.netIncome.toLocaleString()}.
        </p>
      </div>

      {/* Balance Sheet */}
      <h2 className="mt-6 text-xl font-bold text-blue-700">Balance Sheet</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h3 className="font-semibold">Assets</h3>
          <p>Cash: ₱{financialData.cash.toLocaleString()}</p>
          <p>Accounts Receivable: ₱{financialData.accountsReceivable.toLocaleString()}</p>
          <p>Total Assets: ₱{financialData.totalAssets.toLocaleString()}</p>
        </div>
        <div>
          <h3 className="font-semibold">Liabilities</h3>
          <p>Accounts Payable: ₱{financialData.accountsPayable.toLocaleString()}</p>
          <p>Loans Payable: ₱{financialData.loansPayable.toLocaleString()}</p>
          <p>Total Liabilities: ₱{financialData.totalLiabilities.toLocaleString()}</p>
        </div>
        <div>
          <h3 className="font-semibold">Equity</h3>
          <p>Owner’s Equity: ₱{financialData.ownersEquity.toLocaleString()}</p>
        </div>
      </div>

      {/* Income Statement */}
      <h2 className="mt-6 text-xl font-bold text-blue-700">Income Statement</h2>
      <div className="grid grid-cols-4 gap-4">
        <p>Revenue: ₱{financialData.revenue.toLocaleString()}</p>
        <p>COGS: ₱{financialData.totalExpenses.toLocaleString()}</p>
        <p>
          Operating Expenses: ₱
          {(
            financialData.driverSalaries +
            financialData.fuelCosts +
            financialData.insuranceCosts +
            financialData.officeAndAdmin
          ).toLocaleString()}
        </p>
        <p>Net Profit: ₱{financialData.netIncome.toLocaleString()}</p>
      </div>

      {/* Cash Flow */}
      <h2 className="mt-6 text-xl font-bold text-blue-700">Cash Flow</h2>
      <div className="grid grid-cols-3 gap-4">
        <p>Cash Inflows: ₱{financialData.revenue.toLocaleString()}</p>
        <p>
          Operating Cash Outflows: ₱
          {(financialData.totalExpenses + financialData.maintenanceCosts).toLocaleString()}
        </p>
        <p>Ending Balance: ₱{financialData.totalLiabilitiesAndEquity.toLocaleString()}</p>
      </div>

      {/* Export to PDF Button */}
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">Export to PDF</button>
    </div>
  )
}

export default FinancialReportDetail
