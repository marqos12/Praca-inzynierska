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

import pl.mojrzeszow.server.models.Game;
import pl.mojrzeszow.server.models.User;
import pl.mojrzeszow.server.models.messages.DataExchange;
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
	public List<Game> getAllgames(@Payload String message) throws Exception{
		
		List<Game> games = this.gameRepository.findByPrivateGameFalseAndStartedFalse();
		return games;
	}

	@MessageMapping("/createGame")
	public Game createGame(@Payload DataExchange userId){

		User user = userRepository.findById(userId.getId()).orElse(null);
		Game game = new Game(user);
		gameRepository.save(game);

		List<Game> allGames = gameRepository.findByPrivateGameFalseAndStartedFalse();
		simpMessagingTemplate.convertAndSend("/lobby/allGames",allGames);

		return game;
	}


}
