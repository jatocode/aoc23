const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let schema = new Map()
let numbers = []
lines.forEach((line, y) => {
    let data = line.split('')
    for (let x = 0; x < data.length;) {
        const c = data[x]
        const n = parseInt(c)
        if (!isNaN(n)) {
            const part = data.slice(x).join('')
            const num = part.match(/\d+/)[0]
            const id = num + ':' + x + ',' +y
            numbers[id] = []
            for (let i = x; i < (x + num.length); i++) {
                numbers[id].push(i + ',' + y)
                schema.set(i + ',' + y, parseInt(num))
            }
            x += num.length
        } else {
            schema.set(x + ',' + y, c)
            x++
        }
    }
})

let total = 0
for(let number in numbers) {
    let found = false
    const places = numbers[number]
    places.forEach((pos) => {
        let [x, y] = pos.split(',')
        if(!found && checkAdjacent(x, y)) {
            const sum = parseInt(number.split(':')[0])
            total += sum
            found = true
        }
    })
}

function checkAdjacent(x,y) {
    y = parseInt(y)
    x = parseInt(x)
    for (let fy = y - 1; fy <= y + 1; fy++) {
        for (let fx = x - 1; fx <= x + 1; fx++) {
            const c = schema.get(fx + ',' + fy)
            if(c != undefined && isNaN(c) && c != '.') {
                console.log('found adjacent for ', x,y, ' at ', fy, fx, c)
                return true
            }
        }
    }
    return false
}

console.log('Part 1', total)
