/* eslint-disable no-undef */
import { Machine, assign } from 'xstate'

export const videoMachine = url =>
  Machine({
    id: 'videoMachine',
    initial: 'loading',
    context: {
      url,
      video: null,
      duration: 0,
      elapsed: 0,
    },
    states: {
      loading: {
        on: {
          LOADED: {
            target: 'ready',
            actions: assign({
              video: (_, event) => event.video,
              duration: (_, event) => event.video.duration,
            }),
          },
          FAIL: 'failure',
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
          },
        },
      },
      failure: { type: 'final' },
    },
  })
