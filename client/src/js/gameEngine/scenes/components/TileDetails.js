import { translateTileName, getOutcomes, getNeedToUpgrade, getWayOfUpgrade } from "../../gameMechanics";
import store from "../../../store";
import { gameUpdateTile } from "../../../actions/gameActions";
import { Tile } from "./Tile";

export class TileDetails {

    constructor(scene, tile) {
        this.scene = scene;
        this.tile = tile;
        this.x = tile.x;
        this.y = tile.y;
        let fontConf = { fontFamily: '"Roboto"', fontSize: "16px" };
        this.details = null;
        this.showUpgradeDetails = false;
        this.showBackButton = false;
        this.influenceField = [];
        this.upgradeButton = null;
        this.canBeUpgrated = false;
        this.upgradePage = 0;
        this.upgradeMode = false;
        this.waysOfUpgrade = [];
        this.showUpgradeButton = true;
        this.destroyButton = null;
        this.canBeDestroyed = (this.tile.name != "OPTIONAL_1" && this.tile.name != "ROAD_STRAIGHT_1") && this.tile.owner && this.scene.state.actualGame.meGamer.id == this.tile.owner.id

        this.background = new Phaser.GameObjects.Sprite(scene, tile.x, tile.y, "tileDetailsBackground");
        this.background.setOrigin(0.5, 1);
        this.background.setDepth(110);
        this.background.setInteractive();
        this.background.on('pointerdown', (pointer) => {
            this.scene.input.activePointer.isDown = false;
        });
        scene.add.existing(this.background);

        this.tileName = new Phaser.GameObjects.Text(scene, this.x + 30, this.y + 30, "Nazwa: " + translateTileName(tile.name), fontConf)
        this.tileName.setDepth(111);
        this.tileName.setOrigin(0, 0);
        scene.add.existing(this.tileName);

        this.upgradeDetails = new Phaser.GameObjects.Text(scene, this.x + 30, this.y + 30, "", fontConf)
        this.upgradeDetails.setDepth(111);
        this.upgradeDetails.setOrigin(0, 0);
        this.scene.add.existing(this.upgradeDetails);

        this.closeButton = new Phaser.GameObjects.Sprite(scene, tile.x, tile.y, "closeButton");
        this.closeButton.setDepth(111);
        this.closeButton.setScale(0.5);
        this.closeButton.setInteractive();
        this.closeButton.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                let closeTileDetails = new CustomEvent('closeTileDetails', { detail: this });
                dispatchEvent(closeTileDetails);
            }
        });
        this.scene.add.existing(this.closeButton);

        this.backButton = new Phaser.GameObjects.Sprite(scene, tile.x, tile.y, "backButton");
        this.backButton.setDepth(111);
        this.backButton.setScale(0.7);
        this.backButton.setInteractive();
        this.backButton.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                if (this.upgradeMode && !this.showUpgradeDetails) {
                    this.upgradeMode = false;
                    this.showBackButton = false;
                    this.showUpgradeDetails = false;
                    this.waysOfUpgrade.forEach(w => { w.destroy(0) });
                    this.waysOfUpgrade = [];
                    this.tileName.text = "Nazwa: " + translateTileName(tile.name);
                    this.tileDetails()
                    this.showUpgradeButton = true;
                    if (this.destroyButton) { this.destroyButton.destroy(); this.destroyButton = null; }
                }
                else {
                    this.showUpgradeDetails = false
                    this.waysOfUpgrade.forEach(w => { w.destroy(0) });
                    this.waysOfUpgrade = [];
                    this.showWayOfUpgrade();
                    this.upgradeDetails.text = ""
                    this.showUpgradeButton = false;
                }
            }
        });
        scene.add.existing(this.backButton);

        this.buldozerButton = new Phaser.GameObjects.Sprite(scene, tile.x, tile.y, "buldozerButton");
        this.buldozerButton.setDepth(111);
        this.buldozerButton.setScale(0.7);
        this.buldozerButton.setInteractive();
        this.buldozerButton.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.tileName.text = "Nazwa: " + translateTileName(tile.name);
                fetch(window.location.href.split("#")[0] + "api/game/tile/rebuild/" + this.tile.name.slice(0, -2) + "/1").then(response =>
                    response.json()
                ).then(response => {
                    this.tileName.text += `\n\nWyburzenie kosztować będzie ${response.deconstructionCosts} d \n\nCzy na pewno chcesz wyburzyć budynek:\n\t ${translateTileName(tile.name)}`;
                    this.upgradeMode = true;
                    this.showBackButton = true;

                    if(response.deconstructionCosts <= this.scene.state.actualGame.meGamer.ducklings) {
                    this.destroyButton = new Phaser.GameObjects.Sprite(scene, tile.x, tile.y, "destroyButton");
                    this.destroyButton.setDepth(111);
                    this.destroyButton.setScale(0.7);
                    this.destroyButton.setInteractive();
                    this.destroyButton.on('pointerdown', (pointer) => {
                        if (pointer.leftButtonDown()) {
                            if (this.tile.name.includes("ROAD"))
                                store.dispatch(gameUpdateTile({ id: this.tile.id, type: "ROAD_STRAIGHT" }));
                            else
                                store.dispatch(gameUpdateTile({ id: this.tile.id, type: "OPTIONAL" }));
                            let updatedTile = new CustomEvent('closeTileDetails', { detail: this.tile });
                            dispatchEvent(updatedTile);

                        }
                    });
                    scene.add.existing(this.destroyButton);
                }
                })
            }
        });
        scene.add.existing(this.buldozerButton);

        this.arrowLeft = new Phaser.GameObjects.Sprite(this.scene, this.tile.x, this.tile.y, "arrowLeft");
        this.arrowLeft.setDepth(111);
        this.arrowLeft.setScale(0.5);
        this.arrowLeft.setInteractive();
        this.arrowLeft.on('pointerdown', (pointer) => {
            this.upgradePage--;
            this.move();
        });
        this.scene.add.existing(this.arrowLeft);

        this.arrowRight = new Phaser.GameObjects.Sprite(this.scene, this.tile.x, this.tile.y, "arrowRight");
        this.arrowRight.setDepth(111);
        this.arrowRight.setScale(0.5);
        this.arrowRight.setInteractive();
        this.arrowRight.on('pointerdown', (pointer) => {
            this.upgradePage++;
            this.move();
        });
        this.scene.add.existing(this.arrowRight);

        fetch(window.location.href.split("#")[0] + "api/game/tile/" + tile.id).then(response =>
            response.json()
        ).then(response => {
            this.details = response;
            this.tileDetails()
        })

        this.move();
    }


    destroy() {
        this.background.destroy();
        this.tileName.destroy();
        this.closeButton.destroy();
        if (this.upgradeButton) this.upgradeButton.destroy();
        this.waysOfUpgrade.forEach(w => w.destroy())
        if (this.arrowLeft) this.arrowLeft.destroy();
        if (this.arrowRight) this.arrowRight.destroy();
        this.upgradeDetails.destroy();
        this.backButton.destroy();
        this.buldozerButton.destroy();
        if (this.destroyButton) this.destroyButton.destroy();
    }

    move() {
        this.background.setPosition(this.tile.x + this.tile.displayWidth / 2, this.tile.y + this.tile.displayWidth / 4)
        this.tileName.setPosition(this.background.x - 180, this.background.y - 280);
        this.closeButton.setPosition(this.background.x + 180, this.background.y - 280);
        if (this.upgradeButton) if (this.showUpgradeButton) this.upgradeButton.setPosition(this.background.x + 130, this.background.y - 100); else this.upgradeButton.setPosition(-300, -300)
        if (this.showBackButton) this.backButton.setPosition(this.background.x + 0, this.background.y - 100); else this.backButton.setPosition(-300, -300)
        if (this.destroyButton) this.destroyButton.setPosition(this.background.x + 130, this.background.y - 100);

        let i = 0;
        this.waysOfUpgrade.forEach(w => {
            if (i >= this.upgradePage * 4 && i < (this.upgradePage + 1) * 4)
                w.setPosition(this.background.x - 180 + w.displayWidth * (i % 4), this.background.y - 240)
            else
                w.setPosition(-300, -300)
            i++
        });
        if (this.upgradeMode) {
            if (this.upgradePage > 0) this.arrowLeft.setPosition(this.background.x - 160, this.background.y - 120); else this.arrowLeft.setPosition(-300, -300);
            if ((this.upgradePage + 1) * 4 < this.waysOfUpgrade.length) this.arrowRight.setPosition(this.background.x - 120, this.background.y - 120); else this.arrowRight.setPosition(-300, -300);
        }
        else {
            this.arrowLeft.setPosition(-300, -300);
            this.arrowRight.setPosition(-300, -300);
        }
        this.upgradeDetails.setPosition(this.background.x - 70, this.background.y - 240)
        if (this.canBeDestroyed) this.buldozerButton.setPosition(this.background.x + 175, this.background.y - 230); else this.buldozerButton.setPosition(-300, -300);
    }

    upgradeButtonClick() {
        this.showBackButton = true;
        if (this.tile.name != "OPTIONAL_1" && this.tile.name != "ROAD_STRAIGHT_1") {
            store.dispatch(gameUpdateTile({ id: this.tile.id }));
            let updatedTile = new CustomEvent('closeTileDetails', { detail: this.tile });
            dispatchEvent(updatedTile);
        }
        else if (this.upgradeMode) {
            store.dispatch(gameUpdateTile({ id: this.tile.id, type: this.waysOfUpgrade[0].name.slice(0, -2) }));
            let updatedTile = new CustomEvent('closeTileDetails', { detail: this.tile });
            dispatchEvent(updatedTile);
        }
        else {
            this.showWayOfUpgrade();
            this.showUpgradeButton = false;
        }

    }

    tileDetails() {

        this.tileName.text += `\n\nPoziom: ${this.details.lvl} \t Punkty: ${this.details.points}` +
            `\n\n${getOutcomes(this.details.outcomeInfluence)}`;

        if ((this.details.needToUppgrade != null || this.tile.name == "OPTIONAL_1" || this.tile.name == "ROAD_STRAIGHT_1") && this.scene.state.actualGame.meGamer.id == this.tile.owner.id) {
            let a = getNeedToUpgrade(this.details.incomeInfluence, this.details.needToUppgrade, this.scene.state.actualGame.meGamer.ducklings, this.canBeUpgrated);
            this.canBeUpgrated = a.canBeUpgrated;

            this.tileName.text += `\n\n${a.incomes}`;

            if (this.canBeUpgrated) {
                this.upgradeButton = new Phaser.GameObjects.Sprite(this.scene, this.tile.x, this.tile.y, this.details.needToUppgrade != null ? "upgradeButton" : "buildButton");
                this.upgradeButton.setDepth(111);
                this.upgradeButton.setScale(0.7);
                this.upgradeButton.setInteractive();
                this.upgradeButton.on('pointerdown', (pointer) => {

                    if (pointer.leftButtonDown()) {
                        this.upgradeButtonClick();
                    }

                });
                this.scene.add.existing(this.upgradeButton);

                this.move();
            }
        }
    }

    showWayOfUpgrade() {
        this.tileName.text = "Dostępne opcje rozwoju płytki:"
        let wayOfUpdate = getWayOfUpgrade(this.tile);

        wayOfUpdate.forEach(w => {

            let way = new Tile(this.scene, this.tile.x, this.tile.y, w);
            way.setDepth(111);
            way.setScale(0.3);
            way.setInteractive();
            way.on('pointerdown', (pointer) => {
                this.waysOfUpgrade.filter(w => w.name != way.name).forEach(w => w.destroy());
                this.waysOfUpgrade = [way];
                this.upgradePage = 0;
                this.upgradeDetails.text = "Nazwa: " + translateTileName(way.name);
                this.showUpgradeDetails = true;

                fetch(window.location.href.split("#")[0] + "api/game/tile/rebuild/" + way.name.slice(0, -2) + "/1").then(response =>
                    response.json()
                ).then(response => {
                    this.upgradeDetails.text += `\nWymagane do budowy:\n${response.buildCosts} d\n${getOutcomes(response.outcomeInfluence)}`;
                    console.log('TileDetails 267 przycisk budowania placu budowy',response.buildCosts,this.scene.state.actualGame.meGamer.ducklings,response.buildCosts <= this.scene.state.actualGame.meGamer.ducklings)
                 if(response.buildCosts <= this.scene.state.actualGame.meGamer.ducklings) 
                    this.showUpgradeButton = true;
                })

            });
            this.scene.add.existing(way);
            this.waysOfUpgrade.push(way);
        });

        this.upgradeMode = true;
        this.move();
    }
}
