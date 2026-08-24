import { screen, waitFor } from '@testing-library/react'
import { useLocation } from 'react-router-dom'
import Logout from '~/pages/logout/Logout'
import { URLs } from '~/constants/request'
import { guestRoutes } from '~/router/constants/guestRoutes'
import { mockAxiosClient, renderWithProviders } from '~tests/test-utils'

const LocationProbe = () => {
  const location = useLocation()
  return <div data-testid='location'>{location.pathname}</div>
}

describe('Logout', () => {
  it('dispatches logoutUser action and redirects to home route', async () => {
    mockAxiosClient.reset()
    mockAxiosClient.onPost(URLs.auth.logout).reply(200)

    renderWithProviders(
      <>
        <Logout />
        <LocationProbe />
      </>,
      { initialEntries: ['/logout'] }
    )

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent(
        guestRoutes.home.route
      )
    })
  })
})
