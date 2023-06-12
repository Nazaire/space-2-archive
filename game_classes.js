
var Class = {
  Game: function () {
    this.class = "game";
    console.log("Class.game created");
    //console.log("Cancelling Animation Frame",requestID);
    clearTimeout(requestID);
    //cancelAnimationFrame(requestID);
    //SET UP
    this.fps = 60;
    this.ability = ability;
    this.gamemode = gamemode;
    var game = this;
    
    this.background = null;
    this.bgctx = null;
    this.bgobjects = [];
    this.stage = 0; //0 - Initialize, 1 - Running, 2 - Resetting
    this.paused = false;
    this.then = new Date();
    this.round = 1;
    this.objects = [
      [],  //Players
      [], //Enemies
      [], //Projectiles
      [] //Other
      ];
    this.loop = [//0 - Initialize, 1 - Running, 2 - Resetting
      function(){
        //console.log("init loop");
        var dt = (new Date() - game.then)/1000;
        if (dt > 1.5) {
          game.then = new Date();
          game.stage = 1; //Go to next stage
        } else {
          if (!game.background) { //Create the background canvas and objects
            console.log("Creating background");
            game.background = document.createElement('canvas');
            game.bgctx = game.background.getContext('2d');
            $(game.background).attr("width",cw+"px");
            $(game.background).attr("height",ch+"px");
            
            for (i = 0; i < 30; i++) {// Create stars
              game.bgobjects.push(new Class.Star(Math.random()*cw,Math.random()*ch,Math.random()*3 + 1,Math.random()*0.2 + 0.6));
            }
            
            //Choose planet
            var planetrnd = Math.random();
            var purl = "planets/moon.png";
            var _bottom = 0; var _top = 0;
            
            
            for (var t in planets) {
              _top = _bottom + planets[t];
              if (planetrnd > _bottom && planetrnd <= _top) { //In range
                purl = "planets/" + t + ".png";
              }
              _bottom = _top;
            }
            
            console.log("Creating planet - " + purl,planetrnd);
            game.bgobjects.push(new Class.Planet(Math.random()*cw,Math.random()*ch,purl));
          } else if (game.objects[0].length === 0) {
            console.log("Creating entities");
            switch (game.gamemode) {
              case "SINGLEPLAYER":
                game.objects[0].push(new Class.Player(0,cw/2,ch/2,0,user.colors[0],user.colors[1],user.controls[0],ability));
                game.objects[1].push(new Class.Enemy(1,Math.random()*ch,0,"#FFC55F",0));
                break;
              case "CO-OP":
                game.objects[0].push(new Class.Player(0,cw/2 - 100,ch/2,0,user.colors[0],user.colors[1],user.controls[0],ability));
                game.objects[0].push(new Class.Player(1,cw*1/2 + 100,ch*1/2,0,user.colors[2],user.colors[3],user.controls[1],ability));
                game.objects[1].push(new Class.Enemy(1,Math.random()*ch,0,"#FFC55F",0));
                break;
              case "VERSUS":
                game.objects[0].push(new Class.Player(0,cw/2 - 100,ch/2,0,user.colors[0],user.colors[1],user.controls[0],ability));
                game.objects[0].push(new Class.Player(1,cw*1/2 + 100,ch*1/2,0,user.colors[2],user.colors[3],user.controls[1],ability));
                break;
            }
          } else { //Draw bg objects on background so the image can load
            Draw.clean(game.bgctx);
            for (i = 0, il = game.bgobjects.length; i < il; i++) {
              var object = game.bgobjects[i];
              Draw[object.class](game.bgctx,object);
            }
          }
          Draw.clean();
          Draw.text(Math.ceil(3-(2*dt)),"fff-forward",32,"white");
        }
        requestID = setTimeout(game.loop[game.stage],1000/game.fps);
        //requestID = requestAnimationFrame(game.loop[game.stage]);
      },
      function(){
        //console.log("run loop");
        var dt = (new Date() - game.then)/1000;
        if (!game.paused) {
        var object, bounds; //Define the variables ill need
        Draw.background(game.background);
        // Draw.fps(Math.round(1/dt));
        
        //LOOP THROUGH DUST DEBRIS
        for (i = 0, il = game.objects[3].length; i < il; i++) {
          object = game.objects[3][i];
          
          if (object.opacity > 0) {
            object.control(dt);
            Draw[object.class](object);
          } else {
            game.objects[3].splice(i,1);
            i--;
            il--;
          }
        }
        
        //LOOP THROUGH ENEMIES
        for (i = 0, il = game.objects[1].length; i < il; i++) {
          object = game.objects[1][i];
          bounds = object.isInBounds(true);
          //console.log(bounds);
          switch (bounds) {
            case "left": //Left
              object.x = 1;
              object.velocity *= 0.5;
              object.direction = Math.PI - object.direction;
              break;
            case "right": //Right
              object.x = cw-1;
              object.velocity *= 0.5;
              object.direction = Math.PI-object.direction;
              break;
            case "top": //Top
              object.y = 1;
              object.velocity *= 0.5;
              object.direction = -object.direction;
              break;
            case "bottom": //Bottom
              object.y = ch-1;
              object.velocity *= 0.5;
              object.direction = -object.direction;
              break;
          }
          if (!object.frozen) object.control(dt);
          Draw.shape(object);
        }
        
        //LOOP THROUGH PLAYERS
        for (i = 0, il = game.objects[0].length; i < il; i++) {
          object = game.objects[0][i];
          //console.log("LOOP",object.id);
          if (object.checkCollision()) {
            //console.log("Removing",object.id);
            object.destroy();
            game.objects[0].splice(i,1);
            i--;
            il--;
          } else {
          //console.log(bounds);
          bounds = object.isInBounds(true);
          switch (bounds) {
            case "left": //Left
              object.x = 1;
              if (object.ability.name !== "HODGES") object.velocity *= 0.5;
              object.direction = Math.PI - object.direction;
              break;
            case "right": //Right
              object.x = cw-1;
              if (object.ability.name !== "HODGES") object.velocity *= 0.5;
              object.direction = Math.PI-object.direction;
              break;
            case "top": //Top
              object.y = 1;
              if (object.ability.name !== "HODGES") object.velocity *= 0.5;
              object.direction = -object.direction;
              break;
            case "bottom": //Bottom
              object.y = ch-1;
              if (object.ability.name !== "HODGES") object.velocity *= 0.5;
              object.direction = -object.direction;
              break;
          }
          if (!object.frozen)  object.control(dt);
          if (object.ability.name === "LASERSIGHT") {
            var lasercolor = 'red';
            if (object.fill === "PRISM") lasercolor = object.trail;
            Draw.line(0.5,lasercolor,2,[{
              x: object.x + Math.cos(object.direction)*object.shape[0].d,
              y: object.y + Math.sin(object.direction)*object.shape[0].d
            }, {
              x: object.x + Math.cos(object.direction)*cw*1.5,
              y: object.y + Math.sin(object.direction)*cw*1.5
            }]);
          }
          Draw.shape(object);
          }
        }
        
        //LOOP THROUGH PROJECTILES
        for (i = 0, il = game.objects[2].length; i < il; i++) {
          object = game.objects[2][i];
          if (object.checkCollision()) { //Has collided?
            if (object.ricochet) {
              object.direction = 2 * Math.PI * Math.random();
            } else {
            object.destroy();
            game.objects[2].splice(i,1);
            i--;
            il--;
            }
          } else { //The typical loop
            if (object.rebound && !object.hasRebounded) { //Check if it can rebound
              bounds = object.isInBounds(true);
              switch (bounds) {
                case "left": //Left
                  object.x = 1;
                  object.direction = Math.PI - object.direction;
                  object.hasRebounded = true;
                  break;
                case "right": //Right
                  object.x = cw-1;
                  object.direction = Math.PI-object.direction;
                  object.hasRebounded = true;
                  break;
                case "top": //Top
                  object.y = 1;
                  object.direction = -object.direction;
                  object.hasRebounded = true;
                  break;
                case "bottom": //Bottom
                  object.y = ch-1;
                  object.direction = -object.direction;
                  object.hasRebounded = true;
                  break;
              }
              object.control(dt);
              Draw[object.class](object);
            } else if (!object.isInBounds()) {
              //Must be out of bounds
              object.destroy();
              game.objects[2].splice(i,1);
              i--;
              il--;
            } else {
              object.control(dt);
              Draw[object.class](object);
            }
          }
        }
        
        //Draw the dials
        for (i = 0, il = game.objects[0].length; i < il; i++) {
          if (game.objects[0][i].ability.type === "ACTIVE") {
            if (game.objects[0][i].id === 0) {
              Draw.meter(50,ch - 50,game.objects[0][i]);
            } else {
              Draw.meter(cw - 50,ch - 50,game.objects[0][i]);
            }
          }
        }
        switch (game.gamemode) {
          case "SINGLEPLAYER":
          case "CO-OP":
            if (game.objects[0].length === 0) { //Players are dead
              game.stage = 2;
              $("#gameButton").removeClass("selected");
            } else if (game.objects[1].length === 0) {
              game.objects[1].push(new Class.Enemy(1,Math.random()*ch,0,"#FFC55F",0));
              game.round++;
            }
            break;
          case "VERSUS":
            if (game.objects[0].length === 1) { //Only one player left!
              game.stage = 2;
              $("#gameButton").removeClass("selected");
            }
            break;
        }
        
        } else { //The game is paused
          Draw.text("Paused","fff-forward",32,"white");
          Draw.text("Round "+game.round,"fff-forward",28,"white",50);
        }
        game.then = new Date();
        requestID = setTimeout(game.loop[game.stage],1000/game.fps);
        //requestID = requestAnimationFrame(game.loop[game.stage]);
      },
      function(){
        //console.log("reset loop");
        var dt = (new Date() - game.then)/1000;
        var object, bounds; //Define the variables ill need
        Draw.background(game.background);
        // Draw.fps(Math.round(1/dt));
        
        //LOOP THROUGH DUST DEBRIS
        for (i = 0, il = game.objects[3].length; i < il; i++) {
          object = game.objects[3][i];
          
          if (object.opacity > 0) {
            object.control(dt);
            Draw[object.class](object);
          } else {
            game.objects[3].splice(i,1);
            i--;
            il--;
          }
        }
        
        //LOOP THROUGH ENEMIES
        for (i = 0, il = game.objects[1].length; i < il; i++) {
          object = game.objects[1][i];
          bounds = object.isInBounds(true);
          //console.log(bounds);
          switch (bounds) {
            case "left": //Left
              object.x = 1;
              object.velocity *= 0.5;
              object.direction = Math.PI - object.direction;
              break;
            case "right": //Right
              object.x = cw-1;
              object.velocity *= 0.5;
              object.direction = Math.PI-object.direction;
              break;
            case "top": //Top
              object.y = 1;
              object.velocity *= 0.5;
              object.direction = -object.direction;
              break;
            case "bottom": //Bottom
              object.y = ch-1;
              object.velocity *= 0.5;
              object.direction = -object.direction;
              break;
          }
          if (!object.frozen) object.control(dt);
          Draw.shape(object);
        }
        
        //LOOP THROUGH PLAYERS
        for (i = 0, il = game.objects[0].length; i < il; i++) {
          object = game.objects[0][i];
          //console.log("LOOP",object.id);
          if (object.checkCollision()) {
            //console.log("Removing",object.id);
            object.destroy();
            game.objects[0].splice(i,1);
            i--;
            il--;
          } else {
          //console.log(bounds);
          bounds = object.isInBounds(true);
          switch (bounds) {
            case "left": //Left
              object.x = 1;
              if (object.ability.name !== "HODGES") object.velocity *= 0.5;
              object.direction = Math.PI - object.direction;
              break;
            case "right": //Right
              object.x = cw-1;
              if (object.ability.name !== "HODGES") object.velocity *= 0.5;
              object.direction = Math.PI-object.direction;
              break;
            case "top": //Top
              object.y = 1;
              if (object.ability.name !== "HODGES") object.velocity *= 0.5;
              object.direction = -object.direction;
              break;
            case "bottom": //Bottom
              object.y = ch-1;
              if (object.ability.name !== "HODGES") object.velocity *= 0.5;
              object.direction = -object.direction;
              break;
          }
          if (!object.frozen)  object.control(dt);
          if (object.ability.name === "LASERSIGHT") {
            var lasercolor = 'red';
            if (object.fill === "PRISM") lasercolor = object.trail;
            Draw.line(0.5,lasercolor,2,[{
              x: object.x + Math.cos(object.direction)*object.shape[0].d,
              y: object.y + Math.sin(object.direction)*object.shape[0].d
            }, {
              x: object.x + Math.cos(object.direction)*cw*1.5,
              y: object.y + Math.sin(object.direction)*cw*1.5
            }]);
          }
          Draw.shape(object);
          }
        }
        
        //LOOP THROUGH PROJECTILES
        for (i = 0, il = game.objects[2].length; i < il; i++) {
          object = game.objects[2][i];
          if (object.checkCollision()) { //Has collided?
            if (object.ricochet) {
              object.direction = 2 * Math.PI * Math.random();
            } else {
            object.destroy();
            game.objects[2].splice(i,1);
            i--;
            il--;
            }
          } else { //The typical loop
            if (object.rebound && !object.hasRebounded) { //Check if it can rebound
              bounds = object.isInBounds(true);
              switch (bounds) {
                case "left": //Left
                  object.x = 1;
                  object.direction = Math.PI - object.direction;
                  object.hasRebounded = true;
                  break;
                case "right": //Right
                  object.x = cw-1;
                  object.direction = Math.PI-object.direction;
                  object.hasRebounded = true;
                  break;
                case "top": //Top
                  object.y = 1;
                  object.direction = -object.direction;
                  object.hasRebounded = true;
                  break;
                case "bottom": //Bottom
                  object.y = ch-1;
                  object.direction = -object.direction;
                  object.hasRebounded = true;
                  break;
              }
              object.control(dt);
              Draw[object.class](object);
            } else if (!object.isInBounds()) {
              //Must be out of bounds
              object.destroy();
              game.objects[2].splice(i,1);
              i--;
              il--;
            } else {
              object.control(dt);
              Draw[object.class](object);
            }
          }
        }
        
        //Draw the dials
        for (i = 0, il = game.objects[0].length; i < il; i++) {
          if (game.objects[0][i].ability.type === "ACTIVE") {
            if (game.objects[0][i].id === 0) {
              Draw.meter(50,ch - 50,game.objects[0][i]);
            } else {
              Draw.meter(cw - 50,ch - 50,game.objects[0][i]);
            }
          }
        }
        switch (game.gamemode) {
          case "SINGLEPLAYER":
          case "CO-OP":
            Draw.text("Game Over","fff-forward",32,"white");
            Draw.text("Round "+game.round,"fff-forward",28,"white",50);
            break;
          case "VERSUS":
            Draw.text("Game Over","fff-forward",32,game.objects[0][0].fill);
            break;
        }
        
        game.then = new Date();
        requestID = setTimeout(game.loop[game.stage],1000/game.fps);
        //requestID = requestAnimationFrame(game.loop[game.stage]);
      }
      ];
  },
  Object: function (x,y) {
    this.class = "object";
    this.x = x || 0;
    this.y = y || 0;
  },
  Planet: function (x,y,url) {
    Class.Object.call(this,x,y); //Is type Object
    this.class += ".planet";
    
    this.url = url;
    var parent = this;
    this.image = new Image();
    this.image.src = url;
    this.image.onload = function() {
      parent.width = this.width;
      parent.height = this.height;
      var _w = ((Math.random()*0.2)+0.2)*cw; //Try make it smaller
      if (_w < this.width) {
        var scale = _w/this.width;
        parent.width = _w;
        parent.height = scale*this.height;
      }
    };
  },
  Star: function (x,y,radius,opacity) {
    Class.Object.call(this,x,y);
    this.class += ".star";
    
    this.radius = radius;
    this.opacity = opacity;
  },
  Projectile: function(x,y,fill,velocity,direction,creator) {
    Class.Object.call(this,x,y);
    this.class += ".projectile";
    
    this.fill = fill || "white";
    this.velocity = velocity || 0; //Pixels ps
    this.direction = direction || 0;
    this.creator = creator;
  },
  Shape: function(x,y,fill,opacity,velocity,direction,angle) {
    Class.Object.call(this,x,y);
    this.class += ".shape";
    //console.log(fill);
    this.fill = fill || "white";
    this.opacity = opacity || 1;
    this.velocity = velocity || 0;
    this.direction = direction || 0; //The direction it is heading in
    this.angle = angle || 0; //The offset from the direction
  },
  
  //Children
  
  Debris: function(x,y,fill,direction,size) {
    Class.Shape.call(this,x,y,fill,1,25,direction); //Is object shape
    this.class += ".debris";
    this.size = size;
    this.rotSpeed = Math.PI*(Math.random()+1);
    this.shape = [
			{a:0,d:10},
			{a:Math.PI / 2,d:8},
			{a:-Math.PI / 2,d:8},
		];
  },
  Bullet: function(x,y,fill,velocity,direction,creator) {
   // console.log(creator,"creating bullet");
    Class.Projectile.call(this,x,y,fill,velocity,direction,creator);
    this.class += ".bullet";
    
    this.piercing = false;
    this.rebound = false;
    this.hasRebounded = false;
    this.ricochet = false;
    if (Game.objects[0][creator] && Game.objects[0][creator].ability.name === "PIERCING") this.piercing = true;
    if (Game.objects[0][creator] && Game.objects[0][creator].ability.name === "REBOUND") this.rebound = true;
    if (Game.objects[0][creator] && Game.objects[0][creator].ability.name === "RICOCHET") this.ricochet = true;
    this.length = 5;
  },
  Nuke: function(x,y,fill,direction,creator) {
    Class.Projectile.call(this,x,y,fill,250,direction,creator);
    this.class += ".nuke";
    //console.log(this.creator,"creating nuke");
    this.length = 5;
    this.dustps = 16;
    this.lastdust = new Date();
  },
  Explosion: function (x,y,fill) {
    Class.Shape.call(this,x,y,fill,1);
    this.class += ".explosion";
    //console.log(this.opacity);
    this.radius = 50;
    var checkdistance = this.radius + 24;
    var V,C,P,response,collided;
    for (e = 0, el = Game.objects[1].length; e < el; e++) { //Enemies
      object = Game.objects[1][e];
      distance = Math.sqrt(Math.pow(this.x - object.x,2)+Math.pow(this.y - object.y,2));
      if (distance <= checkdistance) {
        //console.log("Checking Collision");
        V = SAT.Vector;P = SAT.Polygon;C = SAT.Circle;
        // A square
        circle = new C(new V(this.x,this.y),this.radius);
        // A triangle
        polygon = new P(new V(object.x,object.y), [
          new V(Math.cos(object.shape[0].a + object.direction) * object.shape[0].d,Math.sin(object.shape[0].a + object.direction) * object.shape[0].d), new V(Math.cos(object.shape[1].a + object.direction) * object.shape[1].d,Math.sin(object.shape[1].a + object.direction) * object.shape[1].d), new V(Math.cos(object.shape[2].a + object.direction) * object.shape[2].d,Math.sin(object.shape[2].a + object.direction) * object.shape[2].d), new V(Math.cos(object.shape[3].a + object.direction) * object.shape[3].d,Math.sin(object.shape[3].a + object.direction) * object.shape[3].d)
        ]);
        response = new SAT.Response();
        collided = SAT.testPolygonCircle(polygon, circle, response);
        if (collided) {
          object.destroy();
          Game.objects[1].splice(e,1);
          e--;
          el--;
        }
      }
    }
    for (e = 0, el = Game.objects[0].length; e < el; e++) { //Players
      object = Game.objects[0][e];
      distance = Math.sqrt(Math.pow(this.x - object.x,2)+Math.pow(this.y - object.y,2));
      if (distance <= checkdistance) {
        //console.log("Checking Collision");
        V = SAT.Vector;P = SAT.Polygon;C = SAT.Circle;
        // A square
        circle = new C(new V(this.x,this.y),this.radius);
        // A triangle
        polygon = new P(new V(object.x,object.y), [
          new V(Math.cos(object.shape[0].a + object.direction) * object.shape[0].d,Math.sin(object.shape[0].a + object.direction) * object.shape[0].d), new V(Math.cos(object.shape[1].a + object.direction) * object.shape[1].d,Math.sin(object.shape[1].a + object.direction) * object.shape[1].d), new V(Math.cos(object.shape[2].a + object.direction) * object.shape[2].d,Math.sin(object.shape[2].a + object.direction) * object.shape[2].d), new V(Math.cos(object.shape[3].a + object.direction) * object.shape[3].d,Math.sin(object.shape[3].a + object.direction) * object.shape[3].d)
        ]);
        response = new SAT.Response();
        collided = SAT.testPolygonCircle(polygon, circle, response);
        if (collided) {
          object.destroy();
          Game.objects[0].splice(e,1);
          e--;
          el--;
          i--; //Delete from array above it
          il--;//Delete from array above it
        }
      }
    }
  },
  Dust: function (x,y,r,fill,opacity,velocity,direction) {
    Class.Shape.call(this,x,y,fill,opacity,velocity,direction);
    this.class += ".dust";
    //console.log(this.opacity);
    this.radius = r;
  },
  Player: function (id,x,y,direction,body,trail,controls,ab) {
    Class.Shape.call(this,x,y,body,0,direction);
    this.class += ".player";
    
    this.id = id;
    this.trail = trail;
    this.controls = controls;
    this.terminalvelocity = 200;
    this.acceleration = 0;
    this.thrust = 100;
    this.ability = new abilities[ab]();
    this.frozen = false;
    this.size = 1;
    this.opacity = 1;
    this.vulnerableDecay = 1;
    this.vulnerable = 1;
    
    this.bulletTimer = 1;
    this.bulletps = 1;
    
    this.dustv = 25;
    this.lastdust = 0;
    this.dustps = 8;
    this.shouldDrawDust = false;
    this.shape = [
			{a:0,d:24},
			{a:Math.PI / 2,d:10},
			{a:Math.PI,d:8},
			{a:-Math.PI / 2,d:10}
    ];
  },
  Enemy: function (x,y,direction,body,target) {
    Class.Shape.call(this,x,y,body,0,direction);
    this.class += ".enemy";
    
    this.target = target;
    this.randomX = Math.random()*cw;
    this.randomY = Math.random()*ch;
    this.accuracy = 0.02;
    this.id = -1;
    this.terminalvelocity = 180;
    this.acceleration = 0;
    this.thrust = 100;
    this.frozen = false;
    this.opacity = 1;
    this.vulnerableDecay = 1;
    this.vulnerable = 0;
    
    this.dirfactor = 1;
    this.velTimer = Math.random()*2 + 2;
    this.velCounter = 0;
    
    this.bulletTimer = 1;
    this.bulletps = 0.5;
    
    this.lastdust = 0;
    this.dustps = 8;
    this.shouldDrawDust = false;
    this.shape = [
			{a:0,d:24},
			{a:Math.PI / 2,d:10},
			{a:Math.PI,d:8},
			{a:-Math.PI / 2,d:10}
    ];
  },
};
//Prototype METHODS
Class.Object.prototype.isInBounds = function (r,c) { //If r = true, return side
  //console.log("Checking if in bounds",this.class);
  var change = c || 0;
  var x = this.x; var y = this.y;
  if (r) {
    if (x + change <= 0) {
      //console.log("LEFT");
      return "left";
    } else if (x - change >= cw) {
      //console.log("RIGHT");
      return "right";
    } else if (y + change <= 0) {
      //console.log("TOP");
      return "top";
    } else if (y - change >= ch) {
      //console.log("BOTTOM");
      return "bottom";
    } else {
      return false;
    }
  } else {
    if (x + change > 0 && x - change < cw && y + change > 0 && y - change < ch) {
      return true;
    } else {
      return false;
    }
  }
};

