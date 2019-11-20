import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import { wsConnect, wsOpenTestCanal, wsSendTestMessage, wsSendMessage, wsGameDisconnect } from "../../actions/index";
import GameChat from "./GameChat.jsx";

function mapDispatchToProps(dispatch) {
    return {
        wsSendMessage: payload => dispatch(wsSendMessage(payload)),
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

class NewGameComponent extends Component {
    constructor() {
        super();
        this.state = {
            initialized: false,
            askedForGamersList: false,
            privateGame: true,
            isRts: false,
            gameLimit: 100,
            ready: false,
            canStart: false,
            loopPrevent: false,
            endType: "ROUND_LIMIT",
            firstLoad: false,
            gamersLimit: 4,
            rtsInterval:20,
            edited:false,
        };

        this.loopPrevent = false;
        this.checkboxHandleChange = this.checkboxHandleChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.leaveGame = this.leaveGame.bind(this);
        this.updateGame = this.updateGame.bind(this);
        this.kickGamer = this.kickGamer.bind(this);
        this.chatTest = this.chatTest.bind(this);



    }

    componentDidMount() {
        const { id } = this.props.match.params;
        if (!id)
            this.props.history.push("/panel")
    }

    leaveGame() {
        this.props.wsGameDisconnect();
    }

    setReady() {
        let gamer = this.props.actualGame.meGamer;
        gamer.ready = !this.state.ready
        this.setState({ ready: !this.state.ready })
        this.props.wsSendMessage({
            channel: "/lobby/statusUpdate", payload: gamer
        })
    }

    startGame() {
        this.props.actualGame.game.started = true;
        this.props.wsSendMessage({
            channel: "/lobby/startGame", payload: this.props.actualGame.game
        })
    }

    updateGame() {
        let game = this.props.actualGame.game;
        const { privateGame, isRts, gameLimit, endType, gamersLimit, rtsInterval } = this.state;
        game.privateGame = privateGame;
        game.rts = isRts;
        game.gameLimit = gameLimit;
        game.endType = endType;
        game.gamersCountLimit = gamersLimit;
        game.rtsInterval = rtsInterval;
        this.setState({edited:false})
        console.log("newGame 80", game)
        this.props.wsSendMessage({
            channel: "/lobby/updateGame", payload: game
        })
    }

    kickGamer(gamer) {

        this.props.wsSendMessage({
            channel: "/lobby/kickGamer", payload: { id: gamer.id }
        })
    }

    componentDidUpdate() {
        const { id } = this.props.match.params;
        if (!this.state.initialized) {
            if (this.props.ws.client) {
                this.setState({ initialized: true })
                this.props.wsSendMessage({
                    channel: "/lobby/joinGame", payload: {
                        userId: this.props.auth.user.id,
                        gameId: id,
                        sessionId: this.props.ws.sessionId
                    }
                })
            }
        }
        else {
            if (!this.state.askedForGamersList && this.props.actualGame.meGamer) {
                this.setState({ askedForGamersList: true })
                let gamer = this.props.actualGame.meGamer;
                gamer.ready = false;
                this.props.wsSendMessage({
                    channel: "/lobby/statusUpdate", payload: gamer
                })
            }
            let i = 0;
            if (this.props.actualGame.gamers.length > 0 && !this.loopPrevent) {
                this.loopPrevent = true
                for (const gamer of this.props.actualGame.gamers) if (gamer.ready) i++
                this.setState({ canStart: (i == this.props.actualGame.gamers.length) })
            }
            else if (this.loopPrevent) this.loopPrevent = false;

            if (this.props.actualGame.game && !this.state.firstLoad && (
                this.state.privateGame != this.props.actualGame.game.privateGame ||
                this.state.isRts != this.props.actualGame.game.isRts ||
                this.state.gameLimit != this.props.actualGame.game.gameLimit ||
                this.state.endType != this.props.actualGame.game.endType)) {
                this.setState(Object.assign({}, this.state, {
                    privateGame: this.props.actualGame.game.privateGame,
                    isRts: this.props.actualGame.game.isRts,
                    gameLimit: this.props.actualGame.game.gameLimit,
                    endType: this.props.actualGame.game.endType,
                    firstLoad: true,
                    gamersLimit: this.props.actualGame.game.gamersCountLimit,
                    rtsInterval:this.props.actualGame.game.rtsInterval
                }))
            }

        }
        if (this.state.initialized && !this.props.actualGame.meGamer) {
            this.props.history.push("/panel")
        }
    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value,
        edited:true });
        if (event.target.id == 'endType')
            this.setState({ 'gameLimit': this.getEndTypeRange(event.target.value).default });
    }

    checkboxHandleChange(event) {
        this.setState({ [event.target.id]: event.target.checked ,
            edited:true});
    }

    getEndTypeRange(endType = this.state.endType) {
        switch (endType) {
            case "ROUND_LIMIT":
                return { min: 10, max: 300, default: 100, unit: "limit rund" }
            case "TIME_LIMIT":
                return { min: 5, max: 90, default: 15, unit: "limit minut" }
            case "POINT_LIMIT":
                return { min: 1000, max: 200000, default: 10000, unit: "limit punktów" }
            case "DUCKLINGS_LIMIT":
                return { min: 10000, max: 1000000, default: 500000, unit: "limit ducklingsów" }
            case "ENDLESS":
                return { min: 0, max: 0, default: 0, unit: "brak limitu" }
        }
    }

    chatTest() {
        this.props.wsSendMessage({ channel: "/chat/game", payload: { user:this.props.auth.usser, message:"Test komunikacji", gameId:this.props.actualGame.game.id } })
    }
    render() {

        const { privateGame, isRts, gameLimit, ready, canStart, endType, gamersLimit,rtsInterval,edited } = this.state;
        const limitValues = this.getEndTypeRange();
        return (
            <div className="container">
                <div className="menuContent">
                    {this.props.actualGame.game ?


                        <div className="buttonList">
                            {this.props.actualGame.amIAuthor ?
                                <h1 className="gameTitle">Utwórz nową grę </h1>
                                : <h1 className="gameTitle">Witaj w lobby gry autora {this.props.actualGame.game.author.username} </h1>}

                            {this.props.actualGame.amIAuthor ?
                                <div>

                                    <div className="separator">Typ rozgrywki</div>

                                    <div className="columns">
                                        <div className="column">
                                            <div className="  field">
                                                <label className="switch">
                                                    <input id="isRts" type="checkbox" name="isRts" checked={isRts} onChange={this.checkboxHandleChange} />
                                                    <span className="slider round"></span>
                                                </label>
                                                <label for="isRts">Tryb gry: {!isRts?"turowa":"RTS"}</label>
                                            </div>
                                            <div className="field">
                                                <label className="switch">
                                                    <input id="privateGame" type="checkbox" name="privateGame" checked={privateGame} onChange={this.checkboxHandleChange} />
                                                    <span className="slider round"></span>
                                                </label>
                                                <label for="privateGame">Gra {!privateGame?"publiczna":"prywatna"}</label>
                                            </div>
                                        </div>
                                        <div className="column field">
                                            <label >Warunek zakończenia gry</label>
                                            <div className="control">
                                                <div className="select is-info is-medium ">
                                                    <select name="endType" value={endType} id="endType" onChange={this.handleChange}>
                                                        <option value="ROUND_LIMIT">Limit rund</option>
                                                        <option value="TIME_LIMIT">Limit czasu</option>
                                                        <option value="POINT_LIMIT">Limit punktów</option>
                                                        <option value="DUCKLINGS_LIMIT">Limit waluty na koncie</option>
                                                        <option value="ENDLESS" >Brak lmitu</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                {isRts?<div>
                                    <div className="field">
                                        <div className="control">
                                            <label class="label">Częstotliwość następnej rundy: <b>{rtsInterval}</b></label>
                                            <input className="input is-medium is-info" type="number" placeholder="Limit gry" id="rtsInterval" value={rtsInterval} onChange={this.handleChange} />
                                        </div>
                                    </div>

                                    <div className="slidecontainer">
                                        <input type="range" min="3"max="120" className="slider" id="rtsInterval" value={rtsInterval} onChange={this.handleChange} />
                                    </div>
                                    </div>
                                    :""}

                                    <div className="separator">Limit gry</div>

                                    <div className="field">
                                        <div className="control">
                                            <label class="label">Limit gry: <b>{limitValues.unit}</b></label>
                                            <input className="input is-medium is-info" type="number" placeholder="Limit gry" id="gameLimit" value={gameLimit} onChange={this.handleChange} />
                                        </div>
                                    </div>

                                    <div className="slidecontainer">
                                        <input type="range" min={limitValues.min} max={limitValues.max} className="slider" id="gameLimit" value={gameLimit} onChange={this.handleChange} />
                                    </div>

                                    <div className="separator">Gracze</div>

                                    <div className="field">
                                        <div className="control">
                                            <label class="label">Limit graczy: </label>
                                            <input className="input is-medium is-info" type="number" placeholder="Limit graczy" id="gamersLimit" value={gamersLimit} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="slidecontainer">
                                        <input type="range" min="1" max="8" className="slider" id="gamersLimit" value={gamersLimit} onChange={this.handleChange} />
                                    </div>
                                    <br />
                                    <br />

                                    <a className="button is-large  is-link is-rounded is-fullwidth" disabled={edited?"":"disabled"} onClick={this.updateGame}>Aktualizuj </a>

                                    <h3>Kod do bezpośredniego dołączenia: {this.props.actualGame.game.id}</h3>

                                </div>
                                : <div>
                                    <div className="field">
                                        <h3>Tryb gry:<b>{this.props.actualGame.game.isRts ? "RTS" : "Turowa"}</b> </h3>
                                    </div>

                                    <div className="field">
                                        <div className="control">
                                            <h3>Limit gry:{this.getEndTypeRange(this.props.actualGame.game.endType).default != 0 ? <b>  {this.props.actualGame.game.gameLimit} {this.getEndTypeRange(this.props.actualGame.game.endType).unit.replace("limit", "")}</b> : <b> {this.getEndTypeRange(this.props.actualGame.game.endType).unit}</b>}</h3>
                                        </div>
                                    </div>

                                    <div className="field">
                                        <div className="control">
                                            <h3>Limit miejsc:<b>{this.props.actualGame.game.gamersCountLimit}</b> </h3>
                                        </div>
                                    </div>

                                    <div className="field">
                                        <h3><b>{this.props.actualGame.game.privateGame ? "Gra prywatna" : "Gra publiczna"}</b> </h3>
                                    </div>
                                </div>}
                            <br /><br />
                            <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th>Nazwa gracza</th>
                                        <th>Gotowość</th>
                                        {this.props.actualGame.amIAuthor ?
                                            <th>Wyrzuć gracza</th> : ""}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.actualGame.gamers.map((gamer, index) => {
                                        return <tr key={index} >
                                            <td>{gamer.status=="t" ? <img src="assets/smail.gif" className="statusImg" /> : gamer.status=="n"?<img src="assets/noSmail.gif" className="statusImg" />: <img src="assets/sad.gif" className="statusImg" />}</td>
                                            <td><b>{gamer.user.username}</b></td>
                                            <td>{gamer.ready ? <img src="assets/check.png" className="statusImg" /> : ""}</td>
                                            {this.props.actualGame.amIAuthor ?
                                                <td><a className="delete is-medium noBorder" onClick={() => this.kickGamer(gamer)}></a></td> : ""}
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                            <a className="button is-large  is-link is-rounded is-fullwidth" onClick={() => this.setReady()}>{ready ? "Nie gotowy" : "Gotowy"}</a>
                            {(this.props.actualGame.amIAuthor) ? <a className="button is-large  is-link is-rounded is-fullwidth " disabled={(canStart) ? "" : "disabled"} onClick={() => this.startGame()}>Rozpocznij grę</a> : <span></span>}
                            <a className="button is-large  is-link is-rounded is-fullwidth" onClick={() => this.leaveGame()}>Wyjdź z gry</a>

                            
                        </div>
                        : <div></div>}
                </div>
                <GameChat/>
            </div>
        );
    }
}
const NewGame = connect(mapStateToProps, mapDispatchToProps)(NewGameComponent);
export default NewGame;