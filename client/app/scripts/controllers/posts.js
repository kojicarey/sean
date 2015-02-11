'use strict';
/** 
 * PostsCtrl
 * 
 * @param global $scope This object contains all the global variables
 * @param $resource Post Created by the Post factory service
 */
app.controller('PostsCtrl', ['$scope', 'Post', 'Auth', 'Helper', '$location', '$routeParams', function ($scope, Post, Auth, Helper, $location, $routeParams) {
        if (!!$routeParams.auctionStatus) {
            $scope.posts = Post.auctionStatus($routeParams.auctionStatus);
        }
        else {
            $scope.posts = Post.all;
        }

        $scope.user = Auth.user;

        $scope.deletePost = function (post) {
            Post.delete(post);
        };

        $scope.timeLeft = function () {
            console.log("Calculating end time");
            console.log(moment($scope.endTime, 'dddd DD MMM, h:mm A').fromNow());
            $scope.timeLeftString = moment($scope.endTime, 'dddd DD MMM, h:mm A').fromNow();
        };

        Helper.jQueryDT();


        $scope.createAuction = function () {
            var post = {
                title: $scope.title,
                description: $scope.description,
                creatorUID: $scope.user.profile.uid,
                creatorName: $scope.user.profile.username,
                createTime: Firebase.ServerValue.TIMESTAMP,
                startPrice: $scope.startPrice,
                status: 'pending',
                endTime: moment($scope.endTime, 'dddd DD MMM, h:mm A').unix() * 100 //Firebase uses milliseconds offset, but we want to round to seconds
            };
            Post.create(post).then(function (ref) {
                $location.path('/auction/' + ref.name());
            });

            $scope.commentText = '';
        };
    }]);