package pl.mojrzeszow.server.service;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import pl.mojrzeszow.server.enums.MessageType;
import pl.mojrzeszow.server.enums.TileType;
import pl.mojrzeszow.server.models.Gamer;
import pl.mojrzeszow.server.models.Tile;
import pl.mojrzeszow.server.models.messages.GameMessage;
import pl.mojrzeszow.server.repositories.GameRepository;
import pl.mojrzeszow.server.repositories.GamerRepository;
import pl.mojrzeszow.server.repositories.TileRepository;
import pl.mojrzeszow.server.repositories.UserRepository;

@Service
public class GameService{
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
		simpMessagingTemplate.convertAndSend("/topic/game/game/"+gamer.getId(), new GameMessage<List<Gamer>>(MessageType.GAMERS_STATUS_UPDATE, gamers));


		GameMessage<Gamer> gameMessage = new GameMessage<Gamer>(MessageType.ME_GAMER, updatedGamer);
		return gameMessage;
	}

	public GameMessage<List<Tile>> joinGame(Gamer gamer) {

		Gamer updatedGamer = this.gamerRepository.findById(gamer.getId()).orElse(null);
		updatedGamer.setReady(true);
		updatedGamer = this.gamerRepository.save(updatedGamer);

		List<Gamer>	gamers = this.gamerRepository.findByGame(updatedGamer.getGame());
		simpMessagingTemplate.convertAndSend("/topic/game/game/"+updatedGamer.getGame().getId(), new GameMessage<List<Gamer>>(MessageType.GAMERS_STATUS_UPDATE, gamers));
		
		System.out.println("Gracz dołącza do gry");
		if(gamers.stream().filter(Gamer::isReady).count()==gamers.size()){
			System.out.println("Wszyscy gracze dołączyli");
			Collections.shuffle(gamers);
			Long i = new Long(0);
			for (Gamer gameGamer : gamers){
				gameGamer.setOrdinalNumber(i++);
			}
			Gamer firstGamer = gamers.get(0);
			TileType randomTileType = TileType.randomTileType();
			simpMessagingTemplate.convertAndSendToUser(firstGamer.getSessionId(), "/reply", new GameMessage<TileType>(MessageType.NEW_TILE, randomTileType));
		}

		List<Tile> tiles = tileRepository.findByGame(updatedGamer.getGame());

		GameMessage<List<Tile>> gameMessage = new GameMessage<List<Tile>>(MessageType.GAME_JOINED, tiles);
		return gameMessage;
	}
}