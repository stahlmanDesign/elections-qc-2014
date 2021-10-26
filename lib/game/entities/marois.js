ig.module(
	'game.entities.marois'
)
.requires(
	'game.entities.baseplayer'
)
.defines(function(){

EntityMarois = EntityBaseplayer.extend({
	name: "marois",
	animSheet: new ig.AnimationSheet('media/marois.png', 75, 100),
	update: function() {
		this.parent();
	},
	check: function(other){
		this.parent();
	}



});
});