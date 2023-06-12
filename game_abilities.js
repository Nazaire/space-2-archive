/*  UPCOMING
- Laser/Cyclops
- Faster turning
- Faster velocity
- Homing
- Bombs
*/

var abilitiesStore = {
  "BOOST": {
    name: "BOOST",
    owned:true,
    description:"Go fast!"
  },
  "CLOAK": {
    name: "CLOAK",
    owned:false,
    description:"Sneaky beaky like",
    cost:100
  },
  "LASERSIGHT": {
    name: "LASERSIGHT",
    owned:false,
    description:"BOOM! HEADSHOT!",
    cost:250
  },
  "SHIELD": {
    name: "SHIELD",
    owned:false,
    description:"Can't touch this!",
    cost:500
  },
  
  "FASTRELOAD": {
    name: "FASTRELOAD",
    owned:false,
    description:"Sleight of hand",
    cost:750
  },
  
  "PIERCING": {
    name: "PIERCING",
    owned:false,
    description:"Space kebab",
    cost:1000
  },
  
  "SPREADSHOT": {
    name: "SPREADSHOT",
    owned:false,
    description:"Three is better than one",
    cost:1250
  },
  
  "FLASH": {
    owned:false,
    name: "FLASH",
    description:"For those LoL fans",
    cost:1500
  },
  
  
  "REBOUND": {
    name: "REBOUND",
    owned:false,
    description:'*Calculated*',
    cost:1750
  },
  
  "SHRINK": {
    name: "SHRINK",
    owned:false,
    description:'Pick on someone your own size!',
    cost:2000
  },
  
  "HODGES": {
    name: "HODGES",
    owned:false,
    description:'I go backwards!',
    cost:2400
  },
  
  "FREEZE": {
    name: "FREEZE",
    owned:false,
    description:'Take the red pill',
    cost:2800
  },
  
  "RATTLING": {
    name: "GATTLING",
    owned:false,
    description:"Pretty much a negev",
    cost:3200
  },
  
  "RICOCHET": {
    name: "RICOCHET",
    owned:false,
    description:'Chain reactions!',
    cost:3600
  },
  
  "NUKE": {
    name: "NUKE",
    owned:false,
    description:'Donald Trumps fav <3',
    cost:4000
  },
};

