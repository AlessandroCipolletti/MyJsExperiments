import { getRandomNumber, getNumberInBetween, getRandomRgbaColor } from './utils'


class Particle {
	constructor(x, y) {
		this.color = getRandomRgbaColor(getRandomNumber(0.1, 0.5, 10))
		this.x = x
		this.y = y
		this.oldX = x
		this.oldY = y
		this.width = 1
		this.speedModX = getRandomNumber(8, 28, 10)
		this.speedModY = getRandomNumber(8, 28, 10)
		this.speedModTargX = getRandomNumber(2, 5, 10)
		this.speedModTargY = getRandomNumber(2, 5, 10)
		this.maxSpeed = getRandomNumber(5, 25, 10)
		this.speedX = 0
		this.speedY = 0
	}

	update(cursorX, cursorY) {
		const targSpeedX = (cursorX - this.x) / this.speedModTargX
		const targSpeedY = (cursorY - this.y) / this.speedModTargY
		this.oldX = this.x
		this.oldY = this.y
		this.speedX = getNumberInBetween(-this.maxSpeed, this.speedX, this.maxSpeed)
		this.speedY = getNumberInBetween(-this.maxSpeed, this.speedY, this.maxSpeed)
		this.speedX += (targSpeedX - this.speedX) / this.speedModX
		this.speedY += (targSpeedY - this.speedY) / this.speedModY
		this.x += this.speedX
		this.y += this.speedY
	}
}

export default Particle
