export const GREEN = "GREEN";
export const ACCESS = "ACCESS";
export const ROAD = "ROAD";

export function getTileEdges(tileType) {
    switch (tileType) {
        case "END_TILE":
            return [GREEN, GREEN, GREEN, ACCESS]
        case "ROAD_STRAIGHT":
            return [ROAD, GREEN, ROAD, GREEN]
        case "ROAD_ACCESS_SINGLE":
            return [ROAD, ACCESS, ROAD, GREEN]
        case "ROAD_ACCESS_DOUBLE":
            return [ROAD, ACCESS, ROAD, ACCESS]
        case "ROAD_CROSS_SINGLE":
            return [ROAD, ROAD, ROAD, GREEN]
        case "ROAD_CROSS_DOUBLE":
            return [ROAD, ROAD, ROAD, ROAD]
        case "ROAD_CURVE":
            return [GREEN, ROAD, ROAD, GREEN]
        case "GREEN":
            return [GREEN, GREEN, GREEN, GREEN]
        case "OPTIONAL":
            return [GREEN, GREEN, GREEN, ACCESS]
    }
}

export function getTileSortedEdges(tileType, angle) {
    angle = Math.round(angle / 90);
    let j = (angle + 6);
    let tileEdges = getTileEdges(tileType)
    let sortedEdges = [];

    for (let i = 0; i < 4; i++)
        sortedEdges.push(tileEdges[j-- % 4])

    return sortedEdges;
}

export function getPossiblePlaces(tiles) {
    let newTile = tiles.pop();
    let newTileEdges = getTileSortedEdges(newTile.generalType, 0);

    let initPossiblePos = [];
    let tilesPos = [];
    tiles.forEach(tile => {
        tilesPos.push({ posX: tile.posX, posY: tile.posY });

        let tileEdges = getTileSortedEdges(tile.generalType, tile.angle);
        for (let i = 0; i < 4; i++) {
            let j = 0;
            tileEdges.forEach(edge => {
                if (newTileEdges[i] == edge && edge != GREEN) {
                    initPossiblePos.push(getPossiblePos(j, tile.posX, tile.posY))
                }
                j++
            })
        }
    })

    let possiblePos = [];

    initPossiblePos.forEach(pos => {
        let sameTilesPos = tilesPos.filter(tpos => tpos.posX == pos.posX && tpos.posY == pos.posY);
        let samePossiblePos = possiblePos.filter(ppos => ppos.posX == pos.posX && ppos.posY == pos.posY);
        if (samePossiblePos.length == 0 && sameTilesPos.length == 0) possiblePos.push(pos)
    })

    return possiblePos;
}

export function getPossiblePos(i, posX, posY) {
    switch (i) {
        case 0:
            return { posX: posX - 1, posY: posY };
        case 1:
            return { posX: posX, posY: posY - 1 };
        case 2:
            return { posX: posX + 1, posY: posY };
        case 3:
            return { posX: posX, posY: posY + 1 };
    }
}

export function makeHighlightScale(highlight, scale) {
    let oldWidth = highlight.displayWidth;
    highlight.setScale(scale);
    let newWidth = highlight.displayWidth;
    highlight.x -= window.innerWidth / 2;
    highlight.x = highlight.x / oldWidth * newWidth;
    highlight.x += window.innerWidth / 2;
    highlight.y -= window.innerHeight / 2;
    highlight.y = highlight.y / oldWidth * newWidth;
    highlight.y += window.innerHeight / 2;
}

export function isThisPositionPossible(pos, possiblePositions) {
    return possiblePositions.filter(position => position.posX == pos.posX && position.posY == pos.posY).length > 0;
}

export function isThisPossibleRotation(newTile, tiles, posX, posY) {

    let neighbourLeft = tiles.filter(t =>
        t.posX == posX - 1 &&
        t.posY == posY
    )
    let neighbourTop = tiles.filter(t =>
        t.posX == posX &&
        t.posY == posY - 1
    )
    let neighbourRight = tiles.filter(t =>
        t.posX == posX + 1 &&
        t.posY == posY
    )
    let neighbourBottom = tiles.filter(t =>
        t.posX == posX &&
        t.posY == posY + 1
    )

    let newTileEdges = getTileSortedEdges(newTile.generalType, newTile.angle)

    if (neighbourLeft.length > 0)
        if (newTileEdges[0] != GREEN && newTileEdges[0] == getTileSortedEdges(neighbourLeft[0].generalType, neighbourLeft[0].angle)[2])
            return true

    if (neighbourTop.length > 0)
        if (newTileEdges[1] != GREEN && newTileEdges[1] == getTileSortedEdges(neighbourTop[0].generalType, neighbourTop[0].angle)[3])
            return true

    if (neighbourRight.length > 0)
        if (newTileEdges[2] != GREEN && newTileEdges[2] == getTileSortedEdges(neighbourRight[0].generalType, neighbourRight[0].angle)[0])
            return true

    if (neighbourBottom.length > 0)
        if (newTileEdges[3] != GREEN && newTileEdges[3] == getTileSortedEdges(neighbourBottom[0].generalType, neighbourBottom[0].angle)[1])
            return true

    return false;
}

