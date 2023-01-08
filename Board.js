import { Apple } from "./Apple.js"
import { Farmer } from "./Farmer.js"

export class Board {
    currentPlayer
    waitingPlayer
    farmer
    rounds = 0
    board
    game

    constructor(player1, player2, board, farmer, game) {
        this.board = board
        this.currentPlayer = player1
        this.waitingPlayer = player2
        this.farmer = farmer
        this.game = game
        this.createBoard(this.board)
    }

    createBoard(board) {
        let boardElement = document.querySelector('#gameBoard')
        let boardBody = document.createElement('tbody')
        let rows = 0
        board.forEach(row => {
            let boardRow = document.createElement('tr')
            boardRow.setAttribute('id', `row${rows}`)
            let fields = 0
            row.forEach(field => {
                let boardField = document.createElement('td')
                boardField.setAttribute('id', `field${rows}0${fields}`)
                let img = boardField.appendChild(document.createElement('img'))
                img.setAttribute('src', board[rows][fields].image)
                if (board[rows][fields] instanceof Apple) {
                    img.setAttribute('alt', 'apple')
                } else {
                    img.setAttribute('alt', 'farmer')
                }
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
        console.log(this.farmer)
        this.board[y][x] = this.farmer
        this.board[farmerPosition.y][farmerPosition.x] = null
        
        this.farmer.setPosition(x, y)
        this.game.changePlayers()
        this.updateBoard(this.board)
        console.log(this.game.makeOponentMove())
        // (this.game.changePlayers() && this.game.oponent == 'PVP') ? this.updateBoard(this.board) : this.game.makeOponentMove()
                       
    }

    updateBoard(board) {
        let boardElement = document.querySelector('#gameBoard')
        boardElement.innerHTML = ''
        let boardBody = document.createElement('tbody')
        let rows = 0
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
                boardRow.appendChild(boardField)
                fields++
            })
            boardBody.appendChild(boardRow)
            rows++
        });
        boardElement.appendChild(boardBody)
        this.showLegalMoves()
    }

    #lpad(value, padding) {
        var zeroes = new Array(padding + 1).join("0");
        return (zeroes + value).slice(-padding);
    }
}

