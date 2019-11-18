import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import { wsConnect, wsOpenPrivateCanals, wsSendMessage, wsChannelSubscription, wsSubscribeGameListChannel, wsUnsubscribeGameListChannel } from "../../actions/index";

function mapDispatchToProps(dispatch) {
    return {
        wsSubscribeGameListChannel: payload => dispatch(wsSubscribeGameListChannel(payload)),
        wsUnsubscribeGameListChannel: payload => dispatch(wsUnsubscribeGameListChannel(payload)),
        wsSendMessage: payload => dispatch(wsSendMessage(payload))
    };
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        cookies: state.cookies,
        ws: state.ws,
        gamesList: state.gamesList
    };
};



class SearchGamesComponent extends Component {
    constructor() {
        super();
        this.state = {
            initialized: false,
            gameIdInput:false,
            id:''
        }
        this.handleChange = this.handleChange.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.openInput = this.openInput.bind(this);
    }

    joinGame(id,game) {
        if(game==null || game.gamersCount<game.gamersCountLimit)
        this.props.history.push("/game/" + id)
    }

    componentDidMount() {
        if (!this.state.initialized) {
            if (this.props.ws.client) {
                this.props.wsSubscribeGameListChannel();
                this.props.wsSendMessage({ channel: "/lobby/getGames", payload: "" });
                this.setState({ initialized: true })
            }
        }
    }

    componentDidUpdate() {
        if (!this.state.initialized && this.props.ws.client) {
            this.props.wsSubscribeGameListChannel();
            this.props.wsSendMessage({ channel: "/lobby/getGames", payload: "" });
            this.setState({ initialized: true })
        }

    }

    componentWillUnmount() {
        this.props.wsUnsubscribeGameListChannel();
    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    openInput(){
        this.setState({gameIdInput:true})
    }

    render() {
        const { gamesList } = this.props;
        const { gameIdInput, id } = this.state;
        return (
            <div className="container">
                <div className="menuContent">
                    <h1 className="gameTitle">Lista otwartych gier </h1>
                    <div className="buttonList">
                       
                       {gameIdInput?
                        <div className="field">
                            <div className="control has-icons-left">
                                <input className="input is-link is-rounded is-large" type="text" id="id" autocomplete="off" placeholder="Kod gry" value={id} onChange={this.handleChange} />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-user"></i>
                                </span>
                            </div>
                            <a className="button is-large  is-link is-rounded is-fullwidth" onClick={() => this.joinGame(id)}>Dołącz do gry</a>
                        </div>:""}
                       
                        <a className="button is-large  is-link is-rounded is-fullwidth" onClick={() => this.openInput()}>Podaj kod gry</a>





                        <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                            <thead>
                                <tr>
                                    <th>Typ</th>
                                    <th>Gracze</th>
                                    <th>Limit gry</th>
                                    <th>Autor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gamesList.map((game, index) => {
                                    return <tr key={index} onClick={() => this.joinGame(game.id,game)}>
                                        <td>{game.rts ? "RTS" : "Turowa"}</td>
                                        <td>{game.gamersCount}/{game.gamersCountLimit}</td>
                                        <td>{game.gameLimit}</td>
                                        <td>{game.author.username}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                        <NavLink to="/#" className="button is-large  is-link is-rounded is-fullwidth" >Powrót</NavLink>
                    </div>
                </div>
            </div>
        );
    }
}
const SearchGame = connect(mapStateToProps, mapDispatchToProps)(SearchGamesComponent);
export default SearchGame;




