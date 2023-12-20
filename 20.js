const fs = require('fs')
const args = process.argv.slice(2)

const rawdata = fs.readFileSync(args[0], 'utf8')
const lines = rawdata.split('\n')

let data = []
let broadcast = []
for(let i = 0; i < lines.length; i++) {
  const line = lines[i]
  if(line.startsWith('broadcast')) {
    broadcast = line.split('>')[1].split(',').map(d => d.trim())
  }
  const m = line.match(/([\%\&])(\w+) -> (.*)/)
  if (m) {
    const dest = m[3].split(',').map(d => d.trim())
    console.log(m[3], dest)
    data.push({module: m[2], op:m[1], dest})
  }
}
console.log(broadcast)
console.log(data)