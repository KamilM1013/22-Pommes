//Player Class
class Player {
    constructor(green = 0, red = 0) {
        this.green = green
        this.red = red
    }
    getGreen() {
        return this.green;
    }
    getRed() {
        return this.red;
    }
    isExactly11() {
        return (this.red == 11 && this.green == 11) ? true : false
    }
    isLose() {
        return (this.red > 11 || this.green > 11) ? true : false
    }
    isPlay() {
        return (this.red <= 11 && this.green <= 11) ? true : false
    }
    setGreen(points) {
        this.green += points
    }
    setRed(points) {
        this.red += points
    }
    typeOfPoints(src) {
        let tmp = src.slice(7, 9).split('')
        //console.log(tmp)
        return tmp[1] == "r" ? this.setRed(tmp[0] - 0) : this.setGreen(tmp[0] - 0)
    }
}

//Images used on front-end
let images = [
    '1g.png',
    '1g.png',
    '1g.png',
    '2g.png',
    '2g.png',
    '3g.png',
    '3g.png',
    '3g.png',
    '5g.png',
    '5g.png',
    '5g.png',
    '5g.png',
    '5r.png',
    '5r.png',
    '5r.png',
    '5r.png',
    '3r.png',
    '3r.png',
    '3r.png',
    '2r.png',
    '2r.png',
    '1r.png',
    '1r.png',
    '1r.png',
    'farmer.png',
]

//Game prep
let player1 = new Player()
let player2 = new Player()
let rounds = 1
let currentPlayer = player1

//Board prep
let table = document.querySelector('#gameBoard')
let info = document.querySelector('#info')
let tbody = table.appendChild(document.createElement('tbody'))
let field, tr, td, img, gamePlayed, dp1 //fp1
let col = 1
let fp2 = []
let row = []
let board = []

//fp1 = Shuffle(images)
//fp1 = fp1.indexOf('farmer.png')
Shuffle(images)

//Creating game board
document.querySelector('#whichP').innerHTML = "Player 1's turn"
for (let i = 0; i < images.length; i++) {
    if ('farmer.png' == images[i]) {
        fp2[0] = col
        fp2[1] = (((i + 1) % 5) == 0 ? 5 : ((i + 1) % 5))
    }
    if ((i + 1) % 5 == 0) col++
}
col = 1
for (let i = 0; i < images.length; i++) {
    if (images[i] !== 'farmer.png') {
        row.push({ y: col, x: ((i + 1) % 5) == 0 ? 5 : ((i + 1) % 5), value: images[i].slice(0, 1), color: images[i].slice(1, 2) })
    } else {
        row.push({ y: col, x: ((i + 1) % 5) == 0 ? 5 : ((i + 1) % 5), value: 'farmer', color: null })
    }
    //console.log(row)
    if (i % 5 == 0) tr = tbody.appendChild(document.createElement('tr'))
    field = tr.appendChild(document.createElement('td'))
    field.setAttribute('id', col + '' + (((i + 1) % 5) == 0 ? 5 : ((i + 1) % 5)))
    img = field.appendChild(document.createElement('img'))
    images[i] = 'japka//' + images[i]
    img.src = images[i]
    img.setAttribute('alt', images[i])
    img.setAttribute('class', 'gameImages')

    dp1 = img.parentElement.id.split('')
    //console.log(dp1)
    if ((fp2[0] == dp1[0] && fp2[1] != dp1[1]) || (fp2[0] != dp1[0] && fp2[1] == dp1[1])) {
        img.parentElement.style.backgroundColor = '#1f7c98'
    } else {
        img.parentElement.style.backgroundColor = '#7fbc98'
    }
    if (images[i] === 'japka//farmer.png') {
        img.setAttribute('id', 'field-farmer')
        img.parentElement.style.backgroundColor = '#dbdbdb'
    } else { img.setAttribute('id', `field-${col + '' + (((i + 1) % 5) == 0 ? 5 : ((i + 1) % 5))}`) }

    img.setAttribute('onclick', "move('#" + img.id + "')")
    if ((i + 1) % 5 == 0) {
        col++
        board.push(row)
        row = []
    }
}

