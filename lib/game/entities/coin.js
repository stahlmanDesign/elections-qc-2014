ig.module(
	'game.entities.coin'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityCoin = ig.Entity.extend({
	size: {x: 128, y: 128},
	friction: {x: 0, y: 0},
	maxVel: {x: 200, y: 300},

	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.BOTH, // Check against friendly
	collides: ig.Entity.COLLIDES.PASSIVE,
	bounciness:1,
	animSheet: new ig.AnimationSheet( 'media/coin.png', 36, 36 ),
	sfxCollect: new ig.Sound( 'media/sounds/coin.*' ),
	sfxMinusone: new ig.Sound( 'media/sounds/minusone.*' ),
	sfxHealth: new ig.Sound( 'media/sounds/health.*' ),
	pointLimit: 0,
	typeOfCoin:"parti",
	lifeTimer:null,
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.maxVel.y += Math.random() * 100
		this.addAnim( 'idle', 0.1, [0] );
		this.lifeTimer = new ig.Timer((Math.random()*1)+3)
	},


	update: function() {
		this.parent();

	},


	kill: function(){
		this.parent();
		//if (this.typeOfCoin == "parti"){
			//var coinType = ig.game.playerStats[ig.game.currentChef][this.typeOfCoin]; // spawns same type of coin but possibly for a different chef, depending on who is chef when kill()
			//console.log("spawning " + this.name)
			//if (this.name == "bonus") alert ("bonus to be created")
			if (this.typeOfCoin != "pointIndicator") ig.game.spawnEntity("EntityCoin" + this.name,(Math.random()*1200)+100,80); // either heart, plus or minus
		//}else{
			//console.log("spawning " + this.name)
			//ig.game.spawnEntity("EntityCoin" + this.name,Math.random()*1500,0); // bonus or gaffe
		//}

	},
	check: function(other){
		//console.log(this.name)
		if (other instanceof EntityBaseplayer){

			if (this.name == ig.game.playerStats[other.name].parti) {
				other.giveCoins(1);
				this.sfxCollect.play();
				this.pointLimit ++
				ig.game.spawnEntity("EntityCoinplusone",this.pos.x,this.pos.y-100);
				if (this.pointLimit > 5 ) this.kill();
			}else if (this.name != ig.game.playerStats[other.name].parti && this.typeOfCoin == "parti") {
				other.giveCoins(-1);
				this.sfxMinusone.play();
				this.pointLimit ++
				ig.game.spawnEntity("EntityCoinminusone",this.pos.x,this.pos.y-100);
				if (this.pointLimit > 2 ) this.kill();
			}

			if (this.name == ig.game.playerStats[other.name].gaffe){
				//console.log(this.name + ", " + ig.game.playerStats[other.name].gaffe)

				other.receiveDamage(1,this)

				//other.vel.x = !other.flip ? 3600 : -3600
				//ig.game.spawnEntity("EntityCoinhealth",this.pos.x,other.pos.y-100);
			}

			if (this.name == ig.game.playerStats[other.name].bonus && other.health < other.maxHealth){
				other.health++
				this.sfxHealth.play();
				ig.game.spawnEntity("EntityCoinhealth",this.pos.x,other.pos.y-100);
			}

		}
	}
});

});