//Link prototypes
Class.Planet.prototype = Object.create(Class.Object.prototype);
Class.Star.prototype = Object.create(Class.Object.prototype);
Class.Shape.prototype = Object.create(Class.Object.prototype);
Class.Projectile.prototype = Object.create(Class.Object.prototype);
Class.Debris.prototype = Object.create(Class.Shape.prototype);


Class.Projectile.prototype.control = function (dt = 0) {
  //console.log("Controlling",this.class,dt);
  this.x += Math.cos(this.direction)*this.velocity*dt;
  this.y += Math.sin(this.direction)*this.velocity*dt;
};
Class.Projectile.prototype.checkCollision = function (dt = 0) {
  //console.log("Checking Collision",this.class);
  //Check against ALL players and enemies withtin checkdistance that dont come from same creator
  var checkdistance = 24 + this.length; //24+24
  var object, distance, V, P, point, polygon, response, collided;
  if (this.creator < 0) { //Loop through players because it is an enemy shot
    for (j = 0, jl = Game.objects[0].length; j < jl; j++) { //Players
      object = Game.objects[0][j];
      distance = Math.sqrt(Math.pow(this.x - object.x,2)+Math.pow(this.y - object.y,2));
      if (distance <= checkdistance && object.vulnerable === 0) {
        //console.log("Checking Collision");
        V = SAT.Vector;P = SAT.Polygon;
        // A square
        point = new V(this.x,this.y);
        // A triangle
        polygon = new P(new V(object.x,object.y), [
          new V(Math.cos(object.shape[0].a + object.direction) * object.shape[0].d,Math.sin(object.shape[0].a + object.direction) * object.shape[0].d), new V(Math.cos(object.shape[1].a + object.direction) * object.shape[1].d,Math.sin(object.shape[1].a + object.direction) * object.shape[1].d), new V(Math.cos(object.shape[2].a + object.direction) * object.shape[2].d,Math.sin(object.shape[2].a + object.direction) * object.shape[2].d), new V(Math.cos(object.shape[3].a + object.direction) * object.shape[3].d,Math.sin(object.shape[3].a + object.direction) * object.shape[3].d)
        ]);
        if (SAT.pointInPolygon(point,polygon)) {
          object.destroy();
          Game.objects[0].splice(j,1);
          j--;
          jl--;
          if (!this.piercing) return true;
        }
      }
    }
  } else { //Player made bullet check enemies and other player
    for (j = 0, jl = Game.objects[1].length; j < jl; j++) { //Enemies
      object = Game.objects[1][j];
      distance = Math.sqrt(Math.pow(this.x - object.x,2)+Math.pow(this.y - object.y,2));
      if (distance <= checkdistance) {
        //console.log("Checking Collision");
        V = SAT.Vector;P = SAT.Polygon;
        // A square
        point = new V(this.x,this.y);
        // A triangle
        polygon = new P(new V(object.x,object.y), [
          new V(Math.cos(object.shape[0].a + object.direction) * object.shape[0].d,Math.sin(object.shape[0].a + object.direction) * object.shape[0].d), new V(Math.cos(object.shape[1].a + object.direction) * object.shape[1].d,Math.sin(object.shape[1].a + object.direction) * object.shape[1].d), new V(Math.cos(object.shape[2].a + object.direction) * object.shape[2].d,Math.sin(object.shape[2].a + object.direction) * object.shape[2].d), new V(Math.cos(object.shape[3].a + object.direction) * object.shape[3].d,Math.sin(object.shape[3].a + object.direction) * object.shape[3].d)
        ]);
        if (SAT.pointInPolygon(point,polygon)) {
          object.destroy();
          Game.objects[1].splice(j,1);
          j--;
          jl--;
          if (!this.piercing) return true;
        }
      }
    }
    for (j = 0, jl = Game.objects[0].length; j < jl; j++) { //Players
      if (Game.objects[0][j].id !== this.creator) { //Dont kill creator
        //console.log("Checking other player",this.creator,Game.objects[0][j].id);
        object = Game.objects[0][j];
        distance = Math.sqrt(Math.pow(this.x - object.x,2)+Math.pow(this.y - object.y,2));
        if (distance <= checkdistance && object.vulnerable === 0) {
          //console.log("Checking Collision");
          V = SAT.Vector;P = SAT.Polygon;
          // A square
          point = new V(this.x,this.y);
          // A triangle
          polygon = new P(new V(object.x,object.y), [
            new V(Math.cos(object.shape[0].a + object.direction) * object.shape[0].d,Math.sin(object.shape[0].a + object.direction) * object.shape[0].d), new V(Math.cos(object.shape[1].a + object.direction) * object.shape[1].d,Math.sin(object.shape[1].a + object.direction) * object.shape[1].d), new V(Math.cos(object.shape[2].a + object.direction) * object.shape[2].d,Math.sin(object.shape[2].a + object.direction) * object.shape[2].d), new V(Math.cos(object.shape[3].a + object.direction) * object.shape[3].d,Math.sin(object.shape[3].a + object.direction) * object.shape[3].d)
          ]);
          if (SAT.pointInPolygon(point,polygon)) {
            object.destroy();
            Game.objects[0].splice(j,1);
            j--;
            jl--;
            if (!this.piercing) return true;
          }
        }
      }
    }
  }
  return false;
};

