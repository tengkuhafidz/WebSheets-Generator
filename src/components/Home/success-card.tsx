import React from 'react'
import { OutboundLink } from 'gatsby-plugin-google-gtag'
import { gtagEventClick } from '../../utils/gtag'

interface Props {
  sheetySiteUrl: string
}

const SuccessCard: React.FC<Props> = ({ sheetySiteUrl }) => (
  <div className="text-center">
    <span className="text-6xl">🎉</span>
    <h1 className="font-bold text-xl mb-4">Your SheetySite has been generated!</h1>
    <p>
      You may check it out at:&nbsp;
      <OutboundLink
        href={sheetySiteUrl}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600"
        onClick={() => gtagEventClick('open_generated_sheetysite', sheetySiteUrl)}
      >
        {sheetySiteUrl}
      </OutboundLink>
    </p>
  </div>
)

export default SuccessCard
