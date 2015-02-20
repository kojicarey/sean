'use strict';

app.controller('AuthCtrl', ['$scope', '$location', 'Auth', 'user', function ($scope, $location, Auth, user) {
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
            console.log("$scope.register()");
            Auth.register($scope.user, function callback(error, user) {
                if (error)
                    return $scope.error = error.toString();

                Auth.login($scope.user, function success(authData) {
                    user.username = $scope.user.username;
                    user.uid = authData.uid;
                    user.md5_hash = md5($scope.user.email);
                    Auth.createProfile(user, function () {
                        $location.path('/');
                    });
                }, function error() {
                    $scope.error = error.toString();
                });
            });
        };


    }]);
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