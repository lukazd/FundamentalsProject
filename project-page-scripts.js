var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

	var teamName = Parse.User.current().get("teamName");
	var userRole = "Team Member";
	var projectName = "Default Project Name";
	var selecteProcessModel = "Use the questionnaire below to help you select a process model";
	
	// Keeps track of the nth question in the category (Does not correlate to questionId)
	var currentQuestion = 0;
	
	// Keeps track of the current question's id
	var currentQuestionId = 0;
	
	// The selected category of questions
	var category = "team";
	
	// The scores for the process models in the order Waterfall, Agile, Iterative Waterfall, RAD, COTS, Spiral
	var scores = [0, 0, 0, 0, 0, 0];
	
	var currentAnswerResults;

	var Projects = Parse.Object.extend("Projects");
	var query = new Parse.Query(Projects);
	query.find({
		success: function(results) {
			for(var i in results) {
				if(results[i].get("assignedTeam") === teamName) {
					projectName = results[i].get("projectName");
					$('#projectnameheader').text(projectName);
					if(results[i].get("processModel") !== null) {
						selectedProcessModel = results[i].get("processModel");
						$('#processmodelheader').text(selectedProcessModel);
					}
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

}

$(document).ready(main);