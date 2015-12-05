var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

	var firstName = Parse.User.current().get("firstName");
	var lastName = Parse.User.current().get("lastName");
	var username = Parse.User.current().get("username");
	var roleInTeam = "";
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
			
			// Redirect for incorrect user roles on this page
			if(userRole === "Team Member") {
				window.location = "landing-page.html";
			}
			else if(userRole === "Admin") {
				window.location = "admin-page.html";
			}
			else if(userRole != "Team Leader") {
				window.location = "index.html";
			}
			
			// Display the user's credentials on the page
			$('#name').text(firstName + " " + lastName);
			$('#user-role').text(userRole);
			$('#roleinteam').text(roleInTeam);
			if(teamName === "") {
				$('#teamname').text("You are not part of a team");
			}
			else {
				$('#teamname').text("Team: " + teamName);
			}
			updatePage(teamName);
		},
		error: function(error) {
			alert("Could not properly retrieve your information!");
		}
	});

	

	// Logout functionality
	$('#logoutbutton').click(function() {
		Parse.User.logOut();
		window.location = "index.html";
		return false;
	});
	
	// give/takeaway survey permissions to user
	$('#addusersurveybutton').click(function() {
		if(confirm("Are you sure you want to change user survey permissions?")) {
			var Person = Parse.Object.extend("Person");
			var query = new Parse.Query(Person);
			var username = $('#usernameforsurveyselector').val();
			query.equalTo("username", username);
			query.equalTo("teamName", teamName);
			query.find({
				success: function(results){
					if(results.length > 0) {
						if(results[0].get("canAnswerQuestionnaire") == false) {
							results[0].set("canAnswerQuestionnaire", true);
						}
						else {
							results[0].set("canAnswerQuestionnaire", false);
						}
						results[0].save(null, {
    						success: function(object) {
        						alert("Successfully changed questionnaire permissions.");
        						updatePage(teamName);
    						},
    						error: function(error) {
    							alert("Could not change questionnaire permissions.");
    						}
						});
					}
				},
				error: function(error) {
					alert("This user does not exist or the action is not allowed.");
				}
			});
		}
	});
	
	// Remove team member
	$('#removeuserfromteambutton').click(function() {
		if(confirm("Are you sure you want to remove this member from your team?")) {
			var Person = Parse.Object.extend("Person");
			var query = new Parse.Query(Person);
			var username = $('#usernametodropfromteamselector').val();
			query.equalTo("username", username);
			query.equalTo("teamName", teamName);
			query.first({
				success: function(result){
					result.set("projectName", "");
					result.set("teamName", "");
					result.save(null, {
						success: function(myObject) {
							alert("Removed user from team");
							updatePage(teamName);
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
		}		
	});
	
	// Add team member
	$('#addusertoteambutton').click(function() {
		if(confirm("Are you sure you want to add this member to your team?")) {
			var Person = Parse.Object.extend("Person");
			var query = new Parse.Query(Person);
			var username = $('#usernametoaddtoteamselector').val();
			query.equalTo("username", username);
			query.first({
				success: function(result){
					result.set("projectName", "");
					result.set("teamName", teamName);
					result.save(null, {
						success: function(myObject) {
							alert("Added team member.");
							updatePage(teamName);
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
								updatePage(teamName);
							},
							error: function(projects, error) {
								alert("Could not add project.");
							}
						})
					}
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
								updatePage(teamName);
							},
							error: function(myObject, error){
								alert("Could not remove project");
							}
						});
					}
					else {
						alert("There is no such project");
					}
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
		if(confirm("Are you sure you want to change a user's project?")) {
			var Person = Parse.Object.extend("Person");
			var query = new Parse.Query(Person);
			var username = $('#usernameforprojectselector').val();
			query.equalTo("username", username);
			query.equalTo("teamName", teamName);
			query.find({
				success: function(results){
					if(results.length > 0) {
						var projectName = $('#projectselector').val();
						results[0].set("projectName", projectName);
						results[0].save(null, {
							success: function(myObject) {
								alert("Changed user's project");
								updatePage(teamName);
							},
							error: function(myObject, error) {
								alert("Could not change user's project.");
							}
						})
					}
				},
				error: function(error) {
					alert("This user does not exist or the action is not allowed.");
				}
			});
		}		
	});
	
	// Change user's role in team
	$('#changeuserrolebutton').click(function() {
		if(confirm("Are you sure you want to change user's role in team?")) {
			var Person = Parse.Object.extend("Person");
			var query = new Parse.Query(Person);
			var username = $('#usernameforchangeroleselector').val();
			query.equalTo("username", username);
			query.equalTo("teamName", teamName);
			query.find({
				success: function(results){
					if(results.length > 0) {
						var roleInTeam = $('#roleselector').val();
						results[0].set("roleInTeam", roleInTeam);
						results[0].save(null, {
							success: function(myObject) {
								alert("Changed user's role in team");
								updatePage(teamName);
							},
							error: function(myObject, error) {
								alert("Could not change user's role in team.");
							}
						})
					}
				},
				error: function(error) {
					alert("This user does not exist or the action is not allowed.");
				}
			});
			
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
	
	$('#projectselector').append($('<option/>', { 
        value: "",
        text : "No Project" 
    }));
    

	// Populate the remove and add members, survey permissions, and user change project select boxes
	// Also populate the team members
	var Person = Parse.Object.extend("Person");
	var query1 = new Parse.Query(Person);
	var query2 = new Parse.Query(Person);
	var query3 = new Parse.Query(Person);
	var query4 = new Parse.Query(Person);
	query1.equalTo("teamName", teamName);
	query2.equalTo("teamName", null);
	query3.equalTo("teamName", "");
	var mainQuery = Parse.Query.or(query1,query2,query3);
	mainQuery.notEqualTo("role", "Admin");
	mainQuery.find({
		success: function(results) {
			for(var i = 0; i < results.length; i++) {
				var object = results[i];
				var userTeam = object.get('teamName');
				var role = object.get('role');
				var firstName = object.get('firstName');
				var lastName = object.get('lastName');
				var username = object.get('username') ;
				var roleInTeam = object.get('roleInTeam');
				var canAnswerQuestionnaire = object.get('canAnswerQuestionnaire');
				if(role === "Team Member") {
					// Add team members that are part of the team to the remove section
					// Also add them to the survey permission granting section
					if(userTeam === teamName) {					
						// Remove member section
						var dropUserSelect = document.getElementById("usernametodropfromteamselector");
						var optionRemove = document.createElement("option");
						optionRemove.text = firstName + " " + lastName + " " + "(" + username + ")" + " " + "(Current Role: " + roleInTeam +" )";
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
						optionAdd.text = firstName + " " + lastName + " " + "(" + username + ")" + " " + "(Current Role: " + roleInTeam +" )"
						optionAdd.value = username;
						addUserSelect.add(optionAdd);
					}
				}
				
				// Add team members/leaders that are on the team to the change project section, team list section, and change role section
				if(userTeam === teamName) {
					var changeUserProjectSelect = document.getElementById("usernameforprojectselector");
					var optionChangeUserProject = document.createElement("option");
					optionChangeUserProject.text = firstName + " " + lastName + " " + "(" + username + ")";
					optionChangeUserProject.value = username;
					changeUserProjectSelect.add(optionChangeUserProject);
					
					var changeUserRoleSelect = document.getElementById("usernameforchangeroleselector");
					var optionChangeUserRole = document.createElement("option");
					optionChangeUserRole.text = firstName + " " + lastName + " " + "(" + username + ")" + " " + "(Current Role: " + roleInTeam +" )"
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