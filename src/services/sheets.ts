import { isValidItemData, isValidSiteData, SheetsData, SiteData, ItemData } from '../utils/models'
import { fetchData } from '../utils/util'

export const API_KEY = process.env.GATSBY_SHEET_API_KEY
export const SITE_DATA_RANGE = 'site!A1:B20'
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
    listingType,
    listingDescriptionButtonLabel,
    listingUrlButtonLabel,
    footerLabel,
    facebookUrl,
    instagramUrl,
    twitterUrl,
  } = rawSiteDataObject

  return {
    siteName,
    siteLogo,
    sitePrimaryColor,
    darkMode: darkMode === 'true',
    heroType,
    heroTitle,
    heroDescription,
    heroButtonLabel,
    heroButtonUrl,
    listingType,
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

export const getSheetsData = async (sheetId): Promise<SheetsData> => {
  const siteData = await fetchAndTransformSiteData(sheetId)
  const listingData = await fetchAndTransformListingData(sheetId)

  console.log('>>> siteData', siteData)
  console.log('>>> listingData', listingData)

  return {
    siteData,
    listingData,
  }
}

/**
 * FETCHING AND FORMATTING SHEETS DATA
 */

export const createArrayOfObjectsFromNestedArrays = (rawNestedArrayData) => {
  const [rawObjectKeys, ...allObjectValues] = rawNestedArrayData
  const objectKeys = rawObjectKeys.map((key) => formatKey(key))

  const arrayOfObjects = allObjectValues.map((singleObjectValues) => {
    const singleObject = {}
    objectKeys.forEach((objKey, index) => {
      singleObject[objKey] = singleObjectValues[index]
    })
    return singleObject
  })

  return arrayOfObjects
}

const formatSiteData = (rawSiteData): SiteData => {
  const siteData = createArrayOfObjectsFromNestedArrays(rawSiteData)[0]
  if (siteData !== undefined) {
    const { darkMode, ...rest } = siteData
    const formattedSiteData = {
      ...rest,
      darkMode: darkMode === 'TRUE',
    }
    return formattedSiteData
  }
  return siteData
}

const formatListingData = (rawListingData): ItemData[] => {
  const listingData = createArrayOfObjectsFromNestedArrays(rawListingData)
  if (listingData !== undefined) {
    const formattedListingData = listingData.map((item) => {
      if (typeof item.tags === 'string') {
        item.tags = item.tags.split(', ')
      }
      return item
    })
    return formattedListingData
  }
  return listingData
}

const formatSheetsData = (rawSheetsData): SheetsData => {
  let siteData: SiteData
  let listingData: ItemData[]

  rawSheetsData.valueRanges.forEach((data) => {
    if (data.range === SITE_DATA_RANGE) {
      siteData = formatSiteData(data.values)
    } else if (data.range === LISTING_DATA_RANGE) {
      listingData = formatListingData(data.values)
    }
  })

  return { siteData, listingData }
}

const fetchRawSheetsData = async (sheetId) => {
  const sheetsApiUrl = `${BASE_URL}/${sheetId}/values:batchGet?ranges=${SITE_DATA_RANGE}&ranges=${LISTING_DATA_RANGE}&key=${API_KEY}`
  const fetchSheetsData = await fetch(sheetsApiUrl)
  const rawSheetsData = await fetchSheetsData.json()
  return rawSheetsData
}

export const fetchAndFormatSheetsData = async (sheetId) => {
  try {
    const rawSheetsData = await fetchRawSheetsData(sheetId)
    return formatSheetsData(rawSheetsData)
  } catch (e) {
    return null
  }
}

/**
 * VALIDATION SHEETS DATA
 */

const validateListingData = (listingData) => {
  let isValid = true
  listingData.forEach((item) => {
    if (!isValidItemData(item)) {
      isValid = false
    }
  })

  return isValid
}

const validateSiteData = (siteData) => {
  return isValidSiteData(siteData)
}

export const validateSheetsData = (sheetsData: SheetsData) => {
  const { siteData, listingData } = sheetsData
  return validateSiteData(siteData) && validateListingData(listingData)
}
