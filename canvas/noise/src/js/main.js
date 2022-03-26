import SimplexNoise from './SimplexNoise'
import { round } from './utils'


const Configs = {
  particleNum: 1000,
  step: 5,
  base: 1000,
  zInc: 0.001,
}

var canvas,
  context,
  screenWidth,
  screenHeight,
  centerX,
  centerY,
  particles = [],
  hueBase = 0,
  simplexNoise,
  zoff = 0

// Initialize
function init() {
  canvas = document.querySelector('canvas')

  window.addEventListener('resize', onWindowResize, false)
  onWindowResize(null)

  for (var i = 0, len = Configs.particleNum; i < len; i++) {
    initParticle((particles[i] = new Particle()))
  }

  simplexNoise = new SimplexNoise()

  canvas.addEventListener('click', onCanvasClick, false)

  update()
}

function onWindowResize(e) {
  screenWidth  = canvas.width  = window.innerWidth
  screenHeight = canvas.height = window.innerHeight
  centerX = screenWidth / 2
  centerY = screenHeight / 2
  context = canvas.getContext('2d')
  context.lineWidth = 0.3
  context.lineCap = context.lineJoin = 'round'
}

function onCanvasClick(e) {
  context.clearRect(0, 0, screenWidth, screenHeight)
  simplexNoise = new SimplexNoise()
}

function getNoise(x, y, z) {
  var octaves = 4,
    fallout = 0.5,
    amp = 1, f = 1, sum = 0,
    i

  for (i = 0; i < octaves; ++i) {
    amp *= fallout
    sum += amp * (simplexNoise.noise3D(x * f, y * f, z * f) + 1) * 0.5
    f *= 2
  }

  return sum
}

function initParticle(p) {
  p.x = screenWidth * Math.random()
  p.y = screenHeight * Math.random()
  p.oldX = p.x
  p.oldY = p.y
	p.midX = p.x
	p.midY = p.y
	p.oldMidX = p.x
	p.oldMidY = p.y
  p.color.h = hueBase + Math.atan2(centerY - p.y, centerX - p.x) * 180 / Math.PI
  p.color.s = 1
  p.color.l = 0.5
  p.color.a = 0
}

function update() {
  var p, angle

  for (let i = 0, len = particles.length; i < len; i++) {
    p = particles[i]

    p.oldX = p.x
    p.oldY = p.y
    p.oldMidX = p.midX
		p.oldMidY = p.midY

    angle = Math.PI * 6 * getNoise(p.x / Configs.base * 1.75, p.y / Configs.base * 1.75, zoff)
    p.x = round(p.x + Math.cos(angle) * Configs.step, 2)
    p.y = round(p.y + Math.sin(angle) * Configs.step, 2)
    p.midX = round((p.oldX + p.x) / 2, 2)
    p.midY = round((p.oldY + p.y) / 2, 2)

    if (p.color.a < 1) p.color.a += 0.003

    context.beginPath()
    context.strokeStyle = p.color.toString()
    context.moveTo(p.oldMidX, p.oldMidY)
    // context.lineTo(p.x, p.y)
    context.quadraticCurveTo(p.oldX, p.oldY, p.midX, p.midY)
    context.stroke()
		context.closePath()

    if (p.x < 0 || p.x > screenWidth || p.y < 0 || p.y > screenHeight) {
      initParticle(p)
    }
  }

  hueBase += 0.1
  zoff += Configs.zInc

  requestAnimationFrame(update)
}

function HSLA(h, s, l, a) {
  this.h = h || 0
  this.s = s || 0
  this.l = l || 0
  this.a = a || 0
}
HSLA.prototype.toString = function() {
  return 'hsla(' + this.h + ',' + (this.s * 100) + '%,' + (this.l * 100) + '%,' + this.a + ')'
}

function Particle(x, y, color) {
  this.x = x || 0
  this.y = y || 0
  this.color = color || new HSLA()
  this.oldX = this.x
  this.oldY = this.y
}

document.onreadystatechange = async() => {
  if (document.readyState === 'complete') {
    init()
  }
}
