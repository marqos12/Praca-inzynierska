package pl.mojrzeszow.server.models.messages;

public class Message {

	private String to;
	private String from;
	private String text;
	
	public Message() {};
	public Message(String to, String from, String text) {
		this.to = to; 
		this.from  = from;
		this.text = text;
	}
	public String getTo() {
		return to;
	}
	public void setTo(String to) {
		this.to = to;
	}
	public String getFrom() {
		return from;
	}
	public void setFrom(String from) {
		this.from = from;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	};
}
