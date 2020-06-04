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

  const handleSiteGeneration = async () => {
    resetErrorMessages()
    const sheetId = extractSheetIdFromUrl(sheetsUrl)
    const { isValidSheetsData, isValidPermalink, isPermalinkAvailable } = await validateInputs(sheetId)
    if (isValidSheetsData && isValidPermalink && isPermalinkAvailable) {
      await createPermalinkSheetIdMapping(permalink, sheetId)
      setHasGeneratedSite(true)
    } else {
      setErrorMessages(isValidSheetsData, isValidPermalink, isPermalinkAvailable)
    }
  }

  if (hasGeneratedSite) {
    return (
      <div className="min-h-screen bg-green-600 text-gray-800 py-4 md:py-24">
        <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-center">
          <span className="text-6xl">🎉</span>
          <h1 className="font-bold text-xl mb-4">Your SheetySite has been generated!</h1>
          <p>
            You may check it out at:&nbsp;
            <a href={getSheetySiteUrl(permalink)} target="_blank" rel="noreferrer" className="text-blue-600">
              {getSheetySiteUrl(permalink)}
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-600 text-gray-800 py-4 md:py-24">
      <form className="w-full max-w-2xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-4xl text-center mb-8">SheetySite</h1>
        <div className="mb-4">
          <p className="block text-gray-700 text-sm font-bold mb-2">
            1. Make a copy of SheetySite template to you Google Drive by clicking &nbsp;
            <a
              href="https://docs.google.com/spreadsheets/d/1S-S1dzVsPlbYtYTq_jiXCcVYKf75wFlGxB2fKkdVc7w/copy#gid=1818216905"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600"
            >
              here
            </a>
          </p>
        </div>
        <div className="mb-4">
          <p className="block text-gray-700 text-sm font-bold mb-2">
            2. Click the `Share` button and change the view access setting to `anyone with the link`
          </p>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sheetsUrl">
            3. Copy the link and paste it here
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
            4. Type in the permalink you want for your site
            <p className="font-medium">
              i.e. <span className="text-blue-600">{getSheetySiteUrl(permalink)}</span>
            </p>
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
        </div>
      </form>
      <p className="text-center text-gray-200 text-xs">&copy;2020 SheetySite. All rights reserved.</p>
    </div>
  )
}

export default Home
