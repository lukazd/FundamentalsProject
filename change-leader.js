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
				if (results[i].get("projectName") == projectName){
					if (results[i].get("isTeamLeader") == "true"){
						var object = results[i];
						var username = object.get("username");
						var firstName = object.get('firstName');
						var lastName = object.get('lastName');

						$('#teamLeaderName').text(firstName + " "+ lastName + '    ' + "("+ username + ")");
						var x = document.getElementById("SelectLeader");
						var y = document.getElementById("SelectAdmin");
						
						var option1 = document.createElement("option");
						var option2 = document.createElement("option");
						
						option1.text = firstName + " "+ lastName + " " + "(" + username + ")" + " " + "(Current Role: Leader)";
						option2.text = firstName + " "+ lastName + " " + "(" + username + ")" + " " + "(Current Role: Leader)";
						
						x.add(option1);
						y.add(option2);
						
					}
					if (results[i].get("isTeamAdmin") == "true"){
						var object = results[i];
						var username = object.get("username");
						var firstName = object.get('firstName');
						var lastName = object.get('lastName');
					
						$('#teamAdminName').text(firstName + " "+ lastName + '    ' + "("+ username + ")");
						var x = document.getElementById("SelectLeader");
						var y = document.getElementById("SelectAdmin");
						
						var option1 = document.createElement("option");
						var option2 = document.createElement("option");
						
						option1.text = firstName + " "+ lastName + " " + "(" + username + ")" + " " + "(Current Role: Admin)";
						option2.text = firstName + " "+ lastName + " " + "(" + username + ")" + " " + "(Current Role: Admin)";
						
						x.add(option1);
						y.add(option2);

					}

					if (results[i].get("isTeamMember") == "true"){
						var object = results[i];
						var username = object.get("username");
						var firstName = object.get('firstName');
						var lastName = object.get('lastName');
					
						$('#teamAdminName').text(firstName + " "+ lastName + '    ' + "("+ username + ")");
						var x = document.getElementById("SelectLeader");
						var y = document.getElementById("SelectAdmin");
						
						var option1 = document.createElement("option");
						var option2 = document.createElement("option");
						
						option1.text = firstName + " "+ lastName + " " + "(" + username + ")" + " " + "(Current Role: Member)";
						option2.text = firstName + " "+ lastName + " " + "(" + username + ")" + " " + "(Current Role: Member)";
						
						x.add(option1);
						y.add(option2);
						
					}
			
			}		
		}
	}
	});

	$('#signupbutton').click(function() {
		event.preventDefault();
         
         //var query1 = new Parse.Query(user);
         var user= Parse.Object.extend("User");
	//$('<p>').text("yess").appendTo('form');
	     var query1 = new Parse.Query(user);
	     var name = $('#inputTeamLeader').val();
         query1.equalTo("username", name);
         
         query1.find({
			success: function(results) {

				alert(results);
				for(var i = 0; i < results.length; i++){
					var object = results[i];
					alert(object.get("isTeamLeader"));
					object.set("isTeamLeader", "true");
					alert(object.get("isTeamLeader"));
					object.save();
					$('#inputTeamLeader').val('');
				}
				alert("all requests verified");
			},
			error: function(error) {
			alert("Error: " + error.code + " " + error.message);
			}
		});

			
	});

	$('#signupbutton2').click(function() {
		event.preventDefault();
         
         //var query1 = new Parse.Query(user);
         var user= Parse.Object.extend("User");
	//$('<p>').text("yess").appendTo('form');
	     var query1 = new Parse.Query(user);
	     var name = $('#inputNewLeader').val();
	     var name = $('#inputTeamAdmin').val();
         query1.equalTo("username", name);
         
         query1.find({
			success: function(results) {

				alert(results);
				for(var i = 0; i < results.length; i++){
					var object = results[i];
					alert(object.get("isTeamLeader"));
					object.set("isTeamAdmin", "true");
					alert(object.get("isTeamLeader"));
					object.save();

					$('#inputTeamAdmin').val('');
				}
				alert("all requests verified");
			},
			error: function(error) {
			alert("Error: " + error.code + " " + error.message);
			}
		});

			
	});

	$('#logoutbutton').click(function() {
		Parse.User.logOut();

		window.location = "index.html";

		return false;
	});


	
}

$(document).ready(main);

 









