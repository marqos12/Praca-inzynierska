package pl.mojrzeszow.server.models.messages;

public class DataExchange {

	private Long id;
	private Long userId;
	private Long gameId;
	private String sessionId;

    public DataExchange() {}
    
	public DataExchange(Long id,Long userId,Long gameId,String sessionId) {
		super();
		this.id = id;
		this.userId = userId;
		this.gameId = gameId;
		this.sessionId = sessionId;
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

	

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String id) {
		this.sessionId = id;
	}
    
}
