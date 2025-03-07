import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilStar } from '@coreui/icons'
import { AiOutlineAudit } from 'react-icons/ai'

import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHouse,
  faFileInvoice,
  faReceipt,
  faClipboard,
  faChartSimple,
} from '@fortawesome/free-solid-svg-icons'
import BudgetList from './components/Budget/BudgetList'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <FontAwesomeIcon icon={faHouse} className="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Cash Management',
  },
  {
    component: CNavItem,
    name: 'View Collection',
    to: '/viewCollection',
    icon: <FontAwesomeIcon icon={faFileInvoice} className="nav-icon" />,
  },
  // End

  {
    component: CNavTitle,
    name: 'Finance',
  },

  // {
  //   component: CNavItem,
  //   name: 'Billing Invoice',
  //   to: '/generateInvoice',
  //   icon: <FontAwesomeIcon icon={faFileInvoice} className="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Invoice',
  //   to: '/invoices',
  //   icon: <FontAwesomeIcon icon={faReceipt} className="nav-icon" />,
  // },

  {
    component: CNavItem,
    name: 'Financial Analytics',
    to: '/financial-analytics',
    icon: <FontAwesomeIcon icon={faChartSimple} className="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: 'Freight Audit',
    icon: <AiOutlineAudit className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Payroll',
        to: '/audit',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'BUDGET MANAGEMENT',
  },
  {
    component: CNavItem,
    name: 'Budget Requests',
    to: '/budgetList',
    icon: <FontAwesomeIcon icon={faChartSimple} className="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Budget Reports',
  //   to: '/trainingBudgetReport',
  //   icon: <FontAwesomeIcon icon={faChartSimple} className="nav-icon" />,
  // },

  {
    component: CNavTitle,
    name: 'Account Payable',
  },
  {
    component: CNavItem,
    name: 'Review Payable',
    to: '/reviewPayables',
    icon: <FontAwesomeIcon icon={faChartSimple} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Approve/Reject',
    to: '/approveRejectPayables',
    icon: <FontAwesomeIcon icon={faChartSimple} className="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'GENERAL LEDGER',
  },
  {
    component: CNavGroup,
    name: 'Internal Audit',
    icon: <AiOutlineAudit className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Review Payment',
        to: '/reviewPaymentTransactions',
      },
      {
        component: CNavItem,
        name: 'View Audit History',
        to: '/viewAuditHistory',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Financial Reporting',
    icon: <AiOutlineAudit className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Financial Report',
        to: '/financialReport',
      },
      // {
      //   component: CNavItem,
      //   name: 'Transaction Records',
      //   to: '/audit',
      // },
    ],
  },
]

export default _nav
