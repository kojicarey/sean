'use strict';

app.factory('AuctionListService', function($resource) {
    return $resource('https://itsybid.firebaseio.com/auction/.json');
});