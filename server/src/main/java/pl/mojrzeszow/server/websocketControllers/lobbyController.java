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
import pl.mojrzeszow.server.repositories.GameRepository;

import com.google.gson.Gson;

@Controller

@MessageMapping("/lobby")
public class lobbyController {
 
	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;

	@Autowired
	private GameRepository gameRepository;

	@MessageMapping("/getGames")
	@SendToUser("/queue/reply") 
	public List<Game> getAllgames(@Payload String message) throws Exception{
		
		List<Game> games = this.gameRepository.findByPrivateGameFalseAndStartedFalse();
		return games;
	}

}
