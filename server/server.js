const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('new user connection');

	socket.emit('newMessage', {
		from: 'Admin',
		text: 'Welcome to the chat app',
		createAt: new Date().getTime()	
	});

	socket.broadcast.emit('newMessage', {
		from: 'Admin',
		text: 'New user joined',
		createAt: new Date().getTime()
	});

	// test github 
	socket.on('createMessage', (message) => { 
		console.log('createMessage', message);

		// send to all 
		io.emit('newMessage', {
			from: message.from,
			text: message.text,
			createAt: new Date().getTime()
		});

		//only receive from other connection/users
		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createAt: new Date().getTime()
		// });
	});



	socket.on('disconnect', () => {
			console.log('User was disconnected!');
		});	
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
})