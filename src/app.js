import React, { useRef } from 'react'
import { useMachine } from '@xstate/react'
import { Machine, assign } from 'xstate'

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
          },
        },
        ended: {
          on: {
            PLAY: {
              target: 'playing',
              actions: ['restartVideo'],
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

const App = () => {
  const ref = useRef(null)
  const [current, send] = useMachine(videoMachine, {
    actions: { playVideo, pauseVideo, restartVideo },
  })
  const { duration, elapsed } = current.context

  console.log(current.value)

  return (
    <>
      <video
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
      <div className="controls">
        <button
          onClick={() => {
            // if current state is playing -> onClick send pause
            current.matches({ ready: 'playing' }) ? send('PAUSE') : send('PLAY')
          }}>
          {/* if playing return 'pause' else 'play' */}
          {current.matches({ ready: 'playing' }) ? 'pause' : 'play'}
        </button>
        {Math.round(elapsed)} - {Math.round(duration)}
      </div>
    </>
  )
}

export default App
