

function resetCanvas() {
  // DONT RESIZE PAST THIS POINT
  canvas = $("#canvas");
  ch = canvas.height();
  cw = canvas.width();
  //console.log(cw,ch);
  canvas.attr("width", cw + "px");
  canvas.attr("height", ch + "px");

  ctx = $("#canvas")[0].getContext('2d');


  Draw.clean();
  Draw.text("SPACE II", "sofachrome", 68, "white");
}
// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   if (message.update) {
//     load();
//   }
// });

function chooseGamemode(e) {
  if (!Game || Game.stage === 2) {
    var _ = $(this);
    var gm = _.html().replace(/\s+/g, '').toUpperCase();
    //console.log(gm);
    gamemode = gm;
    $(".gamemode").removeClass("selected");
    _.addClass("selected");
  }
}
function chooseAbility(e) {
  if (!Game || Game.stage === 2) {
    var _ = $(this);
    var ab = _.html().replace(/\s+/g, '').toUpperCase();
    var _abid;
    //console.log("Changing ability",ab);
    if (ab !== "???") {
      $(".ability").removeClass("selected");
      _.addClass("selected");
      for (var abil in abilitiesStore) {
        if (abilitiesStore[abil].name === ab) { //Matched name
          _abid = abil; //Set ability ID
        }
      }
      ability = _abid;
      user.selected = ability;
    }
  }
}

function purchaseAbility(e) {
  if (!Game || Game.stage === 2) {
    var ab = $(this).html().replace(/\s+/g, '').split("<")[0].toUpperCase();
    var abstore;
    var _abid;
    for (var abil in abilitiesStore) {
      if (abilitiesStore[abil].name === ab) { //Matched name
        console.log('MATCHED', ab, abilitiesStore[abil]);
        abstore = abilitiesStore[abil]; //set variable
        _abid = abil; //Set ability ID
      }
    }
    if (abstore) {
      if (!abstore.owned) {
        if (user.cash >= abstore.cost) {
          user.cash -= abstore.cost;
          abstore.owned = true;
          ability = _abid;
          user.selected = ability;
          user.abilities.push(ability);
          updateUser();
          $("#purchaseButton").html("Purchased");
        }
      } else {
        $("#purchaseButton").html("Already Owned");
        ability = _abid;
        user.selected = ability;
        console.log(ability);
        updateUser();
      }
    }
  }
}

function refreshAbilities() {
  //Remove binds
  $(".ability").unbind("click");
  $("#purchaseDropdownContent a").unbind("click");

  var htmlstr = '<div class="ability" title="' + abilitiesStore["BOOST"].description + '">BOOST</div>';
  var dropstr = '';
  for (var key in abilitiesStore) {
    dropstr += '<a href="#" title="' + abilitiesStore[key].description + '">' + abilitiesStore[key].name + '</a>';
    //console.log(key,key!=="BOOST");
    if (abilitiesStore[key].owned && key !== "BOOST") {
      htmlstr += '<div class="ability" title="' + abilitiesStore[key].description + '">' + abilitiesStore[key].name + '</div>';
    } else if (key !== "BOOST") {
      htmlstr += '<div class="ability">???</div>';
    }
  }

  $("#purchaseDropdownContent").html(dropstr);
  $("#abilityWrapperScroller").html(htmlstr);
  $(".ability").click(chooseAbility);
  $("#purchaseDropdownContent a").click(function (e) {
    e.preventDefault();
    var ab = $(this).html().replace(/\s+/g, '').toUpperCase();
    var _ab;
    for (var abil in abilitiesStore) {
      if (abilitiesStore[abil].name === ab) _ab = abilitiesStore[abil];
    }
    $("#purchaseDropdownContent").css("display", "none");
    setTimeout(function () { $("#purchaseDropdownContent").attr("style", ""); }, 100);
    if (!_ab.owned) { //Is not owned
      $("#purchaseButton").html(_ab.name + "<br/>$" + _ab.cost);
    } else {
      $("#purchaseButton").html(_ab.name + "<br/> OWNED");
    }
  });
  $(".ability").each(function () {
    var ab = $(this).html().replace(/\s+/g, '').toUpperCase();
    var _abid;
    for (var abil in abilitiesStore) {
      if (abilitiesStore[abil].name === ab) { //Matched name
        _abid = abil; //Set ability ID
      }
    }
    if (_abid === user.selected) {
      $(this).addClass("selected");
      $("#abilityWrapperScroller").scrollTop(($(this).index() - 1) * 35);
      //console.log($(this).index());
    }
  });
}
var requestAnimationFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  function (f) { return setTimeout(f, 1000 / fps); };

