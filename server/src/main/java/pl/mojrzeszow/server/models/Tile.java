package pl.mojrzeszow.server.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import pl.mojrzeszow.server.enums.TileType;

@Entity
@Table(name = "tiles")

public class Tile {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@ManyToOne
	private Gamer gamer;
	
	@NotBlank
	@ManyToOne
	private Game game;

	@NotBlank
	private TileType type;
	

	@NotBlank
	private int model;
	

	@NotBlank
	private int angle;
	

	@NotBlank
	private int lvl;
	

	@NotBlank
	private Long posX;
	

	@NotBlank
	private Long posY;
	
	public Tile() {}



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
