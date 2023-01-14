import { Player } from "./Player.js"

export class Random extends Player {
    script = 'random'

    makeMove(legalMoves, board, farmer) {
        let move = legalMoves[Math.floor(Math.random() * legalMoves.length)]
        let farmerPosition = farmer.getPosition()
        this.typeOfPoints(board[move.y][move.x])
        board[farmerPosition.y][farmerPosition.x] = null
        board[move.y][move.x] = farmer
        farmer.setPosition(move.x, move.y)
        return board
    }
}
