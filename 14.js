const fs = require('fs')
const args = process.argv.slice(2)

const rawdata = fs.readFileSync(args[0], 'utf8')
const lines = rawdata.split('\n')

let rocks = []
let cache = new Map()
const dirmap = {N:0,S:1,W:2,E:3}
const dirs = [{x:0,y:-1},{x:0,y:1},{x:-1,y:0},{x:1,y:0}]

lines.forEach(line => {
  rocks.push(line.split(''))
})

rollRocks(rocks, 'N')
console.log('Del 1: ', calcLoad(rocks))

cache = new Map()
console.log('Del 2: ', calcLoad(part2(rocks, 1000000000)))

function part2(rocks, cycles) {
  for (let cycle = 1; cycle <= cycles; cycle++) {
    rollRocks(rocks, 'N')
    rollRocks(rocks, 'W')
    rollRocks(rocks, 'S')
    rollRocks(rocks, 'E')
    const rk = rocks.toString()
    if (cache.has(rk)) {
      const cyclestart = cache.get(rk)
      const cyclelength = cycle - cyclestart
      const remainingCycles = (cycles - cyclestart) % cyclelength;
      for (var i = 0; i < remainingCycles; i++) {
        rollRocks(rocks, 'N')
        rollRocks(rocks, 'W')
        rollRocks(rocks, 'S')
        rollRocks(rocks, 'E')
      }
      return rocks
    } else {
      cache.set(rk, cycle)
    }
  }
  return rocks
}

function calcLoad(rocks) {
  let load = 0
  for (let y = 0; y < rocks.length; y++) {
    const rocksonline = rocks[y].filter(r => r == 'O').length
    load += (rocks.length - y) * rocksonline
  }
  return load
}

function rollRocks(rocks, dir = 'N') {
  if (dir == 'N' || dir == 'W') {
    for (let y = 0; y < rocks.length; y++) {
      for (let x = 0; x < rocks[y].length; x++) {
        rollToStop(rocks, x,y ,dir)
      }
    }
  } else if (dir == 'S' || dir == 'E') {
    for (let y = rocks.length - 1; y >= 0; y--) {
      for (let x = rocks[y].length - 1; x >= 0; x--) {
        rollToStop(rocks, x,y ,dir)
      }
    }
  }
}

function rollToStop(rocks, x,y ,dir) {
  if(rocks[y][x] == 'O') {
    const [stopx, stopy] = stopPos(rocks, x,y,dir)
    rocks[y][x] = '.'
    rocks[stopy][stopx] = 'O'
  }
}

function stopPos(rocks, x,y, dir) {
  while(rocks[y+ dirs[dirmap[dir]].y] != undefined && 
        rocks[y + dirs[dirmap[dir]].y][x + dirs[dirmap[dir]].x] == '.') {
    x += dirs[dirmap[dir]].x
    y += dirs[dirmap[dir]].y
  }
  return [x,y]
}

function printRocks(rocks) {
  let numrocks = 0
  for (let y = 0; y < rocks.length; y++) {
    let row = ''
    for (let x = 0; x < rocks[y].length; x++) {
      row += rocks[y][x]
      if(rocks[y][x] == 'O') {
        numrocks++
      }
    }
    //  row += '     ' + (rocks.length - y)
    console.log(row)
  }
  console.log(numrocks)
}