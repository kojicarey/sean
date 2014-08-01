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
            'ngTouch'
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

app.factory('authservice', function() {
    var myRef = new Firebase('https://itsybid.firebaseio.com'); 
    var authRef = new Firebase('https://itsybid.firebaseio.com/.info/authenticated');
    var isNewUser = true;

    authRef.on('value', function(snap) {
        if (snap.val() === true) {
            console.log('authenticated');
        } else {
            var auth = new FirebaseSimpleLogin(myRef, function(error, user) {
                if (error) {
                    window.location = '/';
                } else if (user) {
                    if (isNewUser) {
                        myRef.child('users').child(user.uid).set({
                            displayName: user.displayName,
                            provider: user.provider,
                            provider_id: user.id
                        });
                    }
                    $(window).triggerHandler('authenticated', user);
                } else {
                    auth.login('facebook');
                }
            });
        }
    });
});