import { ListingCardSize } from './models'

export const fetchData = async (url: string) => {
  const data = await fetch(url)
  return await data.json()
}

export const getHeightBasedOnCardSize = (listingCardSize: ListingCardSize): number => {
  switch (listingCardSize) {
    case ListingCardSize.SMALL:
      return 32
    case ListingCardSize.MEDIUM:
      return 48
    case ListingCardSize.LARGE:
      return 64
    default:
      return 48
  }
}
