import React, { Component } from "react";
import { connect } from "react-redux";

import GameComponent from "./GameComponent.jsx";
import { gameWsGameJoin, gameMyNewTile } from "../actions/gameActions.js";
import { wsSendMessage } from "../actions/index.js";

function mapDispatchToProps(dispatch) {
    return {
        gameWsGameJoin: payload => dispatch(gameWsGameJoin(payload)),
        wsSendMessage: payload => dispatch(wsSendMessage(payload)),
        gameMyNewTile:payload=> dispatch(gameMyNewTile(payload))
    };
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        actualGame: state.actualGame,
        ws: state.ws
    };
};

class MainGameComponent extends Component {
    constructor() {
        super();
        this.state = {
            gameJoined: false,
        }
        this.commitNewTilePosiotion = this.commitNewTilePosiotion.bind(this)
    }

    componentDidMount(){
        console.log("MainGame 33 - componentDidMount")
        if (!this.state.gameJoined && this.props.ws.client) {
            console.log("MainGame 31")
            this.props.gameWsGameJoin(this.props.actualGame.game)
            this.setState({
                gameJoined: true,
            })
        }
    }

    componentDidUpdate() {
        console.log("MainGame 33 - componentDidUpdate")
        if (!this.state.gameJoined && this.props.ws.client) {
            console.log("MainGame 31")
            this.props.gameWsGameJoin(this.props.actualGame.game)
            this.setState({
                gameJoined: true,
            })
        }
    }

    commitNewTilePosiotion() {
        let dataExchange = this.props.actualGame.myNewTile.getTileObj();
        dataExchange.gamerId = this.props.actualGame.meGamer.id;
        console.log("MainGame 47 ",dataExchange)
        this.props.gameMyNewTile(null)
        this.props.wsSendMessage({ channel: "/game/saveTile", payload: dataExchange });
    }

    render() {
        const { actualGame } = this.props;
        return (
            <div>
                <GameComponent />
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
                            <img src="assets/null.png"></img>Józef S
                        </div>
                    </div>
                    {actualGame.newTileInGoodlPlace ? <div className="hud_card newTile">
                        <a className="button is-large  is-link is-rounded newTileButton" onClick={this.commitNewTilePosiotion}>Zatwierdź</a>
                    </div> : <div />}
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




