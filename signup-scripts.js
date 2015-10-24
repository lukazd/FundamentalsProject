var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

	$('#roleCode').val(0);
	var teamLeaderKey = -1;
	var teamAdminKey = -1;

	var TeamRole = Parse.Object.extend("TeamRole");
	var query = new Parse.Query(TeamRole);
	query.get("Igi7aq1VeK", {
		success: function(teamRole){
			teamLeaderKey = teamRole.get("Key");
		},
		error: function(object, error){
			alert("Error: " + error.code + " " + error.message);
		}
	});

	query.get("9KnfvWHztN", {
		success: function(teamRole){
			teamAdminKey = teamRole.get("Key");;
		},
		error: function(object, error){
			alert("Error: " + error.code + " " + error.message);
		}
	});

	$('#signupbutton').click(function() {
		var currentUser = Parse.User.current();
		if(currentUser){
			Parse.User.logOut();
		}

		var username = $('#inputUsername').val();
		var firstName = $('#inputFirstName').val();
		var lastName = $('#inputLastName').val();
		var email = $('#inputEmail').val();
		var password = $('#inputPassword').val();
		var confirmPassword = $('#confirmPassword').val();
		var role = $('#selectRole').val();
		var roleCode = $('#roleCode').val();
		var gender = $('#selectGender').val();
		var dob = $('#dob').val();
		var teamName = $('#teamName').val();
		var projectName = "";
		if(teamName != ""){
			var User = Parse.Object.extend("_User");
			var query = new Parse.Query(User);
			query.equalTo("teamName", teamName);
			query.first({
				success: function(object) {
					projectName = object.get("projectName");
				},
				error: function(error) {
					alert("Error: " + error.code + " " + error.message);
				}
			});
		}
		var validPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

		if(password != confirmPassword){
			alert("Passwords do not match!");
		}
		else if(!validPassword.test(password)){
			alert("Password needs to contain one capital letter, lowercase letter, number, and one of these symbols (#?!@$%^&*-) and be at least be 8 characters long!"); 
		}
		else if(role == "Team Leader" && roleCode != teamLeaderKey){
			alert("Invalid role code");
		}
		else if(role == "Team Admin" && roleCode != teamAdminKey){
			alert("Invalid role code");
		}
		else{
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
				user.set("userCode", 1223);
			}
			else if(role == "Team Leader") {
				user.set("isTeamMember", "false");
				user.set("isTeamLeader", "true");
				user.set("isTeamAdmin", "false");
				user.set("userCode" , 1245);
			}
			else if(role == "Team Admin") {
				user.set("isTeamMember", "false");
				user.set("isTeamLeader", "false");
				user.set("isTeamAdmin", "true");
				user.set("userCode" , 1234);
			}

			user.set("gender", gender);
			user.set("dob", dob);
			user.set("teamName", teamName);
			user.set("projectName", projectName);

			user.signUp(null, {
				success: function(user) {
					$('<p>').text("Congratulations! Your account has been made.").appendTo('form');
					$('#inputUsername').val('');
					$('#inputFirstName').val('');
					$('#inputLastName').val('');
					$('#inputEmail').val('');
					$('#inputPassword').val('');
					$('#confirmPassword').val('');

					//window.location = "verification.html";
					alert("Please verify your e-mail then log in");

					window.location = "index.html";
				},
				error: function(user, error) {
					alert("Error: " + error.code + " " + error.message);
				}
			});
		}

		// Make sure the method returns false so that the page is not reloaded
		// This would interrupt the asynchronous signUp call.
		return false;
	});

	
}

$(document).ready(main);









