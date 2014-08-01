'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
        .controller('CreateCtrl', ['$scope', 'authservice', function($scope) {
                $(window).on('authenticated', function(event, userData) {
                    console.log(userData);
                    $scope.sellerId = userData.id;
                    $scope.sellerName = userData.displayName;
                    $scope.$apply();
                });

                var auctions = new Firebase('https://itsybid.firebaseio.com/auction');
                $scope.now = new Date().getTime();

                $('.datetimepicker')
                        .on('dp.change', function(event) {
                            $('.help-block .timeleft').text(event.date.fromNow());
                        })
                        .datetimepicker()
                        .data('DateTimePicker')
                        .setMinDate(new Date());

                $scope.submit = function() {
                    var auction = {
                        sellerId: $scope.sellerId,
                        sellerName: $scope.sellerName,
                        title: $scope.title,
                        currentprice: $scope.currentprice,
                        description: $scope.description,
                        endtime: $('.datetimepicker').data('DateTimePicker').date.format('X')
                    };
                    auctions.push(auction);

                    window.location = '/#/auctionlist';
                };
            }]);