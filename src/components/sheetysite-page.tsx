import { RouteComponentProps } from '@reach/router'
import { navigate } from 'gatsby'
import React, { useEffect, useState } from 'react'
import { findSheetIdByPermalink } from '../services/firebase'
import { fetchAndFormatSheetsData, validateSheetsData } from '../services/sheets'
import { SiteData } from '../utils/models'
import Footer from './footer'
import Hero from './Hero'
import Listing from './Listing'
import SEO from './seo'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props
  extends RouteComponentProps<{
    permalink: string
  }> {}

const SheetySitePage: React.FC<Props> = ({ permalink = 'sample' }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [siteData, setSiteData] = useState()
  const [listingData, setListingData] = useState()

  const setSheetsData = (siteData, listingData) => {
    setSiteData(siteData)
    setListingData(listingData)
  }

  useEffect(() => {
    const executeAsyncOperations = async () => {
      const sheetId = await findSheetIdByPermalink(permalink.toLowerCase())
      const sheetsData = await fetchAndFormatSheetsData(sheetId)
      const isValidSheetsData = validateSheetsData(sheetsData)
      if (isValidSheetsData) {
        setSheetsData(sheetsData.formattedSiteData, sheetsData.formattedListingData)
      } else {
        navigate('/')
      }
    }
    executeAsyncOperations()
  }, [permalink])

  if (!siteData || !listingData) return <div>loading</div>

  const { sitePrimaryColor, siteName, siteLogo, heroTitle, heroDescription } = siteData as SiteData

  const lightTheme = {
    primary: `${sitePrimaryColor}-600`,
    secondary: `${sitePrimaryColor}-800`,
    text: 'text-gray-800',
    subtext: 'text-gray-600',
    altText: 'text-white',
    altSubtext: 'text-gray-400',
    background: 'bg-gray-100',
    altBackground: 'bg-gray-400',
    customShadow: 'shadow-xl',
  }

  const darkTheme = {
    primary: `${sitePrimaryColor}-600`,
    secondary: `${sitePrimaryColor}-800`,
    text: 'text-white',
    subtext: 'text-gray-400',
    altText: 'text-gray-800',
    altSubtext: 'text-gray-600',
    background: 'bg-gray-900',
    altBackground: 'bg-gray-600',
    customShadow: 'shadow-white',
  }

  const handleDarkModeClick = () => {
    setIsDarkMode(!isDarkMode)
  }

  const theme = isDarkMode ? darkTheme : lightTheme

  return (
    <div className={`${theme.background} min-h-screen`}>
      <SEO image={siteLogo} title={siteName} description={`${heroTitle} - ${heroDescription}`} />
      <Hero siteData={siteData} theme={theme} isDarkMode={isDarkMode} handleDarkModeClick={handleDarkModeClick} />
      <Listing listingData={listingData} siteData={siteData} theme={theme} />
      <Footer siteData={siteData} theme={theme} />
    </div>
  )
}

export default SheetySitePage
