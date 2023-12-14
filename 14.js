const fs = require('fs')
const args = process.argv.slice(2)

const rawdata = fs.readFileSync(args[0], 'utf8')
const lines = rawdata.split('\n')

let rocks = []
let cache = new Map()

lines.forEach(line => {
  rocks.push(line.split(''))
})

let rocks2 = [...rocks]

rollRocks(rocks, 'N')
console.log('Del 1: ', calcLoad(rocks))

cache = new Map()
rocks = [...rocks2]
part2(1000000000)
console.log('Del 2: ', calcLoad(rocks))

function part2(cycles) {
  for (let cycle = 1; cycle <= cycles; cycle++) {
    rollRocks(rocks, 'N')
    rollRocks(rocks, 'W')
    rollRocks(rocks, 'S')
    rollRocks(rocks, 'E')

    const rk = rocks.toString()
    if (cache.has(rk)) {
      const cyclestart = cache.get(rk)
      const cyclelength = cycle - cyclestart
      console.log('Cache hit at cycle', cycle, cyclestart, 'length', cyclelength)

      // Borde kunna räkna ut hur många cykler som är kvar?!? Eller?
      const remaining = (cycles - cyclestart) % cyclelength
      cycle += remaining * cyclelength

      // const remainingCycles = (cycles - cyclestart) % cyclelength;
      // for (var i = 0; i < remainingCycles; i++) {
      //   rollRocks(rocks, 'N')
      //   rollRocks(rocks, 'W')
      //   rollRocks(rocks, 'S')
      //   rollRocks(rocks, 'E')
      //   return rocks
      // }

    } else {
      cache.set(rk, cycle)
    }
  }
  return rocks
}


function calcLoad(rocks) {
  let load = 0
  for (let y = 0; y < rocks.length; y++) {
    for (let x = 0; x < rocks[y].length; x++) {
      if (rocks[y][x] == 'O') {
        load += (rocks.length - y)
      }
    }
  }
  return load
}

function rollRocks(rocks, dir = 'N') {
  if (dir == 'N' || dir == 'W') {
    for (let y = 0; y < rocks.length; y++) {
      for (let x = 0; x < rocks[y].length; x++) {
        rollRock(x, y, dir)
      }
    }
  } else if (dir == 'S' || dir == 'E') {
    for (let y = rocks.length - 1; y >= 0; y--) {
      for (let x = rocks[y].length - 1; x >= 0; x--) {
        rollRock(x, y, dir)
      }
    }
  }
}

function rollRock(x, y, dir) {
  const [posx, posy] = overPos(x, y, dir)
  if (rocks[posy] == undefined) {
    return [x, y]
  }
  if (rocks[y][x] == 'O') {
    const next = rocks[posy][posx]
    switch (next) {
      case 'O':
        return [x, y]
      case '.':
        rocks[posy][posx] = 'O'
        rocks[y][x] = '.'
        return rollRock(posx, posy, dir)
      case '#':
        return [x, y]
      default:
        return [x, y]
    }
  }
}

function overPos(x, y, dir) {
  switch (dir) {
    case 'N':
      return [x, y - 1]
    case 'S':
      return [x, y + 1]
    case 'W':
      return [x - 1, y]
    case 'E':
      return [x + 1, y]
    default:
      console.error('Unknown dir', dir)
  }
}

function printRocks(rocks) {
  for (let y = 0; y < rocks.length; y++) {
    let row = ''
    for (let x = 0; x < rocks[y].length; x++) {
      row += rocks[y][x]
    }
    //  row += '     ' + (rocks.length - y)
    console.log(row)
  }
  console.log()
}