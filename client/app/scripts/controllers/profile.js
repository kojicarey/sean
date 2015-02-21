'use strict';

app.controller('ProfileCtrl', ['$scope', '$routeParams', 'Profile', function ($scope, $routeParams, Profile) {
        var uid = $routeParams.userId ? $routeParams.userId : "";
        if (uid) {
            $scope.user = Profile.get(uid);

            Profile.getPosts(uid).then(function (posts) {
                $scope.posts = posts;
            });
        }

        $scope.users = Profile.all();
    }]);