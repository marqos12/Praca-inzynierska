import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import { setAuthFromCookies } from "../actions/index";

function mapDispatchToProps(dispatch) {
    return {
        setAuthFromCookies: payload => dispatch(setAuthFromCookies(payload))
    };
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        cookies: state.cookies
    };
};


class HomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };  
    }
    

    componentDidMount() {
        let auth = this.props.cookies.get('auth');
        console.log(auth)
        if (!auth && this.props.auth.loginSuccess) {
            this.props.cookies.set('auth', JSON.stringify(this.props.auth), { path: '/' });
            this.props.history.push("/panel")
        }
        else if (auth) {
           
            
        this.props.setAuthFromCookies(auth);
            this.props.history.push("/panel")
        }
        
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