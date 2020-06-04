export interface ItemData {
  itemId: string
  title: string
  subtitle: string
  description: string
  image: string
  actionUrl: string
  tags: string[]
}

export const isValidItemData = (object: any): object is ItemData => {
  if (!object) {
    return false
  }

  const hasValidItemId = !!object.itemId
  const hasValidTitle = !!object.title
  const hasValidSubtitle = !!object.subtitle
  const hasValidDescription = !!object.description
  const hasValidImage = !!object.image
  const hasValidActionUrl = !!object.actionUrl
  const hasValidTags = !!(object.tags && Array.isArray(object.tags))

  return (
    hasValidItemId &&
    hasValidTitle &&
    hasValidSubtitle &&
    hasValidDescription &&
    hasValidImage &&
    hasValidActionUrl &&
    hasValidTags
  )
}

export interface SiteData {
  siteName: string
  siteLogo: string
  sitePrimaryColor: string
  heroType: HeroType
  heroTitle: string
  heroDescription: string
  heroButtonLabel: string
  heroButtonUrl: string
  listingType: ListingType
  listingDescriptionButtonLabel: string
  listingUrlButtonLabel: string
  footerLabel: string
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
}

export const isValidSiteData = (object: any): object is SiteData => {
  if (!object) {
    return false
  }

  const hasValidSiteName = !!object.siteName
  const hasValidSiteLogo = !!object.siteLogo
  const hasValidSitePrimaryColor = !!object.sitePrimaryColor
  const hasValidHeroType = !!object.heroType
  const hasValidHeroTitle = !!object.heroTitle
  const hasValidHeroDescription = !!object.heroDescription
  const hasValidHeroButtonLabel = !!object.heroButtonLabel
  const hasValidHeroButtonUrl = !!object.heroButtonUrl
  const hasValidListingType = !!object.listingType
  const hasValidListingDescriptionButtonLabel = !!object.listingDescriptionButtonLabel
  const hasValidListingUrlButtonLabel = !!object.listingUrlButtonLabel
  const hasValidFooterLabel = !!object.footerLabel
  const hasValidFacebookUrl = !!object.facebookUrl
  const hasValidInstagramUrl = !!object.instagramUrl
  const hasValidTwitterUrl = !!object.twitterUrl

  return (
    hasValidSiteName &&
    hasValidSiteLogo &&
    hasValidSitePrimaryColor &&
    hasValidHeroType &&
    hasValidHeroTitle &&
    hasValidHeroDescription &&
    hasValidHeroButtonLabel &&
    hasValidHeroButtonUrl &&
    hasValidListingType &&
    hasValidListingDescriptionButtonLabel &&
    hasValidListingUrlButtonLabel &&
    hasValidFooterLabel &&
    hasValidFacebookUrl &&
    hasValidInstagramUrl &&
    hasValidTwitterUrl
  )
}

export interface Theme {
  primary: string
  secondary: string
  text: string
  subtext: string
  altText: string
  altSubtext: string
  background: string
  altBackground: string
  customShadow: string
}

export enum ListingType {
  EVENTS = 'events',
  BASIC_3 = 'basic-3',
  BASIC_4 = 'basic-4',
  COMPACT_4 = 'compact-4',
  COMPACT_5 = 'compact-5',
  COMPACT_6 = 'compact-6',
  PROFILES_3 = 'profiles-3',
  PROFILES_4 = 'profiles-4',
  MODERN_3 = 'modern-3',
  MODERN_4 = 'modern-4',
  MODERN_5 = 'modern-5',
}

export enum HeroType {
  MINIMAL = 'minimal',
  MINIMAL_CENTER = 'minimal-center',
  SIMPLE = 'simple',
  SIMPLE_CENTER = 'simple-center',
}
