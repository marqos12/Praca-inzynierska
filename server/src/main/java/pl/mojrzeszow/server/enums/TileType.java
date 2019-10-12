package pl.mojrzeszow.server.enums;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public enum TileType {
	HOUSE(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",60,10),
	SHOP(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",20,20),
	HOSPITAL(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1,100),
	FIRE_HOUSE(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1,100),
	POLICE_STATION(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1,100),
	SCHOOL(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1,100),
	GARBAGE_DUMP(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1,100),
	SEWAGE_FARM(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1,100),
	FACTORY(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1,100),
	OFFICE_BUILDING(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1,100),
	POWER_STATION(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1,100),
	RESTAURANT(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1,100),
	PARK(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1,100),
	CHURCH(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE",1,100),

	ROAD_STRAIGHT(TileEdgeType.ROAD, TileEdgeType.GREEN, TileEdgeType.ROAD, TileEdgeType.GREEN,"ROAD_STRAIGHT",15,5),
	ROAD_ACCESS_SINGLE(TileEdgeType.ROAD, TileEdgeType.ACCESS, TileEdgeType.ROAD, TileEdgeType.GREEN,"ROAD_ACCESS_SINGLE",15,5),
	ROAD_ACCESS_DOUBLE(TileEdgeType.ROAD, TileEdgeType.ACCESS, TileEdgeType.ROAD, TileEdgeType.ACCESS,"ROAD_ACCESS_DOUBLE",30,5),
	ROAD_CROSS_SINGLE(TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.ACCESS,"ROAD_CROSS_SINGLE",10,5),
	ROAD_CROSS_DOUBLE(TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.ROAD,"ROAD_CROSS_DOUBLE",5,5),
	ROAD_CURVE(TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.GREEN, TileEdgeType.GREEN,"ROAD_CURVE",15,5);

	TileEdgeType left;
	TileEdgeType top;
	TileEdgeType right;
	TileEdgeType down;

	String generalType;
	Long probability;
	Long points;

	private static final List<TileType> VALUES = Collections.unmodifiableList(Arrays.asList(values()));
	private static final int SIZE = VALUES.size();
	private static final Random RANDOM = new Random();

	private TileType(TileEdgeType left, TileEdgeType top, TileEdgeType right, TileEdgeType down, String generalType, int probability,int points) {
		this.left = left;
		this.top = top;
		this.right = right;
		this.down = down;
		this.generalType = generalType;
		this.probability = Long.valueOf(probability);
		this.points = Long.valueOf(points);
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

	public Long getPoints(){
		return points;
	}
}
