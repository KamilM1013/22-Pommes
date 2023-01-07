import { Apple } from "./Apple.js"
import { Farmer } from "./Farmer.js"

export class Board {
    farmer
    currentPlayer
    waitingPlayer
    rounds = 0
    board = [
        new Array(5).fill(null),
        new Array(5).fill(null),
        new Array(5).fill(null),
        new Array(5).fill(null),
        new Array(5).fill(null)
    ]
    images = [
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

    constructor(player1, player2) {
        this.farmer = new Farmer(0, 0)
        this.createBoard(this.board)
        this.currentPlayer = player1
        this.waitingPlayer = player2
    }

    changePlayers() {
        let tmp = this.currentPlayer
        if (this.currentPlayer.name == 'Player 1') {
            document.querySelector('#p1').innerHTML = `${this.currentPlayer.name}: Red: ` + this.currentPlayer.getRed() + ', Green: ' + this.currentPlayer.getGreen()
        } else {
            document.querySelector('#p2').innerHTML = `${this.currentPlayer.name}: Red: ` + this.currentPlayer.getRed() + ', Green: ' + this.currentPlayer.getGreen()
        }
        if (this.currentPlayer.isPlay() && this.waitingPlayer.isPlay() && !this.currentPlayer.isExactly11() && !this.waitingPlayer.isExactly11()) {
            document.querySelector('#whichP').innerHTML = `${this.waitingPlayer.name}'s turn`
        } else {
            this.currentPlayer.isExactly11() || this.waitingPlayer.isLose()
                ? info.innerHTML = `${this.waitingPlayer.name} wins in: ` + this.rounds + ' rounds'
                : info.innerHTML = `${this.waitingPlayer.name} wins in: ` + this.rounds + ' rounds'
            document.querySelectorAll('td').forEach(x => {let new_element = x.cloneNode(true);
                x.parentNode.replaceChild(new_element, x);
            })
            return false
        }    

        this.rounds++
        this.currentPlayer = this.waitingPlayer
        this.waitingPlayer = tmp
        return true
    }

    createBoard(board) {
        let boardElement = document.querySelector('#gameBoard')
        let boardBody = document.createElement('tbody')
        this.#shuffle(this.images)
        let rows = 0
        let imgIndex = 0
        board.forEach(row => {
            let boardRow = document.createElement('tr')
            boardRow.setAttribute('id', `row${rows}`)
            let fields = 0
            row.forEach(field => {
                let boardField = document.createElement('td')
                boardField.setAttribute('id', `field${rows}0${fields}`)
                let img = boardField.appendChild(document.createElement('img'))
                img.setAttribute('img', this.images[imgIndex])
                img.setAttribute('src', `./assets/${this.images[imgIndex]}`)
                if (this.images[imgIndex] != 'farmer.png') {
                    board[rows][fields] = new Apple(this.images[imgIndex].slice(1, 2), this.images[imgIndex].slice(0, 1), fields, rows, `./assets/${this.images[imgIndex]}`)
                    img.setAttribute('alt', 'apple')
                } else {
                    board[rows][fields] = this.farmer.setPosition(fields, rows)
                    img.setAttribute('alt', 'farmer')
                }
                imgIndex++
                boardRow.appendChild(boardField)
                fields++
            })
            boardBody.appendChild(boardRow)
            rows++
        });
        boardElement.appendChild(boardBody)
    }

    showLegalMoves() {
        let farmerPosition = this.farmer.getPosition()
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                let fieldId = this.#lpad(i * 100 + j * 1, 3)
                let field = document.querySelector(`#field${fieldId}`)
                if (field.getElementsByTagName('img').length > 0) {
                    field.style.backgroundColor = '#7fbc98'
                }
            }
        }
        for (let i = farmerPosition.y; i >= 0; i--) { //up
            let fieldId = this.#lpad(i * 100 + farmerPosition.x, 3)
            let field = document.querySelector(`#field${fieldId}`)
            //console.log(field.getElementsByTagName('img'))
            if (field.getElementsByTagName('img').length > 0) {
                field.style.backgroundColor = this.currentPlayer.color ///
                field.addEventListener('click', this.makeMove.bind(this))
            }
            //field.style.cursor = 'pointer'
        }
        for (let i = farmerPosition.y; i < 5; i++) { //down
            let fieldId = this.#lpad(i * 100 + farmerPosition.x, 3)
            let field = document.querySelector(`#field${fieldId}`)
            if (field.getElementsByTagName('img').length > 0) {
                field.style.backgroundColor = this.currentPlayer.color ///
                field.addEventListener('click', this.makeMove.bind(this))
            }
            //field.style.cursor = 'pointer'
        }
        for (let i = farmerPosition.x; i < 5; i++) { //left
            let fieldId = this.#lpad(farmerPosition.y * 100 + i, 3)
            let field = document.querySelector(`#field${fieldId}`)
            if (field.getElementsByTagName('img').length > 0) {
                field.style.backgroundColor = this.currentPlayer.color ///
                field.addEventListener('click', this.makeMove.bind(this))
            }
            //field.style.cursor = 'pointer'
        }
        for (let i = farmerPosition.x; i >= 0; i--) { //right
            let fieldId = this.#lpad(farmerPosition.y * 100 + i, 3)
            let field = document.querySelector(`#field${fieldId}`)
            if (field.getElementsByTagName('img').length > 0) {
                field.style.backgroundColor = this.currentPlayer.color ///
                field.addEventListener('click', this.makeMove.bind(this))
            }
            //field.style.cursor = 'pointer'
        }
        let fieldId = this.#lpad(farmerPosition.y * 100 + farmerPosition.x, 3)
        let field = document.querySelector(`#field${fieldId}`)
        field.style.backgroundColor = 'lightgrey' ///
        //field.style.cursor = 'not-allowed'
    }

    makeMove = event => {
        let field = event.target.parentElement
        if (document.querySelector(`#${field.id}`).style.backgroundColor != this.currentPlayer.color) return
        let farmerPosition = this.farmer.getPosition()
        let y = parseInt(field.id.substring(5, 6))
        let x = parseInt(field.id.substring(7, 8))
        if (this.board[y][x] instanceof Apple) {
            let points = this.board[y][x]
            this.currentPlayer.typeOfPoints(points)
            console.log(this.currentPlayer.getRed() + ' ' + this.currentPlayer.getGreen())
        }
        this.board[y][x] = this.farmer
        this.board[farmerPosition.y][farmerPosition.x] = null
        this.farmer.setPosition(x, y)

        if (this.changePlayers()) this.updateBoard(this.board)        
    }

    updateBoard(board) {
        let boardElement = document.querySelector('#gameBoard')
        boardElement.innerHTML = ''
        let boardBody = document.createElement('tbody')
        let rows = 0
        let imgIndex = 0
        board.forEach(row => {
            let boardRow = document.createElement('tr')
            boardRow.setAttribute('id', `row${rows}`)
            let fields = 0
            row.forEach(field => {
                let boardField = document.createElement('td')
                boardField.setAttribute('id', `field${rows}0${fields}`)
                if (board[rows][fields] instanceof Apple) {
                    let apple = board[rows][fields]
                    let img = boardField.appendChild(document.createElement('img'))
                    img.setAttribute('src', apple.image)
                    img.setAttribute('alt', 'apple')
                }
                else if (board[rows][fields] instanceof Farmer) {
                    let img = boardField.appendChild(document.createElement('img'))
                    img.setAttribute('src', this.farmer.image)
                    img.setAttribute('alt', 'farmer')
                } else {
                    boardField.style.backgroundColor = 'darkgray'
                }
                imgIndex++
                boardRow.appendChild(boardField)
                fields++
            })
            boardBody.appendChild(boardRow)
            rows++
        });
        boardElement.appendChild(boardBody)
        this.showLegalMoves()
    }

    // play() {
    //     if (this.currentPlayer.isPlay() && this.waitingPlayer.isPlay() && !this.currentPlayer.isExactly11() && !this.waitingPlayer.isExactly11()) {
    //             document.querySelector('#whichP').innerHTML = "Player 2's turn"
    //             document.querySelector('#whichP').innerHTML = "Player 1's turn"
    //     } else {
    //         player1.isExactly11() || player2.isLose()
    //             ? info.innerHTML = 'Player 1 wins in: ' + rounds + ' rounds'
    //             : info.innerHTML = 'Player 2 wins in: ' + rounds + ' rounds'
    //         document.querySelectorAll('td').forEach(x => x.firstChild.setAttribute('onclick', null))
    //     }
    //     document.querySelector('#p1').innerHTML = 'Player 1: Red: ' + player1.getRed() + ', Green: ' + player1.getGreen()
    //     document.querySelector('#p2').innerHTML = 'Player 2: Red: ' + player2.getRed() + ', Green: ' + player2.getGreen()
    // }

    #shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let k = array[i]
            array[i] = array[j]
            array[j] = k
        }
        return array
    }

    #lpad(value, padding) {
        var zeroes = new Array(padding + 1).join("0");
        return (zeroes + value).slice(-padding);
    }
}

