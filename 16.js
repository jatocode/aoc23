const fs = require('fs')
const args = process.argv.slice(2)

const rawdata = fs.readFileSync(args[0], 'utf8')
const lines = rawdata.split('\n')

let contraption = []
lines.forEach(line => {
  contraption.push(line.trim().split(''))
})

// dir: N, S, W, E -> 0, 1, 2, 3
let beams = []
beams[0] = { dir: 3, pos: { x: -1, y: 0 } }

const count = energize(beams)
console.log('Del 1:', count) 
console.log('Del 2:', findBestEntry())

function findBestEntry() {
  let best = 0
  let bestpos = { x: -1, y: 0 }
  // E
  for (let y = 0; y < contraption.length; y++) {
    const count = energize([{ dir: 3, pos: { x: -1, y: y } }])
    if (count > best) {
      best = count
      bestpos = { x: -1, y: y }
    }
  }
  // W
  for (let y = 0; y < contraption.length; y++) {
    const count = energize([{ dir: 2, pos: { x: contraption.length, y: y } }])
    if (count > best) {
      best = count
      bestpos = { x: -1, y: y }
    }
  }
  // S
  for (let x = 0; x < contraption.length[0]; x++) {
    const count = energize([{ dir: 1, pos: { x: x, y: -1 } }])
    if (count > best) {
      best = count
      bestpos = { x: -1, y: y }
    }
  }
  // N
  for (let x = 0; x < contraption.length[0]; x++) {
    const count = energize([{ dir: 1, pos: { x: x, y: contraption.length + 1 } }])
    if (count > best) {
      best = count
      bestpos = { x: -1, y: y }
    }
  }
  return [best,bestpos]
}

function energize(beams) {
  let tilecount = new Set()
  let visited = new Set()
  while (beams.length > 0) {
    for (let i = 0; i < beams.length; i++) {
      const beam = beams[i]
      const pos = beam.pos
      const dir = beam.dir
      if (visited.has(pos.x + ',' + pos.y + '-' + dir)) {
        beams.splice(i, 1)
        continue
      }
      const next = nextPos(contraption, pos, dir)
      if (pos.x != undefined && pos.y != undefined) {
        tilecount.add(pos.x + ',' + pos.y)
        visited.add(pos.x + ',' + pos.y + '-' + dir)
      }

      if (!next) {
        beams.splice(i, 1)
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
  return tilecount.size -1 // Räkna inte med startpositionen
}

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
  // if (pos.x == undefined && pos.y == undefined) {
  //   return { x: 0, y: 0 }
  // }
  const next = { x: pos.x, y: pos.y }
  switch (dir) {
    case 0: next.y--; break
    case 1: next.y++; break
    case 2: next.x--; break
    case 3: next.x++; break
  }
  if (contraption[next.y] == undefined || !contraption[next.y][next.x]) {
    return false
  }

  return next
}