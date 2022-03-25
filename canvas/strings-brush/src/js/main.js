import { getEventCoordX, getEventCoordY, preventDefault } from './utils'


let touchDown = false
let nextFrameId = 0, eventEndTimeout = 0
var ctx;
var cursorX = 0;
var cursorY = 0;
var fadeRate = .05;
var _r;
var _g;
var _b;
var _a = .05;
var rad = 100;
var systemSize = 250; // quante linee disegnare
var fadeStage = true; // se deve fare l'effetto fade o no
var grayScale = false; // se è a colori o no
var dx = 2;
var dy = 4;

let particles = []

const draw = () => { // FOR PARICLES NOT LINES
	particles.forEach((particle) => particle.draw())
	if (fadeStage) {
		fadeAll()
	}
	if (touchDown) {
		nextFrameId = requestAnimationFrame(draw)
	}
}

const initParticleSystem = (x, y) => {
	particles = []
	cursorX = x
	cursorY = y
	for (let i = 0; i <= systemSize; i++) {
		var newParticle = new Particle()
		newParticle.init(x, y)
		particles.push(newParticle)
	}
}

function Particle() {}

Particle.prototype.init = function(x, y) {
	setColor(this);
	this.x = x
	this.y = y
	this.vel = Math.random() * 5 + 1;
	this.ang = Math.random() * (Math.PI);
	this.diameter = Math.random() * 5 + 1;
	this.oldX = this.x;
	this.oldY = this.y;
	this.speedModX = Math.random() * 20 + 8;
	this.speedModY = Math.random() * 20 + 8;
	this.speedModTargX = Math.random() * 3 + 2;
	this.speedModTargY = Math.random() * 3 + 2;
	this.maxSpeed = Math.random() * 20 + 5;
	this.speedX = 0;
	this.speedY = 0;
}

Particle.prototype.draw = function(){
	ctx.fillStyle = this.color;

	var _x = this.x;
	var _y = this.y;
	var _d = this.diameter;
	var _vel = this.vel;
	var _ang = this.ang;
	var _smx = this.speedModX;
	var _smy = this.speedModY;
	var _sX = this.speedX;
	var _sY = this.speedY;

	this.oldX = _x;
	this.oldY = _y;

	var targSpeedX = (cursorX - _x)/this.speedModTargX;
	var targSpeedY = (cursorY - _y)/this.speedModTargY;

	if (Math.abs(_sX) > this.maxSpeed){
		if (_sX > 0){
			_sX = this.maxSpeed;
		} else {
			_sX = 0 - this.maxSpeed;
		}
	}
	if (Math.abs(_sY) > this.maxSpeed){
		if (_sY > 0){
			_sY = this.maxSpeed;
		} else {
			_sY = 0 - this.maxSpeed;
		}
	}

	_sX += (targSpeedX - _sX)/_smx;
	_sY += (targSpeedY - _sY)/_smy;
	_x += _sX;
	_y += _sY;

	this.speedX = _sX;
	this.speedY = _sY;
	this.x = _x;
	this.y = _y;
	this.vel = _vel;
	this.ang = _ang;

	particleLine(this)
}

const particleLine = (particle) => {
	var _x = particle.x;
	var _y = particle.y;
	var _oldX = particle.oldX;
	var _oldY = particle.oldY;
	ctx.lineWidth = 1;
	ctx.strokeStyle = particle.color;
  ctx.beginPath();
  ctx.moveTo(_oldX,_oldY);
  ctx.lineTo(_x,_y);
	ctx.closePath();
  ctx.stroke();
}

// Chooses Grayscale or color image
const setColor = (particle) => {
	if (grayScale){
		var gryV = Math.round(Math.random()*100);
		var gryA = (Math.random()*.35);
		particle.color = 'rgba('+gryV+','+gryV+','+gryV+','+gryA+')';
	} else {
		var colorTint = Math.round(Math.random() * 7);
		particle.colorTint = colorTint;
		_a = .55;
		if (colorTint <= 1){
			_r = 255;
			_g = 0;
			_b = 144;
			particle.color = 'rgba(255,0,144,'+_a+')';
		} else if (colorTint == 2){
			_r = 0;
			_g = 209;
			_b = 255;
			particle.color = 'rgba(0,209,255,'+_a+')';
		} else if (colorTint == 3){
			_r = 0;
			_g = 255;
			_b = 4;
			particle.color = 'rgba(0,255,4,'+_a+')';
		} else if (colorTint == 4){
			_r = 100;
			_g = 0;
			_b = 255;
			particle.color = 'rgba(100,0,255,'+_a+')';
		} else if (colorTint == 5){
			_r = 255;
			_g = 70;
			_b = 0;
			particle.color = 'rgba(255,70,0,'+_a+')';
		} else if (colorTint > 5){
			_r = 255;
			_g = 255;
			_b = 255;
			particle.color = 'rgba(255,255,255,'+_a+')';
		}
	}
}

const fadeAll = () => {
	ctx.fillStyle = `rgba(255, 255, 255, ${fadeRate})`
  ctx.beginPath()
  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.closePath()
  ctx.fill()
}

const onEventstart = (e) => {
	preventDefault(e)
	particles = []
	initParticleSystem(getEventCoordX(e), getEventCoordY(e))
	cancelAnimationFrame(nextFrameId)
	clearTimeout(eventEndTimeout)
	touchDown = true
	nextFrameId = requestAnimationFrame(draw)
}
const onEventMove = (e) => {
	preventDefault(e)
	if (touchDown) {
		cursorX = getEventCoordX(e)
		cursorY = getEventCoordY(e)
		particles.forEach((particle) => particle.draw())
	}
}
const onEventEnd = (e) => {
	eventEndTimeout = setTimeout(() => {
		touchDown = false
		particles = []
	}, 2000)
}

function init() {
	const ctCanvas = document.getElementById("canvas")
	ctCanvas.width = window.innerWidth
	ctCanvas.height = window.innerHeight
	ctCanvas.style.width = `${window.inner}px`
	ctCanvas.style.height = `${window.innerHeight}px`

	if ('ontouchstart' in window) {
		ctCanvas.addEventListener('touchstart', onEventstart)
		ctCanvas.addEventListener('touchmove', onEventMove)
		ctCanvas.addEventListener('touchend', onEventEnd)
	} else {
		ctCanvas.addEventListener('mousedown', onEventstart)
		ctCanvas.addEventListener('mousemove', onEventMove)
		ctCanvas.addEventListener('mouseup', onEventEnd)
	}
	ctx = document.getElementById('canvas').getContext('2d');
}

document.onreadystatechange = async() => {
  if (document.readyState === 'complete') {
    init()
  }
}
