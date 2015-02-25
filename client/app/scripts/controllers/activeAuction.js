'use strict';

/**
 * This control takes a postId parameter to retrieve a particular post
 */
app.controller('ActiveAuctionControl', ['$scope', '$routeParams', 'Post', 'Auth', '$firebase', 'Queue', '$location', function ($scope, $routeParams, Post, Auth, $firebase, Queue, $location) {
        //$scope.auction;

        Queue.all().then(function (queuePostIds) {
            console.log(queuePostIds);
            $scope.queueorder = queuePostIds;
            $scope.queue = Post.getList(queuePostIds);
        });

        Queue.getFirst().then(function (nextAuctionId) {
            $scope.auction = Post.get(nextAuctionId); // get the postId from the URL
            $scope.comments = Post.comments(nextAuctionId);
            $scope.bids = Post.bids(nextAuctionId);

            $scope.placeBid = function (increment) {
                $scope.errorMsg = '';
                if (!!increment) { // quick bid button pushed
                    $scope.bidamount = $scope.currentPrice() + increment;
                }

                if ($scope.bidamount >= ($scope.currentPrice() + 1000)) {
                    var bid = {
                        bidderName: $scope.user.profile.username,
                        bidderId: $scope.user.profile.uid,
                        timestamp: Firebase.ServerValue.TIMESTAMP,
                        bidamount: $scope.bidamount
                    };
                    $scope.bids.$add(bid).then(function (bidRef) {

                        var winningBid = {
                            winningBidder: bid.bidderName,
                            winningBidderUID: bid.bidderId,
                            winningBidderAmount: bid.bidamount,
                            winningBidderBidId: bidRef.name()
                        };
                        //debugger;
                        $firebase(new Firebase('https://itsybid.firebaseio.com/auction/' + nextAuctionId)).$update(winningBid);
                    });

                    $scope.bidamount = '';
                }
                else {
                    $scope.errorMsg = 'Minimum bid is ' + ($scope.currentPrice() + 1000);
                    console.log($scope.errorMsg);
                }
            };

            $scope.activateAuction = function (auctionId, username, uid) {
                Post.activateAuction(auctionId, username, uid).then(function () {
                    $location.path('/auction/' + auctionId);
                });
            }
            ;
            $scope.closeAuction = function (auctionId) {
                Post.closeAuction(auctionId).then(function () {
                    $location.path('/auctions/complete');
                });
            };
            $scope.deActivateAuction = function (auctionId) {
                Post.deActivateAuction(auctionId).then(function () {
                    $location.path('/auctions/pending');
                });
            };
            $scope.deleteAuction = function (auction) {
                Post.deleteAuction(auction);
            };

            $scope.user = Auth.user;
            $scope.signedIn = Auth.signedIn;

            $scope.currentPrice = function () {
                if (!$scope.auction.winningBidder) {
                    //console.log('No winning bidder. So use start amount: ' + $scope.auction.startprice);
                    return $scope.auction.startprice;
                }
                else {
                    //console.log('Found winning bidder:' + $scope.auction.winningBidderAmount);
                    return $scope.auction.winningBidderAmount;
                }
            };
            $scope.addComment = function () {
                if (!$scope.commentText || $scope.commentText === '') {
                    return; // dont display empty commments
                }

                var comment = {
                    text: $scope.commentText,
                    creator: $scope.user.profile.username,
                    creatorUID: $scope.user.profile.uid,
                    timestamp: Firebase.ServerValue.TIMESTAMP
                };
                $scope.comments.$add(comment);
                $scope.commentText = '';
            };
            $scope.deleteComment = function (comment) {
                $scope.comments.$remove(comment);
            };

            $scope.isActive = function () {
                setTimeout(function () {
                    console.log("Checking status every 3 seconds. Currently: " + $scope.auction.auctionstatus);
                    if ($scope.auction.auctionstatus !== 'active') {
                        location.reload();
                    }
                    $scope.isActive();
                }, 3000);
            };
            $scope.isActive();
        });
    }]);
//app.controller('PostViewCtrl', function ($scope, $routeParams, Post, Auth) {
//    $scope.post = Post.get($routeParams.postId);
//    $scope.comments = Post.comments($routeParams.postId);
//
//    $scope.user = Auth.user;
//    $scope.signedIn = Auth.signedIn;
//
//    $scope.addComment = function () {
//        if (!$scope.commentText || $scope.commentText === '') {
//            return;
//        }
//
//        var comment = {
//            text: $scope.commentText,
//            creator: $scope.user.profile.username,
//            creatorUID: $scope.user.uid
//        };
//        $scope.comments.$add(comment);
//
//        $scope.commentText = '';
//    }
//
//    $scope.deleteComment = function (comment) {
//        $scope.comments.$remove(comment);
//    }
//
//});