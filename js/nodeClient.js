var socket = io.connect( 'http://localhost:8080' );

socket.on( 'message', function( data ) {
	ball.position = [data.position[0], data.position[1]+vall.marginLine];
    console.log(data.position);
	twoplayer.position = data.twoplayer;
});


var app; //создаем глобальную переменную нашей игры
var gravity = 4;
var figuresAmount = -1; //количество созданных фигур
var figure = []; //массив хранящий нашу фигуру
var startBallX = 300;
var startBallY = 300;
var curentPosX = 0;
var curentPosY = 0;
var agree = -30;
var mouselastX = 0;
var mouselastY = 0;
var speed = 1;


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

var model = {
    createCanvas: function() {
        app = new PIXI.Application(vall.width, vall.height); //создае холст
        document.body.appendChild(app.view); //выводим его в тело страницы
        this.drawLine();
        
    },
    drawLine: function(){
        var lineHeight = 4;
        var lengthline = 120;

        var line = new PIXI.Graphics();
        line.position.set( 0, vall.marginLine);
        line.lineStyle(lineHeight, 0xffffff).moveTo(0, 0).lineTo( lengthline, 0 );
        app.stage.addChild(line);

        var line2 = new PIXI.Graphics();
        line2.position.set( vall.width-lengthline, vall.marginLine );
        line2.lineStyle(lineHeight, 0xffffff).moveTo(0, 0).lineTo( lengthline, 0 );
        app.stage.addChild(line2);

        var line3 = new PIXI.Graphics();
        line3.position.set( 0, vall.height-vall.marginLine);
        line3.lineStyle(lineHeight, 0xffffff).moveTo(0, 0).lineTo( lengthline, 0 );
        app.stage.addChild(line3);

        var line4 = new PIXI.Graphics();
        line4.position.set( vall.width-lengthline, vall.height-vall.marginLine);
        line4.lineStyle(lineHeight, 0xffffff).moveTo(0, 0).lineTo( lengthline, 0 );
        app.stage.addChild(line4);
    },

    drawCircle: function(vec) {

        var circle = new PIXI.Graphics(); //создаем новый графический элемент
        circle.lineStyle(0); //начинаем рисовать
        circle.beginFill(0x000011, 1); //задаем рандомный цвет
        circle.drawCircle(vec[0], vec[1], ball.radius); //рисуем кружок, ведь он наш дружок
        circle.endFill(); //закончили отрисовку
        circle.interactive = true; //делаем круг интерактивным
        circle.buttonMode = true; //меняем курсор при наведении
        circle.live = true; //указываем что наш шарик жив и не пал жертвой выстрела
        //figuresAmount++;
        //circle.num = figuresAmount; //даем нашему кругу порядковый номер
        figure.push(circle); //обратиться на прямую к объекту circle мы не можем, поэтому отправляем его в массив
        app.stage.addChild(circle); //выводим круг на холсте
        circle.on('pointerdown', controller.clearFigure); //добавляем возможность при клике на фигуру удалить её
        return circle;
    },
    gameOver: function() {
        var style = new PIXI.TextStyle({ //стили для текста
            fill: '0xffffff',
            fontSize: 36,
        }); 
        var gameOverText = new PIXI.Text('Game Over', style); //собственно выводимый текст
        gameOverText.x = width / 2; //центрируем относительно экрана
        gameOverText.y = height / 2; //центрируем относительно экрана
        gameOverText.pivot.x = 50; //выравниваем по оси х
        gameOverText.pivot.y = 50; // выравниваем по оси y
        app.stage.addChild(gameOverText); //выводим на холсте
    }
}

var firstplayer = {
    mousePosition: [0, 0],
    lastPosition: [0, 0],
    lastSpeedValue: [0, 0],
    createPlayer: function() {    
      player = model.drawCircle(0, 0);
      player.mousemove = function(mouseData){
        firstplayer.mousePosition = [mouseData.data.originalEvent.x, mouseData.data.originalEvent.y];
        if(firstplayer.mousePosition[0]<ball.radius) firstplayer.mousePosition[0] = ball.radius;
        if(firstplayer.mousePosition[1]<vall.height/2+ball.radius) firstplayer.mousePosition[1] = vall.height/2+ball.radius;
        if(firstplayer.mousePosition[0]> vall.width-ball.radius) firstplayer.mousePosition[0] = vall.width-ball.radius;
        if(firstplayer.mousePosition[1]> vall.height-ball.radius-vall.marginLine) firstplayer.mousePosition[1] = vall.height-ball.radius-vall.marginLine;
        player.position.x = firstplayer.mousePosition[0];
        player.position.y = firstplayer.mousePosition[1];
        firstplayer.lastspeed();
        socket.emit( 'message', { position: [firstplayer.mousePosition[0], firstplayer.mousePosition[1]-vall.marginLine] } );
    }    
},
lastspeed: function() {
  this.lastSpeedValue = minusVector(this.lastPosition, this.mousePosition);
  this.lastPosition = this.mousePosition;

}
}

var twoplayer = {
	position: [0, 0],
    createPlayer: function() {    
      player2 = model.drawCircle(0, 0);
  },

  setposition: function() { 
   player2.position.x = this.position[0];
   player2.position.y = this.position[1];
}




}

// socket.on( 'message', function( data ) {
// 	console.log(data.position);
// 		twoplayer.position = data.positionplayer;
// 		twoplayer.setposition();
// 		ball.position = data.positionball;
// 		ball.setposition();
// 		});


var ball = {
    radius: 25,
    position: [200, 200],
    speed: [11, 11],
    acceleration: 0.999,
    createBall: function() {
        balls = model.drawCircle([0,0]);
    },
    setposition: function() {
    	balls.position.x = this.position[0];
        balls.position.y = this.position[1];
    }
} 




var view = {
    loadGame: function() {
        model.createCanvas();
        firstplayer.createPlayer();
        twoplayer.createPlayer();
        ball.createBall();

        app.ticker.add(function() { //постоянное обновление холста

            ball.setposition();
            twoplayer.setposition();
        });
    }
}
var vall = {
  width: 400,
  height: 640,
  marginLine: ball.radius*2,
}

var controller = {
    clearFigure: function() {
        this.clear();
        figure[this.num].live = false;

    } 
}


view.loadGame();