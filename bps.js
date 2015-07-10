var myAudioContext,
  myBuffer,
  mySource,
  myNodes = {},
  myBps = 2,
  isPlaying = false;


function initBPS() {

    if('webkitAudioContext' in window) {
      myAudioContext = new webkitAudioContext();
    } else {
      myAudioContext = new AudioContext();
    }
    var request = new XMLHttpRequest();
    request.open('GET', '/Pop.mp3', true);
    request.responseType = 'arraybuffer';
    request.addEventListener('load', bufferCallback, false);
    request.send();
  }

  function bufferCallback(event) {
    var request = event.target;
    myAudioContext.decodeAudioData(request.response,
      function(buffer) { myBuffer = buffer; }
    );
  }

  function routeSound(source) {
    myNodes.panner = myAudioContext.createPanner();
    myNodes.volume = myAudioContext.createGain();

    // set node values to current slider values
    var panX = document.querySelector('#pan').value;
    var volume = document.querySelector('#volume').value;

    myNodes.panner.setPosition(panX, 0, 0);
    myNodes.volume.gain.value = volume;

    // pass source through series of nodes
    source.connect(myNodes.panner);
    myNodes.panner.connect(myNodes.volume);
    myNodes.volume.connect(myAudioContext.destination);

    return source;
  }

  function playSound() {
    // create a new AudioBufferSourceNode
    var source = myAudioContext.createBufferSource();
    source.buffer = myBuffer;
    source.loop = true;
    source.loopStart = 0;
    source.loopEnd = 1.0 / myBps;
    source = routeSound(source);
    source.start(0);
    mySource = source;
  }

  function pauseSound() {
    mySource.stop(0);
  }

  function toggleSound(button) {
    if (isPlaying) {
      pauseSound();
      button.value = "Start";
      isPlaying = false;
    } else {
      playSound();
      button.value = "Stop";
      isPlaying = true;
    }
  }

  function volumeChange(slider) {
    if (myNodes.volume) {
      var volume = slider.value;
      myNodes.volume.gain.value = volume;
    }
  }

  function panChange(slider) {
    if (myNodes.panner) {
      var panX = slider.value;
      myNodes.panner.setPosition(panX, 0, 0);
    }
  }

  function bpsChange(radio) {
    myBps = radio.value;
    if (isPlaying) {
      mySource.loopEnd = 1.0 / myBps;
    }
  }

