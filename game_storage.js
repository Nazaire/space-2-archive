var user = {
  kills: 0,
  sprecord: 0,
  cooprecord: 0,
  cash: 0,
  selected: "BOOST", //Selected ability
  abilities: ["BOOST"], //
  colors: ["#52BBFF", "#52BBFF", "#A3FF52", "#A3FF52"], //Current colours
  controls: [
    [87, 83, 65, 68, 32, 69],
    [73, 75, 74, 76, 191, 222]
  ],
  unlocks: {
    "COLORBASE": false,
    "COLORTRAIL": false,
    "PRISM": false //See if works without this attribute
  }
};
function getLicenses() { //Get purchased products
  console.log("google.payments.inapp.getPurchases");
  // google.payments.inapp.getPurchases({
  //   'parameters': { env: "prod" },
  //   'success': onLicenseUpdate,
  //   'failure': onLicenseUpdateFailed
  // });
}

function onLicenseUpdate(response) {
  console.log("onLicenseUpdate", response);
  var licenses = response.response.details;
  var count = licenses.length;
  user.unlocks["PRISM"] = false;
  for (var i = 0; i < count; i++) {
    var license = licenses[i];
    if (license.sku === "special.prism" && !user.unlocks["PRISM"]) {
      console.log("Prism product is owned, giving to user for first time");
      // tracker.sendEvent("UNLOCKS", "PRISM");
      user.unlocks["COLORBASE"] = true;
      user.unlocks["COLORTRAIL"] = true;
      user.unlocks["PRISM"] = true;
    }
  }
  updateUser();
}

function onLicenseUpdateFailed(response) {
  console.log("onLicenseUpdateFailed", response);
  updateUser();
}

function updateUser() {
  //Choose ability
  ability = user.selected;
  for (abi = 0; abi < user.abilities.length; abi++) {
    abilitiesStore[user.abilities[abi]].owned = true;
  }
  refreshAbilities();

  //Unlock color rows
  if (user.unlocks["COLORBASE"]) {
    $(".colorRowBase").removeClass("locked");
  } else {
    $(".colorRowBase").addClass("locked");
    user.colors[0] = colors.store["colorBlue"];
    user.colors[2] = colors.store["colorGreen"];
  }
  if (user.unlocks["PRISM"]) {
    $(".prism").removeClass("locked");
  } else {
    $(".prism").addClass("locked");
    if (user.colors[0] === "PRISM" || user.colors[2] === "PRISM") {
      user.colors[0] = colors.store["colorBlue"];
      user.colors[2] = colors.store["colorGreen"];
    }
  }
  if (user.unlocks["COLORTRAIL"]) {
    $(".colorRowTrail").removeClass("locked");
  } else {
    $(".colorRowTrail").addClass("locked");
    if (user.colors[0] === "PRISM") { //THIS SHOULD NEVER OCCUR UNLESS HACKING (but build it anyway)
      user.colors[1] = colors.store["colorBlue"];
    } else {
      user.colors[1] = user.colors[0];
    }
    if (user.colors[2] === "PRISM") { //Player 2
      user.colors[3] = colors.store["colorGreen"];
    } else {
      user.colors[3] = user.colors[2];
    }
  }

  //Display stats
  $("#stats").html('Singleplayer record: Round ' + user.sprecord + ' <br/><br/>Co-Op record: Round ' + user.cooprecord + ' <br/><br/>Total Kills: ' + user.kills);
  //Display cash
  $("#bankCount").html("$" + user.cash);
  //Select color, get id
  $(".colorItem.selected,.specialsItem.selected").removeClass("selected");
  for (i = 0; i < user.colors.length; i++) {
    var colorID;
    for (var key in colors.store) {
      if (colors.store[key] === user.colors[i]) colorID = key;
    }
    switch (i) {
      case 0:
        if (colorID === "prism") {
          $("#player1 .prism").addClass("selected");
        } else {
          $("#player1 .colorRowBase .colorContainer .colorItem." + colorID).addClass("selected");
        }
        break;
      case 1:
        $("#player1 .colorRowTrail .colorContainer .colorItem." + colorID).addClass("selected");
        break;
      case 2:
        if (colorID === "prism") {
          $("#player2 .prism").addClass("selected");
        } else {
          $("#player2 .colorRowBase .colorContainer .colorItem." + colorID).addClass("selected");
        }
        break;
      case 3:
        $("#player2 .colorRowTrail .colorContainer .colorItem." + colorID).addClass("selected");
        break;
    }
  }
  save();
}

function save() {
  localStorage.setItem('user', JSON.stringify({ "user": user }));
}

function load() {
  console.log("LOADING");

  const data = localStorage.getItem('user');
  const parsed = data ? JSON.parse(data) : {};

  if (parsed.user) {
    user = parsed.user;

    if (!user.unlocks) user.unlocks = {};

    user.unlocks["COLORBASE"] = true;
    user.unlocks["COLORTRAIL"] = true;
    user.unlocks["PRISM"] = true;

    //Check storage is updated
    if (!user.unlocks) { //No unlocks
      console.log("Missing updated storage information");
      user.unlocks = {
        "COLORBASE": false,
        "COLORTRAIL": false,
        "PRISM": false
      };
    }
    if (!user.colors) {
      user.colors = ["#52BBFF", "#52BBFF", "#A3FF52", "#A3FF52"];
    }
    if (!user.controls) {
      user.controls = [
        [87, 83, 65, 68, 32, 69],
        [73, 75, 74, 76, 191, 222]
      ];
    }
  } else { //New user
    $("#help").click();
  }

  updateUser()
}

function reset() {
  localStorage.clear(function () {
    console.log("DATA CLEARED");
  });
}