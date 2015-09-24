'use strict';
var ref1 = new Firebase('https://qnbattleship.firebaseio.com/player1');
var ref2 = new Firebase('https://qnbattleship.firebaseio.com/player2');
var ref1G = new Firebase('https://qnbattleship.firebaseio.com/player1Guess');
var ref2G = new Firebase('https://qnbattleship.firebaseio.com/player2Guess');
var player1Choices = [], p1GArray= [];
var maxShip = 0;
var myTurn = false;
var player2Ships =[];
$(document).ready(init);
function init() {
  $(window).unload(function(){
    ref2.remove();
  })
  ref2.set('ready');
  ref1G.remove();
  ref2G.remove();
  ref1.on('value', function(snap) {
    var state = snap.val();
    if (state === 'ready') {
      $('h4').text('Waiting for players to finish choosing ships....')
    }
  })
  ref1G.on('child_added', function(guessCoOrd) {
    $('h4').text("Your turn.");
    myTurn = true;
  })
  $('#placeBoats td').on('click', selectShips);
  ref2.on('child_added', player2CoOrdSend);
  // player1CoOrd();
}

function player2CoOrdSend(snapshot) {
    var message = snapshot.val();
  };

function player1CoOrd(maxShip) {
  ref1.on('child_added', function(snapshot) {
    var message = snapshot.val();
    player1Choices.push(message.co);
    if (player1Choices.length === 15 && maxShip===15){
      $('h4').text('Waiting for opponent to guess.')
     checkP1Match(player1Choices);
    }
});
};

function selectShips(){
  var $this = $(this);
  if (maxShip === 15) {
    alert("Out of Ships");
    $(this).off(); 
    player1CoOrd(maxShip);
    return;
  }
  if ($this.text() === "" && $this.attr('class') !== 'ship') {
    var co = $(this).attr('class') + $(this).parent().attr('class');
    var LS = $this.attr('class');
    var NS = $this.parent().attr('class');
    var co = LS + NS;
    $this.addClass('ship');
    ref2.push( {co: co });
    player2Ships.push(co);
    maxShip++;
    $(this).off(); 
  }
};

function checkP1Match(player1Choices) {
  var opHits =[];
    $('#guesses td').click( function() {
      if (!myTurn) {return;}
       $('h4').text('Waiting for opponent to guess.')
      var guessCoOrd = $(this).attr('class') + $(this).parent().attr('class');
      if ( player1Choices.indexOf(guessCoOrd) !== -1 ) {
        $(this).addClass('hit');
        opHits.push(guessCoOrd);
      } else {
        $(this).css('background-color', 'transparent');
      }
      $(this).off();
      if (opHits.length ===15) {
        alert('You won!');
          ref2.remove();
          ref1G.remove();
          ref2G.remove();
      }
      myTurn = false;
      ref2G.push( {p2: guessCoOrd} );
    })
      explosions();
}

function explosions() {
    var hits = [];
  ref1G.on('child_added', function(snapshot) {
    var gData1 = snapshot.val();    
    if(player2Ships.indexOf(gData1.p1) != -1) {
      hits.push(gData1.p1);
      var L = (gData1.p1).slice(0,1);
      var N = (gData1.p1).slice(1, (gData1.length));
      $("#placeBoats ."+N+" ."+L).addClass('hit').removeClass('ship');
    } else {
        $("#placeBoats ."+N+" ."+L).css('background-color', 'transparent');
      }
    if(hits.length === 15) {
      alert('you lost');
        ref2.remove();
        ref1G.remove();
        ref2G.remove();
      $('td').off();
    }
  })
}
