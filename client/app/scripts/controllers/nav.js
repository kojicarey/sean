'use strict';

app.controller('NavCtrl', function ($scope, $location, Auth) {
    $scope.signedIn = Auth.signedIn;
    $scope.logout = Auth.logout;
    $scope.user = Auth.user;

    $scope.post = {url: 'http://', title: ''};

    $scope.submitPost = function () {
        $scope.post.creator = $scope.user.profile.username;
        $scope.post.creatorUID = $scope.user.uid;
        Post.create($scope.post).then(function (ref) {
            $scope.post = {url: 'http://', title: ''};
            $location.path('/posts/' + ref.name());
        });
    };

    $scope.user = Auth.user;

    $scope.signedIn = Auth.signedIn;
    $scope.logout = Auth.logout;
});