//Gets current game state
function getCurrentBoard() {
    document.querySelectorAll('tr').forEach((row, index) => {
        let i = 0
        for (const td of row.children) {
            //console.log(col)
            if (td.firstChild.id == 'field-farmer') {
                board[index][i] = { y: index + 1, x: i + 1, value: 'farmer', color: null }
            } else if (td.firstChild.id == 'empty') {
                board[index][i] = { y: index + 1, x: i + 1, value: null, color: null }
            } else {
                board[index][i] = { y: index + 1, x: i + 1, value: td.firstChild.alt.slice(7, 8), color: td.firstChild.alt.slice(8, 9) }
            }
            i++
        }

    })
}

//Used to shuffle images on front-end
function Shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let k = array[i]
        array[i] = array[j]
        array[j] = k
    }
    return array
}

//Executes a move 
function move(selector) {
    setTimeout(function(){
        if (selector == '#field-farmer' || !isLegalMove(selector)) return
        //console.log(selector)
        paint(selector)
        if (isLegalMove(selector)) {
            document.querySelector('#field-farmer').parentElement.style.backgroundColor = '#7b7b7b'
        }
        let img = document.querySelector(selector)
        let oldFarmer = document.querySelector('#field-farmer')
        img.parentElement.style.backgroundColor = '#dbdbdb'
        //console.log(img.alt)
        //console.log(selector)
        currentPlayer.typeOfPoints(img.alt)
        oldFarmer.style.visibility = 'hidden'
        oldFarmer.setAttribute('id', 'empty')
        img.src = 'japka//farmer.png'
        img.setAttribute('id', 'field-farmer')
        img.setAttribute('onclick', "move('#" + img.id + "')")
        getCurrentBoard()
        play()
    }, 1000);
        
    

}

//Checks if move is legal
function isLegalMove(selector) {
    let fp = ('' + (document.querySelector('#field-farmer').parentElement.id)).split('')
    let dp = document.querySelector(selector).id.split('').slice(6)
    //let legalMove = (fp[0] == dp[0] && fp[1] != dp[1]) || (fp[0] != dp[0] && fp[1] == dp[1])

    //legalMove ? document.querySelector('#field-farmer').parentElement.style.backgroundColor = '#7b7b7b' : 0

    //return legalMove
    return (fp[0] == dp[0] && fp[1] != dp[1]) || (fp[0] != dp[0] && fp[1] == dp[1])
}

//Switches players each round; checks for win or lose condition
function play() {
    if (player1.isPlay() && player2.isPlay() && !player1.isExactly11() && !player2.isExactly11()) {
        if (currentPlayer === player1) {
            document.querySelector('#whichP').innerHTML = "Player 2's turn"
            currentPlayer = player2
            if (isPVE) makeBestMove()//setTimeout(function () { getLegalMove() }, 500)
        } else if (currentPlayer === player2) {
            document.querySelector('#whichP').innerHTML = "Player 1's turn"
            currentPlayer = player1
        }
        rounds++
    } else {
        player1.isExactly11() || player2.isLose()
            ? info.innerHTML = 'Player 1 wins in: ' + rounds + ' rounds'
            : info.innerHTML = 'Player 2 wins in: ' + rounds + ' rounds'
        document.querySelectorAll('td').forEach(x => x.firstChild.setAttribute('onclick', null))
    }
    document.querySelector('#p1').innerHTML = 'Player 1: Red: ' + player1.getRed() + ', Green: ' + player1.getGreen()
    document.querySelector('#p2').innerHTML = 'Player 2: Red: ' + player2.getRed() + ', Green: ' + player2.getGreen()
    
}

