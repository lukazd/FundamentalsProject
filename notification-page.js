var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");
	var firstName = Parse.User.current().get("firstName");
	var lastName = Parse.User.current().get("lastName");
	var userRole = "Team Leader";
	//$('#name').text(Parse.User.current().get("isTeamLeader"));
	if( Parse.User.current().get("isTeamLeader") == "true" ) {
		$('#user-role').text(userRole);
		var teamName = Parse.User.current().get("teamName");
		var Event= Parse.Object.extend("CalendarEvent");
		var query = new Parse.Query(Event);
		query.equalTo("teamName", teamName);
		query.descending("createdAt");
		query.find({
		success: function(results) {
			//$('#name').text(results.length);
			for(var i = 0; i < results.length; i++) {
				//alert(results[i].get('description'));
				var object = results[i];
				var status = object.get('verified');
				if(status == false){
				//get the fields for each team member found
				var name = object.get('name')
				var description = object.get('description');
				var startDate = object.get('startDate');
				var endDate = object.get('endDate');
				var projectName = object.get("projectName");
				//var deleting = object.get('toBeDeleted');
				
				var obj = object.id;
				$('<li>').text(name + " (" + description + ") " + "     " + "Project: " + projectName+ "      from " + startDate.getMonth() +"-" +startDate.getDate() +"-" + startDate.getFullYear() + " to " + endDate.getMonth() +"-" +endDate.getDate() +"-" + endDate.getFullYear()).appendTo('#teamlistholder');
				add(i, obj);
				}
				/*if(deleting) {
					$('<li>').text("Deleting event: " + description+ ""+ status).appendTo('#teamlistholder');
				}
				else {
					$('<li>').text("Adding event: " + description+ ""+ status).appendTo('#teamlistholder');
				}*/
			}
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});

	
	}
	else if( Parse.User.current().get("isTeamLeader") == "false") {
		var teamName = Parse.User.current().get("teamName");

	var Event= Parse.Object.extend("CalendarEvent");
	var query = new Parse.Query(Event);
	query.equalTo("verified", false);
	query.find({
		success: function(results) {
			for(var i = 0; i < results.length; i++){
				var object = results[i];
				//get the fields for each team member found
				var teammateName = object.get('description');;
				

				//display the team members in a list
				$('<li>').text(teammateName + ": " + teammateRole).appendTo('#teamlistholder');
			}
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});

	
	}

	$('#savebutton').click(function() {
		if(confirm("Are you sure you would like to confirm the events?")) {
		if( Parse.User.current().get("isTeamLeader") == "true" ) {
		//$('#user-role').text("first if");
		var teamName = Parse.User.current().get("teamName");
		var Event= Parse.Object.extend("CalendarEvent");
		var query = new Parse.Query(Event);
		query.equalTo("verified", false);
		query.find({
			success: function(results) {
				//alert(results.length);
				for(var i = 0; i < results.length; i++){
					var object = results[i]
					//alert(object);
					object.set("verified", true);
					/*var deleting = object.get('toBeDeleted');
					if(deleting) {
						object.destroy();
					}*/
					object.save();
					

				}
				alert("all requests verified");
			},
			error: function(error) {
			alert("Error: " + error.code + " " + error.message);
			}
		});
	}
	}
			
	});
	

	$('#logoutbutton').click(function() {
		Parse.User.logOut();

		window.location = "index.html";

		return false;
	});


	//get the current users team name to make a query to find all other users with that team name
	

}

$(document).ready(main);

