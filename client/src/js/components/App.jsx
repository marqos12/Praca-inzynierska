import React, { Component } from "react";
import { connect } from "react-redux";
import Home from "./Home.jsx";
import Login from "./auth/Login.jsx";
import Registration from "./auth/Registration.jsx";
import UserPanel from "./UserPanel.jsx";
import { Route, withRouter } from 'react-router-dom';
import { setCookiesService, setHistory, wsConnect, setAuthFromCookies, setOrigin } from "../actions/index";
import "./css/main.scss";
import { withCookies, Cookies } from 'react-cookie';

import NewGame from "./gameComponents/NewGame.jsx";
import SearchGame from "./gameComponents/SearchGame.jsx";
import Game from "./gameComponents/Game.jsx";
import MainGame from "../gameEngine/MainGame.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameStarted: true,
    }

    console.log("App 19", props)
  }

  componentWillMount() {
    console.log("app 23", this.props.cookies.getAll())
    this.props.setCookiesService(this.props.cookies)
    this.props.setHistory(this.props.history)

    console.log("app 29", this.props.cookies.getAll())
    if (this.props.ws.client) {
      //this.props.wsOpenPrivateCanals();
    }
    else {
      this.props.wsConnect();
    }
    let auth = this.props.cookies.get('auth');
    console.log("app 36", this.props, auth)

    if (!auth && this.props.auth.loginSuccess) {
      this.props.cookies.set('auth', JSON.stringify(this.props.auth), { path: '/' });

    }
    else if (auth && this.props.auth.token == "") {
      console.log("app 44", auth)
      this.props.setAuthFromCookies(auth);
    }
  }

  componentDidMount() {

    console.log("app 49", window.location.href)

    this.props.setOrigin(window.location.href.split("/#")[0])
  }

  render() {
    const { gameStarted } = this.state;
    return (
      <div className="app">
        {!gameStarted?
        <div>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/registration" component={Registration} />
          <Route exact path="/panel" component={UserPanel} />
          <Route exact path="/newGame" component={NewGame} />
          <Route exact path="/searchGames" component={SearchGame} />
          <Route exact path="/game/:id" component={Game} />
          <Route exact path="/newGame/:id" component={NewGame} />
        </div>
        :
        <div>
         <MainGame />
        </div>}
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    wsConnect: () => dispatch(wsConnect()),
    setOrigin: payload => dispatch(setOrigin(payload)),
    setCookiesService: payload => dispatch(setCookiesService(payload)),
    setHistory: payload => dispatch(setHistory(payload)),
    setAuthFromCookies: payload => dispatch(setAuthFromCookies(payload))
  };
}

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.auth,
    cookies: ownProps.cookies,
    ws: state.ws
  };
};

const componentApp = connect(mapStateToProps, mapDispatchToProps)(App);
export default withCookies(componentApp); //withRouter());  