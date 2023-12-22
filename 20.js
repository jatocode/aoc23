const fs = require('fs')
const args = process.argv.slice(2)

const rawdata = fs.readFileSync(args[0], 'utf8')
const lines = rawdata.split('\n')

let data = []
const broadcastmodule = { name: 'broadcast', dest: [], mem: new Map() }
data.push(broadcastmodule)
let pulses = []
let lowpulse = 0
let highpulse = 0

for (let i = 0; i < lines.length; i++) {
  const line = lines[i]
  if (line.startsWith('broadcast')) {
    broadcastmodule.dest = line.split('>')[1].split(',').map(d => d.trim())
  }
  const m = line.match(/([\%\&])(\w+) -> (.*)/)
  if (m) {
    const dest = m[3].split(',').map(d => d.trim())
    data.push({ name: m[2], op: m[1], dest, val: 0, mem: new Map() })
  }
}

for (let i = 0; i < 1000; i++) {
  pushButton()
}
console.log('lowpulse', lowpulse)
console.log('highpulse', highpulse)
console.log('Del 1:', (lowpulse ) * (highpulse ))

function pushButton() {
  pulses.push({ dest: 'broadcast', pulse: 0 })
  lowpulse++
  while (pulses.length > 0) {
    const pulse = pulses.shift()
    const module = data.find(m => m.name === pulse.dest)
    if (module) {
      generatePulses(pulse.pulse, module)
    }
  }
}

function generatePulses(pulse, module) {
  let output = undefined
  let sendpulse = false
  if (module.name === 'broadcast') {
    output = 0
    sendpulse = true
  }

  switch (module.op) {
    case '%':
      if (pulse == 0) {
        output = flipflop(pulse, module.val)
        module.val = output
        sendpulse = true
      }
      break
    case '&':
      output = conjunction(module)
      module.val = output
      sendpulse = true
      break
  }

  if (sendpulse) {
    module.dest.forEach(d => {
      //console.log(module.name, ' ' + output == 0 ? '-low-' : '-high-' + ' -> ', d)
      updateMem(d, module, output)
      pulses.push({ dest: d, pulse: output })
      lowpulse += output === 0 ? 1 : 0
      highpulse += output === 1 ? 1 : 0
    })
  }
}

function updateMem(destname, module, val) {
  if (destname === 'broadcast') return
  const destmodule = data.find(m => m.name === destname)
  if (!destmodule) return
  destmodule.mem.set(module.name, val)
}

function conjunction(module) {
  if (module.mem.size === 0) {
    return 1
  }
  const allone = Array.from(module.mem.values()).every(v => v === 1)
  return allone ? 0 : 1
}

function flipflop(pulse, val) {
  if (pulse === 0) {
    return val === 0 ? 1 : 0
  }
  return val
}