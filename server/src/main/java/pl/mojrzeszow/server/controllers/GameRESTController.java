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

import pl.mojrzeszow.server.models.Game;
import pl.mojrzeszow.server.models.User;
import pl.mojrzeszow.server.models.messages.DataExchange;
import pl.mojrzeszow.server.repositories.GameRepository;
import pl.mojrzeszow.server.repositories.UserRepository;

@RestController
@RequestMapping("/api/game")
public class GameRESTController {

	@Autowired
	private GameRepository gameRepository;

	@Autowired
	UserRepository userRepository;

	@PostMapping
	private Game newGame(@Valid @RequestBody DataExchange userId) {
		User user = userRepository.findById(userId.getId()).orElse(null);

		Game game = new Game(user);
		gameRepository.save(game);
		return game;
	}

	@PutMapping
	private Game updateGame(@RequestBody Game game){
		
		Game updatedGame = gameRepository.save(game);

		return updatedGame;
	}

	@GetMapping
	private List<Game> getGames(){
		return this.gameRepository.findByPrivateGameFalseAndStartedFalse();
	}

	@GetMapping("/{id}")
	private Game getGameById(@PathVariable Long id){
		return this.gameRepository.findById(id).orElse(null);
	}



}
