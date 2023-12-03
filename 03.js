const { getServers } = require('dns')
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
            const id = num + ':' + x + ',' + y
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

let gears = []
// Del 1
let total = 0
for (let number in numbers) {
    let found = false
    let foundgear = false
    const places = numbers[number]
    places.forEach((pos) => {
        let [x, y] = pos.split(',')

        if (!found && checkAdjacent(x, y)) {
            const sum = parseInt(number.split(':')[0])
            total += sum
            found = true
        }

        // Del 2
        const gear = checkAdjacentForGear(x, y)
        if (!foundgear && gear != false) {
            foundgear = true
            if (gears[gear] == undefined) gears[gear] = []
            const sum = parseInt(number.split(':')[0])
            gears[gear].push(sum)
        }

    })
}

console.log('Part 1', total)
var total2 = 0
for(let gear in gears) {
    const nums = gears[gear]
    if (nums.length  == 2) {
        total2 += nums[0] * nums[1]
    }
}
console.log('Part 2', total2)

function checkAdjacent(x, y) {
    y = parseInt(y)
    x = parseInt(x)
    for (let fy = y - 1; fy <= y + 1; fy++) {
        for (let fx = x - 1; fx <= x + 1; fx++) {
            const c = schema.get(fx + ',' + fy)
            if (c != undefined && isNaN(c) && c != '.') {
                return true
            }
        }
    }
    return false
}

function checkAdjacentForGear(x, y) {
    y = parseInt(y)
    x = parseInt(x)
    for (let fy = y - 1; fy <= y + 1; fy++) {
        for (let fx = x - 1; fx <= x + 1; fx++) {
            const c = schema.get(fx + ',' + fy)
            if (c == '*') {
                return fx + ',' + fy
            }
        }
    }
    return false
}

