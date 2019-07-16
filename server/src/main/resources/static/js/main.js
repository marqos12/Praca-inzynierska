'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');
var button = document.querySelector('#button');
var text1 = document.querySelector('#text1');
var text2 = document.querySelector('#text2');
var myBtn2 = document.querySelector('#myBtn2');
var myBtn3 = document.querySelector('#myBtn3');


var stompClient = null;
var username = null;
var password = null;
var sessionID = null;
var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(event) {
    username = document.querySelector('#name').value.trim();
    password = document.querySelector('#password').value.trim();
	event.preventDefault();
    
	console.log("hmmhmmhmm");
    	/*fetch("http://localhost:8080/api/auth/signin",{
	        method: 'POST', 
	        headers: {
	            'Content-Type': 'application/json',
	        },
	        body: JSON.stringify({username:"username",password:"asdasd"}), 
	    })
	    .then(response => response.json()).then(response=>{
	    	console.log(response);*/

				    var socket = new SockJS('/greeting'); 
				    stompClient = Stomp.over(socket);
				     sessionID = "";
				     stompClient.connect({}, function (frame) {
				    	 
					     var url = stompClient.ws._transport.url;
					        url = url.split("/")
					        console.log("Your current session is: " + url[url.length-2]);
					        sessionID = url[url.length-2];
					     
					     const subscription = stompClient.subscribe("/user/"+sessionID+"/reply", function (x) {
				    	//const subscription = stompClient.subscribe("/user/queue/msg", function (x) {    	
				    		 console.log(x);
				    	 });
					     /*stompClient.subscribe('/user/reply', x=>{
					    	 console.log(x)
					     });*/
					     
				     });
	    //}).catch(x=>console.log(x));
    	
    	
    	
}


function onConnected() {

    stompClient.subscribe('/topic/public', onMessageReceived);
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )

    connectingElement.classList.add('hidden');
}


function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}

function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}

function sendMessage2(event) {
	var chatMessage = {
            to: document.querySelector('#name').value.trim(),
            from: sessionID,
            text: 'CHAT'
        };

	stompClient.send("/app/message3", {}, JSON.stringify(chatMessage));

    event.preventDefault();
}/*
function sendMessage3(event) {
	var chatMessage = {
            to: username,
            from: sessionID,
            text: 'CHAT'
        };

	console.log(chatMessage)
	stompClient.send("/app/message2", {}, chatMessage);

    event.preventDefault();
}
function sendMessage4(event) {
	var chatMessage = {
            to: username,
            from: sessionID,
            text: 'CHAT'
        };
	console.log(chatMessage)
	stompClient.send("/app/test2", {}, "Hello, STOMP");

    event.preventDefault();
}
*/
function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', sendMessage, true)
document.getElementById("myBtn").addEventListener("click", sendMessage2);/*
document.getElementById("myBtn2").addEventListener("click", sendMessage3);
document.getElementById("myBtn3").addEventListener("click", sendMessage4);*/

/*
'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');
var button = document.querySelector('#button');

var stompClient = null;
var username = null;
var password = null;
var sessionID = null;
var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(event) {
    username = document.querySelector('#name').value.trim();
    password = document.querySelector('#password').value.trim();

	    event.preventDefault();
	    
    /*fetch('/api/auth/signup',{method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name: username, username: username, email:username+'@gmail.com',role:["user"], password:password}), 
    }).then(response => response.json()).then(response=>{
	    console.log(response);
	    fetch('/api/auth/signin',{method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username: username, password:password})})
	    .then(auth => auth.json()).then(auth=>{
		    console.log(auth);
		
		    if(username) {
		        usernamePage.classList.add('hidden');
		        chatPage.classList.remove('hidden');
		
		        var socket = new SockJS('/game?accessToken=' + auth.accessToken);
		        stompClient = Stomp.over(socket);
		
		        stompClient.connect({}, onConnected, onError);
		    }
	    })
    }).catch(e=>{console.log(e)});*/
	    
	    //fetch('/api/auth/signin',{method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username: username, password:password})})
	    //.then(auth => auth.json()).then(auth=>{
	/*		    var socket = new SockJS('/greeting'); 
			    stompClient = Stomp.over(socket);
			     sessionID = "";
			     
			        
			     stompClient.connect({}, function (frame) {
			    	 /*
				     var url = stompClient.ws._transport.url;
				        url = url.split("/")
				        console.log("Your current session is: " + url[url.length-2]);
				        sessionID = url[url.length-2];
			    	 
				        stompClient.subscribe('/user/queue/reply', function (greeting) {
				        		//showGreeting(JSON.parse(greeting.body).name);
				        	console.log("janek" ,greeting);
				        });
				        stompClient.subscribe('/user/queue/errors', function (greeting) {
				        	//showGreeting(JSON.parse(greeting.body).name);
				        	console.log("danek",greeting);
				        });
				        */
	/*		    	 const subscription = client.subscribe("/user/queue/msg", function (x) {
			    		 console.log(x);
			    	 });
			     });
	    //})
	     
	     
	    /*stompClient.connect({}, function (frame) {
	        var url = stompClient.ws._transport.url;
	        url = url.split("/")
	        
	        console.log("Your current session is: " + url[url.length-2]);
	        sessionID = url[url.length-2];
	        stompClient.subscribe('/user/queue/user',function (frame){
	        		  //+ '-user' 
	        		  //+ sessionID, function (msgOut) {
	        		     //handle messages

  			  console.log("joj");
	        		})
	        		
	        		 stompClient.subscribe('/user/queue/reply-'+sessionID,function (frame){
	        		  //+ '-user' 
	        		  //+ sessionID, function (msgOut) {
	        		     //handle messages

  			  console.log("joj2");
	        		})
	    })*/
  /*  
}


function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);

    // Tell your username to the server
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )

    connectingElement.classList.add('hidden');
}


function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}


function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}


function sendMessage2(event) {
	var chatMessage = {
            to: username,
            from: sessionID,
            text: 'CHAT'
        };
		 //stompClient.send("/app/message2", {}, JSON.stringify(chatMessage));

    client.send("/app/test2", {}, "Hello, STOMP");
    //var messageContent = messageInput.value.trim();
	/*
        
        console.log(chatMessage)
        stompClient.send("/app/secured/room", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    *//*
    event.preventDefault();
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', sendMessage, true)
document.getElementById("myBtn").addEventListener("click", sendMessage2);
*/