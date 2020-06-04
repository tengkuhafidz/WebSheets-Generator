import React, { useState } from 'react'
import { checkPermalinkAvailability, createPermalinkSheetIdMapping } from '../services/firebase'
import { fetchAndFormatSheetsData, validateSheetsData } from '../services/sheets'
import { isAlphaNumericDash } from '../utils/util'

const Home = () => {
  const [sheetsUrl, setSheetsUrl] = useState()
  const [permalink, setPermalink] = useState()
  const [invalidSheetsErrMsg, setInvalidSheetsErrMsg] = useState(null)
  const [invalidPermalinkErrMsg, setInvalidPermalinkErrMsg] = useState(null)
  const [unavailablePermalinkErrMsg, setUnavailablePermalinkErrMsg] = useState(null)

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
      setInvalidSheetsErrMsg('Please follow step 1 to obtain a valid url.')
    }
    if (!isValidPermalink) {
      setInvalidPermalinkErrMsg('Only alphanumerics, underscores, and hyphens are allowed. ')
    }
    if (!isPermalinkAvailable) {
      setUnavailablePermalinkErrMsg('Permalink has already been taken.')
    }
  }

  const handleSiteGeneration = async () => {
    resetErrorMessages()
    const sheetId = extractSheetIdFromUrl(sheetsUrl)
    const { isValidSheetsData, isValidPermalink, isPermalinkAvailable } = await validateInputs(sheetId)
    if (isValidSheetsData && isValidPermalink && isPermalinkAvailable) {
      createPermalinkSheetIdMapping(permalink, sheetId)
    } else {
      setErrorMessages(isValidSheetsData, isValidPermalink, isPermalinkAvailable)
    }
  }

  return (
    <div className="min-h-screen bg-green-800 text-gray-800">
      <div className="w-full max-w-xl mx-auto py-40">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="text-4xl text-center mb-8">SheetySite</h1>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sheetsUrl">
              Google Sheets Url
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="sheetsUrl"
              type="text"
              placeholder="Sheets Url"
              onChange={(e) => handleSheetsUrlChange(e)}
            />
            <p className="text-red-500 text-xs">{invalidSheetsErrMsg}</p>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="permalink">
              Permalink
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="permalink"
              type="text"
              placeholder="Permalink"
              onChange={(e) => handlePermalinkChange(e)}
              onKeyDown={(e) => preventSpaceInput(e)}
            />
            <p className="text-red-500 text-xs">
              {invalidPermalinkErrMsg}
              {unavailablePermalinkErrMsg}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleSiteGeneration}
            >
              Generate SheetySite
            </button>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              Forgot Password?
            </a>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">&copy;2020 Acme Corp. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Home
