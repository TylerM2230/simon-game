
/**
 * SIMON GAME - Light and Sound Memory Game
 * A classic memory game where players must repeat increasingly longer sequences
 * of colored button presses with audio cues.
 */

// =============================================================================
// GAME CONSTANTS
// =============================================================================

// Timing constants for game flow
const cluePauseTime = 333;      // Milliseconds to pause between clues
const nextClueWaitTime = 1000;  // Milliseconds to wait before starting clue playback
const playerTimeLimit = 10;     // Seconds player has to make their guess
const gameOverDelay = 5000;     // Milliseconds before showing game over

// =============================================================================
// GLOBAL GAME STATE VARIABLES
// =============================================================================

// Core game state
var pattern = [];               // Array storing the sequence of button presses
var progress = 0;               // Current position in the pattern (how far player has progressed)
var gamePlaying = false;        // Whether a game is currently active
var guessCounter = 0;           // Current position in player's guess sequence
var strikes = 3;                // Number of mistakes allowed before game over

// Audio system variables
var tonePlaying = false;        // Whether a tone is currently playing
var volume = 0.5;               // Audio volume (0.0 to 1.0)

// Timing variables
var clueHoldTime = 1000;        // How long to hold each clue's light/sound (decreases over time)
var intervalID;                 // Timer ID for the countdown timer

// Game mode settings
var suddenDeath = false;        // Whether sudden death mode is active (1 mistake = game over)


/**
 * Starts a new game session
 * Initializes all game variables and begins the first clue sequence
 */
function startGame() {
  // Reset core game state
  progress = 0;
  gamePlaying = true;
  clueHoldTime = 1000;

  // Set strikes based on game mode (sudden death = 1 strike, regular = 3 strikes)
  strikes = suddenDeath ? 1 : 3;

  // Update UI: hide start button, show stop button
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");

  // Hide mode selection buttons during gameplay
  document.getElementById("suddenDeathBtn").classList.add("hidden");
  document.getElementById("regularModeBtn").classList.add("hidden");

  // Initialize game UI elements
  renderStrikes();
  generatePattern();
  playClueSequence();
}

/**
 * Stops the current game and resets the UI to the initial state
 */
function stopGame() {
  // Stop game state
  gamePlaying = false;
  resetTimer();

  // Clear UI elements
  document.getElementById("strikes").innerHTML = "";
  document.getElementById("bottom2").innerHTML = '';

  // Swap buttons: hide stop button, show start button
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("startBtn").classList.remove("hidden");

  // Show appropriate mode button based on current mode
  let suddenElem = document.getElementById("suddenDeathBtn");
  let regularElem = document.getElementById("regularModeBtn");

  // Show the opposite mode button (if in sudden death, show regular mode option)
  suddenDeath ? regularElem.classList.remove("hidden") : suddenElem.classList.remove("hidden");
}

/**
 * Handles game over scenario when player loses
 * Shows lose modal and resets game state
 */
function loseGame() {
  stopGame();

  // Configure modal to show lose message
  document.getElementById("modal-win-text").classList.add("hidden");
  document.getElementById("modal-lose-text").classList.remove("hidden");

  displayModal();
}

/**
 * Handles victory scenario when player completes the pattern
 * Shows win modal with confetti animation and resets game state
 */
function winGame() {
  stopGame();

  // Configure modal to show win message
  document.getElementById("modal-lose-text").classList.add("hidden");
  document.getElementById("modal-win-text").classList.remove("hidden");

  // Show celebration
  displayModal();
  displayConfetti();

  // Show appropriate mode button
  let suddenElem = document.getElementById("suddenDeathBtn");
  let regularElem = document.getElementById("regularModeBtn");
  suddenDeath ? regularElem.classList.remove("hidden") : suddenElem.classList.remove("hidden");
}

/**
 * Lights up a game button by adding the 'lit' CSS class
 * @param {number} btn - Button number (1-6)
 */
function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}

/**
 * Turns off the light for a game button by removing the 'lit' CSS class
 * @param {number} btn - Button number (1-6)
 */
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

/**
 * Plays a single clue by lighting the button and playing its tone
 * @param {number} btn - Button number (1-6) to activate
 */
function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

/**
 * Plays the complete clue sequence up to the current progress level
 * Each clue is played with appropriate timing delays
 * Starts the player timer after all clues finish playing
 */
function playClueSequence() {
  // Ensure audio context is active
  context.resume();

  // Reset player's guess position
  guessCounter = 0;

  // Calculate timing for clue playback
  let delay = nextClueWaitTime;
  let timerDelay = 0;

  // Calculate total time for all clues to finish playing
  for (let i = 0; i <= progress; i++) {
    timerDelay += clueHoldTime;
    timerDelay += cluePauseTime;
  }

  // Schedule each clue in the sequence
  for (let i = 0; i <= progress; i++) {
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]);
    delay += clueHoldTime;
    delay += cluePauseTime;
  }

  // Speed up the game by reducing clue hold time (makes game progressively harder)
  clueHoldTime -= 25 * progress;

  // Start the player timer after all clues finish
  setTimeout(startTimer, timerDelay);
}

