/* eslint-disable no-undef */
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import PlayPause from './PlayPause'

describe('when the video is loaded', () => {
  test('the player contains a play button', () => {
    const { getByAltText } = render(
      <PlayPause click={() => 'zzzzvvvvtt I am a computer'} current={{ ready: 'paused' }} />,
    )
    expect(getByAltText('play button')).toBeInTheDocument()
  })
  test('and playing, the player does not contain a play button', () => {
    const { getByTestId } = render(
      <PlayPause click={() => 'zzzzvvvvtt I am a computer'} current={{ ready: 'playing' }} />,
    )
    expect(getByTestId('button')).not.toContainHTML(<img />)
  })
})
