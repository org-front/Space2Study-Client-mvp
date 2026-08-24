import { configureStore } from '@reduxjs/toolkit'
import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import AppMain from '~/containers/layout/app-main/AppMain'
import reducer from '~/redux/reducer'
import { renderWithProviders } from '~tests/test-utils'

window.scrollTo = vi.fn()

const mockState = {
  appMain: { loading: true, userRole: '' }
}

describe('AppMain layout component test', () => {
  it('should render loader', () => {
    renderWithProviders(<AppMain />, { preloadedState: mockState })
    const loader = screen.getByTestId('loader')
    expect(loader).toBeInTheDocument()
  })

  it('should dispatch checkAuth if accessToken exists in localStorage', () => {
    const store = configureStore({
      reducer: { appMain: reducer },
      preloadedState: {
        appMain: {
          loading: false,
          authLoading: false,
          userRole: ''
        }
      }
    })
    const dispatchSpy = vi.spyOn(store, 'dispatch')

    renderWithProviders(<AppMain />, { store })

    expect(dispatchSpy).toHaveBeenCalled()
  })
})
