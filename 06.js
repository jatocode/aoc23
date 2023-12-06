const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let boats = []
lines.forEach(line => {
    if(line.startsWith('Time')) {
        const tm = line.split(':')[1].split(' ').map(x => parseInt(x)).filter(x => !isNaN(x))
        boats = tm.map(x => { return { time: x, record: 0, recordbreak: 0 } })
    } else if(line.startsWith('Distance')) {
        const sm = line.split(':')[1].split(' ').map(x => parseInt(x)).filter(x => !isNaN(x))
        boats.forEach((boat, i) => boat.record = sm[i])
    }
})

boats.forEach(boat => {
    for(let t=0; t<boat.time; t++) {
        const dist = distance(t, boat.time)
        if(dist > boat.record) {
            //console.log('Boat ' + boat.time + ' beat record ' + boat.record + ' at time ' + t)
            boat.recordbreak = boat.recordbreak + 1
        }
    }
})
console.log(boats)
console.log("Del 1: " + boats.reduce((acc, boat) => acc * boat.recordbreak, 1))

function distance(hold, totaltime) {
    const speed = hold * 1
    const dist = (totaltime - hold) * speed
    return dist
}
