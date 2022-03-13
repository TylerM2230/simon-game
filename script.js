
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
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  document.getElementById("start-confetti").classList.remove("hidden");
  document.getElementById("stop-confetti").classList.remove("hidden");
  alert("Congratulations. You won!");
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

function scrollBottom()
{
  window.scrollTo(0,document.body.scrollHeight);
}

function generatePattern()
{
  pattern =[];
  for(let ii= 0; ii < 8; ii++)
  {
      pattern.push(Math.floor(Math.random() * (Math.floor(6) - Math.ceil(1)) + Math.ceil(1)));
  }
}

function hideConfettiButtons()
{
  document.getElementById("start-confetti").classList.add("hidden");
  document.getElementById("stop-confetti").classList.add("hidden");
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
