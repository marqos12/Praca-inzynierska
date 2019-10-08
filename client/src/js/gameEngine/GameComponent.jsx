import React, { Component } from "react";
import { connect } from "react-redux";

import GameScene from "./scenes/GameScene";
import { gameWsGameDisconnect, gameWsGameJoin } from "../actions/gameActions.js";

function mapDispatchToProps(dispatch) {
    return {
        gameWsGameDisconnect: () => dispatch(gameWsGameDisconnect())
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
            backgroundColor: "#235a15",
            scene: [GameScene]
        }


        new Phaser.Game(config)
    }

    componentWillUnmount(){
        this.props.gameWsGameDisconnect();
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