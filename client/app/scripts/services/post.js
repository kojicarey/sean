'use strict';
/**
 * Using 3 way data binding
 */
app.factory('Post', ['$firebase', 'FIREBASE_URL', 'Queue', function ($firebase, FIREBASE_URL, Queue) {
        //return $resource('https://gnrl.firebaseIO.com/posts/:id.json'); // :id is an optional parameter. if supplied posts/ID.json, otherwise posts.json

        var ref = new Firebase(FIREBASE_URL); // reference to the firebase repository
        var refPosts = ref.child('auction');
        var refComments = ref.child('comments');
        var refUserPosts = ref.child('user_posts');
        var refWinList = ref.child('win_list');
        var refAuctionQueue = ref.child('auction_queue');
        
        var refZapierQueue = ref.child('zapier_queue');
        
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
            activateAuction: function (auctionId, userName, userId) {
                $firebase(refAuctionQueue).$push(auctionId);
                console.log(auctionId, userName, userId);
                return $firebase(refPosts.child(auctionId)).$update({auctionstatus: 'active', creatorName: userName, creatorUID: userId});
            },
            deActivateAuction: function (auctionId) {
                Queue.deQueue(auctionId);
                return $firebase(refPosts.child(auctionId)).$update({auctionstatus: 'pending', creatorName: null, creatorUID: null});
            },
            closeAuction: function (auction) {
                auction.auctionstatus = 'complete';
                auction.endTime = Firebase.ServerValue.TIMESTAMP;
                //debugger;
                return auction
                        .$save()
                        .then(function (auctionRef) {
                            //debugger;
                            $firebase(refZapierQueue).$asArray().$add(auction);                                                        
                            Queue.deQueue(auction.$id);
                            $firebase(refWinList.child(auction.winningBidderUID))
                                    .$push(auction.$id);
                            return auctionRef;
                        });
            },
            deleteAuction: function (auctionId) {
                Queue.deQueue(auctionId);
                posts.$remove(post);
            },
            create: function (post) {
                post.auctionstatus = 'pending';
                post.winningBidderAmount = post.startPrice;
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
            getList: function (postIdArray) {
                var posts = {};

                for (var i = 0; i < postIdArray.length; i++) { // loop over each post 
                    var value = postIdArray[i].$value;
                    posts[i] = Post.get(value);
                }
                return posts;
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
//            new Firebase(FIREBASE_URL + '/auction').child(auctionId).child('bids').once('value', function (snap) {
//                console.log('I fetched a user!', snap.val());
//                debugger;
//                return snap.val();
//            });
            }
        };
        return Post;
    }]);