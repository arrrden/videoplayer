import React, { useRef } from 'react'
import styled from 'styled-components'
import { useMachine } from '@xstate/react'
import { Machine, assign } from 'xstate'

import Bar from './components/Bar/Bar'
import Timer from './components/Timer/Timer'
import PlayPause from './components/PlayPause/PlayPause'

const videoMachine = new Machine({
  id: 'videoMachine',
  initial: 'loading',
  context: {
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
              target: 'paused',
              actions: ['setVideoTiming', assign({ elapsed: context => context.video.currentTime })],
            },
          },
        },
        playing: {
          on: {
            PAUSE: { target: 'paused', actions: ['pauseVideo'] },
            END: 'ended',
            TIMING: {
              target: 'playing',
              actions: assign({
                elapsed: context => context.video.currentTime,
              }),
            },
            SET_TIME: {
              target: 'playing',
              actions: ['setVideoTiming', assign({ elapsed: context => context.video.currentTime })],
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
              actions: ['setVideoTiming', assign({ elapsed: context => context.video.currentTime })],
            },
          },
        },
      },
    },
    failure: { type: 'final' },
  },
})

const playVideo = context => {
  context.video.play()
}

const pauseVideo = context => {
  context.video.pause()
}

const restartVideo = context => {
  context.video.currentTime = 0
  context.video.play()
}

const setVideoTiming = (context, event) => {
  context.video.currentTime = event.payload
}

const App = () => {
  const ref = useRef(null)
  const [current, send] = useMachine(videoMachine, {
    actions: { playVideo, pauseVideo, restartVideo, setVideoTiming },
  })
  const { duration, elapsed } = current.context

  const TIMEBAR = arg => {
    send({ type: 'SET_TIME', payload: arg })
  }

  return (
    <div
      style={{
        padding: 0,
        boxSizing: 'border-box',
        maxWidth: 600,
        height: 290,
        border: '5px solid black',
        borderRadius: 12,
        overflow: 'hidden',
        display: 'grid',
        gridTemplateRows: 'auto 30px',
        boxShadow: '8px 8px palegreen',
        fontFamily: 'helvetica, sans-serif',
      }}>
      <div
        style={{
          borderBottom: '5px solid black',
          maxWidth: 600,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '12',
        }}>
        <video
          style={{ position: 'absolute', width: '100%', zIndex: '10' }}
          ref={ref}
          data-testid="video"
          src="https://www.dropbox.com/s/nkwaj2i8c4ljz6f/Peter%20Tscherkassky%20-%20L%27Arriv%C3%A9e%20%28Teaser%29.mp4?raw=1"
          type="video/mp4"
          // when video is ready -> onCanPlay will send LOADED
          // & videoMachine moves into ready state
          onCanPlay={() => {
            send('LOADED', { video: ref.current })
          }}
          // if video fails -> onError sends FAIL
          // & videoMachine moves into failue (final) state
          onError={() => send('FAIL')}
          // if time updates the sends TIMING which returns playing
          // and updates context
          onTimeUpdate={() => send('TIMING')}
          onEnded={() => send('END')}
        />
        <PlayPause
          click={() => {
            current.matches({ ready: 'playing' }) ? send('PAUSE') : send('PLAY')
          }}
          current={current.value}
        />
      </div>
      <div
        className="controls"
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          margin: '0, 4%',
        }}>
        <div
          style={{
            width: '90%',
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}>
          <Timer elapsed={elapsed} duration={duration} />
          <Bar elapsed={elapsed} duration={duration} time={TIMEBAR} />
        </div>
      </div>
    </div>
  )
}

export default App
