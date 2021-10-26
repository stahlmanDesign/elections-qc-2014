ig.module(
	'game.entities.coingaffeminusone'
)
.requires(
	'game.entities.coin'
)
.defines(function(){

EntityCoingaffeminusone = EntityCoin.extend({

	animSheet: new ig.AnimationSheet( 'media/heart-empty.png', 53, 45 ),
	typeOfCoin:"pointIndicator",
	name: "gaffeminusone",
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER,
	init:function( x, y, settings ){
		this.parent( x, y, settings );
		this.lifeTimer = new ig.Timer(2);
	},
	update: function() {
		this.parent();
		this.pos.x -= 5
		this.pos.y -= 5
		this.currentAnim.alpha -=0.01
		this.gravityFactor=0
		// call this.parent() for gravity and movement

		// update the animation. This is normally done
		// in the .parent() update:
		//this.currentAnim.update();

		if (this.lifeTimer.delta() > -1 ) {
			this.kill();
		}
	},

	kill: function(){
		this.parent();

	}
});

});