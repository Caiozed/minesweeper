var mineSweeper = {
  directions: {
    north: [-1, 0],
    south: [1, 0],
    west: [0, -1],
    east: [0, 1],
    nw: [-1, -1],
    ne: [-1, 1],
    sw: [1, -1],
    se: [1, 1],
  },
  gridRes: 9,
  time: 0,
  mines: 10,
  blocks: [],
  interval: 0,
  board: $("#board"),

  setupBoard: function() {
    this.board.html("");
    this.flags = this.mine;
    this.time = 0;
    for (var i = 0; i < this.gridRes; i++) {
      for (var j = 0; j < this.gridRes; j++) {
        this.board.append(`<div data-y='${i}' data-x='${j}'></div>`);
        var block = $(`[data-y='${i}'][data-x='${j}']`);
        block.addClass("block");
        var border = parseInt(block.css("border-left-width")) * 2;
        block.width((this.board.width() / this.gridRes) - border);
        block.height((this.board.height() / this.gridRes) - border);
      }
    }
    clearInterval(this.interval);
    $("#timer").text(this.time);
    this.addMines();
    this.timer();
    this.defineClicks();
  },

  defineClicks: function() {
    var that = this;
    $(".restart").on("click", function() {
      that.setupBoard();
    });

    $(".block").on("click", function() {
      that.checkSurroundings($(this));
    });

    $(".block").on("contextmenu", function(event) {
      event.preventDefault();
      if (event.which === 3 && $(".flag").length < that.mines) {
        $(this).toggleClass("flag");
      } else if (event.which === 3) {
        $(this).removeClass("flag");
      }
      that.checkWin();
    });
  },

  checkWin: function() {
    if ($(".flag.mine").length === this.mines) {
      $("body").append("<h1 class='win'>You Win<h1>");
      $(".block").off("contextmenu");
      clearInterval(this.interval);
    }
  },

  checkSurroundings: function(square) {
    var minesNear = 0;
    var blocks = [];
    var square = square;
    if (Array.isArray(square)) {
      square = square[0];
    }

    if (square) {
      if (!square.hasClass("mine")) {
        $.each(this.directions, function(index, direction) {
          var y = direction[0] + parseInt(square.data("y"));
          var x = direction[1] + parseInt(square.data("x"));
          var block = $(`[data-y='${y}'][data-x='${x}']`);
          if (block.length !== 0) {
            blocks.push($(`[data-y='${y}'][data-x='${x}']`));
          }
          square.removeAttr("data-x").removeAttr("data-y");
          if (block.hasClass("mine")) {
            minesNear++;
            square.text(minesNear);
          }
        });
        if (minesNear === 0) {
          this.checkSurroundings($.each(blocks, function(index, block) {
            return block;
          }));
          square.off("click");
          square.addClass("clear-block");
        }
      } else {
        this.endGame();
      }
    }
  },


  addMines: function() {
    for (var i = 0; i < this.mines; i++) {
      var x = Math.floor(Math.random() * (this.gridRes - 1));
      var y = Math.floor(Math.random() * (this.gridRes - 1));
      $(`[data-y='${y}'][data-x='${x}']`).addClass("mine").addClass("mine-hidden");
    }
  },

  endGame: function() {
    $(".mine").removeClass("mine-hidden");
    $(".block").off("click");
    $(".block").off("contextmenu");
    clearInterval(this.interval);
  },

  timer: function() {
    var that = this;
    this.interval = setInterval(function() {
      that.time++;
      $("#timer").text(that.time);
    }, 1000);
  }
}

$(document).ready(function() {
    mineSweeper.board = $("#board");
    mineSweeper.setupBoard();
});
