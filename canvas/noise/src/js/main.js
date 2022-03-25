import SimplexNoise from './SimplexNoise'


const Configs = {
  backgroundColor: '#eee9e9',
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
  context.save()
  context.globalAlpha = 0.8
  context.fillStyle = Configs.backgroundColor
  context.fillRect(0, 0, screenWidth, screenHeight)
  context.restore()
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
  p.x = p.pastX = screenWidth * Math.random()
  p.y = p.pastY = screenHeight * Math.random()
  p.color.h = hueBase + Math.atan2(centerY - p.y, centerX - p.x) * 180 / Math.PI
  p.color.s = 1
  p.color.l = 0.5
  p.color.a = 0
}

function update() {
  var p, angle

  for (let i = 0, len = particles.length; i < len; i++) {
    p = particles[i]

    p.pastX = p.x
    p.pastY = p.y

    angle = Math.PI * 6 * getNoise(p.x / Configs.base * 1.75, p.y / Configs.base * 1.75, zoff)
    p.x += Math.cos(angle) * Configs.step
    p.y += Math.sin(angle) * Configs.step

    if (p.color.a < 1) p.color.a += 0.003

    context.beginPath()
    context.strokeStyle = p.color.toString()
    context.moveTo(p.pastX, p.pastY)
    context.lineTo(p.x, p.y)
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
  this.pastX = this.x
  this.pastY = this.y
}

document.onreadystatechange = async() => {
  if (document.readyState === 'complete') {
    init()
  }
}
