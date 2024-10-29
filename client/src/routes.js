import React, { lazy } from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const GenInvoice = lazy(() => import('./views/generate-invoice/generate-invoice.js'))
const Invoice = lazy(() => import('./views/invoice/invoice.js'))
const Audit = lazy(() => import('./views/audit/audit.js'))
const FinancialAnalytics = React.lazy(() => import('./views/financial-analytics/finacial-analytics.js'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/generate-invoice', name: 'Generate Invoice', element: GenInvoice },
  { path: '/invoice', name: 'Invoice', element: Invoice },
  { path: '/audit', name: 'Freight Audit', element: Audit },
  { path: '/financial-analytics', name: 'Financial Analytics', element: FinancialAnalytics },

 
 
]

export default routes
