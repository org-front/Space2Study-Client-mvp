import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import GuestHomePage from '~/pages/guest-home-page/GuestHome'
import { renderWithProviders } from '~tests/test-utils'

window.scrollTo = vi.fn()

describe('GuestHomePage test', () => {
  it('should render without opening login modal', () => {
    renderWithProviders(<GuestHomePage />, { initialEntries: '/' })

    expect(screen.queryByText('login.head')).not.toBeInTheDocument()
  })

  it('should open login modal when login query in url', async () => {
    renderWithProviders(<GuestHomePage />, {
      initialEntries: '/?login'
    })

    expect(await screen.findByText('login.head')).toBeInTheDocument()
  })
})
