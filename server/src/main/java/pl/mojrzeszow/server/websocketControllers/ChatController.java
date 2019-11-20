package pl.mojrzeszow.server.websocketControllers;


import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import pl.mojrzeszow.server.models.messages.DataExchange;

@Controller
public class ChatController {

	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;
	DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");

	@MessageMapping("/chat/global")
	public void globalChatMessage(@Payload DataExchange message) throws Exception {
		message.time = LocalDateTime.now().format(formatter);
		simpMessagingTemplate.convertAndSend("/topic/chat/global",message);
	}
	
	@MessageMapping("/chat/game")
	public void gameChatMessage(@Payload DataExchange message) throws Exception {
		message.time = LocalDateTime.now().format(formatter);
		simpMessagingTemplate.convertAndSend("/topic/chat/game/"+message.gameId,message);
	}
	


}