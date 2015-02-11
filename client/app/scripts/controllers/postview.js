'use strict';

/**
 * This control takes a postId parameter to retrieve a particular post
 */
app.controller('PostViewCtrl', ['$scope', '$routeParams', 'Post', 'Auth', '$firebase', function ($scope, $routeParams, Post, Auth, $firebase) {
        $scope.auction = Post.get($routeParams.auctionId); // get the postId from the URL
        $scope.comments = Post.comments($routeParams.auctionId);
        $scope.bids = Post.bids($routeParams.auctionId);
        $scope.user = Auth.user;
        $scope.signedIn = Auth.signedIn;
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
                    $firebase(new Firebase('https://itsybid.firebaseio.com/auction/' + $routeParams.auctionId)).$update(winningBid);
                });

                $scope.bidamount = '';
            }
            else {
                $scope.errorMsg = 'Minimum bid is ' + ($scope.currentPrice() + 1000);
                console.log($scope.errorMsg);
            }
        };
        $scope.currentPrice = function () {

            if (!$scope.auction.winningBidder) {
                console.log('No winning bidder. So use start amount: ' + $scope.auction.startPrice);
                return $scope.auction.startPrice;
            }
            else {
                console.log('Found winning bidder:' + $scope.auction.winningBidderAmount);
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