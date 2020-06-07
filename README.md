# Video Player 
Super simple video player using XState, React and Emotion (css in js). 

XState is a really clear and robust way to manage state and user flow in an application that has a very clear user flow - plus the [visualiser is very cool](https://xstate.js.org/viz/?gist=0dae302c2381e375402aa9f82019a857). 

This project implements XState/test which allows for [auto-generation of integration and e2e tests](https://youtu.be/tpNmPKjPSFQ). This reduces the number of tests that need to be manually written in favour of [updating the model](./src/__machine/video.machineSUT.js).

I like this method, however the algorithm increases exponentially relative to the number of state nodes - so it is worth configuring the test plans in bigger projects. 

![Project as of 01 May](./01May.jpg)

[live demo on codesandbox](https://s9php.sse.codesandbox.io/). Do bear with it as it isn't deployed and runs of Webpacks dev server...

## Users Can: 
- See a loading state before the being able to press play 
- Play and pause a video once ready 
- navigate through the video using the progress bar 

## To Do: 
- **Properly deploy somewhere** 
- Move styling to Emotion ✅
- improve test coverage and implement model-based tests ✅ (this is 50:50 as the coverage presently fails...)
- after dragging progress bar focus should return to the video
- make styling more suitable for small screens
- add support for touch events on progress bar
- known issue: leaving the progress bar while dragging can cause the progress bar to jump around

### To get this running:  
- clone the repo
- install dependencies 
- run `npm run start` to open the webpack dev server on 8080
