package pl.mojrzeszow.server.websocketControllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import pl.mojrzeszow.server.models.Game;
import pl.mojrzeszow.server.models.Gamer;
import pl.mojrzeszow.server.models.messages.DataExchange;
import pl.mojrzeszow.server.models.messages.GameMessage;
import pl.mojrzeszow.server.service.LobbyService;


@Controller

@MessageMapping("/lobby")
public class lobbyController {

	@Autowired
	private LobbyService lobbyService;

	@MessageMapping("/getGames")
	@SendToUser("/queue/reply")
	public GameMessage<List<Game>> getAllgames(@Payload String message) {
		return lobbyService.getAllgames(message);
	}

	@MessageMapping("/createGame")
	@SendToUser("/queue/reply")
	public GameMessage<Game> createGame(@Payload DataExchange userId) {
		return lobbyService.createGame(userId);
	}

	@MessageMapping("/createAloneGame")
	@SendToUser("/queue/reply")
	public GameMessage<Game> createAloneGame(@Payload DataExchange userId) {
		return lobbyService.createAloneGame(userId);
	}

	@MessageMapping("/updateGame")
	@SendToUser("/queue/reply")
	public GameMessage<Game> updateGame(@Payload Game game) {
		return lobbyService.updateGame(game);
	}

	@MessageMapping("/joinGame")
	@SendToUser("/queue/reply")
	public GameMessage<Gamer> joinGame(@Payload DataExchange gamersData) {
		return lobbyService.joinGame(gamersData);
	}

	@MessageMapping("/leaveGame")
	@SendToUser("/queue/reply")
	public GameMessage<Boolean> leaveGame(@Payload DataExchange gamersData) {
		return lobbyService.leaveGame(gamersData);
	}

	@MessageMapping("/statusUpdate")
	public GameMessage<Gamer> gamerStatusUpdate(@Payload Gamer gamer) {
		return lobbyService.gamerStatusUpdate(gamer);
	}

	@MessageMapping("/startGame")
	public void startGame(@Payload Game game) {
		lobbyService.startGame(game);
	}
	
	@MessageMapping("/kickGamer")
	public void kickGamer(@Payload DataExchange gamerData) {
		 lobbyService.kickGamer(gamerData);
	}

}
