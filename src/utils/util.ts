// allows for alphabets, numbers, underscore, dash
export const isAlphaNumericDash = (str): boolean => {
  const regexp = /^[a-z0-9_\-]+$/i
  return regexp.test(str)
}

export const hasProperty = (property) => property && property !== 'nil'
