import React from 'react'
import { SiteData, Theme, HeroType } from '../../../utils/models'
import ShareButton from './share-button'

interface Props {
  siteData: SiteData
  theme: Theme
  heroType: HeroType
  isCenter: boolean
}

const Body: React.FC<Props> = ({ siteData, theme, heroType, isCenter }) => {
  const { primary, background, text, subtext } = theme
  const { heroTitle, heroDescription, heroButtonLabel, heroButtonUrl, socialShareButton } = siteData

  const heroTypeStyles = () => {
    if (heroType === HeroType.MINIMAL || heroType === HeroType.MINIMAL_CENTER) {
      return {
        actionButtonColors: `bg-${primary} text-gray-100`,
        shareButtonOutlineColor: primary,
        headerTextColor: text,
        paragraphTextColor: subtext,
      }
    }
    return {
      actionButtonColors: `${background} ${text}`,
      shareButtonOutlineColor: 'gray-100',
      headerTextColor: 'text-gray-100',
      paragraphTextColor: 'text-gray-100',
    }
  }

  const { actionButtonColors, shareButtonOutlineColor, headerTextColor, paragraphTextColor } = heroTypeStyles()

  const renderActionButton = () => {
    if (!!heroButtonUrl) {
      return (
        <a
          className={`${actionButtonColors} py-3 px-6 rounded-lg md:mr-4`}
          href={heroButtonUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {heroButtonLabel}
          <i className="fas fa-share ml-2"></i>
        </a>
      )
    }
  }

  const renderShareButton = () => {
    if (socialShareButton) {
      return <ShareButton siteData={siteData} theme={theme} outlineColor={shareButtonOutlineColor} />
    }
    return <></>
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${isCenter && 'text-center'}`}>
      <h1 className={`text-4xl ${headerTextColor}`}>{heroTitle}</h1>
      <p className={`font-thin text-xl ${paragraphTextColor}`}>{heroDescription}</p>
      <div className="my-12">
        {renderActionButton()}
        {renderShareButton()}
      </div>
    </div>
  )
}

export default Body
