//CANVAS
var canvas = document.getElementById("a");
var ctx = canvas.getContext("2d");

//TAUSTAKUVA
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function(){
	bgReady = true;

};
bgImage.src = "kuvat/BG.jpg";


//SANKARi TÖTTÖRÖÖ

var heroReady = false;
var heroImage = new Image();
heroImage.onload = function(){
	heroReady = true;

};
heroImage.src = "kuvat/hero.png";

//PAHiS tää tulee random mestoihin tietyin intervallein

var pahisReady = false;
var pahisImage = new Image();
pahisImage.onload = function(){
	pahisReady = true;

};


//TRESAR tää tulee random mestoihin

var tresarReady = false;
var tresarImage = new Image();
tresarImage.onload = function(){
	tresarReady = true;
};
tresarImage.src = "kuvat/tresar.png";

//OBJEKTIT
var hero = {
	speed: 300, //nopeus pikseleissä
	x: 0,
	y: 0
};
var tresar = {
	x: 0,
	y: 0

};


function uusPahis(){
	// TEKEE UUDEN PAHIKSEN
	var pahis = {
	speed: 256,
	x: 0,
	y: 0,
	kuva: pahisImage.src = "kuvat/pahis.png",
	dx: 1,
	dy: 1
	};

	// SPAWNAA PAHIKSEN ERI MESTAA
	pahis.x = 32 + (Math.random() * (canvas.width - 64))
	pahis.y = 32 + (Math.random() * (canvas.height - 64))

	// PUSH TO THE ARRAY OF BADDIES
	pahisArray.push(pahis);
};

var tresarCollected = 0;
var pahisArray = [];
var death = "";
var player = [name, tresarCollected];
var top1 = ["Player", 0];
var top2 = ["Player", 0];
var top3 = ["Player", 0];

//KONTROLLIT

var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// AARRE RESET

var resetTresar = function (){
	tresar.x = (Math.random() * (canvas.width - 64))
	tresar.y = (Math.random() * (canvas.height - 64))
};

// HERO KUOLEE / PELI ALKAA
var resetHero = function (){
	hero.x = canvas.width/2;
	hero.y = canvas.height/2;
};

// PÄIVITYS

var update = function(modifier){
	if (38 in keysDown) {
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) {
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) {
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) {
		hero.x += hero.speed * modifier;
	}		

	// KOSKEEKO SANKARI AARTEESEEN
	if (hero.x <= (tresar.x + 32) && hero.x >= (tresar.x - 32) && hero.y <= (tresar.y + 32) && hero.y >= (tresar.y - 32))
	{
	++tresarCollected;
	resetTresar();
	death = "";
	}

	// PAHIS SYNTYY
	if (tresarCollected%5 === 0 && pahisArray.length === (tresarCollected/5 - 1)) // SPAWNAA YHEN PAHIKSEN --> WANT MORE
	{
	uusPahis();
	}

	//KOSKEEKO SANKARI PAHIKSEEN
	for (var i = 0; i < pahisArray.length; i++){
		if(hero.x <= (pahisArray[i].x + 32) && hero.x >= (pahisArray[i].x -32) && hero.y <= (pahisArray[i].y + 32) && hero.y >= (pahisArray[i].y -32))
		{
			pahisArray = [];
			topLista();
			tresarCollected = 0;
			death = "No! I be deaded!";
			resetHero();
		}	
	};

};

// TOP3 LISTAFUNX

function topLista(){

	if(tresarCollected >= top1[1]){
		top3[0] = top2[0];
		top3[1] = top2[1];
		top2[0] = top1[0];
		top2[1] = top1[1];
		top1[1] = tresarCollected;
		top1[0] = player[0];
	}
	if(tresarCollected >= top2[1] && tresarCollected < top1[1]){
		top3[0] = top2[0];
		top3[1] = top2[1];
		top2[1] = tresarCollected;
		top2[0] = player[0];
	}
	if(tresarCollected >= top3[1] && tresarCollected < top2[1]){
		top3[1] = tresarCollected;
		top3[0] = player[0];
	}	
	
};


// PIIRRRRRRRRRRRRRRRRRUSTUS

var render = function() {
	if (bgReady){
		ctx.drawImage(bgImage, 0, 0);
	}
	
	
	if (tresarReady){
		ctx.drawImage(tresarImage, tresar.x, tresar.y);
	}

	if (heroReady){
		ctx.drawImage(heroImage, hero.x, hero.y);
	}
	// PAHIKSEN SPAWN+LIIKKUMINEN
	for (var i = 0; i < pahisArray.length; i++){
		ctx.drawImage(pahisImage, pahisArray[i].x+pahisArray[i].dx, pahisArray[i].y+pahisArray[i].dy);
		if(pahisArray[i].x < 0 || pahisArray[i].x > 512 - 47){
		pahisArray[i].dx = -pahisArray[i].dx;
		}
		if(pahisArray[i].y < 0 || pahisArray[i].y > 480 - 71){
		pahisArray[i].dy = -pahisArray[i].dy;
		}	
		pahisArray[i].x += pahisArray[i].dx;
		pahisArray[i].y += pahisArray[i].dy;	
	}

	
	
	// PISTEET ATM
	ctx.fillStyle = "rgb(250,250,250)";
	ctx.font = "24px Tahoma";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Tresar collakted: " + tresarCollected +" "+ death, 10, 10);
	// TOP3
	ctx.fillStyle = "rgb(250,250,250)";
	ctx.font = "12px Tahoma";
	ctx.textAlign = "left";
	ctx.textBaseline = "bottom";
	ctx.fillText("VERY HIGH SCORES:", 10, 420);
	ctx.fillText("1. "+top1, 10, 435);
	ctx.fillText("2. "+top2, 10, 450);
	ctx.fillText("3. "+top3, 10, 465);

};

function nimiFunc(){
	var name = document.getElementById("nimi");
	var theNimi = name.value;
	if(theNimi.length > 20){
		alert("PLS LITTLER NAME!");
	}
	else{
		alert(theNimi+", NEIMERYYY SEIVERYYYY!");
		player[0] = theNimi;
	}	
};

// PAHIKSEN LIIKKUMINEN

/*function draw(pahisReady){
	for (var i = 0; i < pahisArray.length; i++){
		ctx.drawImage(pahisImage, pahisArray[i].x+pahisArray[i].dx, pahisArray[i].y+pahisArray[i].dy);
		if(pahisArray[i].x < 0 || pahisArray[i].x > 512 - 47){
		pahisArray[i].dx = -pahisArray[i].dx;
		}
		if(pahisArray[i].y < 0 || pahisArray[i].y > 480 - 71){
		pahisArray[i].dy = -pahisArray[i].dy;
		}	
		pahisArray[i].x += pahisArray[i].dx;
		pahisArray[i].y += pahisArray[i].dy;	
	}
};*/

// MAINI

var main = function() {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;


};
