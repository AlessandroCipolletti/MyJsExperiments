const MATH = Math

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

export const getRandomNumber = (max, min = 0, decimals = 0) => round((MATH.random() * (max - min)) + min, decimals)
