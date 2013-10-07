/**
 * Created with JetBrains WebStorm.
 * User: JBECKE15
 * Date: 9/19/13
 * Time: 5:41 PM
 * To change this template use File | Settings | File Templates.
 */

var c = document.getElementById("canvas");
var ctx=c.getContext("2d");
//ctx.fillStyle="#FF0000";
//ctx.fillRect(0,0,150,75);

/////////////
//Variables//
/////////////////////////////////////////////////////////////////////

//Fractal Background & Reveal
var backgroundImg = new Image();
var pixelArray = createArray(720,480);
backgroundImg.src = "background.png";

//Timer/Phase Ending
var endManic = false;
var startTime = 60;
var cTime = startTime;
//var lastTime;

//Player
var playerImg = new Image();
playerImg.src = "square.png";
var playerwidth = playerImg.clientWidth;
var playerheight = playerImg.clientHeight;
var posX = 360-32;
var posY = 240;
var rightKeyDown = false;
var leftKeyDown = false;
var upKeyDown = false;
var playerSpeed = 0;
var maxPlayerSpeed = 6;
var upSpeed = 0;
var gravity = 5;
var velocity = 0;
var tempVel = 0;
var tempPos = 0;
var standstill = false;
var acceleration = gravity/27;
var jumpStrength = 8.5;
var friction = 1;
var gameOver = false;

//Platforms
var platformGravity = 0;
var platformImg = new Image();
platformImg.src = "platform.png";
var plX = 720 - 64;
var plY = 360;
var platwidth = 96;
var platheight = 32;
var offset = 80;
var gravcheck = 0;

//Person
var personImg = new Image();
personImg.src = "person.png";
var personCounter = 6;
function platform(x, y)
{
    this.plx = x;
    this.ply = y;
    this.personCheck = false;

    this.setpos = function(a, b)
    {
        this.plx = a;
        this.ply = b;
    }
    this.sety = function(l)
    {
        this.ply = l;
    }
    this.smash = function()
    {
        if(gameOver == false)
        {
        if(this.plx > 360)
        {
        this.setpos((360 * Math.random()), -offset);
        }
        else if(this.plx < 360)
        {

            this.setpos(((360 * (1 + Math.random())) -96), -offset);          //96= width
        }
        offset += 80;
        personCounter--;
        }
        else
        {
            this.setpos(-96, -32);
        }
        if(person1.broken == 1)
        {

            if(this.personCheck == true)
            {
                this.personCheck = false;
                person1.broken = 0;
                //alert("HIT");
            }
        }
        if(personCounter <= 0)
        {

             if(person1.broken == 2)
            {
                person1.persx = this.plx;
                person1.persy = this.ply;
                this.personCheck = true;
                person1.broken = 1;
                personCounter = 6;
            }
        }

    }
    this.collision = function()
    {
        //check for collision between player and platform


        if(((posX < (this.plx +96)) && (posX > this.plx)) || (((posX+32) < (this.plx +96)) && ((posX +32) > this.plx)))
        {

            if(((posY+32) < (this.ply + 32)) && ((posY+32) > (this.ply)))
            {
                if(velocity >= 0)
                {
                    if(standstill == false)
                    {

                        upSpeed+= jumpStrength * 1.1;
                        velocity = -upSpeed;
                        this.smash();
                    }
                }
            }
        }

    }
}
//Establishes the person "class"
function person(x,y,num)
{
    this.persx = x;
    this.persy = y;
    this.speed = 3;
    this.broken = num;
    this.fall = function()
    {
        //this.broken = 0;

        if(this.persy <=480)
        {
            this.speed ++;
            this.persy += this.speed;
        }
        else
        {
            this.broken = 2;
            this.speed = 3;

        }

    }
}
//Create all the platforms
var p1 = new platform(400, 270);
var p2 = new platform(100, 100);
var p3 = new platform(600, 410);
var p4 = new platform(3, 350);
var p5 = new platform(500, 50);

//Create the person
var person1 = new person(-200, 500, 2);

//Debug
ctx.font = "32px Verdana";

//Setup
var Game = {};
Game.fps = 60;

document.onkeydown = keyDownListener;
document.onkeyup = keyUpListener;

//End Variables
////////////////////////////////////////////////////////////////

//Runs once per second.
Game.timerTick = function()
{
    cTime--;

    if(cTime < 0)
    {
        //Transition to depression phase.

        gameOver = true;
        //When transition is done set the following variables below.
        //cTime = startTime;

    }
}

//Runs once per frame
Game.run = function()
{
    Game.update();
    Game.draw();
}

Game.draw = function()
{
    if(endManic)
    {
        setTimeout( ctx.clearRect(0,0,720,480), 1000);
    }
    else
    {
        ctx.clearRect(0,0,720,480);
        ctx.drawImage(backgroundImg,0,0);
        //Cover background image here. This is really inefficient, needs to change later.
    //    for(var x = 0; x < 720; x+=10)
      //  {
       //     for(var y = 0; y < 480; y+=10)
         //   {
        //        ctx.clearRect(x,y,10,10);
        //    }
      //  }
        ctx.drawImage(platformImg, p1.plx, p1.ply); // draw platform 1
        ctx.drawImage(platformImg, p2.plx, p2.ply); // draw platform 2
        ctx.drawImage(platformImg, p3.plx, p3.ply); // draw platform 3
        ctx.drawImage(platformImg, p4.plx, p4.ply); // draw platform 4
        ctx.drawImage(platformImg, p5.plx, p5.ply); // draw platform 5
        ctx.drawImage(personImg, person1.persx, person1.persy); // draw person1
        ctx.drawImage(playerImg,posX,posY);

        ctx.fillText((cTime).toString(),360 - 15,50);


    }
}

