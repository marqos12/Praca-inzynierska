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

	
	private Boolean privateGame;

	
	public Game() {	}

	public Game(User user) {	
		this.author = user;
		this.elapsed = 0L;
		this.started = false;
		this.ended = false;
		this.gameLimit = 45L;
		this.isRTS = false;
		this.privateGame = true;
	}

	public Game(Long id, @NotBlank User author, @NotBlank boolean ended, @NotBlank boolean started,
			@NotBlank boolean isRTS, @NotBlank Long gameLimit, @NotBlank Long elapsed,  Boolean privateGame) {
		super();
		this.id = id;
		this.author = author;
		this.ended = ended;
		this.started = started;
		this.isRTS = isRTS;
		this.gameLimit = gameLimit;
		this.elapsed = elapsed;
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





	public Long getPrivateGame() {
		return elapsed;
	}



	public void setPrivateGame(Boolean privateGame) {
		this.privateGame = privateGame;
	}


}
