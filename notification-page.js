var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");
		
	var username = Parse.User.current().get("username");
	var Person = Parse.Object.extend("Person");
	var personQuery = new Parse.Query(Person);
	personQuery.equalTo("username", username);
	personQuery.find({
		success: function(results) {
			var firstName = results[0].get("firstName");
			var lastName = results[0].get("lastName");
			var userRole = results[0].get("role");
			var teamName = results[0].get("teamName");
			if(userRole === "Team Leader") {
				var Event = Parse.Object.extend("CalendarEvent");
				var query = new Parse.Query(Event);
				query.equalTo("teamName", teamName);
				query.descending("createdAt");
				query.find({
					success: function(results) {
						for(var i = 0; i < results.length; i++) {
							//alert(results[i].get('description'));
							var object = results[i];
							var status = object.get('verified');
							if(status == false) {
								//get the fields for each team member found
								var name = object.get('name')
								var description = object.get('description');
								var startDate = object.get('startDate');
								var endDate = object.get('endDate');
								var projectName = object.get("projectName");
								var deleting = object.get('toBeDeleted');
					
								var obj = object.id;
								if(deleting) {
									$('<li>').text("Deleting Event: " + name + " (" + description + ") " + "     " + "Project: " + projectName+ "      from " + (parseInt(startDate.getMonth(), 10)+1).toString() +"-" +startDate.getDate() +"-" + startDate.getFullYear() + " to " + (parseInt(endDate.getMonth(), 10)+1).toString() +"-" +endDate.getDate() +"-" + endDate.getFullYear()).appendTo('#teamlistholder');
								}
								else {
									$('<li>').text("Adding Event: " + name + " (" + description + ") " + "     " + "Project: " + projectName+ "      from " + (parseInt(startDate.getMonth(), 10)+1).toString() +"-" +startDate.getDate() +"-" + startDate.getFullYear() + " to " + (parseInt(endDate.getMonth(), 10)+1).toString() +"-" +endDate.getDate() +"-" + endDate.getFullYear()).appendTo('#teamlistholder');
								}
								add(i, obj, true);
							}
						}
					},
					error: function(error) {
						alert("Could not fetch calendar event notifications.");
					}
				});
			}
		},
		error: function(error) {
			alert("Could not verify user");
		}
	});

	

	$('#logoutbutton').click(function() {
		Parse.User.logOut();

		window.location = "index.html";

		return false;
	});	
}

$(document).ready(main);

