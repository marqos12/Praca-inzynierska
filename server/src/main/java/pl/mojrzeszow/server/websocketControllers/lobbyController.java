package pl.mojrzeszow.server.websocketControllers;

import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;


@Controller

@MessageMapping("/lobby")
public class lobbyController {

	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;
	 
	@MessageMapping("/getGames")
	@SendToUser("/lobby/replyGameList")
	public String processMessageFromClient3(@Payload String message)  {
		System.out.println("a1654asd");
		System.out.println(message);
		String name = new Gson().fromJson(message, Map.class).get("to").toString();
		System.out.println(name);
		
		SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor
			    .create(SimpMessageType.MESSAGE);
			headerAccessor.setSessionId(name);
			headerAccessor.setLeaveMutable(true);
		
		simpMessagingTemplate.convertAndSendToUser(name, "/reply", message);//, headerAccessor.getMessageHeaders());
		return message;
	}
	
	
	
	
	//private void statusUpdateScheduled() {}
	
	

	//@MessageMapping("/message")
	//private Set<Gamer> statusUpdate(@Payload String message){
		
	//}
	
}
