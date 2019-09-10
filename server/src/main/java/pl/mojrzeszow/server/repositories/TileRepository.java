package pl.mojrzeszow.server.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.mojrzeszow.server.models.Tile;


@Repository
public interface TileRepository extends JpaRepository<Tile, Long>{
	Optional<Tile> findById(Long id);
}

