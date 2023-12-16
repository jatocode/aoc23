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
beams[0] = { dir: 3, pos: {x:0,y:0}}

let prevtilecount = -1
while (beams.length > 0 && prevtilecount != tilecount.size) {
  prevtilecount = tilecount.size
  for (let i = 0; i < beams.length; i++) {
    const beam = beams[i]
    const pos = beam.pos
    const dir = beam.dir
    const next = nextPos(contraption, pos, dir)
    tilecount.add(pos.x + ',' + pos.y)

    if(!next) {
      beams.splice(i, 1)
      i--
      continue
    } else {
      const nextdir = nextDir(contraption, next, dir)
      if (nextdir.length == 2) {
        beams.push({dir: nextdir[1], pos: next})
      }
      beam.dir = nextdir[0]
      beam.pos = next
    }
  }
  if(tilecount.size == prevtilecount) {
    console.log('No more tiles energized', tilecount.size)
  }
}
console.log('Del 1:', tilecount.size)

function nextDir(contraption, nextpos, dir) {
  let next;
  switch (contraption[nextpos.y][nextpos.x]) {
    case '/':
      if(dir == 0) next = [3]
      if(dir == 1) next = [2]
      if(dir == 2) next = [1]
      if(dir == 3) next = [0]
      break
    case '\\':
      if(dir == 0) next = [2]
      if(dir == 1) next = [3]
      if(dir == 2) next = [0]
      if(dir == 3) next = [1]
      break
    case '-':
      if(dir == 2) next = [2]
      if(dir == 3) next = [3]
      next =  [2,3]
      break
    case '|':
      if(dir == 0) next = [0]
      if(dir == 1) next = [1]
      next =  [0,1]
      break
    default:
      next = [dir]
      break
  }
  return next
}

function nextPos(contraption, pos, dir) {
  const next = {x: pos.x, y: pos.y}
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