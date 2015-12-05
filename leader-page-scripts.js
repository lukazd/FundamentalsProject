var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

	var firstName = Parse.User.current().get("firstName");
	var lastName = Parse.User.current().get("lastName");
	var username = Parse.User.current().get("username");
	var roleInTeam ="";
	var userRole = "";
	var teamName = "";
	
	// Get changeable information from the database
	var Person = Parse.Object.extend("Person");
	var queryUserInfo = new Parse.Query(Person);
	queryUserInfo.equalTo("username", username);
	queryUserInfo.first({
		success: function(result) {
			userRole = result.get("role");
			roleInTeam = result.get("roleInTeam"); 
			teamName = result.get("teamName");
		},
		error: function(error) {
			alert("Could not properly retrieve your information!");
		}
	});

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
	//var teamName = Parse.User.current().get("teamName");
	
	// Update the page to show the latest fields for a project
	// This is important to do whenever changes are made
	updatePage(teamName);


	/*var User = Parse.Object.extend("_User");
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
	});*/

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
	
	// give/takeaway survey permissions to user
	$('#addusersurveybutton').click(function() {
		if(confirm("Are you sure you want to change user survey permissions?")) {
			var Person = Parse.Object.extend("Person");
			var query = new Parse.Query(Person);
			var username = $('#addusersurveyinput').val();
			query.equalTo("username", username);
			query.equalTo("teamName", teamName);
			query.first({
				success: function(result){
					if(result.get("canAnswerQuestionnaire") == false) {
						result.set("canAnswerQuestionnaire", true);
					}
					else {
						result.set("canAnswerQuestionnaire", false);
					}
					result.save(null, {
    					success: function(object) {
        					alert("Successfully changed questionnaire permissions.");
    					},
    					error: function(error) {
    						alert("Could not change questionnaire permissions.");
    					}
					});
				},
				error: function(error) {
					alert("This user does not exist or the action is not allowed.");
				}
			});
			updatePage(teamName);
		}
	});
	
	// Remove team member
	$('#removeuserfromteambutton').click(function() {
		if(confirm("Are you sure you want to remove this member from your team?")) {
			var Person = Parse.Object.extend("Person");
			var query = new Parse.Query(Person);
			var username = $('#usernameforprojectselector').val();
			query.equalTo("username", username);
			query.equalTo("teamName", teamName);
			query.first({
				success: function(result){
					result.set("projectName", "");
					result.set("teamName", "");
					result.save(null, {
						success: function(myObject) {
							alert("Removed user from team");
						},
						error: function(myObject, error) {
							alert("Could not remove the team member");
						}
					})
				},
				error: function(error) {
					alert("This user does not exist or the action is not allowed.");
				}
			});
			updatePage(teamName);
		}		
	});
	
	// Add team member
	$('#addusertoteambutton').click(function() {
		if(confirm("Are you sure you want to add this member to your team?")) {
			var Person = Parse.Object.extend("Person");
			var query = new Parse.Query(Person);
			var username = $('#usernameforprojectselector').val();
			query.equalTo("username", username);
			query.first({
				success: function(result){
					result.set("projectName", "");
					result.set("teamName", teamName);
					result.save(null, {
						success: function(myObject) {
							alert("Added team member.");
						},
						error: function(myObject, error) {
							alert("Could not add team member.");
						}
					})
				},
				error: function(error) {
					alert("This user does not exist or the action is not allowed.");
				}
			});
			updatePage(teamName);
		}		
	});
	
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
								alert("Successfully added project");
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
	
	// Remove a project
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
		
		// Don't forget to update user's with this project to not have it
	});
	
	// Move user to another project
	$('#changeuserprojectbutton').click(function() {
		if(confirm("Are you sure you want to change user survey permissions?")) {
			var Person = Parse.Object.extend("Person");
			var query = new Parse.Query(Person);
			var username = $('#usernameforprojectselector').val();
			query.equalTo("username", username);
			query.equalTo("teamName", teamName);
			query.first({
				success: function(result){
					var projectName = $('#projectselector').val();
					result.set("projectName", projectName);
					result.save(null, {
						success: function(myObject) {
							alert("Changed user's project");
						},
						error: function(myObject, error) {
							alert("Could not change user's project.");
						}
					})
				},
				error: function(error) {
					alert("This user does not exist or the action is not allowed.");
				}
			});
			updatePage(teamName);
		}		
	});
	
	// Change user's role in team
	$('#changeuserrolebutton').click(function() {
		if(confirm("Are you sure you want to change user survey permissions?")) {
			var Person = Parse.Object.extend("Person");
			var query = new Parse.Query(Person);
			var username = $('#usernameforprojectselector').val();
			query.equalTo("username", username);
			query.equalTo("teamName", teamName);
			query.first({
				success: function(result){
					var roleInTeam = $('#roleselector').val();
					result.set("roleInTeam", roleInTeam);
					result.save(null, {
						success: function(myObject) {
							alert("Changed user's role in team");
						},
						error: function(myObject, error) {
							alert("Could not change user's role in team.");
						}
					})
				},
				error: function(error) {
					alert("This user does not exist or the action is not allowed.");
				}
			});
			updatePage(teamName);
		}		
	});
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
	var Person = Parse.Object.extend("Person");
	var query1 = new Parse.Query(Person);
	var query2 = new Parse.Query(Person);
	var query3 = new Parse.Query(Person);
	query1.equalTo("teamName", teamName);
	query2.equalTo("teamName", null);
	query3.equalTo("teamName", "");
	var mainQuery = Parse.Query.or(query1,query2,query3);
	mainQuery.find({
		success: function(results) {
			for(var i = 0; i < results.length; i++) {
				var object = results[i];
				var userTeam = object.get('teamName');
				var role = object.get('role');
				if(role === "Member") {
					var firstName = object.get('firstName');
					var lastName = object.get('lastName');
					var username = object.get('username') ;
					var role = object.get('roleInTeam');
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
				
				// Add team members/leaders that are on the team to the change project section and team list section
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
					list.appendChild(document.createTextNode(object.get('firstName') + " " + object.get('lastName') + ": " + role));
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