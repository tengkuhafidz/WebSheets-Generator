import React from 'react'

interface Props {
  sheetySiteUrl: string
}

const SuccessCard: React.FC<Props> = ({ sheetySiteUrl }) => (
  <div>
    <span className="text-6xl">🎉</span>
    <h1 className="font-bold text-xl mb-4">Your SheetySite has been generated!</h1>
    <p>
      You may check it out at:&nbsp;
      <a href={sheetySiteUrl} target="_blank" rel="noreferrer" className="text-blue-600">
        {sheetySiteUrl}
      </a>
    </p>
  </div>
)

export default SuccessCard
