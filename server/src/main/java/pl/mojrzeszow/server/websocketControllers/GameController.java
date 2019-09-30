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
import pl.mojrzeszow.server.models.Gamer;
import pl.mojrzeszow.server.models.User;
import pl.mojrzeszow.server.models.messages.DataExchange;
import pl.mojrzeszow.server.models.messages.GameMessage;
import pl.mojrzeszow.server.repositories.GameRepository;
import pl.mojrzeszow.server.repositories.GamerRepository;
import pl.mojrzeszow.server.repositories.UserRepository;

import com.google.gson.Gson;

@Controller

@MessageMapping("/game")
public class GameController {

	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;

	@Autowired
	private GameRepository gameRepository;

	@Autowired
	private GamerRepository gamerRepository;

	@Autowired
	UserRepository userRepository;

	@MessageMapping("/updateStatus")
	@SendToUser("/queue/reply")
	public GameMessage<Gamer> getAllgames(@Payload Gamer gamer) throws Exception {

		Gamer updatedGamer = this.gamerRepository.findById(gamer.getId()).orElse(null);
		updatedGamer.setReady(true);
		updatedGamer = this.gamerRepository.save(updatedGamer);

		
		List<Gamer> gamers = this.gamerRepository.findByGame(updatedGamer.getGame());
		simpMessagingTemplate.convertAndSend("/topic/game/game/"+gamer.getId(), new GameMessage<List<Gamer>>(MessageType.GAMERS_STATUS_UPDATE, gamers));


		GameMessage<Gamer> gameMessage = new GameMessage<Gamer>(MessageType.ME_GAMER, updatedGamer);
		return gameMessage;
	}

	@MessageMapping("/joinGame")
	@SendToUser("/queue/reply")
	public GameMessage<Gamer> joinGame(@Payload Gamer gamer) {

		Gamer updatedGamer = this.gamerRepository.findById(gamer.getId()).orElse(null);
		updatedGamer.setSessionId(gamer.getSessionId());
		updatedGamer = gamerRepository.save(updatedGamer);

		List<Gamer>	gamers = this.gamerRepository.findByGame(updatedGamer.getGame());
		
		
		
		System.out.println("/game/game/"+updatedGamer.getGame().getId());
		
 

		simpMessagingTemplate.convertAndSend("/topic/gme/game/"+updatedGamer.getGame().getId(), new GameMessage<List<Gamer>>(MessageType.GAMERS_STATUS_UPDATE, gamers));


		GameMessage<Gamer> gameMessage = new GameMessage<Gamer>(MessageType.ME_GAMER, gamer);
		return gameMessage;
	}




	
	
}
