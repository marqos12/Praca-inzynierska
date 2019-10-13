package pl.mojrzeszow.server.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import pl.mojrzeszow.server.enums.MessageType;
import pl.mojrzeszow.server.enums.TileEdgeType;
import pl.mojrzeszow.server.enums.TileType;
import pl.mojrzeszow.server.models.Game;
import pl.mojrzeszow.server.models.Gamer;
import pl.mojrzeszow.server.models.Influence;
import pl.mojrzeszow.server.models.Tile;
import pl.mojrzeszow.server.models.messages.DataExchange;
import pl.mojrzeszow.server.models.messages.GameMessage;
import pl.mojrzeszow.server.repositories.GameRepository;
import pl.mojrzeszow.server.repositories.GamerRepository;
import pl.mojrzeszow.server.repositories.TileRepository;
import pl.mojrzeszow.server.repositories.UserRepository;

@Service
public class GameService {
	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;

	@Autowired
	private GameRepository gameRepository;

	@Autowired
	private GamerRepository gamerRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	private TileRepository tileRepository;

	@Autowired
	private TileTypeService tileTypeService;

	public GameMessage<Gamer> getAllgames(Gamer gamer) throws Exception {

		Gamer updatedGamer = this.gamerRepository.findById(gamer.getId()).orElse(null);
		updatedGamer.setReady(true);
		updatedGamer = this.gamerRepository.save(updatedGamer);

		List<Gamer> gamers = this.gamerRepository.findByGame(updatedGamer.getGame());
		simpMessagingTemplate.convertAndSend("/topic/game/game/" + gamer.getId(),
				new GameMessage<List<Gamer>>(MessageType.GAMERS_STATUS_UPDATE, gamers));

		GameMessage<Gamer> gameMessage = new GameMessage<Gamer>(MessageType.ME_GAMER, updatedGamer);
		return gameMessage;
	}

	public GameMessage<List<Tile>> joinGame(Gamer gamer) {

		Gamer updatedGamer = this.gamerRepository.findById(gamer.getId()).orElse(null);
		updatedGamer.setReady(true);
		updatedGamer = this.gamerRepository.save(updatedGamer);

		List<Gamer> gamers = this.gamerRepository.findByGame(updatedGamer.getGame());

		Game game = updatedGamer.getGame();
		if (!game.getInProgress() && gamers.stream().filter(Gamer::isReady).count() == gamers.size()) {
			game.setInProgress(true);
			gameRepository.save(game);
			Collections.shuffle(gamers);
			Long i = new Long(1);
			for (Gamer gameGamer : gamers) {
				gameGamer.setOrdinalNumber(i++);
				gamerRepository.save(gameGamer);
			}
			Gamer firstGamer = gamers.get(0);
			TileType randomTileType = TileType.randomTileType();
			firstGamer.setWithTile(true);
			firstGamer.setNewTileType(randomTileType);
			firstGamer = gamerRepository.save(firstGamer);
			simpMessagingTemplate.convertAndSendToUser(firstGamer.getSessionId(), "/reply",
					new GameMessage<TileType>(MessageType.NEW_TILE, randomTileType));
		} else if (game.getInProgress() && updatedGamer.getWithTile()) {
			simpMessagingTemplate.convertAndSendToUser(updatedGamer.getSessionId(), "/reply",
					new GameMessage<TileType>(MessageType.NEW_TILE, updatedGamer.getNewTileType()));
		}

		List<Tile> tiles = tileRepository.findByGame(updatedGamer.getGame());

		gamers = this.gamerRepository.findByGame(updatedGamer.getGame());
		simpMessagingTemplate.convertAndSend("/topic/lobby/game/" + updatedGamer.getGame().getId(),
				new GameMessage<List<Gamer>>(MessageType.GAMERS_STATUS_UPDATE, gamers));

		GameMessage<List<Tile>> gameMessage = new GameMessage<List<Tile>>(MessageType.GAME_JOINED, tiles);
		return gameMessage;
	}

