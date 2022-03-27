import { round } from './utils'


class Particle {
	constructor(screenWidth, screenHeight, centerX, centerY, hueBase) {
    this.x = 0
    this.y = 0
    this.oldX = this.x
    this.oldY = this.y
    this.midX = this.x
    this.midY = this.y
    this.oldMidX = this.midX
    this.oldMidY = this.midY
    this.colorH = 0
    this.colorS = 0
    this.colorL = 0
    this.colorA = 0
    this.colorString = ''

    this.reset(screenWidth, screenHeight, centerX, centerY, hueBase)
	}

	update(angle, step) {
    this.oldX = this.x
    this.oldY = this.y
    this.oldMidX = this.midX
    this.oldMidY = this.midY
    this.x = round(this.x + Math.cos(angle) * step, 2)
    this.y = round(this.y + Math.sin(angle) * step, 2)
    this.midX = round((this.oldX + this.x) / 2, 2)
    this.midY = round((this.oldY + this.y) / 2, 2)

    if (this.colorA < 1) {
      this.colorA += 0.003
      this.updateColorString()
    }
	}

  reset(screenWidth, screenHeight, centerX, centerY, hueBase) {
    this.x = screenWidth * Math.random()
    this.y = screenHeight * Math.random()
    this.oldX = this.x
    this.oldY = this.y
    this.midX = this.x
    this.midY = this.y
    this.oldMidX = this.midX
    this.oldMidY = this.midY
    this.colorH = hueBase + Math.atan2(centerY - this.y, centerX - this.x) * 180 / Math.PI
    this.colorS = 1
    this.colorL = 0.5
    this.colorA = 0
    this.updateColorString()
  }

  updateColorString() {
    this.colorString = `hsla(${this.colorH}, ${this.colorS * 100}%, ${this.colorL * 100}%, ${this.colorA})`
  }
}

export default Particle
