const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;
let playerStands = false;

const playerHandDiv = document.getElementById('player-hand');
const dealerHandDiv = document.getElementById('dealer-hand');
const messageDiv = document.getElementById('message');

document.getElementById('hit-button').addEventListener('click', playerHit);
document.getElementById('stand-button').addEventListener('click', playerStand);
document.getElementById('restart-button').addEventListener('click', startGame);

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({suit, value});
        }
    }
    console.log('Deck created:', deck);
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        const swapIdx = Math.floor(Math.random() * deck.length);
        [deck[i], deck[swapIdx]] = [deck[swapIdx], deck[i]];
    }
    console.log('Deck shuffled:', deck);
}

function getCardValue(card) {
    if (['J', 'Q', 'K'].includes(card.value)) {
        return 10;
    } else if (card.value === 'A') {
        return 11;
    } else {
        return parseInt(card.value);
    }
}

function getHandValue(hand) {
    let value = 0;
    let numAces = 0;
    for (let card of hand) {
        value += getCardValue(card);
        if (card.value === 'A') {
            numAces += 1;
        }
    }
    while (value > 21 && numAces > 0) {
        value -= 10;
        numAces -= 1;
    }
    return value;
}

function updateHandDisplay() {
    console.log('Updating hand display');
    playerHandDiv.innerHTML = '';
    dealerHandDiv.innerHTML = '';
    for (let card of playerHand) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.textContent = `${card.value} ${card.suit}`;
        playerHandDiv.appendChild(cardDiv);
    }
    for (let card of dealerHand) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.textContent = `${card.value} ${card.suit}`;
        dealerHandDiv.appendChild(cardDiv);
    }
    console.log('Player hand:', playerHandDiv);
    console.log('Dealer hand:', dealerHandDiv);
}

function checkForEndOfGame() {
    let playerWon = false;
    if (getHandValue(playerHand) === 21) {
        playerWon = true;
        gameOver = true;
    } else if (getHandValue(playerHand) > 21) {
        gameOver = true;
    }
    if (playerStands) {
        while (getHandValue(dealerHand) < 17) {
            dealerHand.push(deck.pop());
        }
        if (getHandValue(dealerHand) > 21) {
            playerWon = true;
        } else if (getHandValue(dealerHand) > getHandValue(playerHand)) {
            playerWon = false;
        } else {
            playerWon = true;
        }
        gameOver = true;
    } else if (getHandValue(playerHand) > getHandValue(dealerHand)) {
        // This is the logical error
        playerWon = false;
        gameOver = true;
    }
    if (gameOver) {
        updateHandDisplay();
        if (playerWon) {
            messageDiv.textContent = 'You win!';
        } else {
            messageDiv.textContent = 'Dealer wins!';
        }
    }
}


function playerHit() {
    if (gameOver) return;
    playerHand.push(deck.pop());
    updateHandDisplay();
    checkForEndOfGame();
}

function playerStand() {
    if (gameOver) return;
    playerStands = true;
    checkForEndOfGame();
}

function startGame() {
    createDeck();
    shuffleDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    gameOver = false;
    playerStands = false;
    messageDiv.textContent = '';
    updateHandDisplay();
    console.log('Game started');
}

startGame();