//Link prototype
Class.Dust.prototype = Object.create(Class.Shape.prototype);
Class.Bullet.prototype = Object.create(Class.Projectile.prototype);
Class.Nuke.prototype = Object.create(Class.Projectile.prototype);
Class.Dust.prototype = Object.create(Class.Shape.prototype);
Class.Explosion.prototype = Object.create(Class.Shape.prototype);
Class.Enemy.prototype = Object.create(Class.Shape.prototype);
Class.Player.prototype = Object.create(Class.Shape.prototype);

Class.Nuke.prototype.destroy = function (dt = 0) {
  //console.log("Destroying "+this.creator,this.class);
  //Destroy nuke
  Sounds["boom.mp3"].play();
  Game.objects[3].push(new Class.Explosion(this.x,this.y,this.fill));
};
Class.Nuke.prototype.control = function (dt = 0) {
  //console.log("Controlling "+this.creator,this.class);
  //console.log("Controlling",this.class,dt);
  this.x += Math.cos(this.direction)*this.velocity*dt;
  this.y += Math.sin(this.direction)*this.velocity*dt;
  if ((new Date() - this.lastdust) > 1000/this.dustps) { //If past period
    var radius = ((Math.random()*2)+2);
    var opacity = (Math.random()*0.2)+0.6;
    Game.objects[3].push(new Class.Dust(this.x,this.y,radius,"white",opacity,30,this.direction-Math.PI));
    this.lastdust = new Date();
  }
};
Class.Bullet.prototype.destroy = function (dt = 0) {
  //console.log("Destroying "+this.creator,this.class);
  //Destroy bullet
};
Class.Debris.prototype.control = function (dt = 0) {
  //console.log("Controlling",this.class,dt);
  this.angle += this.rotSpeed*dt;
  this.x += Math.cos(this.direction)*this.velocity*dt;
  this.y += Math.sin(this.direction)*this.velocity*dt;
  this.opacity -= 1*dt;    
  if (this.opacity < 0) {
    this.opacity = 0;
  }
};

