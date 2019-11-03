import React, { Component } from "react";
import { connect } from "react-redux";
import { login } from "../../actions/index";
import { NavLink } from 'react-router-dom';

function mapDispatchToProps(dispatch) {
    return {
        login: payload => dispatch(login(payload))
    };
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        cookies: state.cookies
    };
};

class LoginComponent extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.login = this.login.bind(this);
    }
    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    login() {
        const { username, password } = this.state;
        this.props.login({ username: username, password: password })
    }
    componentDidUpdate() {
        if (this.props.auth.loginSuccess) {
            this.props.cookies.set('auth', JSON.stringify(this.props.auth), { path: '/' });
            this.props.history.push("/panel")
        }
    }
    render() {
        const { auth } = this.props
        const { username, password } = this.state;
        return (
            <div className="container">
                <div className="menuContent">
                    <h1 className="gameTitle">Zaloguj się</h1>
                    <div className="buttonList">
                        <div className="field">
                            <label className="label">Login</label>
                            <div className="control has-icons-left">
                                <input className="input is-link is-rounded is-large" autocomplete="off" type="text" id="username" placeholder="Login" value={username} onChange={this.handleChange} />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-user"></i>
                                </span>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Hasło</label>
                            <div className="control has-icons-left">
                                <input className="input is-link is-rounded is-large" type="password" id="password" placeholder="Hasło" value={password} onChange={this.handleChange} />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-user"></i>
                                </span>
                            </div>
                        </div>
                        <div className="subTitle">
                            {auth.loginFailed &&
                                <p>Logowanie nieudane!</p>
                            }
                            <a type="button" className="button is-large  is-link is-rounded is-fullwidth" onClick={this.login}>Zaloguj się</a>
                            Nie masz jeszcze konta? <NavLink to="/registration" className="subtitleBtn">Zarejestruj się</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const Login = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
export default Login;