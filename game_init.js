var ability = "BOOST";
var gamemode = "SINGLEPLAYER";
var canvas, ctx, ch, cw;
var requestID; //Keep track of id
var planets = {
  "deathstar": 1/1000,
  "fire":1/100,
  "glow": 5/1000,
  "lush": 2/100,
  "neptune": 5/100,
  "sand": 5/100
};
var colors = {
  store: {
    basePrice: 1000,
    colorBlue: "#52BBFF",
    colorRed: "#DF4A4A",
    colorGreen: "#A3FF52",
    colorYellow:"#F7F13E",
    colorPurple:"#954AE0",
    colorPink:"#E588E5",
    prism:"PRISM" //Is this needed?
  }
};

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

var Game;