'use strict';
/** 
 * PostsCtrl
 * 
 * @param global $scope This object contains all the global variables
 * @param $resource Post Created by the Post factory service
 */
app.controller('PostsCtrl', function ($scope, Post, Auth) {
    $scope.posts = Post.all;

    $scope.user = Auth.user;

    $scope.deletePost = function (post) {
        Post.delete(post);
    };
});