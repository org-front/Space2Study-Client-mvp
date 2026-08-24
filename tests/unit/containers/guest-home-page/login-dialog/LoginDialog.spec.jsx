import { configureStore } from '@reduxjs/toolkit'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import LoginDialog from '~/containers/guest-home-page/login-dialog/LoginDialog'
import { URLs } from '~/constants/request'
import reducer from '~/redux/reducer'
import { mockAxiosClient, renderWithProviders } from '~tests/test-utils'

const createJwt = (payload) => {
  const encode = (value) =>
    window
      .btoa(JSON.stringify(value))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

  return `${encode({ alg: 'none' })}.${encode(payload)}.sig`
}

describe('Login dialog test', () => {
  let store
  let dispatchSpy

  beforeEach(() => {
    mockAxiosClient.reset()
    store = configureStore({ reducer: { appMain: reducer } })
    dispatchSpy = vi.spyOn(store, 'dispatch')
    renderWithProviders(<LoginDialog />, { store })
  })

  it('should render img', () => {
    const img = screen.getByAltText(/login/i)

    expect(img).toBeInTheDocument()
  })

  it('should render head text', () => {
    const text = screen.getByText(/login.head/i)

    expect(text).toBeInTheDocument()
  })

  it('should change email value', () => {
    const inputEmail = screen.getByLabelText(/common.labels.email/i)
    fireEvent.change(inputEmail, { target: { value: 'test@mail.com' } })

    expect(inputEmail.value).toBe('test@mail.com')
  })

  it('should change password value', () => {
    const inputPassword = screen.getByLabelText(/common.labels.password/i)
    fireEvent.change(inputPassword, { target: { value: 'test' } })

    expect(inputPassword.value).toBe('test')
  })

  it('should show error', () => {
    const inputEmail = screen.getByLabelText(/common.labels.email/i)
    fireEvent.focusOut(inputEmail)

    const error = screen.getByText('common.errorMessages.emptyField')

    expect(error).toBeInTheDocument()
  })

  it('should dispatch after button submit', async () => {
    mockAxiosClient.onPost(URLs.auth.login).reply(200, {
      accessToken: createJwt({
        id: '1',
        role: 'student',
        isFirstLogin: false
      })
    })

    const inputEmail = screen.getByLabelText(/common.labels.email/i)
    fireEvent.change(inputEmail, { target: { value: 'test@gmail.com' } })

    const inputPassword = screen.getByLabelText(/common.labels.password/i)
    fireEvent.change(inputPassword, { target: { value: '12345678a/A' } })

    fireEvent.click(screen.getByText('common.labels.login'))

    await waitFor(() => expect(dispatchSpy).toHaveBeenCalled())
  })
})
