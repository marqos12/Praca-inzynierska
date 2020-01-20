package pl.mojrzeszow.server.models.messages;

import pl.mojrzeszow.server.enums.MessageType;

public class GameMessage<T> {
	private MessageType type;
	private T payload;

	public GameMessage() {
	}

	public GameMessage(MessageType type, T payload) {
		this.type = type;
		this.payload = payload;
	}

	public MessageType getType() {
		return this.type;
	}

	public void setType(MessageType type) {
		this.type = type;
	}

	public T getPayload() {
		return this.payload;
	}

	public void setPayload(T payload) {
		this.payload = payload;
	}
}
