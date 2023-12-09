const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let total = 0
lines.forEach(line => {
  const seq = line.split(' ').map(x => parseInt(x))
  total += nextNumber(seq)
})

console.log('Del 1: ' + total)

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
