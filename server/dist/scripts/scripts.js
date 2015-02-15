'use strict';
/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
/* global app:true */
var app = angular.module('clientApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase'
  ]);
app.constant('FIREBASE_URL', 'https://itsybid.firebaseio.com/');
app.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/landing.html',
      controller: 'PostsCtrl'
    }).when('/auctions/:auctionStatus', {
      templateUrl: 'views/auctions.html',
      controller: 'PostsCtrl'
    }).when('/about', { templateUrl: 'views/about.html' }).when('/register', {
      templateUrl: 'views/register.html',
      controller: 'AuthCtrl',
      resolve: {
        user: function (Auth) {
          // Do it this way, to ensure auth is resolved before content is displayed
          return Auth.resolveUser();
        }
      }
    }).when('/create', {
      templateUrl: 'views/create.html',
      controller: 'PostsCtrl',
      resolve: {
        user: function (Auth) {
          // Do it this way, to ensure auth is resolved before content is displayed
          return Auth.resolveUser();
        }
      }
    }).when('/activeAuction', {
      templateUrl: 'views/auction.html',
      controller: 'ActiveAuctionControl',
      resolve: {
        user: function (Auth) {
          // Do it this way, to ensure auth is resolved before content is displayed
          return Auth.resolveUser();
        }
      }
    }).when('/auction/:auctionId', {
      templateUrl: 'views/auction.html',
      controller: 'PostViewCtrl',
      resolve: {
        user: function (Auth) {
          // Do it this way, to ensure auth is resolved before content is displayed
          return Auth.resolveUser();
        }
      }
    }).when('/users/:userId', {
      templateUrl: 'views/profile.html',
      controller: 'ProfileCtrl',
      resolve: {
        user: function (Auth) {
          // Do it this way, to ensure auth is resolved before content is displayed
          return Auth.resolveUser();
        }
      }
    }).when('/login', {
      templateUrl: 'views/login.html',
      controller: 'AuthCtrl',
      resolve: {
        user: function (Auth) {
          // Do it this way, to ensure auth is resolved before content is displayed
          return Auth.resolveUser();
        }
      }
    }).otherwise({ redirectTo: '/' });
  }
]);
'use strict';
/** 
 * PostsCtrl
 * 
 * @param global $scope This object contains all the global variables
 * @param $resource Post Created by the Post factory service
 */
app.controller('PostsCtrl', [
  '$scope',
  'Post',
  'Auth',
  'Helper',
  '$location',
  '$routeParams',
  function ($scope, Post, Auth, Helper, $location, $routeParams) {
    Helper.jQueryDT();
    $scope.posts = Post.all;
    if ($routeParams.auctionStatus === 'won') {
      $scope.filterStatus = 'complete';
      $scope.posts = Post.all;
    } else {
      $scope.filterStatus = $routeParams.auctionStatus;
    }
    $scope.user = Auth.user;
    $scope.deletePost = function (post) {
      Post.delete(post);
    };
    $scope.currentPrice = function (auction) {
      if (!auction.winningBidder) {
        console.log('No winning bidder. So use start amount: ' + auction.startPrice);
        return auction.startPrice;
      } else {
        console.log('Found winning bidder:' + auction.winningBidderAmount);
        return auction.winningBidderAmount;
      }
    };
    $scope.timeLeft = function () {
      console.log('Calculating end time');
      console.log(moment($scope.endTime, 'dddd DD MMM, h:mm A').fromNow());
      $scope.timeLeftString = moment($scope.endTime, 'dddd DD MMM, h:mm A').fromNow();
    };
    $scope.activateAuction = function (auctionId, username, uid) {
      Post.activateAuction(auctionId, username, uid).then(function () {
        $location.path('/activeAuction');
      });
    };
    ;
    $scope.closeAuction = function (auction) {
      Post.closeAuction(auction).then(function () {
        $location.path('/auctions/complete');
      });
    };
    $scope.deActivateAuction = function (auctionId) {
      Post.deActivateAuction(auctionId).then(function () {
        $location.path('/auctions/pending');
      });
    };
    $scope.deleteAuction = function (auction) {
      Post.deleteAuction(auction);
    };
    $scope.createAuction = function () {
      var post = {
          title: $scope.title,
          description: $scope.description,
          creatorUID: $scope.user.profile.uid,
          creatorName: $scope.user.profile.username,
          createTime: Firebase.ServerValue.TIMESTAMP,
          startPrice: $scope.startPrice,
          status: 'pending',
          club: $scope.club,
          position: {
            fullback: !!$scope.position.fullback,
            wing: !!$scope.position.wing,
            centre: !!$scope.position.centre,
            halfback: !!$scope.position.halfback,
            hooker: !!$scope.position.hooker,
            backrow: !!$scope.position.backrow,
            prop: !!$scope.position.prop,
            goalkick: !!$scope.position.goalkick
          },
          endTime: moment($scope.endTime, 'dddd DD MMM, h:mm A').unix() * 100
        };
      Post.create(post).then(function (ref) {
        $location.path('/auction/' + ref.name());
      });
      $scope.commentText = '';
    };
  }
]);
'use strict';
/**
 * This control takes a postId parameter to retrieve a particular post
 */
