export class Player {
    green = 0
    red = 0
    color
    name

    constructor(color, name) {
        this.color = color
        this.name = name
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
        // console.log(typeof src.value)
        return src.color == "r" ? this.setRed(src.value - 0) : this.setGreen(src.value - 0)
    }

    getLegalMoves(board, farmerPosition) {
        let legalMoves = []

        for (let i = farmerPosition.y - 1; i >= 0; i--) { //up
            if (board[i][farmerPosition.x] !== null) {
                legalMoves.push({ x: farmerPosition.x, y: i })
            }
        }
        for (let i = farmerPosition.y + 1; i < 5; i++) { //down
            if (board[i][farmerPosition.x] !== null) {
                legalMoves.push({ x: farmerPosition.x, y: i })
            }
        }
        for (let i = farmerPosition.x + 1; i < 5; i++) { //left
            if (board[farmerPosition.y][i] !== null) {
                legalMoves.push({ x: i, y: farmerPosition.y })
            }
        }
        for (let i = farmerPosition.x - 1; i >= 0; i--) { //right
            if (board[farmerPosition.y][i] !== null) {
                legalMoves.push({ x: i, y: farmerPosition.y })
            }
        }
        console.log(legalMoves)
        return legalMoves
    }
}
