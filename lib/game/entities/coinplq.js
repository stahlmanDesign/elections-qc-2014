ig.module(
	'game.entities.coinplq'
)
.requires(
	'game.entities.coin'
)
.defines(function(){

EntityCoinplq = EntityCoin.extend({

	animSheet: new ig.AnimationSheet( 'media/plq_128.png', 128, 128 ),

	name: "plq",


	update: function() {
		this.parent();
		// call this.parent() for gravity and movement

		// update the animation. This is normally done
		// in the .parent() update:
		//this.currentAnim.update();

		if (this.lifeTimer.delta() > 0 ) {
			this.kill();
		}
	}
});

});