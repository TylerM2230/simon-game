
// global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern;
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0
var guessCounter = 0;
var strikes;
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var intervalID;

var suddenDeath = false;


function startGame() {
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  clueHoldTime = 1000;
  strikes = suddenDeath ? 1 : 3;
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");

  document.getElementById("suddenDeathBtn").classList.add("hidden");
  document.getElementById("regularModeBtn").classList.add("hidden");
  
  renderStrikes();
  generatePattern();
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  resetTimer();
  generatePattern();
  document.getElementById("strikes").innerHTML = "";
  document.getElementById("bottom2").innerHTMl = '';
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("startBtn").classList.remove("hidden");
  
  let suddenElem = document.getElementById("suddenDeathBtn");
  let regularElem = document.getElementById("regularModeBtn");
  
  suddenDeath ? regularElem.classList.remove("hidden"): suddenElem.classList.remove("hidden")
}

function loseGame() {
  stopGame();
  document.getElementById("modal-win-text").classList.add("hidden");
  document.getElementById("modal-lose-text").classList.remove("hidden");
  displayModal();
  //alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  document.getElementById("modal-lose-text").classList.add("hidden");
  document.getElementById("modal-win-text").classList.remove("hidden");
  
  displayModal();
  displayConfetti();
  let suddenElem = document.getElementById("suddenDeathBtn");
  let regularElem = document.getElementById("regularModeBtn");
  
  suddenDeath ? regularElem.classList.remove("hidden"): suddenElem.classList.remove("hidden")
}

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}

function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  context.resume();
  guessCounter = 0;
  let delay = nextClueWaitTime;
  let timerDelay = 0;
  for (let i = 0; i <= progress; i++)
    {
      timerDelay += clueHoldTime;
      timerDelay += cluePauseTime;
    }
  for (let i = 0; i <= progress; i++) {
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
    
  }
  clueHoldTime -= 25*progress;
  setTimeout(startTimer,timerDelay);
}

function renderStrikes()
{
    document.getElementById("strikes").innerHTML = "";
    let strike = document.createElement('div');
    strike.innerText = strikes ==  1 ? strikes + " more attempt" : strikes +" more attempts";
    document.getElementById("strikes").appendChild(strike);
}


function startTimer()
{
    let count = 0;
    let timeLeft = 10;
    intervalID = setInterval(function(){
      count++;
      document.getElementById("counter-text").textContent = (timeLeft-count) == 1 ? + (timeLeft-count) + " second left" : (timeLeft-count) +" seconds left";
      if(count == timeLeft)
        {
          loseGame();
        }
    },1000);
}

function resetTimer(){
  clearInterval(intervalID);
  console.log("reset timer")
  document.getElementById("counter-text").textContent = '';
}


function generatePattern()
{
  pattern =[];
  for(let ii= 0; ii < 8; ii++)
  {
      pattern.push(Math.floor(Math.random() * (Math.floor(6) - Math.ceil(1)) + Math.ceil(1)));
  }
}


function suddenDeathMode()
{
  suddenDeath = true;
  //switch instructions
  document.getElementById("sudden-death").classList.remove("hidden");
  document.getElementById("regular-mode").classList.add("hidden");
  
  //switch buttons
  document.getElementById("suddenDeathBtn").classList.add("hidden");
  document.getElementById("regularModeBtn").classList.remove("hidden");
}

