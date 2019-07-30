import React, { Component } from "react";
import { connect } from "react-redux";
import uuidv1 from "uuid";
import { addArticle, wsConnect, wsOpenTestCanal, wsSendTestMessage } from "../actions/index";

function mapDispatchToProps(dispatch) {
  return {
    addArticle: article => dispatch(addArticle(article)),
    wsConnect: () => dispatch(wsConnect()),
    wsOpenTestCanal: () => dispatch(wsOpenTestCanal()),
    wsSendTestMessage: payload => dispatch(wsSendTestMessage(payload))
  };
}


class ConnectedForm extends Component {
  constructor() {
    super();
    this.state = {
      title: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openWebSocketConnection = this.openWebSocketConnection.bind(this);
    this.openWebSocketTestChannel = this.openWebSocketTestChannel.bind(this);
    this.wsSendTestMessage = this.wsSendTestMessage.bind(this);
  }
  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    const { title } = this.state;
    const id = uuidv1();
    this.props.addArticle({ title, id });
    this.setState({ title: "" });
  }
  openWebSocketConnection() {
    this.props.wsConnect();
  }
  openWebSocketTestChannel() {
    this.props.wsOpenTestCanal();
  }
  wsSendTestMessage() {

    const { title } = this.state;
    this.props.wsSendTestMessage({ targetSessionId: title })
  }

  render() {
    const { title } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={this.handleChange}
          />
        </div>
        <button type="submit" className="btn btn-success btn-lg">
          SAVE
        </button>
        <button type="button" onClick={this.openWebSocketConnection} className="btn btn-warning btn-lg">
          RUN!
        </button>
        <button type="button" onClick={this.openWebSocketTestChannel} className="btn btn-danger btn-lg">
          OPEN_TEST_CANAL
        </button>
        <button type="button" onClick={this.wsSendTestMessage} className="btn btn-success btn-lg">
          SEND_TEST_MESSAGE
        </button>
      </form>
    );
  }
}
const Form = connect(null, mapDispatchToProps)(ConnectedForm);
export default Form;