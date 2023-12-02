const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

const bagr = 12
const bagg = 13
const bagb = 14

let gamestot = 0
lines.forEach(line => {
    const gamem = line.match(/Game (\d+).*/)
    const game = parseInt(gamem[1])
    const sets = line.split(';')
    let gamepossible = true
    sets.forEach(set => {
        const cols = getColors(set)
        if(cols[0]> bagr || cols[1] > bagg || cols[2] > bagb) {
            gamepossible = false 
       }
    })
    if(gamepossible) {
        gamestot += game
    }
})
console.log('Del 1: ' + gamestot)

function getColors(data) {
    const redm = data.match(/.* (\d+) red.*/)
    const greenm = data.match(/.* (\d+) green.*/)
    const bluem = data.match(/.* (\d+) blue.*/)

    const red = redm?.length > 1 ? parseInt(redm[1]) : 0
    const green = greenm?.length > 1 ? parseInt(greenm[1]) : 0
    const blue = bluem?.length > 1 ? parseInt(bluem[1]) : 0

    return [red, green, blue]
}