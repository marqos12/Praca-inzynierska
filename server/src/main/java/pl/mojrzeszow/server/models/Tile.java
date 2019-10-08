package pl.mojrzeszow.server.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import pl.mojrzeszow.server.enums.TileEdgeType;
import pl.mojrzeszow.server.enums.TileType;

@Entity
@Table(name = "tiles")

public class Tile {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	private Gamer gamer;

	@ManyToOne
	private Game game;

	private TileType type;

	private int model;

	private int angle;

	private int lvl;

	private Long posX;

	private Long posY;

	public Tile() {
	}

	public Tile(Long id, @NotBlank Gamer gamer, @NotBlank Game game, @NotBlank TileType type, @NotBlank int model,
			@NotBlank int angle, @NotBlank int lvl, @NotBlank Long posX, @NotBlank Long posY) {
		super();
		this.id = id;
		this.gamer = gamer;
		this.game = game;
		this.type = type;
		this.model = model;
		this.angle = angle;
		this.lvl = lvl;
		this.posX = posX;
		this.posY = posY;
	}

	public List<TileEdgeType> getSortedEdgeTypes(){
		int angle = this.angle / 90;
		int j = (angle + 4) % 4;
		List<TileEdgeType> tileEdgeTypes = this.type.getTileEdgeTypes();
		List<TileEdgeType>  sortedEdges = new ArrayList<>();
	
		for (int i = 0; i < 4; i++) {
			sortedEdges.add(tileEdgeTypes.get(j));
			if (++j > 3) j = 0;
		}
		return sortedEdges;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Gamer getGamer() {
		return gamer;
	}

	public void setGamer(Gamer gamer) {
		this.gamer = gamer;
	}

	public int getModel() {
		return model;
	}

	public void setModel(int model) {
		this.model = model;
	}

	public int getAngle() {
		return angle;
	}

	public void setAngle(int angle) {
		this.angle = angle;
	}

	public int getLvl() {
		return lvl;
	}

	public void setLvl(int lvl) {
		this.lvl = lvl;
	}

	public Long getPosX() {
		return posX;
	}

	public void setPosX(Long posX) {
		this.posX = posX;
	}

	public Long getPosY() {
		return posY;
	}

	public void setPosY(Long posY) {
		this.posY = posY;
	}

	public Game getGame() {
		return game;
	}

	public void setGame(Game game) {
		this.game = game;
	}

	public TileType getType() {
		return type;
	}

	public void setType(TileType type) {
		this.type = type;
	}

}
