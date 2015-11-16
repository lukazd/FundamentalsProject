var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

	$('#forgotpasswordbutton').click(function() {
		var email = $('#inputEmailAddress').val();
		Parse.User.requestPasswordReset(email, {
			success:function() {
				alert("Reset instructions emailed to you.");
			},
			error:function(error) {
				alert(error.message);
			}
		});
	});
	


}

$(document).ready(main);









