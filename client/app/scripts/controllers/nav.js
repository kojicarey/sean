'use strict';

app.controller('NavCtrl', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {
        $scope.signedIn = Auth.signedIn;
        $scope.logout = Auth.logout;
        $scope.auth = Auth;

        $scope.post = {url: 'http://', title: ''};

        $scope.submitPost = function () {
            $scope.post.creator = $scope.auth.user.profile.username;
            $scope.post.creatorUID = $scope.auth.user.uid;
            Post.create($scope.post).then(function (ref) {
                $scope.post = {url: 'http://', title: ''};
                $location.path('/posts/' + ref.name());
            });
        };

        $scope.signedIn = Auth.signedIn;
        $scope.logout = Auth.logout;
    }]);