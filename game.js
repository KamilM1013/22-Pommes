//Player Class
import { Player } from "./Player.js"
import { Board } from "./Board.js"
import { Farmer } from "./Farmer.js"
import { Apple } from "./Apple.js"
import { Random } from "./Random.js"

export class Game {
    gameMode
    oponent
    gameBoard
    farmer
    player1
    player2
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
        let tmp = this.gameBoard.currentPlayer
        if (this.gameBoard.currentPlayer.name == 'Player 1') {
            document.querySelector('#p1').innerHTML = `${this.gameBoard.currentPlayer.name}: Red: ` + this.gameBoard.currentPlayer.getRed() + ', Green: ' + this.gameBoard.currentPlayer.getGreen()
        } else {
            document.querySelector('#p2').innerHTML = `${this.gameBoard.currentPlayer.name}: Red: ` + this.gameBoard.currentPlayer.getRed() + ', Green: ' + this.gameBoard.currentPlayer.getGreen()
        }
        if (this.gameBoard.currentPlayer.isPlay() && this.gameBoard.waitingPlayer.isPlay() && !this.gameBoard.currentPlayer.isExactly11() && !this.gameBoard.waitingPlayer.isExactly11()) {
            document.querySelector('#whichP').innerHTML = `${this.gameBoard.waitingPlayer.name}'s turn`
        } else {
            this.gameBoard.currentPlayer.isExactly11() || this.gameBoard.waitingPlayer.isLose()
                ? info.innerHTML = `${this.gameBoard.waitingPlayer.name} wins in: ` + this.gameBoard.rounds + ' rounds'
                : info.innerHTML = `${this.gameBoard.waitingPlayer.name} wins in: ` + this.gameBoard.rounds + ' rounds'
            document.querySelectorAll('td').forEach(x => {
                let new_element = x.cloneNode(true);
                x.parentNode.replaceChild(new_element, x);
            })
            return false
        }

        this.gameBoard.rounds++
        this.gameBoard.currentPlayer = this.gameBoard.waitingPlayer
        this.gameBoard.waitingPlayer = tmp
        return true
    }

    makeOponentMove() {
        // new Promise(async resolve => {
        //     await resolve(this.player2.makeMove())
        // }).then(() => {
        //     this.changePlayers()
        // }).catch(exc => {
        //     console.log(JSON.parse(exc))
        // })
        if (this.player2.makeMove() instanceof Board) {
            this.changePlayers()
            this.gameBoard.updateBoard()
        }
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
