import React, { Component } from "react";
import { connect } from "react-redux";
import Phaser from "./phaser/phaser.min.js";

import GameScene from "./scenes/GameScene";

function mapDispatchToProps(dispatch) {
    return {

    };
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        actualGame: state.actualGame
    };
};


class GameComponentComponent extends Component {
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
            <div id="phaser-game" />
        );
    }
}
const GameComponent = connect(mapStateToProps, mapDispatchToProps)(GameComponentComponent);
export default GameComponent;