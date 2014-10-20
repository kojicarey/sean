app.factory('authservice',
	function($firebase, FIREBASE_URL) {
		var myRef = new Firebase('https://itsybid.firebaseio.com'); 
		var authRef = new Firebase('https://itsybid.firebaseio.com/.info/authenticated');
		var isNewUser = true;

		authRef.on('value', function(snap) {
			if (snap.val() === true) {
				console.log('authenticated');
				console.log(snap.val());
			} else {
				var auth = new FirebaseSimpleLogin(myRef, function(error, user) {
					if (error) {
						window.location = '/';
					} else if (user) {
						if (isNewUser) {
							myRef.child('users').child(user.uid).set({
								displayName: user.displayName,
								provider: user.provider,
								provider_id: user.id
							});
						}
						$(window).triggerHandler('authenticated', user);
					} else {
						auth.login('facebook');
					}
				});
			}
		});
	});