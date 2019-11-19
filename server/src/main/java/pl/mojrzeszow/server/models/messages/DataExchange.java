package pl.mojrzeszow.server.models.messages;

import javax.validation.constraints.NotBlank;

import pl.mojrzeszow.server.enums.TileType;
import pl.mojrzeszow.server.models.Gamer;
import pl.mojrzeszow.server.models.Influence;

public class DataExchange {

	public Long id;
	public Long userId;
	public Long gameId;
	public String sessionId;
	public Long gamerId;
	public Long posX;
	public Long posY;
	public Long angle;
	public TileType type;
	public Gamer gamer;
	public long lvl;
	public Influence incomeInfluence;
	public Influence outcomeInfluence;
	public Influence needToUppgrade;
	public Long points;
	public Long buildCosts;
	public Long deconstructionCosts;
	public Influence usedInfluence;
	public Long summaryDucklings;

	public DataExchange() {
	}

	public TileType getType() {
		return type;
	}

	public void setType(TileType type) {
		this.type = type;
	}

	public @NotBlank Long getAngle() {
		return angle;
	}

	public void setAngle(Long angle) {
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
	Long angle, TileType type) {
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
