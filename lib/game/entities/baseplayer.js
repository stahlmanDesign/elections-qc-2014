ig.module(
	'game.entities.baseplayer'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityBaseplayer = ig.Entity.extend({

	// The players (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 40, y: 88},
	offset: {x: 17, y: 10},

	maxVel: {x: 400, y: 800},
	friction: {x: 800, y: 0},

	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.BOTH,
	collides: ig.Entity.COLLIDES.ACTIVE,

	animSheet: new ig.AnimationSheet( 'media/marois.png', 75, 100 ),

	sfxHurt: new ig.Sound( 'media/sounds/gaffe.*' ),


	sfxJump: new ig.Sound( 'media/sounds/jump.*' ),

	font: new ig.Font( 'media/fredoka-one.font.png' ),
	health: 3,

	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	flip: false,
	accelGround: 1200,
	accelAir: 600,
	jump: 500,
	maxHealth: 3,
	changementDeChefMessageTime:3,
	coins: 0,
	changementDeChefTimer:null,

	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		// Add the animations
		this.addAnim( 'idle', 1, [15,15,15,15,15,14] );
		this.addAnim( 'run', 0.07, [4,5,11,0,1,2,7,8,9,3] );
		this.addAnim( 'jump', 1, [13] );
		this.addAnim( 'fall', 0.4, [13,12], true ); // stop at the last frame
		this.addAnim( 'pain', 0.3, [6], true );

		// Set a reference to the player on the game instance
		ig.game.player = this;
		this.changementDeChefTimer = new ig.Timer(this.changementDeChefMessageTime);
	},

	update: function() {

		// Handle user input; move left or right
		var accel = this.standing ? this.accelGround : this.accelAir;
		if (ig.input.state('left')) {
			this.accel.x = -accel;
			this.flip = true;
		} else if (ig.input.state('right')) {
			this.accel.x = accel;
			this.flip = false;
		} else {
			this.accel.x = 0;
		}
		// jump
		if (this.standing && ig.input.pressed('jump')) {
			this.vel.y = -this.jump;
			this.sfxJump.play();
		}
		// shoot
		/*
if (ig.input.pressed('shoot')) {
			ig.game.spawnEntity(EntityFireball, this.pos.x, this.pos.y + 40, {
				flip: this.flip
			});
		}
*/


		// Stay in the pain animation, until it has looped through.
		// If not in pain, set the current animation, based on the
		// player's speed
		if (
		this.currentAnim == this.anims.pain && this.currentAnim.loopCount < 1) {
			// If we're dead, fade out
			if (this.health <= 0) {
				// The pain animation is 0.3 seconds long, so in order to
				// completely fade out in this time, we have to reduce alpha
				// by 3.3 per second === 1 in 0.3 seconds
				var dec = (1 / this.currentAnim.frameTime) * ig.system.tick;
				this.currentAnim.alpha = (this.currentAnim.alpha - dec).limit(0, 1);
			}
		} else if (this.health <= 0) {
			// We're actually dead and the death (pain) animation is
			// finished. Remove ourself from the game world.

			this.kill();
		} else if (this.vel.y < 0) {
			this.currentAnim = this.anims.jump;
		} else if (this.vel.y > 0) {
			if (this.currentAnim != this.anims.fall) {
				this.currentAnim = this.anims.fall.rewind();
			}
		} else if (this.vel.x != 0) {
			this.currentAnim = this.anims.run;
		} else {
			this.currentAnim = this.anims.idle;
		}
		this.currentAnim.flip.x = this.flip;

		// ------------------ begin ladder code ------------------
		if (this.isConfiguredForClimbing){
			this.checkForLadder(this);
			if (this.ladderTouchedTimer.delta() > 0) this.isTouchingLadder = false; // reset in case player leaves ladder. This allows to walk across/atop ladder
		}
		// ------------------  end  ladder code ------------------

		// Move!
		this.parent();

	},
	draw:function(){
		this.parent();
		var s = ig.system.scale * 1; // * 2 if using blown-up pixel look
		var x = this.pos.x * s - ig.game.screen.x * s;
		var y = (this.pos.y) * s - ig.game.screen.y * s;

		if (!ig.global.wm && this.changementDeChefTimer.delta() < 0) {
			this.font.draw("Changement de chef!!!",x,y-60, ig.Font.ALIGN.CENTER )
		}
	},
	kill: function() {
		this.parent();
		ig.game.spawnEntity( EntitySplash, this.pos.x, this.pos.y);
		ig.game.chefTimer.reset()
		var curChefIndex = ig.game.chefs.indexOf(ig.game.currentChef);
		if (ig.game.currentChef == "david"){

			ig.game.loadHighScores();

		}else{
			ig.game.currentChef = curChefIndex < 4 ? ig.game.chefs[curChefIndex+1] : ig.game.chefs[0];

			var upperCaseChef = capitaliseFirstLetter(ig.game.currentChef)
			//console.log(upperCaseChef)
			ig.game.spawnEntity("Entity" + upperCaseChef,this.pos.x,this.pos.y);
		}

		// Reload this level
		//ig.game.reloadLevel();
	},
	giveCoins: function(amount) {
		// Custom function, called from the EntityCoin
		//console.log(this.name)
		ig.game.playerStats[this.name].score += amount
		//this.coins += amount;
	},
	receiveDamage: function(amount, from) {
		if (this.currentAnim == this.anims.pain) {
			// Already in pain? Do nothing.
			return;
		}
		// We don't call the parent implementation here, because it
		// would call this.kill() as soon as the health is zero.
		// We want to play our death (pain) animation first.
		this.health -= amount;
		this.currentAnim = this.anims.pain.rewind();
		// Knockback
		this.vel.x = (from.pos.x > this.pos.x) ? -1400 : 1400;
		this.vel.y = -600;
		// Sound
		this.sfxHurt.play();
		ig.game.spawnEntity("EntityCoingaffeminusone",this.pos.x,this.pos.y-100);
	},
	collideWith: function(other,axis) {
		this.parent(other);
		//console.log(other.name + " " + this.name)

		// The instanceof should always be true, since the player is
		// the only entity with TYPE.A - and we only check against A.



	}

});
EntitySplash = ig.Entity.extend({
        lifetime: 1,
        callBack: null,
        particles: 25,

        init: function( x, y, settings ) {
            this.parent( x, y, settings );

                for(var i = 0; i < this.particles; i++)
                    ig.game.spawnEntity(EntitySplashparticle, x, y+12, {colorOffset: settings.colorOffset ? settings.colorOffset : 0});
                this.idleTimer = new ig.Timer();
            },
            update: function() {
                if( this.idleTimer.delta() > this.lifetime ) {
                    this.kill();
                    if(this.callBack)
                        this.callBack();
                    return;
                }
            }
    });
    EntitySplashparticle = ig.Entity.extend({
        size: {x: 4, y: 4},
        maxVel: {x: 200, y: 200},
        lifetime: 1,
        fadetime: 1,
        bounciness: 1,
        vel: {x: 100, y: -100},
        friction: {x:100, y: 100},
        collides: ig.Entity.COLLIDES.LITE,
        colorOffset: 0,
        totalColors: 7,
        gravityFactor:1,
        animSheet: new ig.AnimationSheet( 'media/splash.png', 4, 4 ),
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset * (this.totalColors+1));
            this.addAnim( 'idle', 0.2, [frameID] );
            this.vel.x = (Math.random() * 2 - 2) * 200;
            this.vel.y = (Math.random() * 2 - 2) * 200;


            this.idleTimer = new ig.Timer();
        },
        update: function() {
            if( this.idleTimer.delta() > this.lifetime ) {
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime,
                1, 0
            );
            this.parent();
        }
    });

});


function capitaliseFirstLetter(string)
{

    return string.charAt(0).toUpperCase() + string.slice(1);
}