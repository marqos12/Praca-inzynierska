package pl.mojrzeszow.server.controllers;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
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
}
