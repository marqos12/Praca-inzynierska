package pl.mojrzeszow.server.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import pl.mojrzeszow.server.enums.TileEdgeType;
import pl.mojrzeszow.server.enums.TileType;

@Entity
@Table(name = "tiles")

public class Tile {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	private Gamer gamer;

	@ManyToOne
	private Game game;

	private TileType type;

	private String generalType;

	private int model;

	private int angle;

	private int lvl;

	private Long posX;

	private Long posY;

	@OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private Influence influence;

	@OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private Influence usedInfluence;

	String influenceTakenFrom;
	String influenceGiveTo;
	Long additionalMoney;
	Long taxes;

	public Tile() {
		this.influence = new Influence();
		this.usedInfluence = new Influence();
	}

	public Tile(Long id, @NotBlank Gamer gamer, @NotBlank Game game, @NotBlank TileType type, @NotBlank int model,
			@NotBlank int angle, @NotBlank int lvl, @NotBlank Long posX, @NotBlank Long posY, Influence influence,
			Influence usedInfluence, String influenceTakenFrom, String influenceGiveTo, Long additionalMoney,Long taxes) {
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
		this.influence = influence;
		this.generalType = type.getGeneralType();
		this.usedInfluence = usedInfluence;
		this.influenceTakenFrom = influenceTakenFrom;
		this.influenceGiveTo = influenceGiveTo;
		this.additionalMoney = additionalMoney;
		this.taxes=taxes;
	}

	public List<TileEdgeType> getSortedEdgeTypes() {

		int angle = this.angle / 90;
		int j = (angle + 6);
		List<TileEdgeType> tileEdgeTypes = this.type.getTileEdgeTypes();
		List<TileEdgeType> sortedEdges = new ArrayList<>();

		for (int i = 0; i < 4; i++)
			sortedEdges.add(tileEdgeTypes.get(j-- % 4));

		return sortedEdges;
	}

	public Influence getTileGeneratedInfluence() {

		Influence influence = new Influence();

		switch (this.type) {
		case HOUSE:
			if (lvl == 1) {
				influence.ducklings = 100L;
				influence.points = 10L;
				influence.people = 4L;
				influence.peopleRange = 5L;
			} else if (lvl == 2) {
				influence.ducklings = 400L;
				influence.points = 40L;
				influence.people = 20L;
				influence.peopleRange = 7L;
			} else {
				influence.ducklings = 2000L;
				influence.points = 100L;
				influence.people = 100L;
				influence.peopleRange = 9L;
			}
			break;
		case SHOP:
			if (lvl == 1) {
				influence.ducklings = 400L;
				influence.points = 20L;
				influence.shops = 5L;
				influence.shopsRange = 3L;
			} else if (lvl == 2) {
				influence.ducklings = 800L;
				influence.points = 50L;
				influence.shops = 20L;
				influence.shopsRange = 5L;
			} else {
				influence.ducklings = 5000L;
				influence.points = 100L;
				influence.shops = 100L;
				influence.shopsRange = 6L;
			}
			break;
		case HOSPITAL:
			influence.ducklings = -200L;
			influence.points = 30L;
			influence.medicalCare = 10L;
			influence.medicalCareRange = 10L;
			break;
		case FIRE_HOUSE:
			influence.ducklings = -200L;
			influence.points = 30L;
			influence.fireSafety = 5L;
			influence.fireSafetyRange = 15L;
			break;

		case POLICE_STATION:
			influence.ducklings = -200L;
			influence.points = 30L;
			influence.crimePrevention = 5L;
			influence.crimePreventionRange = 10L;
			break;

		case SCHOOL:
			if (lvl == 1) {
				influence.ducklings = -200L;
				influence.points = 30L;
				influence.science = 5L;
				influence.scienceRange = 10L;
			} else {
				influence.ducklings = -10000L;
				influence.points = 300L;
				influence.science = 100L;
				influence.scienceRange = 100L;
			}
			break;

		case GARBAGE_DUMP:
			influence.ducklings = -100L;
			influence.points = 30L;
			influence.cleanness = 10L;
			influence.cleannessRange = 10L;
			break;

		case SEWAGE_FARM:
			influence.ducklings = -200L;
			influence.points = 30L;
			influence.cleanness = 10L;
			influence.cleannessRange = 15L;
			break;

		case FACTORY:
			influence.ducklings = 1000L;
			influence.points = 30L;
			influence.work = 20L;
			influence.workRange = 15L;
			influence.goods = 10L;
			influence.goodsRange = 15L;
			break;

		case OFFICE_BUILDING:
			influence.ducklings = 1000L;
			influence.points = 30L;
			influence.work = 20L;
			influence.workRange = 15L;
			influence.services = 10L;
			influence.servicesRange = 15L;
			break;

		case POWER_STATION:
			influence.ducklings = -400L;
			influence.points = 30L;
			influence.energy = 10L;
			influence.energyRange = 20L;
			break;

		case RESTAURANT:
			influence.ducklings = 300L;
			influence.points = 30L;
			influence.entertainment = 5L;
			influence.entertainmentRange = 5L;
			influence.services = 2L;
			influence.servicesRange = 5L;
			break;

		case PARK:
			influence.ducklings = -300L;
			influence.points = 30L;
			influence.entertainment = 5L;
			influence.entertainmentRange = 10L;
			break;

		case CHURCH:
			influence.ducklings = -200L;
			influence.points = 30L;
			influence.entertainment = 5L;
			influence.entertainmentRange = 5L;
			break;

		case ROAD_ACCESS_DOUBLE:
			influence = null;
			break;

		case ROAD_ACCESS_SINGLE:
			influence = null;
			break;

		case ROAD_CROSS_DOUBLE:
			influence = null;
			break;

		case ROAD_CROSS_SINGLE:
			influence = null;
			break;

		case ROAD_CURVE:
			influence = null;
			break;

		case ROAD_STRAIGHT:
			influence = null;
			break;
		case OPTIONAL:
			influence = null;
			break;

		}

		return influence;
	}

