package com.example.Lifelink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.example.Lifelink.Entity.User;
import com.example.Lifelink.Repository.UserRepository;
import com.example.Lifelink.Type.EnumRoles;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@SpringBootApplication
public class LifelinkApplication {

	public static void main(String[] args) {
		SpringApplication.run(LifelinkApplication.class, args);
	}

	@Bean
	CommandLineRunner seedAdmin(UserRepository repo, PasswordEncoder encoder) {
		return args -> {

			if (repo.findByUsername("admin@lifelink.com").isEmpty()) {

				User admin = new User();

				admin.setName("Admin");
				admin.setUsername("admin@lifelink.com");
				admin.setPassword(encoder.encode("Admin@123"));
				admin.setRole(Set.of(EnumRoles.ADMIN));

				repo.save(admin);
			}
		};
	}
}
