const fs = require('fs')
const args = process.argv.slice(2)

const rawdata = fs.readFileSync(args[0], 'utf8')
const lines = rawdata.split('\n')

let mirrors = []
let patterns = []
lines.forEach(line => {
  if (line === '') {
    patterns.push(mirrors)
    mirrors = []
  } else {
    mirrors.push(line.split(''))
  }
})
patterns.push(mirrors)

let tot = 0
patterns.forEach((pattern,i) => {
  // Skulle kunna refaktoriseras till en funktion men orkar inte
  const v = vertMirror(pattern)
  const h =  horizMirror(pattern)
  tot += v + h * 100
})
console.log('Del 1:', tot)

function horizMirror(pattern) {
  for (let i = 0; i < pattern.length; i++) {
    let errors = 0
    for (let j = 0; j < pattern.length; j++) {
      const p = i - j
      const n = i + j + 1

      if (p < 0 || n >= pattern.length) break

      let line = pattern[p] ? pattern[p].join('') : undefined
      let nextline = pattern[n] ? pattern[n].join('') : undefined
      if (line !== nextline) {
        errors++
        break
      }
    }
    if (i < pattern.length - 1 && errors == 0) {
      return i+1
    }
  }
  return 0
}

function vertMirror(pattern) {
  for (let i = 0; i < pattern[0].length; i++) {
    let errors = 0
    for (let j = 0; j < pattern[0].length; j++) {
      const p = i - j
      const n = i + j + 1

      if (p < 0 || n >= pattern[0].length) break

      let line = pattern.reduce((acc, row) => acc + row[p], '')
      let nextline = pattern.reduce((acc, row) => acc + row[n], '')
      if (line !== nextline) {
        errors++
        break
      }
    }
    if (i < pattern[0].length-1 && errors == 0) {
      return i+1
    }
  }
  return 0
}
