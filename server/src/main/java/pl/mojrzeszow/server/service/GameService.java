package pl.mojrzeszow.server.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import pl.mojrzeszow.server.enums.MessageType;
import pl.mojrzeszow.server.enums.TileType;
import pl.mojrzeszow.server.models.Game;
import pl.mojrzeszow.server.models.Gamer;
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
		simpMessagingTemplate.convertAndSend("/topic/game/game/" + updatedGamer.getGame().getId(),
				new GameMessage<List<Gamer>>(MessageType.GAMERS_STATUS_UPDATE, gamers));

		Game game = updatedGamer.getGame();
		System.out.println("Gracz " + updatedGamer.getSessionId() + " dołącza do gry " + game.getId());
		System.out.println("test game in progress " + game.getInProgress());
		System.out.println("test gamer with tile " + updatedGamer.getWithTile());
		if (!game.getInProgress() && gamers.stream().filter(Gamer::isReady).count() == gamers.size()) {
			game.setInProgress(true);
			gameRepository.save(game);
			System.out.println("Wszyscy gracze dołączyli");
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

		GameMessage<List<Tile>> gameMessage = new GameMessage<List<Tile>>(MessageType.GAME_JOINED, tiles);
		return gameMessage;
	}

	public void saveTile(DataExchange data) {
		Gamer gamer = gamerRepository.findById(data.getGamerId()).orElse(null);
		gamer.setWithTile(false);
		gamerRepository.save(gamer);
		Tile tile = new Tile(null, gamer, gamer.getGame(), data.getType(), 1, data.getAngle(), 1, data.getPosX(),
				data.getPosY());
		tile = tileRepository.save(tile);
		List<Tile> newTiles = new ArrayList<Tile>();
		newTiles.add(tile);

		simpMessagingTemplate.convertAndSend("/topic/game/game/" + gamer.getGame().getId(),
				new GameMessage<List<Tile>>(MessageType.NEW_TILE, newTiles));

		Gamer nextGamer = gamerRepository.findByGameAndOrdinalNumber(gamer.getGame(), gamer.getOrdinalNumber() + 1L);
		if (nextGamer == null)
			nextGamer = gamerRepository.findByGameAndOrdinalNumber(gamer.getGame(), 1L);
		else System.out.println("niby gracz jest");
		TileType randomTileType = TileType.randomTileType();

		nextGamer.setWithTile(true);
		nextGamer.setNewTileType(randomTileType);
		nextGamer = gamerRepository.save(nextGamer);
		simpMessagingTemplate.convertAndSendToUser(nextGamer.getSessionId(), "/reply",
				new GameMessage<TileType>(MessageType.NEW_TILE, randomTileType));

	}
}