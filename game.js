//Player Class
import { Player } from "./Player.js"
import { Board } from "./Board.js"

export class Game {
    gameMode
    oponent
    gameBoard
    player1
    player2

    constructor(gameMode, oponent) {
        this.gameMode = gameMode
        this.oponent = oponent
        this.player1 = new Player('rgb(31, 124, 152)', 'Player 1')
        this.player2 = new Player('rgb(196, 78, 78)', 'Player 2')
        this.gameBoard = new Board(this.player1, this.player2)
        this.play()
    }

    play() {
        this.gameBoard.showLegalMoves()
    }
}

