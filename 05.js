const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let state = 0
let seedsPart1 = null
let seedsPart2 = []
let seedmap = []
lines.forEach(line => {
    state = getState(line)
    if (state > 0) {
        const mapdata = line.match(/(\d+) (\d+) (\d+)/)
        if (mapdata) {
            const [_, d, s, r] = mapdata
            if (!seedmap[state]) seedmap[state] = []
            seedmap[state].push({ s: parseInt(s), d: parseInt(d), r: parseInt(r) })
        }
    }
})


function findLowestLocation(seeds) {
    let lowest = Number.MAX_SAFE_INTEGER

    seeds.forEach((seed,s) => {
        console.log('Checking seed: ' + (s + 1) + ' of ' + seeds.length + ' time:' + new Date().toLocaleTimeString())
        for (let smr = seed.start; smr <= seed.start + seed.range; smr++) {
            //console.log('Seed: ' + smr, seed.range)
            let sm = smr
            let path = sm + " -> "

            for (let i = 1; i < seedmap.length; i++) {
                for (let j = 0; j < seedmap[i].length; j++) {
                    let map = seedmap[i][j]
                    const diff = sm - map.s
                    if (diff >= 0 && diff <= map.r) {
                        sm = map.d + diff
                        break
                    }
                }
                path += sm + " -> "
            }
            if (sm < lowest) lowest = sm
            path += sm
            //console.log(path)
        }
    })
    return lowest
}
console.log('Del 1: ' + findLowestLocation(seedsPart1))
console.log('Del 2: ' + findLowestLocation(seedsPart2))

function getState(line) {
    let m = line.match(/seeds: (.*)/)
    if (m) {
        const seeds = m[1].split(' ').map(x => parseInt(x))
        seedsPart1 = seeds.map(start => { return { start, range: 0 } })
        for (let i = 0; i < seeds.length; i += 2) {
            const start = seeds[i]
            const range = seeds[i + 1]
            seedsPart2.push({ start, range })
        }
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

