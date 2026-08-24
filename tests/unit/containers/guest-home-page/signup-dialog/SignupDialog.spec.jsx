import { configureStore } from '@reduxjs/toolkit'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { student } from '~/constants'
import SignupDialog from '~/containers/guest-home-page/signup-dialog/SignupDialog'
import { URLs } from '~/constants/request'
import reducer from '~/redux/reducer'
import { mockAxiosClient, renderWithProviders } from '~tests/test-utils'

describe('Signup dialog test', () => {
  let store
  let dispatchSpy

  beforeEach(() => {
    mockAxiosClient.reset()
    store = configureStore({ reducer: { appMain: reducer } })
    dispatchSpy = vi.spyOn(store, 'dispatch')
    renderWithProviders(<SignupDialog type={student} />, { store })
  })

  it('should render img', () => {
    const img = screen.getByAltText(/signup/i)

    expect(img).toBeInTheDocument()
  })

  it('should render head', () => {
    const head = screen.getByRole('heading', { level: 2 })

    expect(head).toBeInTheDocument()
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

  it('should dispatch after button submit', async () => {
    mockAxiosClient.onPost(URLs.auth.signup).reply(201)

    fireEvent.change(screen.getByLabelText(/common.labels.firstName/i), {
      target: { value: 'test' }
    })
    fireEvent.change(screen.getByLabelText(/common.labels.lastName/i), {
      target: { value: 'test' }
    })
    fireEvent.change(screen.getByLabelText(/common.labels.email/i), {
      target: { value: 'test@gmail.com' }
    })
    fireEvent.change(screen.getByLabelText(/common.labels.password/i), {
      target: { value: '12345678a/A' }
    })
    fireEvent.change(screen.getByLabelText(/common.labels.confirmPassword/i), {
      target: { value: '12345678a/A' }
    })
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByText('common.labels.signup'))

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled()
    })
  })
})