app.controller('PostViewCtrl', [
  '$scope',
  '$routeParams',
  'Post',
  'Auth',
  '$firebase',
  '$location',
  function ($scope, $routeParams, Post, Auth, $firebase, $location) {
    $scope.auction = Post.get($routeParams.auctionId);
    // get the postId from the URL
    $scope.comments = Post.comments($routeParams.auctionId);
    $scope.bids = Post.bids($routeParams.auctionId);
    $scope.user = Auth.user;
    $scope.signedIn = Auth.signedIn;
    $scope.placeBid = function (increment) {
      $scope.errorMsg = '';
      if (!!increment) {
        // quick bid button pushed
        $scope.bidamount = $scope.currentPrice() + increment;
      }
      if ($scope.bidamount >= $scope.currentPrice() + 1000) {
        var bid = {
            bidderName: $scope.user.profile.username,
            bidderId: $scope.user.profile.uid,
            timestamp: Firebase.ServerValue.TIMESTAMP,
            bidamount: $scope.bidamount
          };
        $scope.bids.$add(bid).then(function (bidRef) {
          var winningBid = {
              winningBidder: bid.bidderName,
              winningBidderUID: bid.bidderId,
              winningBidderAmount: bid.bidamount,
              winningBidderBidId: bidRef.name()
            };
          //debugger;
          $firebase(new Firebase('https://itsybid.firebaseio.com/auction/' + $routeParams.auctionId)).$update(winningBid);
        });
        $scope.bidamount = '';
      } else {
        $scope.errorMsg = 'Minimum bid is ' + ($scope.currentPrice() + 1000);
        console.log($scope.errorMsg);
      }
    };
    $scope.activateAuction = function (auctionId, username, uid) {
      Post.activateAuction(auctionId, Auth.user.profile.username, Auth.user.profile.uid).then(function () {
        $location.path('/auction/' + auctionId);
      });
    };
    $scope.closeAuction = function (auctionId) {
      debugger;
      Post.closeAuction(auctionId).then(function () {
        $location.path('/auctions/complete');
      });
    };
    $scope.deActivateAuction = function (auctionId) {
      Post.deActivateAuction(auctionId).then(function () {
        $location.path('/auctions/pending');
      });
    };
    $scope.deleteAuction = function (auction) {
      Post.delete(auction);
    };
    $scope.currentPrice = function () {
      if (!$scope.auction.winningBidder) {
        console.log('No winning bidder. So use start amount: ' + $scope.auction.startPrice);
        return $scope.auction.startPrice;
      } else {
        console.log('Found winning bidder:' + $scope.auction.winningBidderAmount);
        return $scope.auction.winningBidderAmount;
      }
    };
    $scope.addComment = function () {
      if (!$scope.commentText || $scope.commentText === '') {
        return;  // dont display empty commments
      }
      var comment = {
          text: $scope.commentText,
          creator: $scope.user.profile.username,
          creatorUID: $scope.user.profile.uid,
          timestamp: Firebase.ServerValue.TIMESTAMP
        };
      $scope.comments.$add(comment);
      $scope.commentText = '';
    };
    $scope.deleteComment = function (comment) {
      $scope.comments.$remove(comment);
    };
  }
]);
//app.controller('PostViewCtrl', function ($scope, $routeParams, Post, Auth) {
//    $scope.post = Post.get($routeParams.postId);
//    $scope.comments = Post.comments($routeParams.postId);
//
//    $scope.user = Auth.user;
//    $scope.signedIn = Auth.signedIn;
//
//    $scope.addComment = function () {
//        if (!$scope.commentText || $scope.commentText === '') {
//            return;
//        }
//
//        var comment = {
//            text: $scope.commentText,
//            creator: $scope.user.profile.username,
//            creatorUID: $scope.user.uid
//        };
//        $scope.comments.$add(comment);
//
//        $scope.commentText = '';
//    }
//
//    $scope.deleteComment = function (comment) {
//        $scope.comments.$remove(comment);
//    }
//
//});
'use strict';
app.controller('NavCtrl', [
  '$scope',
  '$location',
  'Auth',
  function ($scope, $location, Auth) {
    $scope.signedIn = Auth.signedIn;
    $scope.logout = Auth.logout;
    $scope.auth = Auth;
    $scope.post = {
      url: 'http://',
      title: ''
    };
    $scope.submitPost = function () {
      $scope.post.creator = $scope.auth.user.profile.username;
      $scope.post.creatorUID = $scope.auth.user.uid;
      Post.create($scope.post).then(function (ref) {
        $scope.post = {
          url: 'http://',
          title: ''
        };
        $location.path('/posts/' + ref.name());
      });
    };
    $scope.signedIn = Auth.signedIn;
    $scope.logout = Auth.logout;
  }
]);
'use strict';
app.controller('AuthCtrl', [
  '$scope',
  '$location',
  'Auth',
  'user',
  function ($scope, $location, Auth, user) {
    if (user) {
      $location.path('/');  // If a user was resolved, then go back to root
    }
    /**
         * Call this methid to log in a user 
         */
    $scope.login = function () {
      Auth.login($scope.user).then(function () {
        $location.path('/');
      }, function (error) {
        $scope.error = error.toString();
      });
    };
    /**
         * Call this method to register a user
         */
    $scope.register = function () {
      Auth.register($scope.user, function (error, user) {
        if (error)
          return $scope.error = error.toString();
        Auth.login($scope.user, function () {
          user.username = $scope.user.username;
          Auth.createProfile(user, function () {
            $location.path('/');
          });
        });
      });
    };
  }
]);
//
//    $scope.login = function () {
//        Auth.login($scope.user).then(function () {
//            $location.path('/');
//        }, function (error) {
//            $scope.error = error.toString();
//        });
//    };
//
//    $scope.register = function () {
//        Auth.register($scope.user).then(function (user) {
//            return Auth.login($scope.user).then(function () {
//                user.username = $scope.user.username;
//                return Auth.createProfile(user);
//            }).then(function () {
//                $location.path('/');
//            });
//        }, function (error) {
//            $scope.error = error.toString();
//        });
//    };
//});
'use strict';
app.controller('ProfileCtrl', [
  '$scope',
  '$routeParams',
  'Profile',
  function ($scope, $routeParams, Profile) {
    var uid = $routeParams.userId;
    $scope.user = Profile.get(uid);
    Profile.getPosts(uid).then(function (posts) {
      $scope.posts = posts;
    });
  }
]);
'use strict';
/**
 * This control takes a postId parameter to retrieve a particular post
 */
