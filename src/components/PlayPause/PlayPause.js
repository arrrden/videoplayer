import React from 'react'
import Play from '../../assets/play.svg'

const PlayPause = ({ click, current }) => {
  if (JSON.stringify(current) === '"loading"') return <>{'loading'}</>

  switch (current.ready) {
    case 'playing':
      return <Button click={click} />
    case 'paused':
    case 'ended':
      return (
        <Button click={click}>
          <img width="50" src={Play} alt="play button" />
        </Button>
      )
    default:
      throw Error(`unhandled playerState, ${JSON.stringify(current)}`)
  }
}

const Button = ({ click, children }) => {
  return (
    <button
      style={{
        background: 'transparent',
        height: '100%',
        width: '100%',
        border: 'none',
        margin: 'auto',
        zIndex: '11',
      }}
      onClick={click}>
      {children}
    </button>
  )
}

export default PlayPause
