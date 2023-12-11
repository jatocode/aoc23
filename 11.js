const fs = require('fs')
const { get } = require('http')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let universe = []
lines.forEach(line => {
  universe.push(line.split(''))
})

printUniverse(universe)
let xexpands = []
for(let x = 0 ; x < universe[0].length; x++) {
  let xline = ''
  for(let y = 0 ; y < universe.length; y++) {
    xline += universe[y] == undefined ? '.' : universe[y][x]
    if(universe[y][x] === '#') {
      break
    }
  }
  const xexpand = xline.indexOf('#') == -1
  if(xexpand) xexpands.push(x)
}

let expanded = []
for (let y = 0; y < universe.length; y++) {
  const yexpand = universe[y].find((e) => e === '#') == undefined
  // om vi får expandera i y-led, skjut in en extra tomrad, annars bara originalraden
  const expandedx = expandx(universe[y], xexpands)
  expanded.push(expandedx)
  if(yexpand) expanded.push(expandedx)
}
const galaxies = countGalaxies(expanded)
const galaxypairs = getPairs(galaxies)
printUniverse(expanded)
const total = galaxypairs.reduce((acc, pair) => acc + getDistance(pair[0], pair[1]), 0)

console.log('Del 1:', total)

function expandx(line, xexpands) {
  let newline = [...line]
  xexpands.forEach((xp,i) => {
    newline.splice(xp + i, 0, '.')
  })
  //console.log(line.join(''), '->', newline.join(''), line.length, newline.length)
  return newline
}

function getDistance(galaxy1, galaxy2) {
  let gx1 = galaxies[galaxy1]
  let gx2 = galaxies[galaxy2]
  return Math.abs(gx1.x - gx2.x) + Math.abs(gx1.y - gx2.y)
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
  let galaxy = 1
  for(let y = 0 ; y < universe.length; y++) {
    for(let x = 0 ; x < universe[y].length; x++) {
      if(universe[y][x] === '#') {
        universe[y][x] = galaxy++
        galaxies.push({x, y})
      }
    }
  }
  console.table(galaxies)
  return galaxies
}

function printUniverse(universe) {
  universe.forEach(row => {
    console.log(row.join(''))
  })
  console.log()
}