	public void saveTile(DataExchange data) {
		Gamer gamer = gamerRepository.findById(data.getGamerId()).orElse(null);
		gamer.setWithTile(false);
		gamerRepository.save(gamer);

		List<Tile> gameTiles = tileRepository.findByGame(gamer.getGame());

		Tile tile = new Tile(null, gamer, gamer.getGame(), data.getType(), 1, data.getAngle(), 1, data.getPosX(),
				data.getPosY(), new Influence());

		calculateTilesInfluence(tile, gameTiles);

		tile = tileRepository.save(tile);
		tileRepository.saveAll(gameTiles);
		List<Tile> newTiles = new ArrayList<Tile>();
		newTiles.add(tile);

		simpMessagingTemplate.convertAndSend("/topic/game/game/" + gamer.getGame().getId(),
				new GameMessage<List<Tile>>(MessageType.NEW_TILE, newTiles));

		Gamer nextGamer = gamerRepository.findByGameAndOrdinalNumber(gamer.getGame(), gamer.getOrdinalNumber() + 1L);
		if (nextGamer == null) {
			Game game = gamer.getGame();
			game.setElapsed(game.getElapsed() + 1);
			gameRepository.save(game);
			simpMessagingTemplate.convertAndSend("/topic/lobby/game/" + game.getId(),
					new GameMessage<Game>(MessageType.GAME_UPDATE, game));
			nextGamer = gamerRepository.findByGameAndOrdinalNumber(gamer.getGame(), 1L);
		}

		TileType randomTileType = getRandomTileTypeForGame(nextGamer.getGame());

		nextGamer.setWithTile(true);
		nextGamer.setNewTileType(randomTileType);
		nextGamer = gamerRepository.save(nextGamer);
		simpMessagingTemplate.convertAndSendToUser(nextGamer.getSessionId(), "/reply",
				new GameMessage<TileType>(MessageType.NEW_TILE, randomTileType));

		List<Gamer> gamers = this.gamerRepository.findByGame(nextGamer.getGame());
		simpMessagingTemplate.convertAndSend("/topic/lobby/game/" + nextGamer.getGame().getId(),
				new GameMessage<List<Gamer>>(MessageType.GAMERS_STATUS_UPDATE, gamers));
	}

	private void calculateTilesInfluence(Tile newTile, List<Tile> tiles) {

		tiles.stream().filter(t -> t.getTileGeneratedInfluence() != null).forEach(tile -> {
			Influence tileInfluence = tile.getTileGeneratedInfluence();
			Double d = Math
					.sqrt(Math.pow(tile.getPosX(), newTile.getPosX()) + Math.pow(tile.getPosY(), newTile.getPosY()));
			newTile.getInfluence().setPeople(addInfluence(tileInfluence.getPeople(),newTile.getInfluence().getPeople(),d,tileInfluence.getPeopleRange()));
			newTile.getInfluence().setShops(addInfluence(tileInfluence.getShops(),newTile.getInfluence().getShops(),d,tileInfluence.getShopsRange()));
			newTile.getInfluence().setEntertainment(addInfluence(tileInfluence.getEntertainment(),newTile.getInfluence().getEntertainment(),d,tileInfluence.getEntertainmentRange()));
			newTile.getInfluence().setWork(addInfluence(tileInfluence.getWork(),newTile.getInfluence().getWork(),d,tileInfluence.getWorkRange()));
			newTile.getInfluence().setMedicalCare(addInfluence(tileInfluence.getMedicalCare(),newTile.getInfluence().getMedicalCare(),d,tileInfluence.getMedicalCareRange()));
			newTile.getInfluence().setServices(addInfluence(tileInfluence.getServices(),newTile.getInfluence().getServices(),d,tileInfluence.getServicesRange()));
			newTile.getInfluence().setGoods(addInfluence(tileInfluence.getGoods(),newTile.getInfluence().getGoods(),d,tileInfluence.getGoodsRange()));
			newTile.getInfluence().setFireSafety(addInfluence(tileInfluence.getFireSafety(),newTile.getInfluence().getFireSafety(),d,tileInfluence.getFireSafetyRange()));
			newTile.getInfluence().setCrimePrevention(addInfluence(tileInfluence.getCrimePrevention(),newTile.getInfluence().getCrimePrevention(),d,tileInfluence.getCrimePreventionRange()));
			newTile.getInfluence().setEnergy(addInfluence(tileInfluence.getEnergy(),newTile.getInfluence().getEnergy(),d,tileInfluence.getEnergyRange()));
			newTile.getInfluence().setCleanness(addInfluence(tileInfluence.getCleanness(),newTile.getInfluence().getCleanness(),d,tileInfluence.getCleannessRange()));
			newTile.getInfluence().setScience(addInfluence(tileInfluence.getScience(),newTile.getInfluence().getScience(),d,tileInfluence.getScienceRange()));
		
			
			Influence newTileInfluence = newTile.getTileGeneratedInfluence();
			if(newTileInfluence!=null)
			{
			tile.getInfluence().setPeople(addInfluence(newTileInfluence.getPeople(),tile.getInfluence().getPeople(),d,newTileInfluence.getPeopleRange()));
			tile.getInfluence().setShops(addInfluence(newTileInfluence.getShops(),tile.getInfluence().getShops(),d,newTileInfluence.getShopsRange()));
			tile.getInfluence().setEntertainment(addInfluence(newTileInfluence.getEntertainment(),tile.getInfluence().getEntertainment(),d,newTileInfluence.getEntertainmentRange()));
			tile.getInfluence().setWork(addInfluence(newTileInfluence.getWork(),tile.getInfluence().getWork(),d,newTileInfluence.getWorkRange()));
			tile.getInfluence().setMedicalCare(addInfluence(newTileInfluence.getMedicalCare(),tile.getInfluence().getMedicalCare(),d,newTileInfluence.getMedicalCareRange()));
			tile.getInfluence().setServices(addInfluence(newTileInfluence.getServices(),tile.getInfluence().getServices(),d,newTileInfluence.getServicesRange()));
			tile.getInfluence().setGoods(addInfluence(newTileInfluence.getGoods(),tile.getInfluence().getGoods(),d,newTileInfluence.getGoodsRange()));
			tile.getInfluence().setFireSafety(addInfluence(newTileInfluence.getFireSafety(),tile.getInfluence().getFireSafety(),d,newTileInfluence.getFireSafetyRange()));
			tile.getInfluence().setCrimePrevention(addInfluence(newTileInfluence.getCrimePrevention(),tile.getInfluence().getCrimePrevention(),d,newTileInfluence.getCrimePreventionRange()));
			tile.getInfluence().setEnergy(addInfluence(newTileInfluence.getEnergy(),tile.getInfluence().getEnergy(),d,newTileInfluence.getEnergyRange()));
			tile.getInfluence().setCleanness(addInfluence(newTileInfluence.getCleanness(),tile.getInfluence().getCleanness(),d,newTileInfluence.getCleannessRange()));
			tile.getInfluence().setScience(addInfluence(newTileInfluence.getScience(),tile.getInfluence().getScience(),d,newTileInfluence.getScienceRange()));
		}
		});

	}

