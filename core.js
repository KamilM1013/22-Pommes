import { Player } from "./Player.js"
import { Board } from "./Board.js"
import { Farmer } from "./Farmer.js"
import { Apple } from "./Apple.js"
import { Game } from "./Game.js"

window.onload = () => {
    //new Game(1, 1)
    document.querySelector('.start').addEventListener('click', start)
}

function start() {
    let mode1 = document.querySelector('#mode1').value
    let mode2 = document.querySelector('#mode2').value
    new Game(mode1, mode2)
}