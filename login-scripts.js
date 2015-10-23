var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

	$('#loginbutton').click(function() {
		var username = $('#inputUsername').val();
		var password = $('#inputPassword').val();

		Parse.User.logIn(username, password, {
			success: function(user) {
				$('<p>').text("Login successful.").appendTo('form');
				$('#inputUsername').val('');
				$('#inputPassword').val('');

				if (Parse.User.current().get("emailVerified") == true)
					{
						
					window.location = "landing-page.html";
					}
				else
				{
					window.alert("verify email");
				}
			},
			error: function(user, error) {
				alert("Error: " + error.code + " " + error.message);
			}
		});

		return false;
	});


}

$(document).ready(main);