//Based on position paint all valid moves
function paint(selector) {
    let allP = []
    let col = 1
    let dp = document.querySelector(selector).id.split('').slice(6)
    let tds = document.querySelectorAll('td')
    for (let i = 0; i < images.length; i++) {
        allP[i] = (col + '' + (((i + 1) % 5) == 0 ? 5 : ((i + 1) % 5))).split('')
        if (tds[i].firstChild.id != 'empty') {
            if ((dp[0] == allP[i][0] && dp[1] != allP[i][1]) || (dp[0] != allP[i][0] && dp[1] == allP[i][1])) {
                //console.log(currentPlayer === player1)
                !(currentPlayer === player1) ? tds[i].style.backgroundColor = '#1f7c98' : tds[i].style.backgroundColor = '#C44E4E'
                //tds[i].style.backgroundColor = '#1f7c98'
            } else {
                tds[i].style.backgroundColor = '#7fbc98'
            }
        }
        if ((i + 1) % 5 == 0) col++
    }
    //console.log(allP)
}

//Different game modes
function PVP() {
    location.reload(true)
}

let isPVE = false
let israndom = true
let isminmax = false

function PVE() {
    isPVE = true

}

function EVE() {
    !(player1.isPlay() && player2.isPlay() && !player1.isExactly11() && !player2.isExactly11())
        ? location.reload(true) : EVELoop();
}
function EVELoop() {
    setTimeout(function () {
        getLegalMove()
        if (player1.isPlay() && player2.isPlay() && !player1.isExactly11() && !player2.isExactly11()) {
            EVELoop()
        }
    }, 500)
}

//Checks for all valid moves for random bot
function getLegalMove() {
    let selector
    let allP = []
    let col = 1
    let img = Array.from(document.querySelectorAll('.gameImages'))
    let tds = document.querySelectorAll('td')
    let legal = []
    img = img.find(x => x.id == 'field-farmer').parentElement.id.split('')
    for (let i = 0; i < images.length; i++) {
        allP[i] = (col + '' + (((i + 1) % 5) == 0 ? 5 : ((i + 1) % 5))).split('')
        if ((img[0] == allP[i][0] && img[1] != allP[i][1]) || (img[0] != allP[i][0] && img[1] == allP[i][1])) {
            if (tds[i].firstChild.id != 'empty') {
                legal[i] = (col + '' + (((i + 1) % 5) == 0 ? 5 : ((i + 1) % 5)))
            }
        }
        if ((i + 1) % 5 == 0) col++
    }
    //console.log(legal)
    legal = legal.filter(x => x > 0)
    //console.log(legal)
    if (israndom) {
        selector = legal[Math.floor(Math.random() * legal.length)]
    } else if (isminmax) {
        makeBestMove()
    }
    //selector = legal[Math.floor(Math.random() * legal.length)]
    move('#field-' + selector)
}

//Checks for chosen algorithm
function isRandom() {
    israndom = true
    isminmax = false
}
function isMinMax() {
    isminmax = true
    israndom = false
}

//Fetches farmer position
function getFarmer(board) {
    let farmer
    board.forEach(y => {
        y.forEach(x => {
            if (x.value == 'farmer') {
                farmer = x
            }
        })
    })
    return farmer
}

//Fetches all valid moves for back-end algorithm calculation
function getBoardLegalMoves() {
    let farmer = getFarmer(board)
    let legalMoves = []

    for (let i = 0; i < 5; i++) {
        if (board[i][farmer.x - 1].value !== null && board[i][farmer.x - 1].value !== 'farmer') {
            legalMoves.push({ y: board[i][farmer.x - 1].y, x: board[i][farmer.x - 1].x })
        }
    }
    for (let i = 0; i < 5; i++) {
        if (board[farmer.y - 1][i].value !== null && board[farmer.y - 1][i].value !== 'farmer') {
            legalMoves.push({ y: board[farmer.y - 1][i].y, x: board[farmer.y - 1][i].x })
        }
    }
    return legalMoves
}

