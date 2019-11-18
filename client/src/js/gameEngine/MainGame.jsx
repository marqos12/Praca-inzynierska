import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';

import GameComponent from "./GameComponent.jsx";
import { gameWsGameJoin, gameMyNewTile } from "../actions/gameActions.js";
import { wsSendMessage, wsGameDisconnect } from "../actions/index.js";
import TileDetails from "../components/gameComponents/TileDetails.jsx";

function mapDispatchToProps(dispatch) {
    return {
        gameWsGameJoin: payload => dispatch(gameWsGameJoin(payload)),
        wsSendMessage: payload => dispatch(wsSendMessage(payload)),
        gameMyNewTile: payload => dispatch(gameMyNewTile(payload)),
        wsGameDisconnect: payload => dispatch(wsGameDisconnect(payload))
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
            toNextRound: 0,
            refresh: 0,
            refreshInterval: null
        }
        this.commitNewTilePosiotion = this.commitNewTilePosiotion.bind(this)
        this.openMenu = this.openMenu.bind(this)
        this.closeMenu = this.closeMenu.bind(this)
        this.leaveGame = this.leaveGame.bind(this)
        this.getGamersResult = this.getGamersResult.bind(this)
        this.continueGame = this.continueGame.bind(this)
    }

    componentDidMount() {
        if (!this.state.gameJoined && this.props.ws.client) {
            this.props.gameWsGameJoin(this.props.actualGame.game)
            this.setState({
                gameJoined: true,
            })
        }
        this.setState({
            refreshInterval: setInterval(() => {
                this.setState({ refresh: this.state.refresh + 1 })
            }, 1000)
        })

    }
    componentWillUnmount() {
        clearInterval(this.state.refreshInterval);
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

    leaveGame(){
        
        this.props.wsGameDisconnect();
    }

    closeMenu() {
        this.setState({
            gameJoined: this.state.gameJoined,
            openMenu: false
        })
    }

    getTimer(actualGame) {
        let minutes = "00";
        let seconds = "00";
        let limitMinutes = "00";
        let limitSeconds = "00";
        if (actualGame && actualGame.game) {
            minutes = Math.floor((new Date().getTime() / 1000 - actualGame.game.startTime) / 60);
            seconds = Math.floor((new Date().getTime() / 1000 - actualGame.game.startTime) % 60)
            if (minutes < 10) minutes = "0" + minutes;
            if (seconds < 10) seconds = "0" + seconds;

            if(actualGame.game.endType=="TIME_LIMIT"){
                limitMinutes = Math.floor((actualGame.game.gameLimit - actualGame.game.startTime) / 60);
                limitSeconds = Math.floor((actualGame.game.gameLimit - actualGame.game.startTime) % 60)
                if (limitMinutes < 10) limitMinutes = "0" + limitMinutes;
                if (limitSeconds < 10) limitSeconds = "0" + limitSeconds;
            }
        }
        return { minutes: minutes, seconds: seconds, limitMinutes: limitMinutes, limitSeconds: limitSeconds  }
    }

    getGamersResult(){
        let tab = [];
        let rankPoint = this.props.actualGame.gamers.sort((x, y) => { return y.points - x.points })
        let rankDucklings = this.props.actualGame.gamers.sort((x, y) => { return y.ducklings - x.ducklings })
        for(let i = 0; i < rankPoint.length;i++){
            tab.push({points:rankPoint[i],ducklings:rankDucklings[i]})
        }
        return tab;
    }

    continueGame(){
        let game = this.props.actualGame.game;
        game.endType = "ENDLESS";
        game.ended = false;

        this.props.wsSendMessage({
            channel: "/lobby/updateGame", payload: game
        })
    }

    render() {
        const { actualGame, } = this.props;
        const { openMenu } = this.state
        const timer = this.getTimer(actualGame)
        const result = this.getGamersResult();
        return (
            <div>
                <GameComponent />
                <div className="hud">
                    <div className="hud_card menuButton" onClick={this.openMenu}>
                        <img src="assets/menuB.png"></img>
                    </div>
                    <div className="hud_card timer">
                        <img src="assets/timer.png"></img>
                        <span className="onSmallinvisible">Upłynęło czasu: </span>{timer.minutes}:{timer.seconds}
                        <br />
                        <img src="assets/left.png"></img>
                        <span className="onSmallinvisible">Upłynęło rund: </span>{actualGame.game.elapsed}{actualGame.game.endType == "ROUND_LIMIT" ? <span>{" / " + actualGame.game.gameLimit}</span> : ""}
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

                            <div className="onSmallVisible menuTimer">
                                <div>
                                    <img src="assets/timer.png"></img>
                                    Upłynęło czasu: {timer.minutes}:{timer.seconds}{actualGame.game.endType=="TIME_LIMIT"?<span>({timer.limitMinutes}:{timer.limitSeconds})</span>:""}
                                </div>
                                <div>
                                    <img src="assets/left.png"></img>
                                    Upłynęło rund: {actualGame.game.elapsed}{actualGame.game.endType == "ROUND_LIMIT" ? <span>{" / " + actualGame.game.gameLimit}</span> : ""}
                                </div>
                            </div>
                            <div className="buttonList">
                                <a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.closeMenu}>Powrót do gry</a>
                                {/*<a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.logout}>Opcje</a>
                                <a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.leaveGame}>Opuść grę</a>*/}
                                <NavLink to="/panel" className="button is-large  is-link is-rounded is-fullwidth" onClick={this.leaveGame}>Opuść grę</NavLink>
                            </div>
                        </div>
                    </div>
                </div> : <div></div>}
                {actualGame.game.ended ? <div className="inGameMenu">

                    <div className="container">
                        <div className="menuContent">
                            <div className="buttonList">
                            <h1 className="gameTitle">Gra zakończona!</h1>
                                <h3 className="gameTitle">Wyniki:</h3>
                            <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Pozycja</th>
                                        <th>Punkty</th>
                                        <th>Ducklingsy</th>
                                    </tr>
                                </thead>
                                <tbody className="gameResult">
                                    {result.map((row, index) => {
                                        return <tr key={index} >
                                            <td >{index + 1}</td>
                                            <td >{row.points.user.username}</td>
                                            <td >{row.ducklings.user.username}</td>                                            
                                        </tr>
                                    })}
                                </tbody>
                            </table>

                                {actualGame.amIAuthor?<a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.continueGame}>Kontynuuj</a>:""}
                                {/*<a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.logout}>Powrót do lobby</a>
                                <a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.logout}>Opuść grę</a>*/}
                                <NavLink to="/panel" className="button is-large  is-link is-rounded is-fullwidth" onClick={this.leaveGame}>Opuść grę</NavLink>
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




