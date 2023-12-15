const fs = require('fs')
const args = process.argv.slice(2)

const rawdata = fs.readFileSync(args[0], 'utf8')
const lines = rawdata.split('\n')

let springs = []
lines.forEach(line => {
  const [c, groups] = line.split(' ')
  springs.push({ condition: c, groups: groups.split(',').map(g => parseInt(g)) })
})

springs.forEach(spring => {
  const variants = createVariant(spring.condition, spring.groups.length, new Map())
  spring.matches = variants.get(spring.groups.map(g => g.toString()).join('-'))
})
console.log('Del 1: ', springs.reduce((acc, spring) => acc + spring.matches, 0))

function createVariant(condition, numGroups, variants) {
  const unknown = condition.match(/\?{1}/)
  if (!unknown || unknown.index == undefined) {
    return variants
  }

  let brokena = [...condition]
  let wholea = [...condition]
  brokena.splice(unknown.index, 1, '.')
  wholea.splice(unknown.index, 1, '#')
  const broken = brokena.join('')
  const whole = wholea.join('')

  if (broken.includes('?')) {
    createVariant(broken, numGroups, variants)
  } else {
    const m = broken.match(/#+/g);
    if (m != undefined && m.length == numGroups) {
      const key = m.map(g => g.length).join('-')
      if (variants.has(key)) {
        const n = variants.get(key)
        variants.set(key, n + 1)
      } else {
        variants.set(key, 1)
      }
    }
  }

  if (whole.includes('?')) {
    createVariant(whole, numGroups, variants)
  } else {
    const m = whole.match(/#+/g);
    if (m != undefined && m.length == numGroups) {
      const key = m.map(g => g.length).join('-')
      if (variants.has(key)) {
        const n = variants.get(key)
        variants.set(key, n + 1)
      } else {
        variants.set(key, 1)
      }
    }
  }

  return variants
}

