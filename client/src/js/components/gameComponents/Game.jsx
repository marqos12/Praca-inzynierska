import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import { wsConnect, wsOpenPrivateCanals, wsSendMessage } from "../../actions/index";

function mapDispatchToProps(dispatch) {
    return {
        wsConnect: () => dispatch(wsConnect()),
        wsOpenPrivateCanals: () => dispatch(wsOpenPrivateCanals()),
        wsSendMessage: payload => dispatch(wsSendMessage(payload))
    };
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        cookies: state.cookies,
        ws: state.ws,
        actualGame: state.actualGame
    };
};



class GameComponent extends Component {
    constructor() {
        super();

        this.state = {
            initialized: false
        }

        this.wsConnect = this.wsConnect.bind(this);
        this.wsOpenPrivateCanals = this.wsOpenPrivateCanals.bind(this);
        this.wsSendMessage = this.wsSendMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.joinGame = this.joinGame.bind(this);
    }

    wsConnect() {
        this.props.wsConnect();
    }
    wsOpenPrivateCanals() {
        this.props.wsOpenPrivateCanals();
    }
    wsSendMessage() {
        this.props.wsSendMessage({ channel: "/lobby/getGames", payload: "" });
    }

    joinGame(id){
        this.props.history.push("/game/"+id)
    }


    componentDidMount() {
       /* if (this.props.ws.client) {
            this.props.wsOpenPrivateCanals();
        }
        else {
            this.props.wsConnect();
        }*/
    }

    componentWillUpdate() {
       /* if (!this.state.initialized) {
            this.setState({ initialized: true })
            this.props.wsSendMessage({ channel: "/lobby/getGames", payload: "" });
        }*/
    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }
    render() {

        const { actualGame } = this.props;
        return (
            <div className="container">
                <div className="menuContent">
                    <h1 className="gameTitle">Pokój gry </h1>

                    <div className="buttonList">

                   
                        

                        <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                            <thead>
                                <tr>
                                    <th>Numer</th>
                                    <th>Gotowość</th>
                                    <th>Gracz</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {actualGame.gamers.map((gamer, index) => {
                                    return <tr key={index} >
                                        <td>{gamer.ordinalNumber}</td>
                                        <td>{gamer.redy}</td>
                                        <td>{gamer.user.username}</td>
                                        <td>{gamer.status}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>


                    </div>

                </div>
            </div>
        );
    }
}
const Game = connect(mapStateToProps, mapDispatchToProps)(GameComponent);
export default Game;