/**
 * Updates the strikes display to show remaining attempts
 * Handles singular/plural text appropriately
 */
function renderStrikes() {
  // Clear existing strikes display
  document.getElementById("strikes").innerHTML = "";

  // Create new strike display element
  let strike = document.createElement('div');
  strike.innerText = strikes == 1 ? strikes + " more attempt" : strikes + " more attempts";

  // Add to DOM
  document.getElementById("strikes").appendChild(strike);
}


/**
 * Starts the countdown timer for player input
 * Player has 10 seconds to complete their guess sequence
 * Automatically triggers game over if time runs out
 */
function startTimer() {
  let count = 0;
  let timeLeft = playerTimeLimit;

  intervalID = setInterval(function() {
    count++;
    let remaining = timeLeft - count;

    // Update display with appropriate singular/plural text
    document.getElementById("counter-text").textContent =
      remaining == 1 ? remaining + " second left" : remaining + " seconds left";

    // Check if time is up
    if (count == timeLeft) {
      loseGame();
    }
  }, 1000);
}

/**
 * Stops and resets the countdown timer
 * Clears the timer display
 */
function resetTimer() {
  clearInterval(intervalID);
  console.log("reset timer");
  document.getElementById("counter-text").textContent = '';
}


/**
 * Generates a new random pattern of 8 button presses
 * Each element is a random number from 1-6 (corresponding to the 6 game buttons)
 */
function generatePattern() {
  pattern = [];

  // Generate 8 random button numbers (1-6)
  for (let i = 0; i < 8; i++) {
    // Generate random number between 1 and 6 (inclusive)
    pattern.push(Math.floor(Math.random() * 6) + 1);
  }
}


/**
 * Activates sudden death mode (1 mistake = game over)
 * Updates UI to reflect the mode change
 */
function suddenDeathMode() {
  suddenDeath = true;

  // Switch instruction text
  document.getElementById("sudden-death").classList.remove("hidden");
  document.getElementById("regular-mode").classList.add("hidden");

  // Switch mode buttons
  document.getElementById("suddenDeathBtn").classList.add("hidden");
  document.getElementById("regularModeBtn").classList.remove("hidden");
}

/**
 * Activates regular mode (3 mistakes allowed)
 * Updates UI to reflect the mode change
 */
function regularMode() {
  suddenDeath = false;

  // Switch instruction text
  document.getElementById("sudden-death").classList.add("hidden");
  document.getElementById("regular-mode").classList.remove("hidden");

  // Switch mode buttons
  document.getElementById("suddenDeathBtn").classList.remove("hidden");
  document.getElementById("regularModeBtn").classList.add("hidden");
}

/**
 * Handles player button presses and game logic
 * Checks if the guess matches the pattern and manages game progression
 * @param {number} btn - Button number (1-6) that was pressed
 */
function guess(btn) {
  console.log("user guessed: " + btn);

  // Ignore clicks if game is not active
  if (!gamePlaying) {
    return;
  }

  // Check if the guess is correct
  if (pattern[guessCounter] == btn) {
    // Correct guess
    if (guessCounter == progress) {
      // Player completed this round
      resetTimer();

      if (progress == pattern.length - 1) {
        // Player completed entire pattern - they win!
        winGame();
      } else {
        // Move to next round with longer sequence
        progress++;
        playClueSequence();
      }
    } else {
      // Continue with current round
      guessCounter++;
    }
  } else {
    // Incorrect guess - handle strikes
    if (strikes > 1) {
      // Player has strikes remaining
      strikes--;
      renderStrikes();
    } else {
      // Final strike - game over
      strikes--;
      renderStrikes();
      resetTimer();
      setTimeout(loseGame, gameOverDelay);
    }
  }
}

// =============================================================================
// AUDIO SYSTEM FUNCTIONS
// =============================================================================

/**
 * Frequency mapping for each game button
 * Each button has a unique tone to help players distinguish them
 */
const freqMap = {
  1: 430.6,  // Button 1 (Dragon) - A4 note
  2: 294.2,  // Button 2 (Dove) - D4 note
  3: 362.9,  // Button 3 (Crow) - F#4 note
  4: 726.2,  // Button 4 (Dog) - F#5 note
  5: 300.4,  // Button 5 (Fish) - D4 note (slightly higher)
  6: 502     // Button 6 (Kiwi) - C5 note
};

/**
 * Plays a tone for a specific duration (used during clue playback)
 * @param {number} btn - Button number (1-6)
 * @param {number} len - Duration to play the tone in milliseconds
 */
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;

  // Automatically stop the tone after the specified duration
  setTimeout(function () {
    stopTone();
  }, len);
}

/**
 * Starts playing a tone (used when player presses and holds a button)
 * @param {number} btn - Button number (1-6)
 */
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}

/**
 * Stops the currently playing tone
 */
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// =============================================================================
// AUDIO SYSTEM INITIALIZATION
// =============================================================================