//Determines best move based on score
function evaluate(node, isMaximizing) {
    let score = 0

    if (node !== null) {
        if(isMaximizing) {
            let gApples = parseInt(player1.getGreen())
            let rApples = parseInt(player1.getRed())
            if(node.color == 'g') {
                gApples += parseInt(node.value)                
            } else if(node.color == 'r') {
                rApples += parseInt(node.value)
            }
            if (gApples > 11 ||  rApples > 11) {
                score -= 1;
                console.log('haj')
                return score
            }
            if (gApples == 11 &&  rApples == 11) {
                score += 1
                return score;
            }
            // if(gApples % 2 == 1 || rApples % 2 == 1) {
            //     score += 1;
            // }
            if(node.value == 1) {
                score -= 10000;
            }
            if(node.value == 2) {
                score -= 1000;
            }
            if(node.value == 3) {
                score -= 100;
            }
            if(node.value == 5) {
                score -= 10;
            }
        }
        if(!isMaximizing) {
            let gApples = parseInt(player2.getGreen())
            let rApples = parseInt(player2.getRed())
            if(node.color == 'g') {
                gApples += parseInt(node.value)                
            } else if(node.color == 'r') {
                rApples += parseInt(node.value)
            }
            if (gApples > 11 ||  rApples > 11) {
                score += 1;
                return score
            }
            if (gApples == 11 &&  rApples == 11) {
                score -= 1;
                return score
            }
            // if(gApples % 2 == 1 || rApples % 2 == 1) {
            //     score -= 1;
            // }
            if(node.value == 1) {
                score += 10000;
            }
            if(node.value == 2) {
                score += 1000;
            }
            if(node.value == 3) {
                score += 100;
            }
            if(node.value == 5) {
                score += 10;
            }
        }
        console.log(node.value)
    } else {
        if(isMaximizing){
            return Infinity
        } else {
            return -Infinity
        }
    }

    // board.value
    // board.color
    // currentPlayer.getGreen()
    // currentPlayer.getRed()
    
    return score
}

//Implementation of minimax algorithm
let bestMove = null;
function minMax(board, node, depth, isMaximizing) {
    let boardCopy = JSON.parse(JSON.stringify(board))
    let legalMoves = getBoardLegalMoves()
    if (evaluate(node, isMaximizing) > 20000 || depth == 0) {
        return evaluate(node, isMaximizing)
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        legalMoves.forEach(move => {
            let boardCopyCopy = JSON.parse(JSON.stringify(boardCopy))
            let farmer = getFarmer(boardCopyCopy)
            let fieldValue =  {value: boardCopyCopy[move.y - 1][move.x - 1].value, color: boardCopyCopy[move.y - 1][move.x - 1].color}
            boardCopyCopy[farmer.y - 1][farmer.x - 1] = { y: farmer.y, x: farmer.x, value: null, color: null }
            boardCopyCopy[move.y - 1][move.x - 1] = { y: move.y, x: move.x, value: 'farmer', color: null }
            let score = minMax(boardCopyCopy, fieldValue, depth - 1, false);
            if (score > bestScore) {
                bestScore = score
                bestMove = move
            }
        })
        return bestScore;
    } else {
        let bestScore = Infinity;
        legalMoves.forEach(move => {
            let boardCopyCopy = JSON.parse(JSON.stringify(boardCopy))
            let farmer = getFarmer(boardCopyCopy)
            let fieldValue =  {value: boardCopyCopy[move.y - 1][move.x - 1].value, color: boardCopyCopy[move.y - 1][move.x - 1].color}
            boardCopyCopy[farmer.y - 1][farmer.x - 1] = { y: farmer.y, x: farmer.x, value: null, color: null }
            boardCopyCopy[move.y - 1][move.x - 1] = { y: move.y, x: move.x, value: 'farmer', color: null }
            let score = minMax(boardCopyCopy, fieldValue, depth - 1, true);
            if (score < bestScore) {
                bestScore = score
                bestMove = move
                //console.log(score)
            }
        })
        return bestScore;
    }
}

//Used to execute the best move
function makeBestMove() {
    let score 
    new Promise((resolve, reject) => {
        resolve(score = minMax(board, null, 3, false))
    }).then(() => {
        console.log(bestMove)
        move(`#field-${bestMove.y}${bestMove.x}`)
    })
    .catch((e) => {console.log(e)})
}
