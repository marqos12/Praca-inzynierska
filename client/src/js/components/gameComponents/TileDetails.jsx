import React, { Component } from "react";
import { connect } from "react-redux";
import { translateTileName, getOutcomes, getNeedToUpgrade, getWayOfUpgrade, getTileOwnerName } from "../../gameEngine/gameMechanics";
import { gameShowTileDetails, gameUpdateTile, gameRotateTile, gameRestoreTileRotate } from "../../actions/gameActions";

function mapDispatchToProps(dispatch) {
    return {
        gameShowTileDetails: (payload) => dispatch(gameShowTileDetails(payload)),
        gameUpdateTile: (payload) => dispatch(gameUpdateTile(payload)),
        gameRotateTile: () => dispatch(gameRotateTile()),
        gameRestoreTile: () => dispatch(gameRestoreTileRotate())
    };
}

const mapStateToProps = state => {
    return {
        actualGame: state.actualGame
    };
};

class TileDetailsComponent extends Component {
    constructor() {
        super();

        this.state = {
            initialized: false,
            lvlNpoint: "",
            outcomes: "",
            needToUppgrade: "",
            canBeUpgraded: false,
            owning: false,
            canBeDestroyed: false,
            canBeRotated: false,
            rotateMode: false,
            destroyMode: false,
            destroyCost: 0,
            modernizeMode: false,
            modernizeWays: [],
            modernizePage: 0,
            modernizeName: "",
            modernizeCost: 0,
            modernizeProfit: ""
        }
        this.close = this.close.bind(this);
        this.destroy = this.destroy.bind(this);
        this.confirmDestroy = this.confirmDestroy.bind(this);
        this.back = this.back.bind(this);
        this.upgrade = this.upgrade.bind(this);
        this.showWayOfUpgrade = this.showWayOfUpgrade.bind(this);
        this.nextUpgradePage = this.nextUpgradePage.bind(this);
        this.getWaysOfModernize = this.getWaysOfModernize.bind(this);
        this.chooseWayOfModernize = this.chooseWayOfModernize.bind(this);
        this.build = this.build.bind(this);
        this.rotate = this.rotate.bind(this);
        this.rotateSave = this.rotateSave.bind(this);
    }

    componentDidMount() {
        this.setState(Object.assign({}, this.state, {
            canBeDestroyed: (this.props.actualGame.tileDetails.name != "OPTIONAL_1" && this.props.actualGame.tileDetails.name != "ROAD_STRAIGHT_1")
                && this.props.actualGame.tileDetails.owner && this.props.actualGame.meGamer.id == this.props.actualGame.tileDetails.owner.id,
            canBeRotated: this.props.actualGame.tileDetails.owner && this.props.actualGame.meGamer.id == this.props.actualGame.tileDetails.owner.id
        }))

        fetch("api/game/tile/" + this.props.actualGame.tileDetails.id).then(response =>
            response.json()
        ).then(response => {

            let lvlNpoint = `Poziom: ${response.lvl}  Punkty: ${response.points}`;
            let outcomes = `${getOutcomes(response.outcomeInfluence, response.summaryDucklings, response.usedInfluence)}`;

            if ((response.needToUppgrade != null || this.props.actualGame.tileDetails.name == "OPTIONAL_1" || this.props.actualGame.tileDetails.name == "ROAD_STRAIGHT_1") && this.props.actualGame.meGamer.id == this.props.actualGame.tileDetails.owner.id) {
                let canBeUpgraded = false;
                let a = getNeedToUpgrade(response.incomeInfluence, response.needToUppgrade, this.props.actualGame.meGamer.ducklings, canBeUpgraded);
                canBeUpgraded = a.canBeUpgrated;

                let needToUppgrade = a.incomes;

                if (canBeUpgraded) {

                }
                this.setState(Object.assign({}, this.state, {

                    needToUppgrade: needToUppgrade,
                    canBeUpgraded: canBeUpgraded
                }))
            }

            this.setState(Object.assign({}, this.state, {
                lvlNpoint: lvlNpoint,
                outcomes: outcomes,
            }))

        })
    }


    close() {
        this.props.gameRestoreTile();
        this.props.gameShowTileDetails(null)
    }

