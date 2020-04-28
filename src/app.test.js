/* eslint-disable no-undef */
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import App from './app'

test('it renders without crashing', () => {
  const { getByTestId } = render(<App />)
  expect(getByTestId('video')).toBeInTheDOM()
})
