import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str) => str
    }
  }
}))

// jsdom has no Google Identity Services script (index.html loads it in the browser).
// Stub GSI so GoogleButton can mount in any spec without a per-file mock.
window.google = {
  accounts: {
    id: {
      initialize: vi.fn(),
      renderButton: vi.fn()
    }
  }
}