Class.Dust.prototype.control = function (dt = 0) {
  //console.log("Controlling",this.class,dt);
  this.x += Math.cos(this.direction)*this.velocity*dt;
  this.y += Math.sin(this.direction)*this.velocity*dt;
  
  this.opacity -= 1*dt;
  //console.log(this.opacity);
  if (this.opacity < 0) {
    this.opacity = 0;
  }
};
Class.Explosion.prototype.control = function (dt = 0) {
  //console.log("Controlling",this.class,dt);
  this.x += Math.cos(this.direction)*this.velocity*dt;
  this.y += Math.sin(this.direction)*this.velocity*dt;
  
  this.opacity -= 0.5*dt;
  //console.log(this.opacity);
  if (this.opacity < 0) {
    this.opacity = 0;
  }
};
Class.Player.prototype.checkCollision = function (dt = 0) {
  //Check against ALL players and enemies withtin checkdistance that dont come from same creator
  var checkdistance = 48; //24+24
  var object, distance, V, P, polygon1, polygon2, response, collided;
  if (this.vulnerable === 0) {//If its vulnerable
  if (Game.objects[0][1 - this.id] && Game.objects[0][1 - this.id].id !== this.id && Game.objects[0][1 - this.id].vulnerable === 0) { //Players (Get rid of && if need be)
    object = Game.objects[0][1 - this.id];
    
    distance = Math.sqrt(Math.pow(this.x - object.x,2)+Math.pow(this.y - object.y,2));
    if (distance <= checkdistance) {
      //console.log("Checking Collision");
      V = SAT.Vector; P = SAT.Polygon;
      // A square
      polygon1 = new P(new V(this.x,this.y), [ //Player
        new V(Math.cos(this.shape[0].a + this.direction) * this.shape[0].d,Math.sin(this.shape[0].a + this.direction) * this.shape[0].d), new V(Math.cos(this.shape[1].a + this.direction) * this.shape[1].d,Math.sin(this.shape[1].a + this.direction) * this.shape[1].d), new V(Math.cos(this.shape[2].a + this.direction) * this.shape[2].d,Math.sin(this.shape[2].a + this.direction) * this.shape[2].d), new V(Math.cos(this.shape[3].a + this.direction) * this.shape[3].d,Math.sin(this.shape[3].a + this.direction) * this.shape[3].d)
      ]);
      // A triangle
      polygon2 = new P(new V(object.x,object.y), [
        new V(Math.cos(object.shape[0].a + object.direction) * object.shape[0].d,Math.sin(object.shape[0].a + object.direction) * object.shape[0].d), new V(Math.cos(object.shape[1].a + object.direction) * object.shape[1].d,Math.sin(object.shape[1].a + object.direction) * object.shape[1].d), new V(Math.cos(object.shape[2].a + object.direction) * object.shape[2].d,Math.sin(object.shape[2].a + object.direction) * object.shape[2].d), new V(Math.cos(object.shape[3].a + object.direction) * object.shape[3].d,Math.sin(object.shape[3].a + object.direction) * object.shape[3].d)
      ]);
      response = new SAT.Response();
      collided = SAT.testPolygonPolygon(polygon1, polygon2, response);
      if (collided) {
        //console.log("Removing",1 - this.id);
        object.destroy();
        Game.objects[0].splice(1 - this.id,1);
        il--;
        i--;
        return true;
      }
    }
  }
  for (j = 0, jl = Game.objects[1].length; j < jl; j++) { //Enemies
    object = Game.objects[1][j];
    distance = Math.sqrt(Math.pow(this.x - object.x,2)+Math.pow(this.y - object.y,2));
    if (distance <= checkdistance) {
      //console.log("Checking Collision");
      V = SAT.Vector;P = SAT.Polygon;
      // A square
      polygon1 = new P(new V(this.x,this.y), [ //Player
        new V(Math.cos(this.shape[0].a + this.direction) * this.shape[0].d,Math.sin(this.shape[0].a + this.direction) * this.shape[0].d), new V(Math.cos(this.shape[1].a + this.direction) * this.shape[1].d,Math.sin(this.shape[1].a + this.direction) * this.shape[1].d), new V(Math.cos(this.shape[2].a + this.direction) * this.shape[2].d,Math.sin(this.shape[2].a + this.direction) * this.shape[2].d), new V(Math.cos(this.shape[3].a + this.direction) * this.shape[3].d,Math.sin(this.shape[3].a + this.direction) * this.shape[3].d)
      ]);
      // A triangle
      polygon2 = new P(new V(object.x,object.y), [
        new V(Math.cos(object.shape[0].a + object.direction) * object.shape[0].d,Math.sin(object.shape[0].a + object.direction) * object.shape[0].d), new V(Math.cos(object.shape[1].a + object.direction) * object.shape[1].d,Math.sin(object.shape[1].a + object.direction) * object.shape[1].d), new V(Math.cos(object.shape[2].a + object.direction) * object.shape[2].d,Math.sin(object.shape[2].a + object.direction) * object.shape[2].d), new V(Math.cos(object.shape[3].a + object.direction) * object.shape[3].d,Math.sin(object.shape[3].a + object.direction) * object.shape[3].d)
      ]);
      response = new SAT.Response();
      collided = SAT.testPolygonPolygon(polygon1, polygon2, response);
      if (collided) {
        object.destroy();
        Game.objects[1].splice(j,1);
        j--;
        jl--;
        return true;
      }
    }
  }
  }
  return false;
};
Class.Player.prototype.destroy = function (dt = 0) {
  //console.log("Destroying "+this.id,this.class);
  //Destroy player
  var dis, _x,_y, radius, opacity;
  Sounds["death.mp3"].play();
  for (db = 0; db < 5; db++) {
    dis = db/5*this.shape[0].d;
    _x = this.x+ Math.cos(this.direction)*dis;
    _y = this.y+ Math.sin(this.direction)*dis;
    radius = (Math.random()*3)+3;
    opacity = (Math.random()*0.2)+0.6;
        
    Game.objects[3].push(new Class.Dust(_x,_y,radius,"#DF4A4A",opacity,35,Math.random()*2*Math.PI));
    Game.objects[3].push(new Class.Dust(_x,_y,radius,"#F7F13E",opacity,35,Math.random()*2*Math.PI));
    Game.objects[3].push(new Class.Debris(_x,_y,this.fill,Math.random()*2*Math.PI,this.size));
  }
};
Class.Player.prototype.control = function (dt = 0) {
  //console.log("Controlling",this.class);
  //Reset variables
  this.acceleration = 0;
  this.shouldDrawDust = false;
  //console.log(dt);
  for (c = 0, cl=this.controls.length; c < cl; c++) {
    if (keys[this.controls[c]]) { //A control is pressed, so control it
      switch(c) {
        case 0: //FWD
          //console.log("FWD");
          this.acceleration = this.thrust;
          this.shouldDrawDust = true;
          break;
        case 1: //BWD
          this.acceleration = -this.thrust;
          break;
        case 2: //L
          this.direction -= Math.PI/80 * 1/this.size;
          break;
        case 3: //R
          this.direction += Math.PI/80 * 1/this.size;
          break;
        case 4: //SHOOT
          if (this.bulletTimer === 0) {
            var _x = this.x + (Math.cos(this.shape[0].a + this.direction) * this.shape[0].d * this.size);
						var _y = this.y + (Math.sin(this.shape[0].a + this.direction) * this.shape[0].d * this.size);
						      
						Sounds["shot1.mp3"].play();
						
						//console.log("Shoot");    
            Game.objects[2].push(new Class.Bullet(_x,_y,this.fill,300,this.direction,this.id));
            this.bulletTimer = 1/this.bulletps;
          }
          break;
        case 5: //ABILITY
          this.ability.activate(this,dt);
          break;
      }
    }
  }
  //Ability handlers
  this.ability.handler(this,dt);
      
  if (this.velocity > 0 && this.acceleration === 0) { //Apply forward friction
    this.acceleration = -40;
    this.velocity += this.acceleration*dt;
    if (this.velocity < 0) this.velocity = 0; //Dont go backwards
  } else if (this.velocity < 0 && this.acceleration === 0) { //Apply backward friction
    this.acceleration = 40;
    if (this.velocity > 0) this.velocity = 0; //Dont go forwards
  }
  
  this.velocity += this.acceleration*dt;
  
  var difdust = new Date() - this.lastdust;
  if (difdust > 1000/this.dustps && this.shouldDrawDust) { //If past period
    var radius = (Math.random()*5)+3;
    var opacity = (Math.random()*0.2)+0.6;
    Game.objects[3].push(new Class.Dust(this.x,this.y,radius*this.size,this.trail,opacity,this.dustv,this.direction-Math.PI));
    this.lastdust = new Date();
  }
  
  if (this.velocity > this.terminalvelocity) this.velocity = this.terminalvelocity;
  if (this.ability.name !== "HODGES") {
    if (this.velocity < -(0.6*this.terminalvelocity)) this.velocity = -(0.6*this.terminalvelocity);
  } else {
    if (this.velocity < -(this.terminalvelocity)) this.velocity = -(this.terminalvelocity);
  }
      
  //Handle timers
  this.bulletTimer -= dt;
  if (this.bulletTimer < 0) this.bulletTimer = 0;
  this.vulnerable -= this.vulnerableDecay * dt;
  if (this.vulnerable < 0) this.vulnerable = 0;
  
  this.x += Math.cos(this.direction)*this.velocity*dt;
  this.y += Math.sin(this.direction)*this.velocity*dt;
};
Class.Enemy.prototype.destroy = function (dt = 0) {
  //console.log("Destroying",this.class);
  //Destroy enemy
  var dis, _x,_y, radius, opacity;
  Sounds["death.mp3"].play();
  for (db = 0; db < 5; db++) {
    dis = db/5*this.shape[0].d;
    _x = this.x+ Math.cos(this.direction)*dis;
    _y = this.y+ Math.sin(this.direction)*dis;
    radius = (Math.random()*3)+3;
    opacity = (Math.random()*0.2)+0.6;
        
    Game.objects[3].push(new Class.Dust(_x,_y,radius,"#DF4A4A",opacity,35,Math.random()*2*Math.PI));
    Game.objects[3].push(new Class.Dust(_x,_y,radius,"#F7F13E",opacity,35,Math.random()*2*Math.PI));
    Game.objects[3].push(new Class.Debris(_x,_y,this.fill,Math.random()*2*Math.PI));
  }
};
Class.Enemy.prototype.control = function (dt = 0) {
  //console.log("Controlling",this.class);
  //Simplify angle
  if (this.direction > Math.PI * 2) {
    this.direction = this.direction % Math.PI * 2;
  } else if (this.direction < 0) {
    this.direction = 2*Math.PI - (this.direction % (-Math.PI * 2));
  }
  //Reset variables
  this.acceleration = 0;
  //console.log(dt);
  var px = this.randomX;
  var py = this.randomY;
  if (this.target >= 0 && Game.objects[0].length > 0) { //NOTE target is comparisons of locations, not id
    if (Game.objects[0][this.target]) { //A target exists here
      if (Game.objects[0][this.target].ability.name === "CLOAK" && Game.objects[0][this.target].ability.active) {
        //console.log("Target cloaked");
        if (Game.objects[0][1 - this.target]) { //Is there another player
          this.target = 1 - this.target; //Swap targets
        } else {
          this.target = -1;
        }
      } else {
        px = Game.objects[0][this.target].x;
        py = Game.objects[0][this.target].y;
      }
    } else { //That player doesnt exist anymore, swap to other one
      this.target = 0;
    } 
  } else if (Game.objects[0].length > 0) { //Did not have target before, but does now
    this.target = 0;
  }
  var theta = Math.atan2((px-this.x),(py-this.y));
  var a1 = -(theta- Math.PI);
  var a2 = (Math.abs((this.direction + Math.PI/2) % (Math.PI*2)));
  var b = a1-a2;
  if (Math.abs(b) > this.accuracy) {
    //console.log("TURNING");
    if (Math.abs(b) <= Math.PI) {
      if (b < 0) {
        //console.log("LEFT");
        this.direction -= Math.PI/90;
      } else {
        //console.log("RIGHT");
        this.direction += Math.PI/90;
      }
    } else {
      if (b < 0) {
        //console.log("RIGHT");
        this.direction += Math.PI/90;
      } else {
        //console.log("LEFT");
        this.direction -= Math.PI/90;
      }
    }
  } else {
    //console.log("STRAIGHT");
    if (this.bulletTimer === 0 && Game.objects[0].length > 0 && this.target >= 0) {
      var _x = this.x + (Math.cos(this.shape[0].a + this.direction) * this.shape[0].d);
    	var _y = this.y + (Math.sin(this.shape[0].a + this.direction) * this.shape[0].d);
    					
    	Sounds["shot1.mp3"].play();
    					
      Game.objects[2].push(new Class.Bullet(_x,_y,this.fill,300,this.direction,this.id));
      this.bulletTimer = 1/this.bulletps;
      }
    }
  //console.log(this.velCounter);
  if (this.velCounter === 0) {
    if (this.velocity === 0) {
      this.dirfactor = 1;
      this.velCounter = this.velTimer;
    } else {
      this.dirfactor = 0;
    }
  }
  this.velCounter -= 1*dt;
  if (this.velCounter < 0) {
    this.velCounter = 0;
  }
  if (this.dirfactor === 1) { //Create dust
    var difdust = new Date() - this.lastdust;
    if (difdust > 1000/this.dustps) { //If past period
      var radius = (Math.random()*5)+3;
      var opacity = (Math.random()*0.2)+0.6;
      Game.objects[3].push(new Class.Dust(this.x,this.y,radius,this.fill,opacity,25,this.direction-Math.PI));
      this.lastdust = new Date();
    }
  }
          
  this.acceleration = this.dirfactor * this.thrust;
  
  if (this.velocity > 0 && this.acceleration === 0) { //Apply forward friction
    this.acceleration = -40;
    this.velocity += this.acceleration*dt;
    if (this.velocity < 0) this.velocity = 0; //Dont go backwards
  } else if (this.velocity < 0 && this.acceleration === 0) { //Apply backward friction
    this.acceleration = 40;
    if (this.velocity > 0) this.velocity = 0; //Dont go forwards
  }
  
  this.velocity += this.acceleration*dt;
  
  if (this.velocity > this.terminalvelocity) this.velocity = this.terminalvelocity;
  if (this.velocity < -(this.terminalvelocity)) this.velocity = -(this.terminalvelocity);
      
  //Handle timers
  this.bulletTimer -= dt;
  if (this.bulletTimer < 0) this.bulletTimer = 0;
  this.vulnerable -= this.vulnerableDecay * dt;
  if (this.vulnerable < 0) this.vulnerable = 0;
  
  this.x += Math.cos(this.direction)*this.velocity*dt;
  this.y += Math.sin(this.direction)*this.velocity*dt;
};