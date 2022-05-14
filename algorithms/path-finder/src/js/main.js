import setDefaultDecimalDigits from 'js-math-and-ui-utils/mathUtils/setDefaultDecimalDigits'
import getRandomNumber from 'js-math-and-ui-utils/mathUtils/getRandomNumber'
import getEventCoordX from 'js-math-and-ui-utils/domUtils/getEventCoordX'
import getEventCoordY from 'js-math-and-ui-utils/domUtils/getEventCoordY'


let canvas, context
let tilesWidth, tilesHeight
const tileSize = 30
const mapData = []
const bgColor = '#ccc', wallColor = '#333', emptyColor = 'white', cursorColor = 'red'
const playerObj = {}
const wallTilesPercentage = 25


const init = () => {
  setDefaultDecimalDigits(0)
  canvas = document.querySelector('canvas')
  context = canvas.getContext('2d')
  tilesWidth = Math.trunc(window.innerWidth / tileSize)
  tilesHeight = Math.trunc(window.innerHeight / tileSize)
  canvas.width = tilesWidth * tileSize
  canvas.height = tilesHeight * tileSize
  canvas.addEventListener(('ontouchstart' in window) ? 'touchstart' : 'mousedown', onClick)

  // fill bg color
  context.fillStyle = bgColor
  context.fillRect(0, 0, canvas.width, canvas.height)

  for (let x = 0; x < tilesWidth; x++) {
    mapData[x] = []
    for (let y = 0; y < tilesHeight; y++) {
      if (getRandomNumber(100) < wallTilesPercentage) {
        mapData[x][y] = { x, y, type : 1 }
        fillTile(x, y, wallColor)
      } else {
        mapData[x][y] = { x, y, type : 0 }
        fillTile(x, y, emptyColor)
      }
    }
  }

  playerObj.x = getRandomNumber(tilesWidth)
  playerObj.y = getRandomNumber(tilesHeight)
  fillTile(playerObj.x, playerObj.y, cursorColor)
}

const fillTile = (x, y, color) => {
  context.fillStyle = color
  context.fillRect(x * tileSize + 1, y * tileSize + 1, tileSize - 2, tileSize - 2)
}

const onClick = (e) => {
  const x = Math.floor(getEventCoordX(e) / tileSize)
  const y = Math.floor(getEventCoordY(e) / tileSize)
  pathFinding(mapData, playerObj, mapData[x][y])
}

const pathFinding = (data, start, end) => {
  const openList = []
  const startObj = {}

  for (let x = 0; x < tilesWidth; x++) {
    for (let y = 0; y < tilesHeight; y++) {
      data[x][y].g = 0
      data[x][y].h = 0
      data[x][y].f = 0
      data[x][y].open = false
      data[x][y].checked = false
      data[x][y].parent = null
    }
  }

  startObj.parent = null
  startObj.g = 0
  startObj.h = getHur(startObj, end)
  startObj.f = startObj.g + startObj.h
  startObj.open = true
  startObj.x = start.x
  startObj.y = start.y
  openList.push(startObj)

  while (openList.length > 0) {
    const curNode = openList.pop()
    if (curNode.x === end.x && curNode.y === end.y) {
      let cur = curNode
      const path = []

      while (cur.parent) {
        path.push(cur)
        cur = cur.parent
      }

      path.push(cur)
      movePlayer(path.reverse(), 0)

      return true
    } else  {
      curNode.checked = true
      curNode.open = false
      const neighbors = getNeighbors(data, curNode)
      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i]
        if (neighbor.checked || neighbor.type !== 0) {
          continue
        }
        const gScore = curNode.g + 1
        let betterGScore = false
        if (!neighbor.open) {
          betterGScore = true
          neighbor.h = getHur(neighbor, end)
          neighbor.open = true
          openList.push(neighbor)
          openList.sort(sortByF)
        } else if (gScore < neighbor.g) {
          betterGScore = true
        }
        if (betterGScore) {
          neighbor.parent = curNode
          neighbor.g = gScore
          neighbor.f = neighbor.g + neighbor.h
          openList.sort(sortByF)
        }
      }
    }
  }
}

const getHur = (pos0, pos1) => {
  // This is the Manhattan distance
  const d1 = Math.abs (pos1.x - pos0.x)
  const d2 = Math.abs (pos1.y - pos0.y)
  return d1 + d2
}

const getNeighbors = (data, node) => {
  const ret = []
  const x = node.x, y = node.y

  if (data[x-1] && data[x-1][y]) {
    ret.push(data[x-1][y])
  }
  if (data[x+1] && data[x+1][y]) {
    ret.push(data[x+1][y])
  }
  if (data[x][y-1] && data[x][y-1]) {
    ret.push(data[x][y-1])
  }
  if (data[x][y+1] && data[x][y+1]) {
    ret.push(data[x][y+1])
  }
  return ret
}

const sortByF = (a, b) => {
  const aa = a.f
  const bb = b.f
  return ((aa < bb) ? 1 : ((aa > bb) ? -1 : 0))
}

const movePlayer = (data, step) => {
  step++
  if (step >= data.length) {
    return false
  }
  if (mapData[playerObj.x][playerObj.y].type === 1) {
    fillTile(playerObj.x, playerObj.y, wallColor)
  // } else {
  //   fillTile(playerObj.x, playerObj.y, emptyColor)
  }
  playerObj.x = data[step].x
  playerObj.y = data[step].y
  fillTile(playerObj.x, playerObj.y, cursorColor)
  requestAnimationFrame(() => {
    movePlayer(data, step)
  })
}

document.onreadystatechange = async() => {
  if (document.readyState === 'complete') {
    init()
  }
}
