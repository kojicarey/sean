'use strict';
/** 
 * PostsCtrl
 * 
 * @param global $scope This object contains all the global variables
 * @param $resource Post Created by the Post factory service
 */
app.controller('PostsCtrl', ['$scope', 'Post', 'Auth', 'Helper', '$location', '$routeParams', function ($scope, Post, Auth, Helper, $location, $routeParams) {
        Helper.jQueryDT();

        console.log($routeParams.auctionstatus);

        $scope.posts = Post.all;

        if ($routeParams.auctionstatus === 'won') {
            $scope.filterStatus = 'complete';
        }
        else {
            $scope.filterStatus = $routeParams.auctionstatus;
        }

        $scope.user = Auth.user;

        $scope.deletePost = function (post) {
            Post.delete(post);
        };

        $scope.currentPrice = function (auction) {
            if (!auction.winningBidder) {
                //console.log('No winning bidder. So use start amount: ' + auction.startprice);
                return auction.startprice;
            }
            else {
                //console.log('Found winning bidder:' + auction.winningBidderAmount);
                return auction.winningBidderAmount;
            }
        };

        $scope.timeLeft = function () {
            console.log("Calculating end time");
            console.log(moment($scope.endTime, 'dddd DD MMM, h:mm A').fromNow());
            $scope.timeLeftString = moment($scope.endTime, 'dddd DD MMM, h:mm A').fromNow();
        };

        $scope.activateAuction = function (auctionId) {
            console.log("Activating Auction via Posts Controller");
            Post.activateAuction(auctionId, Auth.user.profile.username, Auth.user.profile.uid).then(function () {
                $location.path('/activeAuction');
            });
        }
        ;
        $scope.closeAuction = function (auction) {
            Post.closeAuction(auction).then(function () {
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

        $scope.createAuction = function () {
            var post = {
                title: $scope.title,
                description: $scope.description,
                creatorUID: $scope.user.profile.uid,
                creatorName: $scope.user.profile.username,
                createTime: Firebase.ServerValue.TIMESTAMP,
                startPrice: $scope.startPrice,
                status: 'pending',
                club: $scope.club,
                position: {
                    fullback: !!$scope.position.fullback,
                    wing: !!$scope.position.wing,
                    centre: !!$scope.position.centre,
                    halfback: !!$scope.position.halfback,
                    hooker: !!$scope.position.hooker,
                    backrow: !!$scope.position.backrow,
                    prop: !!$scope.position.prop,
                    goalkick: !!$scope.position.goalkick
                },
                endTime: moment($scope.endTime, 'dddd DD MMM, h:mm A').unix() * 100 //Firebase uses milliseconds offset, but we want to round to seconds
            };
            Post.create(post).then(function (ref) {
                $location.path('/auction/' + ref.name());
            });

            $scope.commentText = '';
        };
    }]);
