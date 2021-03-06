// MEMORY POKER //
// This index.js holds the cient-side / singleplayer game methods. The more "server-like" methods are in serving.js


// Following GLOBAL vars are initiated and reset in index.js
// var memory_number;
// var chosen_suit;
// var chosen_rank;
// var chosen_card;
// var startTime = null;
// var endTime;
//
// //Number of cards in a cards deck
// var deck_size;
// var shuffled_deck;
// var final_deck;


  // Level_Screen Logic
function choose_level_singleplayer() {
  // Choose number of cards to play with
  document.getElementById("button_10").addEventListener("click", function(){
  var num = document.getElementById("button_10").value;
    num = 2;                          // FOR TESTING FOR TESTING FOR TESTING FOR TESTING FOR TESTING FOR TESTING FOR TESTING FOR TESTING FOR TESTING
    // Memory number is use in part two of the game to know how many cards to remember.
    memory_number = num;
    close_screen("level_screen");
    open_screen("game_part_one");
    new_game(num);
  });
  document.getElementById("button_26").addEventListener("click", function(){
  var num = document.getElementById("button_26").value;
  // Memory number is use in part two of the game to know how many cards to remember.
    memory_number = num;
    close_screen("level_screen");
    open_screen("game_part_one");
    new_game(num);
  });
  document.getElementById("button_52").addEventListener("click", function(){
  var num = document.getElementById("button_52").value;
  // Memory number is use in part two of the game to know how many cards to remember.
    memory_number = num;
    close_screen("level_screen");
    open_screen("game_part_one");
    new_game(num);
  });
  // Or choose hardcore mode (cards > 52)
  document.getElementById("cards_hardcore").addEventListener("click", function(){
    var num = document.getElementById('card_input').value
    // Exculde small numbers and text etc.
    if (num < 52 || num === undefined) {
      num = 52;
    }
    // Exclude huge numer of cards
    else if (num > 1000000) {
      num = 1000000;
      close_screen("level_screen");
      open_screen("game_part_one");
      new_game(num);
    }
  });
};
  // END Level_Screen Logic





// NEW GAME - Part 1: Memorize
document.getElementById("card").addEventListener("click", function(){
  if (startTime == null) {
    start_timer();
  }
  card = get_next_card();
    // Check if last / empty card arrived and the go to game part two
    if (card == "done") {
      start_between_screen();
    }
    else {
      //send next card to html
      var img_path = "./img/cards-svg/standard_deck/"+card+".svg";
      document.getElementById("card").src=img_path;
    }
  });

// END Part 1: Memorize

function start_between_screen() {
  close_screen("game_part_one");
  open_screen("between_screen");
  document.getElementById("card2").addEventListener("click", function(){
    start_game_part_two();
  });
};

// GAME - Part 2: Remember

// Close first game screen and open the second screen for rememring
function start_game_part_two() {
  close_screen("between_screen");
  open_screen("game_part_two");
  remember_new_card();
};


function remember_new_card() {
  // Use SNAP library doc: http://snapsvg.io/docs/
  // load the remember card
  Snap.load("./img/cards-svg/remember.svg" , function(card){
    // the group of suits and ranks has an id in the svg file, defined with INKSCAPE
    //var suits_group = card.select("#all_colors")
    //var ranks_group = card.select("#all_numbers");
    // SelectAll stores the ids of all suit/rank cards from svg file into set (array)
    var suits = card.selectAll("#hearts, #clubs, #spades, #diamonds");
    var ranks = card.selectAll("#two, #three, #four, #five, #six, #seven, #eight, #nine, #ten, #jack, #queen, #king, #ace");
    // check for each suit in set of suits, if it gets clicked
    suits.forEach(function(suit){
        suit.node.onclick = function () {
          // get back the id of the clicked suit
          chosen_suit = suit.node.id;

          // show all suits again
          suits.forEach(function(co){
            co.attr("fill-opacity", "1");
            //co.attr("visibility", "visible");
          });
          // hide selected suit
          suit.attr("fill-opacity", "0.1");
          //suit.attr("visibility", "hidden");
          // Check if rank and card are chosen and if cards are remaining, then emit to get result and continue
          check_chosen_card();
        };
      });
      // check for each rank in set of ranks, if it gets clicked
      ranks.forEach(function(rank){
          rank.node.onclick = function () {
            // get back the id of the clicked rank
            chosen_rank = rank.node.id;

            // show all ranks again
            ranks.forEach(function(nu){
              nu.attr("fill-opacity", "1");
            });
            // hide selected rank
            rank.attr("fill-opacity", "0.1");
            // Check if rank and card are chosen and if cards are remaining, then emit to get result and continue
            check_chosen_card();
          };
        });
    // snaps grabs the svg element from dom and appends the following code to it
    snap = Snap("#memory_card");
    // TODO don't append each time
    snap.append(card);

  });
};


// Check if rank and card are chosen, then emit to get result
function check_chosen_card() {
            console.log("chosen_suit: "+chosen_suit);
            console.log("chosen_rank: "+chosen_rank);
            console.log("memory_number: "+memory_number);
  // Check if suit and rank are chosen..
  if (chosen_suit && chosen_rank) {
    memory_number -= 1;


    var chosen_card = chosen_rank + "_of_" + chosen_suit;
    chosen_suit = null;
    chosen_rank = null;
    // ..and emit the chosen combination to socket.io


    console.log('Chosen Card: ' + chosen_card);
    // Go to next card or end the game
    if (chosen_card == shuffled_deck[0] && memory_number < 1) {
      snap.clear();
      // Got to results after last card
      winner();
    }
    else if (chosen_card == shuffled_deck[0]) {
      next_result = true;
      console.log('Next Result: ' + next_result);
      // Remove this card from deck
      shuffled_deck.shift();
      remember_new_card();
    }
    else {
      next_result = false;
      console.log('Next Result: ' + next_result);
      console.log('Game over!');
      snap.clear();
      looser();
    }
  };

};


