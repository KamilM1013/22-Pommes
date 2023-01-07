export class Apple {
    color
    value
    position = {x:null, y:null}
    image

    constructor(color, value, x, y, image) {
        this.color = color
        this.value = value
        this.position.x = x
        this.position.y = y
        this.image = image
    }
}