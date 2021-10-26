ig.module(
	'game.entities.coinplusone'
)
.requires(
	'game.entities.coin'
)
.defines(function(){

EntityCoinplusone = EntityCoin.extend({
	size:{x:100,y:100},
	animSheet: new ig.AnimationSheet( 'media/plusone.png', 100, 100 ),
	typeOfCoin:"pointIndicator",
	name: "plusone",
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER,
	update: function() {
		this.parent();
		//this.pos.x -= 5
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