var abilities = {
  "BOOST": function () {
    this.name = "BOOST";
    this.type = "ACTIVE";
    
    this.timer = 0;
    this.duration = 3; //Seconds
    this.cooldown = 5;
    this.active = false;
    this.direction = 0; //IF 1 then forwards, if -1 then backwards;
    
    this.activate = function (player,dt) {
      if (!this.active && this.timer === 0) {
        //console.log("Activating");
        this.active = true;
        this.timer = this.duration;
        
        //Attributes custom to ability
        if (player.velocity < 0) {
          this.direction = -1;
        } else {
          this.direction = 1;
        }
        player.acceleration = player.thrust * 1.5 * this.direction;
        player.terminalvelocity = 300;
        player.dustps = 20;
        player.dustv = 40;
        
        player.shouldDrawDust = true; //In case not pressing forwards
      }
    };
    this.deactivate = function (player,dt) {
      //console.log("Deactivating");
      this.active = false;
      this.timer = this.cooldown;
      this.direction = 0;
      //Attributes custom to ability
      player.fnet = player.thrust;
      player.dustps = 8;
      player.dustv = 25;
      player.terminalvelocity = 200;
    };
    this.handler = function (player,dt) {
      if (this.active) {
        if (this.timer === 0) { //If its outlived its duration
          this.deactivate(player);
        } else { //Still Active
          player.acceleration = player.thrust * 1.5 * this.direction;
          player.shouldDrawDust = true;
        }
      }
      
      this.timer -= dt;
      if (this.timer < 0) this.timer = 0;
    };
  },
  
  "LASERSIGHT": function () {
    this.name = "LASERSIGHT";
    this.type = "PASSIVE";
    
    this.timer = 0; //Value between 0 and 1
    
    this.activate = function (player) {
      //Do nothing because its a passive
    };
    this.deactivate = function (player) {
      //Do nothing because its a passive
    };
    this.handler = function (player) {
      //Do passive things
    };
  },
  
  "CLOAK": function () {
    this.name = "CLOAK";
    this.type = "ACTIVE";
    
    this.timer = 0;
    this.duration = 5; //Seconds
    this.cooldown = 10;
    this.opacity = 0.5;
    if (gamemode === "VERSUS") this.opacity = 0;
    this.active = false;
    
    this.activate = function (player,dt) {
      if (!this.active && this.timer === 0) {
        this.active = true;
        this.timer = this.duration;
        
        //Attributes custom to ability
        
        player.opacity = this.opacity;
        player.shouldDrawDust = false; //No dust
      }
    };
    this.deactivate = function (player,dt) {
      this.active = false;
      this.timer = this.cooldown;
        
      //Attributes custom to ability
      player.opacity = 1;
    };
    this.handler = function (player,dt) {
      if (this.active) {
        
        if (this.timer === 0) { //If its outlived its duration
          this.deactivate(player);
        } else { //Still Active
          //player.opacity = 0.5;
          player.shouldDrawDust = false; //No dust
        }
      }
      
      this.timer -= dt;
      if (this.timer < 0) this.timer = 0;
    };
  },
  
  "FLASH": function () {
    this.name = "FLASH";
    this.type = "ACTIVE";
    
    this.timer = 0;
    this.cooldown = 3;
    
    this.activate = function (player,dt) {
      if (this.timer === 0) {
        this.timer = this.cooldown; //has deactivation in activation
        var radius, opacity;
        //Attributes custom to ability
        for (du = 0; du < 5; du++) {
          radius = (Math.random()*3)+3;
          opacity = (Math.random()*0.2)+0.4;
          Game.objects[3].push(new Class.Dust(player.x,player.y,radius,player.trail,opacity,25,2*Math.random()*Math.PI));
        }
        player.x += Math.cos(player.direction)*150;
        player.y += Math.sin(player.direction)*150;
        for (du = 0; du < 5; du++) {
          radius = (Math.random()*3)+3;
          opacity = (Math.random()*0.2)+0.6;
          Game.objects[3].push(new Class.Dust(player.x,player.y,radius,player.trail,opacity,25,2*Math.random()*Math.PI));
        }
      }
    };
    this.deactivate = function (player,dt) {
      //Not needed
    };
    this.handler = function (player,dt) {
      this.timer -= dt;
      if (this.timer < 0) this.timer = 0;
    };
  },
  
  "SPREADSHOT": function () {
    this.name = "SPREADSHOT";
    this.type = "ACTIVE";
    
    this.timer = 0;
    this.cooldown = 6;
    
    this.activate = function (player,dt) {
      if (this.timer === 0) {
        this.timer = this.cooldown; //Deactivate
        
        //Attributes custom to ability
        var _x = player.x + (Math.cos(player.shape[0].a + player.direction) * player.shape[0].d);
				var _y = player.y + (Math.sin(player.shape[0].a + player.direction) * player.shape[0].d);
				console.log("Firing spreadshot");
				Sounds["shot1.mp3"].play();
				
				if (player.fill === "PRISM") {
				  Game.objects[2].push(new Class.Bullet(_x,_y,player.trail,300,player.direction,player.id));
          Game.objects[2].push(new Class.Bullet(_x,_y,player.trail,300,player.direction + Math.PI/25,player.id));
          Game.objects[2].push(new Class.Bullet(_x,_y,player.trail,300,player.direction - Math.PI/25,player.id));
				} else {
          Game.objects[2].push(new Class.Bullet(_x,_y,player.fill,300,player.direction,player.id));
          Game.objects[2].push(new Class.Bullet(_x,_y,player.fill,300,player.direction + Math.PI/25,player.id));
          Game.objects[2].push(new Class.Bullet(_x,_y,player.fill,300,player.direction - Math.PI/25,player.id));
				}
        player.bulletTimer = 1/player.bulletps;
      }
    };
    this.deactivate = function (player,dt) {
      //Not needed
    };
    this.handler = function (player,dt) {
      this.timer -= dt;
      if (this.timer < 0) this.timer = 0;
    };
  },
  
  "FASTRELOAD": function () {
    this.name = "FASTRELOAD";
    this.type = "PASSIVE";
    
    this.timer = 0; //Value between 0 and 1
    this.activate = function (player,dt) {
      //Do nothing because its a passive
    };
    this.deactivate = function (player,dt) {
      //Do nothing because its a passive
    };
    this.handler = function (player,dt) {
      //Do passive things
      player.bulletps = 1.5;
    };
  },
  
  "SHIELD": function () {
    this.name = "SHIELD";
    this.type = "ACTIVE";
    
    this.timer = 0;
    this.duration = 3; //Seconds
    this.cooldown = 10;
    this.active = false;
    
    this.activate = function (player,dt) {
      if (!this.active && this.timer === 0) {
        //console.log("Activating");
        this.active = true;
        this.timer = this.duration;
        
        //Attributes custom to ability
        player.vulnerable = 1;
      }
    };
    this.deactivate = function (player,dt) {
      //console.log("Deactivating");
      this.active = false;
      this.timer = this.cooldown;
    };
    this.handler = function (player,dt) {
      if (this.active) {
        if (this.timer === 0) { //If its outlived its duration
          this.deactivate(player);
        } else { //Still Active
          player.vulnerable = 1;
        }
      }
      this.timer -= dt;
      if (this.timer < 0) this.timer = 0;
    };
  },
  
  "PIERCING": function () {
    this.name = "PIERCING";
    this.type = "PASSIVE";
    
    this.timer = 0; //Value between 0 and 1
    this.activate = function (player,dt) {
      //Do nothing because its a passive
    };
    this.deactivate = function (player,dt) {
      //Do nothing because its a passive
    };
    this.handler = function (player,dt) {
      //Do passive things
    };
  },
  
  "HODGES": function () {
    this.name = "HODGES";
    this.type = "PASSIVE";
    
    this.timer = 0; //Value between 0 and 1
    this.activate = function (player,dt) {
      //Do nothing because its a passive
    };
    this.deactivate = function (player,dt) {
      //Do nothing because its a passive
    };
    this.handler = function (player,dt) {
      //Do passive things
    };
  },
  
  "RATTLING": function () {
    this.name = "GATTLING";
    this.type = "ACTIVE";
    
    this.timer = 0;
    this.duration = 3; //Seconds
    this.cooldown = 10;
    this.active = false;
    
    this.bulletps = 5;
    this.bulletTimer = 0;
    
    this.activate = function (player,dt) {
      if (!this.active && this.timer === 0) {
        //console.log("Activating");
        this.active = true;
        this.timer = this.duration;
        
        var _x = player.x + (Math.cos(player.shape[0].a + player.angle) * player.shape[0].d);
			  var _y = player.y + (Math.sin(player.shape[0].a + player.angle) * player.shape[0].d);
						      
				Sounds["shot1.mp3"].play();
				
				if (player.fill === "PRISM") {
				  Game.objects[2].push(new Class.Bullet(_x,_y,player.trail,300,player.direction,player.id));
				}	else {	      
          Game.objects[2].push(new Class.Bullet(_x,_y,player.fill,300,player.direction,player.id));
				}
        
        this.bulletTimer = 1/this.bulletps;
        player.bulletTimer = 1/player.bulletps;
      }
    };
    this.deactivate = function (player,dt) {
      //console.log("Deactivating");
      this.active = false;
      this.timer = this.cooldown;
      
      player.bulletTimer = 1/player.bulletps;
      this.bulletTimer = 0;
    };
    this.handler = function (player,dt) {
      if (this.active) {
        
        player.lastbullet = 1/player.bulletps; //Dont let the player shoot
        
        if (this.timer === 0) { //If its outlived its duration
          this.deactivate(player);
        } else { //Still Active
          if (this.bulletTimer === 0) {
            var _x = player.x + (Math.cos(player.shape[0].a + player.angle) * player.shape[0].d);
						var _y = player.y + (Math.sin(player.shape[0].a + player.angle) * player.shape[0].d);
						      
						Sounds["shot1.mp3"].play();
						      
            if (player.fill === "PRISM") {
    				  Game.objects[2].push(new Class.Bullet(_x,_y,player.trail,300,player.direction,player.id));
    				}	else {	      
              Game.objects[2].push(new Class.Bullet(_x,_y,player.fill,300,player.direction,player.id));
    				}
            this.bulletTimer = 1/this.bulletps;
          }
          this.bulletTimer -= dt;
          if (this.bulletTimer < 0) this.bulletTimer = 0;
        }
      }
      
      this.timer -= dt;
      if (this.timer < 0) this.timer = 0;
    };
  },
  
  "RICOCHET": function () {
    this.name = "RICOCHET";
    this.type = "PASSIVE";
    
    this.timer = 0; //Value between 0 and 1
    this.activate = function (player,dt) {
      //Do nothing because its a passive
    };
    this.deactivate = function (player,dt) {
      //Do nothing because its a passive
    };
    this.handler = function (player,dt) {
      //Do passive things
    };
  },
  
  "REBOUND": function () {
    this.name = "REBOUND";
    this.type = "PASSIVE";
    
    this.timer = 0; //Value between 0 and 1
    this.activate = function (player,dt) {
      //Do nothing because its a passive
    };
    this.deactivate = function (player,dt) {
      //Do nothing because its a passive
    };
    this.handler = function (player,dt) {
      //Do passive things
    };
  },
  
  "SHRINK": function () {
    this.name = "SHRINK";
    this.type = "ACTIVE";
    
    this.timer = 0;
    this.duration = 5; //Seconds
    this.cooldown = 5;
    this.active = false;
    
    this.activate = function (player,dt) {
      if (!this.active && this.timer === 0) {
        this.active = true;
        this.timer = this.duration;
        
        //Attributes custom to ability
        
        player.size = 0.6;
      }
    };
    this.deactivate = function (player,dt) {
      this.active = false;
      this.timer = this.cooldown;
        
      //Attributes custom to ability
      player.size = 1;
    };
    this.handler = function (player,dt) {
      if (this.active) {
        
        if (this.timer === 0) { //If its outlived its duration
          this.deactivate(player);
        } else { //Still Active
          
        }
      }
      
      this.timer -= dt;
      if (this.timer < 0) this.timer = 0;
    };
  },
  
  "FREEZE": function () {
    this.name = "FREEZE";
    this.type = "ACTIVE";
    
    this.timer = 0;
    this.duration = 5; //Seconds
    if (gamemode === "VERSUS") this.duration = 1;
    this.cooldown = 10;
    this.active = false;
    
    this.activate = function (player,dt) {
      if (!this.active && this.timer === 0) {
        this.active = true;
        this.timer = this.duration;
        
        //Attributes custom to ability
        for (e = 0, el = Game.objects[1].length; e < el; e++) {
          Game.objects[1][e].frozen = true;
        }
        for (e = 0, el = Game.objects[0].length; e < el; e++) {
          if (player.id !== Game.objects[0][e].id) Game.objects[0][e].frozen = true;
        }
      }
    };
    this.deactivate = function (player,dt) {
      this.active = false;
      this.timer = this.cooldown;
        
      //Attributes custom to ability
        for (e = 0, el = Game.objects[1].length; e < el; e++) {
          Game.objects[1][e].frozen = false;
        }
        for (e = 0, el = Game.objects[0].length; e < el; e++) {
          if (player.id !== Game.objects[0][e].id) Game.objects[0][e].frozen = false;
        }
    };
    this.handler = function (player,dt) {
      if (this.active) {
        
        if (this.timer === 0) { //If its outlived its duration
          this.deactivate(player);
        } else { //Still Active
          
        }
      }
      
      this.timer -= dt;
      if (this.timer < 0) this.timer = 0;
    };
  },
  
  "NUKE": function () {
    this.name = "NUKE";
    this.type = "ACTIVE";
    
    this.timer = 0;
    this.cooldown = 15;
    
    this.activate = function (player,dt) {
      if (this.timer === 0) {
        this.timer = this.cooldown; //Put on cooldown
        
        //Attributes custom to ability
        var _x = player.x + (Math.cos(player.shape[0].a + player.direction) * player.shape[0].d);
				var _y = player.y + (Math.sin(player.shape[0].a + player.direction) * player.shape[0].d);
					
				Sounds["shot1.mp3"].play();
			  if (player.fill === "PRISM") {
			    Game.objects[2].push(new Class.Nuke(_x,_y,player.fill,player.direction,player.id));
			  } else {
          Game.objects[2].push(new Class.Nuke(_x,_y,player.fill,player.direction,player.id));
			  }
        player.bulletTimer = 1/player.bulletps;
      } else if (this.timer <= this.cooldown - 0.2) {
        //console.log("FINDING NUKE");
        var object;
        for (p = 0, pl = Game.objects[2].length; p < pl; p++) {
          object = Game.objects[2][p];
          //console.log(object.class,object.creator,player.id);
          if (object.class === "object.projectile.nuke" && object.creator === player.id) {
            console.log("DESTROY THAT NUKE");
            object.destroy();
            Game.objects[2].splice(p,1);
            p--;
            pl--;
          }
        }
      }
    };
    this.deactivate = function (player,dt) {
      //Not needed
    };
    this.handler = function (player,dt) {
      this.timer -= dt;
      if (this.timer < 0) this.timer = 0;
    };
  },
  
};