import React from 'react'
import { OutboundLink } from 'gatsby-plugin-google-gtag'
import { gtagEventClick } from '../../utils/gtag'

interface Props {
  websheetsUrl: string
  sheetsUrl: string
}

const SuccessCard: React.FC<Props> = ({ websheetsUrl, sheetsUrl }) => (
  <div className="text-center">
    <span className="text-6xl">🎉</span>
    <h1 className="font-bold text-3xl">Your WebSheets has been generated!</h1>
    <p className="text-xl mt-6">
      <span>View Websheets:&nbsp;</span>
      <OutboundLink
        href={websheetsUrl}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600"
        onClick={() => gtagEventClick('open_generated_websheets', websheetsUrl)}
      >
        {websheetsUrl}
      </OutboundLink>
    </p>
    <p className="text-xl">
      Edit Websheets:&nbsp;
      <OutboundLink
        href={sheetsUrl}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600"
        onClick={() => gtagEventClick('open_generated_websheets', sheetsUrl)}
      >
        {sheetsUrl}
      </OutboundLink>
    </p>
  </div>
)

export default SuccessCard