app.controller('ActiveAuctionControl', [
  '$scope',
  '$routeParams',
  'Post',
  'Auth',
  '$firebase',
  'Queue',
  '$location',
  function ($scope, $routeParams, Post, Auth, $firebase, Queue, $location) {
    //$scope.auction;
    Queue.getQueue().then(function (nextAuctionId) {
      $scope.auction = Post.get(nextAuctionId);
      // get the postId from the URL
      $scope.comments = Post.comments(nextAuctionId);
      $scope.bids = Post.bids(nextAuctionId);
      $scope.placeBid = function (increment) {
        $scope.errorMsg = '';
        if (!!increment) {
          // quick bid button pushed
          $scope.bidamount = $scope.currentPrice() + increment;
        }
        if ($scope.bidamount >= $scope.currentPrice() + 1000) {
          var bid = {
              bidderName: $scope.user.profile.username,
              bidderId: $scope.user.profile.uid,
              timestamp: Firebase.ServerValue.TIMESTAMP,
              bidamount: $scope.bidamount
            };
          $scope.bids.$add(bid).then(function (bidRef) {
            var winningBid = {
                winningBidder: bid.bidderName,
                winningBidderUID: bid.bidderId,
                winningBidderAmount: bid.bidamount,
                winningBidderBidId: bidRef.name()
              };
            //debugger;
            $firebase(new Firebase('https://itsybid.firebaseio.com/auction/' + nextAuctionId)).$update(winningBid);
          });
          $scope.bidamount = '';
        } else {
          $scope.errorMsg = 'Minimum bid is ' + ($scope.currentPrice() + 1000);
          console.log($scope.errorMsg);
        }
      };
      $scope.activateAuction = function (auctionId, username, uid) {
        Post.activateAuction(auctionId, username, uid).then(function () {
          $location.path('/auction/' + auctionId);
        });
      };
      ;
      $scope.closeAuction = function (auctionId) {
        Post.closeAuction(auctionId).then(function () {
          $location.path('/auctions/complete');
        });
      };
      $scope.deActivateAuction = function (auctionId) {
        Post.deActivateAuction(auctionId).then(function () {
          $location.path('/auctions/pending');
        });
      };
      $scope.deleteAuction = function (auction) {
        Post.deleteAuction(auction);
      };
      $scope.user = Auth.user;
      $scope.signedIn = Auth.signedIn;
      $scope.currentPrice = function () {
        if (!$scope.auction.winningBidder) {
          console.log('No winning bidder. So use start amount: ' + $scope.auction.startPrice);
          return $scope.auction.startPrice;
        } else {
          console.log('Found winning bidder:' + $scope.auction.winningBidderAmount);
          return $scope.auction.winningBidderAmount;
        }
      };
      $scope.addComment = function () {
        if (!$scope.commentText || $scope.commentText === '') {
          return;  // dont display empty commments
        }
        var comment = {
            text: $scope.commentText,
            creator: $scope.user.profile.username,
            creatorUID: $scope.user.profile.uid,
            timestamp: Firebase.ServerValue.TIMESTAMP
          };
        $scope.comments.$add(comment);
        $scope.commentText = '';
      };
      $scope.deleteComment = function (comment) {
        $scope.comments.$remove(comment);
      };
    });
  }
]);
//app.controller('PostViewCtrl', function ($scope, $routeParams, Post, Auth) {
//    $scope.post = Post.get($routeParams.postId);
//    $scope.comments = Post.comments($routeParams.postId);
//
//    $scope.user = Auth.user;
//    $scope.signedIn = Auth.signedIn;
//
//    $scope.addComment = function () {
//        if (!$scope.commentText || $scope.commentText === '') {
//            return;
//        }
//
//        var comment = {
//            text: $scope.commentText,
//            creator: $scope.user.profile.username,
//            creatorUID: $scope.user.uid
//        };
//        $scope.comments.$add(comment);
//
//        $scope.commentText = '';
//    }
//
//    $scope.deleteComment = function (comment) {
//        $scope.comments.$remove(comment);
//    }
//
//});
'use strict';
app.filter('hostnameFromUrl', function () {
  return function (str) {
    var url = document.createElement('a');
    url.href = str;
    return url.hostname;
  };
});
'use strict';
app.filter('timeLeft', function () {
  return function (str) {
    console.log('Calculating time until ' + str);
    return moment(str, 'dddd DD MMM, h:mm A').fromNow();
  };
});
app.filter('formatTime', function () {
  return function (str) {
    return moment(str).format('dddd DD MMM, h:mm A');
  };
});
app.filter('formatTimeShort', function () {
  return function (str) {
    return moment(str).format('DD/MM h:mmA');
  };
});
app.filter('dateFromNow', function () {
  return function (unformattedDate, emptyStrText) {
    var formattedDate = moment.unix(unformattedDate).fromNow();
    if (formattedDate === '' && emptyStrText) {
      formattedDate = emptyStrText;
    }
    return formattedDate;
  };
});
app.filter('commaThousands', function () {
  return function (inputNumber) {
    var formattedNumber = '0';
    if (inputNumber) {
      formattedNumber = inputNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return formattedNumber;
  };
});
app.filter('capitaliseFirstLetter', function () {
  return function (inputString, emptyStrText) {
    if (inputString) {
      var formattedString = inputString.charAt(0).toUpperCase() + inputString.slice(1);
      if (formattedString === '' && emptyStrText) {
        formattedString = emptyStrText;
      }
      return formattedString;
    } else {
      return '';
    }
  };
});
'use strict';
app.filter('reverse', function () {
  function toArray(list) {
    var k, out = [];
    if (list) {
      if (angular.isArray(list)) {
        out = list;
      } else if (typeof list === 'object') {
        for (k in list) {
          if (list.hasOwnProperty(k)) {
            out.push(list[k]);
          }
        }
      }
    }
    return out;
  }
  return function (items) {
    return toArray(items).slice().reverse();
  };
});
'use strict';
/**
 * Using 3 way data binding
 */
app.factory('Post', [
  '$firebase',
  'FIREBASE_URL',
  'Queue',
  function ($firebase, FIREBASE_URL, Queue) {
    //return $resource('https://gnrl.firebaseIO.com/posts/:id.json'); // :id is an optional parameter. if supplied posts/ID.json, otherwise posts.json
    var ref = new Firebase(FIREBASE_URL);
    // reference to the firebase repository
    var refPosts = ref.child('auction');
    var refComments = ref.child('comments');
    var refUserPosts = ref.child('user_posts');
    var refWinList = ref.child('win_list');
    var refAuctionQueue = ref.child('auction_queue');
    var posts = $firebase(refPosts).$asArray();
    // pass reference into $firebase, which provdes wrapper helper functions
    var Post = {
        all: posts,
        activateAuction: function (auctionId, userName, userId) {
          $firebase(refAuctionQueue).$push(auctionId);
          console.log(auctionId, userName, userId);
          return $firebase(refPosts.child(auctionId)).$update({
            auctionStatus: 'active',
            creatorName: userName,
            creatorUID: userId
          });
        },
        deActivateAuction: function (auctionId) {
          Queue.deQueue(auctionId);
          return $firebase(refPosts.child(auctionId)).$update({
            auctionStatus: 'pending',
            creatorName: null,
            creatorUID: null
          });
        },
        closeAuction: function (auction) {
          debugger;
          auction.auctionStatus = 'complete';
          auction.endTime = Firebase.ServerValue.TIMESTAMP;
          return auction.$save().then(function (auctionRef) {
            Queue.deQueue(auction.$id);
            $firebase(refWinList.child(auction.winningBidderUID)).$push(auction.$id);
            return auctionRef;
          });
        },
        deleteAuction: function (auctionId) {
          Queue.deQueue(auctionId);
          posts.$remove(post);
        },
        create: function (post) {
          post.auctionStatus = 'pending';
          post.winningBidderAmount = post.startPrice;
          return posts.$add(post).then(function (postRef) {
            $firebase(refUserPosts.child(post.creatorUID)).$push(postRef.name());
            return postRef;
          });
        },
        get: function (auctionId) {
          console.log('Post.get(' + auctionId + ')');
          return $firebase(refPosts.child(auctionId)).$asObject();
        },
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
        }
      };
    return Post;
  }
]);
'use strict';
app.factory('Auth', [
  '$firebase',
  '$firebaseAuth',
  'FIREBASE_URL',
  '$rootScope',
  '$q',
  function ($firebase, $firebaseAuth, FIREBASE_URL, $rootScope, $q) {
    var oldref = new Firebase(FIREBASE_URL);
    var ref = $firebaseAuth(oldref);
    var defer = $q.defer();
    var Auth = {
        register: function (user, callback) {
          console.log('trying to register user');
          return ref.$createUser({
            email: user.email,
            password: user.password
          }, callback);
        },
        createProfile: function (user, callback) {
          var profile = {
              username: user.username,
              uid: user.uid,
              md5_hash: user.md5_hash
            };
          var profileRef = $firebase(ref.child('profile'));
          profileRef.$set(user.uid, profile).then(function () {
            callback(null);
          }, function (error) {
            callback(error);
          });
        },
        login: function (user) {
          console.log('trying to log in');
          return ref.$authWithPassword(user);
        },
        logout: function () {
          console.log('trying to log out');
          ref.$logout();
        },
        resolveUser: function () {
          console.log('getting current user');
          //return ref.$getCurrentUser();
          return defer.promise;
        },
        signedIn: function () {
          return Auth.user && Auth.user.provider;
        },
        user: {}
      };
    ref.$onAuth(function (authData) {
      // called whenever the login status is changed.
      if (authData) {
        Auth.user = authData;
        Auth.user.profile = $firebase(oldref.child('profile').child(Auth.user.uid)).$asObject();
        Auth.user.profile.uid = Auth.user.uid;
        console.group('User logged in ' + Auth.user.email);
        console.log(Auth.user.profile);
        console.groupEnd();
      } else {
        console.log('logged out');
        if (Auth.user && Auth.user.profile) {
          Auth.user.profile.$destroy();  // Ensure that profile data is destroyed when user logs out
        }
      }
      Auth.user = authData;
      defer.resolve(Auth.user);
    });
    /*
        $rootScope.$on('$firebaseSimpleLogin:login', function (e, user) {
            angular.copy(user, Auth.user); // using copy function makes more robust Auth.user references

            Auth.user.profile = $firebase(ref.child('profile').child(Auth.user.uid)).$asObject();
            Auth.user.profile.uid = user.uid;

            console.group('User logged in ' + user.email);
            console.log(Auth.user.profile);
            console.groupEnd();
        });
        $rootScope.$on('$firebaseSimpleLogin:logout', function () {
            console.log('logged out');

            if (Auth.user && Auth.user.profile) {
                Auth.user.profile.$destroy(); // Ensure that profile data is destroyed when user logs out
            }
            angular.copy({}, Auth.user); // Clear Auth.user field
        });*/
    return Auth;
  }
]);
//app.factory('Auth', function ($firebase, $firebaseSimpleLogin, FIREBASE_URL, $rootScope) {
//  var ref = new Firebase(FIREBASE_URL);
//  var auth = $firebaseSimpleLogin(ref);
//
//  var Auth = {
//    register: function (user) {
//      return auth.$createUser(user.email, user.password);
//    },
//    createProfile: function(user) {
//      var profile = {
//        username: user.username,
//        md5_hash: user.md5_hash
//      };
//
//      var profileRef = $firebase(ref.child('profile'));
//      return profileRef.$set(user.uid, profile);
//    },
//    login: function (user) {
//      return auth.$login('password', user);
//    },
//    logout: function () {
//      auth.$logout();
//    },
//    resolveUser: function() {
//      return auth.$getCurrentUser();
//    },
//    signedIn: function() {
//      return !!Auth.user.provider;
//    },
//    user: {}
//  };
//
//  $rootScope.$on('$firebaseSimpleLogin:login', function(e, user) {
//    console.log('logged in');
//    angular.copy(user, Auth.user);
//    Auth.user.profile = $firebase(ref.child('profile').child(Auth.user.uid)).$asObject();
//
//    console.log(Auth.user);
//  });
//  $rootScope.$on('$firebaseSimpleLogin:logout', function() {
//    console.log('logged out');
//
//    if (Auth.user && Auth.user.profile) {
//      Auth.user.profile.$destroy();
//    }
//
//    angular.copy({}, Auth.user);
//  });
//
//  return Auth;
//});
'use strict';
app.factory('Profile', [
  '$window',
  'FIREBASE_URL',
  '$firebase',
  'Post',
  '$q',
  function ($window, FIREBASE_URL, $firebase, Post, $q) {
    var ref = new $window.Firebase(FIREBASE_URL);
    var profileRef = ref.child('profile');
    var winListRef = ref.child('win_list');
    var profile = {
        get: function (userId) {
          return $firebase(profileRef.child(userId)).$asObject();
        },
        getPosts: function (userId) {
          var defer = $q.defer();
          $firebase(winListRef.child(userId)).$asArray().$loaded().then(function (data) {
            // then 
            var posts = {};
            for (var i = 0; i < data.length; i++) {
              // loop over each post 
              var value = data[i].$value;
              posts[value] = Post.get(value);
            }
            defer.resolve(posts);
          });
          return defer.promise;
        }
      };
    return profile;
  }
]);
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
'use strict';
/**
 * Using 3 way data binding
 */
