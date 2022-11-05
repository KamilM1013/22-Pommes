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
        let tmp = src.slice(7,9).split('')
        //console.log(tmp)
        return tmp[1] == "r" ? this.setRed(tmp[0]-0) : this.setGreen(tmp[0]-0)
    }
}

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
let player1 = new Player()
let player2 = new Player()
let rounds = 1
let currentPlayer = player1

let table = document.querySelector('#gameBoard')
let info = document.querySelector('#info')
let tbody = table.appendChild(document.createElement('tbody'))
let field, tr, td, img, gamePlayed, dp1 //fp1
let col = 1
let fp2 = []
//fp1 = Shuffle(images)
//fp1 = fp1.indexOf('farmer.png')
Shuffle(images)
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
    images[i] = 'japka//' + images[i]
    if (i % 5 == 0) tr = tbody.appendChild(document.createElement('tr'))
    field = tr.appendChild(document.createElement('td'))
    field.setAttribute('id', col + '' + (((i + 1) % 5) == 0 ? 5 : ((i + 1) % 5)))
    img = field.appendChild(document.createElement('img'))
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
    if(images[i] === 'japka//farmer.png') {
        img.setAttribute('id', 'field-farmer')
        img.parentElement.style.backgroundColor = '#dbdbdb'
    } else {img.setAttribute('id', `field-${col + '' + (((i + 1) % 5) == 0 ? 5 : ((i + 1) % 5))}`)}

    img.setAttribute('onclick', "move('#" + img.id + "')")
    if ((i + 1) % 5 == 0) col++
}



function Shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let k = array[i]
        array[i] = array[j]
        array[j] = k
    }
    return array
}

function move(selector) {
    
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
    play()
}    

function isLegalMove(selector) {
    let fp = ('' + (document.querySelector('#field-farmer').parentElement.id)).split('')
    let dp = document.querySelector(selector).id.split('').slice(6)
    //let legalMove = (fp[0] == dp[0] && fp[1] != dp[1]) || (fp[0] != dp[0] && fp[1] == dp[1])

    //legalMove ? document.querySelector('#field-farmer').parentElement.style.backgroundColor = '#7b7b7b' : 0

    //return legalMove
    return (fp[0] == dp[0] && fp[1] != dp[1]) || (fp[0] != dp[0] && fp[1] == dp[1])
}

function play() {
    if (player1.isPlay() && player2.isPlay() && !player1.isExactly11() && !player2.isExactly11()) {
        if (currentPlayer === player1) {
            document.querySelector('#whichP').innerHTML = "Player 2's turn"
            currentPlayer = player2
            if (isPVE) setTimeout(function () {getLegalMove()}, 500)
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
        if (player1.isPlay() && player2.isPlay() && !player1.isExactly11() && !player2.isExactly11()) {           //  if the counter < 10, call the loop function
            EVELoop()            
        }                       
    }, 500)
}

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
    console.log(legal)
    if (israndom) {
        selector = legal[Math.floor(Math.random() * legal.length)]
    } else if (isminmax) {
        // let bestScore = -Infinity;
        // let score = minMax(allP, 2, false);
        // if (score > bestScore) {
        //     console.log(bestScore)
        //     selector = bestScore;
        // }
    }
    //selector = legal[Math.floor(Math.random() * legal.length)]
    move('#field-' + selector) 
}

function isRandom() {
    israndom = true
    isminmax = false
}
function isMinMax() {
    isminmax = true
    israndom = false
}

// function minMax(allP, depth, isMaximizing) {
//     if (!(player1.isPlay() && player2.isPlay() && !player1.isExactly11() && !player2.isExactly11()) || depth == 0) {
//         let score = 0
//         player1.isExactly11() || player2.isLose() ? score = 1 : score = -1
//         return score
//     }

//     if (isMaximizing) {
//         let bestScore = -Infinity;
//         for (let i = 0; i < legal.length; i++) {
//             let score = minMax(legal, depth - 1, false);
//             bestScore = Math.max(score, bestScore);
//         }
//         return bestScore;
//     } else {
//         let bestScore = Infinity;
//         for (let i = 0; i < legal.length; i++) {
//             let score = minMax(legal, depth - 1, true);
//             bestScore = Math.min(score, bestScore);
//         }
//         return bestScore;
//     }
// }
