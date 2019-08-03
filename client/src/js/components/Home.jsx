import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';

function mapDispatchToProps(dispatch) {
    return {
      
    };
}

const mapStateToProps = state => {
    return { auth: state.auth };
};


class HomeComponent extends Component {
    constructor() {
        super();
        this.state = {
           
        };
        
    }
   
    
    componentWillMount() {
        if (this.props.auth.loginSuccess)
            this.props.history.push("/new")
    }
    render() {
        
        return (
            <div className="container">
                <div className="menuContent">
                    <h1 className="gameTitle">Witaj w grze <span>Moje Miasto</span></h1>

                    <div className="buttonList">
                        <NavLink to="/login" className="button is-large  is-link is-rounded is-fullwidth">Zaloguj się!</NavLink>
                        <NavLink to="/registration" className="button is-large  is-link is-rounded is-fullwidth">Zarejestruj</NavLink>
                        <NavLink to="/about" className="button is-large  is-link is-rounded is-fullwidth">O grze</NavLink>
                    </div>
                </div>
            </div>
        );
    }
}
const Home = connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
export default Home;