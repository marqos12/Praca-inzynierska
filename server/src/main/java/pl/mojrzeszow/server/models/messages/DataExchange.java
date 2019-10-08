package pl.mojrzeszow.server.models.messages;

import javax.validation.constraints.NotBlank;

import pl.mojrzeszow.server.enums.TileType;

public class DataExchange {

	private Long id;
	private Long userId;
	private Long gameId;
	private String sessionId;
	private Long gamerId;
	private Long posX;
	private Long posY;
	private int angle;
	private TileType type;

	public DataExchange() {
	}

	public TileType getType() {
		return type;
	}

	public void setType(TileType type) {
		this.type = type;
	}

	public @NotBlank int getAngle() {
		return angle;
	}

	public void setAngle(int angle) {
		this.angle = angle;
	}

	public Long getPosY() {
		return posY;
	}

	public void setPosY(Long posY) {
		this.posY = posY;
	}

	public Long getPosX() {
		return posX;
	}

	public void setPosX(Long posX) {
		this.posX = posX;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long id) {
		this.userId = id;
	}

	public Long getGameId() {
		return gameId;
	}

	public void setGameId(Long id) {
		this.gameId = id;
	}

	public Long getGamerId() {
		return gamerId;
	}

	public void setGamerId(Long id) {
		this.gamerId = id;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String id) {
		this.sessionId = id;
	}

	public DataExchange(Long id, Long userId, Long gameId, String sessionId, Long gamerId, Long posX, Long posY,
			int angle, TileType type) {
		this.id = id;
		this.userId = userId;
		this.gameId = gameId;
		this.sessionId = sessionId;
		this.gamerId = gamerId;
		this.posX = posX;
		this.posY = posY;
		this.angle = angle;
		this.type = type;
	}
    
}
