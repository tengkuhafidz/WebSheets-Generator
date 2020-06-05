import { isValidItemData, isValidSiteData } from '../utils/models'

export const API_KEY = process.env.GATSBY_SHEET_API_KEY
export const SITE_DATA_RANGE = 'site!A1:P2'
export const LISTING_DATA_RANGE = 'listing!A1:G1000'
export const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets'

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

export const createArrayOfObjectsFromNestedArrays = (rawNestedArrayData) => {
  const [rawObjectKeys, ...allObjectValues] = rawNestedArrayData
  const objectKeys = rawObjectKeys.map((key) => toCamelCase(key))

  const arrayOfObjects = allObjectValues.map((singleObjectValues) => {
    const singleObject = {}
    objectKeys.forEach((objKey, index) => {
      singleObject[objKey] = singleObjectValues[index]
    })
    return singleObject
  })

  return arrayOfObjects
}

const formatSiteData = (rawSiteData) => {
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

const formatListingData = (rawListingData) => {
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

const formatSheetsData = (rawSheetsData) => {
  let formattedSiteData
  let formattedListingData

  rawSheetsData.valueRanges.forEach((data) => {
    if (data.range === SITE_DATA_RANGE) {
      formattedSiteData = formatSiteData(data.values)
    } else if (data.range === LISTING_DATA_RANGE) {
      formattedListingData = formatListingData(data.values)
    }
  })

  return { formattedSiteData, formattedListingData }
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

const validateSiteData = (siteData) => {
  return isValidSiteData(siteData)
}

const validateListingData = (listingData) => {
  let isValid = true
  listingData.forEach((item) => {
    if (!isValidItemData(item)) {
      isValid = false
    }
  })

  return isValid
}

export const validateSheetsData = (sheetsData) => {
  const { formattedSiteData, formattedListingData } = sheetsData
  return validateSiteData(formattedSiteData) && validateListingData(formattedListingData)
}
