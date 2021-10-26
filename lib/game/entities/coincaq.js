ig.module(
	'game.entities.coincaq'
)
.requires(
	'game.entities.coin'
)
.defines(function(){

EntityCoincaq = EntityCoin.extend({

	animSheet: new ig.AnimationSheet( 'media/caq_128.png', 128, 128 ),

	name: "caq",


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