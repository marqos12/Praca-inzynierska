import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import { wsConnect, wsOpenTestCanal, wsSendTestMessage, wsSendMessage, setHistory } from "../actions/index";

function mapDispatchToProps(dispatch) {
    return {
        wsConnect: () => dispatch(wsConnect()),
        wsSendMessage: payload => dispatch(wsSendMessage(payload)),
        setHistory: payload => dispatch(setHistory(payload))
    };
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        ws: state.ws,
        stateHistory: state.history,
        actualGame: state.actualGame
    };
};



class HomeComponent extends Component {
    constructor() {
        super();
        this.state = {

        };

        this.createNewGame = this.createNewGame.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    createNewGame() {

        console.log("test userPanel 30", { id: this.props.auth.user.id })
        console.log(this.props)
        this.props.wsSendMessage({ channel: "/lobby/createGame", payload: { id: this.props.auth.user.id } })
    }

    componentDidMount() {
        if (this.props.ws.client) {
            // this.props.wsOpenPrivateCanals();
        }
        else {
            this.props.wsConnect();
        }
    }

componentDidUpdate(){
    
    console.log("stefan linia 54")
    if (this.props.actualGame.game != null)
        this.props.history.push("/game/" + this.props.actualGame.game.id)
}

    componentWillMount() {
        //console.log(this.props.auth.token)
        if (this.props.auth.token == "")
            this.props.history.push("/")
    }
    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }
    render() {

        const { username, password } = this.state;
        return (
            <div className="container">
                <div className="menuContent">
                    <h1 className="gameTitle">Witaj w grze!  {this.props.auth.user.username}</h1>

                    <div className="buttonList">
                        <NavLink to="/searchGames" className="button is-large  is-link is-rounded is-fullwidth" >Szukaj gry</NavLink>
                        <a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.createNewGame}>Utwórz grę</a>
                        <NavLink to="/friends" className="button is-large  is-link is-rounded is-fullwidth" >Graj sam</NavLink>
                        <NavLink to="/friends" className="button is-large  is-link is-rounded is-fullwidth">Znajomi</NavLink>
                        <NavLink to="/settings" className="button is-large  is-link is-rounded is-fullwidth">Ustawienia</NavLink>
                    </div>

                </div>
            </div>
        );
    }
}
const Home = connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
export default Home;