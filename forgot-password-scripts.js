var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

	$('#forgotpasswordbutton').click(function() {
		var email = $('#inputEmailAddress').val();
		Parse.User.requestPasswordReset(email, {
			success:function() {
				//alert("Reset instructions emailed to you.");
				//window.location = "index.html";
			},
			error:function(error) {
				//alert(error.message);
			}
		});
		
		alert("Check your email for reset instructions");
		window.location = "index.html";
		return false;
	});
	
	


}

$(document).ready(main);









