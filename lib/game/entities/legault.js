ig.module(
	'game.entities.legault'
)
.requires(
	'game.entities.baseplayer'
)
.defines(function(){

EntityLegault = EntityBaseplayer.extend({
	name: "legault",
	animSheet: new ig.AnimationSheet('media/legault.png', 75, 100),
	update: function() {
		this.parent();
	},
	check: function(other){
		this.parent();
	}



});
});