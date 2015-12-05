var main = function() {
	Parse.initialize("xnGjRzHyGsIRQu1YYvlKOl6tWUi492IEYRSeJz4v", 
		"eQfDDqUmQPpY85rOVvzFSuqLqeHPBtENaKm9mSoA");

	var currentUser = Parse.User.current();
    if (currentUser) {
        Parse.User.logOut();
    }

	$('#loginbutton').click(function() {

		var username = $('#inputUsername').val();
		var password = $('#inputPassword').val();

		Parse.User.logIn(username, password, {
			success: function(user) {
				$('#inputUsername').val('');
				$('#inputPassword').val('');

				if (Parse.User.current().get("emailVerified") == true)
					{

						var username = Parse.User.current().get("username");
						var Person = Parse.Object.extend("Person");
						var query = new Parse.Query(Person);
						query.equalTo("username", username);
						query.first({
							success: function(result){
								if(result != null) {
									var role = result.get("role");

									if(role == "Admin"){
										window.location = "admin-page.html";
									}

									else if(role == "Leader"){
										window.location = "leader-page.html";
									}
									else if(role == "Member"){
										window.location = "landing-page.html";
									}
								}
								else {
									alert("This user does not exist.");
								}
							},
							error: function(error) {
								alert("Could not log in.");
							}
						});
					}
				else
				{
					window.alert("You must verify your e-mail before you can log in");
				}
			},
			error: function(user, error) {
				alert("Error: " + error.code + " " + error.message);
			}
		});

		return false;
	});


}

$(document).ready(main);









