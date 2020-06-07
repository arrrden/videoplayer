import React, { useRef, useEffect } from 'react'
import { useMachine } from '@xstate/react'
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
          src={url}
          type="video/mp4"
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
          <Timer current={current.context} />
          <Bar current={current.context} time={updateBar} />
        </div>
      </div>
    </div>
  )
}

export default App
