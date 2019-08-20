import React, { Component } from "react";
import { connect } from "react-redux";
import Home from "./Home.jsx";
import Login from "./auth/Login.jsx";
import Registration from "./auth/Registration.jsx";
import UserPanel from "./UserPanel.jsx";
import { setCookiesService } from "../actions/index";
import "./css/main.scss";
import { withCookies, Cookies } from 'react-cookie';

import { Route } from 'react-router-dom'
import NewGame from "./gameComponents/NewGame.jsx";
import SearchGame from "./gameComponents/SearchGame.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    console.log(props)
  }

  componentWillMount(){
    console.log(this.props.cookies.getAll())
    this.props.setCookiesService(this.props.cookies)
  }

  render() {
    return (
      <div className="app">

        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/registration" component={Registration} />
        <Route exact path="/panel" component={UserPanel} />
        <Route exact path="/newGame" component={NewGame} />
        <Route exact path="/searchGames" component={SearchGame} />
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setCookiesService: payload => dispatch(setCookiesService(payload))
  };
}

const mapStateToProps = (state, ownProps) => {
  return {
      auth: state.auth,
      cookiesOwn: ownProps.cookies
  };
};

const componentApp = connect(mapStateToProps, mapDispatchToProps)(App);
export default withCookies(componentApp);  