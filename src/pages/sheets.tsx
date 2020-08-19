import React from 'react'
import { Router } from '@reach/router'
import SheetsRedirect from '../components/SheetsRedirect'

const Sheets = () => {
  return (
    <Router basepath="/sheets">
      <SheetsRedirect path="/:permalink" />
    </Router>
  )
}
export default Sheets
