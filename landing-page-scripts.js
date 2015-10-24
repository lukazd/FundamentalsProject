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


	//get the current users team name to make a query to find all other users with that team name
	var teamName = Parse.User.current().get("teamName");

	var User = Parse.Object.extend("_User");
	var query = new Parse.Query(User);
	query.equalTo("teamName", teamName);
	query.find({
		success: function(results) {
			for(var i = 0; i < results.length; i++){
				var object = results[i];
				//get the fields for each team member found
				var teammateName = object.get('firstName') + " " + object.get('lastName');
				var teammateRole = "Team Member";
				if(object.get("isTeamLeader") == "true"){
					teammateRole = "Team Leader";
				}
				else if(object.get("isTeamAdmin") == "true"){
					teammateRole = "Team Admin";
				}

				//display the team members in a list
				$('<li>').text(teammateName + ": " + teammateRole).appendTo('#teamlistholder');
			}
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});

	//get the user's teamName so we can query the Projects table to find all projects
	//that that team is working on
	var teamName = Parse.User.current().get("teamName");
	var Projects = Parse.Object.extend("Projects");
	var query = new Parse.Query(Projects);
	query.equalTo("assignedTeam", teamName);
	query.find({
		success: function(results){
			for(var i = 0; i < results.length; i++){
				//display all projects found for that team
				$('<li>').text(results[i].get("projectName")).appendTo("#projectlistholder");
			}
		}
	});

	//if user is team leader, allow them to add a project for their team
	if(userRole == "Team Leader"){
		$('<button/>', {
			text: "Add Project",
			id: "addProjectButton",
			click: function (){
				var projectName = prompt("Enter project name to add", "Project Name");
				var teamName = Parse.User.current().get("teamName");
				var Projects = Parse.Object.extend("Projects");
				var projects = new Projects();

				projects.set("assignedTeam", teamName);
				projects.set("projectName", projectName);

				projects.save(null, {
					success: function(projects) {
						//display the project the leader just added
						$('<li>').text(projectName).appendTo("#projectlistholder");
					},
					error: function(projects, error) {
						alert("Error: " + error.code + " " + error.message);
					}
				})
			}
		}).insertAfter(".projects");

		$('<button/>', {
			text: "Remove Project",
			id: "removeProjectButton",
			click: function (){
				var projectName = prompt("Enter project name to delete", "Project Name");
				var teamName = Parse.User.current().get("teamName");
				var Projects = Parse.Object.extend("Projects");
				var query = new Parse.Query(Projects);

				query.equalTo("assignedTeam", teamName);
				query.find({
					success: function(results) {
						for(var i = 0; i < results.length; i++){
							if(results[i].get("projectName") == projectName){
								results[i].destroy({
									success: function(myObject) {
										alert(projectName + " was successfully destroyed.");
										
									},
									error: function(myObject, error){
										alert("Error: " + error.code + " " + error.message);
									}
								});
							}
						}
					}
				});
			}
		}).insertAfter(".projects");
	}

}

$(document).ready(main);