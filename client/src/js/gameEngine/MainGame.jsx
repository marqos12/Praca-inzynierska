import React, { Component } from "react";
import { connect } from "react-redux";

import GameComponent from "./GameComponent.jsx";
import comunicationEngine from "./comunicationEngine";

function mapDispatchToProps(dispatch) {
    return {

    };
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        actualGame: state.actualGame
    };
};

class MainGameComponent extends Component {
    constructor() {
        super();
        this.state = {
            gameJoined: false,
        }
    }

    componentDidMount() {
        if (this.props.actualGame.meGamer && !this.state.gameJoined) {
            console.log("mainGame 37", this.props)
            comunicationEngine.wsConnect(this.props.actualGame.meGamer);
            console.log("mainGame 39", this.props)
            this.setState({
                gameJoined: true,
            })
        }
    }

    render() {
        return (
            <div>
                <GameComponent />
                <div className="hud">
                    <div className="hud_card timer">
                        <img src="assets/timer.png"></img>
                        Upłynęło czasu: 15:11
                        <br />
                        <img src="assets/left.png"></img>
                        Upłynęło rund: 15/45
                    </div>
                    <div className="hud_card gamersList">
                        <div>
                            <img src="assets/arrow.png"></img>Stefan
                        </div>
                        <div>
                            <img src="assets/null.png"></img>Józef S
                        </div>
                    </div>
                    <div className="hud_card newTile">

                    </div>
                    <div className="hud_card resources">
                        <div >
                            <img src="assets/duck.png"></img>
                            1000
                        </div>
                        <div>
                            <img src="assets/P.png"></img>
                            99
                        </div>
                    </div>
                    <div className="hud_card rank">
                        <div>
                            <img src="assets/1.png"></img>Stefan 100P
                        </div>
                        <div>
                            <img src="assets/2.png"></img>Józef 99P
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const MainGame = connect(mapStateToProps, mapDispatchToProps)(MainGameComponent);
export default MainGame;




