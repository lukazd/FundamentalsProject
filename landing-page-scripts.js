var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

	var username = Parse.User.current().get("username");
	var firstName = Parse.User.current().get("firstName");
	var lastName = Parse.User.current().get("lastName");
	var userRole = "Team Member";
	var teamName = "";
	var Person = Parse.Object.extend("Person");
	var query = new Parse.Query(Person);
	query.equalTo("username", username);
	query.first({
		success: function(result){
			if(result != null) {
				userRole = result.get("role");

				// Redirect for incorrect user roles on this page
				if(userRole === "Team Leader") {
					window.location = "leader-page.html";
				}
				else if(userRole === "Admin") {
					window.location = "admin-page.html";
				}
				else if(userRole != "Team Member") {
					window.location = "index.html";
				}

				teamName = result.get("teamName");
				
				$('#name').text(firstName + " " + lastName);
				$('#user-role').text(userRole);
				
				if(teamName === "") {
					$('#teamname').text("You are not part of a team");
				}
				else {
					$('#teamname').text("Team: " + teamName);
				}
				
				var Person = Parse.Object.extend("Person");
				var query = new Parse.Query(Person);
				query.equalTo("teamName", teamName);
				query.find({
					success: function(results) {
						for(var i = 0; i < results.length; i++){
							var object = results[i];
							//get the fields for each team member found
							var teammateName = object.get('firstName') + " " + object.get('lastName');
							var teammateRole = object.get("role");

							//display the team members in a list
							$('<li>').text(teammateName + ": " + teammateRole).appendTo('#teamlistholder');
						}
					},
					error: function(error) {
						console.log("Error: " + error.code + " " + error.message);
					}
				});

				//get the user's teamName so we can query the Projects table to find all projects
				//that that team is working on
				var Projects = Parse.Object.extend("Projects");
				var query = new Parse.Query(Projects);
				query.equalTo("assignedTeam", teamName);
				query.find({
					success: function(results){
						for(var i = 0; i < results.length; i++){
							//display all projects found for that team
							currProjectName = results[i].get("projectName");
							$('<li>').text(currProjectName).appendTo("#projectlistholder")
								.click(function() {
									window.location.href = "project-page.html" + "#" + currProjectName;
								});
						}
					}
				});
			}
			else {
				alert("This user does not exist.");
			}
		}
	});

	$('#logoutbutton').click(function() {
		Parse.User.logOut();

		window.location = "index.html";

		return false;
	});
}

$(document).ready(main);