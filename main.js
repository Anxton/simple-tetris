const timerSpan = document.getElementById("timer")
const startButton = document.getElementById("startButton")
const squares = document.querySelectorAll("#matrix square")
const matrixEl = document.getElementById("matrix")

let startDate = Date.now()
let playing = false

function makePiece(pieceName='t') {
    const pieceObject = new Object()
    pieceObject.piece = pieceName.toLowerCase() // piece.piece = 'l'
    pieceObject.orientation = 'north' // piece.orientation = 'north'
    switch (pieceName.toLowerCase()) {
        case 't':
            pieceObject.blocks = [
                [4, 0],
                [3, 1],
                [4, 1],
                [5, 1]
            ]
            break
        case 'i':
            pieceObject.blocks = [
                [3, 0],
                [4, 0],
                [5, 0],
                [6, 0],
            ]
            break
        case 'o':
            pieceObject.blocks = [
                [4,0],
                [4,1],
                [5,0],
                [5,1],
            ]
            break
        case 'l':
            pieceObject.blocks = [
                [5,0],
                [3,1],
                [4,1],
                [5,1],
            ]
            break
        case 's':
            pieceObject.blocks = [
                [5,0],
                [4,0],
                [3,1],
                [4,1],
            ]
            break
        case 'j':
            pieceObject.blocks = [
                [3,0],
                [3,1],
                [4,1],
                [5,1],
            ]
            break
        case 'z':
            pieceObject.blocks = [
                [3,0],
                [4,0],
                [4,1],
                [5,1],
            ]
            break
        default:
            throw new Error('Unknown piece: ' + pieceObject)
    }

    return pieceObject
}

let activePiece = makePiece("t")

let ticks

const matrix = [
    // sideways and flipped so it's matrix[x][y] (matrix[0],[19] on bottom)
    // should it rather be matrix[line][col] like in maths ? (matrix[19][0] would be on bottom)
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'o', 'o'],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'o', 'o'],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'z', 'z'],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'z', 'z', 'i'],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'l', 'l', 's', 'i'],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'l', 's', 's', 'i'],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'l', 's', '', 'i'],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'j'],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'j', 'j', 'j'],
]

function blockAt(x, y) {
    if (x < 0 || x > 9) throw new Error('x out of bounds: ' + x)
    if (y < 0 || y > 19) throw new Error('y out of bounds: ' + y)
    return matrix[x][y]
}

/**
 * Returns the <square> html element at coords (x, y)
 * @param {number} x 
 * @param {number} y 
 * @returns {HTMLElement} square element
 */
function squareAt(x, y) {
    if (x < 0 || x > 9) throw new Error('x out of bounds: ' + x)
    if (y < 0 || y > 19) throw new Error('y out of bounds: ' + y)
    return squares[x + y*10]
}

function render() {
    renderMatrix()
    renderTimer()
}

function renderMatrix() {
    // render board
    renderBoard()
    // render activePiece
    renderActivePiece()
}
function renderBoard() {
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[0].length; y++) {
            squareAt(x, y).className = matrix[x][y]
        }
    }
}
function renderActivePiece() {
    activePiece.blocks.forEach((arr) => {
        squareAt(arr[0], arr[1]).className = activePiece.piece
    })
}

function renderTimer() {
    timerSpan.textContent = playing
        ? toTimerString(Date.now() - startDate)
        : "00:00.00"
}
function toTimerString(ms) {
    let s = ms / 1000
    sString = (s % 60 < 10)
        ? '0' + (s % 60).toFixed(3)
        : (s % 60).toFixed(3)

    m = Math.trunc(s / 60)
    mString = (m < 10)
        ? '0' + m
        : m
    return `${mString}:${sString}`
}

/**
 * Moves the activePiece in a certain direction
 * @param {string} direction 'down' / 'left' / 'right'
 * @returns {boolean} true if moved, false if can't move
 */
function move(direction) {
    switch (direction) {
        case 'down':
            for (const block of activePiece.blocks) {
                if (isOutOfBounds([block[0], block[1]+1]) || blockAt(block[0], block[1]+1)) {
                    return false
                }
            }
            activePiece.blocks.forEach((block) => {
                block[1]++
            })
            break

        case 'left':
            for (const block of activePiece.blocks) {
                if (isOutOfBounds([block[0]-1, block[1]] || blockAt(block[0]-1, block[1]))) {
                    return false
                }
            }
            activePiece.blocks.forEach((block) => {
                block[0]--
            })
            break

        case 'right':
            for (const block of activePiece.blocks) {
                if (isOutOfBounds([block[0]+1, block[1]] || blockAt(block[0]+1, block[1]))) {
                    return false
                }
            }
            activePiece.blocks.forEach((block) => {
                block[0]++
            })
            break

        default:
            throw new Error(`unknown direction: ${direction}`)
    }
    render()
    return true
    
}

function isOutOfBounds(block) {
    if (block[0] < 0 || block[0] > 9 || block[1] < 0 || block[1] > 19)
        return true
    else
        return false
}

/**
 * 
 * @param piece
 * @param {string} direction
 * @returns {boolean}
*/
function isMovable(piece, direction) {
    
}

function debug() {
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[0].length; y++) {
            squareAt(x, y).textContent = `${x}, ${y}`
            squareAt(x, y).style['font-size'] = '0.6rem'
        }
    }
}

// debug()



function settings() { }

function start() {
    ticks = 0
    playing = !playing
    startButton.textContent = playing ? "Stop" : "New game"
    startDate = Date.now()
}


function tick() {
    if (!playing) {
        return
    }
    if (ticks % 60 === 0) {
        move('down')
        renderMatrix()
    }
    ticks++
    renderTimer()
}

setInterval(tick, 16.67)

window.addEventListener('keydown', (event) => {
    if (event.code == 'ArrowLeft') {
        move('left')
        console.log('left input');
    }
    if (event.code == 'ArrowRight') {
        move('right')
        console.log('right input');
    }
    if (event.code == 'ArrowDown') {
        move('down')
        console.log('down input');
    }
})