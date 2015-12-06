var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

	// var projectName = Parse.User.current().get("projectName");
	// var projectName = window.location.hash.substring(1);
	var userRole = "Team Member";
	var teamName = "";
	var projectName = "";
	var firstName = "";
	var lastName = "";
	var username = "";
	var selectedProcessModel = "Use the questionnaire below to help you select a process model";
	var firstName = Parse.User.current().get("firstName");
	var lastName = Parse.User.current().get("lastName");
	var username = Parse.User.current().get("username");
	
	var Person = Parse.Object.extend("Person");
	var query = new Parse.Query(Person);
	query.equalTo("username", username);
	query.first({
		success: function(result) {
			userRole = result.get("role");
			roleInTeam = result.get("roleInTeam"); 
			teamName = result.get("teamName");
			projectName = result.get("projectName");
			
			
			$('#projectnameheader').text(projectName);
			// Grab the process model for the project if it exists
			var Projects = Parse.Object.extend("Projects");
			var projectQuery = new Parse.Query(Projects);
			projectQuery.equalTo("projectName", projectName);
			projectQuery.equalTo("assignedTeam", teamName);
			projectQuery.find({
	 			success: function(results) {
	 				if(results.length > 0) {
	 					if(results[0].get("processModel") !== null) {
	 						selectedProcessModel = results[0].get("processModel");
	 						$('#processmodelheader').text(selectedProcessModel);
						}
					}
	 			},
	 			error: function(error) {
					alert("Could not retrieve process model information");
				}
	 		});
	 		
	 		// Get the calendar events in the database and add them to the calendar
			var CalendarEvent = Parse.Object.extend("CalendarEvent");
			var query = new Parse.Query(CalendarEvent);
			query.equalTo("projectName", projectName);
			query.equalTo("teamName", teamName);
			query.find({
				success: function(results) {
					var projectCalendar = $('#calendar');
					projectCalendar.fullCalendar();
			
					// Add the retrieved dates to the calendar
					for (var i = 0; i < results.length; i++) {
						if(results[i].get("verified")) {
							var newEvent = {
								title: results[i].get("name") + ' (' + results[i].get("description") + ')',
								allDay: true,
								start: results[i].get("startDate"),
								end: results[i].get("endDate"),
								id: results[i].id
							};
							// The end date must be adjusted before displaying to displayed properly
							newEvent.end.setTime(newEvent.end.getTime() + 86400000);	
							projectCalendar.fullCalendar('renderEvent', newEvent, true);
						}
					}
				},
				error: function(error) {
					alert("Could not retrieve calendar event information");
				}
			});
			
			var Person = Parse.Object.extend("Person");
			var query = new Parse.Query(Person);
			query.equalTo("teamName", teamName);
			query.equalTo("projectName", projectName);
			query.notEqualTo("role", "Admin");
			query.find({
				success: function(results) {
					for(var i = 0; i < results.length; i++){
						var object = results[i];
						//get the fields for each team member found
						var teammateName = object.get('firstName') + " " + object.get('lastName');
						var teammateRoleInTeam = object.get('roleInTeam');
						var teammateRole = object.get('role');

						//display the team members in a list
						$('<li>').text(teammateName + ": " + teammateRole + ", " + teammateRoleInTeam).appendTo('#teamlistholder');
					}
				},
				error: function(error) {
					alert("Could not get teammates.");
				}
			});
			
			// Blank project page if they aren't on a project
			if(projectName === "") {
				$(".hasprojectdiv").remove();
				$('#processselectdropdown').remove();
				$('#projectnameheader').text("You are not assigned to a project!");
			}
			
			// Remove the questionnaire and process selector for non team leaders
			else if(!(userRole === "Team Leader") && result.get("canAnswerQuestionnaire") == false) {
				$('.questionnaire').remove();
				$('#processselectdropdown').remove();
			}
		},
		error: function(error) {
			alert("Could not properly retrieve your information!");
		}
	});
	
	// Contains the list of questions being asked
	var questions;
	
	// Keeps track of the nth question in the category (Does not correlate to questionId)
	var currentQuestion = 0;

	// team, resources, cost, time, experience, software, misc.
	var categoryCurrentQuestion = [0,0,0,0,0,0,0];
	var currentCategory = 0;
	
	// Keeps track of the current question's id
	var currentQuestionId = 0;
	
	// The selected category of questions
	var category = "team";
	
	// The scores for the process models in the order Waterfall, Agile, Iterative Waterfall, RAD, COTS, Spiral
	var scores = [0, 0, 0, 0, 0, 0];
	
	var currentAnswerResults;

	// Log Out functionality
	$('#logoutbutton').click(function() {
		Parse.User.logOut();
		window.location = "index.html";
		return false;
	});

	// Save the process model chosen to the database
	$('#processmodeldropdown').click(function(e) {
		var idClicked = e.target.id;
		selectedProcessModel = "No Process Model Selected";
		if(idClicked == "waterfallbutton")
		{
			selectedProcessModel = "Waterfall";
		}
		else if(idClicked == "agilebutton")
		{
			selectedProcessModel = "Agile";
		}
		else if(idClicked == "iterativewaterfallbutton")
		{
			selectedProcessModel = "Iterative Waterfall";
		}
		else if(idClicked == "radbutton")
		{
			selectedProcessModel = "Rapid Application Development";
		}
		else if(idClicked == "cotsbutton")
		{
			selectedProcessModel = "Components Off The Shelf";
		}
		else if(idClicked == "spiralbutton")
		{
			selectedProcessModel = "Spiral";
		}
		$('#processmodelheader').text(selectedProcessModel);
		
		var Projects = Parse.Object.extend("Projects");
		var query = new Parse.Query(Projects);
		query.find({
			success: function(results) {
				for(var i = 0; i < results.length; i++) {
					if(results[i].get("projectName") === projectName) {
						results[i].set("processModel", selectedProcessModel);
						results[i].save();
						break;
					}
				}
			}
		});
			
	});
	
	// Start the initial question depending on the category selected and populate answers
	$('#categorydiv').click(function(e) {
		var idClicked = e.target.id;
		if(idClicked == "teamcategorybutton")
		{
			category = "Team";
			currentCategory = 0;
		}
		else if(idClicked == "resourcescategorybutton")
		{
			category = "Resources";
			currentCategory = 1;
		}
		else if(idClicked == "timecategorybutton")
		{
			category = "Time";
			currentCategory = 2;
		}
		else if(idClicked == "costcategorybutton")
		{
			category = "Cost";
			currentCategory = 3;
		}
		else if(idClicked == "softwarecategorybutton")
		{
			category = "Software";
			currentCategory = 4;
		}
		else if(idClicked == "experiencecategorybutton")
		{
			category = "Experience";
			currentCategory = 5;
		}
		else if(idClicked == "misccategorybutton")
		{
			category = "Misc.";
			currentCategory = 6;
		}
		
		
		$('#answerlistdropdown').empty();
		currentQuestion = 0;
		
		var Question = Parse.Object.extend("Question");
		var query = new Parse.Query(Question);
		query.equalTo("category", category);
		query.find({
			success: function(results){
				questions = results;
				if(questions.length > categoryCurrentQuestion[currentCategory]) {
					$('#questiontext').text(results[categoryCurrentQuestion[currentCategory]].get("text"));
					var questionId = results[categoryCurrentQuestion[currentCategory]].get("questionId");
					currentQuestionId = questionId;
					var Answer = Parse.Object.extend("Answer");
					var answerQuery = new Parse.Query(Answer);
					answerQuery.ascending("answerId");
					answerQuery.equalTo("questionId", questionId);
					answerQuery.find({
						success: function(answerResults){
							currentAnswerResults = answerResults;
							for(var i = 0; i < answerResults.length; i++){
							//display all answers found for that question
								$("#answerlistdropdown").append('<li><a id=answerchoice'  + answerResults[i].get("answerId") +  ' class=answerchoice>'+ answerResults[i].get("text")+'</a></li>');
								//$("#answerlistdropdown").append('<li><a href="#">'+ answerResults[i].get("text")+'</a></li>');
							}
						}
					});
				}
			}
		});	
	});
	
	// Respond to an answer click
	$('.dropdown-menu').on('click', 'a.answerchoice', function(){
		// Get which answer choice was clicked
		var idClicked = this.id;
		var idNumber = parseInt(idClicked.charAt(idClicked.length-1));
			
		// Find the answer based on answerId and questionId
		var answerQuery = new Parse.Query("Answer");
		answerQuery.equalTo("answerId", idNumber);
		answerQuery.equalTo("questionId", currentQuestionId);
		answerQuery.find({
			success: function(answer) {
				// The object was retrieved successfully.
				// Increment the score for each process model by the answers values
				scores[0] += answer[0].get("waterfallValue");
				scores[1] += answer[0].get("agileValue");
				scores[2] += answer[0].get("iterativeWaterfallValue");
				scores[3] += answer[0].get("rADValue");
				scores[4] += answer[0].get("cOTSValue");
				scores[5] += answer[0].get("lastProcessValue");
			}
		});
		
		// Can add data driven logic here
		
		
		$('#answerlistdropdown').empty();
		
		currentQuestion++;
		categoryCurrentQuestion[currentCategory]++;
		if(questions.length > categoryCurrentQuestion[currentCategory]) {
				
			$('#questiontext').text(questions[categoryCurrentQuestion[currentCategory]].get("text"));
			var questionId = questions[categoryCurrentQuestion[currentCategory]].get("questionId");
			currentQuestionId = questionId;
			var Answer = Parse.Object.extend("Answer");
			var answerQuery = new Parse.Query(Answer);
			answerQuery.ascending("answerId");
			answerQuery.equalTo("questionId", questionId);
			answerQuery.find({
				success: function(answerResults){
					for(var i = 0; i < answerResults.length; i++){
						//display all answers found for that question
						$("#answerlistdropdown").append('<li><a id=answerchoice'  + answerResults[i].get("answerId") +  ' class=answerchoice>'+ answerResults[i].get("text")+'</a></li>');											
					}
				}
			});
		}
		else {
			$('#questiontext').text("All questions completed for this category");
		}
	});
	
	// Respond to finish survey click by showing the top two process models
	$('#finishsurveybutton').click(function() {
		var highestScore = -1;
		var secondHighestScore = -1;
		
		var bestProcessModelIndex = 0;
		var secondBestProcessModelIndex = 1;
		
		var bestProcessModelName;
		var secondBestProcessModelName;
		
		for(var i = 0; i < scores.length; i++) {
			if(scores[i] > highestScore) {
				secondHighestScore = highestScore;
				secondBestProcessModelIndex = bestProcessModelIndex;
				highestScore = scores[i];
				bestProcessModelIndex = i;
			}
			else if (scores[i] > secondHighestScore) {
				secondHighestScore = scores[i];
				secondBestProcessModelIndex = i;
			}
		}
		switch(bestProcessModelIndex) {
			case 0:
				bestProcessModelName = "Waterfall";
				break;
			case 1:
				bestProcessModelName = "Agile";
				break;
			case 2:
				bestProcessModelName = "Iterative Waterfall";
				break;
			case 3:
				bestProcessModelName = "Rapid Application Development";
				break;
			case 4:
				bestProcessModelName = "Components Off The Shelf";
				break;
			case 5:
				bestProcessModelName = "Spiral";
				break;
			default:
				bestProcessModelName = "Agile";
				break;
				
		}
		
		switch(secondBestProcessModelIndex) {
			case 0:
				secondBestProcessModelName = "Waterfall";
				break;
			case 1:
				secondBestProcessModelName = "Agile";
				break;
			case 2:
				secondBestProcessModelName = "Iterative Waterfall";
				break;
			case 3:
				secondBestProcessModelName = "Rapid Application Development";
				break;
			case 4:
				secondBestProcessModelName = "Components Off The Shelf";
				break;
			case 5:
				secondBestProcessModelName = "Spiral";
				break;
			default:
				secondBestProcessModelName = "Agile";
				break;
				
		}
		$('#recommendedProcessModelHeader').text("Recommended Process Model: " + bestProcessModelName + " or alternatively " + secondBestProcessModelName);
	}); 


	
	
	// Initialize the calendar
	$('#calendar').fullCalendar({
	
		// Delete event on click
		eventClick: function(calEvent, jsEvent, view)
        {
            if (confirm("Delete " + calEvent.title))
            {
            	var CalendarEvent = Parse.Object.extend("CalendarEvent");
				var calendarEvent = new Parse.Query(CalendarEvent);
				calendarEvent.equalTo("objectId", calEvent._id);
				calendarEvent.find({
					success: function(result) {
						if(userRole === "Team Leader") {
							result[0].destroy({
                				success: function(result) {
                    				$('#calendar').fullCalendar('removeEvents', calEvent._id);
                    				alert("Calendar event has been successfully deleted");
                				},
                				error: function(result, error) {
                    				alert("Failed to delete event");
                				}
            				});
            			}
            			else {
            				result[0].set("toBeDeleted", true);
            				result[0].set("verified", false);
            				result[0].save(null, {
            					success: function(result) {
            						alert("Calendar event deletion submitted for approval");
            					},
            					error: function(result, error) {
            						alert("Failed to delete event");
            					}
            				});
            			}
					},
					error: function(error) {
						alert("Failed to delete event");
					}
				});
            }
        }
	})
	
	// Executing code to add an event to the calendar and/or push it to the database
	$('#addeventbutton').click(function() {
	
		// Make sure the date is valid
		var start = Date.parse($('#startdate').val());
		var end = Date.parse($('#enddate').val());
		if(isNaN(start) || isNaN(end) || end < start) {
			alert("Invalid event data");
		}
		
		// Confirm that the user would like to make the event then create it
		else if (confirm('Are you sure you want to create this event?')) {
			var verified = false;
			var startDate = new Date($('#startdate').val());
			var endDate = new Date($('#enddate').val());
			var name = $('#sel1').find("option:selected").text();
			var description = $('#eventdescription').val();
		
			
			if(userRole == "Team Leader") {
				verified = true;
			}
			
			var projectCalendar = $('#calendar');
			projectCalendar.fullCalendar();
			var newEvent = {
				title: name + ' (' + description + ')',
				allDay: true,
				start: startDate,
				end: endDate
			}
		

				// Create the new row and set its fields
				var CalendarEvent = Parse.Object.extend("CalendarEvent");
				var calendarEvent = new CalendarEvent();
				calendarEvent.set("startDate", startDate);
				calendarEvent.set("endDate", endDate);
				calendarEvent.set("name", name);
				calendarEvent.set("description", description);
				calendarEvent.set("verified", verified);
				calendarEvent.set("teamName", teamName);
				calendarEvent.set("projectName", projectName);
				calendarEvent.set("toBeDeleted", false);
		
				// Save the object to the database
				calendarEvent.save(null, {
					success: function(result) {
						// Add the event to the calendar only if it has been verified
						newEvent.id = result.id;
						if(verified == true) {
							// The end date must be adjusted before displaying to displayed properly
							newEvent.end.setTime(newEvent.end.getTime() + 86400000);
							projectCalendar.fullCalendar('renderEvent', newEvent, true);
							alert('A new calendar event has been created');
						}
						else {
							alert('A new calendar event has been submitted for approval');
						}
					},
					error: function(result, error) {
						// Event was not successfully added to the database
						alert('Failed to create the calendar event!');
					}
				});
		}
		
	});
}

$(document).ready(main);