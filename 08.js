const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

const instructions = lines[0].split('')

let map = new Map()
for(let i = 2; i < lines.length; i++) {
    const m = lines[i].match(/(\w+) = \((\w+), (\w+)\)/)
    if(m) map.set(m[1], {R: m[2], L: m[3]})
}

const end = 'ZZZ'
let next = 'AAA'
let step = 0
while (next != end) {
    const inst = instructions[step++ % instructions.length]
    console.log(next, inst)
    const current = map.get(next)
    if(inst === 'R') next = current.R
    else if(inst === 'L') next = current.L
}

console.log('Del 1:', step)