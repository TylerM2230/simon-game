# Pre-work - *Memory Game*

**Memory Game** is a Light & Sound Memory game to apply for CodePath's SITE Program. 

Submitted by: Tyler Miranda

Time spent: 5 hours spent in total

Link to project: [Code](https://glitch.com/edit/#!/cuddly-tinted-morning) / [Live Site](https://cuddly-tinted-morning.glitch.me)

## Required Functionality

The following **required** functionality is complete:

* [x] Game interface has a heading (h1 tag), a line of body text (p tag), and four buttons that match the demo app
* [x] "Start" button toggles between "Start" and "Stop" when clicked. 
* [x] Game buttons each light up and play a sound when clicked. 
* [x] Computer plays back sequence of clues including sound and visual cue for each button
* [x] Play progresses to the next turn (the user gets the next step in the pattern) after a correct guess. 
* [x] User wins the game after guessing a complete pattern
* [x] User loses the game after an incorrect guess

The following **optional** features are implemented:

* [x] Any HTML page elements (including game buttons) has been styled differently than in the tutorial
* [x] Buttons use a pitch (frequency) other than the ones in the tutorial
* [x] More than 4 functional game buttons
* [x] Playback speeds up on each turn
* [x] Computer picks a different pattern each time the game is played
* [x] Player only loses after 3 mistakes (instead of on the first mistake)
* [x] Game button appearance change goes beyond color (e.g. add an image)
* [ ] Game button sound is more complex than a single tone (e.g. an audio file, a chord, a sequence of multiple tones)
* [x] User has a limited amount of time to enter their guess on each turn

The following **additional** features are implemented:

- [x] Add confetti after winning game
- [x] Add mode selection (choice whether to lose after 1 or 3 mistakes)

## Video Walkthrough (GIF)

There are two (2) modes and each button has a unique icon, tone, and color
![buttons work and different modes](https://github.com/TylerM2230/simple-memory-game/blob/main/featuresOne.gif) 
Different modes change number of attempts. Each round has a unique pattern and a limited time to enter guess
![attempts change and counter](https://github.com/TylerM2230/simple-memory-game/blob/main/featuresTwo.gif)
And if you win, you get confetti!
![winning confetti](https://github.com/TylerM2230/simple-memory-game/blob/main/confetti.gif)  

## Reflection Questions
<strong> 1. If you used any outside resources to help complete your submission (websites, books, people, etc) list them here.</strong>
<ul>
    <li>MDN Web Docs</li>
    <li>W3Schools</li>
    <li>GeeksforGeeks</li>
    <li>StackOverflow</li>
    <li>GitHub</li>
    <li>YouTube</li>
    <li>freeCodeCamp</li>
 </ul>
 
<strong> 2. What was a challenge you encountered in creating this submission (be specific)? How did you overcome it? (recommended 200 - 400 words) </strong>
&nbsp;&nbsp;&nbsp;&nbsp;<p>One of the challenges that I encountered was during my implementation of the countdown timer. Initially, I had a problem with rendering the timer onto the page and after several failed attempts I began to feel frustrated that I didn’t manage to get anywhere. I took a brief break and then tried again. I consulted various resources regarding how to implement the functionality. I took the time to understand the intricacies of the functions I was utilizing and after a series of trial and error I was able to accomplish my goal. Another problem that I encountered was that the timer wasn’t functioning properly and it started counting down at the wrong time. In order to ameliorate the problem, I drew up the control flow of the program and thought about when the timer should start and reset. The timer should only start after the computer finished displaying the current sequence and stop after the user finished entering their guess. Therefore, I looked through the code to find which part was responsible for executing the sequence and I set back the invocation of the start of the timer by the amount of time the computer took to play the sequence. Another problem I encountered was during my implementation of the confetti for when the user won. I really wanted there to be something cool to happen when someone won the game but I had no idea how to accomplish it. I utilized what I had learned from the previous problems and drew up the control flow of the program. Additionally, I broke the problem down into manageable parts. After a series of iterations, I was able to implement the feature and ended up with a product that I was satisfied with.</p>

<strong> 3. What questions about web development do you have after completing your submission? (recommended 100 - 300 words) </strong> 
&nbsp;&nbsp;&nbsp;&nbsp;<p>Working on this project has made me more curious to learn how complex web applications are built. Initially, before starting the project, I thought it would be simple to implement including the optional functionalities, however, I soon discovered that it has a degree of complexity and requires you carefully consider how each part interacts with other parts of the program. Considering that a seemingly simple program is in fact complicated, I can only imagine the complexity of more complex applications. But it also makes me excited to learn more about them. Working on this project has also made me wonder how developers deal with frustration when things just don’t seem to work? It’s difficult not to feel dejected when most of the approaches that you try don’t work and when an approach that you spent a good amount of time on ends up being fruitless.</p>

<strong> 4. If you had a few more hours to work on this project, what would you spend them doing (for example: refactoring certain functions, adding additional features, etc). Be specific. (recommended 100 - 300 words)</strong>
&nbsp;&nbsp;&nbsp;&nbsp;<p>If I had additional time to spend on this project, I would spend them implementing additional functionality that allows the user more control regarding the difficulty of the game. I would implement a feature to allow the user to choose the number of buttons in the game. Additionally, I would’ve also liked to allow the user to change the length of the pattern, which is eight by default.  Another modification, that I would’ve liked to implement is the randomization of the icons that are associated with each button for each round. Moreover, I would also like to add an audio snippet that’s associated with the symbol. For example, if a button had the fish icon then it would play a sound of water bubbling.  One other item that I would’ve liked to address is the tiny bug that arises when the stop button is pressed while the clue sequence is still being played. If the game is abruptly stopped when the computer is still playing the clue sequence then the timer continues to start counting down and eventually the “you lost the game” modal is displayed since no more interactions are possible.</p>



## Interview Recording URL Link

[My 5-minute Interview Recording](your-link-here)


## License

    Copyright Tyler Miranda

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
