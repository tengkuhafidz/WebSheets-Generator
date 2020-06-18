import { HeroType, ItemData, ListingType, SheetsData } from '../utils/models'
import { fetchData } from '../utils/util'
import { transformListingData, transformSiteData } from '../utils/transformers'

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

const formatListingData = (rawListingData) => {
  const rawListingDataObjects = transformArrayDataToObject(rawListingData)
  return transformListingData(rawListingDataObjects)
}

const fetchRawListingData = async (sheetId) => {
  const listingSheetsApiUrl = `${BASE_URL}/${sheetId}/values/${LISTING_DATA_RANGE}?majorDimension=${SheetsMajorDimension.ROWS}&key=${API_KEY}`
  return await fetchData(listingSheetsApiUrl)
}

const fetchAndFormatListingData = async (sheetId) => {
  const rawListingData = await fetchRawListingData(sheetId)
  return await formatListingData(rawListingData)
}

const formatSiteData = (rawSiteData) => {
  const rawSiteDataObject = transformArrayDataToObject(rawSiteData)[0]
  return transformSiteData(rawSiteDataObject)
}

const fetchRawSiteData = async (sheetId) => {
  const siteSheetsApiUrl = `${BASE_URL}/${sheetId}/values/${SITE_DATA_RANGE}?majorDimension=${SheetsMajorDimension.COLUMNS}&key=${API_KEY}`
  return await fetchData(siteSheetsApiUrl)
}

const fetchAndFormatSiteData = async (sheetId) => {
  const rawSiteData = await fetchRawSiteData(sheetId)
  return formatSiteData(rawSiteData)
}

const validateListingData = (listingData: ItemData[]) => {
  const listingItemWithoutTitle = listingData.find((item) => !item.title)
  if (listingItemWithoutTitle) {
    return false
  }
  return true
}

export const getSheetsData = async (sheetId): Promise<SheetsData> => {
  const siteData = await fetchAndFormatSiteData(sheetId)
  const listingData = await fetchAndFormatListingData(sheetId)

  const isValidData = validateListingData(listingData)

  if (isValidData) {
    return {
      siteData,
      listingData,
    }
  }
  return null
}
