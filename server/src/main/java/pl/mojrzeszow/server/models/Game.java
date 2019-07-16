package pl.mojrzeszow.server.models;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.hibernate.annotations.NaturalId;

@Entity
@Table(name = "games")

public class Game {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@ManyToOne
	private User author;
	
	@NotBlank
	private boolean ended;
	
	@NotBlank
	private boolean started;
	
	@NotBlank
	private boolean isRTS;
	
	@NotBlank
	private Long gameLimit;
	
	@NotBlank
	private long elapsed;


	
	public Game() {}



	public Game(Long id, @NotBlank User author, @NotBlank boolean ended, @NotBlank boolean started,
			@NotBlank boolean isRTS, @NotBlank Long gameLimit, @NotBlank long elapsed) {
		super();
		this.id = id;
		this.author = author;
		this.ended = ended;
		this.started = started;
		this.isRTS = isRTS;
		this.gameLimit = gameLimit;
		this.elapsed = elapsed;
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



	public long getElapsed() {
		return elapsed;
	}



	public void setElapsed(long elapsed) {
		this.elapsed = elapsed;
	}






}
