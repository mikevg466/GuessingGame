
function generateWinningNumber(){
  return Math.floor(Math.random() * 100) + 1;
}

function shuffle(array){
  var len = array.length, rand, temp;
  while(len){
    rand = Math.floor(Math.random() * len--);
    temp = array[rand];
    array[rand] = array[len];
    array[len] = temp;
  }
  return array;
}

function Game(){
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}
Game.prototype.difference = function(){return Math.abs(this.playersGuess - this.winningNumber);};
Game.prototype.isLower = function(){return this.playersGuess < this.winningNumber;};
Game.prototype.checkGuess = function(){
  if(this.playersGuess === this.winningNumber)
    return "You Win!";
  else if(this.pastGuesses.includes(this.playersGuess))
    return "You have already guessed that number.";
  else{
    this.pastGuesses.push(this.playersGuess);
    let diff = this.difference();
    if(this.pastGuesses.length >= 5)
      return "You Lose.";
    else if(diff < 10)
      return "You\'re burning up!";
    else if(diff < 25)
      return "You\'re lukewarm.";
    else if(diff < 50)
      return "You\'re a bit chilly.";
    else
      return "You\'re ice cold!"
  }
};
Game.prototype.playersGuessSubmission = function(num){
  if(!(typeof num === "number") || num <= 0 || num > 100) throw "That is an invalid guess.";
  this.playersGuess = num;
  return this.checkGuess();
};

Game.prototype.provideHint = function(){
  return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
}

function newGame(){
  return new Game();
}


// JQuery Start
$(document).ready(function(){

  var game = newGame();

  function setGuesses(){
    var curList = $("#guesses").find("ul").children("li").first();
    for(var i = 0; i < game.pastGuesses.length; i++){
      curList.text(game.pastGuesses[i]);
      if(i === game.pastGuesses.length - 1){
        let diff = game.difference();
        if(diff < 10){
          curList.addClass("burning");
        } else if(diff < 25){
          curList.addClass("lukewarm");
        } else if(diff < 50){
          curList.addClass("chilly");
        } else{
          curList.addClass("ice");
        }
      }
      curList = curList.next();
    }
  }

  function resetGuesses(){
    var guessList = $("#guesses").find("ul").children("li");
    guessList.text("-");
    guessList.removeClass("burning");
    guessList.removeClass("lukewarm");
    guessList.removeClass("chilly");
    guessList.removeClass("ice");
  }

  function submitAnswer(){
    var ansBlock = $("#answer");
    var guess = +$("#player-input").val();
    var ans = game.playersGuessSubmission(guess);
    ansBlock.text(ans);
    ansBlock.slideDown();
    setGuesses();
  }

  $("#submit").on("click", function(event){
    event.preventDefault();
    if(game.pastGuesses.length < 5){
      submitAnswer();
    }
  });

  $("#reset").on("click", function(event){
    event.preventDefault();
    game = newGame();
    resetGuesses();
    $("#answer").slideUp('fast');
    $("#hints").slideUp('fast');
    $("#player-input").val("");
  });

  $("#hint").on("click", function(event){
    event.preventDefault();
    var hints = game.provideHint();
    var hintDiv = $("#hints");
    var curList = hintDiv.find("ul").children("li").first();
    for(var i = 0; i < hints.length; i++){
      curList.text(hints[i]);
      curList = curList.next();
    }
    hintDiv.slideDown();
  });

});
