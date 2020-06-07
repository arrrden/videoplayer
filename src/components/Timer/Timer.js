import React from 'react'

const Timer = ({ current }) => {
  // Take in integer (time) in second and reformats value to 'mm ss' or 'hh mm ss'
  function formatTime(time) {
    const timeArr = []
    if (isNaN(time) || time < 1) {
      return '00 00'
    } else if (time >= 3600) {
      const hr = Math.floor(time / (60 * 60)).toString()
      const min = Math.round(time - hr * 60).toString()
      const sec = Math.round(time - hr - min * 60).toString()
      timeArr.push(hr, min, sec)
    } else {
      const min = Math.floor(time / 60).toString()
      const sec = Math.round(time - min * 60).toString()
      timeArr.push(min, sec)
    }

    const formattedTime = timeArr.map(i => {
      if (i.length < 2) {
        return `0${i}`
      } else {
        return i
      }
    })

    return formattedTime.length === 3
      ? `${formattedTime[0]} ${formattedTime[1]} ${formattedTime[2]}`
      : `${formattedTime[0]} ${formattedTime[1]}`
  }

  return <span>{`${formatTime(current.elapsed)}: ${formatTime(current.duration)}`}</span>
}

export default Timer
