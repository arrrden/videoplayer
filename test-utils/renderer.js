import { render } from '@testing-library/react'

// define providers
const Providers = ({ children }) => {
  return { children }
}
// define custom renderer
const customRender = (ui, options) => {
  render(ui, {
    wrapper: Providers,
    ...options,
  })
}

// export everything
export * from '@testing-library/react'

// overide render method
export { customRender as render }
