'use strict';

app.factory('Profile', ['$window', 'FIREBASE_URL', '$firebase', 'Post', '$q', function ($window, FIREBASE_URL, $firebase, Post, $q) {
        var ref = new $window.Firebase(FIREBASE_URL);
        var profileRef = ref.child('profile');
        var winListRef = ref.child('win_list');

        var profile = {
            /**
             * Get the user by userid
             */
            get: function (userId) {
                console.log("profile.get(" + userId + ")");
                return $firebase(profileRef.child(userId)).$asObject();
            },
            all: function () {
                console.log("profile.all()");
                return $firebase(profileRef).$asArray();
            },
            /**
             * Get all posts for a specified userId
             */
            getPosts: function (userId) {
                var defer = $q.defer();

                $firebase(winListRef.child(userId)) // get all user posts
                        .$asArray() // as an array
                        .$loaded() // wait until loaded
                        .then(function (data) { // then 
                            var posts = {};

                            for (var i = 0; i < data.length; i++) { // loop over each post 
                                var value = data[i].$value;
                                posts[value] = Post.get(value);
                            }
                            defer.resolve(posts);
                        });

                return defer.promise;
            }
        };

        return profile;
    }]);

//app.factory('Profile', function ($window, FIREBASE_URL, $firebase, Post, $q) {
//  var ref = new $window.Firebase(FIREBASE_URL);
//
//  var profile = {
//    get: function (userId) {
//      return $firebase(ref.child('profile').child(userId)).$asObject();
//    },
//    getPosts: function(userId) {
//      var defer = $q.defer();
//
//      $firebase(ref.child('user_posts').child(userId))
//        .$asArray()
//        .$loaded()
//        .then(function(data) {
//          var posts = {};
//
//          for(var i = 0; i<data.length; i++) {
//            var value = data[i].$value;
//            posts[value] = Post.get(value);
//          }
//          defer.resolve(posts);
//        });
//
//      return defer.promise;
//    }
//  };
//
//  return profile;
//});