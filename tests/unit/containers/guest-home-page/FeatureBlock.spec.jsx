import { ThemeProvider } from '@mui/material/styles'
import { render, screen } from '@testing-library/react'
import mediaQuery from 'css-mediaquery'
import { vi } from 'vitest'
import FeatureBlock from '~/containers/guest-home-page/FeatureBlock'
import MapLogo from '~/assets/img/guest-home-page/map.svg'
import { theme } from '~/styles/app-theme/custom-mui.styles'

const createMatchMedia = (width) => {
  return (query) => ({
    matches: mediaQuery.match(query, { width }),
    addListener: vi.fn(),
    removeListener: vi.fn()
  })
}

const items = [
  {
    image: MapLogo,
    title: 'First test title',
    description: 'First test description'
  }
]

const renderFeatureBlock = () =>
  render(
    <ThemeProvider theme={theme}>
      <FeatureBlock items={items} />
    </ThemeProvider>
  )

describe('Carousel test', () => {
  it('Test should render carousel component', () => {
    window.matchMedia = createMatchMedia(375)
    renderFeatureBlock()
    const carouselComponent = screen.getByTestId('carousel')
    const accordionComponent = screen.queryByTestId('accordion')

    expect(carouselComponent).toBeInTheDocument()
    expect(accordionComponent).not.toBeInTheDocument()
  })
})

describe('Accordion test', () => {
  it('Test should render accordion component', () => {
    window.matchMedia = createMatchMedia(1444)
    renderFeatureBlock()
    const accordionComponent = screen.getByTestId('accordion')
    const carouselComponent = screen.queryByTestId('carousel')

    expect(accordionComponent).toBeInTheDocument()
    expect(carouselComponent).not.toBeInTheDocument()
  })
})
