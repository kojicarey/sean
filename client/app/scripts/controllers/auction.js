'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
        .controller('AuctionCtrl', ['$scope', '$routeParams', 'authservice', function($scope, $routeParams) {
                var auction = new Firebase('https://itsybid.firebaseio.com/auction/' + $routeParams.param1);
                var bids = new Firebase('https://itsybid.firebaseio.com/auction/' + $routeParams.param1 + '/bids');
                var comments = new Firebase('https://itsybid.firebaseio.com/auction/' + $routeParams.param1 + '/comments');

                console.log($routeParams);
                
                console.log($routeParams);

                var auctionData = {};
                $scope.auction = {};
                $scope.bid = {};
                $scope.newComment = {};
                $scope.open = false; // Disables form until data is loaded

                $scope.commentsList = [];


                $(window).on('authenticated', function(event, userData) {
                    console.log(userData);
                    $scope.bid.bidderId = userData.id;
                    $scope.bid.bidderName = userData.displayName;
                    $scope.$apply();
                });

                auction.on('value', function(dataSnapshot) {
                    auctionData = dataSnapshot.val();

                    $scope.auction.title = auctionData.title ? auctionData.title : 'Auction Title';
                    $scope.auction.description = auctionData.description ? auctionData.description : '';
                    $scope.auction.currentprice = auctionData.currentprice ? auctionData.currentprice : 0;
                    $scope.auction.highbidder = auctionData.highbidder ? auctionData.highbidder : 'No bidders yet';
                    $scope.auction.endtime = auctionData.endtime ? moment.unix(auctionData.endtime).format('dddd DD MMM, h:mm A') : 'endtime';
                    $scope.auction.timeleft = auctionData.endtime ? moment.unix(auctionData.endtime).fromNow() : 'timeleft';
                    $scope.auction.sellerName = auctionData.sellerName ? auctionData.sellerName : 'Anonymous';

                    $scope.bid.timestamp = Firebase.ServerValue.TIMESTAMP;
                    $scope.bid.bidamount = Number($scope.auction.currentprice) === 0 ? 1000 : Math.ceil(Number($scope.auction.currentprice) / 1000) * 1000 + 1000;

                    $scope.open = true;
                    function applyCheck() {
                        if (!$scope.$$phase) { // Don't update scope if still in progress to avoid errors
                            $scope.$apply();
                        }
                        else {
                            setTimeout(applyCheck, 1000);
                        }
                    }
                    setTimeout(applyCheck, 1000);
                });

                /**
                 * Update auction with the bid amount from the form, and the currently logged in user's name
                 * @returns string Bid ID
                 */
                $scope.submit = function() {
                    auction.update({currentprice: $scope.bid.bidamount});
                    auction.update({highbidder: $scope.bid.bidderName}); //update the auction
                    return bids.push($scope.bid); // write the bid
                };

                $scope.currentprice = function() {
                    return $scope.bid.currentPrice;
                };

                /**
                 * Listens for new comments
                 */
                comments.on('child_added', function(dataSnapshot) {
                    var commentData = dataSnapshot.val();
                    $scope.commentsList.push({'username': commentData.username, 'copy': commentData.copy, 'timestamp': commentData.timestamp});
                });

                /**
                 * Post the new comment 
                 */
                $scope.postComment = function() {
                    var comment = {
                        username: $scope.bid.bidderName,
                        copy: $scope.newComment.copy,
                        timestamp: Firebase.ServerValue.TIMESTAMP
                    };
                    comments.push(comment);
                };
            }]);