function regularMode(){
  suddenDeath = false;
  
  document.getElementById("sudden-death").classList.add("hidden");
  document.getElementById("regular-mode").classList.remove("hidden");
  
  document.getElementById("suddenDeathBtn").classList.remove("hidden");
  document.getElementById("regularModeBtn").classList.add("hidden");
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }

  if (pattern[guessCounter] == btn) {
    if (guessCounter == progress) {
      resetTimer();
      if (progress == pattern.length - 1) {
        winGame();
      } else {
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  }
  else if(strikes > 1)
  {
    strikes--;
    renderStrikes();
  }
  else {
    strikes--;
    renderStrikes();
    resetTimer();
    setTimeout(loseGame(), 5000);
  }
}

// Sound Synthesis Functions
const freqMap = {
  1: 430.6,
  2: 294.2,
  3: 362.9,
  4: 726.2,
  5: 300.4,
  6: 502
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function displayModal()
{
  modal.style.display = "block";
}

//Modal

var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


const displayConfetti = () => {
        const startit = () => {
          setTimeout(function () {
            confetti.start();
          }, 1000);
        };
        const stopit = () => {
          setTimeout(function () {
            confetti.stop();
          }, 5000);
        };
        startit();
        stopit();
      };


var confetti={maxCount:150,speed:2,frameInterval:15,alpha:1,gradient:!1,start:null,stop:null,toggle:null,pause:null,resume:null,togglePause:null,remove:null,isPaused:null,isRunning:null};!function(){confetti.start=s,confetti.stop=w,confetti.toggle=function(){e?w():s()},confetti.pause=u,confetti.resume=m,confetti.togglePause=function(){i?m():u()},confetti.isPaused=function(){return i},confetti.remove=function(){stop(),i=!1,a=[]},confetti.isRunning=function(){return e};var t=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame,n=["rgba(30,144,255,","rgba(107,142,35,","rgba(255,215,0,","rgba(255,192,203,","rgba(106,90,205,","rgba(173,216,230,","rgba(238,130,238,","rgba(152,251,152,","rgba(70,130,180,","rgba(244,164,96,","rgba(210,105,30,","rgba(220,20,60,"],e=!1,i=!1,o=Date.now(),a=[],r=0,l=null;function d(t,e,i){return t.color=n[Math.random()*n.length|0]+(confetti.alpha+")"),t.color2=n[Math.random()*n.length|0]+(confetti.alpha+")"),t.x=Math.random()*e,t.y=Math.random()*i-i,t.diameter=10*Math.random()+5,t.tilt=10*Math.random()-10,t.tiltAngleIncrement=.07*Math.random()+.05,t.tiltAngle=Math.random()*Math.PI,t}function u(){i=!0}function m(){i=!1,c()}function c(){if(!i)if(0===a.length)l.clearRect(0,0,window.innerWidth,window.innerHeight),null;else{var n=Date.now(),u=n-o;(!t||u>confetti.frameInterval)&&(l.clearRect(0,0,window.innerWidth,window.innerHeight),function(){var t,n=window.innerWidth,i=window.innerHeight;r+=.01;for(var o=0;o<a.length;o++)t=a[o],!e&&t.y<-15?t.y=i+100:(t.tiltAngle+=t.tiltAngleIncrement,t.x+=Math.sin(r)-.5,t.y+=.5*(Math.cos(r)+t.diameter+confetti.speed),t.tilt=15*Math.sin(t.tiltAngle)),(t.x>n+20||t.x<-20||t.y>i)&&(e&&a.length<=confetti.maxCount?d(t,n,i):(a.splice(o,1),o--))}(),function(t){for(var n,e,i,o,r=0;r<a.length;r++){if(n=a[r],t.beginPath(),t.lineWidth=n.diameter,i=n.x+n.tilt,e=i+n.diameter/2,o=n.y+n.tilt+n.diameter/2,confetti.gradient){var l=t.createLinearGradient(e,n.y,i,o);l.addColorStop("0",n.color),l.addColorStop("1.0",n.color2),t.strokeStyle=l}else t.strokeStyle=n.color;t.moveTo(e,n.y),t.lineTo(i,o),t.stroke()}}(l),o=n-u%confetti.frameInterval),requestAnimationFrame(c)}}function s(t,n,o){var r=window.innerWidth,u=window.innerHeight;window.requestAnimationFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){return window.setTimeout(t,confetti.frameInterval)};var m=document.getElementById("confetti-canvas");null===m?((m=document.createElement("canvas")).setAttribute("id","confetti-canvas"),m.setAttribute("style","display:block;z-index:999999;pointer-events:none;position:fixed;top:0"),document.body.prepend(m),m.width=r,m.height=u,window.addEventListener("resize",function(){m.width=window.innerWidth,m.height=window.innerHeight},!0),l=m.getContext("2d")):null===l&&(l=m.getContext("2d"));var s=confetti.maxCount;if(n)if(o)if(n==o)s=a.length+o;else{if(n>o){var f=n;n=o,o=f}s=a.length+(Math.random()*(o-n)+n|0)}else s=a.length+n;else o&&(s=a.length+o);for(;a.length<s;)a.push(d({},r,u));e=!0,i=!1,c(),t&&window.setTimeout(w,t)}function w(){e=!1}}();