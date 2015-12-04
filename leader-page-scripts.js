var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

	var firstName = Parse.User.current().get("firstName");
	var lastName = Parse.User.current().get("lastName");
	var username = Parse.User.current().get("username");
	var roleInTeam = Parse.User.current().get("RoleinTeam");
	var userRole = "Team Member";

	if( Parse.User.current().get("isTeamLeader") == "true" ) {
		userRole = "Team Leader";
	}
	else if( Parse.User.current().get("isTeamAdmin") == "true") {
		userRole = "Team Admin";
	}

	// Display the user's credentials on the page
	$('#name').text(firstName + " " + lastName);
	$('#user-role').text(userRole);
	$('#roleinteam').text(roleInTeam);

	// Logout functionality
	$('#logoutbutton').click(function() {
		Parse.User.logOut();
		window.location = "index.html";
		return false;
	});


	// Get this current users
	var teamName = Parse.User.current().get("teamName");
	
	// Update the page to show the latest fields for a project
	// This is important to do whenever changes are made
	updatePage(teamName);

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

	/*//get the user's teamName so we can query the Projects table to find all projects
	//that that team is working on
	var teamName = Parse.User.current().get("teamName");
	var Projects = Parse.Object.extend("Projects");
	var query = new Parse.Query(Projects);
	query.equalTo("teamName", teamName);
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
	});*/
	
	// give survey permissions to user
	/*$('#addusersurveybutton').click(function() {
		if(confirm("Are you sure you want to change user survey permissions?")) {
			var User = Parse.Object.extend("User");
			var query = new Parse.Query(User);
			query.equalTo("username", $('#addusersurveyinput').val());
			query.equalTo("teamName", teamName);
			query.first({
				success: function(result){
					alert(result.get("username"));
					result.set("canAnswerQuestionnaire", true);
					result.save(null, {
    					success: function(object) {
        						//
    					},
    					error: function(error) {
    						//alert(error);
    					}
					});
				},
				error: function(error) {
					alert("This user does not exist or the action is not allowed");
				}
			});
		}
		
	});*/
	
	// Add a project
	$('#addprojectbutton').click(function() {
		if(confirm("Are you sure you want to add a project?")) {
			var projectName = $('#addremoveprojectinput').val().trim();
			var Projects = Parse.Object.extend("Projects");
			var query = new Parse.Query(Projects);
			query.equalTo("assignedTeam", teamName);
			query.equalTo("projectName", projectName);
			query.find({
				success: function(results){
					if(results.length > 0) {
						alert("Such a project already exists for this team");
					}
					else {
						var Projects = Parse.Object.extend("Projects");
						var projects = new Projects();
						projects.set("assignedTeam", teamName);
						projects.set("projectName", projectName);
						projects.set("processModel", "No Process Model Selected");
						projects.save(null, {
							success: function(projects) {
								//display the project the leader just added
								//$('<li>').text(projectName).appendTo("#projectlistholder");
							},
							error: function(projects, error) {
								alert("Could not add project.");
							}
						})
					}
					updatePage(teamName);
				},
				error: function(error) {
					alert("Could not add project.");
				}
			});
		}	
	});
	
	// Add a project
	$('#removeprojectbutton').click(function() {
		if(confirm("Are you sure you want to remove a project?")) {
			var projectName = $('#addremoveprojectinput').val().trim();
			var Projects = Parse.Object.extend("Projects");
			var query = new Parse.Query(Projects);
			query.equalTo("assignedTeam", teamName);
			query.equalTo("projectName", projectName);
			query.find({
				success: function(results){
					if(results.length > 0) {
						results[0].destroy({
							success: function(myObject) {
								alert(projectName + " was successfully removed.");
							},
							error: function(myObject, error){
								alert("Could not remove project");
							}
						});
					}
					else {
						alert("There is no such project");
					}
					updatePage(teamName);
				},
				error: function(error) {
					alert("Could not remove project.");
				}
			});
		}	
	});
	
	// move user to another project
	/*$('#changeuserprojectbutton').click(function() {
		if(confirm("Are you sure you want to change user survey permissions?")) {
			var User = Parse.Object.extend("User");
			var query = new Parse.Query(User);
			query.equalTo("username", $('#changeusernameinput').val());
			query.equalTo("teamName", teamName);
			query.find({
				success: function(result){
					result[0].set("projectName", $('#changeprojectinput').val());
					result[0].save();
				},
				error: function(error) {
					alert("This user does not exist or the action is not allowed");
				}
			});
		}		
	});*/
	
	
	
	// These functions below are for old adding removing project stuff
	//
	//
	//
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

