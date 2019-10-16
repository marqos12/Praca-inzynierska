import React, { Component } from "react";
import { connect } from "react-redux";

import GameComponent from "./GameComponent.jsx";
import { gameWsGameJoin, gameMyNewTile } from "../actions/gameActions.js";
import { wsSendMessage } from "../actions/index.js";

function mapDispatchToProps(dispatch) {
    return {
        gameWsGameJoin: payload => dispatch(gameWsGameJoin(payload)),
        wsSendMessage: payload => dispatch(wsSendMessage(payload)),
        gameMyNewTile: payload => dispatch(gameMyNewTile(payload))
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

    componentDidMount() {
        if (!this.state.gameJoined && this.props.ws.client) {
            this.props.gameWsGameJoin(this.props.actualGame.game)
            this.setState({
                gameJoined: true,
            })
        }
    }

    componentDidUpdate() {
        if (!this.state.gameJoined && this.props.ws.client) {
            this.props.gameWsGameJoin(this.props.actualGame.game)
            this.setState({
                gameJoined: true,
            })
        }
    }

    commitNewTilePosiotion() {
        let dataExchange = this.props.actualGame.myNewTile.getTileObj();
        dataExchange.gamerId = this.props.actualGame.meGamer.id;
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
                        Upłynęło rund: {actualGame.game.elapsed + "/" + actualGame.game.gameLimit}
                    </div>
                    <div className="hud_card gamersList">
                        {actualGame.gamers.map((value, index) => {
                            return <div key={index}>
                                {value.withTile ? <img src="assets/arrow.png"></img> : <img src="assets/null.png"></img>}{value.user.username}
                            </div>
                        })}
                    </div>
                    {actualGame.newTileInGoodlPlace ? <div className="hud_card newTile">
                        <a className="button is-large  is-link is-rounded newTileButton" onClick={this.commitNewTilePosiotion}>Zatwierdź</a>
                    </div> : <div />}
                    <div className="hud_card resources">
                        <div >
                            <img src="assets/duck.png"></img>
                            {actualGame.meGamer.ducklings}d ({actualGame.meGamer.ducklingsPerRound}d/t)
                        </div>
                        <div>
                            <img src="assets/P.png"></img>
                            {actualGame.meGamer.points}
                        </div>
                    </div>
                    <div className="hud_card rank">
                        {actualGame.gamers.sort((x, y) => { return x.posints - y.points }).map((value, index) => {
                            return <div key={index}>
                                <img src={"assets/" + (index + 1) + ".png"}></img>{value.user.username}
                            </div>
                        })}
                    </div>
                </div>
            </div>
        );
    }
}
const MainGame = connect(mapStateToProps, mapDispatchToProps)(MainGameComponent);
export default MainGame;




