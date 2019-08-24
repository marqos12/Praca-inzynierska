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
        gamesList: state.gamesList
    };
};



class SearchGamesComponent extends Component {
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
        if (this.props.ws.client) {
            this.props.wsOpenPrivateCanals();
        }
        else {
            this.props.wsConnect();
        }
    }

    componentWillUpdate() {
        if (!this.state.initialized) {
            this.setState({ initialized: true })
            this.props.wsSendMessage({ channel: "/lobby/getGames", payload: "" });    
        }
    }

    componentWillUnmount(){
        
    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }
    render() {

        const { gamesList } = this.props;
        return (
            <div className="container">
                <div className="menuContent">
                    <h1 className="gameTitle">Utwórz nową grę </h1>

                    <div className="buttonList">

                        <a className="button is-large  is-link is-rounded is-fullwidth" onClick={() => this.joinGame(1)}>Szukaj gry</a>


                        <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Gamers</th>
                                    <th>Game limit</th>
                                    <th>Author</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gamesList.map((game, index) => {
                                    return <tr key={index} onClick={() => this.joinGame(game.id)}>
                                        <td>{game.rts?"RTS":"Turowa"}</td>
                                        <td>2</td>
                                        <td>{game.gameLimit}</td>
                                        <td>{game.author.username}</td>
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
const SearchGame = connect(mapStateToProps, mapDispatchToProps)(SearchGamesComponent);
export default SearchGame;




