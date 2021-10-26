ig.module(
	'game.entities.david'
)
.requires(
	'game.entities.baseplayer'
)
.defines(function(){

EntityDavid = EntityBaseplayer.extend({
	name: "david",
	animSheet: new ig.AnimationSheet('media/david.png', 75, 100),
	update: function() {
		this.parent();
	},
	check: function(other){
		this.parent();
	}



});
});