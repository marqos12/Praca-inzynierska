package pl.mojrzeszow.server.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import pl.mojrzeszow.server.enums.GameEndType;
import pl.mojrzeszow.server.enums.MessageType;
import pl.mojrzeszow.server.enums.TileType;
import pl.mojrzeszow.server.models.Game;
import pl.mojrzeszow.server.models.Gamer;
import pl.mojrzeszow.server.models.Influence;
import pl.mojrzeszow.server.models.Tile;
import pl.mojrzeszow.server.models.User;
import pl.mojrzeszow.server.models.messages.DataExchange;
import pl.mojrzeszow.server.models.messages.GameMessage;
import pl.mojrzeszow.server.repositories.GameRepository;
import pl.mojrzeszow.server.repositories.GamerRepository;
import pl.mojrzeszow.server.repositories.TileRepository;
import pl.mojrzeszow.server.repositories.UserRepository;

@Service
public class LobbyService {
	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;

	@Autowired
	private GameRepository gameRepository;

	@Autowired
	private GamerRepository gamerRepository;

	@Autowired
	private TileRepository tileRepository;

	@Autowired
	UserRepository userRepository;


    public GameMessage<List<Game>> getAllgames(String message){
		List<Game> games = this.gameRepository.findByPrivateGameFalseAndStartedFalse();
		GameMessage<List<Game>> gameMessage = new GameMessage<List<Game>>(MessageType.GAME_LIST_UPDATED, games);
		return gameMessage;
    }
    
    public GameMessage<Game> createGame(DataExchange userId) {

		User user = userRepository.findById(userId.getId()).orElse(null);
		Game game = new Game(user);
		gameRepository.save(game);

		GameMessage<Game> gameMessage = new GameMessage<Game>(MessageType.GAME_CREATED, game);
		return gameMessage;
    }
    
    public GameMessage<Game> updateGame(Game game) {
		game = gameRepository.save(game);

		List<Game> allGames = gameRepository.findByPrivateGameFalseAndStartedFalse();

		simpMessagingTemplate.convertAndSend("/topic/lobby/allGames", allGames);
		simpMessagingTemplate.convertAndSend("/topic/lobby/game/" + game.getId(),
				new GameMessage<Game>(MessageType.GAME_UPDATE, game));

		GameMessage<Game> gameMessage = new GameMessage<Game>(MessageType.GAME_UPDATE, game);
		return gameMessage;
    }
    
    public GameMessage<Gamer> joinGame(DataExchange gamersData) {

		User user = userRepository.findById(gamersData.getUserId()).orElse(null);
		Game game = gameRepository.findById(gamersData.getGameId()).orElse(null);

		List<Gamer> gamers = this.gamerRepository.findByGame(game);

		boolean exists = false;
		Gamer gamer = null;

		for (Gamer existGamer : gamers) {
			if (existGamer.getUser().getId().equals(gamersData.getUserId())) {
				exists = true;
				gamer = existGamer;
				gamer.setSessionId(gamersData.getSessionId());
				break;
			}
		}

		if (!exists) {
			gamer = new Gamer(user, game, gamersData.getSessionId());
			game.setGamersCount(game.getGamersCount() + 1L);
			gameRepository.save(game);
			List<Game> allGames = gameRepository.findByPrivateGameFalseAndStartedFalse();
			simpMessagingTemplate.convertAndSend("/topic/lobby/allGames", allGames);
		}

		gamer = gamerRepository.save(gamer);

		gamers = this.gamerRepository.findByGame(game);

		simpMessagingTemplate.convertAndSend("/topic/lobby/game/" + gamersData.getGameId(),
				new GameMessage<List<Gamer>>(MessageType.GAMERS_STATUS_UPDATE, gamers));

		GameMessage<Gamer> gameMessage = new GameMessage<Gamer>(MessageType.ME_GAMER, gamer);
		return gameMessage;
	}

