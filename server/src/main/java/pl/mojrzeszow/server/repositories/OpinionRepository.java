package pl.mojrzeszow.server.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.mojrzeszow.server.models.Opinion;


@Repository
public interface OpinionRepository extends JpaRepository<Opinion, Long> {

	Optional<Opinion> findById(Long id);
}