app.factory('Helper', [
  '$window',
  function ($window) {
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
  }
]);
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
'use strict';
app.factory('Queue', [
  '$window',
  'FIREBASE_URL',
  '$firebase',
  '$q',
  function ($window, FIREBASE_URL, $firebase, $q) {
    var ref = new $window.Firebase(FIREBASE_URL);
    var queueRef = ref.child('auction_queue');
    var queue = {
        deQueue: function (auctionId) {
          var defer = $q.defer();
          $firebase(queueRef).$asArray().$loaded().then(function (data) {
            // then 
            var posts = {};
            for (var i = 0; i < data.length; i++) {
              // loop over each post 
              var value = data[i].$value;
              if (value === auctionId) {
                console.log('Deleting ' + value + 'from queue, id: ' + data[i].$id);
                $firebase(queueRef.child(data[i].$id)).$remove();
              }
            }
            defer.resolve(posts);
          });
          return defer.promise;
        },
        getQueue: function () {
          var defer = $q.defer();
          console.log('trying to get queue');
          $firebase(queueRef).$asArray().$loaded().then(function (data) {
            // then 
            console.log('promised content');
            defer.resolve(data[0].$value);
          });
          console.log('sending promise');
          return defer.promise;
        }
      };
    return queue;
  }
]);  //app.factory('Profile', function ($window, FIREBASE_URL, $firebase, Post, $q) {
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
