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
console.table(digplan)

dig(digplan, trenches)
console.log('Del 1:', countInside(trenches))
printTrenches(trenches)

function dig(digplan, trenches) {
  const pos = { x: 0, y: 0 }
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
    }
  })
}

function countInside(trenches) {
  let count = 0
  const maxx = trenches.reduce((max, row) => Math.max(max, row.length), 0)
  for (let y = 0; y < trenches.length; y++) {
    let countit = 1
    let countrow = 0
    for (let x = 0; x < maxx; x++) {
      if (trenches[y][x] === '#') {
        countrow++
        count++
        countit++
      } else if (countit % 2 == 0) {
        console.log(y, x, countit, countrow)
        //trenches[y][x] = 'X'
        count++
        countrow++
      }

    }
    console.log(y, 'countrow', countrow)
  }
  return count
}

function printTrenches(trenches) {
  const maxx = trenches.reduce((max, row) => Math.max(max, row.length), 0)
  for (let y = 0; y < trenches.length; y++) {
    let row = ''
    for (let x = 0; x < maxx; x++) {
      row += trenches[y][x] ? '#' : '.'
    }
    console.log(row)
  }
}