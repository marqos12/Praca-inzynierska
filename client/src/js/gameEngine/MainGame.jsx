import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';

import GameComponent from "./GameComponent.jsx";
import { gameWsGameJoin, gameMyNewTile } from "../actions/gameActions.js";
import { wsSendMessage } from "../actions/index.js";
import TileDetails from "../components/gameComponents/TileDetails.jsx";

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
            openMenu: false,
            posiInRank: 1,
            userWithtile: null,
            toNextRound: 0
        }
        this.commitNewTilePosiotion = this.commitNewTilePosiotion.bind(this)
        this.openMenu = this.openMenu.bind(this)
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
        else if (window.innerWidth < 700 && this.state.gameJoined && this.props.ws.client) {
            let pos = this.props.actualGame.gamers.sort((x, y) => { return y.points - x.points }).findIndex(gamer => gamer.id == this.props.actualGame.meGamer.id) + 1
            if (pos != this.state.posiInRank)
                this.setState(Object.assign({}, this.state, {
                    posiInRank: pos
                }))

            let userWithtile = this.props.actualGame.gamers.filter(x => x.withTile)[0];
            if (this.state.userWithtile && userWithtile && this.state.userWithtile.id != userWithtile.id || !this.state.userWithtile && userWithtile) {


                let pos = this.props.actualGame.meGamer.ordinalNumber;
                pos = pos < userWithtile.ordinalNumber ? this.props.actualGame.gamers.length - (userWithtile.ordinalNumber - pos) : pos - userWithtile.ordinalNumber

                this.setState(Object.assign({}, this.state, {
                    toNextRound: pos,
                    userWithtile: userWithtile
                }))

            }

            
        }
    }

    commitNewTilePosiotion() {
        let dataExchange = this.props.actualGame.myNewTile.getTileObj();
        dataExchange.gamerId = this.props.actualGame.meGamer.id;
        this.props.gameMyNewTile(null)
        this.props.wsSendMessage({ channel: "/game/saveTile", payload: dataExchange });
    }

    openMenu() {
        this.setState({
            gameJoined: this.state.gameJoined,
            openMenu: true
        })
    }

    closeMenu() {
        this.setState({
            gameJoined: this.state.gameJoined,
            openMenu: false
        })
    }

    render() {
        const { actualGame, } = this.props;
        const { openMenu } = this.state
        return (
            <div>
                <GameComponent />
                <div className="hud">
                    <div className="hud_card menuButton" onClick={this.openMenu}>
                        <img src="assets/menuB.png"></img>
                    </div>
                    <div className="hud_card timer">
                        <img src="assets/timer.png"></img>
                        <span className="onSmallinvisible">Upłynęło czasu: </span>15:11
                        <br />
                        <img src="assets/left.png"></img>
                        <span className="onSmallinvisible">Upłynęło rund: </span>{actualGame.game.elapsed + "/" + actualGame.game.gameLimit}
                    </div>
                    <div className="hud_card gamersList">
                        {actualGame.gamers.map((value, index) => {
                            return <div key={index}>
                                {value.withTile ? <div><img src="assets/arrow.png"></img><b>{value.user.username}</b></div> : <div> <img src="assets/null.png"></img>{value.user.username}</div>}
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
                        <div className="onSmallVisible">
                            <img src="assets/R.png"></img>   {this.state.posiInRank} /  {actualGame.gamers.length}
                        </div>
                        <div className="onSmallVisible">
                            <img src="assets/left.png"></img>   {this.state.toNextRound}
                        </div>
                    </div>
                    <div className="hud_card rank">
                        {actualGame.gamers.sort((x, y) => { return y.points - x.points }).map((value, index) => {
                            return <div key={index}>
                                <img src={"assets/" + (index + 1) + ".png"}></img>
                                {value.user.username}
                                <span className="onSmallinvisible">({value.points})</span>
                            </div>
                        })}
                    </div>
                    {actualGame.tileDetails != null ?
                        <div className="hud_card tileDetails">
                            <TileDetails />
                        </div> : <div></div>
                    }

                </div>
                {openMenu ? <div className="inGameMenu">

                    <div className="container">
                        <div className="menuContent">
                            <h1 className="gameTitle">MENU</h1>

                            <div className="buttonList">
                                <a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.closeMenu}>Powrót do gry</a>
                                <a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.logout}>Opcje</a>
                                <a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.logout}>Opuść grę</a>
                            </div>
                        </div>
                    </div>
                </div> : <div></div>}
            </div>
        );
    }
}
const MainGame = connect(mapStateToProps, mapDispatchToProps)(MainGameComponent);
export default MainGame;




