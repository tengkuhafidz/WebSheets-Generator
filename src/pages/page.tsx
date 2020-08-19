import React from 'react'
import { Router } from '@reach/router'
import ListingPage from '../components/ListingPage'

const Page = () => {
  return (
    <Router basepath="/page">
      <ListingPage path="/:permalink" />
    </Router>
  )
}
export default Page
