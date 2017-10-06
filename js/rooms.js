var rooms = [[]];





module.exports = {
	newConnection: function(client){
		var flag = true;
		rooms.forEach(function(clients, room){
			if(clients.length<2 && flag){
				clients.push(client.id);
				client.join(room+1);
				flag = false;
			} 
		});
		if(flag){
			rooms.push([client.id]);
			client.join(rooms.length);
		};
	},
 

};

