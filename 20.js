const fs = require('fs')
const args = process.argv.slice(2)

const rawdata = fs.readFileSync(args[0], 'utf8')
const lines = rawdata.split('\n')

let data = []
let broadcastmodule = { module: 'broadcast', dest: [], mem: new Map() }
for (let i = 0; i < lines.length; i++) {
  const line = lines[i]
  if (line.startsWith('broadcast')) {
    broadcastmodule.dest = line.split('>')[1].split(',').map(d => d.trim())
  }
  const m = line.match(/([\%\&])(\w+) -> (.*)/)
  if (m) {
    const dest = m[3].split(',').map(d => d.trim())
    data.push({ module: m[2], op: m[1], dest, val: 0, mem: new Map() })
  }
}
pushButton()

function pushButton() {
  sendPulse(0, broadcastmodule)
  data.forEach(m => {
    sendPulse(m.val, m)
  })
  console.table(data)
}

function sendPulse(pulse, module) {
  const dest = module.dest
  console.log(module.module, ' ' + pulse == 0 ? '-low-' : '-high-' + ' -> ', dest)
  dest.forEach(d => {
    const destm = data.find(m => m.module === d)
    if (destm) {
      const val = module.val
      switch (destm.op) {
        case '%':
          destm.val = flipflop(pulse, val)
          updateMem(destm, module, val)
          sendPulse(destm.val, destm)
          break
        case '&':
          updateMem(destm, module, val)
          const output = conjunction(val, module)
          break
      }
    }
  })
}

function updateMem(destmodule, module, val) {
  if(module.module === 'broadcast') return
  console.log('updatemem', destmodule.module, module.module, val)
  destmodule.mem.set(module.module, val)
}

function conjunction(val, m) {
  console.log('conjunction', m.module)

}

function flipflop(pulse, val) {
  if (pulse === 0) {
    return val === 0 ? 1 : 0
  }
  return val
}