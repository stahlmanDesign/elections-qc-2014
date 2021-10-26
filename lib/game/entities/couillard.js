ig.module(
	'game.entities.couillard'
)
.requires(
	'game.entities.baseplayer'
)
.defines(function(){

EntityCouillard = EntityBaseplayer.extend({
	name: "couillard",
	animSheet: new ig.AnimationSheet('media/couillard.png', 75, 100),
	update: function() {
		this.parent();
	},
	check: function(other){
		this.parent();
	}



});
});