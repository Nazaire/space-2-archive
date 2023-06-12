var Draw = {
  clean: function(param) {
    var context = param || ctx;
    context.fillStyle = "black";
    context.globalAlpha = 1;
    context.fillRect(0,0,cw,ch);
  },
  background: function(bg) {
    ctx.drawImage(bg,0,0);
  },
  "object.planet": function(_ctx,m) {
    _ctx.globalAlpha = 1;
    _ctx.drawImage(m.image,m.x-(m.width/2),m.y-(m.height/2),m.width,m.height);
  },
  "object.star": function(_ctx,star) {
    _ctx.fillStyle = "white";
    _ctx.beginPath();
    _ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI, false);
    _ctx.globalAlpha = star.opacity;
    _ctx.fill();
  },
  "object.projectile.bullet": function(projectile) {
    //console.log("Drawing",projectile);
    var p = projectile;
    ctx.strokeStyle = p.fill;
		ctx.lineWidth = 2;
		ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.moveTo(p.x,p.y);
		ctx.lineTo(p.x + (Math.cos(p.direction)*p.length), p.y + (Math.sin(p.direction)*p.length));
		ctx.stroke();
  },
  "object.projectile.nuke": function(projectile) {
    var p = projectile;
    ctx.strokeStyle = p.fill;
		ctx.lineWidth = 4;
		ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.moveTo(p.x,p.y);
		ctx.lineTo(p.x + (Math.cos(p.direction)*p.length), p.y + (Math.sin(p.direction)*p.length));
		ctx.closePath();
		ctx.stroke();
  },
  shape: function (entity) {
		var shape = entity.shape;
		var ratio = entity.size || 1;
		//console.log(entity,shape,opacity,entity.fill);
		var theta = entity.direction + entity.angle;
		var x = entity.x + (ratio * shape[0].d * Math.cos(shape[0].a + theta));
		var y = entity.y + (ratio * shape[0].d * Math.sin(shape[0].a + theta));
		
		if (entity.vulnerable > 0) {
  		ctx.beginPath();
      ctx.arc(entity.x + (0.2*shape[0].d * Math.cos(shape[0].a + theta)),entity.y + (0.2*shape[0].d * Math.sin(shape[0].a + theta)),25,0,2*Math.PI,false);
      ctx.globalAlpha = 0.3*entity.vulnerable;
      ctx.lineWidth = 3;
      if (entity.fill === "PRISM") {
        ctx.strokeStyle = entity.trail;
      } else {
        ctx.strokeStyle = entity.fill;
      }
      ctx.stroke();
		}
		
		ctx.beginPath();
		ctx.moveTo(x,y);
		//console.log(x,y);
		
		for (p = 1; p < entity.shape.length; p++) {
			
			x = entity.x + (ratio * shape[p].d * Math.cos(shape[p].a + theta));
			y = entity.y + (ratio * shape[p].d * Math.sin(shape[p].a + theta));
		  //console.log(x,y);
			ctx.lineTo(x,y);
		}
		ctx.closePath();
		
		
		//console.log(entity.fill);
		if (entity.fill === "PRISM") {
		  var trail = hexToRgb(entity.trailfill || "#FFFFFF");
		  var prismgrad = ctx.createRadialGradient(entity.x,entity.y,0,entity.x,entity.y,24);
      prismgrad.addColorStop(0,"rgba("+trail.r+","+trail.g+","+trail.b+",0.4)");
      prismgrad.addColorStop(0.5,"rgba(150,150,150,0.6)");
		  ctx.fillStyle = prismgrad;
		  
		  var prismstrgrad = ctx.createLinearGradient(entity.x + (shape[0].d * Math.cos(shape[0].a + theta)),entity.y + (shape[0].d * Math.sin(shape[0].a + theta)),entity.x + (shape[2].d * Math.cos(shape[2].a + theta)),entity.y + (shape[2].d * Math.sin(shape[2].a + theta)));
      prismstrgrad.addColorStop(0.5,"rgba(150,150,150,1)");
      prismstrgrad.addColorStop(1,"rgba("+trail.r+","+trail.g+","+trail.b+",1)");
		  ctx.strokeStyle = prismstrgrad;
		  ctx.lineWidth = 3;
		  ctx.globalAlpha = entity.opacity;
		  ctx.fill();
		  ctx.stroke();
		} else {
  		ctx.fillStyle = entity.fill;
  		ctx.globalAlpha = entity.opacity;
  		ctx.fill();
		}
	},
	fps: function(count) {
	  ctx.font = '10px fff-forward';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.globalAlpha = 1;
    if (count < 50) {
      //console.error(_fps);
      ctx.fillStyle = "red";
      ctx.fillText(count,cw-250,5);
    } else {
      ctx.fillStyle = "white";
      ctx.fillText(count,cw-200,5);
    }
	},
  text: function(text,font,size,style,ycoords = 0) {
    ctx.font = size+'px ' + font;
    ctx.fillStyle = style;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.globalAlpha = 1;
    ctx.fillText(text,cw/2,ch/2 + ycoords);
  },
  round: function(n) {
    ctx.font = '10px fff-forward';
    ctx.fillStyle = "white";
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
    ctx.fillText("Round: " + n,10,10);
  },
  kills: function(n) {
    ctx.font = '10px fff-forward';
    ctx.fillStyle = "white";
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
    ctx.fillText("Kills: " + n,10,25);
  },
  "object.shape.debris": function (entity) {
    Draw.shape(entity);
  },
  "object.shape.dust": function(particle) {
    //console.log("drawing dust",particle.opacity);
    var x = particle.x;
    var y = particle.y;
    
    ctx.beginPath();
    ctx.arc(x, y, particle.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = particle.fill;
    ctx.globalAlpha = particle.opacity;
    ctx.fill();
  },
  "object.shape.explosion": function(particle) {
    var x = particle.x;
    var y = particle.y;
		var prismgrad = ctx.createRadialGradient(particle.x,particle.y,0,particle.x,particle.y,particle.radius);
    var fill = hexToRgb(particle.fill);
    prismgrad.addColorStop(0,"rgba("+fill.r+","+fill.g+","+fill.b+",0.2)");
    prismgrad.addColorStop((1-(particle.opacity)/2),"rgba("+fill.r+","+fill.g+","+fill.b+",0.6)");
    
		ctx.fillStyle = prismgrad;
    ctx.beginPath();
    ctx.arc(x, y, particle.radius, 0, 2 * Math.PI, false);
    ctx.globalAlpha = particle.opacity;
    ctx.fill();
  },
  line: function (opacity,fill,width,pos) {
    ctx.beginPath();
		ctx.moveTo(pos[0].x,pos[0].y);
		ctx.lineTo(pos[1].x,pos[1].y);
		ctx.strokeStyle = fill;
		ctx.lineWidth = width;
		ctx.globalAlpha = opacity;
		ctx.stroke();
  },
  meter: function (x,y,player) {
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.arc(x,y,20,0,2*Math.PI);
    ctx.globalAlpha = 0.1;
    if (player.fill === "PRISM") {
      ctx.fillStyle = player.trailfill;
    } else {
      ctx.fillStyle = player.fill;
    }
    ctx.fill();
    
    var percent = player.ability.timer;
    if (player.ability.active) {
      percent /= player.ability.duration;
    } else {
      percent /= player.ability.cooldown;
      percent = 1 - percent;
    }
    var op = 0.5;
    if (player.ability.timer !== 0) op = 0.2;
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.arc(x,y,20,0,2*Math.PI*percent);
    ctx.lineTo(x,y);
    ctx.globalAlpha = op;
    ctx.fill();
    
    ctx.font = '10px fff-forward';
    ctx.fillStyle = "white";
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.globalAlpha = 1;
    ctx.fillText(player.ability.name,x,ch-20);
  },
  feed: function (f) {
    ctx.font = '10px fff-forward';
    ctx.fillStyle = "white";
    if (f.epic) ctx.fillStyle = "#606dbc";
    ctx.textBaseline = 'top';
    ctx.textAlign = 'right';
    ctx.globalAlpha = f.opacity;
    if (f.rwd > 0) {
      ctx.fillText(f.text + " + $"+f.rwd,cw-10,f.y);
    } else {
      ctx.fillText(f.text,cw-10,f.y);
    }
  }
};

