'use strict';

/**
 * This control takes a postId parameter to retrieve a particular post
 */
app.controller('PostViewCtrl', function ($scope, $routeParams, Post, Auth) {
    $scope.auction = Post.get($routeParams.auctionId); // get the postId from the URL
    $scope.comments = Post.comments($routeParams.auctionId);
    $scope.bids = Post.bids($routeParams.auctionId);

    $scope.user = Auth.user;
    $scope.signedIn = Auth.signedIn;

    $scope.placeBid = function () {
        var bid = {
            bidderName: $scope.user.profile.username,
            bidderId: $scope.user.profile.uid,
            timestamp: Firebase.ServerValue.TIMESTAMP,
            bidamount: $scope.bidamount
        };
        $scope.bids.$add(bid);

        $scope.bidamount = '';
    };

    $scope.topBidArr = Post.topBid($routeParams.auctionId);

    $scope.addComment = function () {
        if (!$scope.commentText || $scope.commentText === '') {
            return; // dont display empty commments
        }

        var comment = {
            text: $scope.commentText,
            creator: $scope.user.profile.username,
            creatorUID: $scope.user.profile.uid
        };
        $scope.comments.$add(comment);

        $scope.commentText = '';
    };

    $scope.deleteComment = function (comment) {
        $scope.comments.$remove(comment);
    };
});

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