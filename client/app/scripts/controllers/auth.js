'use strict';

app.controller('AuthCtrl', function ($scope, $location, Auth, user) {
    if (user) {
        $location.path('/'); // If a user was resolved, then go back to root
    }

    /**
     * Call this methid to log in a user 
     */
    $scope.login = function () {
        Auth.login($scope.user).then(function () {
            $location.path('/');
        }, function (error) {
            $scope.error = error.toString();
        });
    };

    /**
     * Call this method to register a user
     */
    $scope.register = function () {
        Auth.register($scope.user).then(function (user) {
            return Auth.login($scope.user).then(function () {
                user.username = $scope.user.username;
                return Auth.createProfile(user);
            }).then(function () {
                $location.path('/');
            });
        }, function (error) {
            $scope.error = error.toString();
        });
    };


});
//
//    $scope.login = function () {
//        Auth.login($scope.user).then(function () {
//            $location.path('/');
//        }, function (error) {
//            $scope.error = error.toString();
//        });
//    };
//
//    $scope.register = function () {
//        Auth.register($scope.user).then(function (user) {
//            return Auth.login($scope.user).then(function () {
//                user.username = $scope.user.username;
//                return Auth.createProfile(user);
//            }).then(function () {
//                $location.path('/');
//            });
//        }, function (error) {
//            $scope.error = error.toString();
//        });
//    };
//});