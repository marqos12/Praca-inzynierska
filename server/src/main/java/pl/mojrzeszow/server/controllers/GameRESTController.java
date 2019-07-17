package pl.mojrzeszow.server.controllers;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pl.mojrzeszow.server.models.Game;
import pl.mojrzeszow.server.models.User;
import pl.mojrzeszow.server.repositories.GameRepository;

@RestController
@RequestMapping("/game")
public class GameRESTController {
	
	 @Autowired
	 private GameRepository gameRepository;
	 
	
	 @PostMapping
	 private Game newGame(@Valid @RequestBody User user)
	 {
		 Game game = new Game();
		 game.setAuthor(user);
		 gameRepository.save(game);
		 return game;
	 }
}
