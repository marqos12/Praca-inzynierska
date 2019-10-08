

export const GREEN = "GREEN";
export const ACCESS = "ACCESS";
export const ROAD = "ROAD";


export function getTileEdges(tileType) {
    switch (tileType) {
        case "HOUSE":
            return [GREEN, GREEN, GREEN, ACCESS]
        case "SHOPPING_CENTER":
            return [GREEN, GREEN, GREEN, ACCESS]
        case "GROCERY_STORE":
            return [GREEN, GREEN, GREEN, ACCESS]
        case "CHURCH":
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
        case "GREEN_1":
            return [GREEN, GREEN, GREEN, GREEN]
        case "GREEN_2":
            return [GREEN, GREEN, GREEN, GREEN]
    }
}

export function getTileSortedEdges(tileType, angle) {
    angle = Math.round(angle / 90);
    let j = (angle + 6);
    let tileEdges = getTileEdges(tileType)
    let sortedEdges = [];

    for (let i = 0; i < 4; i++) {
        sortedEdges.push(tileEdges[j-- % 4])

    }
    console.log("Game mechanics sorted edges ", angle, sortedEdges)
    return sortedEdges;
}

export function getPossiblePlaces(tiles) {
    let newTile = tiles.pop();
    let newTileEdges = getTileSortedEdges(newTile.name, 0);

    let initPossiblePos = [];
    let tilesPos = [];
    tiles.forEach(tile => {
        tilesPos.push({ posX: tile.posX, posY: tile.posY });

        let tileEdges = getTileSortedEdges(tile.name, tile.angle);
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
    console.log("gameMechanics 107", newTile.angle, newTile, tiles)

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

    let newTileEdges = getTileSortedEdges(newTile.name, newTile.angle)

    console.log("gameMechanics 127", neighbourLeft, neighbourTop, neighbourRight, neighbourBottom)

    if (neighbourLeft.length > 0)
        if (newTileEdges[0] != GREEN && newTileEdges[0] == getTileSortedEdges(neighbourLeft[0].name, neighbourLeft[0].angle)[2])
            return true

    if (neighbourTop.length > 0)
        if (newTileEdges[1] != GREEN && newTileEdges[1] == getTileSortedEdges(neighbourTop[0].name, neighbourTop[0].angle)[3])
            return true

    if (neighbourRight.length > 0)
        if (newTileEdges[2] != GREEN && newTileEdges[2] == getTileSortedEdges(neighbourRight[0].name, neighbourRight[0].angle)[0])
            return true

    if (neighbourBottom.length > 0)
        if (newTileEdges[3] != GREEN && newTileEdges[3] == getTileSortedEdges(neighbourBottom[0].name, neighbourBottom[0].angle)[1])
            return true



    return false;
}