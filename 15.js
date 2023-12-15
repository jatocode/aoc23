const fs = require('fs')
const args = process.argv.slice(2)

const rawdata = fs.readFileSync(args[0], 'utf8')
const lines = rawdata.split('\n')

let initseq = []
lines.forEach(line => {
  initseq = initseq.concat(line.split(','))
})

let hashes = []
let boxes = []
initseq.forEach(seq => {
  const hn = hash(seq)
  hashes.push(hn)
  let op = ''
  let label = ''
  let focal = 0
  if (seq.includes('=')) {
    op = '='
    const [l, f] = seq.split('=')
    label = l
    focal = parseInt(f)
  }
  if (seq.includes('-')) {
    op = '-'
    label = seq.split('-')[0]
  }
  const box = hash(label)
  if (boxes[box] === undefined) boxes[box] = []
  switch (op) {
    case '=': {
      const found = boxes[box].find(slot => slot.label === label)
      if (found !== undefined) {
        found.focal = focal
      } else {
        boxes[box].push({ label, focal })
      }
      break
    }
    case '-': {
      found = boxes[box].find(slot => slot.label === label)
      if (found !== undefined) {
        boxes[box].splice(boxes[box].indexOf(found), 1)
      }
      break
    }
  }
});

console.log('Del 1: ', hashes.reduce((a, slot) => a + slot, 0))
console.log('Del 2: ', boxtotals(boxes))

function boxtotals(boxes) {
  return boxes.reduce((tot, slot, bi) => tot + (slot.reduce((tf,slot,si) => tf + (bi+1) * (slot.focal * (si+1)), 0)), 0)
}

function hash(seq) {
  let h = 0
  for (let i = 0; i < seq.length; i++) {
    h += seq.charCodeAt(i)
    h *= 17
    h %= 256
  }
  return h
}