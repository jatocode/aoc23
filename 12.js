const fs = require('fs')
const args = process.argv.slice(2)

const rawdata = fs.readFileSync(args[0], 'utf8')
const lines = rawdata.split('\n')

let springs = []
lines.forEach(line => {
  const [c, groups] = line.split(' ')
  springs.push({ condition: c, groups: groups.split(',').map(g => parseInt(g)) })
})

springs.forEach((spring, i) => {
  //let spring = springs[1]
  const variants = createVariant(spring.condition, []).sort()
  const matches = matchGroups(variants, spring.groups)
  spring.matches = matches
})
console.table(springs)
console.log('Del 1: ', springs.reduce((acc, spring) => acc + spring.matches, 0))

function matchGroup(variant, groups, matches = 0) {
  const numGroups = variant.match(/#+/g)?.length
  if (numGroups != groups.length) {
    return matches
  }
  const g = groups.shift()
  if (!g) {
    return matches
  }
  const regex = new RegExp(`(?<!#)#{${g}}(?!#)`)
  const groupm = variant.match(regex)
  if (groupm) {
    index = groupm.index
    matches = matchGroup(variant.slice(index + g), groups, matches + 1)
  }
  return matches
}

function matchGroups(variants, groups) {
  let matches = 0
  variants.forEach(variant => {
    if (matchGroup(variant, [...groups]) == groups.length) {
      matches++
    }
  })
  return matches
}

function createVariant(condition, variants) {
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
    createVariant(broken, variants)
  } else {
    variants.push(broken)
  }

  if (whole.includes('?')) {
    createVariant(whole, variants)
  } else {
    variants.push(whole)
  }

  return variants
}