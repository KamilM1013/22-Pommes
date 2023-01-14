import { Player } from "./Player.js"
import { Board } from "./Board.js"
import { Farmer } from "./Farmer.js"
import { Apple } from "./Apple.js"
import { Game } from "./Game.js"

window.onload = () => {
    //new Game(1, 1)
    document.querySelector('.start').addEventListener('click', start)
    document.querySelector('#mode2').addEventListener('change', change)
    function change() {
        let d = document.querySelector('#mode2').value;
        if (d !== 'PVP') {
            document.querySelector('#mode1').style.removeProperty('visibility')
        } else {
            document.querySelector('#mode1').style.visibility = 'hidden'
        }
    }
}

function start() {
    let mode1 = document.querySelector('#mode1').value
    let mode2 = document.querySelector('#mode2').value
    if (document.querySelector('#mode2').value === 'EVE') {
        document.querySelector('.step').style.removeProperty('visibility')
    }
    new Game(mode1, mode2)
}