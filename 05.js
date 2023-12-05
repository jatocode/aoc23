const { getServers } = require('dns')
const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let state = 0
lines.forEach((line, y) => {
    let m = line.match(/seeds: (.*)/)
    if (m) {
        state = 1
        const seeds = m[1].split(',').map(n => parseInt(n))
    }
    m = line.match(/seed-to-soil map:/)
    if (m) state = 2
    m = line.match(/soil-to-fertilizer map:/)
    if (m) state = 3
    m = line.match(/fertilizer-to-water map:/)
    if (m) state = 4
    m = line.match(/light-to-temperature map:/)
    if (m) state = 5
    m = line.match(/temperature-to-humidity map:/)
    if (m) state = 6
    m = line.match(/humidity-to-location map:/)
    if (m) state = 7
    console.log(state)
})
 
