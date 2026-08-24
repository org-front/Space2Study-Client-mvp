import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import AppContent from '~/containers/app-content/AppContent'
import { renderWithProviders } from '~tests/test-utils'

describe('AppContent container', () => {
  window.scrollTo = vi.fn()

  it('should render container on the page', () => {
    renderWithProviders(<AppContent />)

    const content = screen.getByTestId('AppContent')

    expect(content).toBeInTheDocument()
  })
})
