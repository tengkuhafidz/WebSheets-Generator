import { SiteData, Theme, HeroType, ListingCardType, ListingCardSize, ListingCategoryType } from '../../../utils/models'

export const mockSiteData: SiteData = {
  siteName: 'site name',
  siteLogo: 'site logo',
  sitePrimaryColor: 'site primary color',
  darkMode: false,
  heroType: HeroType.MINIMAL,
  heroTitle: 'hero title',
  heroDescription: 'hero description',
  heroButtonLabel: 'hero button label',
  heroButtonUrl: 'hero button url',
  socialShareButton: true,
  listingCategoryType: ListingCategoryType.TabsView,
  listingCardType: ListingCardType.BASIC,
  listingCardSize: ListingCardSize.MEDIUM,
  listingDescriptionButtonLabel: 'listing description button label',
  listingUrlButtonLabel: 'listing url button label',
  footerLabel: 'footer label',
  facebookUrl: 'facebook url',
  instagramUrl: 'instagram url',
  twitterUrl: 'twitter url',
}

export const mockTheme: Theme = {
  primary: `teal-600`,
  secondary: `teal-900`,
  text: 'text-gray-800',
  subtext: 'text-gray-600',
  altText: 'text-white',
  altSubtext: 'text-gray-400',
  background: 'bg-gray-100',
  altBackground: 'bg-white',
  customShadow: 'shadow-xl',
}
