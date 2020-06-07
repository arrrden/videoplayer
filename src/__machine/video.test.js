/* eslint-disable no-undef */
import { createModel } from '@xstate/test'
import { videoMachine } from './video.machineSUT'
import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import * as config from './video.actions'

import App from '../app'

describe('video app', () => {
  const url = 'https://beep.boop/video.mp4'
  const duration = 260
  const elapsed = 130

  const MACHINE = videoMachine(url, duration, elapsed)
  const CONFIGURED_MACHINE = createModel(MACHINE, { actions: { ...config } })
  const videoModel = CONFIGURED_MACHINE.withEvents({
    LOADED: ({ getByTestId }) => {
      fireEvent.canPlay(getByTestId('video'))
      fireEvent.click(getByTestId('button'))
    },
    PLAY: ({ getByTestId }) => {
      fireEvent.click(getByTestId('button'))
    },
    PAUSE: ({ getByTestId }) => {
      fireEvent.click(getByTestId('button'))
    },
    END: ({ getByTestId }) => {
      fireEvent.ended(getByTestId('video'))
      fireEvent.click(getByTestId('button'))
    },
    FAILURE: ({ getByTestId }) => {
      fireEvent.error(getByTestId('video'))
    },
  })

  const testPlans = videoModel.getSimplePathPlans()

  testPlans.forEach(plan => {
    describe(plan.description, () => {
      afterEach(cleanup)
      plan.paths.forEach(path => {
        it(path.description, async () => {
          // Test setup
          const rendered = render(<App url={url} />)

          // Test execution
          await path.test(rendered)
        })
      })
    })
    it('coverage', () => {
      videoModel.testCoverage()
    })
  })
})
