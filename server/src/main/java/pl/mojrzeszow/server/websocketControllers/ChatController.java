package pl.mojrzeszow.server.websocketControllers;

import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;

import pl.mojrzeszow.server.models.messages.ChatMessage;
import pl.mojrzeszow.server.models.messages.Message;
import pl.mojrzeszow.server.models.messages.OutputMessage;

@Controller

@Deprecated
public class ChatController {

	
	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;
	 
	@MessageMapping("/message")
	@SendToUser("/queue/reply")
	public String processMessageFromClient(@Payload String message) throws Exception {
		//String name = new Gson().fromJson(message, Map.class).get("name").toString();
		//messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/reply", name);
		System.out.println("asdasdasdasd");
		return message;
	}
	
	@MessageMapping("/message3")
	//@SendToUser("/queue/reply")
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
	
	
	

	@MessageMapping("/message2")
	//@SendToUser("/queue/reply")
	public Message processMessageFromClient2(@Payload Message message) throws Exception {
		System.out.println("asd");
		//String name = new Gson().fromJson(message, Map.class).get("name").toString();
		System.out.println(message.getTo());
		simpMessagingTemplate.convertAndSendToUser(message.getTo(), "/reply", message);
		return message;
	}
	
	@MessageMapping("/test2")
    public void test(String str, Principal principal){
     simpMessagingTemplate.convertAndSendToUser(principal.getName(),"/msg","haha2");
    }
		@MessageExceptionHandler
    @SendToUser("/queue/errors")
    public String handleException(Throwable exception) {
        return exception.getMessage();
    }
	/*@MessageMapping("/secured/room") 
	public void sendSpecific(
	  @Payload Message msg, 
	  //Principal user, 
	  @Header("simpSessionId") String sessionId) throws Exception { 
	    OutputMessage out = new OutputMessage(
	      msg.getFrom(), 
	      msg.getText(),
	      new SimpleDateFormat("HH:mm").format(new Date())); 
	    simpMessagingTemplate.convertAndSendToUser(
	     // sessionId, "/queue/user", out); 
	      msg.getTo(), "/queue/user", out);
        System.out.println(sessionId+" "+msg.getTo());
	    
	}
	@MessageMapping("/topic")
    @SendToUser("/queue/reply")
    public String processMessageFromClient(
      @Payload String message) throws Exception {
    return message;
    }
	
	@MessageMapping("/greetings")
	@SendToUser("/queue/greetings")
	public String reply(@Payload String message,
	   Principal user) {
		System.out.println(user.getName());
	 return  "Hello " + message;
	}*/
	/*
	
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        System.out.println(chatMessage.getSender().toString());
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, 
                               SimpMessageHeaderAccessor headerAccessor) {
        // Add username in web socket session
        System.out.println(chatMessage);
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }*/

}