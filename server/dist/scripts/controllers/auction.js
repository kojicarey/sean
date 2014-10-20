'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
        .controller('AuctionCtrl', function($scope, $routeParams) {
            var auction = new Firebase("https://itsybid.firebaseio.com/auction/" + $routeParams.param1);
            var bids = new Firebase("https://itsybid.firebaseio.com/auction/" + $routeParams.param1 + "/bids");

            console.log($routeParams);

            var auctionData = {};
            $scope.auction = {};
            $scope.bid = {};
            $scope.open = false; // Disables form until data is loaded

            function updateData() {
                auction.once('value', function(dataSnapshot) {
                    auctionData = dataSnapshot.val();

                    $scope.auction.title = auctionData.title ? auctionData.title : "Auction Title";
                    $scope.auction.description = auctionData.description ? auctionData.description : 'unknown';
                    $scope.auction.currentprice = auctionData.currentprice ? auctionData.currentprice : 0;
                    $scope.auction.highbidder = auctionData.highbidder ? auctionData.highbidder : 'unknown';
                    $scope.auction.endtime = auctionData.endtime ? moment.unix(auctionData.endtime).format('dddd DD MMM, h:mm A') : 'endtime';
                    $scope.auction.timeleft = auctionData.endtime ? moment.unix(auctionData.endtime).fromNow() : 'timeleft';

                    $scope.bid.timestamp = Firebase.ServerValue.TIMESTAMP;
                    $scope.bid.bidder = 'carey';
                    $scope.bid.bidamount = Number($scope.auction.currentprice) === 0 ? 1000 : Math.ceil(Number($scope.auction.currentprice) / 1000) * 1000 + 1000;

                    $scope.open = true;
                    $scope.$apply();
                }
                );
            }
            updateData();

            $scope.submit = function(form) {
                auction.update({currentprice: $scope.bid.bidamount}); //update the auction
                auction.update({highbidder: $scope.bid.bidder}); //update the auction
                bids.push($scope.bid); // write the bid

                updateData();
            };

            $scope.currentprice = function() {
                return $scope.bid.currentPrice;
            }
            ;
        });