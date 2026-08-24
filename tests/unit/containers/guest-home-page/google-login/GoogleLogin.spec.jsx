import { useEffect } from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { login, signup } from '~/constants'
import GoogleLogin from '~/containers/guest-home-page/google-login/GoogleLogin'
import { useModalContext } from '~/context/modal-context'
import { renderWithProviders } from '~tests/test-utils'

const buttonWidth = { xs: '300px', md: '400px' }

const LoginGoogleLogin = () => {
  const { openModal } = useModalContext()

  useEffect(() => {
    openModal({ component: <div data-testid='dummy-modal'>dummy</div> })
  }, [openModal])

  return <GoogleLogin buttonWidth={buttonWidth} type={login} />
}

describe('GoogleLogin component test for login', () => {
  beforeEach(() => {
    renderWithProviders(<LoginGoogleLogin />)
  })

  it('should have "or continue" text', () => {
    const text = screen.getByText('login.continue')

    expect(text).toBeInTheDocument()
  })

  it('should have "have account" text', () => {
    const text = screen.getByText('login.haveAccount')

    expect(text).toBeInTheDocument()
  })

  it('should have "Join us" text', () => {
    const text = screen.getByText('login.joinUs')

    expect(text).toBeInTheDocument()
  })

  it('should close login modal after click', async () => {
    expect(await screen.findByTestId('dummy-modal')).toBeInTheDocument()

    fireEvent.click(screen.getByText('login.joinUs'))

    await waitFor(() => {
      expect(screen.queryByTestId('dummy-modal')).not.toBeInTheDocument()
    })
  })
})

describe('GoogleLogin component test for signup', () => {
  beforeEach(() => {
    renderWithProviders(<GoogleLogin buttonWidth={buttonWidth} type={signup} />)
  })

  it('should render login popup', async () => {
    fireEvent.click(screen.getByText('signup.joinUs'))

    expect(await screen.findByText('login.head')).toBeInTheDocument()
  })
})
