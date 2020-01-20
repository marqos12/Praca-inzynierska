package pl.mojrzeszow.server.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.mojrzeszow.server.models.Game;
import pl.mojrzeszow.server.models.Gamer;

@Repository
public interface GamerRepository extends JpaRepository<Gamer, Long> {
	Optional<Gamer> findById(Long id);

	List<Gamer> findByGame(Game game);

	Gamer findByGameAndOrdinalNumberAndStatusContaining(Game game, Long ordinalNumber, String status);

	List<Gamer> findByNotificationLessThanAndStatusNot(LocalDateTime notification, String status);

	List<Gamer> findByNotificationBetweenAndStatusNot(LocalDateTime notificationFrom, LocalDateTime notificationTo,
			String status);
}
