import React from 'react'

interface Props {
  handleEmailChange: (e) => void
  handleSiteGeneration: () => void
  invalidEmailErrMsg: string
}

const RequestEmailForm: React.FC<Props> = ({ handleEmailChange, handleSiteGeneration, invalidEmailErrMsg }) => (
  <div className="text-center">
    <span className="text-6xl">💌</span>
    <h1 className="font-bold text-xl">Final Step! Please provide your email.</h1>
    <div className="mb-6">
      <label className="block text-gray-700 text-sm  mb-6 max-w-lg mx-auto" htmlFor="email">
        As SheetySite is an evolving project, we need a way to reach out to you whenever there is any major updates to
        the system.
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="email"
        type="email"
        placeholder="Email"
        onChange={(e) => handleEmailChange(e)}
      />
      <p className="text-red-500 text-xs text-left">{invalidEmailErrMsg}</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-8 border-b-4 border-blue-800"
        type="button"
        onClick={handleSiteGeneration}
      >
        Generate My SheetySite
      </button>
    </div>
  </div>
)

export default RequestEmailForm
