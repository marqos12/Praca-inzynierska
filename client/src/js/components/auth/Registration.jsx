import React, { Component } from "react";
import { connect } from "react-redux";
import { register } from "../../actions/index";
import { NavLink } from 'react-router-dom';

function mapDispatchToProps(dispatch) {
    return {
        register: payload => dispatch(register(payload))
    };
}

const mapStateToProps = state => {
    return { auth: state.auth };
};

class RegistrationComponent extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            errorMessage: "",
            samePassword: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.register = this.register.bind(this);
    }
    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    validateEmail(email) {
        var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        return re.test(String(email).toLowerCase());
    }

    register() {
        const { username, email, password, confirmPassword } = this.state;

        if (password != confirmPassword)
            this.setState({ errorMessage: "Podane hasła muszą być takie same!" })
        else if (password.length < 6)
            this.setState({ errorMessage: "Podano zbyt krótkie hasło!" })
        else if (password.length > 40)
            this.setState({ errorMessage: "Podano zbyt długie hasło!" })
        else if (username.length < 3)
            this.setState({ errorMessage: "Podano zbyt krótki login!" })
        else if (username.length > 50)
            this.setState({ errorMessage: "Podano zbyt długi login!" })
        
        else {
            this.props.register({ username: username, email: email, password: password, role: ["user", "pm"], name: 'stefan' })
            this.setState({ errorMessage: "" })
        }

    }
    render() {
        const { auth } = this.props
        const { username, email, password, confirmPassword, errorMessage } = this.state;
        return (
            <div className="container">
                <div className="menuContent">
                    <h1 className="gameTitle">Zarejestruj się</h1>
                    <form >
                        <div className="buttonList">
                            <div className="field">
                                <label className="label">Login *</label>
                                <div className="control has-icons-left">
                                    <input className="input is-link is-rounded is-large" type="text" placeholder="Login" id="username" value={username} onChange={this.handleChange} />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-user"></i>
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">E-mail *</label>
                                <div className="control has-icons-left">
                                    <input className="input is-link is-rounded is-large" type="text" placeholder="E-mail" id="email" value={email} onChange={this.handleChange} />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-user"></i>
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Hasło *</label>
                                <div className="control has-icons-left">
                                    <input className="input is-link is-rounded is-large" type="password" placeholder="Hasło" id="password" value={password} onChange={this.handleChange} />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-user"></i>
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Powtórz hasło *</label>
                                <div className="control has-icons-left">
                                    <input className="input is-link is-rounded is-large" type="password" placeholder="Powtórz hasło" id="confirmPassword" value={confirmPassword} onChange={this.handleChange} />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-user"></i>
                                    </span>
                                </div>
                            </div>
                            <div className="subTitle">
                                {errorMessage &&
                                    <p>{errorMessage}</p>
                                }
                                {auth.registerSuccess &&
                                    <p>Rejestracja udana!</p>
                                }
                                {auth.registerFailed &&
                                    <p>Rejestracja nieudana!</p>
                                }
                                {auth.registerSuccess ?
                                    <NavLink to="/login" type="button" className="button is-large  is-link is-rounded is-fullwidth" onClick={this.login}>Zaloguj się</NavLink>
                                    :
                                    <a type="button" className="button is-large  is-link is-rounded is-fullwidth" onClick={this.register}>Zarejestruj się</a>
                                }
                                Masz już konto? <NavLink to="/login" className="subtitleBtn noBorder">Zaloguj się</NavLink>&nbsp;
                            lub <NavLink to="/#" className="subtitleBtn noBorder">Powróć do strony głównej</NavLink>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
const Registration = connect(mapStateToProps, mapDispatchToProps)(RegistrationComponent);
export default Registration;