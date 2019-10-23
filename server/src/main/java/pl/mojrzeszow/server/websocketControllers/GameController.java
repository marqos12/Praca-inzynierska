package pl.mojrzeszow.server.websocketControllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import pl.mojrzeszow.server.models.Gamer;
import pl.mojrzeszow.server.models.Tile;
import pl.mojrzeszow.server.models.messages.DataExchange;
import pl.mojrzeszow.server.models.messages.GameMessage;
import pl.mojrzeszow.server.service.GameService;

@Controller

@MessageMapping("/game")
public class GameController {

	@Autowired
	private GameService gameService;

	@MessageMapping("/updateStatus")
	@SendToUser("/queue/reply")
	public GameMessage<Gamer> getAllgames(@Payload Gamer gamer) throws Exception {
		return gameService.getAllgames(gamer);
	}

	@MessageMapping("/joinGame")
	@SendToUser("/queue/reply")
	public GameMessage<List<Tile>> joinGame(@Payload Gamer gamer) {
		return gameService.joinGame(gamer);
	}

	@MessageMapping("/saveTile")
	// @SendToUser("/queue/reply")
	public void saveTile(@Payload DataExchange dataExchange) {
		gameService.saveTile(dataExchange);
	}

	@MessageMapping("/updateTile")
	public void updateTile(@Payload DataExchange dataExchange) {
		gameService.updateTile(dataExchange);
	}


}
