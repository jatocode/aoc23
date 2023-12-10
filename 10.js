const fs = require('fs')
const { get } = require('http')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let grid = []
lines.forEach((line, i) => {
  grid.push(line.split(''))
})

const starty = grid.findIndex(row => row.includes('S'))
const startx = grid[starty].findIndex(col => col === 'S')
const start = { x: startx, y: starty }
console.log('Del 1:', findPath(start))

function findPath(start) {
  const startnb = getNeighbours(start)[0]
  const queue = [startnb]
  const camefrom = {}

  camefrom[[startnb.x, startnb.y]] = { x: start.x, y: start.y }

  let current = start
  while (queue.length > 0) {
    current = queue.shift()

    const nb = getNeighbours(current)
    nb.forEach(n => {
      const v = camefrom[[n.x, n.y]]
      if (!v) {
        queue.push(n)
        camefrom[[n.x, n.y]] = current
      }
    })
  }
  camefrom[[start.x, start.y]] = { x: current.x, y: current.y }

  let crt = camefrom[[start.x, start.y]]
  let step = 1
  //let stepgrid = []

  //stepgrid[start.y] = []
  //stepgrid[start.y][start.x] = step++
  while (!(crt.x === start.x && crt.y === start.y)) {
    //if (!stepgrid[crt.y]) stepgrid[crt.y] = []
    //stepgrid[crt.y][crt.x] = step++
    crt = camefrom[[crt.x, crt.y]]
    step++
  }

  //console.table(stepgrid)
  return step / 2
}


/*
| is a vertical pipe connecting north and south.
- is a horizontal pipe connecting east and west.cd 
L is a 90-degree bend connecting north and east.
J is a 90-degree bend connecting north and west.
7 is a 90-degree bend connecting south and west.
F is a 90-degree bend connecting south and east.
. is ground; there is no pipe in this tile.
S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has
*/
function getNeighbours(pos) {
  const neighbours = []
  const right = grid[pos.y][pos.x + 1]
  const left = grid[pos.y][pos.x - 1]
  const up = grid[pos.y - 1] ? grid[pos.y - 1][pos.x] : '.'
  const down = grid[pos.y + 1] ? grid[pos.y + 1][pos.x] : '.'
  // console.log(right, left, up, down)
  if ('-7J'.includes(right)) neighbours.push({ x: pos.x + 1, y: pos.y })
  if ('-LF'.includes(left)) neighbours.push({ x: pos.x - 1, y: pos.y })
  if ('|7F'.includes(up)) neighbours.push({ x: pos.x, y: pos.y - 1 })
  if ('|JL'.includes(down)) neighbours.push({ x: pos.x, y: pos.y + 1 })

  //console.log('Get neighbours', pos, neighbours)
  return neighbours

}
