package pl.mojrzeszow.server.models.messages;

import java.util.Date;

@Deprecated
public class OutputMessage {
	private String from;
	private String text;
	private String date;
	
	public OutputMessage() {}
	public OutputMessage(String from, String text, String date) {
		this.from = from;
		this.text = text;
		this.date = date;
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
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
}
