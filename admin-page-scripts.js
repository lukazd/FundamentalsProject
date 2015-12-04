var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

	var firstName = Parse.User.current().get("firstName");
	var lastName = Parse.User.current().get("lastName");
	var username = Parse.User.current().get("username");
	var userRole = "Team Member";

	if( Parse.User.current().get("isTeamAdmin") == "true") {
		userRole = "Team Admin";
	}

	// Display the user's credentials on the page
	$('#name').text(firstName + " " + lastName);
	$('#user-role').text(userRole);

	// Logout functionality
	$('#logoutbutton').click(function() {
		Parse.User.logOut();
		window.location = "index.html";
		return false;
	});
	
	// Update the page to show the latest fields for a project
	// This is important to do whenever changes are made
	updatePage();
	
	// Update the user role
	$('#changeuserrolebutton').click(function() {
		if(confirm("Are you sure you want to promote or demote this user?")) {
			var username = $('#usernametopromoteordemoteselector').val();
			var User = Parse.Object.extend("User");
			var query = new Parse.Query(User);
			query.equalTo("username", username);
			query.first({
				success: function(result){
					if(result != null) {
						alert("We'll update the user for you alright, jeez!");
					}
					else {
						alert("This user does not exist.");
					}
					updatePage(teamName);
				},
				error: function(error) {
					alert("The role could not be updated.");
				}
			});
			updatePage();
		}	
	});

	
}
$(document).ready(main);

function updatePage() {
	// empty the select of usernames to promote/demote
	$("#usernametopromoteordemoteselector").empty();

	// Populate the promotion select
	var User = Parse.Object.extend("_User");
	var query = new Parse.Query(User);	
	query.equalTo("isTeamAdmin", "false");
	query.find({
		success: function(results) {
			for(var i = 0; i < results.length; i++) {
				var object = results[i];
				var userTeam = object.get('teamName');
				var isTeamMember = object.get('isTeamMember');
				var firstName = object.get('firstName');
				var lastName = object.get('lastName');
				var username = object.get('username');
				
				var promoteDemoteUserSelect = document.getElementById("usernametopromoteordemoteselector");
				var optionPromoteDemote = document.createElement("option");
				if(isTeamMember === "true") {
					optionPromoteDemote.text = firstName + " " + lastName + " " + "(" + username + ")" + " " + "(Role: Team Member)";
				}
				else{
					optionPromoteDemote.text = firstName + " " + lastName + " " + "(" + username + ")" + " " + "(Role: Team Leader)";
				}
				optionPromoteDemote.value = username;
				promoteDemoteUserSelect.add(optionPromoteDemote);
			}
		}
	});
}