    destroy() {
        fetch("api/game/tile/rebuild/" + this.props.actualGame.tileDetails.name.slice(0, -2) + "/1").then(response =>
            response.json()
        ).then(response => {
            this.setState(Object.assign({}, this.state, {
                destroyMode: true,
                destroyCost: response.deconstructionCosts
            }))

        })
    }

    back() {
        if (!this.state.modernizeMode) {
            this.setState(Object.assign({}, this.state, {
                destroyMode: false
            }))
        }
        else {
            if (this.state.modernizeWays.length == 1) {
                this.upgrade();
            } else
                this.setState(Object.assign({}, this.state, {
                    modernizeMode: false
                }))
        }
    }

    confirmDestroy() {
        if (this.props.actualGame.tileDetails.name.includes("ROAD"))
            this.props.gameUpdateTile({ id: this.props.actualGame.tileDetails.id, type: "ROAD_STRAIGHT" });
        else
            this.props.gameUpdateTile({ id: this.props.actualGame.tileDetails.id, type: "OPTIONAL" });
        this.close();
    }

    upgrade() {

        if (this.props.actualGame.tileDetails.name != "OPTIONAL_1" && this.props.actualGame.tileDetails.name != "ROAD_STRAIGHT_1") {
            this.props.gameUpdateTile({ id: this.props.actualGame.tileDetails.id });
            this.close();
        }
        else if (this.upgradeMode) {
            this.props.gameUpdateTile({ id: this.props.actualGame.tileDetails.id, type: this.waysOfUpgrade[0].name.slice(0, -2) });
            this.close();
        }
        else {
            this.showWayOfUpgrade();
        }
    }

    showWayOfUpgrade() {
        let modernizeWays = [];
        let wayOfUpdate = getWayOfUpgrade(this.props.actualGame.tileDetails);

        wayOfUpdate.forEach(w => {
            let name = w.slice(0, -2)
            modernizeWays.push(name);
        });

        this.setState(Object.assign({}, this.state, {
            modernizeMode: true,
            modernizeWays: modernizeWays
        }))

    }

    nextUpgradePage(direction) {
        this.setState(Object.assign({}, this.state, {
            modernizePage: this.state.modernizePage + direction
        }))
    }

    getWaysOfModernize() {
        let i = 0;
        let ways = [];
        this.state.modernizeWays.forEach(w => {
            if (i >= this.state.modernizePage * 4 && i < (this.state.modernizePage + 1) * 4)
                ways.push(w)
            i++
        });
        return ways;
    }

    chooseWayOfModernize(way) {
        let ways = [];
        ways.push(way);
        this.setState(Object.assign({}, this.state, {
            modernizeWays: ways,
            modernizePage: 0
        }))

        fetch("api/game/tile/rebuild/" + way + "/1").then(response =>
            response.json()
        ).then(response => {
            let modernizeCost = response.buildCosts;
            let modernizeProfit = getOutcomes(response.outcomeInfluence, response.summaryDucklings)
            let modernizeName = translateTileName(way + "_1")

            this.setState(Object.assign({}, this.state, {
                modernizeCost: modernizeCost,
                modernizeProfit: modernizeProfit,
                modernizeName: modernizeName
            }))
        })

    }

    rotate() {
        this.props.gameRotateTile();
        this.setState({ rotateMode: true })
    }
    rotateSave() {
        this.props.gameUpdateTile({ id: this.props.actualGame.tileDetails.id, angle: this.props.actualGame.tileDetails.angle });
        this.close();
    }

    stopPropagation(e) {
        e.persist();
        e.nativeEvent.stopImmediatePropagation();
        e.stopPropagation();
    }

    build() {

        this.props.gameUpdateTile({ id: this.props.actualGame.tileDetails.id, type: this.state.modernizeWays[0] });
        this.close();
    }

