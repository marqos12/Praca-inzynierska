package pl.mojrzeszow.server.controllers;

import java.util.HashSet;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pl.mojrzeszow.server.enums.RoleName;
import pl.mojrzeszow.server.models.Role;
import pl.mojrzeszow.server.models.User;
import pl.mojrzeszow.server.models.messages.LoginForm;
import pl.mojrzeszow.server.models.messages.LoginResponse;
import pl.mojrzeszow.server.models.messages.SignUpForm;
import pl.mojrzeszow.server.repositories.RoleRepository;
import pl.mojrzeszow.server.repositories.UserRepository;
import pl.mojrzeszow.server.security.jwt.JwtProvider;
import pl.mojrzeszow.server.service.impl.UserPrinciple;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthRestAPIs {

  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtProvider jwtProvider;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginForm loginRequest) {

    Authentication authentication = authenticationManager
        .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtProvider.generateJwtToken(authentication);
    return ResponseEntity.ok(new LoginResponse(jwt, (UserPrinciple) authentication.getPrincipal()));
  }

  @PostMapping("/signup")
  public ResponseEntity<String> registerUser(@RequestBody SignUpForm signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return new ResponseEntity<String>("Fail -> Username is already taken!", HttpStatus.BAD_REQUEST);
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return new ResponseEntity<String>("Fail -> Email is already in use!", HttpStatus.BAD_REQUEST);
    }

    User user = new User(signUpRequest.getName(), signUpRequest.getUsername(), signUpRequest.getEmail(),
        encoder.encode(signUpRequest.getPassword()));

    Set<String> strRoles = signUpRequest.getRole();
    Set<Role> roles = new HashSet<>();

    strRoles.forEach(role -> {
      switch (role) {
      case "admin":
        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
            .orElseThrow(() -> new RuntimeException("{\"Fail!\":\" -> Cause: User Role not find.\"}"));
        roles.add(adminRole);

        break;
      case "pm":
        Role pmRole = roleRepository.findByName(RoleName.ROLE_PM)
            .orElseThrow(() -> new RuntimeException("{\"Fail!\":\" -> Cause: User Role not find.\"}"));
        roles.add(pmRole);

        break;
      default:
        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
            .orElseThrow(() -> new RuntimeException("{\"Fail! \":\"-> Cause: User Role not find.\"}"));
        roles.add(userRole);
      }
    });

    user.setRoles(roles);
    userRepository.save(user);

    return ResponseEntity.ok().body("{\"success\":\"User registered successfully!\"}");
  }
}