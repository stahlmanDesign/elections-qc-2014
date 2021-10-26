ig.module(
	'game.entities.coinpqbonus'
)
.requires(
	'game.entities.coin'
)
.defines(function(){

EntityCoinpqbonus = EntityCoin.extend({
	size: {x: 68, y: 92},
	typeOfCoin:"bonus",
	animSheet: new ig.AnimationSheet( 'media/pqbonus.png', 68, 92 ),

	name: "pqbonus",

	init: function( x, y, settings ) {
		this.parent( x, y, settings );

	},
	update: function() {
		this.parent();
		if (ig.game.player.health > 3) this.pos.y = 0; // don,t let it fall if player healthy
		if (this.lifeTimer.delta() > 0 ) {
			this.kill();
		}
	}
});
});