package pl.mojrzeszow.server.controllers;

import javax.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pl.mojrzeszow.server.models.Game;
import pl.mojrzeszow.server.models.User;

@RestController
@RequestMapping("/game")
public class GameRESTController {
	
	
	
	 @PostMapping
	 private Game newGame(@Valid @RequestBody User user)
	 {
		 Game game = new Game();
		 //game.setAuthor(user);
		 //zapisanie encji w bazie
		 return game;
	 }
}
