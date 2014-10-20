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

 app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
    })
    .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
    })
    .when('/create', {
        templateUrl: 'views/create.html',
        controller: 'CreateCtrl'
    })
    .when('/auction/:param1', {
        templateUrl: 'views/auction.html',
        controller: 'AuctionCtrl'
    })
    .when('/auctionlist', {
        templateUrl: 'views/auctionlist.html',
        controller: 'AuctionListCtrl'
    })
    .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
});

 app.filter('dateFormatter', function() {               
     return function(unformattedDate, emptyStrText) { 
        var formattedDate = moment.unix(unformattedDate).format('dddd DD MMM, h:mm A');
        if(formattedDate === "" && emptyStrText) {
            formattedDate = emptyStrText;
        }
        return formattedDate;
    }
});
 app.filter('dateFromNow', function() {               
     return function(unformattedDate, emptyStrText) { 
        var formattedDate = moment.unix(unformattedDate).fromNow();
        if(formattedDate === "" && emptyStrText) {
            formattedDate = emptyStrText;
        }
        return formattedDate;
    }
});
 app.filter('commaThousands', function() {               
     return function(inputNumber, emptyStrText) { 
        var formattedNumber = inputNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if(formattedNumber === "" && emptyStrText) {
            formattedNumber = emptyStrText;
        }
        return formattedNumber;
    }
});
 app.filter('capitaliseFirstLetter', function() {               
    return function(inputString, emptyStrText) { 
        if(inputString) {
            var formattedString = inputString.charAt(0).toUpperCase() + inputString.slice(1);
            if(formattedString === "" && emptyStrText) {
                formattedString = emptyStrText;
            }

            return formattedString;
        }
        else {
            return "";
        }
        
    }
});


 app.constant('FIREBASE_URL', 'https://itsybid.firebaseio.com/');
