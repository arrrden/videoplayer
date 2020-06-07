/* eslint-disable no-undef */
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Bar from './Bar'

const updateBar = arg => `beep beep boop ${arg}`

// TODO: cater for more cases!
describe('when the video is played', () => {
  test("the bar updates with the video's progress", () => {
    const { getByTestId } = render(<Bar current={{ duration: 260, elapsed: 130 }} time={updateBar} />)
    expect(getByTestId('bar')).toHaveStyle(
      'background-image: linear-gradient(to right, palevioletred 50%, palegreen 0)',
    )
  })
})
