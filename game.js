//Player Class
import { Player } from "./Player.js"
import { Board } from "./Board.js"
import { Farmer } from "./Farmer.js"
import { Apple } from "./Apple.js"
import { Random } from "./Random.js"
import { Mcts } from "./Mcts.js"

export class Game {
    gameMode
    oponent
    gameBoard
    farmer
    player1
    player2
    gameOver = false
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

    constructor(gameMode, oponent) {
        this.clearBoard()
        this.gameMode = gameMode
        this.oponent = oponent
        switch (this.oponent) {
            case 'PVP':
                this.player1 = new Player('rgb(31, 124, 152)', 'Player 1')
                this.player2 = new Player('rgb(196, 78, 78)', 'Player 2')
                break;
            case 'PVE':
                this.player1 = new Player('rgb(31, 124, 152)', 'Player 1')
                switch (this.gameMode) {
                    case 'random':
                        this.player2 = new Random('rgb(196, 78, 78)', 'Player 2')
                        break;
                    case 'montecarlotreesearch':
                        this.player2 = new Mcts('rgb(196, 78, 78)', 'Player 2')
                        break;
                    default:
                        break;
                }
                break;
            case 'EVE':
                this.player1 = new Random('rgb(31, 124, 152)', 'Player 1')
                switch (this.gameMode) {
                    case 'random':
                        this.player2 = new Random('rgb(196, 78, 78)', 'Player 2')
                        break;
                    case 'montecarlotreesearch':
                        this.player2 = new Mcts('rgb(196, 78, 78)', 'Player 2')
                        break;
                    default:
                        break;
                }
            default:
                break;
        }

        let board = this.prepareBoard(this.board)
        this.gameBoard = new Board(this.player1, this.player2, board, this.farmer, this)
        this.play()
    }

    clearBoard() {
        document.querySelector('#gameBoard').innerHTML = ''
    }

    play() {
        if (this.oponent == 'PVP') {
            this.gameBoard.showLegalMoves()
        } else if (this.oponent == 'PVE') {
            this.gameBoard.showLegalMoves()
        } else if (this.oponent == 'EVE') {
            this.gameBoard.showLegalMoves()
            document.querySelector('.step').addEventListener('click', this.step.bind(this))
        }
    }

    prepareBoard(board) {
        this.#shuffle(this.images)
        let rows = 0
        let imgIndex = 0
        board.forEach(row => {
            let fields = 0
            row.forEach(field => {
                if (this.images[imgIndex] != 'farmer.png') {
                    board[rows][fields] = new Apple(this.images[imgIndex].slice(1, 2), this.images[imgIndex].slice(0, 1), fields, rows, `./assets/${this.images[imgIndex]}`)
                } else {
                    this.farmer = new Farmer(fields, rows)
                    board[rows][fields] = this.farmer
                }
                imgIndex++
                fields++
            })
            rows++
        })
        return board
    }

    changePlayers() {
        let result = false
        this.countPoints()
        if (!this.gameOver) {
            if (this.oponent == 'EVE') {
                this.gameBoard.rounds++
                this.gameBoard.currentPlayer === this.player1 ? this.gameBoard.currentPlayer = this.player2 : this.gameBoard.currentPlayer = this.player1
                this.countPoints()
                return
            } else {
                if (this.gameBoard.waitingPlayer.script == 'random') {
                    this.gameBoard.rounds++
                    this.gameBoard.currentPlayer === this.player1 ? this.gameBoard.currentPlayer = this.player2 : this.gameBoard.currentPlayer = this.player1
                    let board = this.makeOponentMove(this.gameBoard.currentPlayer)
                    if (board instanceof Array) result = board
                    this.countPoints()
                } else if (this.gameBoard.waitingPlayer.script == 'montecarlotreesearch') {
                    this.gameBoard.rounds++
                    this.gameBoard.currentPlayer === this.player1 ? this.gameBoard.currentPlayer = this.player2 : this.gameBoard.currentPlayer = this.player1
                    let board = this.makeOponentMove(this.gameBoard.currentPlayer)
                    if (board instanceof Array) result = board
                    this.countPoints()
                }
                this.gameBoard.rounds++
                this.gameBoard.currentPlayer === this.player1 ? this.gameBoard.currentPlayer = this.player2 : this.gameBoard.currentPlayer = this.player1
                if (!this.gameBoard.waitingPlayer.script) {
                    result = true
                }
            }
        }
        return result
    }

    countPoints() {   
        // console.log(this.player1)
        // console.log(this.player2)
        document.querySelector('#p1').innerHTML = `${this.player1.name}: Red: `
            + this.player1.getRed() + ', Green: ' + this.player1.getGreen()
        
        document.querySelector('#p2').innerHTML = `${this.player2.name}: Red: `
                + this.player2.getRed() + ', Green: ' + this.player2.getGreen()
        
        if (this.player1.isPlay() && this.player2.isPlay()
            && !this.player1.isExactly11() && !this.player2.isExactly11()) {
            document.querySelector('#whichP').innerHTML = `${this.gameBoard.currentPlayer.name}'s turn`
        } else {
            this.player1.isExactly11() || this.player2.isLose()
                ? info.innerHTML = `${this.player1.name} wins in: ` + this.gameBoard.rounds + ' rounds'
                : info.innerHTML = `${this.player2.name} wins in: ` + this.gameBoard.rounds + ' rounds'
            document.querySelectorAll('td').forEach(x => {
                let new_element = x.cloneNode(true);
                x.parentNode.replaceChild(new_element, x);
            })
            this.gameOver = true
        }
    }

    makeOponentMove(player) {
        let legalMoves = player.getLegalMoves(this.board, this.farmer.getPosition())
        return player.makeMove(legalMoves, this.board, this.farmer, this)
    }

    step() {
        let board = this.makeOponentMove(this.gameBoard.currentPlayer)
        this.changePlayers()
        this.gameBoard.showMove(board)
    }

    #shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let k = array[i]
            array[i] = array[j]
            array[j] = k
        }
        return array
    }
}
