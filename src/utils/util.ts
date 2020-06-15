// allows for alphabets, numbers, underscore, dash
export const isAlphaNumericDash = (str): boolean => {
  const regexp = /^[a-z0-9_\-]+$/i
  return regexp.test(str)
}

export const fetchData = async (url) => {
  const data = await fetch(url)
  return await data.json()
}
