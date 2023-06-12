//console.log("pageController.js");

$(window).resize(function(){
  var rel = $("body").width();
  $("#canvas").height(0.5*rel);
  
  $("#gameArea").height(0.5*rel+10);
  $("#header").height(0.5*rel/8);
  $(".gameStripes").height(0.5*rel/8);
  $("#gameDetails").css("top",(0.5*rel/8)+"px");
  $("#gameDetails").css("height",($("#gameDetailsWrapper").height()-(0.5*rel/8))+"px");
  $("#gameTitle").css("font-size",0.5*rel/10);
  resetCanvas();
});

$(window).resize();