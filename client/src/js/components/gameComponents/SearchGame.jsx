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
            initialized: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.joinGame = this.joinGame.bind(this);
    }



    joinGame(id){
        this.props.history.push("/newGame/"+id)
    }


    componentDidMount() {
        console.log("search game 45 ",this.props, this.state)
        if (!this.state.initialized) {
            if(this.props.ws.client){
            this.props.wsSubscribeGameListChannel(); 
            this.props.wsSendMessage({ channel: "/lobby/getGames", payload: "" });  
            this.setState({ initialized: true })
            }
        }
    }

    componentDidUpdate() {
        console.log("search game 54 ",this.props)
        if (!this.state.initialized) {
            if(this.props.ws.client){
            this.props.wsSubscribeGameListChannel(); 
            this.props.wsSendMessage({ channel: "/lobby/getGames", payload: "" });  
            this.setState({ initialized: true })
            }
        }
    }

    componentWillUnmount(){
        console.log("search game 76",this.props.location)
        this.props.wsUnsubscribeGameListChannel();
    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }
    render() {

        const { gamesList } = this.props;
        return (
            <div className="container">
                <div className="menuContent">
                    <h1 className="gameTitle">Lista otwartych gier </h1>

                    <div className="buttonList">

                        <a className="button is-large  is-link is-rounded is-fullwidth" onClick={() => this.joinGame(1)}>Podaj kod gry</a>


                        <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Gamers</th>
                                    <th>Game limit</th>
                                    <th>Author</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gamesList.map((game, index) => {
                                    return <tr key={index} onClick={() => this.joinGame(game.id)}>
                                        <td>{game.rts?"RTS":"Turowa"}</td>
                                        <td>{game.gamersCount}/{game.gamersCountLimit}</td>
                                        <td>{game.gameLimit}</td>
                                        <td>{game.author.username}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>


                    </div>

                </div>
            </div>
        );
    }
}
const SearchGame = connect(mapStateToProps, mapDispatchToProps)(SearchGamesComponent);
export default SearchGame;