	private Long addInfluence(Long tileInfluence, Long newTileInfluence, Double radious, Long tileInfluenceRange) {
		if (tileInfluence != null && radious >= tileInfluenceRange) {
			if (newTileInfluence == null)
				newTileInfluence = 0L;
			return newTileInfluence += tileInfluence;
		}
		return newTileInfluence;
	}

	private TileType getRandomTileTypeForGame(Game game) {

		List<Tile> tiles = tileRepository.findByGame(game);

		List<TileEdgeType> possibleEdgeTypes = new ArrayList<>();

		for (Tile tile : tiles) {
			List<TileEdgeType> sortedEdges = tile.getSortedEdgeTypes();
			if (!tiles.stream().filter(t -> tile.getPosX() - 1 == t.getPosX() && tile.getPosY() == t.getPosY())
					.findFirst().isPresent())
				possibleEdgeTypes.add(sortedEdges.get(0));

			if (!tiles.stream().filter(t -> tile.getPosX() == t.getPosX() && tile.getPosY() - 1 == t.getPosY())
					.findFirst().isPresent())
				possibleEdgeTypes.add(sortedEdges.get(1));

			if (!tiles.stream().filter(t -> tile.getPosX() + 1 == t.getPosX() && tile.getPosY() == t.getPosY())
					.findFirst().isPresent())
				possibleEdgeTypes.add(sortedEdges.get(2));

			if (!tiles.stream().filter(t -> tile.getPosX() == t.getPosX() && tile.getPosY() + 1 == t.getPosY())
					.findFirst().isPresent())
				possibleEdgeTypes.add(sortedEdges.get(3));

		}

		Long countRoad = possibleEdgeTypes.stream().filter(et -> et.equals(TileEdgeType.ROAD)).count();
		Long countAccess = possibleEdgeTypes.stream().filter(et -> et.equals(TileEdgeType.ACCESS)).count();

		System.out.println("W grze jest " + countAccess + " wolnych dojazdów oraz " + countRoad + " wolnych drog");

		TileType randomTileType = null;

		if (countAccess <= 2) {
			randomTileType = tileTypeService.getRandomRoadAccessTileType();
		} /*
			 * else if(countRoad>=8){ if(Math.random()>=0.5){ randomTileType
			 * =tileTypeService.getRandomRoadAccessTileType(); } else { randomTileType
			 * =tileTypeService.getRandomEndTileType(); } }
			 */
		else {
			if (Math.random() >= 0.5) {
				randomTileType = tileTypeService.getRandomEndTileType();
			} else {
				randomTileType = tileTypeService.getRandomRoadTileType();
			}
		}

		return randomTileType;
	}
}