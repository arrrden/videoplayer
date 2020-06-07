import React, { useRef, useEffect } from 'react'
import { useMachine } from '@xstate/react'
import styled from '@emotion/styled'

import { videoMachine } from './__machine/video.machine'
import * as config from './__machine/video.actions'

import Bar from './components/Bar/Bar'
import Timer from './components/Timer/Timer'
import PlayPause from './components/PlayPause/PlayPause'

const App = ({ url }) => {
  const ref = useRef(null)
  const [current, send] = useMachine(videoMachine(url), { actions: { ...config } })

  const updateBar = elapsedTime => send({ type: 'SET_TIME', payload: elapsedTime })

  useEffect(() => {
    ref.current.addEventListener('canplay', () => send('LOADED', { video: ref.current }))
    ref.current.addEventListener('error', () => send('FAIL'))
    ref.current.addEventListener('timeupdate', () => send('TIMING'))
    ref.current.addEventListener('ended', () => send('END'))
    return () => {
      ref.current.removeEventListener('canplay', () => send('LOADED', { video: ref.current }))
      ref.current.removeEventListener('error', () => send('FAIL'))
      ref.current.removeEventListener('timeupdate', () => send('TIMING'))
      ref.current.removeEventListener('ended', () => send('END'))
    }
  }, [ref])

  return (
    <StyledWrapper>
      <div className="container">
        <video className="video" ref={ref} data-testid="video" src={url} type="video/mp4" />
        <PlayPause
          click={() => {
            current.matches({ ready: 'playing' }) ? send('PAUSE') : send('PLAY')
          }}
          current={current.value}
        />
      </div>
      <div className="controls">
        <div className="timer">
          <Timer current={current.context} />
          <Bar current={current.context} time={updateBar} />
        </div>
      </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  padding: 0;
  box-sizing: border-box;
  max-width: 600px;
  height: 290px;
  border: 5px solid black;
  border-radius: 12px;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 30px;
  box-shadow: 8px 8px palegreen;
  font-family: sans-serif;

  .container {
    border-bottom: 5px solid black;
    max-width: 600px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 12;
  }

  .video {
    position: absolute;
    width: 100%;
    z-index: 10;
  }

  .controls {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin: 0, 4%;

    .timer {
      width: 90%;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
  }
`

export default App
