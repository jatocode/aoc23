const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

const cards = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
let hands = []
lines.forEach(line => {
    const [handt,bid] = line.split(' ')
    const hand = handt.split('').map(c => 14 - cards.indexOf(c)).sort()
    console.log(handt)
    if(ofkind(hand,5)) console.log('five of a kind')
    else if(ofkind(hand,4)) console.log('four of a kind')
    else if(ofkind(hand,3) && ofkind(hand,2)) console.log('full house')
    else if(ofkind(hand,3)) console.log('three of a kind')
    else if(twopair(hand)) console.log('two pair')
    else if(ofkind(hand,2)) console.log('pair')
    else console.log('high card')
    hands.push(hand,parseInt(bid))
    console.log()

})
//console.log(hands)

function ofkind(hand, n) {
    const counts = {}
    hand.forEach(c => {
        counts[c] = (counts[c] || 0) + 1
    })
    return Object.values(counts).includes(n)
}

function twopair(hand) {
    const counts = {}
    hand.forEach(c => {
        counts[c] = (counts[c] || 0) + 1
    })
    const pairs = Object.values(counts).filter(c => c === 2)
    return pairs.length === 2
}