package pl.mojrzeszow.server.models;

import java.util.Date;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "gamers")

public class Gamer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@ManyToOne
	private User user;
	
	@NotBlank
	@ManyToOne
	private Game game;


	private String sessionId;
	
	@NotBlank
	private Date notification;
	
	@NotBlank
	private boolean status;
	
	@NotBlank
	private boolean ready;
	
	@NotBlank
	private Long ordinalNumber;
	
	@NotBlank
	private Long points;
	
	@NotBlank
	private Long ducklings;

	
	public Gamer () {}
	
	
	public Gamer(Long id, @NotBlank User user, @NotBlank Game game, String sessionId, @NotBlank Date notification,
			@NotBlank boolean status, @NotBlank boolean ready, @NotBlank Long ordinalNumber, @NotBlank Long points,
			@NotBlank Long ducklings) {
		super();
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
	
	
}
