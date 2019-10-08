package pl.mojrzeszow.server.models;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import pl.mojrzeszow.server.enums.TileType;

@Entity
@Table(name = "gamers")

public class Gamer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull
	@ManyToOne
	private User user;
	
	@NotNull
	@ManyToOne
	private Game game;

	private String sessionId;
	
	@NotNull
	private Date notification;
	
	@NotNull
	private boolean status;
		
	private boolean ready;
	
	@NotNull
	private Long ordinalNumber;
	
	@NotNull
	private Long points;
	
	@NotNull
	private Long ducklings;

	private Boolean withTile;

	private TileType newTileType;

	
	public Gamer () {}
	
	
	public Gamer( @NotBlank User user, @NotBlank Game game, String sessionId) {
		super();
		
		this.user = user;
		this.game = game;
		this.sessionId = sessionId;
		this.notification = new Date();
		this.status = true;
		this.ready = false;
		this.ordinalNumber = 0L;
		this.points = 0L;
		this.ducklings = 0L;
		this.withTile = false;
	}



	public Gamer(Long id, @NotNull User user, @NotNull Game game, String sessionId, @NotNull Date notification,
			@NotNull boolean status, boolean ready, @NotNull Long ordinalNumber, @NotNull Long points,
			@NotNull Long ducklings, Boolean withTile, TileType newTileType) {
		this.id = id;
		this.user = user;
		this.game = game;
		this.sessionId = sessionId;
		this.notification = notification;
		this.status = status;
		this.ready = ready;
		this.ordinalNumber = ordinalNumber;
		this.points = points;
		this.ducklings = ducklings;
		this.withTile = withTile;
		this.newTileType = newTileType;
	}
	

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Game getGame() {
		return game;
	}

	public void setGame(Game game) {
		this.game = game;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public Date getNotification() {
		return notification;
	}

	public void setNotification(Date notification) {
		this.notification = notification;
	}

	public boolean isStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

	public boolean isReady() {
		return ready;
	}

	public void setReady(boolean ready) {
		this.ready = ready;
	}

	public Long getOrdinalNumber() {
		return ordinalNumber;
	}

	public void setOrdinalNumber(Long ordinalNumber) {
		this.ordinalNumber = ordinalNumber;
	}

	public Long getPoints() {
		return points;
	}

	public void setPoints(Long points) {
		this.points = points;
	}

	public Long getDucklings() {
		return ducklings;
	}

	public void setDucklings(Long ducklings) {
		this.ducklings = ducklings;
	}

	public Boolean getWithTile() {
		return withTile;
	}

	public void setWithTile(Boolean withTile) {
		this.withTile = withTile;
	}

	public TileType getNewTileType() {
		return newTileType;
	}

	public void setNewTileType(TileType newTileType) {
		this.newTileType = newTileType;
	}
	
	
}
