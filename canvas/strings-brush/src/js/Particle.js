import getNumberInBetween from 'js-math-and-ui-utils/mathUtils/getNumberInBetween'
import getRandomNumber from 'js-math-and-ui-utils/mathUtils/getRandomNumber'
import roundNumber from 'js-math-and-ui-utils/mathUtils/roundNumber'
import getRandomRgbaColor from 'js-math-and-ui-utils/colorsUtils/getRandomRgbaColor'


class Particle {
  constructor(x, y) {
    this.color = getRandomRgbaColor(getRandomNumber(0.1, 0.5, 10))
    this.x = x
    this.y = y
    this.oldX = this.x
    this.oldY = this.y
    this.midX = this.x
    this.midY = this.y
    this.oldMidX = this.x
    this.oldMidY = this.y
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
    this.oldMidX = this.midX
    this.oldMidY = this.midY
    this.speedX = getNumberInBetween(-this.maxSpeed, this.speedX, this.maxSpeed)
    this.speedY = getNumberInBetween(-this.maxSpeed, this.speedY, this.maxSpeed)
    this.speedX += (targSpeedX - this.speedX) / this.speedModX
    this.speedY += (targSpeedY - this.speedY) / this.speedModY
    this.x = roundNumber(this.x + this.speedX, 2)
    this.y = roundNumber(this.y + this.speedY, 2)
    this.midX = roundNumber((this.oldX + this.x) / 2, 2)
    this.midY = roundNumber((this.oldY + this.y) / 2, 2)
  }
}

export default Particle
