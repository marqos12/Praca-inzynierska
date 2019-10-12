package pl.mojrzeszow.server.enums;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public enum TileType {
	HOUSE(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",60),
	SHOP(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",20),
	HOSPPITAL(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1),
	FIRE_HOUSE(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1),
	POLICE_STATION(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1),
	SCHOOL(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1),
	GARBAGE_DUMP(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1),
	SEWAGE_FARM(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1),
	FACTORY(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1),
	OFFICE_BUILDING(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1),
	POWER_STATION(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1),
	RESTAURANT(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1),
	PARK(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1),
	CHURCH(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1),

	ROAD_STRAIGHT(TileEdgeType.ROAD, TileEdgeType.GREEN, TileEdgeType.ROAD, TileEdgeType.GREEN,"ROAD_STRAIGHT",15),
	ROAD_ACCESS_SINGLE(TileEdgeType.ROAD, TileEdgeType.ACCESS, TileEdgeType.ROAD, TileEdgeType.GREEN,"ROAD_ACCESS_SINGLE",15),
	ROAD_ACCESS_DOUBLE(TileEdgeType.ROAD, TileEdgeType.ACCESS, TileEdgeType.ROAD, TileEdgeType.ACCESS,"ROAD_ACCESS_DOUBLE",30),
	ROAD_CROSS_SINGLE(TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.ACCESS,"ROAD_CROSS_SINGLE",10),
	ROAD_CROSS_DOUBLE(TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.ROAD,"ROAD_CROSS_DOUBLE",5),
	ROAD_CURVE(TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.GREEN, TileEdgeType.GREEN,"ROAD_CURVE",15);

	TileEdgeType left;
	TileEdgeType top;
	TileEdgeType right;
	TileEdgeType down;

	String generalType;
	Long probability;

	private static final List<TileType> VALUES = Collections.unmodifiableList(Arrays.asList(values()));
	private static final int SIZE = VALUES.size();
	private static final Random RANDOM = new Random();

	private TileType(TileEdgeType left, TileEdgeType top, TileEdgeType right, TileEdgeType down, String generalType, int probability) {
		this.left = left;
		this.top = top;
		this.right = right;
		this.down = down;
		this.generalType = generalType;
		this.probability = Long.valueOf(probability);
	}

	public static TileType randomTileType() {
		TileType random = null;
		
			random = VALUES.get(RANDOM.nextInt(SIZE));
		
		return random;
	}

	public List<TileEdgeType> getTileEdgeTypes(){
		List<TileEdgeType> list = new ArrayList<>();
		list.add(this.left);
		list.add(this.top);
		list.add(this.right);
		list.add(this.down);
		return list;
	}

	public static TileType randomEndTileType(){
		double random = Math.random();
		if(random < 0.6)return HOUSE;
		else if(random < 0.8)return SHOP;
		else {
			TileType randTileType = null;
			do{
				randTileType = randomTileType();
			} while(randTileType.getGeneralType() != "END_TILE" || randTileType ==HOUSE || randTileType == SHOP);
			return randTileType;
		}
	}

	public String getGeneralType() {
		return generalType;
	}

	public Long getProbability(){
		return probability;
	}
}
