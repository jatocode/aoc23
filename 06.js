const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let boats = []
lines.forEach(line => {
    if (line.startsWith('Time')) {
        const tm = line.split(':')[1].split(' ').map(x => parseInt(x)).filter(x => !isNaN(x))
        boats = tm.map(x => { return { time: x, record: 0, recordbreak: 0 } })
    } else if (line.startsWith('Distance')) {
        const sm = line.split(':')[1].split(' ').map(x => parseInt(x)).filter(x => !isNaN(x))
        boats.forEach((boat, i) => boat.record = sm[i])
    }
})

function calcDistance(boats) {
    boats.forEach(boat => {
        for (let t = 0; t < boat.time; t++) {
            if (distance(t, boat.time) > boat.record) boat.recordbreak = boat.recordbreak + 1
        }
    })
    return boats
}

const boats1 = calcDistance(boats)
console.log("Del 1: " + boats1.reduce((acc, boat) => acc * boat.recordbreak, 1))

//const boatspart2 = [{ time: 71530, record: 940200, recordbreak: 0 }]
const boatspart2 = [{ time: 53897698, record: 313109012141201, recordbreak: 0 }]
const boats2 = calcDistance(boatspart2)
console.log("Del 2: " + boats2[0].recordbreak)

function distance(hold, totaltime) {
    const speed = hold * 1
    const dist = (totaltime - hold) * speed
    return dist
}
