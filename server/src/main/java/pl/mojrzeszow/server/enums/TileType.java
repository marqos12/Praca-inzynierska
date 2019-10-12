package pl.mojrzeszow.server.enums;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public enum TileType {
	HOUSE(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE"),
	SHOP(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE"),
	HOSPPITAL(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE"),
	FIRE_HOUSE(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE"),
	POLICE_STATION(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE"),
	SCHOOL(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE"),
	GARBAGE_DUMP(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE"),
	SEWAGE_FARM(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE"),
	FACTORY(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE"),
	OFFICE_BUILDING(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE"),
	POWER_STATION(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE"),
	RESTAURANT(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE"),
	PARK(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE"),
	CHURCH(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS,"END_TILE"),

	ROAD_STRAIGHT(TileEdgeType.ROAD, TileEdgeType.GREEN, TileEdgeType.ROAD, TileEdgeType.GREEN,"ROAD_STRAIGHT"),
	ROAD_ACCESS_SINGLE(TileEdgeType.ROAD, TileEdgeType.ACCESS, TileEdgeType.ROAD, TileEdgeType.GREEN,"ROAD_ACCESS_SINGLE"),
	ROAD_ACCESS_DOUBLE(TileEdgeType.ROAD, TileEdgeType.ACCESS, TileEdgeType.ROAD, TileEdgeType.ACCESS,"ROAD_ACCESS_DOUBLE"),
	ROAD_CROSS_SINGLE(TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.ACCESS,"ROAD_CROSS_SINGLE"),
	ROAD_CROSS_DOUBLE(TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.ROAD,"ROAD_CROSS_DOUBLE"),
	ROAD_CURVE(TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.GREEN, TileEdgeType.GREEN,"ROAD_CURVE"),

	GREEN_1(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN,"GREEN"),
	GREEN_2(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN,"GREEN");

	TileEdgeType left;
	TileEdgeType top;
	TileEdgeType right;
	TileEdgeType down;

	String generalType;

	private static final List<TileType> VALUES = Collections.unmodifiableList(Arrays.asList(values()));
	private static final int SIZE = VALUES.size();
	private static final Random RANDOM = new Random();

	private TileType(TileEdgeType left, TileEdgeType top, TileEdgeType right, TileEdgeType down, String generalType) {
		this.left = left;
		this.top = top;
		this.right = right;
		this.down = down;
		this.generalType = generalType;
	}

	public static TileType randomTileType() {
		TileType random = null;
		do {
			random = VALUES.get(RANDOM.nextInt(SIZE));
		} while (random == GREEN_1 || random == GREEN_2);
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


	public String getGeneralType() {
		return generalType;
	}
}
