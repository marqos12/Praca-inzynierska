import { translateTileName } from "../../gameMechanics";
import store from "../../../store";
import { gameUpdateTile } from "../../../actions/gameActions";

export class TileDetails {

    constructor(scene, tile) {
        this.scene = scene;
        this.tile = tile;
        this.x = tile.x;
        this.y = tile.y;
        this.background = new Phaser.GameObjects.Sprite(scene, tile.x, tile.y, "tileDetailsBackground");
        this.background.setOrigin(0.5, 1);
        this.background.setDepth(110);
        scene.add.existing(this.background);

        let fontConf = { fontFamily: '"Roboto"', fontSize: "16px" };

        this.tileName = new Phaser.GameObjects.Text(scene, this.x + 30, this.y + 30, "Nazwa: " + translateTileName(tile.name), fontConf)
        this.tileName.setDepth(111);
        this.tileName.setOrigin(0, 0);
        scene.add.existing(this.tileName);
        this.details = null;


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
        scene.add.existing(this.closeButton);

        this.influenceField = [];

        this.move();

        this.upgradeButton = null;
        this.canBeUpgrated = false;

        fetch(window.location.href.split("#")[0] + "api/game/tile/" + tile.id).then(response =>
            response.json()
        ).then(response => {
            console.log("TileDetails 45", response);
            this.details = response;
            this.tileName.text += `\n\nPoziom: ${response.lvl} \t Punkty: ${response.points}` +
                `\n\nKorzyści: ${this.getOutcomes(response.outcomeInfluence)}`;
            if (response.needToUppgrade != null && this.scene.state.actualGame.meGamer.id == this.tile.owner.id) {
                this.tileName.text += `\n\nWymagane do awansu: ${this.getNeedToUpgrade(response.incomeInfluence, response.needToUppgrade, this.scene.state.actualGame.meGamer.ducklings)}`;
                if (this.canBeUpgrated) {
                    this.upgradeButton = new Phaser.GameObjects.Sprite(scene, tile.x, tile.y, "upgradeButton");
                    this.upgradeButton.setDepth(111);
                    this.upgradeButton.setScale(0.7);
                    this.upgradeButton.setInteractive();
                    this.upgradeButton.on('pointerdown', (pointer) => {
                        if (pointer.leftButtonDown()) {
                          store.dispatch(gameUpdateTile({ id:this.tile.id }));
                          let updatedTile = new CustomEvent('closeTileDetails', { detail: this.tile });
                          dispatchEvent(updatedTile);
                        }
                    });
                    scene.add.existing(this.upgradeButton);
                    this.move();
                }
            }
        })
    }
    destroy() {
        this.background.destroy();
        this.tileName.destroy();
        this.closeButton.destroy();
        this.influenceField.forEach(x => x.destroy());
        if (this.upgradeButton) this.upgradeButton.destroy();
    }
    move() {
        this.background.setPosition(this.tile.x + this.tile.displayWidth / 2, this.tile.y + this.tile.displayWidth / 4)
        this.tileName.setPosition(this.background.x - 180, this.background.y - 280);
        this.closeButton.setPosition(this.background.x + 180, this.background.y - 280);
        this.influenceField.forEach(x => x.setPosition(this.tile.x + this.tile.displayWidth / 2, this.tile.y + this.tile.displayWidth / 2));
        if (this.upgradeButton) this.upgradeButton.setPosition(this.background.x + 130, this.background.y - 100);
    }



