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
let table = document.querySelector('#gameBoard')
let info = document.querySelector('#info')
let tbody = table.appendChild(document.createElement('tbody'))
let field, tr, td, img, gamePlayed, fp1, dp1
let col = 1
let fp2 = []
fp1 = Shuffle(images)
fp1 = fp1.indexOf('farmer.png')
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
    i % 5 == 0 ? tr = tbody.appendChild(document.createElement('tr')) : 0
    field = tr.appendChild(document.createElement('td'))
    field.setAttribute('id', col + '' + (((i + 1) % 5) == 0 ? 5 : ((i + 1) % 5)))
    img = field.appendChild(document.createElement('img'))
    img.src = images[i]
    img.setAttribute('alt', images[i])

    dp1 = img.parentElement.id.split('')
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

let player1 = new Player()
let player2 = new Player()
let rounds = 1
let currentPlayer = player1


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
    paint(selector) 
    if (isLegalMove(selector)) {
        document.querySelector('#field-farmer').parentElement.style.backgroundColor = '#7b7b7b'
    }
    let img = document.querySelector(selector)
    let farmer = document.querySelector('#field-farmer')
    img.parentElement.style.backgroundColor = '#dbdbdb'
    //console.log(img.alt)
    //console.log(selector)
    currentPlayer.typeOfPoints(img.alt)
    farmer.style.visibility = 'hidden'
    farmer.setAttribute('id', 'empty')
    img.src = 'japka//farmer.png'
    img.setAttribute('id', 'field-farmer')
    img.setAttribute('onclick', "move('#" + img.id + "')")
    play()
}    

function isLegalMove(selector) {
    let fp = ('' + (document.querySelector('#field-farmer').parentElement.id)).split('')
    let dp = document.querySelector(selector).id.split('').slice(6)
    let legalMove = (fp[0] == dp[0] && fp[1] != dp[1]) || (fp[0] != dp[0] && fp[1] == dp[1])

    //legalMove ? document.querySelector('#field-farmer').parentElement.style.backgroundColor = '#7b7b7b' : 0

    return legalMove
}


// isExactly11() (this.red == 11 && this.green == 11) ? true : false
// isLose()      (this.red > 11 || this.green > 11)   ? true : false
// isPlay()      (this.red <= 11 && this.green <= 11) ? true : false
function play() {
    if (player1.isPlay() && player2.isPlay() && !player1.isExactly11() && !player2.isExactly11()) {
        if (currentPlayer === player1) {
            currentPlayer = player2
        } else if (currentPlayer === player2) {
            currentPlayer = player1
        }
        rounds++
    } else {
        player1.isExactly11() || player2.isLose() 
            ? info.innerHTML = "Player 1 win in: " + rounds
            : info.innerHTML = "Player 2 win in: " + rounds
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
        if ((dp[0] == allP[i][0] && dp[1] != allP[i][1]) || (dp[0] != allP[i][0] && dp[1] == allP[i][1])) {
            if (tds[i].firstChild.id != 'empty') {
                tds[i].style.backgroundColor = '#1f7c98'
            }
        } else {
            if (tds[i].firstChild.id != 'empty') {
                tds[i].style.backgroundColor = '#7fbc98'
            }
        }
        if ((i + 1) % 5 == 0) col++
    }
}