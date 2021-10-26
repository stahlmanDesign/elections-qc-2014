ig.module(
	'game.entities.coinpq'
)
.requires(
	'game.entities.coin'
)
.defines(function(){

EntityCoinpq = EntityCoin.extend({

	animSheet: new ig.AnimationSheet( 'media/pq_128.png', 128, 128 ),

	name: "pq",


	update: function() {
		this.parent();
		// call this.parent() for gravity and movement

		// update the animation. This is normally done
		// in the .parent() update:
		//this.currentAnim.update();

		if (this.lifeTimer.delta() > 0 ) {
			this.kill();
		}
	},

	kill: function(){
		this.parent();

	}
});

});