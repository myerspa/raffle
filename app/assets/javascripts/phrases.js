var Phrases = (function() {

  var _phrases = [
    "The tribe has spoken.",
    "You've been evicted from the Big Brother house.",
    "You are the weakest link. Goodbye!",
    "Your time's up.",
    "Your tour ends here.",
    "You've been chopped.",
    "You must leave the chateau!",
    "Your banner must fall.",
    "Now, sashay away.",
    "You lose.",
    "Not today.",
    "You have fired your last shot.",
    "Please turn in your apron.",
    "You will not be the next Iron Chef.",
    "Today is not your day.",
    "No dice.",
    "Nice try.",
    "Not for you.",
    "No soup for you.",
    "Hit the road Jack.",
    "For you, it's game over.",
    "Your check is voided; it's time for you to bounce.",
    "And that means you're out. Auf Wiedersehen.",
    "This was your final cut.",
    "In that test, you were no sweet genius.",
    "You're the low man on the totem pole, any last words?",
    "You are not America's next top model.",
    "You are not Canada's Worst Driver.",
    "You did not get a rose...",
    "The fat lady has sung.",
    "You blew it!",
    "You have no power here...",
    "Make like a tree and leaf",
    "Your watch has ended.",
    "You get nothing! You Lose! Good day sir!"
  ];

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return (function(arr) {
      return function() {
        if(arr.length === 0)
          return -1;
        else
          return arr.shift();
      };
    })(array);
  }

  var randomGen = shuffle(_phrases.slice());
  function randomPhrase() {
    var result = randomGen();
    if(result == -1) {
      randomGen = shuffle(_phrases.slice());
      result = randomGen();
    }
    return result;
  }

  return {
    randomPhrase: randomPhrase
  }

})();
