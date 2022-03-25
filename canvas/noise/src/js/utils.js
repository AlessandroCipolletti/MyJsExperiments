const MATH = Math

export const preventDefault = (e) => {
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }
}

export const getEventCoordX = (e = { clientX: 0 }, offset = 0) => {// e = event || touches
  if (e instanceof Array) {
    return round((e[0].clientX - (offset || 0)), 1)
  } else if (e.touches && e.touches[0]) {
    return round((e.touches[0].clientX - (offset || 0)), 1)
  } else if (e.changedTouches && e.changedTouches[0]) {
    return round((e.changedTouches[e.changedTouches.length - 1].clientX - (offset || 0)), 1)
  } else {
    return round(((e.clientX >= 0 ? e.clientX : e.pageX) - (offset || 0)), 1)
  }
}

export const getEventCoordY = (e = { clientY: 0 }, offset = 0) => { // e = event || touches
  if (e instanceof Array) {
    return round((e[0].clientY - (offset || 0)), 1)
  } else if (e.touches && e.touches[0]) {
    return round((e.touches[0].clientY - (offset || 0)), 1)
  } else if (e.changedTouches && e.changedTouches[0]) {
    return round((e.changedTouches[e.changedTouches.length - 1].clientY - (offset || 0)), 1)
  } else {
    return round(((e.clientY >= 0 ? e.clientY : e.pageY) - (offset || 0)), 1)
  }
}

export const round = (n, decimals = 0) => {
  const m = decimals ? MATH.pow(10, decimals) : 1
  return MATH.round(n * m) / m
}

export const getRandomNumber = (min = 0, max = 0, decimals = 0) => round((MATH.random() * (max - min)) + min, decimals)

export const getNumberInBetween = (a, b, c, decimals = 10) => round([a, b, c].sort(arrayOrderNumberUp)[1], decimals)

export const arrayOrderNumberUp = (a, b) => a - b
export const arrayOrderNumberDown = (a, b) => b - a

export const getRandomRgbaColor = (alpha = false) => {
  if (alpha === false) alpha = 1
  else if (alpha === true) alpha = 0.7
  else if (typeof(alpha) !== 'number') alpha = 1

  return `rgba(${getRandomNumber(0, 255)}, ${getRandomNumber(0, 255)}, ${getRandomNumber(0, 255)}, ${alpha})`
}
