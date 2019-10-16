package pl.mojrzeszow.server.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.mojrzeszow.server.models.Game;
import pl.mojrzeszow.server.models.Gamer;
import pl.mojrzeszow.server.models.Tile;


@Repository
public interface TileRepository extends JpaRepository<Tile, Long>{
	Optional<Tile> findById(Long id);
	List<Tile> findByGame(Game game);
	List<Tile> findByGamer(Gamer gamer);
}

