'use strict';
var ref1 = new Firebase('https://qnbattleship.firebaseio.com/player1');
var ref2 = new Firebase('https://qnbattleship.firebaseio.com/player2');
var ref1G = new Firebase('https://qnbattleship.firebaseio.com/player1Guess');
var ref2G = new Firebase('https://qnbattleship.firebaseio.com/player2Guess');
var player2Choices = [], p2GArray= [];
var player1Ships = []; 
var maxShip = 0;
var myTurn = true;
$(document).ready(init);
function init() {
  $(window).unload(function(){
    ref1.remove();
  })
	ref1.set('ready');
  ref1G.remove();
  ref2G.remove();
  ref2.on('value', function(snap) {
    var state = snap.val();
    if (state === 'ready') {
      $('h4').text('Waiting for players to finish choosing ships....')
    }
  })
  ref2G.on('child_added', function(guessCoOrd) {
    $('h4').text("Your turn.");
    myTurn = true;
  })
  $('#placeBoats td').on('click', selectShips);
  ref1.on('child_added', player1CoOrdSend);
  // player2CoOrd();
}

function player1CoOrdSend(snapshot) {
  var message = snapshot.val();
}

function player2CoOrd(maxShip) {
  ref2.on('child_added', function(snapshot) {
    var message = snapshot.val();
    player2Choices.push(message.co);
    if ( player2Choices.length === 15 && maxShip===15) {
      $('h4').text('Your turn')
    checkP2Match(player2Choices);
    }
  });
  return player2Choices;
};

function selectShips(){
  var $this = $(this);
  if (maxShip === 15) {
  alert("Out of Ships");
  $(this).off(); 
  player2CoOrd(maxShip);
  return;
  }
  if ($this.text() === "" && $this.attr('class') !== 'ship') {
    var LS = $this.attr('class');
    var NS = $this.parent().attr('class');
    var co = LS + NS;
    $this.addClass('ship');
    ref1.push( {co: co }); 
    player1Ships.push(co);
    $(this).off()
    maxShip++;
  }
}

function checkP2Match(player2Choices) {
  var opHits =[];
    $('#guesses td').click( function() {
      if (!myTurn) {return;}
       $('h4').text('Waiting for Player 2 to guess.')
      var guessCoOrd = $(this).attr('class') + $(this).parent().attr('class');
      if (player2Choices.indexOf(guessCoOrd) !== -1 ) {
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
      ref1G.push( {p1: guessCoOrd} );
    })
      explosions();
}

function explosions() {
    var hits = [];
  ref2G.on('child_added', function(snapshot) {
    var gData2 = snapshot.val();
      var L = (gData2.p2).slice(0,1);
      var N = (gData2.p2).slice(1, (gData2.length));
      $("#placeBoats ."+N+" ."+L).addClass('hit').removeClass('ship');
    if(player1Ships.indexOf(gData2.p2) != -1) {
      hits.push(gData2.p2);
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
    // var shipArr = [$this]

    // if(NS !== 1 && NS !== 10) {
    // $("#placeBoats ." + (parseInt(NS)+1) + " ." + LS).addClass('ship');
    // $("#placeBoats ." + (parseInt(NS)-1) + " ." + LS).addClass('ship');
    // }
    // if(NS === '1') {
    // $("#placeBoats ." + (parseInt(NS)+1) + " ." + LS).addClass('ship');
    // $("#placeBoats ." + (parseInt(NS)+2) + " ." + LS).addClass('ship');
    // }
    // if(NS === '10') {
    // $("#placeBoats ." + (parseInt(NS)-2) + " ." + LS).addClass('ship');
    // $("#placeBoats ." + (parseInt(NS)-1) + " ." + LS).addClass('ship');
    // }