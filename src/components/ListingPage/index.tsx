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
import BackToTop from './back-to-top'

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

  const getMatchedColor = (color) => {
    switch (color) {
      case 'peach':
        return 'red'
      case 'brown':
        return 'yellow'
      default:
        return color
    }
  }

  const getMatchedColorTone = (tone, colorTones) => {
    switch (tone) {
      case 'light':
        return colorTones.light
      case 'dark':
        return colorTones.dark
      default:
        return colorTones.base
    }
  }

  const getColorTones = (color: string): { light: number; base: number; dark: number } => {
    switch (color) {
      case 'teal':
        return { light: 500, base: 600, dark: 700 }
      case 'pink':
        return { light: 300, base: 400, dark: 600 }
      case 'blue':
        return { light: 400, base: 600, dark: 800 }
      case 'green':
        return { light: 400, base: 600, dark: 800 }
      case 'purple':
        return { light: 400, base: 600, dark: 800 }
      case 'peach':
        return { light: 300, base: 400, dark: 500 }
      case 'gray':
        return { light: 500, base: 700, dark: 800 }
      case 'indigo':
        return { light: 400, base: 600, dark: 800 }
      case 'red':
        return { light: 600, base: 700, dark: 800 }
      case 'orange':
        return { light: 400, base: 500, dark: 600 }
      case 'brown':
        return { light: 700, base: 800, dark: 900 }
      default:
        return { light: 400, base: 600, dark: 800 }
    }
  }

  const [selectedTone, selectedColor] = sitePrimaryColor.split('-')
  const matchedColor = getMatchedColor(selectedColor)

  const getPrimaryColor = () => {
    const colorTones = getColorTones(selectedColor)
    const matchedColorTone = getMatchedColorTone(selectedTone, colorTones)
    return `${matchedColor}-${matchedColorTone}`
  }

  const primaryColor = getPrimaryColor()

  const lightTheme = {
    primary: primaryColor,
    secondary: `${matchedColor}-900`,
    text: 'text-gray-800',
    subtext: 'text-gray-600',
    altText: 'text-white',
    altSubtext: 'text-gray-400',
    background: 'bg-gray-100',
    altBackground: 'bg-white',
    customShadow: 'shadow-xl',
  }

  const darkTheme = {
    primary: `${matchedColor}-800`,
    secondary: `${matchedColor}-900`,
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
      <SEO title={heroTitle} description={heroDescription} />
      <Hero siteData={siteData} theme={theme} isDarkMode={isDarkMode} handleDarkModeClick={handleDarkModeClick} />
      <Listing siteData={siteData} listingData={listingData} theme={theme} />
      <Footer siteData={siteData} theme={theme} />
      <BackToTop />
    </div>
  )
}

export default ListingPage
