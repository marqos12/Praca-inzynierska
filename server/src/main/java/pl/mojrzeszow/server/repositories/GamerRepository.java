package pl.mojrzeszow.server.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.mojrzeszow.server.models.Gamer;

@Repository
public interface GamerRepository extends JpaRepository<Gamer, Long> {
	Optional<Gamer> findById(Long id);
}

