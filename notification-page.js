function hello(){console.log("Printing Hello")};	


var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

	var firstName = Parse.User.current().get("firstName");
	var lastName = Parse.User.current().get("lastName");
	var userRole = "Team Member";
	$('#name').text(firstName + " "+ lastName);
	if( Parse.User.current().get("isTeamLeader") == "true" ) {
		$('#user-role').text(userRole);
		var teamName = Parse.User.current().get("teamName");
		var Event= Parse.Object.extend("CalendarEvent");
		var query = new Parse.Query(Event);
		query.equalTo("verified", false);
		query.find({
		success: function(results) {
			
			for(var i = 0; i < results.length; i++){
				
   				
				var object = results[i];
				//get the fields for each team member found
				var description = object.get('description');
				var oi = object.get('objectId');
				var status = object.get('verified');
				$('<li>').text(description+ " "+ status + " " + oi).appendTo('#teamlistholder');
				
				add(i, description);
			}
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});

	
	}
	else if( Parse.User.current().get("isTeamAdmin") == "true") {
		var teamName = Parse.User.current().get("teamName");

	var Event= Parse.Object.extend("CalenderEvent");
	var query = new Parse.Query(Event);
	query.equalTo("verified", "false");
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
		
	if( Parse.User.current().get("isTeamLeader") == "true" ) {
		$('#user-role').text("first if");
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
					object.save();
					

				}
				alert("all requests verified");
			},
			error: function(error) {
			alert("Error: " + error.code + " " + error.message);
			}
		});
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