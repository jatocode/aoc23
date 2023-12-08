const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

const instructions = lines[0].split('')

let map = new Map()
for (let i = 2; i < lines.length; i++) {
    const m = lines[i].match(/(\w+) = \((\w+), (\w+)\)/)
    if (m) map.set(m[1], { L: m[2], R: m[3] })
    else console.log('error', lines[i])
}

let part1 = ['AAA']
console.log('Del 1:', goToEnd(part1))
let part2 = [...map.entries()].filter(e => e[0].endsWith('A')).map(e => e[0])
console.log('Del 2:', leastCommonMultiple(goToEnd(part2)))

function goToEnd(next) {
    let steps = []
    for (let n = 0; n < next.length; n++) {
        let step = 0
        while (!next[n].endsWith('Z')) {
            const inst = instructions[step++ % instructions.length]
            const current = map.get(next[n])
            if (inst === 'R') next[n] = current.R
            else if (inst === 'L') next[n] = current.L
        }
        steps.push(step)
    }
    return steps
}

// Orkade inte skriva egen, lånade från nätet
function leastCommonMultiple(arr) {
    function gcd(a, b) {
      return !b ? a : gcd(b, a % b);
    }
    function lcm(a, b) {
      return (a * b) / gcd(a, b);
    }
    var multiple = arr[0];
    for (var i = 1; i < arr.length; i++) {
      multiple = lcm(multiple, arr[i]);
    }
    return multiple;
  }