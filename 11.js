const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let universe = []
lines.forEach(line => {
  universe.push(line.split(''))
})

const expands = expandUniverse(universe)
const galaxies = countGalaxies(universe)
const galaxypairs = getPairs(galaxies)

const total = galaxypairs.reduce((acc, pair) => acc + getDistance(pair[0], pair[1], expands), 0)
console.log('Del 1:', total)

const total2 = galaxypairs.reduce((acc, pair) => acc + getDistance(pair[0], pair[1], expands, 1000000 - 1), 0)
console.log('Del 2:', total2)

function expandUniverse(universe) {
  let xexpands = []
  for (let x = 0; x < universe[0].length; x++) {
    let empty = true
    for (let y = 0; y < universe.length; y++) {
      if (universe[y][x] === '#') {
        empty = false
        break
      }
    }
    if(empty) xexpands.push(x)
  }
  let yexpands = []
  for (let y = 0; y < universe.length; y++) {
    const yexpand = universe[y].find((e) => e === '#') == undefined
    if (yexpand) yexpands.push(y)
  }

  return [xexpands, yexpands]
}

function getDistance(galaxy1, galaxy2, expandlist, expandsize = 1) {
  let gx1 = galaxies[galaxy1]
  let gx2 = galaxies[galaxy2]

  let minx = Math.min(gx1.x, gx2.x)
  let maxx = Math.max(gx1.x, gx2.x)
  let miny = Math.min(gx1.y, gx2.y)
  let maxy = Math.max(gx1.y, gx2.y)

  // Hitta hur många expansions mellan galaxerna
  const xe = expandlist[0].filter(e => e > minx && e < maxx).length
  const ye = expandlist[1].filter(e => e > miny && e < maxy).length
  const expands = xe + ye

  let dist = Math.abs(gx1.x - gx2.x) + Math.abs(gx1.y - gx2.y)

  // Och lägg till expansionsstorleken
  return dist + (expands * expandsize)
}

function getPairs(galaxies) {
  let pairs = []
  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      pairs.push([i, j]);
    }
  }
  return pairs
}

function countGalaxies(universe) {
  let galaxies = []
  for (let y = 0; y < universe.length; y++) {
    for (let x = 0; x < universe[y].length; x++) {
      if (universe[y][x] === '#') {
        galaxies.push({ x, y })
      }
    }
  }
  return galaxies
}
