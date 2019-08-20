import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import { wsConnect, wsOpenTestCanal, wsSendTestMessage } from "../../actions/index";

function mapDispatchToProps(dispatch) {
    return {
        wsConnect: () => dispatch(wsConnect()),
        wsOpenTestCanal: () => dispatch(wsOpenTestCanal()),
        wsSendTestMessage: payload => dispatch(wsSendTestMessage(payload))
    };
}

const mapStateToProps = state => {
    return { auth: state.auth };
};



class NewGameComponent extends Component {
    constructor() {
        super();
        this.state = {

        };

        this.wsConnect = this.wsConnect.bind(this);
        this.wsOpenTestCanal = this.wsOpenTestCanal.bind(this);
        this.wsSendTestMessage = this.wsSendTestMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    wsConnect() {
        this.props.wsConnect();
    }
    wsOpenTestCanal() {
        this.props.wsOpenTestCanal();
    }
    wsSendTestMessage() {
        this.props.wsSendTestMessage({ targetSessionId: this.state.username });
    }


    componentWillMount() {
        console.log(this.props)
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
                    <h1 className="gameTitle">Utwórz nową grę </h1>

                    <div className="buttonList">
                        
                        <a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.wsConnect}>Szukaj gry</a>
                        <a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.wsOpenTestCanal}>Utwórz grę</a>
                        <a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.wsSendTestMessage}>Graj sam</a>
                        <NavLink to="/friends" className="button is-large  is-link is-rounded is-fullwidth">Znajomi</NavLink>
                        <NavLink to="/settings" className="button is-large  is-link is-rounded is-fullwidth">Ustawienia</NavLink>
                    </div>

                </div>
            </div>
        );
    }
}
const NewGame = connect(mapStateToProps, mapDispatchToProps)(NewGameComponent);
export default NewGame;