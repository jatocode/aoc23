const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let cards = []
lines.forEach(line => {
    let [card, numbers] = line.split(':')
    let [win, my] = numbers.split('|')
    const winnums = win.split(' ').map(n => parseInt(n)).filter(n => !isNaN(n))
    const mynums = my.split(' ').map(n => parseInt(n)).filter(n => !isNaN(n))

    let winning = 0
    for (num of mynums) {
        if (winnums.includes(num)) {
            winning = winning == 0 ? 1 : winning * 2
        }
    }

    cards.push({ winnums, mynums, winning })
})

//console.table(cards)
const total = cards.reduce((acc, card) => acc + card.winning, 0)
console.log('Del 1', total)