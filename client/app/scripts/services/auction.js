app.factory('Auction',
	function($firebase, FIREBASE_URL) {
		var auctions = $firebase(new Firebase(FIREBASE_URL + 'auction'));

		return auctions;
	});