	public Influence getTileInfluenceNeedToUpgrade() {

		Influence influence = new Influence();

		switch (this.type) {
		case HOUSE:
			if (lvl == 1) {
				influence.ducklings = 5000L;
				influence.shops = 1L;
				influence.entertainment = 2L;
				influence.work = 2L;
				influence.cleanness = 1L;
			} else if (lvl == 2) {
				influence.ducklings = 15000L;
				influence.shops = 5L;
				influence.entertainment = 3L;
				influence.medicalCare = 1L;
				influence.services = 10L;
			} else {
				influence = null;
			}
			break;
		case SHOP:
			if (lvl == 1) {
				influence.ducklings = 5000L;
				influence.people = 10L;
				influence.goods = 1L;
				influence.crimePrevention = 1L;
			} else if (lvl == 2) {
				influence.ducklings = 40000L;
				influence.people = 150L;
				influence.fireSafety = 1L;
				influence.goods = 15L;
			} else {
				influence = null;
			}
			break;
		case HOSPITAL:
			influence = null;
			break;
		case FIRE_HOUSE:
			influence = null;
			break;

		case POLICE_STATION:
			influence = null;
			break;

		case SCHOOL:
			if (lvl == 1) {
				influence.ducklings = 20000L;
				influence.people = 200L;
			} else {
				influence = null;
			}
			break;

		case GARBAGE_DUMP:
			influence = null;
			break;

		case SEWAGE_FARM:
			influence = null;
			break;

		case FACTORY:
			influence = null;
			break;

		case OFFICE_BUILDING:
			influence = null;
			break;

		case POWER_STATION:
			influence = null;
			break;

		case RESTAURANT:
			influence = null;
			break;

		case PARK:
			influence = null;
			break;

		case CHURCH:
			influence = null;
			break;

		case ROAD_ACCESS_DOUBLE:
			influence = null;
			break;

		case ROAD_ACCESS_SINGLE:
			influence = null;
			break;

		case ROAD_CROSS_DOUBLE:
			influence = null;
			break;

		case ROAD_CROSS_SINGLE:
			influence = null;
			break;

		case ROAD_CURVE:
			influence = null;
			break;

		case ROAD_STRAIGHT:
			influence = null;
			break;
		case OPTIONAL:
			influence = null;
			break;
		}

		return influence;
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

	public Influence getInfluence() {
		return influence;
	}

	public void setInfluence(Influence influence) {
		this.influence = influence;
	}

	public String getGeneralType() {
		return generalType;
	}

	public void setGeneralType(String generalType) {
		this.generalType = generalType;
	}

	public Influence getUsedInfluence() {
		return usedInfluence;
	}

	public void setUsedInfluence(Influence usedInfluence) {
		this.usedInfluence = usedInfluence;
	}

	public String getInfluenceTakenFrom() {
		return influenceTakenFrom;
	}

	public void setInfluenceTakenFrom(String influenceTakenFrom) {
		this.influenceTakenFrom = influenceTakenFrom;
	}

	public String getInfluenceGiveTo() {
		return influenceGiveTo;
	}

	public void setInfluenceGiveTo(String influenceGiveTo) {
		this.influenceGiveTo = influenceGiveTo;
	}

	public Long getAdditionalMoney() {
		return additionalMoney;
	}

	public void setAdditionalMoney(Long additionalMoney) {
		this.additionalMoney = additionalMoney;
	}

	public Long getTaxes() {
		return taxes;
	}

	public void setTaxes(Long taxes) {
		this.taxes = taxes;
	}

}
