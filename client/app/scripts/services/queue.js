'use strict';

app.factory('Queue', ['$window', 'FIREBASE_URL', '$firebase', '$q', function ($window, FIREBASE_URL, $firebase, $q) {
        var ref = new $window.Firebase(FIREBASE_URL);
        var queueRef = ref.child('auction_queue');

        var queue = {
            deQueue: function (auctionId) {
                var defer = $q.defer();
                console.log('queue.deQueue()');
                $firebase(queueRef) // get all user posts
                        .$asArray() // as an array
                        .$loaded() // wait until loaded
                        .then(function (data) { // then 
                            var posts = {};

                            for (var i = 0; i < data.length; i++) { // loop over each post 
                                var value = data[i].$value;
                                if (value === auctionId) {
                                    console.log("Deleting " + value + "from queue, id: " + data[i].$id);
                                    $firebase(queueRef.child(data[i].$id)).$remove();
                                }
                            }
                            defer.resolve(posts);
                        });
                return defer.promise;
            },
            getFirst: function () {
                var defer = $q.defer();
                console.log("Queue.getFirst(): retrieving next in queue");
                $firebase(queueRef) // get all user posts
                        .$asArray() // as an array
                        .$loaded() // wait until loaded
                        .then(function (data) { // then 
                            if (data[0]) {
                                console.log("Queue.getFirst(): promised content");
                                defer.resolve(data[0].$value);
                            }
                            else {
                            }
                        });
                console.log("Queue.getFirst(): sending promise");
                return defer.promise;
            },
            all: function () {
                var defer = $q.defer();
                console.log("Queue.all(): returning entire queue");
                $firebase(queueRef) // get all user posts
                        .$asArray() // as an array
                        .$loaded() // wait until loaded
                        .then(function (data) { // then 
                            console.log("Queue.all(): promised content");
                            defer.resolve(data);
                        });
                console.log("sending promise");
                return defer.promise;
            }
        };

        return queue;
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