/**
 * Initialize the Web Audio API for sound synthesis
 * Creates oscillator and gain nodes for generating game sounds
 */
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();        // Main audio context
var o = context.createOscillator();      // Oscillator for generating tones
var g = context.createGain();            // Gain node for volume control

// Connect audio nodes: oscillator -> gain -> speakers
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);  // Start with volume at 0
o.connect(g);
o.start(0);  // Start the oscillator

/**
 * Shows the game result modal (win/lose)
 */
function displayModal() {
  modal.style.display = "block";
}

// =============================================================================
// MODAL SYSTEM (Win/Lose Dialogs)
// =============================================================================

// Get modal elements
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

/**
 * Modal event handlers for closing the modal
 */

// Close modal when user clicks the X button
span.onclick = function() {
  modal.style.display = "none";
}

// Close modal when user clicks outside the modal content
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


/**
 * Displays confetti animation for winning the game
 * Starts confetti after 1 second delay, stops after 5 seconds
 */
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


// =============================================================================
// CONFETTI ANIMATION LIBRARY
// =============================================================================

/**
 * Confetti animation system for victory celebration
 * This is a minified confetti library that creates falling confetti particles
 */
var confetti={maxCount:150,speed:2,frameInterval:15,alpha:1,gradient:!1,start:null,stop:null,toggle:null,pause:null,resume:null,togglePause:null,remove:null,isPaused:null,isRunning:null};!function(){confetti.start=s,confetti.stop=w,confetti.toggle=function(){e?w():s()},confetti.pause=u,confetti.resume=m,confetti.togglePause=function(){i?m():u()},confetti.isPaused=function(){return i},confetti.remove=function(){stop(),i=!1,a=[]},confetti.isRunning=function(){return e};var t=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame,n=["rgba(30,144,255,","rgba(107,142,35,","rgba(255,215,0,","rgba(255,192,203,","rgba(106,90,205,","rgba(173,216,230,","rgba(238,130,238,","rgba(152,251,152,","rgba(70,130,180,","rgba(244,164,96,","rgba(210,105,30,","rgba(220,20,60,"],e=!1,i=!1,o=Date.now(),a=[],r=0,l=null;function d(t,e,i){return t.color=n[Math.random()*n.length|0]+(confetti.alpha+")"),t.color2=n[Math.random()*n.length|0]+(confetti.alpha+")"),t.x=Math.random()*e,t.y=Math.random()*i-i,t.diameter=10*Math.random()+5,t.tilt=10*Math.random()-10,t.tiltAngleIncrement=.07*Math.random()+.05,t.tiltAngle=Math.random()*Math.PI,t}function u(){i=!0}function m(){i=!1,c()}function c(){if(!i)if(0===a.length)l.clearRect(0,0,window.innerWidth,window.innerHeight),null;else{var n=Date.now(),u=n-o;(!t||u>confetti.frameInterval)&&(l.clearRect(0,0,window.innerWidth,window.innerHeight),function(){var t,n=window.innerWidth,i=window.innerHeight;r+=.01;for(var o=0;o<a.length;o++)t=a[o],!e&&t.y<-15?t.y=i+100:(t.tiltAngle+=t.tiltAngleIncrement,t.x+=Math.sin(r)-.5,t.y+=.5*(Math.cos(r)+t.diameter+confetti.speed),t.tilt=15*Math.sin(t.tiltAngle)),(t.x>n+20||t.x<-20||t.y>i)&&(e&&a.length<=confetti.maxCount?d(t,n,i):(a.splice(o,1),o--))}(),function(t){for(var n,e,i,o,r=0;r<a.length;r++){if(n=a[r],t.beginPath(),t.lineWidth=n.diameter,i=n.x+n.tilt,e=i+n.diameter/2,o=n.y+n.tilt+n.diameter/2,confetti.gradient){var l=t.createLinearGradient(e,n.y,i,o);l.addColorStop("0",n.color),l.addColorStop("1.0",n.color2),t.strokeStyle=l}else t.strokeStyle=n.color;t.moveTo(e,n.y),t.lineTo(i,o),t.stroke()}}(l),o=n-u%confetti.frameInterval),requestAnimationFrame(c)}}function s(t,n,o){var r=window.innerWidth,u=window.innerHeight;window.requestAnimationFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){return window.setTimeout(t,confetti.frameInterval)};var m=document.getElementById("confetti-canvas");null===m?((m=document.createElement("canvas")).setAttribute("id","confetti-canvas"),m.setAttribute("style","display:block;z-index:999999;pointer-events:none;position:fixed;top:0"),document.body.prepend(m),m.width=r,m.height=u,window.addEventListener("resize",function(){m.width=window.innerWidth,m.height=window.innerHeight},!0),l=m.getContext("2d")):null===l&&(l=m.getContext("2d"));var s=confetti.maxCount;if(n)if(o)if(n==o)s=a.length+o;else{if(n>o){var f=n;n=o,o=f}s=a.length+(Math.random()*(o-n)+n|0)}else s=a.length+n;else o&&(s=a.length+o);for(;a.length<s;)a.push(d({},r,u));e=!0,i=!1,c(),t&&window.setTimeout(w,t)}function w(){e=!1}}();