const fs = require('fs')
const args = process.argv.slice(2)

const rawdata = fs.readFileSync(args[0], 'utf8')
const lines = rawdata.split('\n')

let initseq = []
lines.forEach(line => {
  initseq = initseq.concat(line.split(','))
})

let hashes = []
initseq.forEach(seq => {
  const h = hash(seq)
  //console.log(seq, h)
  hashes.push(h)
});

console.log('Del 1: ', hashes.reduce((a, b) => a + b, 0)) 
function hash(seq) {
  let h = 0
  for (let i = 0; i < seq.length; i++) {
    h += seq.charCodeAt(i)
    h *= 17
    h %= 256
  }
  return h
}