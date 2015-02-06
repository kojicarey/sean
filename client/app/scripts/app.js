'use strict';
/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */


/* global app:true */
var app = angular
        .module('clientApp', [
            'ngAnimate',
            'ngCookies',
            'ngResource',
            'ngRoute',
            'ngSanitize',
            'ngTouch',
            'firebase'
        ]);

app.constant('FIREBASE_URL', 'https://itsybid.firebaseio.com/');

app.config(function ($routeProvider) {
    $routeProvider
            .when('/', {
                templateUrl: 'views/landing.html',
                controller: 'PostsCtrl'
            })
            .when('/auctions', {
                templateUrl: 'views/auctions.html',
                controller: 'PostsCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: 'AuthCtrl',
                resolve: {
                    user: function (Auth) { // Do it this way, to ensure auth is resolved before content is displayed
                        return Auth.resolveUser();
                    }
                }
            })
            .when('/auction/:auctionId', {
                templateUrl: 'views/auction.html',
                controller: 'PostViewCtrl',
                resolve: {
                    user: function (Auth) { // Do it this way, to ensure auth is resolved before content is displayed
                        return Auth.resolveUser();
                    }
                }
            })
            .when('/users/:userId', {
                templateUrl: 'views/profile.html',
                controller: 'ProfileCtrl',
                resolve: {
                    user: function (Auth) { // Do it this way, to ensure auth is resolved before content is displayed
                        return Auth.resolveUser();
                    }
                }
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'AuthCtrl',
                resolve: {
                    user: function (Auth) { // Do it this way, to ensure auth is resolved before content is displayed
                        return Auth.resolveUser();
                    }
                }
            })
            .otherwise({
                redirectTo: '/'
            });
});

app.filter('dateFormatter', function () {
    return function (unformattedDate, emptyStrText) {
        var formattedDate = moment.unix(unformattedDate).format('dddd DD MMM, h:mm A');
        if (formattedDate === "" && emptyStrText) {
            formattedDate = emptyStrText;
        }
        return formattedDate;
    };
});
app.filter('dateFromNow', function () {
    return function (unformattedDate, emptyStrText) {
        var formattedDate = moment.unix(unformattedDate).fromNow();
        if (formattedDate === "" && emptyStrText) {
            formattedDate = emptyStrText;
        }
        return formattedDate;
    };
});
app.filter('commaThousands', function () {
    return function (inputNumber, emptyStrText) {
        var formattedNumber = inputNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (formattedNumber === "" && emptyStrText) {
            formattedNumber = emptyStrText;
        }
        return formattedNumber;
    };
});
app.filter('capitaliseFirstLetter', function () {
    return function (inputString, emptyStrText) {
        if (inputString) {
            var formattedString = inputString.charAt(0).toUpperCase() + inputString.slice(1);
            if (formattedString === "" && emptyStrText) {
                formattedString = emptyStrText;
            }

            return formattedString;
        }
        else {
            return "";
        }
    };
});