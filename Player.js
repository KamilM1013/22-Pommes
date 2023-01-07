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
}