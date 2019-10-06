package pl.mojrzeszow.server.enums;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public enum TileType {
	HOUSE(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS),
	SHOPPING_CENTER(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS),
	GROCERY_STORE(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS),
	CHURCH(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.ACCESS),
	ROAD_STRAIGHT(TileEdgeType.ROAD, TileEdgeType.GREEN, TileEdgeType.ROAD, TileEdgeType.GREEN),
	ROAD_ACCESS_SINGLE(TileEdgeType.ROAD, TileEdgeType.ACCESS, TileEdgeType.ROAD, TileEdgeType.GREEN),
	ROAD_ACCESS_DOUBLE(TileEdgeType.ROAD, TileEdgeType.ACCESS, TileEdgeType.ROAD, TileEdgeType.ACCESS),
	ROAD_CROSS_SINGLE(TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.ACCESS),
	ROAD_CROSS_DOUBLE(TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.ROAD),
	ROAD_CURVE(TileEdgeType.ROAD, TileEdgeType.ROAD, TileEdgeType.GREEN, TileEdgeType.GREEN),
	GREEN_1(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN),
	GREEN_2(TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN, TileEdgeType.GREEN);

	TileEdgeType left;
	TileEdgeType top;
	TileEdgeType right;
	TileEdgeType down;

	private static final List<TileType> VALUES = Collections.unmodifiableList(Arrays.asList(values()));
	private static final int SIZE = VALUES.size();
	private static final Random RANDOM = new Random();

	private TileType(TileEdgeType left, TileEdgeType top, TileEdgeType right, TileEdgeType down) {
		this.left = left;
		this.top = top;
		this.right = right;
		this.down = down;
	}

	// najpierw podawany jest kąt właściwej a pózniej drugiej płytki
	public boolean compare(TileType tile, int angle1, int angle2) {
		int diff = angle2 - angle1;
		switch (diff) {
		case 0:
			return this.left.equals(tile.left) && this.top.equals(tile.top) && this.right.equals(tile.right)
					&& this.down.equals(tile.down);

		case 1:
			return this.left.equals(tile.down) && this.top.equals(tile.left) && this.right.equals(tile.top)
					&& this.down.equals(tile.right);

		case 2:
			return this.left.equals(tile.right) && this.top.equals(tile.down) && this.right.equals(tile.left)
					&& this.down.equals(tile.top);

		case 3:
			return this.left.equals(tile.top) && this.top.equals(tile.right) && this.right.equals(tile.down)
					&& this.down.equals(tile.left);
		}
		return false;
	}

	public static TileType randomTileType() {
		TileType random = null;
		do {
			random = VALUES.get(RANDOM.nextInt(SIZE));
		} while (random == GREEN_1 || random == GREEN_2);
		return random;
	}

}
