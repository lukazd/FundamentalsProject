var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

var projectName = Parse.User.current().get("projectName");

var user= Parse.Object.extend("User");
//$('<p>').text("yess").appendTo('form');
var query = new Parse.Query(user);
query.equalTo("projectName", projectName);
query.find({
		success: function(results){
			for(var i = 0; i < results.length; i++){
				if (results[i].get("isTeamLeader")){
					//$('<p>').text("inside").appendTo('form');
					$('#teamLeaderName').text(results[i].get("username"));
			}
		}
	}
	});

//$('#signupbutton').click(function(){
/*	var newleader = $('#inputNewLeader').val();
	var user= Parse.Object.extend("User");
	var query = new Parse.Query(user);
	query.equalTo("username", newleader);
	query.find({
		success: function(results){
			//query.set("isTeamLeader", true)
			$('<p>').text("changed").appendTo('form');

		}
	});


}*/




}
$(document).ready(main);