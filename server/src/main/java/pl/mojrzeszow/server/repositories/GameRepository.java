package pl.mojrzeszow.server.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.mojrzeszow.server.models.Game;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
	Optional<Game> findById(Long id);
}
