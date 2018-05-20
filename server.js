const WebSocket = require('ws');
const Discord = require('discord.js');
const discord = new Discord.Client();
const server = new WebSocket.Server({port:3000});
voiceChanel = ["447550335637258240", "447550383250735125", "447550415970631700", "447550432911556639","447550448241606666"];
discord.on('ready', () => {
	console.log(`Logged in as ${discord.user.tag}!`);
});

discord.on('message', msg => {

	// console.log(msg.member.setVoiceChannel);
	// client..fetchUser('136192692286783488')
	
});
discord.login('NDQ3NTIzNDczNzg3NDUzNDYw.DeI0jA.prPNFTt2CwOu3DUfASe2qwxW2FE');



players = [];
server.on('connection',ws=>{
	ws.on('message',message=>{
		console.log(players);
		server.clients.forEach(client =>{
			let data = JSON.parse(message);
			switch (data.type) {
				case "connect":
					var msg = {
						type: "synchronize",
						players: players
					};
					ws.send(JSON.stringify(msg));
					break;
				case "create":
					console.log(message);
					data = JSON.parse(message);
					player = {
						nick: data.nick,
						position: 12
					};
					players.push(player);
					var msg = {
						type: "synchronize",
						players: players
					};
					ws.send(JSON.stringify(msg));
					break;
				case "move":
					players.forEach(player => {
						if (player.nick==data.nick) {
							player.position = data.position
						}
					});
					let member = discord.channels.get('262298597423448064').members.get('136192692286783488');
					member.setVoiceChannel(voiceChanel[data.position]);
					var msg = {
						type: "synchronize",
						players: players
					};
					ws.send(JSON.stringify(msg));
					break;
				default:
					console.log(message);
					client.send(message);
					break;
			}
		});
	});
});