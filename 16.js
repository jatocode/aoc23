const fs = require('fs')
const args = process.argv.slice(2)

const rawdata = fs.readFileSync(args[0], 'utf8')
const lines = rawdata.split('\n')

let contraption = []
let tilecount = new Set()
lines.forEach(line => {
  contraption.push(line.trim().split(''))
})

// dir: N, S, W, E -> 0, 1, 2, 3
let beams = []
let tiles = []
beams[0] = { dir: 3, pos: { x: 0, y: 0 } }
let visited = new Set()
let steps = 0
while (beams.length > 0 && steps++ < 10000) {
  for (let i = 0; i < beams.length; i++) {
    const beam = beams[i]
    const pos = beam.pos
    const dir = beam.dir
    if (visited.has(pos.x + ',' + pos.y + '-' + dir)) {
      console.log('Stopping beam', pos.x + ',' + pos.y + '-' + dir)
      beams.splice(i, 1)
      i--
      continue
    }
    const next = nextPos(contraption, pos, dir)

    if (tiles[pos.y] == undefined) tiles[pos.y] = []
    tiles[pos.y][pos.x] = '#'

    tilecount.add(pos.x + ',' + pos.y)
    visited.add(pos.x + ',' + pos.y + '-' + dir)

    if (!next) {
      console.log('Removing beam', pos.x + ',' + pos.y + '-' + dir, beams.length)
      beams.splice(i, 1)
      i--
      continue
    } else {
      const nextdir = nextDir(contraption, next, dir)
      if (nextdir.length == 2) {
        beams.push({ pos: next, dir: nextdir[1] })
      }
      beam.dir = nextdir[0]
      beam.pos = next
    }
  }

}
//console.table(tiles)
console.log('Del 1:', tilecount.size, steps)

function nextDir(contraption, nextpos, dir) {
  let next;
  switch (contraption[nextpos.y][nextpos.x]) {
    case '/':
      if (dir == 0) next = [3]
      if (dir == 1) next = [2]
      if (dir == 2) next = [1]
      if (dir == 3) next = [0]
      break
    case '\\':
      if (dir == 0) next = [2]
      if (dir == 1) next = [3]
      if (dir == 2) next = [0]
      if (dir == 3) next = [1]
      break
    case '-':
      if (dir == 2) next = [2]
      if (dir == 3) next = [3]
      next = [2, 3]
      break
    case '|':
      if (dir == 0) next = [0]
      if (dir == 1) next = [1]
      next = [0, 1]
      break
    default:
      next = [dir]
      break
  }
  return next
}

function nextPos(contraption, pos, dir) {
  const next = { x: pos.x, y: pos.y }
  switch (dir) {
    case 0: next.y--; break
    case 1: next.y++; break
    case 2: next.x--; break
    case 3: next.x++; break
  }
  if (next.y < 0 || next.y >= contraption.length) {
    return false
  }
  if (next.x < 0 || next.x >= contraption[next.y].length) {
    return false
  }
  return next
}