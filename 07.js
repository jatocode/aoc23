const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

const cards = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const cards2 = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J']

let hands = []
let handswithjoker = []
lines.forEach(line => {
    const [handt, bidt] = line.split(' ')
    const hand = handt.split('').map(c => 12 - cards.indexOf(c))
    const bid = parseInt(bidt)
    hands.push({ handt, hand, value: value(hand), bid })

    // Del 2
    const hand2 = handt.split('').map(c => 12 - cards2.indexOf(c))
    const [bestJokerHand, bestJokerValue] = valueWithJoker(hand2)
    handswithjoker.push({ handt, hand: hand2, jokerhand: bestJokerHand, value: bestJokerValue, bid })
})

const handsByValue = hands.sort((a, b) => cardSorter(a, b))
const totalWinnings = handsByValue.reduce((acc, hand, i) => acc + hand.bid * (i + 1), 0)
console.log("Del 1: " + totalWinnings)

const handsByValueWithJoker = handswithjoker.sort((a, b) => cardSorter(a, b))
const totalWinnings2 = handsByValueWithJoker.reduce((acc, hand, i) => acc + hand.bid * (i + 1), 0)
console.log("Del 2: " + totalWinnings2)

function cardSorter(a, b) {
    if (a.value > b.value) return 1
    if (a.value < b.value) return -1
    if (a.value == b.value) {
        for (let i = 0; i < a.hand.length; i++) {
            if (a.hand[i] !== b.hand[i]) {
                return a.hand[i] - b.hand[i]
            }
        }
    }
    return 0
}

function valueWithJoker(hand) {
    let best = 0
    let besthand = hand
    for (let c = 0; c < cards2.length; c++) {
        const newhand = hand.map(x => x == 0 ? c : x)
        const val = value(newhand)
        if (val > best) {
            best = val
            besthand = newhand
        }
    }
    return [besthand, best]
}

function value(hand) {
    if (ofkind(hand, 5)) return 7
    else if (ofkind(hand, 4)) return 6
    else if (ofkind(hand, 3) && ofkind(hand, 2)) return 5
    else if (ofkind(hand, 3)) return 4
    else if (twopair(hand)) return 3
    else if (ofkind(hand, 2)) return 2
    else if (highcard(hand)) return 1
    return 0
}

function highcard(hand) {
    const tmp = new Set(hand)
    return tmp.size === hand.length
}

function ofkind(hand, n) {
    const counts = {}
    hand.forEach(c => {
        counts[c] = (counts[c] || 0) + 1
    })
    return (Object.values(counts).includes(n) ? n : false)
}

function twopair(hand) {
    const counts = {}
    hand.forEach(c => {
        counts[c] = (counts[c] || 0) + 1
    })
    const pairs = Object.values(counts).filter(c => c === 2)
    return pairs.length === 2
}