function updatePage(teamName) {
	// Clear all of the selects and lists
	$("#usernametodropfromteamselector").empty();
	$("#usernameforsurveyselector").empty();
	$("#usernametoaddtoteamselector").empty();
	$("#usernameforprojectselector").empty();
	$("#usernameforchangeroleselector").empty();
	$("#projectselector").empty();
	$("#teamlist").empty();
	$("#projectlist").empty();

	// Populate the remove and add members, survey permissions, and user change project select boxes
	// Also populate the team members
	var User = Parse.Object.extend("User");
	var query1 = new Parse.Query(User);
	var query2 = new Parse.Query(User);
	var query3 = new Parse.Query(User);
	query1.equalTo("teamName", teamName);
	query2.equalTo("teamName", null);
	query3.equalTo("teamName", "");
	var mainQuery = Parse.Query.or(query1,query2,query3);
	mainQuery.find({
		success: function(results) {
			for(var i = 0; i < results.length; i++) {
				var object = results[i];
				var userTeam = object.get('teamName');
				var isTeamMember = object.get('isTeamMember');
				if(isTeamMember) {
					var firstName = object.get('firstName');
					var lastName = object.get('lastName');
					var username = object.get('username') ;
					var role = object.get('RoleinTeam');
					var canAnswerQuestionnaire = object.get('canAnswerQuestionnaire');
						
				
					// Add team members that are part of the team to the remove section
					// Also add them to the survey permission granting section
					if(userTeam === teamName) {					
						// Remove member section
						var dropUserSelect = document.getElementById("usernametodropfromteamselector");
						var optionRemove = document.createElement("option");
						optionRemove.text = firstName + " " + lastName + " " + "(" + username + ")" + " " + "(Current Role: " + role +" )";
						optionRemove.value = username;
						dropUserSelect.add(optionRemove);
						
						// Survey permission section
						var giveUserPermissionSelect = document.getElementById("usernameforsurveyselector");
						var optionGivePermission = document.createElement("option");
						optionGivePermission.text = firstName + " " + lastName + " " + "(" + username + ")" + " Authorized: " + canAnswerQuestionnaire.toString();
						optionGivePermission.value = username;
						giveUserPermissionSelect.add(optionGivePermission);
					}
					
					// Add team members that don't have a team to the add section
					else {
						var addUserSelect = document.getElementById("usernametoaddtoteamselector");
						var optionAdd = document.createElement("option");
						optionAdd.text = firstName + " " + lastName + " " + "(" + username + ")" + " " + "(Current Role: " + role +" )"
						optionAdd.value = username;
						addUserSelect.add(optionAdd);
					}
				}
				
				// Add team members that are on the team to the change project section and team list section
				if(userTeam === teamName) {
					var changeUserProjectSelect = document.getElementById("usernameforprojectselector");
					var optionChangeUserProject = document.createElement("option");
					optionChangeUserProject.text = firstName + " " + lastName + " " + "(" + username + ")";
					optionChangeUserProject.value = username;
					changeUserProjectSelect.add(optionChangeUserProject);
					
					var changeUserRoleSelect = document.getElementById("usernameforchangeroleselector");
					var optionChangeUserRole = document.createElement("option");
					optionChangeUserRole.text = firstName + " " + lastName + " " + "(" + username + ")" + " " + "(Current Role: " + role +" )"
					optionChangeUserRole.value = username;
					changeUserRoleSelect.add(optionChangeUserRole);
					
					// Update the team list
					var teamList = document.getElementById("teamlist");
					var list = document.createElement("li");
					if(object.get('isTeamLeader') === "true") {
						list.appendChild(document.createTextNode(object.get('firstName') + " " + object.get('lastName') + ": Team Leader"));
  					}
  					else {
						list.appendChild(document.createTextNode(object.get('firstName') + " " + object.get('lastName') + ": Team Member"));
  					}
  					teamList.appendChild(list);
				}
			}
		}
	});
	
	// Update the selector for moving a user to a project and the project list
	var Projects = Parse.Object.extend("Projects");
	var query = new Parse.Query(Projects);
	query.equalTo("assignedTeam", teamName);	
	query.find({
		success: function(results) {
			for(var i = 0; i < results.length; i++) {
				// Update the project selector
				var object = results[i];
				var projectName = object.get('projectName');
				var projectSelect = document.getElementById("projectselector");
				var optionProject = document.createElement("option");
				optionProject.text = projectName;
				optionProject.value = projectName;
				projectSelect.add(optionProject);
				
				// Update the project list
				var projectList = document.getElementById("projectlist");
				var list = document.createElement("li");
				list.appendChild(document.createTextNode("Project Name: " + object.get('projectName') + ", Process Model: " + object.get('processModel')));
  				projectList.appendChild(list);
			}
		}
	});
}