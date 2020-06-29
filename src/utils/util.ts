import { ListingCardSize, ItemData } from './models'
import { gtagEventClick } from './gtag'

export const fetchData = async (url: string) => {
  const data = await fetch(url)
  return await data.json()
}

export const postData = async (url: string, data: any) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  return response.json()
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

export const handleItemClick = (e, item: ItemData, handleOpenModal) => {
  if (!!item.description) {
    gtagEventClick('open_item_modal', item.title)
    handleOpenModal(e, item)
  } else if (!!item.actionUrl && window !== undefined) {
    gtagEventClick('click_item_action', item.actionUrl)
    window.open(item.actionUrl, '_blank')
  }
}
