// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1420;
canvas.height = 875;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/unnamed.jpg";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/cr72.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/Soccer-icon (1).png";

//Obstacle image
var refReady = false;
var refImage = new Image();
refImage.onload = function () {
	refReady = true;
};
refImage.src = "images/ref.jpg";

//enemy image
var nmeReady = false;
var nmeImage = new Image();
nmeImage.onload = function () {
	nmeReady = true;
};
nmeImage.src = "images/messi.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;

var ref = {};
var nme = {
	speed: 125
};



// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2 - 256;
	hero.y = canvas.height / 2 - 125;

	// Throw the monster somewhere on the screen randomly
	monster.x = (Math.random() * (canvas.width - 64));
	monster.y = (Math.random() * (canvas.height - 64));

	ref.x = (Math.random() * (canvas.width - 50));
	ref.y = (Math.random() * (canvas.height - 256));
	//makes sure ref can't spawn on player
	while(ref.x <= canvas.width/2 && ref.x >= canvas.width/2 - 256) {
		ref.x = (Math.random() * (canvas.width - 50));
	}
	while (ref.y <= canvas.height / 2 + 125 && ref.y >= canvas.height / 2 - 125) {
		ref.y = (Math.random() * (canvas.height - 256));
	}

	nme.x = canvas.width / 2;
	nme.y = canvas.height / 2 - 125;
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		if (hero.y >= 0) {
			hero.y -= hero.speed * modifier;
		}
	}
	if (40 in keysDown) { // Player holding down
		if (hero.y <= canvas.height - 256) {
			hero.y += hero.speed * modifier;
		}	
	}
	if (37 in keysDown) { // Player holding left
		if (hero.x >= 0 - 50) {
			hero.x -= hero.speed * modifier;
		}	
	}
	if (39 in keysDown) { // Player holding right
		if (hero.x <= canvas.width - 125) {
			hero.x += hero.speed * modifier;
		}	
	}

	//enemy movement
	if (monster.y > nme.y) {
		nme.y += nme.speed * modifier;
	}
	if (monster.y < nme.y) {
		nme.y -= nme.speed * modifier;
	}
	if (monster.x > nme.x) {
		nme.x += nme.speed * modifier;
	}
	if (monster.x < nme.x) {
		nme.x -= nme.speed * modifier;
	}


	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 125)
		&& hero.y <= (monster.y + 64)
		&& monster.y <= (hero.y + 256)
		
	) {
		++monstersCaught;
       
		reset();
	}

	if (
		nme.x <= (monster.x + 32)
		&& monster.x <= (nme.x + 125)
		&& nme.y <= (monster.y + 64)
		&& monster.y <= (nme.y + 256)

	) {
		--monstersCaught;

		reset();
	}

	if (
		hero.x <= (ref.x + 32)
		&& ref.x <= (hero.x + 125)
		&& hero.y <= (ref.y + 64)
		&& ref.y <= (hero.y + 256)

	) {
		monstersCaught = 0;
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (refReady) {
		ctx.drawImage(refImage, ref.x, ref.y);
	}

	if (nmeReady) {
		ctx.drawImage(nmeImage, nme.x, nme.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}


	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Footballs caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();