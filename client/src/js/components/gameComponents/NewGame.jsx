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
            askedForGamersList:false,
            privateGame:true,
            isRts:false,
            gameLimit:45,
        };

        this.handleChange = this.handleChange.bind(this);
        this.leaveGame = this.leaveGame.bind(this);
        this.updateGame=this.updateGame.bind(this);
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        console.log("newGame 34",id)
        if (id) {

        } else {
            this.props.history.push("/panel")
        }
    }

    leaveGame(){
        this.props.wsGameDisconnect();
    }

    updateGame(){
        let game = this.props.actualGame.game;
        const { privateGame, isRts, gameLimit  } = this.state;
        game.privateGame = privateGame;
        game.rts = isRts;
        game.gameLimit = gameLimit;
        this.props.wsSendMessage({
            channel: "/lobby/updateGame", payload: game
        })
    }

    componentDidUpdate(){
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
        else{
            if(!this.state.askedForGamersList && this.props.actualGame.meGamer){
                this.setState({ askedForGamersList: true })
                this.props.wsSendMessage({
                    channel: "/lobby/statusUpdate", payload: this.props.actualGame.meGamer
                })
            }
        } 
        if(this.state.initialized&&!this.props.actualGame.meGamer){
            this.props.history.push("/panel")
            
        }
        
    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    render() {
        
        const { privateGame, isRts, gameLimit  } = this.state;

        return (
            <div className="container">
                <div className="menuContent">
                    {this.props.actualGame.game ?


                        <div className="buttonList">
                {this.props.actualGame.amIAuthor?
                <h1 className="gameTitle">Utwórz nową grę </h1>
                :<h1 className="gameTitle">Witaj w lobby gry autora {this.props.actualGame.game.author.username} </h1>}

                            {this.props.actualGame.amIAuthor?
<div>
                            <div className="field">
                                <input id="gameMode" type="checkbox" name="gameMode" className="switch is-medium is-rounded is-info" value={isRts} onChange={this.handleChange}/>
                                <label for="gameMode">Tryb gry: RTS</label>
                            </div>

                            <div className="field">
                                <div className="control">
                                    <label class="label">Limit gry</label>
                                    <input className="input is-medium is-info" type="text" placeholder="Limit gry" value={gameLimit} onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="field">
                                <input id="isPrivateGame" type="checkbox" name="isPrivateGame" className="switch is-medium is-rounded is-info" value={privateGame} onChange={this.handleChange} />
                                <label for="isPrivateGame">Gra prywatna</label>
                            </div>

                            <h3>Kod do bezpośredniego dołączenia: {this.props.actualGame.game.id}</h3>

                            <a className="button is-large  is-link is-rounded is-fullwidth"  onClick={this.updateGame}>Aktualizuj </a>
                            </div>
                            : <div></div>}

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
                                            <td>{gamer.status}</td>
                                            <td>{gamer.user.username}</td>
                                            <td>{gamer.redy}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
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