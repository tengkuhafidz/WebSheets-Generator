import React, { useState } from 'react'
import { createPermalinkIfNew } from '../services/firebase'
import { validateSheetFields } from '../services/sheets'

const Home = () => {
  const [sheetsUrl, setSheetsUrl] = useState()
  const [permalink, setPermalink] = useState()

  const handleSheetsUrlChange = (e) => {
    setSheetsUrl(e.target.value)
  }

  const handlePermalinkChange = (e) => {
    setPermalink(e.target.value)
  }

  const extractSheetIdFromUrl = (sheetsUrl) => {
    const pathsAsArray = sheetsUrl.replace(/^https?:\/\//, '').split('/')
    const sheetId = pathsAsArray[3]
    return sheetId
  }

  const handleSiteGeneration = () => {
    console.log('handleSiteGeneration', sheetsUrl, permalink)
    const sheetId = extractSheetIdFromUrl(sheetsUrl)
    console.log('handleSiteGeneration sheetId', sheetId)
    validateSheetFields(sheetId)
    createPermalinkIfNew(permalink, sheetId)
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
            />
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
