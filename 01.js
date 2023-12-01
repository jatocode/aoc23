const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let tot = 0 
lines.forEach(x => {
    const first = x.split('').find(x => parseInt(x))
    const rev = x.split('').reverse()
    const second = rev.find(x => parseInt(x))
    const num = (first + "") + (second + "")
    tot += parseInt(num)
})
console.log('Del 1: ' + tot)