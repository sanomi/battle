var choosePlayer = new Firebase('https://qnbattleship.firebaseio.com/choosePlayer');
$(document).ready(function() {
	$('#a').click(function(){
		window.open('./player1/player1.html');
	})
	$('#d').click(function(){
		window.open('./player2/player2.html');
	})
})