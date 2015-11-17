var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

	// var projectName = Parse.User.current().get("projectName");
	var projectName = window.location.hash.substring(1);
	var userRole = "Team Member";
	//var projectName = "Default Project Name";
	var selectedProcessModel = "Use the questionnaire below to help you select a process model";
	
	$('#projectnameheader').text(projectName);
	// Keeps track of the nth question in the category (Does not correlate to questionId)
	var currentQuestion = 0;
	
	// Keeps track of the current question's id
	var currentQuestionId = 0;
	
	// The selected category of questions
	var category = "team";
	
	// The scores for the process models in the order Waterfall, Agile, Iterative Waterfall, RAD, COTS, Spiral
	var scores = [0, 0, 0, 0, 0, 0];
	
	var currentAnswerResults;

	// Grab the process model for the project if it exists
	var Projects = Parse.Object.extend("Projects");
	var query = new Parse.Query(Projects);
	query.find({
	 	success: function(results) {
	 		for(var i in results) {
	 			if(results[i].get("assignedTeam") === teamName) {
	 				if(results[i].get("processModel") !== null) {
	 					selectedProcessModel = results[i].get("processModel");
	 					$('#processmodelheader').text(selectedProcessModel);
	 				}
	 			}
	 		}
	 	}
	 });
	
	// Get the Calendar events in the database
	var CalendarEvent = Parse.Object.extend("CalendarEvent");
	var query = new Parse.Query(CalendarEvent);
	query.find({
		success: function(results) {
			var projectCalendar = $('#calendar');
			projectCalendar.fullCalendar();
			
			for(var i in results) {
				if(results[i].get("verified")) {
					var newEvent = {
						title: results[i].get("name") + ' (' + results[i].get("description") + ')',
						allDay: true,
						start: results[i].get("startDate"),
						end: results[i].get("endDate")
					};	
					projectCalendar.fullCalendar('renderEvent', newEvent, true);
				}
			}
		}
	});
	
	if( Parse.User.current().get("isTeamLeader") == "true" ) {
		userRole = "Team Leader";
	}
	else if( Parse.User.current().get("isTeamAdmin") == "true") {
		userRole = "Team Admin";
	}

	//$('#name').text(firstName + " " + lastName);
	//$('#user-role').text(userRole);

	$('#logoutbutton').click(function() {
		Parse.User.logOut();

		window.location = "index.html";

		return false;
	});
	
	// Remove the questionnaire and process selector for non team leaders
	if(!(userRole === "Team Leader")) {
		$('.questionnaire').remove();
		$('#processmodeldiv').remove();
	}

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
		// These ones need to be updated once the categories are added
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
				for(var i in results) {
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
		}
		else if(idClicked == "resourcescategorybutton")
		{
			category = "Resources";
		}
		// These ones need to be updated once the categories are added
		else if(idClicked == "timecategorybutton")
		{
			category = "Time";
		}
		else if(idClicked == "costcategorybutton")
		{
			category = "Cost";
		}
		else if(idClicked == "softwarecategorybutton")
		{
			category = "Software";
		}
		else if(idClicked == "experiencecategorybutton")
		{
			category = "Experience";
		}
		else if(idClicked == "misccategorybutton")
		{
			category = "Misc.";
		}
		
		
		$('#answerlistdropdown').empty();
		currentQuestion = 0;
		
		var Question = Parse.Object.extend("Question");
		var query = new Parse.Query(Question);
		query.equalTo("category", category);
		query.find({
			success: function(results){
				$('#questiontext').text(results[currentQuestion].get("text"));
				var questionId = results[currentQuestion].get("questionId");
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
							$("#answerlistdropdown").append('<li><a href="#" id=answerchoice'  + answerResults[i].get("answerId") +  ' class=answerchoice>'+ answerResults[i].get("text")+'</a></li>');
							//$("#answerlistdropdown").append('<li><a href="#">'+ answerResults[i].get("text")+'</a></li>');
						
							
						}
					}
				});
			}
		});	
	});
	
	// Respond to an answer click
	$('.dropdown-menu').on('click', 'a.answerchoice', function(){
		// Get which answer choice wsas
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
		
		
		$('#answerlistdropdown').empty();
		
		currentQuestion++;
		var Question = Parse.Object.extend("Question");
		var query = new Parse.Query(Question);
		query.equalTo("category", category);
		query.find({
			success: function(results){
				if(results.length > currentQuestion) {
				
					$('#questiontext').text(results[currentQuestion].get("text"));
					var questionId = results[currentQuestion].get("questionId");
					currentQuestionId = questionId;
					var Answer = Parse.Object.extend("Answer");
					var answerQuery = new Parse.Query(Answer);
					answerQuery.ascending("answerId");
					answerQuery.equalTo("questionId", questionId);
					answerQuery.find({
						success: function(answerResults){
							for(var i = 0; i < answerResults.length; i++){
							//display all answers found for that question
								$("#answerlistdropdown").append('<li><a href="#" id=answerchoice'  + answerResults[i].get("answerId") +  ' class=answerchoice>'+ answerResults[i].get("text")+'</a></li>');											
							}
						}
					});
				}
				else {
					$('#questiontext').text("All questions completed for this category");
				}
			}
		});
	});
	
	// Respond to finish survey click
	$('#finishsurveybutton').click(function() {
		var highestScore = 0;
		var bestProcessModelIndex = 0;
		var bestProcessModelName;
		for(var i = 0; i < scores.length; i++) {
			if(scores[i] > highestScore) {
				highestScore = scores[i];
				bestProcessModelIndex = i;
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

		window.alert("We recommend the process model: " + bestProcessModelName);
		
	}); 

	//get the current users team name to make a query to find all other users with that team name
	var teamName = Parse.User.current().get("teamName");


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
	
	// Initialize the calendar
	$('#calendar').fullCalendar({
			// put your options and callbacks here
	})
	
	// Executing code to add an event to the calendar and/or push it to the database
	$('#addeventbutton').click(function() {
		if (confirm('Are you sure you want to create this event?')) {
		
			var verified = false;
			var startDate = new Date($('#startdate').val());
			var endDate = new Date($('#enddate').val());
			var name = "meeting";	// This is a placeholder, change this
			var description = $('#eventdescription').val();
		
			if(endDate >= startDate) {
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
				};
		

			// Create the new row and set its fields
				var CalendarEvent = Parse.Object.extend("CalendarEvent");
				var calendarEvent = new CalendarEvent();
				calendarEvent.set("startDate", startDate);
				calendarEvent.set("endDate", endDate);
				calendarEvent.set("name", name);
				calendarEvent.set("description", description);
				calendarEvent.set("verified", verified);
		
				// Save the object to the database
				calendarEvent.save(null, {
					success: function(calendarEvent) {
						// Add the event to the calendar only if it has been verified
						if(verified == true) {
							projectCalendar.fullCalendar('renderEvent', newEvent, true);
							alert('A new calendar event has been created');
						}
						else {
							alert('A new calendar event has been submitted for approval');
						}
					},
					error: function(calendarEvent, error) {
						// Event was not successfully added to the database
						alert('Failed to create the calendar event!');
					}
				});
			}
		}
		
	});


}

$(document).ready(main);