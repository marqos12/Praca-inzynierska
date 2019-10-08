package pl.mojrzeszow.server.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

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

	private Boolean inProgress;

	private Long gamersCount;
	private Long gamersCountLimit;

	private boolean privateGame;

	public Game() {
	}

	public Game(User user) {
		this.author = user;
		this.elapsed = 0L;
		this.started = false;
		this.ended = false;
		this.gameLimit = 45L;
		this.isRTS = false;
		this.privateGame = true;
		this.gamersCountLimit = 4L;
		this.gamersCount = 0L;
		this.inProgress = false;
	}

	public Game(Long id, @NotNull User author, @NotNull boolean ended, @NotNull boolean started, @NotNull boolean isRTS,
			@NotNull Long gameLimit, @NotNull Long elapsed, Boolean inProgress, Long gamersCount, Long gamersCountLimit,
			boolean privateGame) {
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
}
