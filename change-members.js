var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

	var projectName = Parse.User.current().get("projectName");

	var user= Parse.Object.extend("User");
	//$('<p>').text("yess").appendTo('form');
	var query = new Parse.Query(user);
	query.equalTo("projectName", projectName);
	//alert(projectName);
	query.find({
		success: function(results) {
			for(var i = 0; i < results.length; i++) {

				if (results[i].get("projectName")== projectName){
					//alert(projectName);
					//designers
					if (results[i].get("RoleinTeam")== "Designer"){
						//alert("inside");
						var object = results[i];
						//get the fields for each team member found
						var firstName = object.get('firstName');
						var lastName = object.get('lastName');
						var username = object.get('username') ;
						$('<li>').text(firstName+ " "+ lastName + " " + "(" + username + ")").appendTo('#Designerlist');
						
						var x = document.getElementById("SelectDesigner");
						var y = document.getElementById("SelectCoder");
						var z = document.getElementById("SelectTester");
						var option1 = document.createElement("option");
						var option2 = document.createElement("option");
						var option3 = document.createElement("option");
						option1.text = firstName + " "+ lastName + " " + "(" + username + ")" + " " + "(Current Role: Designer)";
						option2.text = firstName + " "+ lastName + " " + "(" + username + ")" + " " + "(Current Role: Designer)";
						option3.text = firstName + " "+ lastName + " " + "(" + username + ")" + " " + "(Curret Role: Designer)";

						x.add(option1);
						y.add(option2);
						z.add(option3);
						

					}
					//testers
					if (results[i].get("RoleinTeam")== "Tester"){
						//alert("inside");
						var object = results[i];
						//get the fields for each team member found
						var firstName = object.get('firstName');
						var lastName = object.get('lastName');
						var username = object.get('username') ;
						$('<li>').text(firstName+ " "+ lastName+ " " + "(" + username + ")").appendTo('#Testerlist');
						var x = document.getElementById("SelectDesigner");
						var y = document.getElementById("SelectCoder");
						var z = document.getElementById("SelectTester");
						var option1 = document.createElement("option");
						var option2 = document.createElement("option");
						var option3 = document.createElement("option");
						option1.text = firstName + " "+ lastName + " " + "(" + username + ")" + " " + "(current Role: Tester)";
						option2.text = firstName + " "+ lastName + " " + "(" + username + ")" + " " + "(Current Role: Tester)";
						option3.text = firstName + " "+ lastName + " " + "(" + username + ")" + " " + "(Current Role: Tester)";

						x.add(option1);
						y.add(option2);
						z.add(option3);

					}
					//coders
					if (results[i].get("RoleinTeam")== "Coder"){
						//alert("inside");
						var object = results[i];
						//get the fields for each team member found
						var firstName = object.get('firstName');
						var lastName = object.get('lastName');
						var username = object.get('username') ;
						$('<li>').text(firstName+ " "+ lastName+ " " + "(" + username + ")").appendTo('#Coderlist');
						
						var x = document.getElementById("SelectDesigner");
						var y = document.getElementById("SelectCoder");
						var z = document.getElementById("SelectTester");
						var option1 = document.createElement("option");
						var option2 = document.createElement("option");
						var option3 = document.createElement("option");
						option1.text = firstName + " "+ lastName + " " + "(" + username + ")" + " " + "(Current Role: Coder)";
						option2.text = firstName + " "+ lastName + " " + "(" + username + ")" + " " + "(Current Role: Coder)";
						option3.text = firstName + " "+ lastName + " " + "(" + username + ")" + " " + "(Current Role: Coder)";
						x.add(option1);
						y.add(option2);
						z.add(option3);

					}
					
					//$('#teamLeaderName').text(results[i].get("username"));

				}
		
			}
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});

	$('#savebutton').click(function() {
		event.preventDefault();

		if( Parse.User.current().get("isTeamLeader") == "true" ) {
		//$('#user-role').text("first if");
		var teamName = Parse.User.current().get("teamName");
		var user1= Parse.Object.extend("User");
		var query1 = new Parse.Query(user1);
		var name = $("#inputname").val();
		query1.equalTo("username", name);
		alert(name);
		query1.find({
			success: function(results) {
				alert(results.length);
				for(var i = 0; i < results.length; i++){
					var object = results[i];
					alert(object.get("RoleinTeam"));
					object.set("RoleinTeam", "Designer");
					alert(object.get("RoleinTeam"));
					object.save(null, {
    					success: function(object) {
        						alert("now go");
    					}
					});
					

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


	
}

$(document).ready(main);

 









