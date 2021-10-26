ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',

	'plugins.camera',
	'plugins.touch-button',
	'plugins.impact-splash-loader',

	'game.levels.title',
	'game.levels.mainlevel',
	'game.levels.gameover',

	'game.entities.marois',
	'game.entities.couillard',
	'game.entities.legault',
	'game.entities.david',
	'game.entities.coinhealth',
	'game.entities.coinbonus',
	'game.entities.coingaffe',
	'game.entities.coinplusone',
	'game.entities.coinminusone',
	'game.entities.coingaffeminusone'/*
,

	'impact.debug.debug'
*/

)
.defines(function(){


// Our Main Game class. This will load levels, host all entities and
// run the game.

MyGame = ig.Game.extend({

	clearColor: "#d0f4f7",
	gravity: 800, // All entities are affected by this

	// Load a font
	font: new ig.Font( 'media/fredoka-one.font.png' ),
	time: new ig.Font( 'media/fredoka-one.font.png' ),
	gameOverFont: new ig.Font( 'media/fredoka-one.font.png' ),
	marois: new ig.Font( 'media/fredoka-one.font.png' ),
	couillard: new ig.Font( 'media/fredoka-one.font.png' ),
	legault: new ig.Font( 'media/fredoka-one.font.png' ),
	david: new ig.Font( 'media/fredoka-one.font.png' ),

	highScoresText: new ig.Font( 'media/fredoka-one.font.png' ),
	maroisHS: new ig.Font( 'media/fredoka-one.font.png' ),
	couillardHS: new ig.Font( 'media/fredoka-one.font.png' ),
	legaultHS: new ig.Font( 'media/fredoka-one.font.png' ),
	davidHS: new ig.Font( 'media/fredoka-one.font.png' ),

	// HUD icons
	heartFull: new ig.Image( 'media/heart-full.png' ),
	heartEmpty: new ig.Image( 'media/heart-empty.png' ),
	coinIcon: new ig.Image( 'media/coin.png' ),
	gameOver:false,
	loadedHighScores:{}, // high scores
	chefs:["marois","couillard","legault","david"],
	currentChef: "marois",
	playerStats: {
		"marois": {
			"parti": "pq",
			"iste":"péquiste",
			"nom":"Pauline Marois",
			"bonus": "bonus",
			"gaffe": "gaffe",
			"score":0
		},
		"couillard": {
			"parti": "plq",
			"nom":"Philippe Couillard",
			"iste":"libéral",
			"bonus": "bonus",
			"gaffe": "gaffe",
			"score":0
		},
		"legault": {
			"parti": "caq",
			"nom":"François Legault",
			"iste":"caquiste",
			"bonus": "bonus",
			"gaffe": "gaffe",
			"score":0
		},
		"david": {
			"parti": "qs",
			"nom":"Françoise David",
			"iste":"solidaire",
			"bonus": "bonus",
			"gaffe": "gaffe",
			"score":0
		}
	},
	chefTimer: null,
	modalWasShown:false,

	init: function() {


		// We want the font's chars to slightly touch each other,
		// so set the letter spacing to -2px.
		this.font.letterSpacing = -2;


		// Set up the camera. The camera's center is at a third of the screen
		// size, i.e. somewhat shift left and up. Damping is set to 3px.
		this.camera = new ig.Camera( ig.system.width/3, ig.system.height/3, 3 );

		// The camera's trap (the deadzone in which the player can move with the
		// camera staying fixed) is set to according to the screen size as well.
    	this.camera.trap.size.x = ig.system.width/10;
    	this.camera.trap.size.y = ig.system.height/3;

		// The lookahead always shifts the camera in walking position; you can
		// set it to 0 to disable.
    	this.camera.lookAhead.x = ig.system.width/6;
		this.chefTimer = new ig.Timer(60);

		// Load the LevelGrasslands as required above ('game.level.mainlevel')
		this.loadLevel( LevelMainlevel );
		$('#endModal').modal("hide")
	},

	loadLevel: function( data ) {
		// Remember the currently loaded level, so we can reload when
		// the player dies.
		this.currentLevel = data;

		// Call the parent implemenation; this creates the background
		// maps and entities.
		this.parent( data );

		// Set camera's screen bounds and reposition the trap on the player
    	this.camera.max.x = this.collisionMap.pxWidth - ig.system.width;
    	this.camera.max.y = this.collisionMap.pxHeight - ig.system.height;
    	this.camera.set( this.player );
	},

	reloadLevel: function() {
		this.loadLevelDeferred( this.currentLevel );
	},

	update: function() {
		// Update all entities and BackgroundMaps
		this.parent();

		if( ig.input.pressed('restart') ) {
			ig.system.setGame( MyTitle );
			return;
		}
		// Camera follows the player
		this.camera.follow( this.player );

		// Instead of using the camera plugin, we could also just center
		// the screen on the player directly, like this:
		// this.screen.x = this.player.pos.x - ig.system.width/2;
		// this.screen.y = this.player.pos.y - ig.system.height/2;
		if (this.chefTimer.delta() > 0){
			//this.playerStats[this.player.name].score = this.player.coins
			this.player.kill();
			this.chefTimer.reset();

		}
		if (this.gameOver) {
			this.chefTimer.pause(); // let player fool around at end of game
			if (!this.modalWasShown){
				// use underscore library to return high score
				var winner = (_.max(this.playerStats, function(chef){ return chef.score; }));
					$('#endModal').find(".modal-content").html(
					"<h1>BRAVO !</h1>\n\
					<p>C’est avec <strong>"+winner.nom+"</strong> que vous avez gagné le plus de points !</p>\n\
					<p>Mais êtes-vous vraiment <strong>"+winner.iste+"</strong> ?</p>\n\
					<p>Assez joué, allez maintenant vous informer en consultant <a href='http://www.journaldemontreal.com/elections2014'>notre dossier complet sur les élections</a></p>\n\
					<p>Questions ? Commentaires ? Visitez le blogue <a href='http://blogues.journaldemontreal.com/dataviz/nouvelles/amusons-nous-un-jeu-video-avec-les-chefs-de-parti/'>Dataviz</a></p>"					
					);
					//this.playerStats.marois.score
				$('#endModal').modal("show")
				this.modalWasShown = true;
			}
		}
	},

	draw: function() {
		// Call the parent implementation to draw all Entities and BackgroundMaps
		this.parent();


		// Draw the heart and number of coins in the upper left corner.
		// 'this.player' is set by the player's init method
		if( this.player ) {
			var x = 16,
				y = 16;


			if (!this.gameOver){
				this.marois.draw("PQ: "+this.playerStats.marois.score, x,y+70)
				this.couillard.draw("PLQ: "+this.playerStats.couillard.score, x,y+100)
				this.legault.draw("CAQ: "+this.playerStats.legault.score, x,y+130)
				this.david.draw("QS: "+this.playerStats.david.score, x,y+160)

				for( var i = 0; i < this.player.maxHealth; i++ ) {
					// Full or empty heart?
					if( this.player.health > i ) {
						this.heartFull.draw( x, y );
					}
					else {
						this.heartEmpty.draw( x, y );
					}

					x += this.heartEmpty.width + 8;
				}

				// We only want to draw the 0th tile of coin sprite-sheet
				x += 48;
				//this.coinIcon.drawTile( x, y+6, 0, 36 );

				x += 42;
				//this.font.draw( 'x ' + this.player.coins, x, y+10 )

				this.time.draw( "TEMPS : " + (Math.floor(Math.abs(this.chefTimer.delta()))), x+200, y+10);
			}else{

				this.highScoresText.draw("Meilleur pointage\n(apres"+this.loadedHighScores.timesplayed+" parties): ",x,y)
				this.maroisHS.draw("PQ: "+this.loadedHighScores.alltime.pq, x,y+70)
				this.couillardHS.draw("PLQ: "+this.loadedHighScores.alltime.plq, x,y+100)
				this.legaultHS.draw("CAQ: "+this.loadedHighScores.alltime.caq, x,y+130)
				this.davidHS.draw("QS: "+this.loadedHighScores.alltime.qs, x,y+160)

				var gameOverText = ig.ua.mobile
					? 'Partie terminee !\n(B) pour recommencer\n '
					: "Partie terminee !\nESPACE pour recommencer\n ";

				var cx = ig.system.width/3;
				var cy = ig.system.height/3;

				//console.log(cx + " " + cy)

				this.gameOverFont.draw(gameOverText, cx,cy-60);

				var mar = this.getEntitiesByType(EntityMarois)[0]
				var s = ig.system.scale * 1; // modif to *2 if this game is upsampled for pixel look
				var x = mar.pos.x * s - ig.game.screen.x * s;
				var y = (mar.pos.y) * s - ig.game.screen.y * s;
				this.marois.draw("PQ\n"+this.playerStats.marois.score, x,y-90)

				var cou = this.getEntitiesByType(EntityCouillard)[0]
				var s = ig.system.scale * 1; // modif to *2 if this game is upsampled for pixel look
				var x = cou.pos.x * s - ig.game.screen.x * s;
				var y = (cou.pos.y) * s - ig.game.screen.y * s;
				this.couillard.draw("PLQ\n"+this.playerStats.couillard.score, x,y-90)

				var leg = this.getEntitiesByType(EntityLegault)[0]
				var s = ig.system.scale * 1; // modif to *2 if this game is upsampled for pixel look
				var x = leg.pos.x * s - ig.game.screen.x * s;
				var y = (leg.pos.y) * s - ig.game.screen.y * s;
				this.legault.draw("CAQ\n"+this.playerStats.legault.score, x,y-90)

				var dav = this.getEntitiesByType(EntityDavid)[0]
				var s = ig.system.scale * 1; // modif to *2 if this game is upsampled for pixel look
				var x = dav.pos.x * s - ig.game.screen.x * s;
				var y = (dav.pos.y) * s - ig.game.screen.y * s;
				this.david.draw("QS\n"+this.playerStats.david.score, x,y-90)

			}

		}

		// Draw touch buttons, if we have any
		if( window.myTouchButtons ) {
			window.myTouchButtons.draw();
		}
	},
	loadHighScores: function(callback){
		//console.log("trying to load high scores")

		$.ajaxSetup({ cache: false });
		$.getJSON("data/data.json", {
			format: "json"
		}).done(function(data) {

			ig.game.loadedHighScores = data;
			//console.log("high scores loaded")
			//console.log(ig.game.loadedHighScores.today.pq)

			ig.game.loadLevel( ig.global['LevelGameover'] );
			ig.game.gameOver = true;
			ig.game.saveHighScores()

		});

	},
	saveHighScores: function(){
		ig.game.loadedHighScores;

		if (ig.game.playerStats.marois.score > ig.game.loadedHighScores.alltime.pq) ig.game.loadedHighScores.alltime.pq = ig.game.playerStats.marois.score
		if (ig.game.playerStats.couillard.score > ig.game.loadedHighScores.alltime.plq) ig.game.loadedHighScores.alltime.plq = ig.game.playerStats.couillard.score
		if (ig.game.playerStats.legault.score > ig.game.loadedHighScores.alltime.caq) ig.game.loadedHighScores.alltime.caq = ig.game.playerStats.legault.score
		if (ig.game.playerStats.david.score > ig.game.loadedHighScores.alltime.qs) ig.game.loadedHighScores.alltime.qs = ig.game.playerStats.david.score
		ig.game.loadedHighScores.timesplayed ++

	    $.post('saveHighScores.php', {
			dataToSave: JSON.stringify(ig.game.loadedHighScores)
		});
	}
});



// The title screen is simply a Game Class itself; it loads the LevelTitle
// runs it and draws the title image on top.

MyTitle = ig.Game.extend({
	clearColor: "#d0f4f7",
	gravity: 800,

	// The title image
	title: new ig.Image( 'media/title.png' ),

	// Load a font
	font: new ig.Font( 'media/fredoka-one.font.png' ),


	init: function() {
		// Bind keys
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.UP_ARROW, 'jump' );
		/* ig.input.bind( ig.KEY.DOWN_ARROW, 'down' ); */
		ig.input.bind( ig.KEY.SPACE, 'restart' );
		/* ig.input.bind( ig.KEY.C, 'shoot' ); */

		// Align touch buttons to the screen size, if we have any
		if( window.myTouchButtons ) {
			window.myTouchButtons.align();
		}

		// We want the font's chars to slightly touch each other,
		// so set the letter spacing to -2px.
		this.font.letterSpacing = -2;

		this.loadLevel( LevelTitle );
		this.maxY = this.backgroundMaps[0].pxHeight - ig.system.height;
	},

	update: function() {
		// Check for buttons; start the game if pressed
		if( ig.input.pressed('jump') || ig.input.pressed('restart') ) {
			ig.system.setGame( MyGame );
			return;
		}


		this.parent();

		// Scroll the screen down; apply some damping.
		var move = this.maxY - this.screen.y;
		if( move > 5 ) {
			this.screen.y += move * ig.system.tick;
			this.titleAlpha = this.screen.y / this.maxY;
		}
		this.screen.x = (this.backgroundMaps[0].pxWidth - ig.system.width)/2;
	},

	draw: function() {
		this.parent();

		var cx = ig.system.width/2;
		this.title.draw( cx - this.title.width/2, 60 );

		var startText = ig.ua.mobile
			? 'Attrapez les logos de votre parti !\nBouton (A) pour sauter,\nnBouton (B) pour recommencer'
			: "Attrapez les logos de votre parti !\nLes FLECHES pour bouger et sauter,\nESPACE pour recommencer";

		this.font.draw( startText, cx, 320, ig.Font.ALIGN.CENTER);

		// Draw touch buttons, if we have any
		if( window.myTouchButtons ) {
			window.myTouchButtons.draw();
		}
	}
});


if( ig.ua.mobile ) {
	// If we're running on a mobile device and not within Ejecta, disable
	// sound completely :(
	if( !window.ejecta ) {
		ig.Sound.enabled = false;
	}

	// Use the TouchButton Plugin to create a TouchButtonCollection that we
	// can draw in our game classes.

	// Touch buttons are anchored to either the left or right and top or bottom
	// screen edge.
	var buttonImage = new ig.Image( 'media/touch-buttons.png' );
	myTouchButtons = new ig.TouchButtonCollection([
		new ig.TouchButton( 'left', {left: 0, bottom: 100}, 128, 128, buttonImage, 0 ),
		new ig.TouchButton( 'right', {left: 128, bottom: 100}, 128, 128, buttonImage, 1 ),
		new ig.TouchButton( 'jump', {right: 0, bottom: 100}, 128, 128, buttonImage, 2 ),
		new ig.TouchButton( 'restart', {right: 0, bottom: 450}, 128, 128, buttonImage, 3 )
	]);
}

// If our screen is smaller than 640px in width (that's CSS pixels), we scale the
// internal resolution of the canvas by 2. This gives us a larger viewport and
// also essentially enables retina resolution on the iPhone and other devices
// with small screens.
var scale = (window.innerWidth < 640) ? 2 : 1;


// We want to run the game in "fullscreen", so let's use the window's size
// directly as the canvas' style size.
var canvas = document.getElementById('canvas');
canvas.style.width = window.innerWidth + 'px';
canvas.style.height = window.innerHeight + 'px';


// Listen to the window's 'resize' event and set the canvas' size each time
// it changes.
window.addEventListener('resize', function(){
	// If the game hasn't started yet, there's nothing to do here
	if( !ig.system ) { return; }

	// Resize the canvas style and tell Impact to resize the canvas itself;
	canvas.style.width = window.innerWidth + 'px';
	canvas.style.height = window.innerHeight + 'px';
	ig.system.resize( window.innerWidth * scale, window.innerHeight * scale );

	// Re-center the camera - it's dependend on the screen size.
	if( ig.game && ig.game.camera ) {
		ig.game.camera.offset.x = ig.system.width/3;
    	ig.game.camera.offset.y = ig.system.height/3;
	}

	// Also repositon the touch buttons, if we have any
	if( window.myTouchButtons ) {
		window.myTouchButtons.align();
	}
}, false);


// Finally, start the game into MyTitle and use the ImpactSplashLoader plugin
// as our loading screen
var width = window.innerWidth * scale,
	height = window.innerHeight * scale;

ig.main( '#canvas', MyTitle, 60, width, height, 1, ig.ImpactSplashLoader );

});






