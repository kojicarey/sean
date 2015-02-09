'use strict';
/**
 * Using 3 way data binding
 */
app.factory('Helper', ['$window', function ($window) {
        var Helper = {
            jQueryDT: function () {
                jQuery('.datetimepicker').datetimepicker({
                    'minDate': moment().add(1, 'minute'),
                    'defaultDate': moment().add(1, 'hour').minutes(0),
                    'sideBySide': true,
                    'stepping': 15,
                    'useCurrent': false
                });
            }
        };
        return Helper;
    }]);
//app.factory('Post', function ($firebase, FIREBASE_URL) {
//    var ref = new Firebase(FIREBASE_URL);
//    var posts = $firebase(ref.child('posts')).$asArray();
//
//    var Post = {
//        all: posts,
//        create: function (post) {
//            return posts.$add(post).then(function (postRef) {
//                $firebase(ref.child('user_posts').child(post.creatorUID)).$push(postRef.name());
//
//                return postRef;
//            });
//        },
//        get: function (auctionId) {
//            return $firebase(ref.child('posts').child(auctionId)).$asObject();
//        },
//        delete: function (post) {
//            return posts.$remove(post);
//        },
//        comments: function (auctionId) {
//            return $firebase(ref.child('comments').child(auctionId)).$asArray();
//        }
//    };
//
//    return Post;
//});