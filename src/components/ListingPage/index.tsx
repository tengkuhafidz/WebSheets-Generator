import { RouteComponentProps } from '@reach/router'
import { navigate } from 'gatsby'
import React, { useEffect, useState } from 'react'
import { findSheetIdByPermalink } from '../../services/firebase'
import { getSheetsData } from '../../services/sheets'
import { SiteData, SheetsData } from '../../utils/models'
import Footer from './footer'
import Hero from './Hero'
import Listing from './Listing'
import SEO from './seo'
import GridLoader from 'react-spinners/GridLoader'
import { gtagEventClick } from '../../utils/gtag'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props
  extends RouteComponentProps<{
    permalink: string
  }> {}

const ListingPage: React.FC<Props> = ({ permalink }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [siteData, setSiteData] = useState(null)
  const [listingData, setListingData] = useState(null)

  const setSheetsData = (sheetsData: SheetsData) => {
    const { siteData, listingData } = sheetsData
    setSiteData(siteData)
    setIsDarkMode(siteData.darkMode)
    setListingData(listingData)
  }

  useEffect(() => {
    const executeAsyncOperations = async () => {
      const sheetId = await findSheetIdByPermalink(permalink.toLowerCase())

      if (!sheetId) {
        navigate('/')
        return
      }

      const sheetsData = await getSheetsData(sheetId)

      if (!!sheetsData) {
        setSheetsData(sheetsData)
      } else {
        navigate('/')
      }
    }

    executeAsyncOperations()
  }, [permalink])

  if (!siteData || !listingData) {
    return (
      <div className="flex h-screen">
        <div className="mx-auto mt-64">
          <GridLoader color={'#049663'} />
        </div>
      </div>
    )
  }

  const { sitePrimaryColor, heroTitle, heroDescription } = siteData as SiteData
  let primaryColor = `${sitePrimaryColor}-500`
  switch (sitePrimaryColor) {
    case 'pink':
      primaryColor = `${sitePrimaryColor}-400`
      break
    case 'red':
      primaryColor = `${sitePrimaryColor}-600`
      break
    default:
      primaryColor = `${sitePrimaryColor}-500`
  }

  const lightTheme = {
    primary: primaryColor,
    secondary: `${sitePrimaryColor}-800`,
    text: 'text-gray-800',
    subtext: 'text-gray-600',
    altText: 'text-white',
    altSubtext: 'text-gray-400',
    background: 'bg-gray-100',
    altBackground: 'bg-white',
    customShadow: 'shadow-xl',
  }

  const darkTheme = {
    primary: primaryColor,
    secondary: `${sitePrimaryColor}-800`,
    text: 'text-white',
    subtext: 'text-gray-400',
    altText: 'text-gray-800',
    altSubtext: 'text-gray-700',
    background: 'bg-gray-900',
    altBackground: 'bg-gray-600',
    customShadow: 'shadow-white',
  }

  const handleDarkModeClick = () => {
    gtagEventClick('toggle_dark_mode', (!isDarkMode).toString())
    setIsDarkMode(!isDarkMode)
  }

  const theme = isDarkMode ? darkTheme : lightTheme

  return (
    <div className={`${theme.background} min-h-screen`}>
      <SEO title={heroTitle} description={`${heroDescription}`} />
      <Hero siteData={siteData} theme={theme} isDarkMode={isDarkMode} handleDarkModeClick={handleDarkModeClick} />
      <Listing listingData={listingData} siteData={siteData} theme={theme} />
      <Footer siteData={siteData} theme={theme} />
    </div>
  )
}

export default ListingPage
