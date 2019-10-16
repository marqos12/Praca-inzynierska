
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

        let fontConf =  { fontFamily: '"Roboto"',fontSize:"16px" };

        this.tileName = new Phaser.GameObjects.Text(scene, this.x + 30, this.y + 30, "Nazwa: " + this.translateTileName(tile.name),fontConf)
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

        fetch(window.location.href.split("#")[0] + "api/game/tile/" + tile.id).then(response =>
            response.json()
        ).then(response => {
            console.log(response);
            this.details = response;
            this.tileName.text += `\n\nPoziom: ${response.lvl} \t Punkty: ${response.points}` +
                `\n\nKorzyści: ${this.getOutcomes(response.outcomeInfluence)}`;
                if(this.scene.state.actualGame.amIAuthor){
                    this.tileName.text +=`\n\nWymagane do awansu: ${this.getNeedToUpgrade(response.incomeInfluence,response.needToUppgrade,this.scene.state.actualGame.meGamer.ducklings)}`;
                }
        })
    }
    destroy() {
        this.background.destroy();
        this.tileName.destroy();
        this.closeButton.destroy();
        this.influenceField.forEach(x=>x.destroy());
    }
    move() {
        this.background.setPosition(this.tile.x + this.tile.displayWidth / 2, this.tile.y + this.tile.displayWidth / 4)
        this.tileName.setPosition(this.background.x - 180, this.background.y - 280);
        this.closeButton.setPosition(this.background.x + 180, this.background.y - 280);
        this.influenceField.forEach(x=>x.setPosition(this.tile.x + this.tile.displayWidth / 2, this.tile.y + this.tile.displayWidth / 2));
    }


    translateTileName(tileName) {
        switch (tileName) {
            case "HOUSE_1":
                return "Dom jednorodzinny";
            case "HOUSE_2":
                return "Blok mieszkalny";
            case "HOUSE_3":
                return "Osiedle";
            case "SHOP_1":
                return "Sklep osiedlowy";
            case "SHOP_2":
                return "Market";
            case "SHOP_3":
                return "Centrum handlowe";


            case "HOSPITAL_1":
                return "Szpital";
            case "FIRE_HOUSE_1":
                return "Remiza strażacka";
            case "POLICE_STATION_1":
                return "Komisariat policji";
            case "SCHOOL_1":
                return "Szkoła";
            case "SCHOOL_2":
                return "Uczelnia";
            case "GARBAGE_DUMP_1":
                return "Wysyppisko śmieci";
            case "SEWAGE_FARM_1":
                return "Oczyszczalnia ścieków";
            case "FACTORY_1":
                return "Fabryka";
            case "OFFICE_BUILDING_1":
                return "Biurowiec";
            case "RESTAURANT_1":
                return "Restauracja";
            case "PARK_1":
                return "Park";
            case "CHURCH_1":
                return "Kościół";

            case "GROCERY_STORE_1":
                return "Sklep spożywczy";
            case "ROAD_STRAIGHT_1":
                return "Droga";
            case "ROAD_ACCESS_SINGLE_1":
                return "Droga";
            case "ROAD_CROSS_SINGLE_1":
                return "Droga";
            case "ROAD_ACCESS_DOUBLE_1":
                return "Droga";
            case "ROAD_CROSS_DOUBLE_1":
                return "Droga";
            case "ROAD_CURVE_1":
                return "Droga";
        }
    }

    getOutcomes(influence) {
        let incomes = "";
        let incomesCounter = 1;
        if (influence.ducklings) { incomes += `ducklingsy: ${influence.ducklings}d;`; incomesCounter++;}
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (influence.people) { incomes += ` ludzie: ${influence.people}/ ${influence.peopleRange};`; incomesCounter++;  
            /*let circle = new Phaser.GameObjects.Ellipse(this.scene,0,0,influence.peopleRange*this.tile.displayWidth,influence.peopleRange*this.tile.displayWidth,0xff0000,0.2);this.influenceField.push(circle)*/}
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
        if (influence.energy) { incomes += ` energia elektryczna: ${influence.energy}/ ${influence.energyRange};` ; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (influence.science) { incomes += ` nauka: ${influence.science}/ ${influence.scienceRange};` ; }

        this.influenceField.forEach(x=>this.scene.add.existing(x));
        this.move();
        return incomes;
    }

    setRangeScale(){

    }

    getNeedToUpgrade(incomeInfluence, needToUpgrade,ducklings){
        let incomes = "";
        let incomesCounter = 0;
        if (needToUpgrade.ducklings) { incomes += `\n ducklingsy: ${needToUpgrade.ducklings}d (${ducklings}d);`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.people) { incomes += ` ludzie: ${needToUpgrade.people} (${incomeInfluence.people!=null?incomeInfluence.people:0});`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.shops) { incomes += ` sklep: ${needToUpgrade.shops} (${incomeInfluence.shops!=null?incomeInfluence.shops:0});`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.work) { incomes += ` praca: ${needToUpgrade.work} (${incomeInfluence.work!=null?incomeInfluence.work:0});`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.services) { incomes += ` usługi: ${needToUpgrade.services} (${incomeInfluence.services!=null?incomeInfluence.services:0});`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.goods) { incomes += ` dobra: ${needToUpgrade.goods} (${incomeInfluence.goods!=null?incomeInfluence.goods:0});`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.entertainment) { incomes += ` rozrywka: ${needToUpgrade.entertainment} (${incomeInfluence.entertainment!=null?incomeInfluence.entertainment:0});`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.cleanness) { incomes += ` czystość: ${needToUpgrade.cleanness} (${incomeInfluence.cleanness!=null?incomeInfluence.cleanness:0});`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.crimePrevention) { incomes += ` bezpieczeństwo: ${needToUpgrade.crimePrevention} (${incomeInfluence.crimePrevention!=null?incomeInfluence.crimePrevention:0});`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.fireSafety) { incomes += ` PPOŻ: ${needToUpgrade.fireSafety} (${incomeInfluence.fireSafety!=null?incomeInfluence.fireSafety:0});`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.medicalCare) { incomes += ` ochrona zdrowia: ${needToUpgrade.medicalCare} (${incomeInfluence.medicalCare!=null?incomeInfluence.medicalCare:0});`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.energy) { incomes += ` energia elektryczna: ${needToUpgrade.energy} (${incomeInfluence.energy!=null?incomeInfluence.energy:0});` ; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (needToUpgrade.science) { incomes += ` nauka: ${needToUpgrade.science} (${incomeInfluence.science!=null?incomeInfluence.science:0});` ; }
        return incomes;
    }
}
