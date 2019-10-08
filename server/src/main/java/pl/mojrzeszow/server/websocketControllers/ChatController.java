package pl.mojrzeszow.server.websocketControllers;

import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;

import pl.mojrzeszow.server.models.messages.Message;

@Controller

@Deprecated
public class ChatController {

	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;

	// odpowiada użytkownikowi który się pyta
	@MessageMapping("/message")
	@SendToUser("/queue/reply")
	public String processMessageFromClient(@Payload String message) throws Exception {
		return message;
	}

	// przekazuje wiadomość do konkretnego usera
	@MessageMapping("/message3")
	public String processMessageFromClient3(@Payload String message) {

		String name = new Gson().fromJson(message, Map.class).get("to").toString();

		SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
		headerAccessor.setSessionId(name);
		headerAccessor.setLeaveMutable(true);

		simpMessagingTemplate.convertAndSendToUser(name, "/reply", message);
		return message;
	}

	@MessageMapping("/message2")
	// @SendToUser("/queue/reply")
	public Message processMessageFromClient2(@Payload Message message) throws Exception {
		simpMessagingTemplate.convertAndSendToUser(message.getTo(), "/reply", message);
		return message;
	}

	@MessageMapping("/test2")
	public void test(String str, Principal principal) {
		simpMessagingTemplate.convertAndSendToUser(principal.getName(), "/msg", "haha2");
	}

	@MessageExceptionHandler
	@SendToUser("/queue/errors")
	public String handleException(Throwable exception) {
		return exception.getMessage();
	}

}