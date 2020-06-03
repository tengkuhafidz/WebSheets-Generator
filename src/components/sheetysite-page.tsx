import { RouteComponentProps } from '@reach/router'
import React, { useEffect, useState } from 'react'
import { API_KEY, BASE_URL, LISTING_DATA_RANGE, SITE_DATA_RANGE } from '../constants/sheets'
import { SiteData } from '../utils/models'
import Footer from './footer'
import Hero from './Hero'
import Listing from './Listing'
import SEO from './seo'
import { createArrayOfObjectsFromNestedArrays } from '../utils/util'
import firebase from '../services/firebase'
import { navigate } from 'gatsby'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props
  extends RouteComponentProps<{
    permalink: string
  }> {}

const SheetySitePage: React.FC<Props> = ({ permalink = 'sample' }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [siteData, setSiteData] = useState()
  const [listingData, setListingData] = useState()

  const shapeAndSetSiteData = (rawSiteData) => {
    const siteData = createArrayOfObjectsFromNestedArrays(rawSiteData)[0]
    setSiteData(siteData)
  }

  const shapeAndSetListingData = (rawListingData) => {
    const listingData = createArrayOfObjectsFromNestedArrays(rawListingData)
    console.log('shapeAndSetListingData', listingData)
    if (listingData !== undefined) {
      const formattedListingData = listingData.map((item) => {
        if (typeof item.tags === 'string') {
          item.tags = item.tags.split(', ')
        }
        return item
      })
      setListingData(formattedListingData)
    }
  }

  const shapeAndSetSheetsData = (rawSheetsData) => {
    rawSheetsData.valueRanges.forEach((data) => {
      if (data.range === SITE_DATA_RANGE) {
        shapeAndSetSiteData(data.values)
      } else if (data.range === LISTING_DATA_RANGE) {
        shapeAndSetListingData(data.values)
      }
    })
  }

  const findSheetIdByPermalink = async () => {
    const FIREBASE_COLLECTION = 'permalinkSheetIdMapping'
    return firebase
      .firestore()
      .collection(FIREBASE_COLLECTION)
      .doc(permalink)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data().sheetId
        } else {
          navigate('/')
        }
      })
  }

  const fetchAndSetSheetsData = async (sheetId) => {
    const sheetsApiUrl = `${BASE_URL}/${sheetId}/values:batchGet?ranges=${SITE_DATA_RANGE}&ranges=${LISTING_DATA_RANGE}&key=${API_KEY}`
    const fetchSheetsData = await fetch(sheetsApiUrl)
    const rawSheetsData = await fetchSheetsData.json()

    shapeAndSetSheetsData(rawSheetsData)
  }

  useEffect(() => {
    const executeSheetsDataFetch = async () => {
      const sheetId = await findSheetIdByPermalink()
      await fetchAndSetSheetsData(sheetId)
    }
    executeSheetsDataFetch()
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
