var socket = require( 'socket.io' );
var express = require( 'express' );
var http = require( 'http' );

var app = express();
var server = http.createServer( app );

var io = socket.listen( server );

var rooms = [];

function newConnection(client) {
	var flag = true;
	var key = 0;
	for(key in rooms){
		var count = 0;
		for(var player in rooms[key]){
			count++;
		}
		if(count<3 && flag){
			if(!rooms[key].firstplayer){
				rooms[key].firstplayer = {
					id: client.id,
					position: [0,0],
					lastposition: [0,0]
				};
			};
			if(!rooms[key].twoplayer){
				rooms[key].twoplayer = {
					id: client.id,
					position: [0,0],
					lastposition: [0,0]
				};
			};
			client.join(key);
			flag = false;
		}
	}

	
	if(flag){
		key++;
		rooms[key] = [];	
		rooms[key].ball = {
			position: [200, 200],
			speed: [1, 1],
			status: false
		}
		rooms[key].firstplayer = {
			id: client.id,
			position: [0,0],
			lastposition: [0,0]
		}
		client.join(key);
	};
}

function disconnection(client) {
	console.log("user disconnect - " + client.id);
	for(var key in rooms){
		var count = 0;
		for(var player in rooms[key]){
			if(rooms[key][player].id == client.id){
				delete rooms[key][player];
				rooms[key].ball = {
					position: [200, 200],
					speed: [1, 1]
				}
			} else {
				count++;
			}
		}
		if(count<2){
			delete rooms[key];
		}
	};
}

io.sockets.on( 'connection', function( client ) {
	console.log( "New client !" );
	
	newConnection(client);
	
	client.on('disconnect', function () {
		disconnection(client);
	});

	client.on( 'message', function( data ) {


		


		for(var key in rooms){
			for(var player in rooms[key]){
				if(rooms[key][player].id == client.id){
					rooms[key][player].position = data.position;
					if(player == 'twoplayer'){
						rooms[key][player].position = minusVector([vall.width, vall.height], rooms[key][player].position);
					}
					
					var lastSpeedValue = minusVector(rooms[key][player].position, rooms[key][player].lastposition);
					rooms[key][player].lastposition = rooms[key][player].position;
					
					var checkPlayer = distanceTwoVector(rooms[key].ball.position, rooms[key][player].position);

					if (checkPlayer<ball.radius*2){
						if(Math.abs(rooms[key].ball.speed[0]) < 70 && Math.abs(rooms[key].ball.speed[1] < 70))
						rooms[key].ball.speed = plusVector(lastSpeedValue, rooms[key].ball.speed);
						rooms[key].ball.speed = angleReflextion(rooms[key].ball.speed, minusVector(rooms[key].ball.position, rooms[key][player].position));
						var pos = minusVector(rooms[key].ball.position, rooms[key][player].position);
						var cut = Math.atan(pos[0]/pos[1]);
						var k = ball.radius*2 - checkPlayer;
						var newvec = [Math.sin(cut)*k, Math.cos(cut)*k];
						if(pos[1]<0){
							rooms[key].ball.position = minusVector(rooms[key].ball.position, newvec);
						}
						else {
							rooms[key].ball.position = plusVector(rooms[key].ball.position, newvec);
						}
					}
				}
			}
		};
		// console.log("--------------------------------------------------------");
		// for(var key in rooms){
		// 	for(var player in rooms[key]){
		// 		console.log(player + "--" + rooms[key][player].position);
		// 	}
		// 	console.log("||"+key+"||");
		// }
		// console.log(rooms);
		// console.log(client.manager.rooms);
		
		

		// ball.move(data.position);
		// client.broadcast.emit( 'message', { positionplayer: player } );
		// io.sockets.emit( 'message', { name: data.name, message: data.message } );
	});
	
});