// END - Part 2: Remember


// WINNER or LOOSER
function winner() {
  // Stop counting seconds
  stop_timer();
  console.log('Winner!');
  close_screen("game_part_two");
  open_screen("winner");
  document.getElementById("winner_card").addEventListener("click", function(){
    highscore();
  });
};
function looser() {
  stop_timer();
  console.log('Looser!');
  close_screen("game_part_two");
  open_screen("looser");
  document.getElementById("looser_card").addEventListener("click", function(){
    highscore();
  });
};
// END WINNER or LOOSER


// Highscore

function highscore () {
  close_screen("looser");
  close_screen("winner");
  open_screen("highscore");
};

document.getElementById("newgame").addEventListener("click", function(){
  close_screen("highscore");
  window.location.reload(true);
  });



function scoreboard() {
  var name = 'Jeremias';
  var score = '1000';
  var i = 1;
  var userids = "user1;user2;";
  var num = userids.split(";").length;
  document.getElementById("#scoreboard_tbody").append("<tr> <td>" + i + "</td><td><img class='avatar' src=''/>"+name+"</td><td>" + score + "</td></tr>");
};







// Helper functions

function start_timer() {
  startTime = performance.now();
};

function stop_timer() {
  endTime = performance.now();
  var timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds
  var seconds = Math.round(timeDiff);
  console.log(seconds + " seconds");
}


// END MEMORY POKER //
















// START SERVING part


var cards = ["queen_of_spades", "queen_of_hearts", "queen_of_diamonds", "queen_of_clubs", "king_of_spades", "king_of_hearts", "king_of_diamonds", "king_of_clubs", "jack_of_spades", "jack_of_hearts", "jack_of_diamonds", "jack_of_clubs", "ace_of_spades", "ace_of_hearts", "ace_of_diamonds", "ace_of_clubs", "ten_of_spades", "ten_of_hearts", "ten_of_diamonds", "ten_of_clubs", "nine_of_spades", "nine_of_hearts", "nine_of_diamonds", "nine_of_clubs", "eight_of_spades", "eight_of_hearts", "eight_of_diamonds", "eight_of_clubs", "seven_of_spades", "seven_of_hearts", "seven_of_diamonds", "seven_of_clubs", "six_of_spades", "six_of_hearts", "six_of_diamonds", "six_of_clubs", "five_of_spades", "five_of_hearts", "five_of_diamonds", "five_of_clubs", "four_of_spades", "four_of_hearts", "four_of_diamonds", "four_of_clubs", "three_of_spades", "three_of_hearts", "three_of_diamonds", "three_of_clubs", "two_of_spades", "two_of_hearts", "two_of_diamonds", "two_of_clubs"];







  // NEW GAME - Part 1: Memorize
  //Check for incoming user connection and if a new game on LEVEL SCREEN was startet by picking a number of cards to play with
function new_game(deck_size) {
    console.log('new game - number of cards: ' + deck_size);

    // Use shuffle algorithm and slice of the last cards if user chose to play with less than 52
    if (deck_size <= 52) {
      shuffled_deck = shuffleArray(cards);
      shuffled_deck = shuffled_deck.slice(0, deck_size);
    }
    // Or shuffle and then use more than 1 deck
    else {
      // Round up num of decks
      var decks_num = Math.ceil(deck_size / 52);
      let multi_shuffled_decks = [];
      for(var i=0; i < decks_num; i++){
        shuffled_deck = shuffleArray(cards);
        // Add decks to each other after shuffling each, to form more decks in a row
        multi_shuffled_decks = multi_shuffled_decks.concat(shuffled_deck);
      }
      shuffled_deck = multi_shuffled_decks;
      // Shorten the multi deck and keep the num of cards needed
      shuffled_deck = shuffled_deck.slice(0, deck_size);
      console.log('Up rounded number of Decks: '+decks_num+' for '+deck_size+ ' cards.')
    }
    console.log("Shuffled deck: "+shuffled_deck);
    // Create a final deck to remove cards from. The shuffled deck stays as original for later comparison
    // The contact only makes the final_deck var independent from shuffled_deck (newb-style)
    final_deck = shuffled_deck.concat();
  };

  // Get new card request from user
  function get_next_card(){
    // Check if last card is played
    if (final_deck === undefined || final_deck.length == 0) {
      next_card = "done";
    }
    // Draw the next card from the deck and send it
    else {
      // Get next card in deck
      next_card = final_deck[0];
      // Remove this card from deck

      final_deck.shift();
    }
    console.log('Next Card: ' + next_card)
    return next_card;

  };

  // END Part 1: Memorize
  // GAME - Part 2: Remember
    // Compare memorized and remembered card
function get_next_result() {
  if (chosen_card == shuffled_deck[0]) {
    result = true;
    // Remove this card from deck
    shuffled_deck.shift();
  }
  else {
    result = false;
  }
  console.log('Next Result: ' + result)
  return result;
};


  // END - Part 2: Remember












// Start Server and helper functions



/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}
