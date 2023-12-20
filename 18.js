const fs = require('fs')
const args = process.argv.slice(2)

const rawdata = fs.readFileSync(args[0], 'utf8')
const lines = rawdata.split('\n')

const trenches = []
let digplan = []
lines.forEach(line => {
  const m = line.match(/(\w) (\d+) \((.*)\)/)
  if (m) {
    digplan.push({ d: m[1], n: parseInt(m[2]), col: m[3] })
  }
})
//console.table(digplan)
const countrows = []

const bounds = dig(digplan, trenches)
printTrenches(trenches, bounds)

const count = countInside(trenches, bounds)
printTrenches(trenches, bounds, countrows)

console.log('Del 1:', count)

function dig(digplan, trenches) {
  const pos = { x: 0, y: 0 }
  let minx = 0
  let miny = 0
  digplan.forEach(plan => {
    const heading = plan.d
    const n = plan.n
    const col = plan.col
    for (let i = 0; i < n; i++) {
      switch (heading) {
        case 'U':
          pos.y -= 1
          break
        case 'D':
          pos.y += 1
          break
        case 'L':
          pos.x -= 1
          break
        case 'R':
          pos.x += 1
          break
      }
      if (trenches[pos.y] === undefined) trenches[pos.y] = []
      trenches[pos.y][pos.x] = '#'
      minx = Math.min(minx, pos.x)
      miny = Math.min(miny, pos.y)
    }
  })
  return [minx, miny]
}

function countInside(trenches, bounds) {
  const minx = bounds[0]
  const miny = bounds[1]
  let count = 0
  const maxx = trenches.reduce((max, row) => Math.max(max, row.length), 0)
  for (let y = miny; y < trenches.length; y++) {
    let countit = 0
    let countrow = 0
    for (let x = minx; x < maxx; x++) {
      if( (trenches[y][x] === '#') && (trenches[y][x-1] != '#') ) {
        countit++
      }

      if (trenches[y][x] === '#') {
        count++
      } else if (countit % 2 != 0) {
        //console.log(y, x, countit, countrow)
        trenches[y][x] = 'X'
        count++
        countrow++
      }

    }
    //console.log(y, 'countrow', countrow)
    countrows[y] = countit
  }
  return count
}

function printTrenches(trenches) {
  const minx = bounds[0]
  const miny = bounds[1]
  const maxx = trenches.reduce((max, row) => Math.max(max, row.length), 0)
  for (let y = miny; y < trenches.length; y++) {
    let row = ''
    for (let x = minx; x < maxx; x++) {
      row += trenches[y][x] ? trenches[y][x] : '.'
    }
    console.log(row + ' ') // + countrows[y] != undefined ? countrows[y] : '0')
  }
}