import Particle from './Particle'
import { getEventCoordX, getEventCoordY, preventDefault } from './utils'


let isTouchDown = false
let nextFrameId = 0
let eventEndTimeout = 0
let ctx
let cursorX = 0
let cursorY = 0
let particles = []
const linesAmount = 500
const fadeRate = .03
const mustFade = true
const eventEndDelay = 3000


const _draw = () => {
	particles.forEach((particle) => {
		particle.update(cursorX, cursorY)
		drawParticleLine(particle)
	})
}

const draw = () => {
	_draw()
	if (mustFade) {
		fadeAll()
	}
	if (isTouchDown) {
		nextFrameId = requestAnimationFrame(draw)
	}
}

const initParticleSystem = (x, y) => {
	particles = []
	cursorX = x
	cursorY = y
	for (let i = 0; i <= linesAmount; i++) {
		particles.push(new Particle(x, y))
	}
}

const drawParticleLine = (particle) => {
	ctx.fillStyle = particle.color
	ctx.lineWidth = particle.width
	ctx.strokeStyle = particle.color
  ctx.beginPath()

	ctx.moveTo(particle.oldMidX, particle.oldMidY)
  // ctx.bezierCurveTo(particle.oldMidX, particle.oldMidY, 200, 100, 200, 20)
  ctx.quadraticCurveTo(particle.oldX, particle.oldY, particle.midX, particle.midY)
  // ctx.moveTo(particle.oldX, particle.oldY)
  // ctx.lineTo(particle.x, particle.y)
	ctx.stroke()
	ctx.closePath()
}

const fadeAll = () => {
	ctx.fillStyle = `rgba(255, 255, 255, ${fadeRate})`
  ctx.beginPath()
  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.fill()
	ctx.closePath()
}

const onEventstart = (e) => {
	preventDefault(e)
	particles = []
	initParticleSystem(getEventCoordX(e) || 0, getEventCoordY(e) || 0)
	cancelAnimationFrame(nextFrameId)
	clearTimeout(eventEndTimeout)
	isTouchDown = true
	nextFrameId = requestAnimationFrame(draw)
}

const onEventMove = (e) => {
	preventDefault(e)
	if (isTouchDown) {
		cursorX = getEventCoordX(e)
		cursorY = getEventCoordY(e)
		_draw()
	}
}

const onEventEnd = (e) => {
	eventEndTimeout = setTimeout(() => {
		isTouchDown = false
		particles = []
	}, eventEndDelay)
}

function init() {
	const ctCanvas = document.getElementById('canvas')
	ctCanvas.width = window.innerWidth
	ctCanvas.height = window.innerHeight
	ctCanvas.style.width = `${window.inner}px`
	ctCanvas.style.height = `${window.innerHeight}px`

	if ('ontouchstart' in window) {
		ctCanvas.addEventListener('touchstart', onEventstart)
		ctCanvas.addEventListener('touchmove', onEventMove)
		ctCanvas.addEventListener('touchend', onEventEnd)
	} else {
		onEventstart()
		ctCanvas.addEventListener('mousemove', onEventMove)
	}
	ctx = document.querySelector('canvas').getContext('2d')
}

document.onreadystatechange = async() => {
  if (document.readyState === 'complete') {
    init()
  }
}
