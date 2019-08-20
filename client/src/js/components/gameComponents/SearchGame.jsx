import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import { wsConnect, wsOpenPrivateCanals, wsSendMessage } from "../../actions/index";

function mapDispatchToProps(dispatch) {
    return {
        wsConnect: () => dispatch(wsConnect()),
        wsOpenPrivateCanals: () => dispatch(wsOpenPrivateCanals()),
        wsSendMessage: payload => dispatch(wsSendMessage(payload))
    };
}

const mapStateToProps = state => {
    return { 
        auth: state.auth,
        cookies: state.cookies,
        ws : state.ws,
        gamesList: state.gamesList
    };
};



class SearchGamesComponent extends Component {
    constructor() {
        super();
        
        this.state={
            initialized: false 
        }

        this.wsConnect = this.wsConnect.bind(this);
        this.wsOpenPrivateCanals = this.wsOpenPrivateCanals.bind(this);
        this.wsSendMessage = this.wsSendMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    wsConnect() {
        this.props.wsConnect();
    }
    wsOpenPrivateCanals() {
        this.props.wsOpenPrivateCanals();
    }
    wsSendMessage() {
        this.props.wsSendMessage({ channel: "/lobby/getGames",payload:"" });
    }

    componentWillMount(){
        
    }

    componentDidMount(){
        if(this.props.ws.client){
            this.props.wsOpenPrivateCanals();
        }
        else {
            this.props.wsConnect();
        }
    }

    componentWillUpdate(){
        if(!this.state.initialized)
        {
            this.setState({initialized:true})
            this.props.wsSendMessage({ channel: "/lobby/getGames",payload:"" });
        }                
    }
   
    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }
    render() {

        const { gamesList } = this.props;
        return (
            <div className="container">
                <div className="menuContent">
                    <h1 className="gameTitle">Utwórz nową grę </h1>

                    <div className="buttonList">
                        
                        <a className="button is-large  is-link is-rounded is-fullwidth" onClick={this.wsSendMessage}>Szukaj gry</a>
                        
                        {gamesList.map((game,index)=>{
                            return <p>{game.id} {game.rts} {game.author.name}</p>
                        })}
                    </div>

                </div>
            </div>
        );
    }
}
const SearchGame = connect(mapStateToProps, mapDispatchToProps)(SearchGamesComponent);
export default SearchGame;