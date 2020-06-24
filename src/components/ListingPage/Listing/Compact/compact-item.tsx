import React from 'react'
import { gtagEventClick } from '../../../../utils/gtag'
import { ItemData, SiteData, Theme, ListingCardSize } from '../../../../utils/models'
import { getHeightBasedOnCardSize } from '../../../../utils/util'

interface Props {
  item: ItemData
  theme: Theme
  siteData: SiteData
  handleOpenModal: (e, item: ItemData) => void
}

const CompactItem: React.FC<Props> = ({ item, theme, siteData, handleOpenModal }) => {
  const { customShadow, altBackground, text, subtext } = theme
  const { listingCardSize } = siteData
  const imageHeight =
    listingCardSize === ListingCardSize.SMALL
      ? getHeightBasedOnCardSize(listingCardSize) - 8
      : getHeightBasedOnCardSize(listingCardSize) - 16

  const renderImage = () => {
    if (!!item.image) {
      return (
        <img
          className={`w-full rounded-t-lg h-${imageHeight} object-cover`}
          src={item.image}
          alt={`Image of ${item.title}`}
        />
      )
    }
    return <></>
  }

  const renderSubtitle = () => {
    if (!!item.subtitle) {
      return <p className={`${subtext} font-light truncate`}>{item.subtitle}</p>
    }
    return <></>
  }

  const handleItemClick = (e, item: ItemData) => {
    if (!!item.description) {
      gtagEventClick('open_item_modal', item.title)
      handleOpenModal(e, item)
    } else if (!!item.actionUrl && window !== undefined) {
      gtagEventClick('click_item_action', item.actionUrl)
      window.open(item.actionUrl, '_blank')
    }
  }

  return (
    <div
      className={`max-w-sm rounded-lg shadow-lg mb-8 ${altBackground}  ${
        (!!item.description || !!item.actionUrl) && `hover:${customShadow} cursor-pointer`
      }`}
      onClick={(e) => handleItemClick(e, item)}
    >
      {renderImage()}
      <div className="px-6 py-4">
        <div className={`font-bold ${text} text-xl truncate`}>{item.title}</div>
        {renderSubtitle()}
      </div>
    </div>
  )
}

export default CompactItem