window.onload = function () {
  load();
  resetCanvas();
  //Handle ability display
  refreshAbilities();
  $(".gamemode").click(chooseGamemode);
  $("#gameButton").click(function () {
    if (!Game || Game.stage === 2) {
      console.log("Creating Game");
      Game = new Class.Game();
      Game.loop[Game.stage]();
      $("#gameButton").addClass("selected");
    }
  });
  $("html").on('keydown', function (e) {
    //console.log(e.keyCode);
    e.preventDefault();
    if (e.keyCode === 13 && keys[13] !== true) $("#gameButton").click();
    if (e.keyCode === 80 && keys[80] !== true && Game.stage === 1) Game.paused = !Game.paused;
    keys[e.keyCode] = true;
    //console.log(keys);
  });
  $("html").on('keyup', function (e) {
    //console.log(e.keyCode);
    e.preventDefault();
    keys[e.keyCode] = false;
    //console.log(keys);
  });
  $("#purchaseButton").click(purchaseAbility);
  $("#help").click(function () {
    chrome.app.window.create(
      'help.html',
      {
        id: 'helpWindow',
        width: 500,
        height: 500,
        minWidth: 500,
        minHeight: 500,
        resizable: false,
        frame: {
          type: 'chrome',
          color: '#465298'
        }
      }
    );
  });
  $("#developer").click(function () {
    chrome.app.window.create(
      'dev.html',
      {
        id: 'devWindow',
        width: 400,
        height: 650,
        minWidth: 400,
        minHeight: 650,
        resizable: true,
        frame: {
          type: 'chrome',
          color: '#465298'
        }
      }
    );
  });
  $("#volControl").click(function () {
    if ($("#volControl").hasClass("selected")) {
      //Unmute
      Sounds["main.mp3"].gain.gain.value = 1;
      Sounds["shot1.mp3"].gain.gain.value = 0.2;
      Sounds["death.mp3"].gain.gain.value = 1;
    } else {
      //Mute
      Sounds["main.mp3"].gain.gain.value = 0;
      Sounds["shot1.mp3"].gain.gain.value = 0;
      Sounds["death.mp3"].gain.gain.value = 0;
    }
    $("#volControl").toggleClass("selected");
  });
  $("#bottomarrow").click(function () {
    $("#abilityWrapperScroller").scrollTop($("#abilityWrapperScroller").scrollTop() + 20);
  });
  $("#toparrow").click(function () {
    $("#abilityWrapperScroller").scrollTop($("#abilityWrapperScroller").scrollTop() - 20);
  });
  $("#review").click(function () {
    // tracker.sendEvent("CLICK", "REVIEW");
    // chrome.runtime.sendMessage({ action: "openURL", url: "https://chrome.google.com/webstore/detail/space-2/dppioefgnilecmpdjigboccmefagjgoh/reviews" });
  });
  $("#bugs").click(function () {
    // chrome.runtime.sendMessage({ action: "openURL", url: "https://chrome.google.com/webstore/detail/space-2/dppioefgnilecmpdjigboccmefagjgoh/support" });
  });
  $("#facebook").click(function () {
    // tracker.sendEvent("CLICK", "SHARE");
    // chrome.runtime.sendMessage({ action: "openURL", url: "https://www.facebook.com/dialog/feed?app_id=1803003149923551&link=https://chrome.google.com/webstore/detail/space-2/dppioefgnilecmpdjigboccmefagjgoh&picture=https://lh3.googleusercontent.com/vxRq5WsWUVLU-Qh99zIFL4q1hHhq1_bm1purQv6MwD1nq2oV2Vm2xwOTLtLVSqxYtVJQdeOlA0M=s640-h400-e365-rw&name=Space%202&caption=Space%202&description=Check%20out%20Space%202%20right%20now!" });
  });

  $("#player1 .colorRowBase .colorContainer .colorItem").click(function () {
    if (!Game || Game.stage === 2) {
      //Get color id
      var color = colors.store[$(this).attr('class').split(" ")[1]];
      //console.log(color);
      if (color && user.unlocks["COLORBASE"]) {
        user.colors[0] = color;
        //If trail not unlocked set trail to base
        //console.log(user.unlocks["COLORTRAIL"]);
        if (!user.unlocks["COLORTRAIL"]) user.colors[1] = color;
      }
      updateUser();
    }
  });
  $("#player1 .colorRowTrail .colorContainer .colorItem").click(function () {
    if (!Game || Game.stage === 2) {
      //Get color id
      var color = colors.store[$(this).attr('class').split(" ")[1]];
      //console.log(color);
      if (color && user.unlocks["COLORTRAIL"]) {
        user.colors[1] = color;
      }
      updateUser();
    }
  });
  $("#player2 .colorRowBase .colorContainer .colorItem").click(function () {
    if (!Game || Game.stage === 2) {
      //Get color id
      var color = colors.store[$(this).attr('class').split(" ")[1]];
      //console.log(color);
      if (color && user.unlocks["COLORBASE"]) {
        user.colors[2] = color;
        //If trail not unlocked set trail to base
        //console.log(user.unlocks["COLORTRAIL"]);
        if (!user.unlocks["COLORTRAIL"]) user.colors[3] = color;
      }
      updateUser();
    }
  });
  $("#player2 .colorRowTrail .colorContainer .colorItem").click(function () {
    if (!Game || Game.stage === 2) {
      //Get color id
      var color = colors.store[$(this).attr('class').split(" ")[1]];
      //console.log(color);
      if (color && user.unlocks["COLORTRAIL"]) {
        user.colors[3] = color;
      }
      updateUser();
    }
  });
  $(".colorRowBase .colorOverlay").click(function () {
    if (!Game || Game.stage === 2) {
      var price = colors.store.basePrice;
      //console.log("purchasing",price);
      if (user.cash >= price) {
        user.cash -= price;
        user.unlocks["COLORBASE"] = true;
        // tracker.sendEvent("UNLOCKS", "COLORBASE");
        updateUser();
      }
    }
  });
  $(".prism").click(function () {
    if (user.unlocks["PRISM"]) {
      //Owned
      if (!Game || Game.stage === 2) {
        //Get player
        if ($(this).parent().parent().attr("id") === "player1") {
          //Set player 1
          user.colors[0] = "PRISM";
          $(this).addClass("selected");
        } else { //Player 2
          user.colors[2] = "PRISM";
          $(this).addClass("selected");
        }
        updateUser();
      }
    } else {
      console.log("Opening prism window");
      // tracker.sendEvent("CLICK", "PRISM");
      // chrome.app.window.create(
      //   'prism.html',
      //   {
      //     id: 'prismWindow',
      //     width: 400,
      //     height: 650,
      //     minWidth: 400,
      //     minHeight: 650,
      //     resizable: false,
      //     frame: {
      //       type: 'chrome',
      //       color: '#465298'
      //     }
      //   }
      // );
    }
  });
  $("#reset").click(function () {
    resetCanvas();
  });


};

