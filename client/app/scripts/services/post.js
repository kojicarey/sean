'use strict';
/**
 * Using 3 way data binding
 */
app.factory('Post', function ($firebase, FIREBASE_URL) {
    //return $resource('https://gnrl.firebaseIO.com/posts/:id.json'); // :id is an optional parameter. if supplied posts/ID.json, otherwise posts.json

    var ref = new Firebase(FIREBASE_URL); // reference to the firebase repository
    var refPosts = ref.child('auction');
    var refComments = ref.child('comments');
    var refUserPosts = ref.child('user_posts');
    var posts = $firebase(refPosts).$asArray(); // pass reference into $firebase, which provdes wrapper helper functions

    var Post = {
        /** 
         * Retrieves all post objects (as firebase)
         */
        all: posts,
        /**
         * Create a new post and add it to the repository
         * @param {type} post
         * @returns {undefined}
         */
        create: function (post) {
            return posts
                    .$add(post)
                    .then(function (postRef) {
                        $firebase(refUserPosts.child(post.creatorUID))
                                .$push(postRef.name());
                        return postRef;
                    });
        },
        /**
         * Gets the post object matching the supplied PostId (e.g. firebase ID)
         * @param auctionId auctionId
         * @returns $asObject
         */
        get: function (auctionId) {
            console.log("Post.get(" + auctionId + ")");
            return $firebase(refPosts.child(auctionId)).$asObject();
        },
        /**
         * Delete post object from firebase
         * @param post Firebase Post Object to delete
         * @returns {undefined}
         */
        delete: function (post) {
            posts.$remove(post);
        },
        comments: function (auctionId) {
            return $firebase(refComments.child(auctionId)).$asArray();
        },
        bids: function (auctionId) {
            return $firebase(refPosts.child(auctionId).child('bids')).$asArray().reverse();
        },
        topBid: function (auctionId) {
            return $firebase(refPosts.child(auctionId).child('bids').limit(1)).$asArray();
        }
    };
    return Post;
});
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