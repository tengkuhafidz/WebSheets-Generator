import React from 'react'
import { Router } from '@reach/router'
import SheetySitePage from '../components/sheetysite-page'

const Page = () => {
  return (
    <Router basepath="/p">
      <SheetySitePage path="/:sheetId" />
    </Router>
  )
}
export default Page
