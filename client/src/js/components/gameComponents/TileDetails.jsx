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
        ws: state.ws,
        actualGame: state.actualGame
    };
};



class TileDetailsComponent extends Component {
    constructor() {
        super();

        this.state = {
            initialized: false
        }

        this.joinGame = this.joinGame.bind(this);
    }

    joinGame(id){
        this.props.history.push("/game/"+id)
    }

    componentDidMount() {

    }

    render() {

        const { actualGame } = this.props;
        return (
            <div className="">
                
            </div>
        );
    }
}
const TileDetails = connect(mapStateToProps, mapDispatchToProps)(TileDetailsComponent);
export default TileDetails;




