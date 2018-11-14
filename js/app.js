let toggledCards = [];
let clockOff = true;
let time = 0;
let matched = 0;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const deck = document.querySelector('.deck');
let moves = 0;
function shuffleDeck() {
    const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
    const shuffledCards = shuffle(cardsToShuffle);
    for (card of shuffledCards) {
        deck.appendChild(card);
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
shuffleDeck();
function shuffle(array) {
    var currentIndex = array.length
    , temporaryValue
    , randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/** Functionality to tracks and increments no. of moves by the player */
function incrementMoves() {
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}
/* Udates score/star ratings of the player based on no. of moves made the player to win the game */
function updateScore() {
    if (moves === 15 || moves === 20) {
        removeStar();
    }
}
/** shows star ratings of the player */
function removeStar() {
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
}
/** Clock function to count time elapsed for a game */
let clockId;
function startClock() {
    clockId = setInterval(() => {
        time++;
        displayTime();
    }, 1000);
}

/** Displays time on the page that player can refer to */
function displayTime() {
    const clock = document.querySelector('.clock');
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    if (seconds < 10) {
        clock.innerHTML = `${minutes}:0${seconds}`;
    } else {
        clock.innerHTML = `${minutes}:${seconds}`;
    }
}

/**Stops clock */
function stopClock() {
    clearInterval(clockId)
}

/** Event listner on clickinkg of any card.
 * Updates moves and score.
 * Checks if two cards are toggled, if yes, checks if they match.  
 */
deck.addEventListener('click', event => {
    const clickTarget = event.target;
    if (clickTarget.classList.contains('card') && !clickTarget.classList.contains('match') && toggledCards.length < 2 && !toggledCards.includes(clickTarget)) {
        if (clockOff) {
            startClock();
            clockOff = false;
        }
        toggleCard(clickTarget);
        addToggleCard(clickTarget);
        if (toggledCards.length === 2) {
            checkForMatch();
            incrementMoves();
            updateScore();
        }
    }
});
/**Function to view content of the card on toggle */
function toggleCard(clickTarget) {
    clickTarget.classList.toggle('open');
    clickTarget.classList.toggle('show');
}
/**Kepps track of toggled cards */
function addToggleCard(clickTarget) {
    toggledCards.push(clickTarget);
}
/**Function to check if two toggled cards match and if all cards are matched, game finishes. */
function checkForMatch() {
    if (toggledCards[0].firstElementChild.className === toggledCards[1].firstElementChild.className) {
        toggledCards[0].classList.toggle('match');
        toggledCards[1].classList.toggle('match');
        toggledCards = [];
        matched++;
        if (matched === 8) {
            gameOver();
        }
    } else {
        setTimeout(() => {
            toggleCard(toggledCards[0]);
            toggleCard(toggledCards[1]);
            toggledCards = [];
        }, 1000);
    }
}
/** Shows or hides Modal displaying stats */
function toggleModal() {
    const modal = document.querySelector('.modal_background');
    modal.classList.toggle('hide')
}
/** Updates stats(stars, clocktime, moves) on the result modal after game over. */
function writeModalStats() {
    const timeStat = document.querySelector('.modal_time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const movesStat = document.querySelector('.modal_moves');
    const starsStat = document.querySelector('.modal_stars');
    const stars = getStars();


    timeStat.innerHTML = `Time = ${clockTime}`;
    movesStat.innerHTML = `Moves = ${moves}`;
    starsStat.innerHTML = `Stars = ${stars}`;
}

/** Displays stars */
function getStars() {
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars) {
        if (star.style.display !== 'none') {
            starCount++;
        }
    }
    return starCount;
}

/** Game reset function: stops clock and starts new fresh game. */
function resetGame() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
    shuffleDeck();
    matched = 0;
}

/** Event listners for restart, replay and cancel clicks */
document.querySelector('.restart').addEventListener('click', restartGame);
document.querySelector('.modal_replay').addEventListener('click', replayGame);
document.querySelector('.modal_cancel').addEventListener('click', () => {
    toggleModal();
    matched = 0;
});

/** Game over function: stops clock, updates stats to be displayed on the result modal and show modal on screen. */
function gameOver() {
    stopClock();
    writeModalStats();
    toggleModal();
}

/**Replay game function: resets all prior setups and starts fresh */
function replayGame() {
    resetGame();
    toggleModal();
    resetCards();
}
/** Restarts the game from beginning by resetting everything. */
function restartGame() {
    resetGame();
    resetCards();
}
/** Resets all the cards, closes all of them to hide their contents */
function resetCards() {
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
