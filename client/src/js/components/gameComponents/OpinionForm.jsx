import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';

function mapDispatchToProps(dispatch) {
    return {
    };
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};



class OpinionComponent extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            message1: "",
            message2: "",
            message3: "",
            user:null,
            sended: false
        }


        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    sendMessage() {
        let statel = {...this.state};

        if(message1!=""){
              this.setState({ sended: true,
            user:this.props.auth.user, })
            statel.user = this.props.auth.user
        fetch("/api/game/opinion", {
            method: 'POST',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(statel),
        })
            .then(response => response.json()).then(response => {

            })
            .catch(response => {

            });
        }
      
    }

    render() {
        const { username, message1, message2, message3, sended } = this.state;
        return (
            <div className="container">
                <div className="menuContent">
                    <div className="buttonList">
                        {!sended?
                        <div>
                            <h1 className="gameTitle">Przekaż opinię</h1>
                            <br />
                            <p className="whiteText">Dziękuję za chęć zabawy w mojej grze! Przekaż mi proszę swoją opinię. Dzięki niej będę mógł ulepszyć grę na przyszłość.</p>
                            <br />
                            <div className="field">
                                <label className="label">Nick</label>
                                <div className="control has-icons-left">
                                    <input className="input is-link is-rounded is-large" autocomplete="off" type="text" id="username" placeholder="Nick" value={username} onChange={this.handleChange} />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-user"></i>
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Wiadomość</label>
                                <div className="control has-icons-left">
                                    <textarea className="textarea messageInput" rows="4" placeholder="Wpisz opinie" id="message1" value={message1} onChange={this.handleChange} onKeyPress={this.handleKeyPress}> </textarea>

                                    <span className="icon is-small is-left">
                                        <i className="fas fa-user"></i>
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Co było na plus?</label>
                                <div className="control has-icons-left">
                                    <textarea className="textarea messageInput" rows="4" placeholder="Wpisz opinie" id="message2" value={message2} onChange={this.handleChange} onKeyPress={this.handleKeyPress}> </textarea>

                                    <span className="icon is-small is-left">
                                        <i className="fas fa-user"></i>
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Jakie wady?</label>
                                <div className="control has-icons-left">
                                    <textarea className="textarea messageInput" rows="4" placeholder="Wpisz opinie" id="message3" value={message3} onChange={this.handleChange} onKeyPress={this.handleKeyPress}> </textarea>

                                    <span className="icon is-small is-left">
                                        <i className="fas fa-user"></i>
                                    </span>
                                </div>
                            </div>


                            <a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.sendMessage}>Prześlij</a>
                        </div>
:
                        <div>
                            <h1 className="gameTitle">Dziękuję za opinie!</h1>
                        </div>}
                        <NavLink to="/" className="button is-large  is-link is-rounded is-fullwidth" >Powrót do menu</NavLink>



                    </div>

                </div>
            </div>
        );
    }
}
const Opinion = connect(mapStateToProps, mapDispatchToProps)(OpinionComponent);
export default Opinion;