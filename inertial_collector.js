// SVG document
var doc = null;

// SVG namespace
var SVG_NS = 'http://www.w3.org/2000/svg';

// XLink namespace
var XLINK_NS = "http://www.w3.org/1999/xlink";

// Random background seed
var SEED = 25;

// Key codes
LEFT_ARROW_KC = 37;
RIGHT_ARROW_KC = 39;
UP_ARROW_KC = 38;
DOWN_ARROW_KC = 40;
SPACE_KC = 32;

//
// StarBackground class
//

// Update the stars based on the current visibible window
StarBackground.prototype.update = function(left, top, right, bottom)
{
	// FIXME: Implement
}

// Star background constructor
function StarBackground(seed)
{
	// Saves the random seed
	this.seed = seed;
}

//
// SpaceShip class
//

// Spaceship dimensions
SpaceShip.prototype.WIDTH = 20.0;
SpaceShip.prototype.HEIGHT = 20.0;

// Spaceship step
SpaceShip.prototype.step = function(dt)
{
	thetaPrime = 0.0;
	if (this.rotateLeft)
	{
		thetaPrime -= 50.0;
	}
	if (this.rotateRight)
	{
		thetaPrime += 50.0;
	}
	
	accel = 0.0;
	if (this.forwardThrust)
	{
		accel += 50.0;
	}
	if (this.reverseThrust)
	{
		accel -= 25.0;
	}
	
	ax = accel * Math.cos(this.theta * Math.PI / 180.0);
	ay = accel * Math.sin(this.theta * Math.PI / 180.0);
	
	this.vx += ax * dt;
	this.vy += ay * dt;
	this.x += this.vx * dt;
	this.y += this.vy * dt;
	this.theta += thetaPrime * dt;
	this.group.setAttribute('transform', 'translate(' + this.x + ',' + this.y +
		') ' + 'rotate(' + this.theta + ',10,10) ');
}

// Spaceship constructor
function SpaceShip(world, x, y, theta, vx, vy, fuel)
{
	// Makes the rectangle that temporarily represents the spaceship
	u = doc.createElementNS(SVG_NS, 'use');
	u.setAttribute('x', 0);
	u.setAttribute('y', 0);
	u.setAttribute('width', this.WIDTH);
	u.setAttribute('height', this.HEIGHT);
	u.setAttributeNS(XLINK_NS, 'href', '#spaceShip');
	
	// Makes the group representing the spaceship
	g = doc.createElementNS(SVG_NS, 'g');
	g.setAttribute('transform', 'translate(100,100)');
	g.appendChild(u);
	world.root.appendChild(g);
	
	// Saves attributes
	this.world = world;
	this.x = x;
	this.y = y;
	this.theta = theta;
	this.vx = vx;
	this.vy = vy;
	this.fuel = fuel;
	this.group = g;
	this.rotateLeft = this.rotateRight = false;
	this.forwardThrust = this.reverseThrust = false;
}

//
// World class
//

// Does a time step of the world
World.prototype.step = function(dt)
{
	this.playerSS.step(dt);
}

// World key down events handler
World.prototype.onKeyDown = function(evt)
{
	if (evt.keyCode == LEFT_ARROW_KC)
	{
		this.playerSS.rotateLeft = true;
	}
	else if (evt.keyCode == RIGHT_ARROW_KC)
	{
		this.playerSS.rotateRight = true;
	}
	else if (evt.keyCode == UP_ARROW_KC)
	{
		this.playerSS.forwardThrust = true;
	}
	else if (evt.keyCode == DOWN_ARROW_KC)
	{
		this.playerSS.reverseThrust = true;
	}
}

// World key up events handler
World.prototype.onKeyUp = function(evt)
{
	if (evt.keyCode == LEFT_ARROW_KC)
	{
		this.playerSS.rotateLeft = false;
	}
	else if (evt.keyCode == RIGHT_ARROW_KC)
	{
		this.playerSS.rotateRight = false;
	}
	else if (evt.keyCode == UP_ARROW_KC)
	{
		this.playerSS.forwardThrust = false;
	}
	else if (evt.keyCode == DOWN_ARROW_KC)
	{
		this.playerSS.reverseThrust = false;
	}
}

// World constructor
function World(root)
{
	// Saves the root for graphics operations
	this.root = root;

	// Makes the starry background
	this.background = new StarBackground(SEED);
	
	// Makes the player's spaceship
	this.playerSS = new SpaceShip(this, 100.0, 100.0, 30.0, 5.0, 0.0, 100.0);
	
	// Makes a null step
	this.step(0.0);
}

// Inits the document
function startup(evt)
{
	// Gets the target of the event
	tgt = evt.target;
	
	// Gets the document from it
	doc = tgt.ownerDocument;
	
	// Gets the graphics "root" to be used by the world
	root = doc.getElementById('drawArea');
	
	// Makes the world
	world = new World(root);
	
	// Conects the world with keyboard input
	doc.addEventListener('keydown', function(e){world.onKeyDown.call(world, e)}, false);
	doc.addEventListener('keyup', function(e){world.onKeyUp.call(world, e)}, false);
	
	// Starts the timer
	timerID = setInterval(function(){world.step(0.1)}, 50);
}