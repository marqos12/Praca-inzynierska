import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import { wsConnect, wsOpenTestCanal, wsSendTestMessage, wsSendMessage, wsGameDisconnect } from "../../actions/index";

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
            gameLimit: 45,
            ready: false,
            canStart: false,
            loopPrevent:false
        };

        this.loopPrevent=false;
        this.checkboxHandleChange = this.checkboxHandleChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.leaveGame = this.leaveGame.bind(this);
        this.updateGame = this.updateGame.bind(this);
    }


    componentDidMount() {
        const { id } = this.props.match.params;
        console.log("newGame 34", id)
        if (id) {

        } else {
            this.props.history.push("/panel")
        }
    }

    leaveGame() {
        this.props.wsGameDisconnect();
    }

    setReady() {
        let gamer = this.props.actualGame.meGamer;
        gamer.ready = !this.state.ready
        this.setState({ ready: !this.state.ready })
        console.log("new game 62", gamer, this.state)
        this.props.wsSendMessage({
            channel: "/lobby/statusUpdate", payload: gamer
        })
    }

    startGame() {
        this.props.actualGame.game.started=true;
        this.props.wsSendMessage({
            channel: "/lobby/startGame", payload: this.props.actualGame.game
        })
    }

    updateGame() {
        let game = this.props.actualGame.game;
        const { privateGame, isRts, gameLimit } = this.state;
        game.privateGame = privateGame;
        game.rts = isRts;
        game.gameLimit = gameLimit;

        this.props.wsSendMessage({
            channel: "/lobby/updateGame", payload: game
        })
    }

    componentDidUpdate() {
        const { id } = this.props.match.params;
        console.log("newGame 43", this.state, this.props)
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
                console.log("newgame 108", i, this.props.actualGame.gamers.length,this.loopPrevent, this.state)
            if (this.props.actualGame.gamers.length > 0 && !this.loopPrevent) {
                this.loopPrevent=true
                for(const gamer of this.props.actualGame.gamers)if (gamer.ready) i++
                /*this.props.actualGame.gamers.foreach(function(gamer) {
                    
                })*/
                this.setState({ canStart: (i == this.props.actualGame.gamers.length) })
            }
            else if (this.loopPrevent) this.loopPrevent=false;
        }
        if (this.state.initialized && !this.props.actualGame.meGamer) {
            this.props.history.push("/panel")

        }

    }

    handleChange(event) {
        console.log("new game 96", event.target.id, event.target.value)
        this.setState({ [event.target.id]: event.target.value });
    }
    checkboxHandleChange(event) {
        console.log("new game 96", event.target.id, event.target.checked)
        this.setState({ [event.target.id]: event.target.checked });
    }

    render() {

        const { privateGame, isRts, gameLimit, ready,canStart } = this.state;

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

                                    <div className="field">
                                        <input id="isRts" type="checkbox" name="isRts" className="switch is-medium is-rounded is-info" checked={isRts} onChange={this.checkboxHandleChange} />
                                        <label for="isRts">Tryb gry: RTS</label>
                                    </div>

                                    <div className="field">
                                        <div className="control">
                                            <label class="label">Limit gry</label>
                                            <input className="input is-medium is-info" type="text" placeholder="Limit gry" id="gameLimit" value={gameLimit} onChange={this.handleChange} />
                                        </div>
                                    </div>

                                    <div className="field">
                                        <input id="privateGame" type="checkbox" name="privateGame" className="switch is-medium is-rounded is-info" checked={privateGame} onChange={this.checkboxHandleChange} />
                                        <label for="privateGame">Gra prywatna</label>
                                    </div>

                                    <h3>Kod do bezpośredniego dołączenia: {this.props.actualGame.game.id}</h3>

                                    <a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.updateGame}>Aktualizuj </a>
                                </div>
                                : <div>
                                    <div className="field">
                                        <h3>Tryb gry: {this.props.actualGame.game.isRts ? "RTS" : "Turowa"}</h3>
                                    </div>

                                    <div className="field">
                                        <div className="control">
                                            <h3>Limit gry: {this.props.actualGame.game.gameLimit}</h3>
                                        </div>
                                    </div>

                                    <div className="field">
                                        <div className="control">
                                            <h3>Limit miejsc: {this.props.actualGame.game.gamersCountLimit}</h3>
                                        </div>
                                    </div>

                                    <div className="field">
                                        <h3> {this.props.actualGame.game.privateGame ? "Gra prywatna" : "Gra publiczna"}</h3>
                                    </div>
                                </div>}
                            <br /><br />
                            <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th>Nazwa gracza</th>
                                        <th>Gotowość</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.actualGame.gamers.map((gamer, index) => {
                                        return <tr key={index} >
                                            <td>{gamer.status ? ":)" : ":("}</td>
                                            <td>{gamer.user.username}</td>
                                            <td>{gamer.ready ? "+" : ""}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                            <a className="button is-large  is-link is-rounded is-fullwidth" onClick={() => this.setReady()}>{ready ? "Nie gotowy" : "Gotowy"}</a>
                            {(this.props.actualGame.amIAuthor) ? <a className="button is-large  is-link is-rounded is-fullwidth " disabled={(canStart) ?  "":"disabled" } onClick={() => this.startGame()}>Rozpocznij grę</a> : <span></span>}
                            <a className="button is-large  is-link is-rounded is-fullwidth" onClick={() => this.leaveGame()}>Wyjdź z gry</a>
                        </div>
                        : <div></div>}
                </div>
            </div>
        );
    }
}
const NewGame = connect(mapStateToProps, mapDispatchToProps)(NewGameComponent);
export default NewGame;