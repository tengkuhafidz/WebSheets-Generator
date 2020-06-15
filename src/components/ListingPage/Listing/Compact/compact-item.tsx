import React from 'react'
import { ItemData, Theme } from '../../../../utils/models'

interface Props {
  item: ItemData
  theme: Theme
  handleOpenModal: (e, item: ItemData) => void
}

const CompactItem: React.FC<Props> = ({ item, theme, handleOpenModal }) => {
  const { altBackground, text, subtext, customShadow } = theme

  const renderImage = () => {
    if (!!item.image) {
      return <img className="w-full rounded-t-lg h-24 object-cover" src={item.image} alt={`Image of ${item.title}`} />
    }
    return <></>
  }

  const renderSubtitle = () => {
    if (!!item.subtitle) {
      return <p className={`${subtext} font-light truncate`}>{item.subtitle}</p>
    }
    return <></>
  }

  return (
    <div
      className={`max-w-sm rounded-lg shadow-lg mb-8 ${altBackground} ${
        !!item.actionUrl && `hover:${customShadow} cursor-pointer`
      }`}
      onClick={(e) => handleOpenModal(e, item)}
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