Game.update = function()
{
    //Fractal Background Image Reveal
 //   var backgroundImageData = backgroundImg.getImageData(0, 0, backgroundImg.width, backgroundImg.height);
  //  for(var i = 0, n = backgroundImageData.length; i < n; i += 4)
  //  {
  //      backgroundImageData[i + 3] = 255;//Alpha
  //  }
 //   backgroundImg.putImageData(backgroundImageData,0,0,backgroundImg.width, backgroundImg.height);

    //Player movement stuff
    if(posX + playerSpeed * friction < 720 - playerImg.width)
    {
        if(posX + playerSpeed * friction > 0)
        {
            posX += playerSpeed * friction;
        }
        else
        {
            posX = 0;
        }
    }
    else
    {
        posX = 720 - playerImg.width;
    }
    if(posY >= 480)
    {
        if(gameOver == false)
        {
            upSpeed += jumpStrength * 1.25;
            velocity = -upSpeed;
            //platformGravity = 4;
            gravcheck = 30;
        }
        else
        {
            endManic = true;
        }
    }

    if(posY <= 120)
    {
        //gravity = 6;

            if(standstill == false)
            {
                tempVel = velocity;
                tempPos = posY;
                standstill = true;
            }
            velocity = 0;
            posY = 120;
            tempVel = tempVel + acceleration;
            tempPos = tempPos + tempVel - upSpeed;
        upSpeed --;
            if(tempVel > 0)
            {
                velocity = tempVel;
                //posY = tempPos;
                posY += velocity - upSpeed;
                standstill = false;
            }
        if(standstill == true)
        {

                platformGravity = -tempVel * 2;


        }
    }
    else
    {
        velocity = velocity + acceleration;
        posY += velocity - upSpeed;                                             //!!!!
        upSpeed--;
        //gravity = 2
             if(gravcheck > 0)
             {
            platformGravity = - velocity;
             }
        else
             {
                 platformGravity = 0;
             }
        gravcheck --;

    }

    if(upSpeed < 0)
    {
        upSpeed = 0;
    }
    p1.collision(posX, posY);
    p2.collision(posX, posY);
    p3.collision(posX, posY);
    p4.collision(posX, posY);
    p5.collision(posX, posY);
    if(p1.ply > 480)
    {
        p1.smash();
    }
    if(p2.ply > 480)
    {
        p2.smash();
    }
    if(p3.ply > 480)
    {
        p3.smash();
    }
    if(p4.ply > 480)
    {
        p4.smash();
    }
    if(p5.ply > 480)
    {
        p5.smash();
    }
    if(platformGravity > 0)
    {
        p1.sety(p1.ply + platformGravity);
        p2.sety(p2.ply + platformGravity);
        p3.sety(p3.ply + platformGravity);
        p4.sety(p4.ply + platformGravity);
        p5.sety(p5.ply + platformGravity);
        if(person1.broken == 1)
        {
            person1.persy += platformGravity;
            if(person1.persy >= 480)
            {
                person1.broken = 2;
            }
        }

        if( offset > 80)
        {
            offset -= platformGravity;
        }
    }
    if(person1.broken == 0)
    {
        person1.fall();
    }

    if(endManic)
    {
        //ends game loop so that depressive phase can take over.
        //Be sure to play transition before doing this.
        setTimeout( clearInterval(Game._intervalId), 1000);
    }

}




function keyDownListener(e)
{
    //w and up
    if(e.keyCode == 87 || e.keyCode == 38)
    {
        //this is solely for testing jumping since we lack platforms currently.
        upSpeed += jumpStrength;
        velocity = -upSpeed;
        upKeyDown = true;
    }
    //d and right
    if((e.keyCode == 68 || e.keyCode == 39))
    {
        rightKeyDown = true;
        if(playerSpeed < 0)
        {
            playerSpeed = maxPlayerSpeed
           // playerSpeed ++;
        }
        else
        {
            playerSpeed = maxPlayerSpeed;
        }
        if(playerSpeed > maxPlayerSpeed)
        {
            playerSpeed = maxPlayerSpeed;
        }
    }
    //a and left
    else if((e.keyCode == 65 || e.keyCode == 37))
    {
        leftKeyDown = true;
        if(playerSpeed > 0)
        {
            playerSpeed = -maxPlayerSpeed;
            //playerSpeed --;
        }
        else
        {
            playerSpeed = -maxPlayerSpeed;
        }
        if(playerSpeed < -maxPlayerSpeed)
        {
            playerSpeed = -maxPlayerSpeed;
        }
    }
}

function keyUpListener(e)
{
    //w and up
    if(e.keyCode == 87 || 38)
    {
        upKeyDown = false;
    }
    //d and right
    if((e.keyCode == 68 || e.keyCode == 39))
    {
       rightKeyDown = false;
    }
    //a and left
    else if((e.keyCode == 65 || e.keyCode == 37))
    {
       leftKeyDown = false;
    }
}

//easy multidimensional array creation for pixelArray
function createArray(length)
{
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1)
    {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

Game._intervalId = setInterval(Game.run,1000/Game.fps);
Game._timerIntervalId = setInterval(Game.timerTick, 1000);
