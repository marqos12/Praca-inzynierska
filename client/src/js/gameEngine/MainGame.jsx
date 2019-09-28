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
                <div> asd </div>
            </div>
        );
    }
}
const MainGame = connect(mapStateToProps, mapDispatchToProps)(MainGameComponent);
export default MainGame;