    render() {
        const { actualGame } = this.props;
        const {
            lvlNpoint,
            outcomes,
            needToUppgrade,
            destroyCost,
            canBeUpgraded,
            destroyMode,
            canBeDestroyed,
            modernizeMode,
            modernizePage,
            modernizeName,
            modernizeCost,
            modernizeProfit,
            canBeRotated,
            rotateMode,
        } = this.state;
        return (
            <div className="" onClick={this.stopPropagation}>
                {!modernizeMode ?
                    <div>
                        <p>Nazwa: {translateTileName(actualGame.tileDetails.name)}</p>
                        <p>Właściciel: {getTileOwnerName(actualGame.tileDetails)}</p>

                        <br />
                        {!destroyMode ?
                            <div>
                                {!rotateMode ? <div>
                                    <p>{lvlNpoint}</p>
                                    <br />
                                    <p>{outcomes}</p>
                                    <br />
                                    <p>{needToUppgrade}</p>

                                    {canBeUpgraded ?
                                        <a className="button is-large  is-link is-rounded is-fullwidth upgradeButton" onClick={this.upgrade}>Ulepsz</a>
                                        : <span></span>
                                    }

                                </div> : <div>
                                        <a className="button is-large  is-link is-rounded is-fullwidth rotateButtons" onClick={this.rotateSave}>Zapisz</a>
                                        <a className="button is-large  is-link is-rounded is-fullwidth rotateButtons" onClick={this.rotate}>Obróć</a>
                                        <a className="button is-large  is-link is-rounded is-fullwidth rotateButtons" onClick={this.close}>Anuluj</a>
                                    </div>}

                                <img src="assets/closeB.png" className="closeButton" onClick={this.close} />

                                {canBeDestroyed ?
                                    <img src="assets/buldozer.png" className="destroyButton" onClick={this.destroy} />
                                    : <span></span>
                                }
                                {canBeRotated ?
                                    <img src="assets/rotate.png" className="rotateButton" onClick={this.rotate} />
                                    : <span></span>
                                }

                            </div>
                            :
                            <div>
                                <p>Wyburzenie kosztować będzie: {destroyCost}</p>
                                <br />
                                <p>Czy na pewno chcesz wybużyć budynek:</p>
                                <p> {translateTileName(actualGame.tileDetails.name)}</p>
                                {destroyCost <= actualGame.meGamer.ducklings ?
                                    <a className="button is-large  is-link is-rounded is-fullwidth upgradeButton" onClick={this.confirmDestroy}>Zniszcz</a>
                                    : <span></span>
                                }
                                <a className="button is-large  is-link is-rounded is-fullwidth upgradeButton" onClick={this.back}>Powrót</a>
                            </div>
                        }
                    </div> :
                    <div>
                        <p>Dostępne opcje rozwoju płytki:</p>
                        {this.getWaysOfModernize().map((way, index) => {
                            return <img key={index} src={'assets/plates/jpg/' + way + '.jpg'} className={"modernizeImage" + index} onClick={() => this.chooseWayOfModernize(way)} />
                        })}
                        {modernizePage > 0 ?
                            <img src="assets/arrL.png" className="arrL" onClick={() => this.nextUpgradePage(-1)} />
                            : <span></span>
                        }
                        {this.getWaysOfModernize().length == 4 ?
                            <img src="assets/arrR.png" className="arrR" onClick={() => this.nextUpgradePage(1)} />
                            : <span></span>
                        }
                        {this.getWaysOfModernize().length == 1 ?
                            <div class="modernizeWay">
                                <p>Nazwa: {modernizeName}</p>
                                <p>Wymagane do budowy: {modernizeCost}d</p>
                                <p>Korzyści: {modernizeProfit}</p>
                                {modernizeCost <= actualGame.meGamer.ducklings ?
                                    <a className="button is-large  is-link is-rounded is-fullwidth upgradeButton" onClick={this.build}>Wybuduj</a>
                                    : <span></span>
                                }
                                <a className="button is-large  is-link is-rounded is-fullwidth upgradeButton" onClick={this.back}>Powrót</a>
                            </div>
                            : <a className="button is-large  is-link is-rounded is-fullwidth upgradeButton upgradeBack" onClick={this.back}>Powrót</a>
                        }
                    </div>}


                <img src="assets/closeB.png" className="closeButton" onClick={this.close} />

                {canBeDestroyed ?
                    <img src="assets/buldozer.png" className="destroyButton" onClick={this.destroy} />
                    : <span></span>
                }
            </div>
        );
    }
}
const TileDetails = connect(mapStateToProps, mapDispatchToProps)(TileDetailsComponent);
export default TileDetails;




