import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
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
    <div>
      <video
        width="600px"
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
        <Bar elapsed={elapsed} duration={duration} time={TIMEBAR} />
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
    </div>
  )
}

export default App

const Bar = ({ elapsed, duration, time }) => {
  const barRef = useRef()
  const [x, setX] = useState({
    x: 0,
  })
  const [progress, setProgress] = useState(elapsed)

  useEffect(() => {
    const el = barRef.current
    setProgress((x.x / el.offsetWidth) * 100)
    time(Math.round((progress / 100) * duration))
  }, [x])

  useEffect(() => {
    barRef.current.style = `
    background-image: linear-gradient(to right, palevioletred ${(elapsed / duration) * 100}%, palegreen 0)`
  }, [elapsed])

  const handleMouseDown = e => {
    const handleMouseOffset = e => {
      if (e.offsetX < 0) setX({ x: 0 })
      setX({ x: e.offsetX })
    }
    document.addEventListener('mousemove', handleMouseOffset)
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', handleMouseOffset)
    })
  }

  return (
    <StyledBar bg={progress}>
      <div ref={barRef} className="bar" id="bar" onMouseDown={e => handleMouseDown(e.nativeEvent)} />
    </StyledBar>
  )
}

const StyledBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: palegreen;

  .bar {
    width: 100%;
    height: 100%;
  }
`
