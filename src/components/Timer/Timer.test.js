/* eslint-disable no-undef */
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Timer from './Timer'

test('on load the elapsed time reads "00 00: 04 20"', () => {
  const { getByText } = render(<Timer duration={260} elapsed={0} />)
  expect(getByText('00 00: 04 20')).toBeInTheDOM()
})