    getOutcomes(influence) {
        let incomes = "";
        let incomesCounter = 1;
        if (influence.ducklings) { incomes += `ducklingsy: ${influence.ducklings}d;`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (influence.people) {
            incomes += ` ludzie: ${influence.people}/ ${influence.peopleRange};`; incomesCounter++;
            /*let circle = new Phaser.GameObjects.Ellipse(this.scene,0,0,influence.peopleRange*this.tile.displayWidth,influence.peopleRange*this.tile.displayWidth,0xff0000,0.2);this.influenceField.push(circle)*/
        }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (influence.shops) { incomes += ` sklep: ${influence.shops}/ ${influence.shopsRange};`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (influence.work) { incomes += ` praca: ${influence.work}/ ${influence.workRange};`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (influence.services) { incomes += ` usługi: ${influence.services}/ ${influence.servicesRange};`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (influence.goods) { incomes += ` dobra: ${influence.goods}/ ${influence.goodsRange};`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (influence.entertainment) { incomes += ` rozrywka: ${influence.entertainment}/ ${influence.entertainmentRange};`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (influence.cleanness) { incomes += ` czystość: ${influence.cleanness}/ ${influence.cleannessRange};`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (influence.crimePrevention) { incomes += ` bezpieczeństwo: ${influence.crimePrevention}/ ${influence.crimePreventionRange};`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (influence.fireSafety) { incomes += ` PPOŻ: ${influence.fireSafety}/ ${influence.fireSafetyRange};`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (influence.medicalCare) { incomes += ` ochrona zdrowia: ${influence.medicalCare}/ ${influence.medicalCareRange};`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (influence.energy) { incomes += ` energia elektryczna: ${influence.energy}/ ${influence.energyRange};`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (influence.science) { incomes += ` nauka: ${influence.science}/ ${influence.scienceRange};`; }

        this.influenceField.forEach(x => this.scene.add.existing(x));
        this.move();
        return incomes;
    }

    setRangeScale() { }

    getNeedToUpgrade(incomeInfluence, needToUpgrade, ducklings) {
        let incomes = "";
        let incomesCounter = 0;

        let canBeUpgrated = true;

        if (needToUpgrade.ducklings) {
            incomes += `\n ducklingsy: ${needToUpgrade.ducklings}d (${ducklings}d);`; incomesCounter++;
            if (needToUpgrade.ducklings > ducklings) canBeUpgrated = false;
        }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.people) {
            incomes += ` ludzie: ${needToUpgrade.people} (${incomeInfluence.people != null ? incomeInfluence.people : 0});`; incomesCounter++;
            if (needToUpgrade.people > incomeInfluence.people) canBeUpgrated = false;
        }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.shops) {
            incomes += ` sklep: ${needToUpgrade.shops} (${incomeInfluence.shops != null ? incomeInfluence.shops : 0});`; incomesCounter++;
            if (needToUpgrade.shops > incomeInfluence.shops) canBeUpgrated = false;
        }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.work) {
            incomes += ` praca: ${needToUpgrade.work} (${incomeInfluence.work != null ? incomeInfluence.work : 0});`; incomesCounter++;
            if (needToUpgrade.work > incomeInfluence.work) canBeUpgrated = false;
        }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.services) {
            incomes += ` usługi: ${needToUpgrade.services} (${incomeInfluence.services != null ? incomeInfluence.services : 0});`; incomesCounter++;
            if (needToUpgrade.services > incomeInfluence.services) canBeUpgrated = false;
        }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.goods) {
            incomes += ` dobra: ${needToUpgrade.goods} (${incomeInfluence.goods != null ? incomeInfluence.goods : 0});`; incomesCounter++;
            if (needToUpgrade.goods > incomeInfluence.goods) canBeUpgrated = false;
        }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.entertainment) {
            incomes += ` rozrywka: ${needToUpgrade.entertainment} (${incomeInfluence.entertainment != null ? incomeInfluence.entertainment : 0});`; incomesCounter++;
            if (needToUpgrade.entertainment > incomeInfluence.entertainment) canBeUpgrated = false;
        }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.cleanness) {
            incomes += ` czystość: ${needToUpgrade.cleanness} (${incomeInfluence.cleanness != null ? incomeInfluence.cleanness : 0});`; incomesCounter++;
            if (needToUpgrade.cleanness > incomeInfluence.cleanness) canBeUpgrated = false;
        }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.crimePrevention) {
            incomes += ` bezpieczeństwo: ${needToUpgrade.crimePrevention} (${incomeInfluence.crimePrevention != null ? incomeInfluence.crimePrevention : 0});`; incomesCounter++;
            if (needToUpgrade.crimePrevention > incomeInfluence.crimePrevention) canBeUpgrated = false;
        }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.fireSafety) {
            incomes += ` PPOŻ: ${needToUpgrade.fireSafety} (${incomeInfluence.fireSafety != null ? incomeInfluence.fireSafety : 0});`; incomesCounter++;
            if (needToUpgrade.fireSafety > incomeInfluence.fireSafety) canBeUpgrated = false;
        }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.medicalCare) {
            incomes += ` ochrona zdrowia: ${needToUpgrade.medicalCare} (${incomeInfluence.medicalCare != null ? incomeInfluence.medicalCare : 0});`; incomesCounter++;
            if (needToUpgrade.medicalCare > incomeInfluence.medicalCare) canBeUpgrated = false;
        }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.energy) {
            incomes += ` energia elektryczna: ${needToUpgrade.energy} (${incomeInfluence.energy != null ? incomeInfluence.energy : 0});`; incomesCounter++;
            if (needToUpgrade.energy > incomeInfluence.energy) canBeUpgrated = false;
        }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.science) {
            incomes += ` nauka: ${needToUpgrade.science} (${incomeInfluence.science != null ? incomeInfluence.science : 0});`;
            if (needToUpgrade.science > incomeInfluence.science) canBeUpgrated = false;
        }
        this.canBeUpgrated = canBeUpgrated;
        return incomes;
    }
}