setInterval(function(){
	for(var key in rooms){
		if(rooms[key].twoplayer && rooms[key].firstplayer){
			if(rooms[key].ball.status){
				var result = moveBall(rooms[key].ball, rooms[key].firstplayer.position, rooms[key].twoplayer.position, key);
				rooms[key].ball.position = result[0];
				rooms[key].ball.speed = result[1];
				var miraclefirst = minusVector([vall.width, vall.height], rooms[key].firstplayer.position);
				var miracleball = minusVector([vall.width, vall.height], rooms[key].ball.position);
				io.sockets.sockets[rooms[key].firstplayer.id].emit('message', {position: rooms[key].ball.position, twoplayer: rooms[key].twoplayer.position});
				io.sockets.sockets[rooms[key].twoplayer.id].emit('message', {position: miracleball, twoplayer: miraclefirst});
			} else {
				startTimer(key);
			};
		};
	};
}, 20);

function startTimer(room){
	setTimeout(function(){
		rooms[room].ball.status = true;
	}, 3000)
}

function moveBall(ballstatus, first, two, key){
	var result = [ballstatus.position, ballstatus.speed];
	var checkVall = vall.checkAboard(plusVector(ballstatus.position, ballstatus.speed), key);
	var checkPlayer = distanceTwoVector(ballstatus.position, first);
	var checkPlayertwo = distanceTwoVector(ballstatus.position, two);
	if (checkVall)
		result[1] = angleReflextion(ballstatus.speed, checkVall);
	if (checkPlayer<ball.radius*2){
		result[1] = angleReflextion(ballstatus.speed, minusVector(ballstatus.position, first));
	}	
	if (checkPlayertwo<ball.radius*2){
		result[1] = angleReflextion(ballstatus.speed, minusVector(ballstatus.position, two));
	}	
	result[0] = plusVector(ballstatus.position, result[1]);
	return result;
}

var ball = {
	radius: 25
} 



var vall = {
	width: 400,
	height: 540,
	checkAboard: function(vec, key) {
		if(vec[1] < -ball.radius || vec[1] > this.height + 3*ball.radius){
			rooms[key].ball.status = false;
		}
		if(vec[0] + ball.radius > this.width){
			rooms[key].ball.position = [this.width-ball.radius, vec[1]];
			return [this.width, 0];
		}
		if(vec[0] < ball.radius){
			rooms[key].ball.position = [ball.radius, vec[1]];
			return [-this.width, 0];
		}
		if(vec[1] + ball.radius > this.height && (vec[0] < 120 || vec[0] > this.width - 120)){
			rooms[key].ball.position = [vec[0], this.height-ball.radius];
			return [0, this.height];
		}
		if(vec[1] < ball.radius && (vec[0] < 120 || vec[0] > this.width - 120)){
			rooms[key].ball.position = [vec[0], ball.radius];
			return [0, -this.height];
		}
	}
}




function plusVector(vec1, vec2){
	return [vec1[0]+vec2[0], vec1[1]+vec2[1]];
}

function minusVector(vec1, vec2){
	return [vec1[0]-vec2[0], vec1[1]-vec2[1]];
}

function lengthVector(vec){
	return Math.sqrt(Math.pow(vec[0],2)+Math.pow(vec[1],2));
}
function distanceTwoVector(vec1, vec2){
	return lengthVector(minusVector(vec1, vec2));
}
function multiplexVector(vec1, vec2){
	return vec1[0]*vec2[0]+vec1[1]*vec2[1];
}
function multiplexVectorConstant(vec, constant){
	return [vec[0]*constant, vec[1]*constant];
}
function angleReflextion(vec, normal){
	return minusVector(vec, multiplexVectorConstant(multiplexVectorConstant(normal, multiplexVector(vec, normal)/multiplexVector(normal,normal)),2));
}
function return90Vector(vec){
	return [-vec[1], vec[0]];
}
function return180Vector(vec){
	return multiplexVectorConstant(vec, -1);
}


server.listen( 8080 );