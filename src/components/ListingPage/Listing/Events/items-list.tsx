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
  const numOfCols = listingCardSize === ListingCardSize.SMALL ? `1` : `2`
  const gap = listingCardSize === ListingCardSize.SMALL ? `` : `gap-8`

  return <div className={`grid md:grid-cols-${numOfCols} ${gap}`}>{renderItems()}</div>
}

export default ItemsList
