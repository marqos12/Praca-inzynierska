package pl.mojrzeszow.server.database;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import pl.mojrzeszow.server.models.Role;
import pl.mojrzeszow.server.models.RoleName;
import pl.mojrzeszow.server.models.User;
import pl.mojrzeszow.server.repositories.RoleRepository;


@Component
public class Data implements CommandLineRunner{

	@Autowired
	private RoleRepository roleRepository;


	
	@Override
	public void run (String... args) throws Exception{
	
		Role r1=new Role();
		r1.setName(RoleName.ROLE_USER);
		roleRepository.save(r1);
		
		Role r3=new Role();
		r3.setName(RoleName.ROLE_PM);
		roleRepository.save(r3);
		Role r2=new Role();
		r2.setName(RoleName.ROLE_ADMIN);
		roleRepository.save(r2);
		
		
		/*User u1=new User();
		u1.setEmail("user111@gmail.com");
		u1.setUsername("user111");
		u1.setPassword("user111");
		
		Role userR = this.roleRepository.findByName(RoleName.ROLE_USER).orElse(null);
		u1.setRole(userR});*/
		
		
		
		
	}
}