import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import { wsConnect, wsOpenTestCanal, wsSendTestMessage, wsSendMessage, setHistory, logout } from "../actions/index";
import GllobalChat from "./gameComponents/GlobalChat.jsx";

function mapDispatchToProps(dispatch) {
    return {
        wsConnect: () => dispatch(wsConnect()),
        wsSendMessage: payload => dispatch(wsSendMessage(payload)),
        setHistory: payload => dispatch(setHistory(payload)),
        logout: payload => dispatch(logout(payload))
    };
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        ws: state.ws,
        stateHistory: state.history,
        actualGame: state.actualGame,
        cookies: state.cookies
    };
};



class HomeComponent extends Component {
    constructor() {
        super();
        this.state = {
            aloneGame: false
        }

        this.createNewGame = this.createNewGame.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.logout = this.logout.bind(this);
        this.createNewAloneGame = this.createNewAloneGame.bind(this);
        this.chatTest = this.chatTest.bind(this);
    }

    createNewGame() {
        this.props.wsSendMessage({ channel: "/lobby/createGame", payload: { id: this.props.auth.user.id } })
    }

    createNewAloneGame() {
        this.setState({aloneGame:true})
        this.props.wsSendMessage({ channel: "/lobby/createAloneGame", payload: { id: this.props.auth.user.id } })
    }

    componentDidMount() {
        //if (!this.props.ws.client)
           // this.props.wsConnect();

    }

    logout() {
        this.props.cookies.set('auth', JSON.stringify({}), { path: '/' });
        this.props.logout();
        this.props.history.push("/");
    }

    componentDidUpdate() {

        if (this.props.actualGame.game != null)
        if(!this.props.actualGame.alone)
            this.props.history.push("/game/" + this.props.actualGame.game.id)
            else 
            this.props.history.push("/alone/" + this.props.actualGame.game.id)
    }

    componentWillMount() {
        if (this.props.auth.token == "")
            this.props.history.push("/")
    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }
    
    chatTest() {
        this.props.wsSendMessage({ channel: "/chat/global", payload: { user:this.props.auth.user, message:"Test komunikacji" } })
    }

    render() {
        return (
            <div className="container">
                <div className="menuContent">
                    <h1 className="gameTitle">Witaj w grze!  {this.props.auth.user.username}</h1>

                    <div className="buttonList">
                        <NavLink to="/searchGames" className="button is-large  is-link is-rounded is-fullwidth" >Szukaj gry</NavLink>
                        <a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.createNewGame}>Utwórz grę</a>
                        <a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.createNewAloneGame}>Graj sam</a>
                        <a className="button is-large  is-link is-rounded is-fullwidth" href="assets/manual.pdf"  target="_blank">Zobacz poradnik</a>
                        {/*<NavLink to="/friends" className="button is-large  is-link is-rounded is-fullwidth">Znajomi</NavLink>
                        <NavLink to="/settings" className="button is-large  is-link is-rounded is-fullwidth">Ustawienia</NavLink>*/}
                        <a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.logout}>Wyloguj</a>
                       
                        
                    </div>

                </div>
                <GllobalChat/>
            </div>
        );
    }
}
const Home = connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
export default Home;