var Phrases = (function() {

  var _phrases = [
    "The tribe has spoken.",
    "You've been evicted from the Big Brother house.",
    "Your are the weaskest link. Goodbye!",
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
    "No dice."
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
    return _phrases[entry];
  }

  return {
    randomPhrase: randomPhrase
  }

})();
