import { assign } from 'xstate'

const playVideo = context => context.video.play()

const pauseVideo = context => context.video.pause()

const restartVideo = assign(context => {
  context.elapsed = context.video.currentTime = 0
  context.video.play()
})

const setVideoTiming = assign((context, event) => {
  if (event.payload) context.video.currentTime = event.payload
  context.elapsed = context.video.currentTime
})

export { playVideo, pauseVideo, restartVideo, setVideoTiming }
