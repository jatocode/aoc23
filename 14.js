const fs = require('fs')
const args = process.argv.slice(2)

const rawdata = fs.readFileSync(args[0], 'utf8')
const lines = rawdata.split('\n')

let rocks = []
lines.forEach(line => {
  rocks.push(line.split(''))
})
printRocks(rocks)

for (let cycle = 1; cycle < 4; cycle++) {
  rollRocks(rocks, 'N')
  rollRocks(rocks, 'W')
  rollRocks(rocks, 'S')
  rollRocks(rocks, 'E')
  console.log('After cycle', cycle)
  printRocks(rocks)
}

console.log('Del 1: ', calcLoad(rocks))

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
  if (dir == 'N' ) {
    for (let y = 0; y < rocks.length; y++) {
      for (let x = 0; x < rocks[y].length; x++) {
        rollRock(x, y, dir)
      }
    }
  } else if (dir == 'S') {
    for (let y = rocks.length - 1; y >= 0; y--) {
      for (let x = 0; x < rocks[y].length; x++) {
        rollRock(x, y, dir)
      }
    }
  } else if (dir == 'W') {
    for (let y = 0; y < rocks.length; y++) {
      for (let x = 0; x < rocks[y].length; x++) {
        rollRock(x, y, dir)
      }
    }
  } else if (dir == 'E') {
    for (let y = 0; y < rocks.length; y++) {
      for (let x = rocks[y].length - 1; x >= 0; x--) {
        rollRock(x, y, dir)
      }
    }
  }
}

function rollRock(x, y, dir) {
  //console.log('Rolling rock in dir', dir, x, y)
  const [posx, posy] = overPos(x, y, dir)

  if (rocks[posy] == undefined) {
    return [x, y]
  }
  if (rocks[y][x] == 'O') {
    const next = rocks[posy][posx]
    //console.log('Rolling rock in dir',dir, x, y, 'to', posx, posy, 'next', next)
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
    row += '     ' + (rocks.length - y)
    console.log(row)
  }
  console.log()
}