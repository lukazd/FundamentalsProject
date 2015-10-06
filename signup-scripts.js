var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");


	$('#signupbutton').click(function() {
		var username = $('#inputUsername').val();
		var firstName = $('#inputFirstName').val();
		var lastName = $('#inputLastName').val();
		var email = $('#inputEmail').val();
		var password = $('#inputPassword').val();
		var confirmPassword = $('#confirmPassword').val();
		var role = $('#selectRole').val();

		if(password == confirmPassword) {
			var user = new Parse.User();
			user.set("username", username);
			user.set("firstName", firstName);
			user.set("lastName", lastName);
			user.set("email", email);
			user.set("password", password);
			if(role == "Team Member") {
				user.set("isTeamMember", "true");
				user.set("isTeamLeader", "false");
				user.set("isTeamAdmin", "false");
			}
			else if(role == "Team Leader") {
				user.set("isTeamMember", "false");
				user.set("isTeamLeader", "true");
				user.set("isTeamAdmin", "false");
			}
			else if(role == "Team Admin") {
				user.set("isTeamMember", "false");
				user.set("isTeamLeader", "false");
				user.set("isTeamAdmin", "true");
			}

			user.signUp(null, {
				success: function(user) {
					$('<p>').text("Congratulations! Your account has been made.").appendTo('form');
					$('#inputUsername').val('');
					$('#inputFirstName').val('');
					$('#inputLastName').val('');
					$('#inputEmail').val('');
					$('#inputPassword').val('');
					$('#confirmPassword').val('');

					window.location = "landing-page.html";
				},
				error: function(user, error) {
					alert("Error: " + error.code + " " + error.message);
				}
			});
		}
		else {
			alert("Passwords do not match!");
		}

		// Make sure the method returns false so that the page is not reloaded
		// This would interrupt the asynchronous signUp call.
		return false;
	});
}

$(document).ready(main);









