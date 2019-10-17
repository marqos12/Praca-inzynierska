package pl.mojrzeszow.server.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.stereotype.Service;

import pl.mojrzeszow.server.enums.TileType;

@Service
public class TileTypeService {

    List<TileType> allTileTypes;
    List<TileType> roadTileTypes;
    List<TileType> roadAccessTileTypes;
    List<TileType> endTileTypes;

    private static final Random RANDOM = new Random();

    TileTypeService() {
        allTileTypes = new ArrayList<>();
        roadTileTypes = new ArrayList<>();
        roadAccessTileTypes = new ArrayList<>();
        endTileTypes = new ArrayList<>();
        for (TileType tileType : TileType.values()) {
            for (int i = 0; i < tileType.getProbability(); i++) {
                allTileTypes.add(tileType);
                if (tileType.getGeneralType() == "END_TILE")
                    endTileTypes.add(tileType);
                else {
                    roadTileTypes.add(tileType);
                    if (tileType == TileType.ROAD_ACCESS_DOUBLE || tileType == TileType.ROAD_ACCESS_SINGLE)
                        roadAccessTileTypes.add(tileType);
                }
            }
        }

    }

    public TileType getRandomTileType() {
        return allTileTypes.get(RANDOM.nextInt(allTileTypes.size()));
    }

    public TileType getRandomRoadTileType() {
        return roadTileTypes.get(RANDOM.nextInt(roadTileTypes.size()));
    }

    public TileType getRandomRoadAccessTileType() {
        return roadAccessTileTypes.get(RANDOM.nextInt(roadAccessTileTypes.size()));
    }

    public TileType getRandomEndTileType() {
        return endTileTypes.get(RANDOM.nextInt(endTileTypes.size()));
    }

}
