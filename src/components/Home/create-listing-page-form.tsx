import React from 'react'
import { OutboundLink } from 'gatsby-plugin-google-gtag'
import { gtagEventClick } from '../../utils/gtag'

interface Props {
  handleSheetsUrlChange: (e) => void
  handlePermalinkChange: (e) => void
  handleSubmitListingForm: () => void
  invalidSheetsErrMsg: string
  invalidPermalinkErrMsg: string
  unavailablePermalinkErrMsg: string
  sheetySiteUrl: string
  isLoading: boolean
}

const CreateListingPageForm: React.FC<Props> = ({
  handleSheetsUrlChange,
  handlePermalinkChange,
  handleSubmitListingForm,
  invalidSheetsErrMsg,
  invalidPermalinkErrMsg,
  unavailablePermalinkErrMsg,
  sheetySiteUrl,
  isLoading,
}) => {
  const preventSpaceInput = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault()
    }
  }

  return (
    <div>
      <h1 className="text-4xl text-center mb-8">WebSheets</h1>
      <div className="mb-4">
        <p className="block text-gray-700 text-sm font-bold mb-2">
          1. Make a copy of WebSheets template to you Google Drive by clicking &nbsp;
          <OutboundLink
            href="https://docs.google.com/spreadsheets/d/16x6gtYQl7TAhehSqcaf_SAMDKNpEgoMxAGgMpQ7NUMs/copy#gid=863715774"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600"
            onClick={() => gtagEventClick('open_sheets_template')}
          >
            here
          </OutboundLink>
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
            i.e. <span className="text-blue-600">{sheetySiteUrl}</span>
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
          className={`text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
          }`}
          type="button"
          onClick={handleSubmitListingForm}
        >
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </div>
    </div>
  )
}

export default CreateListingPageForm
