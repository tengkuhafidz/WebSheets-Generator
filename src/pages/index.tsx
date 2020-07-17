import React, { useState } from 'react'
import CreateListingPageForm from '../components/Home/create-listing-page-form'
import RequestEmailForm from '../components/Home/request-email-form'
import SuccessCard from '../components/Home/success-card'
import { checkPermalinkAvailability, createPermalinkSheetIdMapping } from '../services/firebase'
import { getSheetsData } from '../services/sheets'
import { gtagEventClick } from '../utils/gtag'
import { captureInfluenceSiteGeneration } from '../services/useinfluence'

const Home = () => {
  const [sheetsUrl, setSheetsUrl] = useState(null)
  const [sheetId, setSheetId] = useState(null)
  const [permalink, setPermalink] = useState('<Permalink>')
  const [email, setEmail] = useState(null)
  const [invalidSheetsErrMsg, setInvalidSheetsErrMsg] = useState(null)
  const [invalidPermalinkErrMsg, setInvalidPermalinkErrMsg] = useState(null)
  const [invalidEmailErrMsg, setInvalidEmailErrMsg] = useState(null)
  const [unavailablePermalinkErrMsg, setUnavailablePermalinkErrMsg] = useState(null)
  const [hasPassedValidation, setHasPassedValidation] = useState(false)
  const [hasGeneratedSite, setHasGeneratedSite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * CREATE LISTING PAGE FORM FUNCTIONS
   */

  const handleSheetsUrlChange = (e) => {
    setSheetsUrl(e.target.value)
  }

  const forceLowerCaseInput = (e) => {
    e.target.value = e.target.value.toLowerCase()
  }

  const handlePermalinkChange = (e) => {
    forceLowerCaseInput(e)
    setPermalink(e.target.value)
  }

  const setErrorMessages = (isValidSheetsData, isValidPermalink, isPermalinkAvailable) => {
    if (!isValidSheetsData) {
      setInvalidSheetsErrMsg('Please follow step 1 & 2 to obtain a valid url.')
    }
    if (!isValidPermalink) {
      setInvalidPermalinkErrMsg('Only alphanumerics, underscores, and hyphens are allowed. ')
    }
    if (!isPermalinkAvailable) {
      setUnavailablePermalinkErrMsg('Permalink has already been taken.')
    }
  }

  // allows for alphabets, numbers, underscore, dash
  const isAlphaNumericDash = (str): boolean => {
    const regexp = /^[a-z0-9_\-]+$/i
    return regexp.test(str)
  }

  const validateInputs = async (sheetId) => {
    let isValidSheetsData = false
    if (!!sheetId) {
      const sheetsData = await getSheetsData(sheetId)
      isValidSheetsData = !!sheetsData
    }
    const isValidPermalink = isAlphaNumericDash(permalink)
    const isPermalinkAvailable = await checkPermalinkAvailability(permalink)

    return {
      isValidSheetsData,
      isValidPermalink,
      isPermalinkAvailable,
    }
  }

  const sheetySiteUrl = `https://sheety.site/p/${permalink}`

  const extractSheetIdFromUrl = (sheetsUrl: string): string => {
    if (!!sheetsUrl) {
      const pathsAsArray = sheetsUrl.replace(/^https?:\/\//, '').split('/')
      const sheetId = pathsAsArray[3]
      return sheetId
    }
    return null
  }

  const resetErrorMessages = () => {
    setInvalidSheetsErrMsg(null)
    setInvalidPermalinkErrMsg(null)
    setUnavailablePermalinkErrMsg(null)
  }

  const handleSubmitListingForm = async () => {
    setIsLoading(true)
    resetErrorMessages()
    const extractedSheetId = extractSheetIdFromUrl(sheetsUrl)
    const { isValidSheetsData, isValidPermalink, isPermalinkAvailable } = await validateInputs(extractedSheetId)
    if (isValidSheetsData && isValidPermalink && isPermalinkAvailable) {
      setHasPassedValidation(true)
      setSheetId(extractedSheetId)
    } else {
      setErrorMessages(isValidSheetsData, isValidPermalink, isPermalinkAvailable)
    }
    gtagEventClick(
      'submit_listing_form',
      `Permalink: ${permalink}. Successful? ${isValidSheetsData && isValidPermalink && isPermalinkAvailable}`,
    )
    setIsLoading(false)
  }

  /**
   * REQUEST EMAIL FORM PAGE
   */

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const validateEmail = () => {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  const executeUponSuccessfulSiteGeneration = () => {
    setHasGeneratedSite(true)
    captureInfluenceSiteGeneration(email, permalink)
  }

  const handleSiteGeneration = async () => {
    setIsLoading(true)
    const isValidEmail = validateEmail()
    if (isValidEmail) {
      const isSuccessful = await createPermalinkSheetIdMapping(permalink, sheetId, email)
      isSuccessful
        ? executeUponSuccessfulSiteGeneration()
        : setInvalidEmailErrMsg('There was an unexpected error. Please try again')
    } else {
      setInvalidEmailErrMsg('Please input a valid email')
    }
    gtagEventClick('provide_email_form', `Email: ${email}. Successful? ${isValidEmail}`)
    setIsLoading(false)
  }

  /**
   * DETERMINE COMPONENT CONTENT TO SHOW BASED ON STATE
   */

  const renderContent = () => {
    if (hasGeneratedSite) {
      return <SuccessCard sheetySiteUrl={sheetySiteUrl} />
    } else if (hasPassedValidation) {
      return (
        <RequestEmailForm
          handleEmailChange={handleEmailChange}
          handleSiteGeneration={handleSiteGeneration}
          invalidEmailErrMsg={invalidEmailErrMsg}
          isLoading={isLoading}
        />
      )
    } else {
      return (
        <CreateListingPageForm
          handleSheetsUrlChange={handleSheetsUrlChange}
          handlePermalinkChange={handlePermalinkChange}
          handleSubmitListingForm={handleSubmitListingForm}
          invalidSheetsErrMsg={invalidSheetsErrMsg}
          invalidPermalinkErrMsg={invalidPermalinkErrMsg}
          unavailablePermalinkErrMsg={unavailablePermalinkErrMsg}
          sheetySiteUrl={sheetySiteUrl}
          isLoading={isLoading}
        />
      )
    }
  }

  return (
    <div className="min-h-screen bg-brand text-gray-800 py-4 md:py-24">
      <div className="w-full max-w-3xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">{renderContent()}</div>
      <p className="text-center text-gray-200">&copy;2020 WebSheets. All rights reserved.</p>
    </div>
  )
}

export default Home
