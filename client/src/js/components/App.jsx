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
      gameStarted: false,
    }
    document.addEventListener('contextmenu', event => event.preventDefault());
  }

  componentWillMount() {
    this.props.setCookiesService(this.props.cookies)
    this.props.setHistory(this.props.history)
    if (!this.props.ws.client)
      this.props.wsConnect();

    let auth = this.props.cookies.get('auth');

    if (!auth && this.props.auth.loginSuccess)
      this.props.cookies.set('auth', JSON.stringify(this.props.auth), { path: '/' });
    else if (auth && this.props.auth.token == "")
      this.props.setAuthFromCookies(auth);
  }
  componentDidMount() {
    this.props.setOrigin(window.location.href.split("/#")[0])
  }

  componentDidUpdate() {
    let actualGame = this.props.actualGame;
    if ((actualGame && actualGame.game != null && actualGame.game.started) != this.state.gameStarted) {
      this.forceUpdate();
      this.setState({
        gameStarted: actualGame && actualGame.game != null && actualGame.game.started,
      })
    }
  }

  render() {
    const { gameStarted } = this.state;
    return (
      <div className="app">
        {!gameStarted ?
          <div className="mainMenu">
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
          <div className="game">
            <MainGame />
          </div>
        }
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
    wsSendMessage: payload => dispatch(wsSendMessage(payload)),
    setAuthFromCookies: payload => dispatch(setAuthFromCookies(payload))
  };
}

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.auth,
    cookies: ownProps.cookies,
    ws: state.ws,
    actualGame: state.actualGame
  };
};

const componentApp = connect(mapStateToProps, mapDispatchToProps)(App);
export default withCookies(componentApp); 