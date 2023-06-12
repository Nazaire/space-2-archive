var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

var Sounds = {};
var soundsReady = false;
var Audio = {
  load: function (url,i) {
    console.log("Loading sound",i,url);
    request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
  
    // Decode asynchronously
    request.onload = function (e) {
      console.log("Decoding data",e);
      audioCtx.decodeAudioData(request.response, function(buffer) {
            var sound = {};
            sound.gain = audioCtx.createGain();
            var source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(sound.gain);
            sound.gain.connect(audioCtx.destination);
            sound.playing = false;
            sound.source  = source;
            sound.buffer = buffer;
            sound.reset = function () {
              if (sound.playing) this.source.stop();
              sound.playing = false;
              
              this.source = audioCtx.createBufferSource();
              this.source.buffer = this.buffer;
              this.source.connect(this.gain);
            };
            sound.play = function () {
              if (!sound.playing) {
              sound.playing = true;
              this.source.start();
              } else {
                sound.reset();
                sound.play();
              }
            };
            Sounds[url] = sound;
            
            if (i < toload.length - 1) {
              Audio.load(toload[i+1],i+1);
            } else {
              Audio.init();
            }
          }, Audio.onError);
    };
    request.send();
  },
  init: function () {
    soundsReady = true;
    Sounds["main.mp3"].source.loop = true;
    Sounds["main.mp3"].play(); 
    Sounds["shot1.mp3"].gain.gain.value = 0.2;
    Sounds["death.mp3"].gain.gain.value = 1;
    Sounds["boom.mp3"].gain.gain.value = 1;
    
  },
  onError: function (e) {
    console.error("Audio Error", e);
  }
};

var toload = ["main.mp3","shot1.mp3","death.mp3","boom.mp3"];
Audio.load(toload[0],0);
