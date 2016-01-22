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
//= require jquery.animate-colors-min
//= require bootstrap-sprockets
//= require jquery_ujs
//= require turbolinks
//= require_tree .
function Raffler(selector) {
  $elm = $(selector);
  this.entries = [];
  this.timeout = 1000;
  this.num_winners = 1;
  this.fireworks = new Fireworks();
  var $this = this;

  this.runRaffle = function() {
    console.log("Running raffle!");
    $this.determineEntries();

    var timeout = parseInt($("#removal_time").val());
    if(isNaN(timeout) || timeout <= 0 || timeout >= 10000) {
      $this.timeout = 1000;
    } else {
      $this.timeout = timeout;
    }

    var num_winners = parseInt($("#num_winners").val());
    if(isNaN(num_winners) || num_winners <= 0 || num_winners > 10) {
      $this.num_winners = 1;
    } else {
      $this.num_winners = num_winners;
    }

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
          $(rem).animate({ backgroundColor: "rgba(51, 122, 183, 1)", color: "#FFFFFF" },250, function() {
            $(rem).fadeOut("slow", function() {
              if(elmArr.length <= $this.num_winners) {
                $this.winners(elmArr);
              } else {
                $this.pluck(elmArr);
              }
            });
          });
        });
      }, $this.timeout);
  }

  this.winners = function(elmArr) {
    $("body").append("<div class='winner-mask' style='display: none;'><div class='winners'></div></div>")
    elmArr.forEach(function(elm) {
      $(".winners").append($("<div class='winner'>" + $(elm).text() + "</div>"));
    });
    $(".winners").append("<a href='javascript:void(0);' class='btn btn-primary pull-right close-winners'>Ok</a>");
    $(".winner-mask").fadeIn("slow");
    $(".winners").css({top: (window.innerHeight / 2) - ($(".winners").height() / 2)+"px"});
    $this.fireworks.begin();
    $(".winners .close-winners").click(function() {
      $(".winner-mask").fadeOut("slow");
      $(".winner-mask").remove();
      $this.fireworks.stop();
    });
    $(".winner-mask").click(function(e) {
      e.preventDefault();
      $this.fireworks.launch();
    });
  }

  this.determineEntries = function() {
    $this.entries = $elm.val().split("\n").filter(function(txt) { return txt.trim().length != 0; });
  }

  this.reset = function() {
    $this.entries = []
    $elm.val("");
    $this.backToEntries();
  }

  this.backToEntries = function() {
    $(".results").fadeOut("slow",function() {
      $(".raffle-entry").remove();
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


function Fireworks() {
  var $this = this;
  this.SCREEN_WIDTH = window.innerWidth;
  this.SCREEN_HEIGHT = window.innerHeight;

  // create canvas
  this.canvas = window.document.createElement('canvas');
  this.context = $this.canvas.getContext('2d');
  this.particles = [];
  this.rockets = [];
  this.MAX_PARTICLES = 1000;
  this.colorCode = 0;
  this.launchInterval = 0;
  this.loopInterval = 0;
  this.mousePos = {
    x: 400,
    y: 300
  }

  $(document).mousemove(function(e) {
    e.preventDefault();
    $this.mousePos = {
        x: e.clientX,
        y: e.clientY
    };
  });

  this.begin = function() {
    $this.isRunning = true;
    window.document.body.appendChild($this.canvas);
    $this.canvas.width = $this.SCREEN_WIDTH;
    $this.canvas.height = $this.SCREEN_HEIGHT;
    $this.launchInterval = setInterval($this.launch, 500);
    $this.loopInterval = setInterval($this.loop, 1000 / 50);
  }

  this.stop = function() {
    clearInterval($this.launchInterval);
    clearInterval($this.loopInterval);
    window.document.body.removeChild($this.canvas)
  }

  this.launch = function() {
    $this.launchFrom(Math.floor(Math.random() * $this.SCREEN_WIDTH));
  }

  this.launchFrom = function(x) {
    if ($this.rockets.length < 20) {
      var rocket = new Rocket(x);
      rocket.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;
      rocket.vel.y = Math.random() * -3 - 4;
      rocket.vel.x = Math.random() * 6 - 3;
      rocket.size = 8;
      rocket.shrink = 0.999;
      rocket.gravity = 0.02;
      $this.rockets.push(rocket);
    }
  }

  this.loop = function() {
      // update screen size
      if ($this.SCREEN_WIDTH != window.innerWidth) {
          $this.canvas.width = $this.SCREEN_WIDTH = window.innerWidth;
      }
      if ($this.SCREEN_HEIGHT != window.innerHeight) {
          $this.canvas.height = $this.SCREEN_HEIGHT = window.innerHeight;
      }

      // clear canvas
      $this.context.fillStyle = "rgba(0, 0, 0, 1)";
      $this.context.fillRect(0, 0, $this.SCREEN_WIDTH, $this.SCREEN_HEIGHT);

      var existingRockets = [];

      for (var i = 0; i < $this.rockets.length; i++) {
          // update and render
          $this.rockets[i].update();
          $this.rockets[i].render($this.context);

          // distance between mouse and rocket
          var distance = Math.sqrt(Math.pow($this.mousePos.x - $this.rockets[i].pos.x, 2) + Math.pow($this.mousePos.y - $this.rockets[i].pos.y, 2));
          // 1% chance of explosion if more than half way up
          var randomChance = $this.rockets[i].pos.y < ($this.SCREEN_HEIGHT * 2 / 3) ? (Math.random() * 100 <= 1) : false;

          // explode if rocket is in top 5th of screen, the random chance hit, it's close to the mouse, ran out of steam and is moving down now
          if ($this.rockets[i].pos.y < $this.SCREEN_HEIGHT / 5 || $this.rockets[i].vel.y >= 0 || distance < 50 || randomChance) {
              $this.rockets[i].explode();
          } else {
              existingRockets.push($this.rockets[i]);
          }
      }

      $this.rockets = existingRockets;

      var existingParticles = [];

      for (var i = 0; i < $this.particles.length; i++) {
          $this.particles[i].update();

          // render and save particles that can be rendered
          if ($this.particles[i].exists()) {
              $this.particles[i].render($this.context);
              existingParticles.push($this.particles[i]);
          }
      }

      $this.particles = existingParticles;

      // Keep the # of particles down to help with performance, lolz at setting max particles to 10k
      while ($this.particles.length > $this.MAX_PARTICLES) {
          $this.particles.shift();
      }
  }

  function Particle(pos) {
      this.pos = {
          x: pos ? pos.x : 0,
          y: pos ? pos.y : 0
      };
      this.vel = {
          x: 0,
          y: 0
      };
      this.shrink = .97;
      this.size = 2;

      this.resistance = 1;
      this.gravity = 0.05;

      this.flick = false;

      this.alpha = 1;
      this.fade = 0;
      this.color = 0;
  }

  Particle.prototype.update = function() {
      // apply resistance
      this.vel.x *= this.resistance;
      this.vel.y *= this.resistance;

      // gravity down
      this.vel.y += this.gravity;

      // update position based on speed
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;

      // shrink
      this.size *= this.shrink;

      // fade out
      this.alpha -= this.fade;
  };

  Particle.prototype.render = function(c) {
      if (!this.exists()) {
          return;
      }

      c.save();

      c.globalCompositeOperation = 'lighter';

      var x = this.pos.x,
          y = this.pos.y,
          r = this.size / 2;

      var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
      gradient.addColorStop(0.1, "rgba(255,255,255," + this.alpha + ")");
      gradient.addColorStop(0.8, "hsla(" + this.color + ", 100%, 50%, " + this.alpha + ")");
      gradient.addColorStop(1, "hsla(" + this.color + ", 100%, 50%, 0.1)");

      c.fillStyle = gradient;

      c.beginPath();
      c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true);
      c.closePath();
      c.fill();

      c.restore();
  };

  Particle.prototype.exists = function() {
      return this.alpha >= 0.1 && this.size >= 1;
  };

  function Rocket(x) {
      Particle.apply(this, [{
          x: x,
          y: $this.SCREEN_HEIGHT}]);

      this.explosionColor = 0;
  }

  Rocket.prototype = new Particle();
  Rocket.prototype.constructor = Rocket;

  Rocket.prototype.explode = function() {
      var count = Math.random() * 100 + 100;

      for (var i = 0; i < count; i++) {
          var particle = new Particle(this.pos);
          var angle = Math.random() * Math.PI * 2;

          // emulate 3D effect by using cosine and put more particles in the middle
          var speed = Math.cos(Math.random() * Math.PI / 2) * 15;

          particle.vel.x = Math.cos(angle) * speed;
          particle.vel.y = Math.sin(angle) * speed;

          particle.size = 10;

          particle.gravity = 0.1;
          particle.resistance = 0.92;
          particle.shrink = Math.random() * 0.05 + 0.93;

          particle.flick = true;
          particle.color = this.explosionColor;

          $this.particles.push(particle);
      }
  };

  Rocket.prototype.render = function(c) {
      if (!this.exists()) {
          return;
      }

      c.save();

      c.globalCompositeOperation = 'lighter';

      var x = this.pos.x,
          y = this.pos.y,
          r = this.size / 2;

      var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
      gradient.addColorStop(0.1, "rgba(255, 255, 255 ," + this.alpha + ")");
      gradient.addColorStop(1, "rgba(0, 0, 0, " + this.alpha + ")");

      c.fillStyle = gradient;

      c.beginPath();
      c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size / 2 + this.size / 2 : this.size, 0, Math.PI * 2, true);
      c.closePath();
      c.fill();

      c.restore();
  };

}
