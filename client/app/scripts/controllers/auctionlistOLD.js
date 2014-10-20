'use strict';

app.controller('AuctionListCtrl', ['$scope', 'Auction', '$firebase', 'FIREBASE_URL', 'authservice', function($scope, Auction, $firebase, FIREBASE_URL) {

    var TestAuctionRef = $firebase(new Firebase('https://itsybid.firebaseio.com/auction');
        var TestAuction = TestAuctionRef.$asObject();

        TestAuction.$bindTo($scope, "data");

        console.log($scope);

//        Auction.$bind($scope.auctions, "auctions");

console.group('Auction details');
console.log(Auction);
console.groupEnd();


$(window).on('authenticated', function(event, userData) {
    console.log(userData);
});

/*
function updateData() {
auctions.on('child_added', function(dataSnapshot) {
var data = dataSnapshot.val();

var auction = {
};
auction.id = dataSnapshot.name();
auction.title = data.title ? data.title : '';
auction.description = data.description ? data.description : '';
auction.highbidder = data.highbidder ? data.highbidder : '';
auction.currentprice = data.currentprice ? data.currentprice : '';
auction.endtimestamp = data.endtime ? data.endtime : '';
auction.endtime = data.endtime ? moment.unix(data.endtime).format('dddd DD MMM, h:mm A') : '';
auction.timeleft = data.endtime ? moment.unix(data.endtime).fromNow() : '';
auction.expiry = new Date().getTime() < auction.endtimestamp * 1000 ? 'panel-default' : 'panel-warning';
auction.seller = data.sellerName ? data.sellerName : '';

$scope.auctions.push(auction);
$scope.$apply();
});
countdown();
}
updateData();
*/

function countdown() {
    for (var i = 0; i < $scope.auctions.length; i++) {
        $scope.auctions.timeleft = moment.unix($scope.auctions.endtimestamp).fromNow();
    }
    console.log('countdown update');

if (!$scope.$$phase) { // Don't update scope if still in progress to avoid errors
    $scope.$apply();
}
setTimeout(countdown, 25000);
}
}]);