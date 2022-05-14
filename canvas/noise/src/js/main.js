import SimplexNoise from './SimplexNoise'
import Particle from './Particle'


const Configs = {
  particleNum: 500,
  step: 5,
  base: 1000,
  zInc: 0.001,
}

let canvas,
  context,
  screenWidth,
  screenHeight,
  centerX,
  centerY,
  particles = [],
  hueBase = 0,
  simplexNoise,
  zoff = 0

const init = () => {
  canvas = document.querySelector('canvas')
  context = canvas.getContext('2d')
  context.lineWidth = 0.3
  context.lineCap = context.lineJoin = 'round'
  window.addEventListener('resize', onWindowResize, false)
  onWindowResize()
  simplexNoise = new SimplexNoise()

  for (let i = 0, len = Configs.particleNum; i < len; i++) {
    particles[i] = new Particle(screenWidth, screenHeight, centerX, centerY, hueBase)
  }

  update()
}

const onWindowResize = () => {
  screenWidth  = canvas.width  = window.innerWidth
  screenHeight = canvas.height = window.innerHeight
  centerX = screenWidth / 2
  centerY = screenHeight / 2
}

const getNoise = (x, y, z) => {
  let octaves = 4,
    fallout = 0.5,
    amp = 1, f = 1, sum = 0

  for (let i = 0; i < octaves; ++i) {
    amp *= fallout
    sum += amp * (simplexNoise.noise3D(x * f, y * f, z * f) + 1) * 0.5
    f *= 2
  }

  return sum
}

const drawParticleLine = (p) => {
  context.beginPath()
  context.strokeStyle = p.colorString
  context.moveTo(p.oldMidX, p.oldMidY)
  // context.lineTo(p.x, p.y)
  context.quadraticCurveTo(p.oldX, p.oldY, p.midX, p.midY)
  context.stroke()
  context.closePath()
}

const update = () => {
  for (let i = 0, len = particles.length; i < len; i++) {
    const p = particles[i]
    const angle = Math.PI * 6 * getNoise(p.x / Configs.base * 1.75, p.y / Configs.base * 1.75, zoff)
    p.update(angle, Configs.step)
    drawParticleLine(p)
    if (p.x < 0 || p.x > screenWidth || p.y < 0 || p.y > screenHeight) {
      p.reset(screenWidth, screenHeight, centerX, centerY, hueBase)
    }
  }

  hueBase += 0.1
  zoff += Configs.zInc

  requestAnimationFrame(update)
}

document.onreadystatechange = async() => {
  if (document.readyState === 'complete') {
    init()
  }
}
