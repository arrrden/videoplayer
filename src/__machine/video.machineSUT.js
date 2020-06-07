/* eslint-disable no-undef */
import { Machine, assign } from 'xstate'
import React from 'react'
export const videoMachine = (url, duration, elapsed) =>
  Machine({
    id: 'videoMachine',
    initial: 'loading',
    context: {
      url,
      video: '<video src={url} />',
      duration,
      elapsed,
    },
    states: {
      loading: {
        on: {
          LOADED: {
            target: 'ready',
            actions: assign({
              duration: 260,
            }),
          },
          FAIL: 'failure',
        },
        meta: {
          test: ({ getByText }) => {
            expect(getByText('loading')).toBeInTheDocument()
          },
        },
      },
      ready: {
        initial: 'paused',
        states: {
          paused: {
            on: {
              PLAY: { target: 'playing', actions: ['playVideo'] },
              SET_TIME: {
                actions: ['setVideoTiming'],
              },
            },
            meta: {
              test: ({ getByTestId }) => {
                expect(getByTestId('button')).toBeInTheDocument()
                expect(getByTestId('bar')).toHaveStyle(
                  'background-image: linear-gradient(to right, palevioletred 50%, palegreen 0)',
                )
              },
            },
          },
          playing: {
            on: {
              PAUSE: { target: 'paused', actions: ['pauseVideo'] },
              END: 'ended',
              TIMING: {
                actions: ['setVideoTiming'],
              },
              SET_TIME: {
                actions: ['setVideoTiming'],
              },
            },
            meta: {
              test: ({ getByTestId }) => {
                expect(getByTestId('button')).not.toContainHTML()
                expect(getByTestId('bar')).toHaveStyle(
                  'background-image: linear-gradient(to right, palevioletred 50%, palegreen 0)',
                )
              },
            },
          },
          ended: {
            on: {
              PLAY: {
                target: 'playing',
                actions: ['restartVideo'],
              },
              SET_TIME: {
                target: 'paused',
                actions: ['setVideoTiming'],
              },
            },
            meta: {
              test: ({ getByTestId }) => {
                expect(getByTestId('button')).toBeInTheDocument()
              },
            },
          },
        },
        meta: {
          test: ({ getByTestId }) => {
            expect(getByTestId('video')).toBeInTheDocument()
          },
        },
      },
      failure: {
        type: 'final',
        meta: {
          test: ({ getByText }) => {
            expect(getByText('video loading error')).toBeInTheDocument()
          },
        },
      },
    },
  })
