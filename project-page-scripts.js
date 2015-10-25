var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

	var firstName = Parse.User.current().get("firstName");
	var lastName = Parse.User.current().get("lastName");
	var userRole = "Team Member";
	var projectName = Parse.Projects
	var currentQuestion = 0;
	var category = "team";

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
	
	// Start the initial question depending on the category selected and populate answers
	$('#categorydiv').click(function(e) {
		var idClicked = e.target.id;
		if(idClicked == "timecategorybutton")
		{
			category = "team";
		}
		else if(idClicked == "resourcescategorybutton")
		{
			category = "resources";
		}
		else if(idClicked == "timecategorybutton")
		{
			category = "team";
		}
		else if(idClicked == "timecategorybutton")
		{
			category = "team";
		}
		else if(idClicked == "timecategorybutton")
		{
			category = "team";
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
				var Answer = Parse.Object.extend("Answer");
				var answerQuery = new Parse.Query(Answer);
				answerQuery.ascending("answerId");
				answerQuery.equalTo("questionId", questionId);
				answerQuery.find({
					success: function(answerResults){
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
	$('.dropdown-menu').on('click', 'a.answerchoice', function(){
		// Get which answer choice wsas
		var idClicked = this.id;
		var idNumber = parseInt(idClicked.charAt(idClicked.length-1));
		
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

	
	// Respond to an answer click
	//$(".answerchoice").change(function(e) {
	//	var answerListSize = $('#answerlistdropdown').size();
	//	var idClicked = e.target.id;
		
	//});


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

	//if user is team leader, allow them to do the questionnaire
	if(userRole == "Team Leader"){
		
	}

}

$(document).ready(main);