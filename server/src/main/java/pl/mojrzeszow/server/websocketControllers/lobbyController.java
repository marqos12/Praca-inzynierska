package pl.mojrzeszow.server.websocketControllers;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import pl.mojrzeszow.server.models.Gamer;

@Controller

@MessageMapping("/lobby")
public class lobbyController {

	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;
	 
	//private void statusUpdateScheduled() {}
	
	

	//@MessageMapping("/message")
	//private Set<Gamer> statusUpdate(@Payload String message){
		
	//}
	
}
