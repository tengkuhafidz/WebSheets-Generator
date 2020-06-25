import React from 'react'
import ModernItem from './Modern/modern-item'
import { ItemData, Theme, SiteData, ListingCardType, ListingCardSize } from '../../../utils/models'
import ProfileItem from './Profiles/profiles-item'
import BasicItem from './Basic/basic-item'
import CompactItem from './Compact/compact-item'
import MinimalItem from './Minimal/minimal-item'
import PillItem from './Pill/pill-item'

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
        return listingCardType === ListingCardType.PILL ? 4 : 5
      case ListingCardSize.MEDIUM:
        return listingCardType === ListingCardType.PILL ? 3 : 4
      case ListingCardSize.LARGE:
        return listingCardType === ListingCardType.PILL ? 2 : 3
      default:
        return listingCardType === ListingCardType.PILL ? 3 : 4
    }
  }

  const renderBasicItems = () => {
    return items.map((item) => (
      <BasicItem item={item} key={item.itemId} theme={theme} siteData={siteData} handleOpenModal={handleOpenModal} />
    ))
  }

  const renderCompactItems = () => {
    return items.map((item) => (
      <CompactItem item={item} key={item.itemId} theme={theme} siteData={siteData} handleOpenModal={handleOpenModal} />
    ))
  }

  const renderMinimalItems = () => {
    return items.map((item) => (
      <MinimalItem item={item} key={item.itemId} theme={theme} siteData={siteData} handleOpenModal={handleOpenModal} />
    ))
  }

  const renderPillItems = () => {
    return items.map((item) => (
      <PillItem item={item} key={item.itemId} theme={theme} handleOpenModal={handleOpenModal} />
    ))
  }

  const renderProfileItems = () => {
    return items.map((item) => <ProfileItem item={item} key={item.itemId} theme={theme} />)
  }

  const renderModernItems = () => {
    return items.map((item) => (
      <ModernItem item={item} key={item.itemId} theme={theme} handleOpenModal={handleOpenModal} />
    ))
  }

  const renderItems = () => {
    switch (listingCardType) {
      case ListingCardType.BASIC:
        return renderBasicItems()
      case ListingCardType.COMPACT:
        return renderCompactItems()
      case ListingCardType.MINIMAL:
        return renderMinimalItems()
      case ListingCardType.PILL:
        return renderPillItems()
      case ListingCardType.PROFILES:
        return renderProfileItems()
      case ListingCardType.MODERN:
        return renderModernItems()
      default:
        return renderBasicItems()
    }
  }

  const numOfCols = getNumOfCols(listingCardSize)

  return <div className={`grid grid-cols-1 md:grid-cols-${numOfCols} md:gap-8`}>{renderItems()}</div>
}

export default Items
