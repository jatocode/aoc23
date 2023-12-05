const { getServers } = require('dns')
const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let state = 0
let seeds = null
let seedmap = []
lines.forEach((line, y) => {
    state = getState(line)
    if (state > 0) {
        const mapdata = line.match(/(\d+) (\d+) (\d+)/)
        if (mapdata) {
            const [_, d, s, r] = mapdata
            if (!seedmap[state]) seedmap[state] = []
            seedmap[state].push({ s:parseInt(s), d:parseInt(d), r:parseInt(r) })
        }
    }
})

let lowest = Number.MAX_SAFE_INTEGER
seeds.forEach(seed => {
    let sm = seed
    let path = seed + " -> "
    for (let i = 1; i<seedmap.length ; i++) {
        for(let j=0; j<seedmap[i].length; j++) {
            let map = seedmap[i][j]
            const diff = sm - map.s
            if(diff >= 0 && diff <= map.r) {
                sm = map.d + diff
                break
            }
        }
        path += sm + " -> "
    }
    if(sm < lowest) lowest = sm
    path += sm
    //console.log(path)
})
console.log('Del 1: ' + lowest)

function getState(line) {
    let m = line.match(/seeds: (.*)/)
    if (m) {
        seeds = m[1].split(' ').map(x => parseInt(x))
        return 0
    }
    m = line.match(/seed-to-soil map:/)
    if (m) return 1
    m = line.match(/soil-to-fertilizer map:/)
    if (m) return 2
    m = line.match(/fertilizer-to-water map:/)
    if (m) return 3
    m = line.match(/water-to-light map:/)
    if (m) return 4
    m = line.match(/light-to-temperature map:/)
    if (m) return 5
    m = line.match(/temperature-to-humidity map:/)
    if (m) return 6
    m = line.match(/humidity-to-location map:/)
    if (m) return 7

    return state
}

// switch (state) {
//     case 2:
//         console.log('seed-to-soil map:')
//         break
//     case 3:
//         console.log('soil-to-fertilizer map:')
//         break
//     case 4:
//         console.log('fertilizer-to-water map:')
//         break
//     case 5:
//         console.log('light-to-temperature map:')
//         break
//     case 6:
//         console.log('temperature-to-humidity map:')
//         break
//     case 7:
//         console.log('humidity-to-location map:')
//         break
// }