var keys = {
  
};

function isPointInPath (point, entity) {
	ctx.beginPath();
	
	var shape = entity.shape;
	var x = entity.x + (shape[0].d * Math.cos(shape[0].a + entity.angle));
	var y = entity.y + (shape[0].d * Math.sin(shape[0].a + entity.angle));
		
	ctx.moveTo(x,y);
		
	for (p = 1; p < entity.shape.length; p++) {
			
		x = entity.x + (shape[p].d * Math.cos(shape[p].a + entity.angle));
		y = entity.y + (shape[p].d * Math.sin(shape[p].a + entity.angle));
		
		ctx.lineTo(x,y);
	}
	ctx.closePath();
	
	if(ctx.isPointInPath(point[0],point[1])) {
		return true;
	} else {
		return false;
	}
}
function isPointInCircle (x,y,xp) {
  ctx.beginPath();
  ctx.moveTo(xp.x,xp.y);
  ctx.arc(xp.x,xp.y,xp.radius,0,2*Math.PI);
  ctx.lineTo(xp.x,xp.y);
  ctx.closePath();
  if (ctx.isPointInPath(x,y)) {
    //console.log("POINT IS IN CIRCLE");
    return true;
  } else {
    return false;
  }
}
function renderVideo() {
  if (recorder) {
  console.log("Stopping video")
  recorder.stop(function(blob) {
    console.log("Recieved blob");
    $("#video").attr('src',URL.createObjectURL(blob));
    //window.open(blob);
    $("#video")[0].load();
  });
  } else {
    console.log("User was not recording")
  }
}