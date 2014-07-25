'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
        .controller('CreateCtrl', function($scope) {
            var auctions = new Firebase("https://itsybid.firebaseio.com/auction");

            $scope.now = new Date().getTime();

            $('.datetimepicker')
                    .on('dp.change', function(event) {
                        $('.help-block .timeleft').text(event.date.fromNow());
                    })
                    .datetimepicker()
                    .data("DateTimePicker")
                    .setMinDate(new Date());

            $scope.submit = function() {
                var test = moment().format($scope.endtime, 'dddd DD MMM, h:mm A');
                
                var auction = {
                    title: $scope.title,
                    currentprice: $scope.currentprice,
                    description: $scope.description,
                    endtime: $('.datetimepicker').data("DateTimePicker").date.format('X')
                };
                var returnVal = auctions.push(auction);
                
                window.location = "/#/auctionlist";
            };
        });