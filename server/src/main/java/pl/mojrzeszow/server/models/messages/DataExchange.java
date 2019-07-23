package pl.mojrzeszow.server.models.messages;

public class DataExchange {

    private Long id;

    public DataExchange() {}
    
	public DataExchange(Long id) {
		super();
		this.id = id;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
    
    
}
