package com.app.user;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.auth.JwtService;

@Service
public class UserService {

	private final PasswordEncoder passwordEncoder;
	private final UserRepository userRepository;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public void updatePassword(String email,String curPassword, String newPassword) {
	    
	    User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found"));
	   
	    if (!passwordEncoder.matches(curPassword, user.getPasswordHash())) {
		    throw new RuntimeException("Current password is incorrect");
		}

         user.setPasswordHash(passwordEncoder.encode(newPassword));
         userRepository.save(user);
	    
	  }
}
