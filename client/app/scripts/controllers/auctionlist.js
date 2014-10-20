'use strict';

app
.controller('AuctionListCtrl', ['$scope', 'Auction', 'authservice', function($scope, Auction, authservice) {
  $scope.auctionList = Auction.$asArray();    // Retrieve the data from Auction & bind to AuctionList
}]);