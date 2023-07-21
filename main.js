const timerSpan = document.getElementById("timer")
const startButton = document.getElementById("startButton")
const holdSquares = document.querySelectorAll("#hold square")
const squares = document.querySelectorAll("#matrix square")
const queueSquares = document.querySelectorAll("#queue square")

let startDate
let playing = false
let activePiece
let ticks
let matrix
let lockout

function start() {
    matrix = [
        ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
    ]
    newPiece()
    startDate = Date.now()
}

function newPiece() {
    activePiece = makePiece()
    ticks = 0
    lockout = 0
    renderActivePiece()
}

function makePiece(pieceName) {
    const pieceObject = new Object()
    if (pieceName == undefined) {
        pieceName = ['t', 'i', 'o', 'l', 's', 'j', 'z'][Math.floor(Math.random()*7)]
    }

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

    pieceObject.isGrounded = pieceObject.blocks.some(block => isOutOfBounds(block[0], block[1]) || blockAt(block[0], block[1]+1))

    return pieceObject
}

const baseMatrix = [
    // sideways and flipped so it's matrix[x][y] (matrix[0],[19] on bottom)
    // should it rather be matrix[line][col] like in maths ? (matrix[19][0] would be on bottom)
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
]
const debugMatrix = [
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

/**
 * Returns the block at coords (x, y)
 * @param {number} x 
 * @param {number} y 
 * @returns {string} block
 */
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

function renderBoard() {
    renderSettledBlocks()
    renderActivePiece()
}
function renderSettledBlocks() {
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

function updateTimer() {
    timerSpan.textContent = playing
        ? toTimerString(Date.now() - startDate)
        : "00:00.00"
}
function toTimerString(ms) {
    const s = ms / 1000
    const sString = (s % 60 < 10)
        ? '0' + (s % 60).toFixed(3)
        : (s % 60).toFixed(3)

    const m = Math.trunc(s / 60)
    const mString = (m < 10)
        ? '0' + m
        : m
    return `${mString}:${sString}`
}

/**
 * Moves the activePiece in a certain direction
 * @param {string} direction 'down' / 'left' / 'right' / 'up'
 * @returns {boolean} true if moved, false if can't move
 */
function move(direction) {
    let projectedBlocks
    switch (direction) {
        case 'up':
            projectedBlocks = activePiece.blocks.map(block => [block[0], block[1]-1])
            lockout = 0
            break
            
        case 'down':       
            projectedBlocks = activePiece.blocks.map(block => [block[0], block[1]+1])
            break
            
        case 'left':
            projectedBlocks = activePiece.blocks.map(block => [block[0]-1, block[1]])
            lockout = 0
            break
            
        case 'right':
            projectedBlocks = activePiece.blocks.map(block => [block[0]+1, block[1]])
            lockout = 0
            break
            
        default:
            throw new Error(`unknown direction: ${direction}`)
    }

    // return if the projected placement is invalid
    if (projectedBlocks.some(block => isOutOfBounds(block[0], block[1]) || blockAt(block[0], block[1]))) {
        return false
    }

    // move
    activePiece.blocks = projectedBlocks

    // set grounded state
    activePiece.isGrounded = activePiece.blocks.some(block => isOutOfBounds(block[0], block[1]+1) || blockAt(block[0], block[1]+1))

    renderBoard()
    return true
    
}

function isOutOfBounds(x, y) {
    return (x < 0 || x > 9 || y < 0 || y > 19)
}

function settle() {
    activePiece.blocks.forEach((block) => {
        matrix[block[0]][block[1]] = activePiece.piece
    })
    newPiece()
}


function settings() { }

function startStopButton() {
    playing = !playing
    if (playing) {
        start()
    }
    startButton.textContent = playing ? "Stop" : "New game"
}


function tick() {
    if (!playing) {
        return
    }
    if (lockout === 40) {
        settle()
    } else if (ticks % 40 === 0) {
        move('down')
    }
    if (activePiece.isGrounded) {
        lockout++
    }
    ticks++
    updateTimer()
}


setInterval(tick, 16.67)

window.addEventListener('keydown', (event) => {
    if (event.code == 'ArrowUp') {
        move('up')
    }
    if (event.code == 'ArrowDown') {
        move('down')
    }
    if (event.code == 'ArrowLeft') {
        move('left')
    }
    if (event.code == 'ArrowRight') {
        move('right')
    }
})

// function debug() {
//     for (let x = 0; x < matrix.length; x++) {
//         for (let y = 0; y < matrix[0].length; y++) {
//             squareAt(x, y).textContent = `${x}, ${y}`
//             squareAt(x, y).style['font-size'] = '0.6rem'
//         }
//     }
// }

// debug()