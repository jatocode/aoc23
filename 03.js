const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let schema = new Map()
let symbols = new Map()
let numbers = []
let maxy = lines.length
let maxx = 0
lines.forEach((line, y) => {
    let data = line.split('')
    maxx = data.length
    for (let x = 0; x < data.length;) {
        const c = data[x]
        const n = parseInt(c)
        if (!isNaN(n)) {
            const part = data.slice(x).join('')
            const num = part.match(/\d+/)[0]
            numbers[num] = []
            for (let i = x; i < (x + num.length); i++) {
                //numbers[y + ',' + i] = parseInt(num)
                numbers[num].push(y + ',' + i)
                schema.set(y + ',' + i, parseInt(num))
            }
            x += num.length
        } else {
            schema.set(y + ',' + x, c)
            if (c != '.') symbols.set(y + ',' + x, c)
            x++
        }
    }
})

let total = 0
numbers.forEach((v, number) => {
    let found = false
    v.forEach((pos) => {
        let [y, x] = pos.split(',')
        if(checkAdjacent(x, y) && !found) {
            console.log(number)
            total += number
            found = true
        }
    })
})

function checkAdjacent(x,y) {
    y = parseInt(y)
    x = parseInt(x)
    for (let fy = y - 1; fy <= y + 1; fy++) {
        for (let fx = x - 1; fx <= x + 1; fx++) {
            const c = schema.get(fy + ',' + fx)
            if(c != undefined && isNaN(c) && c != '.') {
                console.log(c)
                return true
            }
        }
    }
    return false
}

console.log('Part 1', total)
