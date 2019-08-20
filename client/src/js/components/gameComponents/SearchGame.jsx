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
        ws : state.ws
    };
};



class SearchGamesComponent extends Component {
    constructor() {
        super();
        this.state = {

        };

        this.wsConnect = this.wsConnect.bind(this);
        this.wsOpenPrivateCanals = this.wsOpenPrivateCanals.bind(this);
        this.wsSendMessage = this.wsSendMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    wsConnect() {
        this.props.wsConnect();
    }
    wsOpenPrivateCanals() {
        this.props.wsOpenPrivateCanals();
    }
    wsSendMessage() {
        this.props.wsSendMessage({ channel: "/lobby/getGames",payload:"" });
    }

    componentDidMount(){
        console.log("siema",this.props.ws)
        if(this.props.ws.client){
            this.props.wsOpenPrivateCanals();
        }
        else {
            this.props.wsConnect();
        }
    }

    componentWillMount() {
        
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

                    <div className="buttonList">
                        
                        <a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.wsSendMessage}>Szukaj gry</a>
                        <a className="button is-large  is-link is-rounded is-fullwidth" >Utwórz grę</a>
                        <a className="button is-large  is-link is-rounded is-fullwidth" >Graj sam</a>
                        <NavLink to="/friends" className="button is-large  is-link is-rounded is-fullwidth">Znajomi</NavLink>
                        <NavLink to="/settings" className="button is-large  is-link is-rounded is-fullwidth">Ustawienia</NavLink>
                    </div>

                </div>
            </div>
        );
    }
}
const SearchGame = connect(mapStateToProps, mapDispatchToProps)(SearchGamesComponent);
export default SearchGame;