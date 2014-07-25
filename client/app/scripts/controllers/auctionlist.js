'use strict';

angular.module('clientApp')
        .controller('AuctionListCtrl', function($scope) {
            var auctions = new Firebase("https://itsybid.firebaseio.com/auction");
            $scope.auctionsList = [];

            function updateData() {
                auctions.on('child_added', function(dataSnapshot) {
                    var data = dataSnapshot.val();

                    var auction = {};
                    auction.id = dataSnapshot.name();
                    auction.title = data.title ? data.title : "";
                    auction.description = data.description ? data.description : "";
                    auction.highbidder = data.highbidder ? data.highbidder : "";
                    auction.currentprice = data.currentprice ? data.currentprice : "";
                    auction.endtimestamp = data.endtime ? moment.unix(data.endtime) : "";
                    auction.endtime = data.endtime ? moment.unix(data.endtime).format('dddd DD MMM, h:mm A') : "";
                    auction.timeleft = data.endtime ? moment.unix(data.endtime).fromNow() : "";
                    auction.expiry = new Date().getTime() < auction.endtimestamp ? 'panel-default' : 'panel-warning';

                    $scope.auctionsList.push(auction);
                    $scope.$apply();
                });
                countdown();
            }
            updateData();

            function countdown() {
                for (var i = 0; i < $scope.auctionsList.length; i++) {
                    $scope.auctionsList.timeleft = moment.unix($scope.auctionsList.endtimestamp).fromNow();
                }
                console.log('countdown update');

                if (!$scope.$$phase) { // Don't update scope if still in progress to avoid errors
                    $scope.$apply();
                }
                setTimeout(countdown, 25000);
            }

        });