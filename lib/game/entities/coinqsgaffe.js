ig.module(
	'game.entities.coinqsgaffe'
)
.requires(
	'game.entities.coin'
)
.defines(function(){

EntityCoinqsgaffe = EntityCoin.extend({
	typeOfCoin:"gaffe",
	animSheet: new ig.AnimationSheet( 'media/qsgaffe.png', 128, 128 ),

	name: "qsgaffe",

	init: function( x, y, settings ) {
		this.parent( x, y, settings );

	},
	update: function() {
		this.parent();
		if (ig.game.player.health < 3) this.pos.y = 0; // don't let it fall if player almost dead
		if (this.lifeTimer.delta() > 0 ) {
			this.kill();
		}
	}
});

});