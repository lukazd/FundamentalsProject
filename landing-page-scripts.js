var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

	var firstName = Parse.User.current().get("firstName");
	var lastName = Parse.User.current().get("lastName");

	$('#name').text(firstName + " " + lastName);
}

$(document).ready(main);