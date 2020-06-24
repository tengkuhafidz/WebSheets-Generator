import React from 'react'
import { ItemData, Theme } from '../../../../utils/models'
import { OutboundLink } from 'gatsby-plugin-google-gtag'
import { gtagEventClick } from '../../../../utils/gtag'

interface Props {
  item: ItemData
  theme: Theme
}

const ProfileItem: React.FC<Props> = ({ item, theme }) => {
  const { customShadow } = theme

  const renderImage = () => {
    if (!!item.image) {
      return <img className="w-full rounded-t-lg object-cover" src={item.image} alt={`Image of ${item.title}`} />
    }
    return <></>
  }

  const renderSubtitle = () => {
    if (!!item.subtitle) {
      return <p className={`text-gray-600 font-light truncate`}>{item.subtitle}</p>
    }
    return <></>
  }

  const renderDescription = () => {
    if (!!item.description) {
      return <p className={`text-gray-800 mt-4`}>{item.description}</p>
    }
    return <></>
  }

  // return (
  //   <OutboundLink
  //     className={`max-w-sm rounded-lg shadow-lg bg-white mb-8 ${
  //       !!item.actionUrl && `hover:${customShadow} cursor-pointer`
  //     }`}
  //     href={item.actionUrl}
  //     target="_blank"
  //     rel="noreferrer"
  //     onClick={() => gtagEventClick('click_item_action', item.actionUrl)}
  //   >
  //     {renderImage()}
  //     <div className="px-6 py-6">
  //       <div className={`font-bold text-gray-800 text-xl truncate`}>{item.title}</div>
  //       {renderSubtitle()}
  //       {renderDescription()}
  //     </div>
  //   </OutboundLink>
  // )
  return (
    <div className="max-w-sm min-w-sm lg:max-w-full lg:flex">
      <div
        className="h-32 lg:h-auto lg:w-32 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
        style={{ backgroundImage: `url(${item.image})` }}
        title="Woman holding a mug"
      ></div>
      <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
        <div className="mb-8">
          {<div className="text-gray-900 font-bold text-xl mb-2">{item.title}</div>}
          {renderSubtitle()}
        </div>
      </div>
    </div>
  )
}

export default ProfileItem
