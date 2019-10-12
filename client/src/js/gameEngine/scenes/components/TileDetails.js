
export class TileDetails {

    constructor(scene, tile) {
        this.scene = scene;
        this.tile = tile;
        this.x = tile.x;
        this.y = tile.y;
        console.log(tile)
        this.background = new Phaser.GameObjects.Sprite(scene, tile.x, tile.y, "tileDetailsBackground");
        this.background.setOrigin(0.5, 1);
        this.background.setDepth(110);
        scene.add.existing(this.background);

        this.tileName = new Phaser.GameObjects.Text(scene, this.x + 30, this.y + 30, "Nazwa: " + this.translateTileName(tile.name))
        this.tileName.setDepth(111);
        this.tileName.setOrigin(0, 0);
        scene.add.existing(this.tileName);
        this.details = null;
        console.log(window.location.href)
        fetch(window.location.href.split("#")[0] + "api/game/tile/" + tile.id).then(response =>
            response.json()
        ).then(response => {
            console.log(response);
            this.tileName.text += `\n\nPoziom: ${response.lvl} \t Punkty: ${response.points}` +
                `\n\nKorzyści: ${this.getOutcomes(response.outcomeInfluence)}`
        })

        this.move();
    }
    destroy() {
        this.background.destroy();
        this.tileName.destroy();
    }
    move() {
        this.background.setPosition(this.tile.x + this.tile.displayWidth / 2, this.tile.y + this.tile.displayWidth / 4)
        this.tileName.setPosition(this.background.x - 180, this.background.y - 280);
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
        if (influence.ducklings) { incomes += `ducklingsy: ${influence.ducklings}d;`; incomesCounter++; }
        if (incomesCounter == 2) { incomesCounter = 0; incomes += "\n"; }
        if (influence.people) { incomes += ` ludzie: ${influence.people}/ ${influence.peopleRange};`; incomesCounter++; }
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
        return incomes;
    }
}
