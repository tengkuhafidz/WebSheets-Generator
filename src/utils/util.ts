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
