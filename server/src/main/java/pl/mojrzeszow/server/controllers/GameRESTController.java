package pl.mojrzeszow.server.controllers;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pl.mojrzeszow.server.enums.TileType;
import pl.mojrzeszow.server.models.Game;
import pl.mojrzeszow.server.models.Gamer;
import pl.mojrzeszow.server.models.Opinion;
import pl.mojrzeszow.server.models.Tile;
import pl.mojrzeszow.server.models.User;
import pl.mojrzeszow.server.models.messages.DataExchange;
import pl.mojrzeszow.server.repositories.GameRepository;
import pl.mojrzeszow.server.repositories.GamerRepository;
import pl.mojrzeszow.server.repositories.OpinionRepository;
import pl.mojrzeszow.server.repositories.TileRepository;
import pl.mojrzeszow.server.repositories.UserRepository;

@RestController
@RequestMapping("/api/game")
public class GameRESTController {

	@Autowired
	private GameRepository gameRepository;

	@Autowired
	private GamerRepository gamerRepository;
	@Autowired
	private OpinionRepository opinionRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	private TileRepository tileRepository;

	@PostMapping
	private Game newGame(@Valid @RequestBody DataExchange userId) {
		User user = userRepository.findById(userId.getId()).orElse(null);

		Game game = new Game(user);
		gameRepository.save(game);
		return game;
	}

	@PutMapping
	private Game updateGame(@RequestBody Game game) {

		Game updatedGame = gameRepository.save(game);

		return updatedGame;
	}

	@GetMapping
	private List<Game> getGames() {
		return this.gameRepository.findByPrivateGameFalseAndStartedFalse();
	}

	@GetMapping("/{id}")
	private Game getGameById(@PathVariable Long id) {
		return this.gameRepository.findById(id).orElse(null);
	}

	@PostMapping("/gamers")
	private Gamer addGamerToGame(@RequestBody DataExchange gamersData) {

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

		if (!exists)
			gamer = new Gamer(user, game, gamersData.getSessionId());

		gamer = gamerRepository.save(gamer);
		return gamer;
	}

	@GetMapping("/gamers/{id}")
	private List<Gamer> findGamersForGame(@PathVariable Long id) {
		Game game = this.gameRepository.findById(id).orElse(null);
		return this.gamerRepository.findByGame(game);
	}

	@GetMapping("/tile/{id}")
	private DataExchange getTileId(@PathVariable Long id) {
		Tile tile = tileRepository.findById(id).orElse(null);
		DataExchange dataExchange = new DataExchange();
		dataExchange.gamer = tile.getGamer();
		dataExchange.outcomeInfluence = tile.getTileGeneratedInfluence();
		dataExchange.incomeInfluence = tile.getInfluence();
		dataExchange.needToUppgrade = tile.getTileInfluenceNeedToUpgrade();
		dataExchange.points = tile.getType().getPoints() * tile.getLvl() * tile.getLvl();
		dataExchange.lvl = tile.getLvl();
		dataExchange.usedInfluence = tile.getUsedInfluence();
		if (tile.getTileGeneratedInfluence() != null)
			dataExchange.summaryDucklings = tile.getTileGeneratedInfluence().getDucklings()
					+ (tile.getAdditionalMoney() == null ? 0L : tile.getAdditionalMoney())
					- (tile.getTaxes() == null ? 0L : tile.getTaxes());
		return dataExchange;
	}

	@GetMapping("/tile/rebuild/{name}/{lvl}")
	private DataExchange getTileId(@PathVariable String name, @PathVariable int lvl) {
		DataExchange dataExchange = new DataExchange();
		TileType type = TileType.valueOf(name);
		Tile tile = new Tile();
		tile.setType(type);
		tile.setLvl(1);
		dataExchange.outcomeInfluence = tile.getTileGeneratedInfluence();
		dataExchange.buildCosts = type.getCosts() * lvl * lvl;
		dataExchange.deconstructionCosts = dataExchange.buildCosts / 2;
		return dataExchange;
	}

	@PostMapping("/opinion")
	private Opinion sendOpinion(@RequestBody Opinion opinion) {

		return opinionRepository.save(opinion);
	}

	@GetMapping("/opinion")
	private List<Opinion> getOpinion() {

		return opinionRepository.findAll();
	}
}
