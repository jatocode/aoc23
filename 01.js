const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let tot = 0 
lines.forEach(x => {
    const first = x.split('').find(x => parseInt(x))
    const rev = x.split('').reverse()
    const second = rev.find(x => parseInt(x))
    const num = (first + "") + (second + "")
    tot += parseInt(num)
})
console.log('Del 1: ' + tot)

const digitsText = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight','nine']
const digits = ['1', '2', '3', '4', '5', '6', '7', '8','9']

tot = 0 
lines.forEach(x => {
    const first = findDigit(x)  
    const rev = x.split('').reverse().join('');
    const second = findDigit(rev, true)
    const num = (first + "") + (second + "")
    tot += parseInt(num)
})
console.log('Del 2: ' + tot)

function findDigit(x, reverse = false) {
    let founddigit = 0
    let pos = 1000
    for(let i=0; i<digitsText.length;i++) {
        const digit = digitsText[i]
        const search = reverse ? digit.split('').reverse().join('') : digit
        if(x.includes(search)) {
            const p = x.indexOf(search)
            if(p < pos) { 
                pos = p
                founddigit = i+1
            }
        }

        // ALSO CHECK FOR DIGITS

        if(x.includes(digits[i])) {
            const p = x.indexOf(digits[i])
            if(p < pos) { 
                pos = p
                founddigit = i+1
            }
        }
    }
    return founddigit
}