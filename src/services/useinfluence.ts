import { postData } from '../utils/util'

const WEBHOOKS_URL =
  'https://api.useinfluence.co/webhooks/custom/5d1dcac7f7e21300110eaa61/81192c70-ba1d-11ea-bf4c-fd9ee09c705b'

export const captureInfluenceSiteGeneration = async (email, permalink) => {
  const options = {
    email,
    firstname: permalink,
    city: '',
    country: '',
  }

  return await postData(WEBHOOKS_URL, options)
}