export function getTileGeneralType(tileType) {
    switch (tileType) {
        case "HOUSE":
        case "SHOP":
        case "HOSPITAL":
        case "FIRE_HOUSE":
        case "POLICE_STATION":
        case "SCHOOL":
        case "GARBAGE_DUMP":
        case "SEWAGE_FARM":
        case "FACTORY":
        case "OFFICE_BUILDING":
        case "POWER_STATION":
        case "RESTAURANT":
        case "PARK":
        case "CHURCH": return "END_TILE";

        case "ROAD_STRAIGHT": return "ROAD_STRAIGHT";
        case "ROAD_ACCESS_SINGLE": return "ROAD_ACCESS_SINGLE";
        case "ROAD_ACCESS_DOUBLE": return "ROAD_ACCESS_DOUBLE";
        case "ROAD_CROSS_SINGLE": return "ROAD_CROSS_SINGLE";
        case "ROAD_CROSS_DOUBLE": return "ROAD_CROSS_DOUBLE";
        case "ROAD_CURVE": return "ROAD_CURVE";
        case "OPTIONAL": return "OPTIONAL";

        case "GREEN_1": return "GREEN";
        case "GREEN_2": return "GREEN";

    }




}

export function translateTileName(tileName) {
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
        case "OPTIONAL_1":
            return "Plac budowy";


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

export function getOutcomes(influence) {
    let incomes = "";
    let incomesCounter = 1;
    if (influence) {
        incomes += "Korzyści: "
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

        //this.influenceField.forEach(x => this.scene.add.existing(x));
        //this.move();
    }
    return incomes;
}

export function getNeedToUpgrade(incomeInfluence, needToUpgrade, ducklings) {
    let incomes = ""
    let canBeUpgrated = true;
    if (needToUpgrade) {
        incomes = "Wymagane do awansu: ";
        let incomesCounter = 0;

        console.log("gameMechanics 281", incomeInfluence, needToUpgrade, ducklings)

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
    }
    return { incomes: incomes, canBeUpgrated: canBeUpgrated };
}

export function getWayOfUpgrade(tile) {
    console.log(tile)
    switch (tile.name) {
        case "HOUSE_1":
            return ["HOUSE_2"];
        case "HOUSE_2":
            return ["HOUSE_3"];
        case "HOUSE_3":
            return [];
        case "SHOP_1":
            return ["SHOP_2"];
        case "SHOP_2":
            return ["SHOP_3"];
        case "SHOP_3":
            return [];

        case "OPTIONAL_1":
            return [
                "HOUSE_1",
                "SHOP_1",
                "RESTAURANT_1",
                "FACTORY_1",
                "ROAD_STRAIGHT_1",
                "OFFICE_BUILDING_1",
                "PARK_1",
                "SCHOOL_1",
                "HOSPITAL_1",
                "FIRE_HOUSE_1",
                "POLICE_STATION_1",
                "GARBAGE_DUMP_1",
                "SEWAGE_FARM_1",
                "CHURCH_1"];


        case "HOSPITAL_1":
            return [];
        case "FIRE_HOUSE_1":
            return [];
        case "POLICE_STATION_1":
            return [];
        case "SCHOOL_1":
            return ["SCHOOL_2"];
        case "SCHOOL_2":
            return [];
        case "GARBAGE_DUMP_1":
            return [];
        case "SEWAGE_FARM_1":
            return [];
        case "FACTORY_1":
            return [];
        case "OFFICE_BUILDING_1":
            return [];
        case "RESTAURANT_1":
            return [];
        case "PARK_1":
            return [];
        case "CHURCH_1":
            return [];

        case "GROCERY_STORE_1":
            return [];
        case "ROAD_STRAIGHT_1":
            return ["ROAD_STRAIGHT_1", "ROAD_ACCESS_SINGLE_1", "ROAD_CROSS_SINGLE_1", "ROAD_ACCESS_DOUBLE_1", "ROAD_CROSS_DOUBLE_1", "ROAD_CURVE_1"];
        case "ROAD_ACCESS_SINGLE_1":
            return ["ROAD_STRAIGHT_1", "ROAD_ACCESS_SINGLE_1", "ROAD_CROSS_SINGLE_1", "ROAD_ACCESS_DOUBLE_1", "ROAD_CROSS_DOUBLE_1", "ROAD_CURVE_1"];
        case "ROAD_CROSS_SINGLE_1":
            return ["ROAD_STRAIGHT_1", "ROAD_ACCESS_SINGLE_1", "ROAD_CROSS_SINGLE_1", "ROAD_ACCESS_DOUBLE_1", "ROAD_CROSS_DOUBLE_1", "ROAD_CURVE_1"];
        case "ROAD_ACCESS_DOUBLE_1":
            return ["ROAD_STRAIGHT_1", "ROAD_ACCESS_SINGLE_1", "ROAD_CROSS_SINGLE_1", "ROAD_ACCESS_DOUBLE_1", "ROAD_CROSS_DOUBLE_1", "ROAD_CURVE_1"];
        case "ROAD_CROSS_DOUBLE_1":
            return ["ROAD_STRAIGHT_1", "ROAD_ACCESS_SINGLE_1", "ROAD_CROSS_SINGLE_1", "ROAD_ACCESS_DOUBLE_1", "ROAD_CROSS_DOUBLE_1", "ROAD_CURVE_1"];
        case "ROAD_CURVE_1":
            return ["ROAD_STRAIGHT_1", "ROAD_ACCESS_SINGLE_1", "ROAD_CROSS_SINGLE_1", "ROAD_ACCESS_DOUBLE_1", "ROAD_CROSS_DOUBLE_1", "ROAD_CURVE_1"];
    }
}