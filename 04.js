const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let cards = []
lines.forEach(line => {
    let [_, numbers] = line.split(':')
    let [win, my] = numbers.split('|')
    const winnums = win.split(' ').map(n => parseInt(n)).filter(n => !isNaN(n))
    const mynums = my.split(' ').map(n => parseInt(n)).filter(n => !isNaN(n))

    let points = 0
    let wins = 0
    for (num of mynums) {
        if (winnums.includes(num)) {
            wins++
            points = points == 0 ? 1 : points * 2
        }
    }

    cards.push({ winnums, mynums, points, wins, instances: 1 })
})

const total = cards.reduce((acc, card) => acc + card.points, 0)
console.log('Del 1', total)

for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    for (let ins=0; ins<card.instances; ins++) {
        for (let j = 0; j < card.wins; j++) {
            const other = cards[i + j + 1]
            if (other != undefined) {
                other.instances++
            }
        }
    }
}

const totalcards = cards.reduce((acc, card) => acc + card.instances, 0)
console.log('Del 2', totalcards)
