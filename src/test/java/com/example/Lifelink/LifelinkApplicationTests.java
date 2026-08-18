package com.example.Lifelink;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.stereotype.Component;

@SpringBootTest
class LifelinkApplicationTests {

	@Test
	void contextLoads() {
	}

	@Component
	public class TestRunner implements CommandLineRunner {

		@Value("${spring.datasource.url}")
		private String url;

		@Override
		public void run(String... args) {
			System.out.println(url);
		}
	}

}
