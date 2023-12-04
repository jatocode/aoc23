const { getServers } = require('dns')
const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let cards = []
lines.forEach((line, y) => {
    let [card, numbers] = line.split(':')
    let [win, my] = numbers.split('|')
    const winnums = win.split(' ').map(n => parseInt(n)).filter(n => !isNaN(n))
    const mynums = my.split(' ').map(n => parseInt(n)).filter(n => !isNaN(n))

    cards.push({ card, winnums, mynums, winning: 0 })

    for (card in mynums) {
        for (num in mynums[card]) {
            if (winnums.includes(num)) {
                console.log('win', card, num)
                mynums[card].winning += 1
            }
        }
    }
})

console.table(cards)
