import React from 'react'
import { ItemData, SiteData, Theme, ListingCardSize } from '../../../../utils/models'
import SingleItem from './single-item'

interface Props {
  items: ItemData[]
  theme: Theme
  siteData: SiteData
}

const ItemsList: React.FC<Props> = ({ items, theme, siteData }) => {
  const renderItems = () => {
    return items.map((item) => <SingleItem item={item} key={item.itemId} theme={theme} siteData={siteData} />)
  }
  const { listingCardSize } = siteData

  const getNumOfCols = (listingCardSize) => {
    switch (listingCardSize) {
      case ListingCardSize.SMALL:
        return 3
      case ListingCardSize.MEDIUM:
        return 2
      case ListingCardSize.LARGE:
        return 1
      default:
        return 2
    }
  }

  const numOfCols = getNumOfCols(listingCardSize)
  const gap = listingCardSize === ListingCardSize.LARGE ? `` : `md:gap-8`

  return <div className={`grid md:grid-cols-${numOfCols} ${gap}`}>{renderItems()}</div>
}

export default ItemsList
