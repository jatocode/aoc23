const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let total = 0
let total2 = 0

lines.forEach(line => {
  const seq = line.split(' ').map(x => parseInt(x))
  const seqr = line.split(' ').map(x => parseInt(x)).reverse()
  total += nextNumber(seq)
  total2 += nextNumber(seqr)
})

console.log('Del 1: ' + total)
console.log('Del 2: ' + total2)

function nextNumber(sequence) {
  const diffs = getDiffs(sequence)
  if (diffs.every(x => x == 0)) {
    return sequence[sequence.length - 1]
  }
  return sequence[sequence.length - 1] + nextNumber(diffs)
}

function getDiffs(sequence) {
  let diffseq = []
  for (let i = 0; i < sequence.length - 1; i++) {
    diffseq[i] = sequence[i + 1] - sequence[i]
  }
  return diffseq
}
