package pl.mojrzeszow.server.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import pl.mojrzeszow.server.models.Game;
import pl.mojrzeszow.server.repositories.GameRepository;

@Component
public class GameRTService {


	@Autowired
    private GameRepository gameRepository;
    
    @Autowired 
    private GameService gameService;

    @Scheduled(fixedRate = 3000)
    public void RTSGamesLoop() {
        List<Game> games = gameRepository.findByStartedTrueAndIsRTSTrueAndEndedFalse();
        List<Game> newGames = games.stream().filter(g->g.getRTSLastRoundTime()==null).collect(Collectors.toList());
        List<Game> otherGames = games.stream().filter(g->g.getRTSLastRoundTime()!=null&&ChronoUnit.SECONDS.between(g.getRTSLastRoundTime(), LocalDateTime.now())>=g.getRtsInterval()).collect(Collectors.toList());
        List<Game>unactiveGames = games.stream().filter(g->g.getRTSLastRoundTime()!=null&&ChronoUnit.MINUTES.between(g.getLastActivity(), LocalDateTime.now())>=10).collect(Collectors.toList());
        for(Game game: newGames){
            game.setRTSLastRoundTime(LocalDateTime.now());
            gameService.newRoundRTSMode(game);
        }
        for(Game game:otherGames){
            game.setRTSLastRoundTime(LocalDateTime.now());
            gameService.newRoundRTSMode(game);
        }
        for(Game game: unactiveGames){
            game.setEnded(true);
        }
        gameRepository.saveAll(unactiveGames);
        gameRepository.saveAll(newGames);
        gameRepository.saveAll(otherGames);
    }

}