// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require bootstrap-sprockets
//= require jquery_ujs
//= require turbolinks
//= require_tree .
function Raffler(selector) {
  $elm = $(selector);
  this.entries = [];
  $this = this;

  this.runRaffle = function() {
    console.log("Running raffle!");
    $this.determineEntries();
    console.log("Determined entries!");
    console.log($this.entries);
    $(".entries").fadeOut("slow", function() {
      $this.perform(this.entries)
    });
  }

  this.perform = function() {
    var container = $(".results .jumbotron .container");
    var startEntry = ""
    var endEntry = "</div>"
    var remainingEntries = []
    $this.entries.forEach(function(elm, i) {
      var entry = $("<div class='raffle-entry' id='entry_" + i + "'>" + elm + "</div>");
      container.append(entry);
    });
    $(".raffle-entry").each(function(i,elm) {
      remainingEntries.push(elm);
    });

    $(".results").fadeIn("slow");

    // Display the 3-2-1-Begin! messages
    $("body").append("<div class='countdown'><h1>3</h1></div>");
    var countdown = $(".countdown h1");
    window.setTimeout(function() {
      countdown.text("2");
      window.setTimeout(function() {
        countdown.text("1");
        window.setTimeout(function() {
          $(".countdown").remove();
          $this.pluck(remainingEntries);
        }, 1000);
      }, 1000);
    }, 1000);
  }

  this.pluck = function(elmArr) {
      window.setTimeout(function() {
        var removalIndex = Math.floor(Math.random() * elmArr.length); // Random Index position in the array
        var removed = elmArr.splice(removalIndex, 1); // Splice out a random element using the ri var
        removed.forEach(function(rem) {
          $(rem).fadeOut("slow", function() {
            if(elmArr.length <= 3) {
              $this.winners(elmArr);
            } else {
              $this.pluck(elmArr);
            }
          });
        });
      }, 1000);
  }

  this.winners = function(elmArr) {
    $("body").append("<div class='winner-mask' style='display: none;'><div class='winners'></div></div>")
    elmArr.forEach(function(elm) {
      $(".winners").append($("<div class='winner'>" + $(elm).text() + "</div>"));
    });
    $(".winners").append("<a href='javascript:void(0);' class='btn btn-primary pull-right close-winners'>Ok</a>");
    $(".winner-mask").fadeIn("slow");
    $(".winners .close-winners").click(function() {
      $(".winner-mask").fadeOut("slow");
      $(".winner-mask").remove();
    });
  }

  this.determineEntries = function() {
    $this.entries = $elm.val().split("\n").filter(function(txt) { return txt.trim().length != 0; });
  }

  this.reset = function() {
    $this.entries = []
    $elm.val("Entries (one per line)");
    backToEntries();
  }

  this.backToEntries = function() {
    $(".results").fadeOut("slow",function() {
      $(".entries").fadeIn("slow", function() {
        // WOOOO
      });
    });
  }

}

$(document).ready(function() {
  var raffler = new Raffler("textarea[name='raffle_inputs']");
  $(".lets-go").click(function() {
    raffler.runRaffle();
  });
  $(".back-to-entries").click(function() {
    raffler.backToEntries();
  });
  $(".new-raffle").click(function() {
    raffler.reset();
  });
});
