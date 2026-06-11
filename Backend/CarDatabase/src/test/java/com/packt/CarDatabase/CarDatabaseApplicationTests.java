package com.packt.CarDatabase;

import com.packt.CarDatabase.controller.CarController;
import com.packt.CarDatabase.domain.AppUser;
import com.packt.CarDatabase.repository.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class CarDatabaseApplicationTests {

	@Autowired
	private CarController controller;

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private AppUserRepository appUserRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@BeforeEach
	void setup() {
		appUserRepository.deleteAll();

		AppUser admin = new AppUser();
		admin.setUsername("admin");
		admin.setPassword(passwordEncoder.encode("admin"));
		admin.setRole("ADMIN");

		appUserRepository.save(admin);
	}

	@Test
	@DisplayName("First example test case")
	void contextLoads() {
		assertThat(controller).isNotNull();
	}

	@Test
	public void testAuthentication() throws Exception {
		// Testing authentication with correct credentials
		this.mockMvc.
				perform(post("/login").content("{\"username\":\"admin\",\"password\":\"admin\"}")
						.header(HttpHeaders.CONTENT_TYPE, "application/json"))
				.andDo(print()).andExpect(status().isOk());

	}

}
