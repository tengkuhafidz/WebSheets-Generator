import React, { useState } from 'react'
import { checkPermalinkAvailability, createPermalinkSheetIdMapping } from '../services/firebase'
import { fetchAndFormatSheetsData, validateSheetsData } from '../services/sheets'
import { isAlphaNumericDash } from '../utils/util'
import SuccessCard from '../components/Home/success-card'
import RequestEmailForm from '../components/Home/request-email-form'
import CreateListingPageForm from '../components/Home/create-listing-page-form'

const Home = () => {
  const [sheetsUrl, setSheetsUrl] = useState()
  const [sheetId, setSheetId] = useState()
  const [permalink, setPermalink] = useState('<Permalink>')
  const [email, setEmail] = useState('<Permalink>')
  const [invalidSheetsErrMsg, setInvalidSheetsErrMsg] = useState(null)
  const [invalidPermalinkErrMsg, setInvalidPermalinkErrMsg] = useState(null)
  const [invalidEmailErrMsg, setInvalidEmailErrMsg] = useState(null)
  const [unavailablePermalinkErrMsg, setUnavailablePermalinkErrMsg] = useState(null)
  const [hasPassedValidation, setHasPassedValidation] = useState(false)
  const [hasGeneratedSite, setHasGeneratedSite] = useState(false)

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

  const validateEmail = () => {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const preventSpaceInput = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault()
    }
  }

  const extractSheetIdFromUrl = (sheetsUrl) => {
    const pathsAsArray = sheetsUrl.replace(/^https?:\/\//, '').split('/')
    const sheetId = pathsAsArray[3]
    return sheetId
  }

  const validateInputs = async (sheetId) => {
    const sheetsData = await fetchAndFormatSheetsData(sheetId)
    const isValidSheetsData = !!sheetsData && validateSheetsData(sheetsData)
    const isValidPermalink = isAlphaNumericDash(permalink)
    const isPermalinkAvailable = await checkPermalinkAvailability(permalink)

    return {
      isValidSheetsData,
      isValidPermalink,
      isPermalinkAvailable,
    }
  }

  const resetErrorMessages = () => {
    setInvalidSheetsErrMsg(null)
    setInvalidPermalinkErrMsg(null)
    setUnavailablePermalinkErrMsg(null)
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

  const getSheetySiteUrl = (permalink) => {
    return `https://sheety.site/p/${permalink}`
  }

  const handleSubmitListingForm = async () => {
    console.log('handleSubmitListingForm')
    resetErrorMessages()
    setSheetId(extractSheetIdFromUrl(sheetsUrl))
    const { isValidSheetsData, isValidPermalink, isPermalinkAvailable } = await validateInputs(sheetId)
    if (isValidSheetsData && isValidPermalink && isPermalinkAvailable) {
      console.log('setHasPassedValidation')

      setHasPassedValidation(true)
    } else {
      setErrorMessages(isValidSheetsData, isValidPermalink, isPermalinkAvailable)
    }
  }

  const handleSiteGeneration = async () => {
    const isValidEmail = validateEmail()
    if (isValidEmail) {
      await createPermalinkSheetIdMapping(permalink, sheetId, email)
      setHasGeneratedSite(true)
    } else {
      setInvalidEmailErrMsg('Please input a valid email')
    }
  }

  if (hasGeneratedSite) {
    return (
      <div className="min-h-screen bg-green-600 text-gray-800 py-4 md:py-24">
        <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-center">
          <SuccessCard sheetySiteUrl={getSheetySiteUrl(permalink)} />
        </div>
      </div>
    )
  }

  if (hasPassedValidation) {
    return (
      <div className="min-h-screen bg-green-600 text-gray-800 py-4 md:py-24">
        <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-center">
          <RequestEmailForm
            handleEmailChange={handleEmailChange}
            handleSiteGeneration={handleSiteGeneration}
            invalidEmailErrMsg={invalidEmailErrMsg}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-600 text-gray-800 py-4 md:py-24">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <CreateListingPageForm
          handleSheetsUrlChange={handleSheetsUrlChange}
          handlePermalinkChange={handlePermalinkChange}
          handleSubmitListingForm={handleSubmitListingForm}
          invalidSheetsErrMsg={invalidSheetsErrMsg}
          invalidPermalinkErrMsg={invalidPermalinkErrMsg}
          unavailablePermalinkErrMsg={unavailablePermalinkErrMsg}
          sheetySiteUrl={getSheetySiteUrl(permalink)}
        />
      </div>
      <p className="text-center text-gray-200 text-xs">&copy;2020 SheetySite. All rights reserved.</p>
    </div>
  )
}

export default Home
