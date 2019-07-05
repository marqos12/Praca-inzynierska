package pl.mojrzeszow.server.config;

import java.security.Principal;
import java.util.Map;

import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.session.Session;
import org.springframework.session.web.socket.config.annotation.AbstractSessionWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import pl.mojrzeszow.server.models.User;

@Configuration
@EnableScheduling
@EnableWebSocketMessageBroker
public class WebSocketConfig
		extends AbstractSessionWebSocketMessageBrokerConfigurer<Session> { 

	@Override
	protected void configureStompEndpoints(StompEndpointRegistry registry) { 
		registry.addEndpoint("/greeting").withSockJS();
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		registry.enableSimpleBroker("/queue/", "/topic/","/user/");
		registry.setApplicationDestinationPrefixes("/app");
	}
}