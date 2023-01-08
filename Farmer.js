export class Farmer {
    position = { x: null, y: null }
    image = './assets/farmer.png'

    constructor(x, y) {
        this.position.x = x
        this.position.y = y
    }

    setPosition(x, y) {
        this.position.x = x
        this.position.y = y
        return this
    }
    getPosition() {
        return this.position
    }
}