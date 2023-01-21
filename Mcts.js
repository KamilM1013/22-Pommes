import { Farmer } from "./Farmer.js"
import { Player } from "./Player.js"

export class Mcts extends Player {
    script = 'mcts'
    c = Math.sqrt(2)
    seconds = 6

    makeMove(legalMoves, board, farmer, game) {
        game.player1.savePointsState()
        game.player2.savePointsState()
        let move = this.monteCarloTreeSearch(board, legalMoves, farmer, game)
        let farmerPosition = farmer.getPosition()
        game.player1.loadPointsState()
        game.player2.loadPointsState()
        this.typeOfPoints(board[move[1].y][move[1].x])
        board[farmerPosition.y][farmerPosition.x] = null
        board[move[1].y][move[1].x] = farmer
        farmer.setPosition(move[1].x, move[1].y)
        return board
    }

    monteCarloTreeSearch(board, legalMoves, farmer, game) {
        let root = {
            board: board,
            parent: null,
            children: [],
            possibleMoves: legalMoves,
            farmer: farmer,
            move: null,
            currentPlayer: game.gameBoard.currentPlayer,
            game: game,
            visits: 0,
            wins: 0
        }
        //console.log(root.currentPlayer)
        let startTime = Date.now();
        while ((Date.now() - startTime) < (this.seconds * 1000)) {
            let current = this.treePolicy(root)
            let reward = this.defaultPolicy(current)
            this.backup(current, reward)
        }

        let maxVisits = -Infinity
        let bestChild = null
        root.children.forEach(child => {
            if (child.visits > maxVisits) {
                maxVisits = child.visits
                bestChild = child
            }
        })
        let winingProbability = `${bestChild.wins}/${bestChild.visits}`
        return [winingProbability, bestChild.move]
    }

    backup(node, reward) {
        while (node != null) {
            node.visits += 1
            node.wins += reward
            node = node.parent
        }
    }

    treePolicy(node) {
        while (!this.isFinalState(node.game)) {
            if (node.possibleMoves.length != 0) {
                return this.expand(node)
            } else {
                node = this.bestChild(node)
            }
        }
        //to prevent from selecting branch with loosing option
        if (this.whoWon(node) != this) {
            node.wins = Number.MIN_SAFE_INTEGER
        }
        return node
    }

    defaultPolicy(node) {
        let gameBoardCopy = JSON.parse(JSON.stringify(node.board))
        let possibleMovesCopy = JSON.parse(JSON.stringify(node.possibleMoves))
        let currentPlayerCopy = this.makePlayerCopy(node.currentPlayer)
        while (!this.isFinalState(node.game)) {
            let randomNumber = this.randomIntFromInterval(0, node.possibleMoves.length - 1)
            let currentMove = node.possibleMoves[randomNumber]
            this.moveFarmer(node.farmer, currentMove, node.board, node.currentPlayer)
            node.currentPlayer = (node.currentPlayer == node.game.player1) ? node.game.player2 : node.game.player1
            node.possibleMoves = this.getLegalMoves(node.board, node.farmer.getPosition())
        }
        let reward = (this.whoWon(node) == this) ? 1 : -1
        node.board = gameBoardCopy
        node.possibleMoves = possibleMovesCopy
        node.currentPlayer = currentPlayerCopy
        return reward
    }

    isFinalState(game) {
        return !((game.player1.isPlay() && game.player2.isPlay()) && (!game.player1.isExactly11() && !game.player2.isExactly11()))
    }

    expand(node) {
        let index = this.randomIntFromInterval(0, node.possibleMoves.length - 1)
        let move = node.possibleMoves[index]
        let boardCopy = JSON.parse(JSON.stringify(node.board))
        let farmerCopy = new Farmer(node.farmer.position.x, node.farmer.position.y)
        this.moveFarmer(farmerCopy, move, boardCopy, node.currentPlayer)
        let child = {
            board: boardCopy,
            parent: node,
            children: [],
            possibleMoves: [],
            farmer: farmerCopy,
            move: move,
            currentPlayer: (node.currentPlayer == node.game.player1) ? node.game.player2 : node.game.player1,
            game: node.game,
            visits: 0,
            wins: 0,
        }
        child.possibleMoves = this.getLegalMoves(child.board, child.farmer.getPosition())
        node.possibleMoves.splice(index, 1)
        node.children.push(child)
        return child
    }

    bestChild(node) {
        let value = -Infinity
        let best = null
        node.children.forEach(child => {
            let childValue = (child.wins / child.visits) + (this.c * Math.sqrt(Math.log(node.visits) / child.visits))
            if (childValue > value) {
                best = child
                value = childValue
            }
        })
        return best
    }

    whoWon(node) {
        let secondPlayer = node.currentPlayer === node.game.player1 ? node.game.player2 : node.game.player1
        if ((node.currentPlayer.isLose() && secondPlayer.isPlay()) || secondPlayer.isExactly11()) {
            return secondPlayer
        } else if ((secondPlayer.isLose() && node.currentPlayer.isPlay()) || node.currentPlayer.isExactly11()) {
            return node.currentPlayer
        }
        return null
    }

    randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    moveFarmer(farmer, move, board, currentPlayer) {
        let farmerPosition = farmer.getPosition()
        //console.log(farmerPosition, move)
        if (board[move.y][move.x] !== null && (move.y !== farmerPosition.y && move.x !== farmerPosition.x)) return
        currentPlayer.typeOfPoints(board[move.y][move.x])
        board[farmerPosition.y][farmerPosition.x] = null
        board[move.y][move.x] = farmer
        farmer.setPosition(move.x, move.y)
        return board
    }

    makePlayerCopy(currentPlayer) {
        let playerCopy = new Mcts('rgb(196, 78, 78)', 'Player 2')
        playerCopy.setGreen(currentPlayer.getGreen())
        playerCopy.setRed(currentPlayer.getRed())
        return playerCopy
    }
}
