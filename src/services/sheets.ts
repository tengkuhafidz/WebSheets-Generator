import { HeroType, ItemData, ListingType, SheetsData } from '../utils/models'
import { fetchData } from '../utils/util'

export const API_KEY = process.env.GATSBY_SHEET_API_KEY
export const SITE_DATA_RANGE = 'site!A1:B21'
export const LISTING_DATA_RANGE = 'listing!A1:G1000'
export const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets'

export enum SheetsMajorDimension {
  COLUMNS = 'COLUMNS',
  ROWS = 'ROWS',
}

/**
 * FETCH & TRANSFORM SHEETS DATA
 */

const removeLastAsteriskIfAny = (str) => {
  if (str.substring(str.length - 1) == '*') {
    return str.substring(0, str.length - 1)
  }

  return str
}

const toCamelCase = (str) => {
  return str
    .split(' ')
    .map(function (word, index) {
      if (index == 0) {
        return word.toLowerCase()
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join('')
}

const formatKey = (str) => {
  return removeLastAsteriskIfAny(toCamelCase(str))
}

const transformArrayDataToObject = (rawNestedArrayData) => {
  const [rawObjectKeys, ...allObjectValues] = rawNestedArrayData.values
  const objectKeys = rawObjectKeys.map((key) => formatKey(key))

  const arrayOfObjects = allObjectValues.map((singleObjectValues) => {
    const singleObject = {}
    objectKeys.forEach((objKey, index) => {
      singleObject[objKey] = singleObjectValues[index] ? singleObjectValues[index] : null
    })
    return singleObject
  })

  return arrayOfObjects
}

const transformListingData = (rawListingData) => {
  const rawListingDataObjects = transformArrayDataToObject(rawListingData)

  return rawListingDataObjects.map((rawItem, index) => {
    const { title, subtitle, description, image, actionUrl, tags } = rawItem

    return {
      itemId: index + 1,
      title,
      subtitle,
      description,
      image,
      actionUrl,
      tags: typeof tags === 'string' && tags.split(', '),
    }
  })
}

const fetchRawListingData = async (sheetId) => {
  const listingSheetsApiUrl = `${BASE_URL}/${sheetId}/values/${LISTING_DATA_RANGE}?majorDimension=${SheetsMajorDimension.ROWS}&key=${API_KEY}`
  return await fetchData(listingSheetsApiUrl)
}

const fetchAndTransformListingData = async (sheetId) => {
  const rawListingData = await fetchRawListingData(sheetId)
  return await transformListingData(rawListingData)
}

const transformSiteData = (rawSiteData) => {
  const rawSiteDataObject = transformArrayDataToObject(rawSiteData)[0]

  const {
    siteName,
    siteLogo,
    sitePrimaryColor,
    darkMode,
    heroType,
    heroTitle,
    heroDescription,
    heroButtonLabel,
    heroButtonUrl,
    socialShareButton,
    listingType,
    listingDescriptionButtonLabel,
    listingUrlButtonLabel,
    footerLabel,
    facebookUrl,
    instagramUrl,
    twitterUrl,
  } = rawSiteDataObject

  return {
    siteName: siteName || 'SheetySite',
    siteLogo,
    sitePrimaryColor: sitePrimaryColor || 'teal',
    darkMode: darkMode === 'true',
    heroType: heroType || HeroType.SIMPLE,
    heroTitle: heroTitle || 'My List',
    heroDescription: heroDescription || 'Check out this curated list',
    heroButtonLabel: heroButtonLabel || 'Contact Me',
    heroButtonUrl,
    socialShareButton: socialShareButton !== null ? socialShareButton === 'show' : true,
    listingType: listingType || ListingType.BASIC_3,
    listingDescriptionButtonLabel: listingDescriptionButtonLabel || 'More Info',
    listingUrlButtonLabel: listingUrlButtonLabel || 'View Details',
    footerLabel,
    facebookUrl,
    instagramUrl,
    twitterUrl,
  }
}

const fetchRawSiteData = async (sheetId) => {
  const siteSheetsApiUrl = `${BASE_URL}/${sheetId}/values/${SITE_DATA_RANGE}?majorDimension=${SheetsMajorDimension.COLUMNS}&key=${API_KEY}`
  return await fetchData(siteSheetsApiUrl)
}

const fetchAndTransformSiteData = async (sheetId) => {
  const rawSiteData = await fetchRawSiteData(sheetId)
  return transformSiteData(rawSiteData)
}

const validateListingData = (listingData: ItemData[]) => {
  const listingItemWithoutTitle = listingData.find((item) => !item.title)
  if (listingItemWithoutTitle) {
    return false
  }
  return true
}

export const getSheetsData = async (sheetId): Promise<SheetsData> => {
  const siteData = await fetchAndTransformSiteData(sheetId)
  const listingData = await fetchAndTransformListingData(sheetId)

  const isValidData = validateListingData(listingData)

  if (isValidData) {
    return {
      siteData,
      listingData,
    }
  }
  return null
}
