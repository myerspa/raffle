var Phrases = (function() {

  var _phrases = [
    "The tribe has spoken.",
    "You've been evicted from the Big Brother house.",
    "You are the weaskest link. Goodbye!",
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
    "Make like a tree and leaf"
  ]

  var lastResult = -1;
  function randomPhrase() {
    var min = 0;
    var max = _phrases.length;
    min = Math.ceil(min);
    max = Math.floor(max);
    var entry = lastResult;
    while(entry == lastResult) {
      entry = Math.floor(Math.random() * (max - min)) + min;
    }
    lastResult = entry;
    return _phrases[entry];
  }

  return {
    randomPhrase: randomPhrase
  }

})();
