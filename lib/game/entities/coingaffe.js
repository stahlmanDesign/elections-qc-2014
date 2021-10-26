ig.module(
	'game.entities.coingaffe'
)
.requires(
	'game.entities.coin'
)
.defines(function(){

EntityCoingaffe = EntityCoin.extend({
	size: {x: 100, y: 70},
	typeOfCoin:"gaffe",
	animSheet: new ig.AnimationSheet( 'media/banane.png', 100, 70 ),

	name: "gaffe",

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.vel.x = 100
	},
	update: function() {
		this.parent();
		/*if (ig.game.player.health < 3) this.pos.y = 0; // don't let it fall if player almost dead

if (this.lifeTimer.delta() > 0 ) {
			this.kill();
		}
*/
	}/*
,
	receiveDamage: function(amount, from) {}, // override
	check: function(other){
		if (other instanceof EntityBaseplayer){

			other.vel.x = !other.flip ? 3600 : -3600
		}
	}
*/
});
});