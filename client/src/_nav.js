import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilStar } from '@coreui/icons'

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
    name: 'Finance',
  },
  {
    component: CNavItem,
    name: 'Billing Invoice',
    to: '/generateInvoice',
    icon: <FontAwesomeIcon icon={faFileInvoice} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Invoice',
    to: '/invoices',
    icon: <FontAwesomeIcon icon={faReceipt} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Freight Audit',
    to: '/audit',
    icon: <FontAwesomeIcon icon={faClipboard} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Budget',
    to: '/budgetList',
    icon: <FontAwesomeIcon icon={faChartSimple} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Training Budget Report',
    to: '/trainingBudgetReport',
    icon: <FontAwesomeIcon icon={faChartSimple} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Financial Analytics',
    to: '/financial-analytics',
    icon: <FontAwesomeIcon icon={faChartSimple} className="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Account Management',
  },
  {
    component: CNavItem,
    name: 'Account Request',
    to: '/account-request',
    icon: <FontAwesomeIcon icon={faChartSimple} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'View All Accounts',
    to: '/viewAllAccounts',
    icon: <FontAwesomeIcon icon={faChartSimple} className="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
      },
    ],
  },
]

export default _nav
