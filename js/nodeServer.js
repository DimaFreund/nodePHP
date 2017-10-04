var socket = require( 'socket.io' );
var express = require( 'express' );
var http = require( 'http' );

var app = express();
var server = http.createServer( app );

var io = socket.listen( server );

var rooms = [[]];

io.sockets.on( 'connection', function( client ) {
	console.log( "New client !" );
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

	
	client.on('disconnect', function () {
    console.log("user disconnect - " + client.id)
    rooms.forEach(function(clients, room){
		if(clients[0] == client.id){
			clients.splice(clients.indexOf(1), 1);
			if(clients.length == 0){
			console.log("emply!!!!");
			rooms.splice(rooms.indexOf(room+1), 1);
		}
			return;
		} 
		if(clients[1] == client.id){
			clients.splice(clients.indexOf(2), 1);
			if(clients.length == 0){
			console.log("emply!!!!");
			rooms.splice(rooms.indexOf(room+1), 1);
		}
			return;
		}

		
		
	});
  });

	client.on( 'message', function( data ) {
		for(var i = 0; i < rooms.length; i++){
			for(var y = 0; y < rooms[i].length; y++){
				console.log(rooms[i][y] + "--");
			}
			console.log("||||");
		}
		console.log("==================" + rooms + "=================")
	
		// ball.move(data.position);
		// client.broadcast.emit( 'message', { positionplayer: player } );
		// io.sockets.emit( 'message', { name: data.name, message: data.message } );
	});
});


// var ball = {
//     radius: 60,
//     position: [200, 200],
//     speed: [11, 11],
//     acceleration: 0.999,
    
//     positionvector: function(){
//         this.speedvector();
//         this.position = plusVector(this.position, this.speed);
//     },
//     speedvector: function(){
//         this.speed = multiplexVectorConstant(this.speed, this.acceleration);
//     },
//     move: function(playerPos){
//       var checkVall = vall.checkAboard(this.position);
//       var checkPlayer = distanceTwoVector(this.position, playerPos);
//       if (checkVall)
//         this.speed = angleReflextion(this.speed, checkVall);
//       if (checkPlayer<this.radius*2){
//         this.speed = angleReflextion(this.speed, minusVector(ball.position, playerPos));
        
//       }

      
//       checkPlayer = distanceTwoVector(this.position, playerPos);
//       while(checkPlayer<this.radius*2){
//         checkPlayer = distanceTwoVector(this.position, playerPos);
//         this.positionvector();
//       }
//       ball.positionvector();
//     }
    
// } 



// var vall = {
//       width: 600,
//       height: 800,
//     checkAboard: function(vec) {
//       if(vec[0] + ball.radius > this.width)
//         return [this.width, 0];
//       if(vec[0] < ball.radius)
//         return [-this.width, 0];
//       if(vec[1] + ball.radius > this.height)
//         return [0, this.height];
//       if(vec[1] < ball.radius)
//         return [0, -this.height];
//     }
// }




// function plusVector(vec1, vec2){
//   return [vec1[0]+vec2[0], vec1[1]+vec2[1]];
// }

// function minusVector(vec1, vec2){
//   return [vec1[0]-vec2[0], vec1[1]-vec2[1]];
// }

// function lengthVector(vec){
//   return Math.sqrt(Math.pow(vec[0],2)+Math.pow(vec[1],2));
// }
// function distanceTwoVector(vec1, vec2){
//   return lengthVector(minusVector(vec1, vec2));
// }
// function multiplexVector(vec1, vec2){
//   return vec1[0]*vec2[0]+vec1[1]*vec2[1];
// }
// function multiplexVectorConstant(vec, constant){
//   return [vec[0]*constant, vec[1]*constant];
// }
// function angleReflextion(vec, normal){
//   return minusVector(vec, multiplexVectorConstant(multiplexVectorConstant(normal, multiplexVector(vec, normal)/multiplexVector(normal,normal)),2));
// }
// function return90Vector(vec){
//   return [-vec[1], vec[0]];
// }
// function return180Vector(vec){
//   return multiplexVectorConstant(vec, -1);
// }


server.listen( 8080 );