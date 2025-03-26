import React, { lazy } from 'react'
import EditInvoice from './views/invoice/EditInvoice.js'
import BudgetList from './components/Budget/BudgetList.js'
import AccountRequest from './components/AccountManagement/AccountRequest.js'
import ViewAllAccounts from './components/AccountManagement/ViewAllAccounts.js'
import ViewCollection from './views/CashManagement/ViewCollection.js'
import Profile from './components/Profile/Profile.js'
import TrainingBudgetReport from './components/Budget/TrainingBudgetReport.js'
import ReviewPayable from './components/AccountPayable/ReviewPayable.js'
import ApproveRejectPayable from './components/AccountPayable/ApproveRejectPayable.js'
import ReviewPayment from './views/InternalAudit/ReviewPayment.js'
import Invoice_details from './views/invoice/invoice_detailsTest.js'
import ViewAuditHistory from './views/InternalAudit/ViewAuditHistory.js'
import FinancialReport from './views/FinancialReport/FinancialReport.js'
import FinancialReportDetail from './views/FinancialReport/FinancialReportDetail.js'
import FreightAudit from './views/audit/audit.js'
import FreighAudit from './components/FreightAudit/FreighAudit.js'
import AccountReceivables from './views/accountReceivable/accountReceivable.js'
import ChartOfAccountsList from './components/ChartOfAccount/ChartOfAccount.js'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const GenInvoice = lazy(() => import('./views/generate-invoice/generate-invoice.js'))

const Invoices = lazy(() => import('./views/invoice/Invoices.js'))
const Audit = lazy(() => import('./views/audit/audit.js'))
const FinancialAnalytics = React.lazy(
  () => import('./views/financial-analytics/finacial-analytics.js'),
)

const Generate_invoice = lazy(() => import('./views/generate-invoice/Generate_invoice.js'))
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/login', exact: true, name: 'Login' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/generate-invoice', name: 'Billings', element: GenInvoice },
  { path: '/generateInvoice', name: 'Generate_invoice', element: Generate_invoice },
  { path: '/invoice-details', name: 'Invoice', element: Invoice_details },
  { path: '/invoices', name: 'Invoices', element: Invoices },
  { path: '/audit', name: 'Freight Audit', element: Audit },
  { path: '/financial-analytics', name: 'Financial Analytics', element: FinancialAnalytics },
  { path: '/edit_invoice/:id', name: 'Edit Invoice', element: EditInvoice },
  { path: '/budgetList', name: 'Budget List', element: BudgetList },
  { path: '/account-request', name: 'Account Request', element: AccountRequest },
  { path: '/viewAllAccounts', name: 'View All Account', element: ViewAllAccounts },

  { path: '/viewCollection', name: 'ViewCollection', element: ViewCollection },
  { path: '/profile', name: 'Profile', element: Profile },
  { path: '/trainingBudgetReport', name: 'Training Budget Report', element: TrainingBudgetReport },
  { path: '/reviewPayables', name: 'Payables', element: ReviewPayable },
  { path: '/approveRejectPayables', name: 'Approve/Rejected', element: ApproveRejectPayable },
  { path: '/reviewPaymentTransactions', name: 'ReviewPayment', element: ReviewPayment },
  { path: '/viewAuditHistory', name: 'viewAuditHistory', element: ViewAuditHistory },
  { path: '/financialReport', name: 'financialReport', element: FinancialReport },
  { path: '/accountReceivable', name: 'accountReceivable', element: AccountReceivables },
  { path: '/chartOfAccount', name: 'chartOfAccount', element: ChartOfAccountsList },
  {
    path: '/financialReportDetail/:id',
    name: 'financialReportDetail',
    element: FinancialReportDetail,
  },
  {
    path: '/freightAudit',
    name: 'freightAudit',
    element: FreighAudit,
  },
]

export default routes
