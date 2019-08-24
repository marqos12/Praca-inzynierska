package pl.mojrzeszow.server.websocketControllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import pl.mojrzeszow.server.enums.MessageType;
import pl.mojrzeszow.server.models.Game;
import pl.mojrzeszow.server.models.User;
import pl.mojrzeszow.server.models.messages.DataExchange;
import pl.mojrzeszow.server.models.messages.GameMessage;
import pl.mojrzeszow.server.repositories.GameRepository;
import pl.mojrzeszow.server.repositories.GamerRepository;
import pl.mojrzeszow.server.repositories.UserRepository;

import com.google.gson.Gson;

@Controller

@MessageMapping("/lobby")
public class lobbyController {
 
	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;

	@Autowired
	private GameRepository gameRepository;

	@Autowired
	private GamerRepository gamerRepository;

	@Autowired
	UserRepository userRepository;

	@MessageMapping("/getGames")
	@SendToUser("/queue/reply") 
	public GameMessage<List<Game>> getAllgames(@Payload String message) throws Exception{
		
		List<Game> games = this.gameRepository.findByPrivateGameFalseAndStartedFalse();
		GameMessage<List<Game>> gameMessage = new GameMessage<List<Game>>(MessageType.GAME_LIST_UPDATED, games);
		return gameMessage;
	}

	@MessageMapping("/createGame")
	@SendToUser("/queue/reply") 
	public GameMessage<Game> createGame(@Payload DataExchange userId){

		User user = userRepository.findById(userId.getId()).orElse(null);
		Game game = new Game(user);
		gameRepository.save(game);

	

		GameMessage<Game> gameMessage = new GameMessage<Game>(MessageType.GAME_CREATED, game);
		return gameMessage;
	}

	@MessageMapping("/updateGame")
	@SendToUser("/queue/reply") 
	public GameMessage<Game> updateGame(@Payload Game game){
/*
		User user = userRepository.findById(userId.getId()).orElse(null);
		Game game = new Game(user);*/
		game = gameRepository.save(game);

		List<Game> allGames = gameRepository.findByPrivateGameFalseAndStartedFalse();

		simpMessagingTemplate.convertAndSend("/lobby/allGames",allGames);

		GameMessage<Game> gameMessage = new GameMessage<Game>(MessageType.GAME_UPDATE, game);
		return gameMessage;
	}
}
