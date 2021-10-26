ig.module(
	'game.entities.coinbonus'
)
.requires(
	'game.entities.coin'
)
.defines(function(){

EntityCoinbonus = EntityCoin.extend({
	size: {x: 68, y: 68},
	typeOfCoin:"bonus",
	animSheet: new ig.AnimationSheet( 'media/bonus.png', 68, 68 ),

	name: "bonus",

	init: function( x, y, settings ) {
		this.parent( x, y, settings );

	},
	update: function() {
		this.parent();
		if (ig.game.player.health > 1) this.pos.y = 0; // don,t let it fall if player healthy
		if (this.lifeTimer.delta() > 0 ) {
			this.kill();
		}
	}
});
});