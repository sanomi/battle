var choosePlayer = new Firebase('https://qnbattleship.firebaseio.com/choosePlayer');
$(document).ready(function() {
	$('#a').click(function(){
		window.location.replace('./player1/player1.html');
	})
	$('#d').click(function(){
		window.location.replace('./player2/player2.html');
	})
})