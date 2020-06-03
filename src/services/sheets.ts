import { navigate } from '@reach/router'

export const API_KEY = process.env.GATSBY_SHEET_API_KEY
export const SITE_DATA_RANGE = 'site!A1:O2'
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
  return createArrayOfObjectsFromNestedArrays(rawSiteData)[0]
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

export const fetchAndSetSheetsData = async (sheetId, setSiteData, setListingData) => {
  const rawSheetsData = await fetchRawSheetsData(sheetId)

  try {
    const { formattedSiteData, formattedListingData } = formatSheetsData(rawSheetsData)
    setSiteData(formattedSiteData)
    setListingData(formattedListingData)
  } catch (e) {
    navigate('/')
  }
}

export const validateSheetFields = async (sheetId) => {
  const rawSheetsData = await fetchRawSheetsData(sheetId)

  try {
    formatSheetsData(rawSheetsData)
  } catch (e) {
    console.log('bad excel format')
  }

  return rawSheetsData
}
