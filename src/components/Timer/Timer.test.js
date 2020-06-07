/* eslint-disable no-undef */
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Timer from './Timer'

// TODO: cater for more cases!
describe('when the video is played', () => {
  test('the timer converts seconds into "mm ss: mm ss"', () => {
    const { getByText } = render(<Timer current={{ duration: 260, elapsed: 0 }} />)
    expect(getByText('00 00: 04 20')).toBeInTheDocument()
  })
})
