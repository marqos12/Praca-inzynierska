package pl.mojrzeszow.server.database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import pl.mojrzeszow.server.enums.RoleName;
import pl.mojrzeszow.server.models.Role;
import pl.mojrzeszow.server.repositories.RoleRepository;

@Component
public class Data implements CommandLineRunner {

	@Autowired
	private RoleRepository roleRepository;

	@Override
	public void run(String... args) throws Exception {

		try {
			Role r1 = new Role();
			r1.setName(RoleName.ROLE_USER);
			roleRepository.save(r1);

			Role r3 = new Role();
			r3.setName(RoleName.ROLE_PM);
			roleRepository.save(r3);
			Role r2 = new Role();
			r2.setName(RoleName.ROLE_ADMIN);
			roleRepository.save(r2);
		} catch (Exception e) {

		}

	}
}