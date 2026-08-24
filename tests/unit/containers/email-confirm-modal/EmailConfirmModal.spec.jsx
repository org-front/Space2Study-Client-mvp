import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import EmailConfirmModal from '~/containers/email-confirm-modal/EmailConfirmModal'
import { URLs } from '~/constants/request'
import { mockAxiosClient, renderWithProviders } from '~tests/test-utils'

const closeModal = vi.fn()
const confirmUrl = `${URLs.auth.confirm}/test`

describe('EmailConfirmModal test', () => {
  const props = {
    confirmToken: 'test',
    closeModal: closeModal
  }

  beforeEach(() => {
    mockAxiosClient.reset()
  })

  it('should render negative-scenario image and message (BAD_CONFIRM_TOKEN)', async () => {
    mockAxiosClient.onGet(confirmUrl).reply(400, { code: 'BAD_CONFIRM_TOKEN' })
    renderWithProviders(<EmailConfirmModal {...props} />)

    expect(await screen.findByAltText('info')).toBeInTheDocument()
    expect(screen.getByText('modals.emailNotConfirm')).toBeInTheDocument()
    expect(screen.getByText('modals.emailReject.badToken')).toBeInTheDocument()
  })

  it('should render negative-scenario image and message (EMAIL_ALREADY_CONFIRMED)', async () => {
    mockAxiosClient
      .onGet(confirmUrl)
      .reply(400, { code: 'EMAIL_ALREADY_CONFIRMED' })
    renderWithProviders(<EmailConfirmModal {...props} />)

    expect(await screen.findByAltText('info')).toBeInTheDocument()
    expect(screen.getByText('modals.emailAlreadyConfirm')).toBeInTheDocument()
    expect(
      screen.getByText('modals.emailReject.alreadyConfirmed')
    ).toBeInTheDocument()
  })

  it('should render positive-scenario image and message - (response from useAxios)', async () => {
    mockAxiosClient.onGet(confirmUrl).reply(200, { status: 204 })
    renderWithProviders(<EmailConfirmModal {...props} />)

    expect(await screen.findByAltText('info')).toBeInTheDocument()
    expect(screen.getByText('modals.emailConfirm')).toBeInTheDocument()
  })

  it('should render Loader - (loading from useAxios)', () => {
    mockAxiosClient.onGet(confirmUrl).reply(() => new Promise(() => {}))
    renderWithProviders(<EmailConfirmModal {...props} />)

    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('should render button', async () => {
    mockAxiosClient.onGet(confirmUrl).reply(200, { status: 204 })
    renderWithProviders(<EmailConfirmModal {...props} />)

    expect(await screen.findByText('button.goToLogin')).toBeInTheDocument()
  })
})
