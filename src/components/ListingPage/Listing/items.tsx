import React from 'react'
import ModernItem from './Modern/modern-item'
import { ItemData, Theme, SiteData, ListingCardType, ListingCardSize } from '../../../utils/models'
import ProfileItem from './Profiles/profiles-item'
import BasicItem from './Basic/basic-item'
import CompactItem from './Compact/compact-item'

interface Props {
  items: ItemData[]
  theme: Theme
  handleOpenModal: (e, item: ItemData) => void
  siteData: SiteData
}

const Items: React.FC<Props> = ({ items, theme, handleOpenModal, siteData }) => {
  const { listingCardType, listingCardSize } = siteData

  const getNumOfCols = (listingCardSize) => {
    switch (listingCardSize) {
      case ListingCardSize.SMALL:
        return 5
      case ListingCardSize.MEDIUM:
        return 4
      case ListingCardSize.LARGE:
        return 3
      default:
        return 4
    }
  }

  const numOfCols = getNumOfCols(listingCardSize)

  const renderBasicItems = () => {
    return items.map((item) => (
      <BasicItem item={item} key={item.itemId} theme={theme}  siteData={siteData} handleOpenModal={handleOpenModal} />
    ))
  }

  const renderCompactItems = () => {
    return items.map((item) => (
      <CompactItem item={item} key={item.itemId} theme={theme} siteData={siteData} handleOpenModal={handleOpenModal} />
    ))
  }

  const renderProfileItems = () => {
    return items.map((item) => <ProfileItem item={item} key={item.itemId} theme={theme}  siteData={siteData} />)
  }

  const renderModernItems = () => {
    return items.map((item) => (
      <ModernItem item={item} key={item.itemId} theme={theme}  siteData={siteData} handleOpenModal={handleOpenModal} />
    ))
  }

  const renderItems = () => {
    switch (listingCardType) {
      case ListingCardType.BASIC:
        return renderBasicItems()
      case ListingCardType.COMPACT:
        return renderCompactItems()
      case ListingCardType.PROFILES:
        return renderProfileItems()
      case ListingCardType.MODERN:
        return renderModernItems()
      default:
        return renderBasicItems()
    }
  }

  return <div className={`grid grid-cols-1 md:grid-cols-${numOfCols} gap-8`}>{renderItems()}</div>
}

export default Items
