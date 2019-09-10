import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import { wsConnect } from "../actions";
import Phaser from "./phaser/phaser.min.js";

import GameScene from "./scenes/GameScene";

function mapDispatchToProps(dispatch) {
    return {
        wsConnect: () => dispatch(wsConnect())
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
          type: Phaser.AUTO,
          width: window.innerWidth,
          height: window.innerHeight,
          parent: 'phaser-game',
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
const MainGame = connect(mapStateToProps, mapDispatchToProps)(MainGameComponent);
export default MainGame;




