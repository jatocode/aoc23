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
  const variants = createVariants(spring.condition, spring.groups.length, new Map())
  spring.matches = variants.get(spring.groups.map(g => g.toString()).join('-'))
})
console.log('Del 1: ', springs.reduce((acc, spring) => acc + spring.matches, 0))

function createVariants(condition, numGroups, variants) {
  if (!condition.includes('?')) {
    return variants
  }

  const broken = condition.replace('?', '.')
  if (broken.includes('?')) {
    createVariants(broken, numGroups, variants)
  } else {
    countVariant(broken, numGroups, variants)
  }

  const whole = condition.replace('?', '#')
  if (whole.includes('?')) {
    createVariants(whole, numGroups, variants)
  } else {
    countVariant(whole, numGroups, variants)
  }
  return variants
}

function countVariant(variant, numGroups, variants) {  
  const m = variant.match(/#+/g);
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