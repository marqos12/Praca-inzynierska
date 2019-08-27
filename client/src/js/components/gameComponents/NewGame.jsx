import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import { wsConnect, wsOpenTestCanal, wsSendTestMessage, wsSendMessage } from "../../actions/index";

function mapDispatchToProps(dispatch) {
    return {
        wsSendMessage: payload => dispatch(wsSendMessage(payload))
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
            initialized: false
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        console.log("newGame 34",id)
        if (id) {

        } else {
            this.props.history.push("/panel")
        }
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
        
    }



    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    render() {

        const { username, password } = this.state;

        return (
            <div className="container">
                <div className="menuContent">
                    <h1 className="gameTitle">Utwórz nową grę </h1>

                    {this.props.actualGame.game ?



                        <div className="buttonList">
                            <div className="field">
                                <input id="gameMode" type="checkbox" name="gameMode" className="switch is-medium is-rounded is-info" />
                                <label for="gameMode">Tryb gry: RTS</label>
                            </div>

                            <div className="field">
                                <div className="control">
                                    <label class="label">Limit gry</label>
                                    <input className="input is-medium is-info" type="text" placeholder="Limit gry" />
                                </div>
                            </div>

                            <div className="field">
                                <input id="gameMode" type="checkbox" name="gameMode" className="switch is-medium is-rounded is-info" />
                                <label for="gameMode">Gra prywatna</label>
                            </div>

                            <h3>Kod do bezpośredniego dołączenia: {this.props.actualGame.game.id}</h3>

                            <a className="button is-large  is-link is-rounded is-fullwidth" >Zapisz </a>


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
                                            <td>{gamer.username}</td>
                                            <td>{gamer.redy}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>

                        </div>
                        : <div></div>}
                </div>
            </div>
        );
    }
}
const NewGame = connect(mapStateToProps, mapDispatchToProps)(NewGameComponent);
export default NewGame;