ig.module(
	'game.entities.coinqsbonus'
)
.requires(
	'game.entities.coin'
)
.defines(function(){

EntityCoinqsbonus = EntityCoin.extend({
	size: {x: 68, y: 92},
	typeOfCoin:"bonus",
	animSheet: new ig.AnimationSheet( 'media/qsbonus.png', 68, 92 ),

	name: "qsbonus",

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