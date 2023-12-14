const fs = require('fs')
const args = process.argv.slice(2)

const rawdata = fs.readFileSync(args[0], 'utf8')
const lines = rawdata.split('\n')

let rocks = []
lines.forEach(line => {
  rocks.push(line.split(''))
})
printRocks(rocks)
shiftNorth(rocks)
printRocks(rocks)
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

function shiftNorth(rocks) {
  for (let y = 0; y < rocks.length; y++) {
    for (let x = 0; x < rocks[y].length; x++) {
        rollRock(x,y)
    }
  }
}

function rollRock(x,y) {
  if(rocks[y-1] == undefined) {
    return [x,y]
  }
  if (rocks[y][x] == 'O') {
    const over = rocks[y-1][x]
    switch (over) {
      case 'O':
        return [x,y]
      case '.':
        rocks[y-1][x] = 'O'
        rocks[y][x] = '.'
        return rollRock(x,y-1)
      case '#':
        return [x,y]
    } 
  }
}

function printRocks(rocks) {
  console.log('----------------------')
  for (let y = 0; y < rocks.length; y++) {
    let row = ''
    for (let x = 0; x < rocks[y].length; x++) {
      row += rocks[y][x]
    }
    console.log(row)
  }
}