	public GameMessage<Boolean> leaveGame(DataExchange gamersData) {

		Gamer gamer = gamerRepository.findById(gamersData.getGamerId()).orElse(null);
		Game game = gamer.getGame();

		List<Gamer> gamers2 = this.gamerRepository.findByGame(game);
		if (game.getAuthor().equals(gamer.getUser())) {
			for (Gamer gameGamer : gamers2)
				if (!game.getAuthor().getId().equals(gameGamer.getUser().getId())) {
					game.setAuthor(gameGamer.getUser());
					break;
				}

		} 

		gamerRepository.delete(gamer);
		game.setGamersCount(game.getGamersCount() - 1);
		gameRepository.save(game);

		List<Gamer> gamers = this.gamerRepository.findByGame(game);

		if (gamers.size() < 1) {
			this.gameRepository.delete(game);
		}

		List<Game> allGames = gameRepository.findByPrivateGameFalseAndStartedFalse();
		simpMessagingTemplate.convertAndSend("/topic/lobby/allGames", allGames);

		simpMessagingTemplate.convertAndSend("/topic/lobby/game/" + game.getId(),
				new GameMessage<List<Gamer>>(MessageType.GAMERS_STATUS_UPDATE, gamers));

		GameMessage<Boolean> gameMessage = new GameMessage<Boolean>(MessageType.GAME_LEFT, true);
		return gameMessage;
	}

	public GameMessage<Gamer> gamerStatusUpdate(Gamer gamer) {

        Gamer exactGamer = this.gamerRepository.findById(gamer.getId()).orElse(gamer);
		exactGamer.setStatus(gamer.isStatus());
		exactGamer.setReady(gamer.isReady());

		this.gamerRepository.save(exactGamer);

		List<Gamer> gamers = this.gamerRepository.findByGame(gamer.getGame());
		simpMessagingTemplate.convertAndSend("/topic/lobby/game/" + gamer.getGame().getId(),
				new GameMessage<List<Gamer>>(MessageType.GAMERS_STATUS_UPDATE, gamers));

		GameMessage<Gamer> gameMessage = new GameMessage<Gamer>(MessageType.ME_GAMER, gamer);
		return gameMessage;
	}

	public void startGame(Game game) {

		Game updatingGame = this.gameRepository.findById(game.getId()).orElse(null);
		updatingGame.setStarted(game.isStarted());
		if(updatingGame.getEndType().equals(GameEndType.TIME_LIMIT)){
			LocalDateTime time = LocalDateTime.now();
			updatingGame.setGameLimit(updatingGame.getGameLimit()*60 + time.atZone(ZoneId.systemDefault()).toEpochSecond()
			);
		}
		updatingGame = this.gameRepository.save(updatingGame);

		List<Gamer> gamers = this.gamerRepository.findByGame(updatingGame);

		Tile startTile = new Tile(null, null, game, TileType.ROAD_ACCESS_DOUBLE, 1, 0, 1, 0L, 0L,new Influence());

		tileRepository.save(startTile);

		for (Gamer gamer : gamers) {
			gamer.setReady(false);
			this.gamerRepository.save(gamer);
		}

		simpMessagingTemplate.convertAndSend("/topic/lobby/game/" + game.getId(),
				new GameMessage<Game>(MessageType.GAME_STARTED, updatingGame));
	}

	public void kickGamer(DataExchange gamerData){
		Gamer gamer = gamerRepository.findById(gamerData.getId()).orElse(null);
		Game game = gamer.getGame();

		List<Gamer> gamers2 = this.gamerRepository.findByGame(game);
		if (game.getAuthor().equals(gamer.getUser())) {
			for (Gamer gameGamer : gamers2)
				if (!game.getAuthor().getId().equals(gameGamer.getUser().getId())) {
					game.setAuthor(gameGamer.getUser());
					break;
				}

		} 

		simpMessagingTemplate.convertAndSendToUser(gamer.getSessionId(), "/reply",
				new GameMessage<Gamer>(MessageType.GTFO_MESSAGE, gamer));

		gamerRepository.delete(gamer);
		game.setGamersCount(game.getGamersCount() - 1);
		gameRepository.save(game);

		List<Gamer> gamers = this.gamerRepository.findByGame(game);

		if (gamers.size() < 1) {
			this.gameRepository.delete(game);
		}

		List<Game> allGames = gameRepository.findByPrivateGameFalseAndStartedFalse();
		simpMessagingTemplate.convertAndSend("/topic/lobby/allGames", allGames);

		simpMessagingTemplate.convertAndSend("/topic/lobby/game/" + game.getId(),
				new GameMessage<List<Gamer>>(MessageType.GAMERS_STATUS_UPDATE, gamers));
	}
}