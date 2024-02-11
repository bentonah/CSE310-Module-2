document.addEventListener("DOMContentLoaded", () => {
    // Initialize variables
    let gridSize = parseInt($("#grid-size").val()); // Get initial grid size from the dropdown
    let deckSize = gridSize * 5; // Calculate initial deck size based on grid size
    let deck = generateDeck(deckSize); // Generate the initial deck
    let shuffledDeck = shuffleDeck(deck); // Shuffle the initial deck
    const gameBoard = $("#game-board"); // Reference to the game board container
    const resetButton = $("#reset-button"); // Reference to the reset button
    let flippedCards = []; // Array to store flipped cards for comparison
  
    // Function to generate the deck
    function generateDeck(size) {
      const colors = generateRandomColors(size / 2);
      const deck = [];
  
      for (let i = 1; i <= size / 2; i++) {
        const color = colors[i - 1];
  
        deck.push({ color, number: i });
        deck.push({ color, number: i });
      }
  
      return deck;
    }
  
    // Function to shuffle the deck
    function shuffleDeck(deck) {
      return deck.sort(() => Math.random() - 0.5);
    }
  
    // Function to generate random colors for the cards
    function generateRandomColors(count) {
      const randomColors = [];
      for (let i = 0; i < count; i++) {
        const color = getRandomColor();
        randomColors.push(color);
      }
      return randomColors;
    }
  
    // Function to get a random color
    function getRandomColor() {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    }
  
    // Function to create a card element
    function createCard(cardInfo, index) {
      const { color, number } = cardInfo;
      const card = $("<div>")
        .addClass("card face-down")
        .data({ color, number, index })
        .click(handleCardClick);
  
      const cardText = $("<div>").addClass("card-text").text(number).hide();
  
      card.append(cardText);
      gameBoard.append(card);
    }
  
    // Function to render the game board
    function renderBoard(deck) {
      gameBoard.empty();
      deck.forEach((cardInfo, index) => {
        createCard(cardInfo, index);
      });
    }
  
    // Function to handle a card click
    function handleCardClick() {
      const clickedCard = $(this);
  
      if (!clickedCard.hasClass("face-down") || flippedCards.length === 2) {
        return;
      }
  
      clickedCard.toggleClass("face-down face-up");
      clickedCard.find(".card-text").toggle();
  
      flippedCards.push(clickedCard);
  
      if (flippedCards.length === 2) {
        setTimeout(checkMatch, 1000);
      }
    }
  
    // Function to check if two flipped cards match
    function checkMatch() {
      const [card1, card2] = flippedCards;
  
      if (
        card1.data("color") === card2.data("color") &&
        card1.data("number") === card2.data("number")
      ) {
        flippedCards = [];
        card1.addClass("matched");
        card2.addClass("matched");
        checkWin();
      } else {
        flippedCards = [];
        setTimeout(() => {
          resetCards(card1, card2);
        }, 500);
      }
    }
  
    // Function to reset unmatched cards
    function resetCards(card1, card2) {
      card1.toggleClass("face-down face-up");
      card2.toggleClass("face-down face-up");
      card1.find(".card-text").toggle();
      card2.find(".card-text").toggle();
    }
  
    // Function to check if the player has won
    function checkWin() {
      const faceUpCards = $(".card:not(.face-down)");
      if (faceUpCards.length === deck.length) {
        alert("Congratulations! You've won!");
      }
    }
  
    // Function to reset the game
    function resetGame() {
      gridSize = parseInt($("#grid-size").val());
      deckSize = gridSize * 5;
      deck = generateDeck(deckSize);
      shuffledDeck = shuffleDeck(deck);
      flippedCards = [];
      renderBoard(shuffledDeck);
    }
  
    // Event listener for grid size changes
    $("#grid-size").change(() => {
      resetGame();
    });
  
    // Event listener for reset button click
    resetButton.click(resetGame);
  
    // Initial rendering of the game board
    renderBoard(shuffledDeck);
  });  