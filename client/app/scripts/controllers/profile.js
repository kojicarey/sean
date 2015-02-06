'use strict';

app.controller('ProfileCtrl', function ($scope, $routeParams, Profile) {
    var uid = $routeParams.userId;

    $scope.user = Profile.get(uid);

    Profile.getPosts(uid).then(function (posts) {
        $scope.posts = posts;
    });
});