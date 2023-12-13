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
  const v = vertMirror(pattern)
  const h =  horizMirror(pattern)
  tot += v + h * 100
})
console.log('Del 1:', tot)

function horizMirror(pattern) {
  let mirror = 0
  for (let i = 0; i < pattern.length; i++) {
    mirror = 0
    for (let j = 0; j < pattern.length; j++) {
      const p = i - j
      const n = i + j + 1

      if (p < 0 || n >= pattern.length) break

      let line = pattern[p] ? pattern[p].join('') : undefined
      let nextline = pattern[n] ? pattern[n].join('') : undefined
      //console.log(p + 1, n + 1, line, nextline)
      if (line !== nextline) {
        mirror = 0
        break
      }
      mirror++
    }
    if (mirror > 1) {
      return i+1
    }
  }
  return 0
}

function vertMirror(pattern) {
  let mirror = 0
  for (let i = 0; i < pattern[0].length; i++) {
    mirror = 0
    for (let j = 0; j < pattern[0].length; j++) {
      const p = i - j
      const n = i + j + 1

      if (p < 0 || n >= pattern.length) break

      let line = pattern.reduce((acc, row) => acc + row[p], '')
      let nextline = pattern.reduce((acc, row) => acc + row[n], '')
      //console.log('v', p + 1, n + 1, line, nextline)
      if (line !== nextline) {
        mirror = 0
        break
      }
      mirror++
    }
    if (mirror > 1) {
      return i+1
    }
  }
  return 0
}
