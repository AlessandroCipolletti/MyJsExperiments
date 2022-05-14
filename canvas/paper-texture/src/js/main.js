// import roundNumber from 'js-math-and-ui-utils/mathUtils/roundNumber'
import getRandomNumber from 'js-math-and-ui-utils/mathUtils/getRandomNumber'


let canvas = null
let context = null
const fuzzAmount = 20
const xStep = 20
const linesAmount = 20_000
// const linesAmount = 2


const init = () => {
  canvas = document.getElementById('canvas')
  context = canvas.getContext('2d')
  // window.addEventListener('resize', onWindowResize, false)
  onWindowResize()
  console.time('draw')
  for (let i = 0; i < linesAmount; i++) {
    drawLine(context, getRandomNumber(0, canvas.height, 0))
  }
  console.timeEnd('draw')
}

const drawLine = (ctx, startY) => {
  let x = 0, y = startY
  // let oldX = x, oldY = y
  // let midX = x, midY = y
  ctx.strokeStyle = `rgba(0, 0, 0, ${getRandomNumber(0.01, 0.02, 4)})`
  // ctx.strokeStyle = `rgba(0, 0, 0, ${getRandomNumber(0.1, 0.5, 4)})`
  ctx.beginPath()
  ctx.lineWidth = 1
  ctx.moveTo(x, y)
  while (x < canvas.width) {
    x += xStep
    y += getRandomNumber(-fuzzAmount, fuzzAmount, 0)
    // midX = roundNumber((oldX + x) / 2, 1)
    // midY = roundNumber((oldY + y) / 2, 1)
    // ctx.quadraticCurveTo(oldX, oldY, midX, midY)
    ctx.lineTo(x, y)
    // oldX = x
    // oldY = y
  }
  ctx.stroke()
  ctx.closePath()
}

const onWindowResize = () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

document.onreadystatechange = async() => {
  if (document.readyState === 'complete') {
    init()
  }
}
