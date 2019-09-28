import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import { wsConnect } from "../actions";
import Phaser from "./phaser/phaser.min.js";

import GameScene from "./scenes/GameScene";

function mapDispatchToProps(dispatch) {
    return {

    };
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};



class MainGameComponent extends Component {
    constructor() {
        super();


    }

    componentDidMount() {
        const config = {
            title: "Moje miasto",
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: 'phaser-game',
            physics: {
                default: "arcade",
                arcade: {
                    debug: false
                }
            },
            backgroundColor: "#3131ff",
            scene: [GameScene]
        }

        new Phaser.Game(config)
    }

    shouldComponentUpdate() {
        return false
    }
    render() {

        return (
            <div>
                <div id="phaser-game" />
                <div className="hud">
                    <div className="hud_card timer">
                        <img src="assets/timer.png"></img>
                        Upłynęło czasu: 15:11
                        <br />
                        <img src="assets/left.png"></img>
                        Upłynęło rund: 15/45
                    </div>
                    <div className="hud_card gamersList">
                        <div>
                            <img src="assets/arrow.png"></img>Stefan
                        </div>
                        <div>
                            <img src="assets/null.png"></img>Józef
                        </div>
                    </div>
                    <div className="hud_card newTile">

                    </div>
                    <div className="hud_card resources">
                        <div >
                            <img src="assets/duck.png"></img>
                            1000
                        </div>
                        <div>
                            <img src="assets/P.png"></img>
                            99
                        </div>
                    </div>
                    <div className="hud_card rank">
                        <div>
                            <img src="assets/1.png"></img>Stefan 100P
                        </div>
                        <div>
                            <img src="assets/2.png"></img>Józef 99P
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const MainGame = connect(mapStateToProps, mapDispatchToProps)(MainGameComponent);
export default MainGame;




