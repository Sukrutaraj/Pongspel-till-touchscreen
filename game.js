const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let paddleWidth = 15;
let paddleHeight;

let ballRadius = 10;

let paddle1Y;
let paddle2Y;

let ballX;
let ballY;

let ballDX;
let ballDY;

let ballSpeed;

let score1 = 0;
let score2 = 0;

let player1Name="Spelare 1";
let player2Name="Spelare 2";

let themeColor="#4ade80";

let gameRunning=false;

const pingSound=new Audio("sounds/pingpong.wav");
const missSound=new Audio("sounds/miss.wav");
const gameOverSound=new Audio("sounds/gameover.wav");


function startGame(){

player1Name=document.getElementById("p1name").value || "Spelare 1";
player2Name=document.getElementById("p2name").value || "Spelare 2";

const difficulty=document.getElementById("difficulty").value;

if(difficulty==="easy"){

paddleHeight=canvas.height*0.25;
ballSpeed=4;

}

else if(difficulty==="medium"){

paddleHeight=canvas.height*0.18;
ballSpeed=6;

}

else{

paddleHeight=canvas.height*0.12;
ballSpeed=8;

}

document.querySelectorAll(".colorBox").forEach(box=>{

box.addEventListener("click",()=>{

themeColor=box.dataset.color;

});

});

paddle1Y=canvas.height/2-paddleHeight/2;
paddle2Y=canvas.height/2-paddleHeight/2;

resetBall();

document.getElementById("startScreen").style.display="none";

gameRunning=true;

gameLoop();

}


function resetBall(){

ballX=canvas.width/2;
ballY=canvas.height/2;

ballDX=(Math.random()>0.5?1:-1)*ballSpeed;
ballDY=(Math.random()>0.5?1:-1)*ballSpeed;

}


function clampPaddles(){

if(paddle1Y<0)paddle1Y=0;

if(paddle1Y+paddleHeight>canvas.height)
paddle1Y=canvas.height-paddleHeight;

if(paddle2Y<0)paddle2Y=0;

if(paddle2Y+paddleHeight>canvas.height)
paddle2Y=canvas.height-paddleHeight;

}


function update(){

ballX+=ballDX;
ballY+=ballDY;

if(ballY+ballRadius>canvas.height || ballY-ballRadius<0){

ballDY*=-1;

}

if(ballX-ballRadius<paddleWidth && ballY>paddle1Y && ballY<paddle1Y+paddleHeight){

ballDX*=-1;
pingSound.play();

}

if(ballX+ballRadius>canvas.width-paddleWidth && ballY>paddle2Y && ballY<paddle2Y+paddleHeight){

ballDX*=-1;
pingSound.play();

}

if(ballX<0){

score2++;
missSound.play();
resetBall();

}

if(ballX>canvas.width){

score1++;
missSound.play();
resetBall();

}

if(score1===5 || score2===5){

gameRunning=false;

gameOverSound.play();

setTimeout(()=>{

location.reload();

},3000);

}

clampPaddles();

}


function drawRect(x,y,w,h,color){

ctx.fillStyle=color;
ctx.fillRect(x,y,w,h);

}


function drawBall(){

ctx.fillStyle=themeColor;

ctx.beginPath();
ctx.arc(ballX,ballY,ballRadius,0,Math.PI*2);
ctx.fill();

}


function drawText(text,x,y){

ctx.fillStyle="white";
ctx.font="28px Arial";

ctx.fillText(text,x,y);

}


function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

drawRect(0,paddle1Y,paddleWidth,paddleHeight,themeColor);
drawRect(canvas.width-paddleWidth,paddle2Y,paddleWidth,paddleHeight,themeColor);

drawBall();

drawText(player1Name+": "+score1,50,50);
drawText(player2Name+": "+score2,canvas.width-250,50);

}


function gameLoop(){

if(!gameRunning)return;

update();
draw();

requestAnimationFrame(gameLoop);

}


document.addEventListener("mousemove",(e)=>{

paddle1Y=e.clientY-paddleHeight/2;

});


document.addEventListener("keydown",(e)=>{

const speed=25;

if(e.key==="ArrowUp")paddle2Y-=speed;
if(e.key==="ArrowDown")paddle2Y+=speed;

});
