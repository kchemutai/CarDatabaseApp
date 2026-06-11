package com.packt.CarDatabase.service;

import com.packt.CarDatabase.domain.AppUser;
import com.packt.CarDatabase.repository.AppUserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AppUserRepository appUserRepository;

    public UserDetailsServiceImpl(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<AppUser> user = appUserRepository.findByUsername(username);
        User.UserBuilder userBuilder = null;
        if (user.isPresent()) {
            AppUser currentUser = user.get();
            userBuilder = User.withUsername(currentUser.getUsername());
            userBuilder.password(currentUser.getPassword());
            userBuilder.roles("USER");
        }
        else throw new UsernameNotFoundException("Username not found");
        return userBuilder.build();
    }
}
