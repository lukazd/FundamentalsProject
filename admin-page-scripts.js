var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

	var firstName = Parse.User.current().get("firstName");
	var lastName = Parse.User.current().get("lastName");
	var username = Parse.User.current().get("username");
	var userRole = "Admin";
	//Since this is the admin page, we should implement functionality to verify
	//this user is an admin. Modify below method to do that.
	var Person = Parse.Object.extend("Person");
			var query = new Parse.Query(Person);
			query.equalTo("username", username);
			query.first({
				success: function(result){
					if(result != null) {
						userRole = result.get("role");

					// Redirect for incorrect user roles on this page
					if(userRole === "Team Member") {
						window.location = "landing-page.html";
					}
					else if(userRole === "Team Leader") {
						window.location = "leader-page.html";
					}
					else if(userRole != "Admin") {
						window.location = "index.html";
					}
					}
					else {
						alert("This user does not exist.");
					}
				}
			});

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
			var Person = Parse.Object.extend("Person");
			var query = new Parse.Query(Person);
			query.equalTo("username", username);
			query.first({
				success: function(result){
					if(result != null) {
						if(result.get("role") == "Member"){
							result.set("role", "Leader");
							result.save();
						}
						else if(result.get("role") == "Leader"){
							result.set("role", "Member");
							result.save();
						}
					}
					else {
						alert("This user does not exist.");
					}
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
	var Person = Parse.Object.extend("Person");
	var query = new Parse.Query(Person);
	query.notContainedIn("Role", ["Admin"]);
	query.find({
		success: function(results) {
			for(var i = 0; i < results.length; i++) {
				var object = results[i];
				var userTeam = object.get('teamName');
				var role = object.get('role');
				var firstName = object.get('firstName');
				var lastName = object.get('lastName');
				var username = object.get('username');

				var promoteDemoteUserSelect = document.getElementById("usernametopromoteordemoteselector");
				var optionPromoteDemote = document.createElement("option");
				if(role == "Member"){
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