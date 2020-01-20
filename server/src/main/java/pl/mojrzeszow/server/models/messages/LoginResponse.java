package pl.mojrzeszow.server.models.messages;

import pl.mojrzeszow.server.service.impl.UserPrinciple;

public class LoginResponse {
	String jwt;
	UserPrinciple user;

	public LoginResponse() {
	}

	public LoginResponse(String jwt, UserPrinciple user) {
		super();
		this.jwt = jwt;
		this.user = user;
	}

	public String getJwt() {
		return jwt;
	}

	public void setJwt(String jwt) {
		this.jwt = jwt;
	}

	public UserPrinciple getUser() {
		return user;
	}

	public void setUser(UserPrinciple user) {
		this.user = user;
	}

}
