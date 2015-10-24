var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

	var firstName = Parse.User.current().get("firstName");
	var lastName = Parse.User.current().get("lastName");
	var userRole = "Team Member";

	if( Parse.User.current().get("isTeamLeader") == "true" ) {
		userRole = "Team Leader";
	}
	else if( Parse.User.current().get("isTeamAdmin") == "true") {
		userRole = "Team Admin";
	}

	$('#name').text(firstName + " " + lastName);
	$('#user-role').text(userRole);

	$('#logoutbutton').click(function() {
		Parse.User.logOut();

		window.location = "index.html";

		return false;
	});

	var teamName = Parse.User.current().get("teamName");

	var User = Parse.Object.extend("_User");
	var query = new Parse.Query(User);
	query.equalTo("teamName", teamName);
	query.find({
		success: function(results) {
			for(var i = 0; i < results.length; i++){
				var object = results[i];
				var teammateName = object.get('firstName') + " " + object.get('lastName');
				var teammateRole = "Team Member";
				if(object.get("isTeamLeader") == "true"){
					teammateRole = "Team Leader";
				}
				else if(object.get("isTeamAdmin") == "true"){
					teammateRole = "Team Admin";
				}

				$('<li>').text(teammateName + ": " + teammateRole).appendTo('#listholder');
			}
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

$(document).ready(main);