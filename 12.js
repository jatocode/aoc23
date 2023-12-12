const fs = require('fs')
const args = process.argv.slice(2)

const rawdata = fs.readFileSync(args[0], 'utf8')
const lines = rawdata.split('\n')

let springs = []
lines.forEach(line => {
  const [c, groups] = line.split(' ')
  springs.push({ condition: c, groups: groups.split(',').map(g => parseInt(g)) })
})

springs.forEach((spring,i) => {
  const variants = createVariant(spring.condition, []).sort()
  const matches = matchGroups(variants, spring.groups)
  spring.matches = matches
})
console.table(springs)
console.log('Del 1: ', springs.reduce((acc, spring) => acc + spring.matches, 0))

function matchGroups(variants, groups) {
  let matches = 0
  variants.forEach((variant,i) => {
    let allMatch = true
    const numGroups = variant.match(/#+/g)?.length
    // Rätt antal grupper?
    if (numGroups != groups.length) {
      allMatch = false
    }
    let index = 0
    for (let i = 0; i < groups.length; i++ && allMatch == true) {
      const g = groups[i]
      // Ville göra sjuka grejor med regexp
      // https://stackoverflow.com/questions/43174409/regex-that-matches-no-more-than-n-occurrences
      const re = new RegExp(`(?<!#)#{${g}}(?!#)`)
      const group = variant.match(re)
      if (group) {
        // Grupperna måste vara i ordning
        if(group.index < index) {
          allMatch = false
          break
        }
        index = group.index
        const varr = [...variant]
        varr.splice(group.index, group[0].length, '.'.repeat(g))
        variant = varr.join('')
      } else {
        // Ingen träff alls
        allMatch = false
        break
      }
    }
    if (allMatch) {
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