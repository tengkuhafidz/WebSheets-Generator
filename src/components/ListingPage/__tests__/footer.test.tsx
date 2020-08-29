import React from 'react'
import { mockSiteData, mockTheme } from '../__mocks__/mock-data'
import { render } from '@testing-library/react'
import Footer from '../footer'
import '@testing-library/jest-dom/extend-expect'

describe('Footer', () => {
  it('displays Websheets branding', () => {
    const { getByText } = render(<Footer siteData={mockSiteData} theme={mockTheme} />)
    expect(getByText('WebSheets')).toBeInTheDocument()
  })
})
