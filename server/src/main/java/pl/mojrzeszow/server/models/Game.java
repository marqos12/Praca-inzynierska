package pl.mojrzeszow.server.models;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import pl.mojrzeszow.server.enums.GameEndType;

@Entity
@Table(name = "games")

public class Game {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull
	@ManyToOne
	private User author;

	@NotNull
	private boolean ended;

	@NotNull
	private boolean started;

	@NotNull
	private boolean isRTS;

	@NotNull
	private Long gameLimit;

	@NotNull
	private Long elapsed;

	private GameEndType endType;

	private Long startTime;

	private Boolean inProgress;

	private Long gamersCount;
	private Long gamersCountLimit;

	private boolean privateGame;

	private LocalDateTime RTSLastRoundTime;
	private Long rtsInterval;
	private LocalDateTime lastActivity;

	public Game() {
	}

	public Game(User user) {
		this.author = user;
		this.elapsed = 0L;
		this.started = false;
		this.ended = false;
		this.gameLimit = 100L;
		this.isRTS = false;
		this.privateGame = true;
		this.gamersCountLimit = 4L;
		this.gamersCount = 0L;
		this.inProgress = false;
		this.endType = GameEndType.ROUND_LIMIT;
		this.rtsInterval = 20L;
	}

	public Game(Long id, @NotNull User author, @NotNull boolean ended, @NotNull boolean started, @NotNull boolean isRTS,
			@NotNull Long gameLimit, @NotNull Long elapsed, Boolean inProgress, Long gamersCount, Long gamersCountLimit,
			boolean privateGame, GameEndType gameEndType, Long startTime, Long rtsInterval,
			LocalDateTime lastActivity) {
		this.id = id;
		this.author = author;
		this.ended = ended;
		this.started = started;
		this.isRTS = isRTS;
		this.gameLimit = gameLimit;
		this.elapsed = elapsed;
		this.inProgress = inProgress;
		this.gamersCount = gamersCount;
		this.gamersCountLimit = gamersCountLimit;
		this.privateGame = privateGame;
		this.endType = gameEndType;
		this.startTime = startTime;
		this.rtsInterval = rtsInterval;
		this.lastActivity = lastActivity;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public User getAuthor() {
		return author;
	}

	public void setAuthor(User author) {
		this.author = author;
	}

	public boolean isEnded() {
		return ended;
	}

	public void setEnded(boolean ended) {
		this.ended = ended;
	}

	public boolean isStarted() {
		return started;
	}

	public void setStarted(boolean started) {
		this.started = started;
	}

	public boolean isRTS() {
		return isRTS;
	}

	public void setRTS(boolean isRTS) {
		this.isRTS = isRTS;
	}

	public Long getGameLimit() {
		return gameLimit;
	}

	public void setGameLimit(Long gameLimit) {
		this.gameLimit = gameLimit;
	}

	public Long getElapsed() {
		return elapsed;
	}

	public void setElapsed(Long elapsed) {
		this.elapsed = elapsed;
	}

	public void setPrivateGame(boolean privateGame) {
		this.privateGame = privateGame;
	}

	public boolean getPrivateGame() {
		return this.privateGame;
	}

	public Long getGamersCount() {
		return gamersCount;
	}

	public void setGamersCount(Long id) {
		this.gamersCount = id;
	}

	public Long getGamersCountLimit() {
		return gamersCountLimit;
	}

	public void setGamersCountLimit(Long id) {
		this.gamersCountLimit = id;
	}

	public Boolean getInProgress() {
		return inProgress;
	}

	public void setInProgress(Boolean inProgress) {
		this.inProgress = inProgress;
	}

	public GameEndType getEndType() {
		return endType;
	}

	public void setEndType(GameEndType endType) {
		this.endType = endType;
	}

	public Long getStartTime() {
		return startTime;
	}

	public void setStartTime(Long startTime) {
		this.startTime = startTime;
	}

	public LocalDateTime getRTSLastRoundTime() {
		return RTSLastRoundTime;
	}

	public void setRTSLastRoundTime(LocalDateTime rTSLastRoundTime) {
		RTSLastRoundTime = rTSLastRoundTime;
	}

	public Long getRtsInterval() {
		return rtsInterval;
	}

	public void setRtsInterval(Long rtsInterval) {
		this.rtsInterval = rtsInterval;
	}

	public LocalDateTime getLastActivity() {
		return lastActivity;
	}

	public void setLastActivity(LocalDateTime lastActivity) {
		this.lastActivity = lastActivity;
	}
}
