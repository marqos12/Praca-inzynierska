import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import { wsConnect, wsOpenTestCanal, wsSendTestMessage, wsSendMessage, setHistory, logout } from "../../actions/index";

function mapDispatchToProps(dispatch) {
    return {
        wsSendMessage:payload=>dispatch(wsSendMessage(payload))
    };
}

const mapStateToProps = state => {
    return {
        chats: state.chats,
        auth:state.auth
    };
};



class GlobalChatComponent extends Component {
    constructor() {
        super();
        this.state = {
            message:"",
            expanded:true,
            newMessages:false,
            messageCount:0,
        }
        this.scrollPos=this.scrollPos.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.sendMessage=this.sendMessage.bind(this);
        this.toggle=this.toggle.bind(this);
    }

    componentDidUpdate() {
        var objDiv = document.getElementById("messageList");
        if(objDiv) objDiv.scrollTop = objDiv.scrollHeight;
        if(this.state.messageCount!=this.props.chats.globalChatMessages.length){
            if(!this.state.expanded)this.setState({newMessages:true})
            else this.setState({newMessages:false})
            this.setState({messageCount:this.props.chats.globalChatMessages.length})
        }
        
    }
     hashCode(str) { 
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
           hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    } 
    
     intToRGB(i){
        var c = (i & 0xFFFFFF)
            .toString(16)
            .toUpperCase();
    
        return "#"+"00000".substring(0, 6 - c.length) + c;
    }
    getUserColor(user){
        return this.intToRGB(this.hashCode(user));
    }
    scrollPos(){
      
    }
    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
       
    }

    sendMessage(){
        if(this.state.message.trim())
        this.props.wsSendMessage({ channel: "/chat/global", payload: { user:this.props.auth.user, message:this.state.message.trim() } })
        this.setState({message:""})
    }

    toggle(){
        this.setState({expanded:!this.state.expanded});
    }
    render() {
        const { globalChatMessages } = this.props.chats;
        const{message,expanded,newMessages}=this.state;
        return (
            <div className="chat">

                <div className="head" onClick={this.toggle}>
                    <h3>Czat globalny</h3>
                    <img src="assets/chat.png" />
                    {newMessages?<img src="assets/achtung.gif" />:""}
                </div>
                {expanded?<div className="expanded">
                    <div className="messages" id="messageList" onScroll={this.scrollPos}>
                        {globalChatMessages.map((message, index) => {
                            return <div key={index} className="message">
                                <p className="author"><span style={{color:this.getUserColor(message.user.username)}}>{message.user.username}</span> {message.time} </p>
                                <p className="content">{message.message}  </p>
                            </div>
                        })}
                    </div>
                    <div className="messageinput">
                        <textarea className="textarea messageInput" rows="2"placeholder="Wpisz coś..."  id="message" value={message} onChange={this.handleChange}></textarea>
                       
                    <img src="assets/send.png" onClick={this.sendMessage} />
                    </div>
                </div>:""}
            </div>
        );
    }
}
const GllobalChat = connect(mapStateToProps, mapDispatchToProps)(GlobalChatComponent);
export default GllobalChat;