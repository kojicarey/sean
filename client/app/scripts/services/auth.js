'use strict';

app.factory('Auth', ['$firebase', '$firebaseSimpleLogin', 'FIREBASE_URL', '$rootScope', function ($firebase, $firebaseSimpleLogin, FIREBASE_URL, $rootScope) {
        var ref = new Firebase(FIREBASE_URL);
        var auth = $firebaseSimpleLogin(ref);

        var Auth = {
            /**
             * @param user object. Should contain email and password fields
             * @returns $firebaseSimpleLogin.$login()
             */
            register: function (user) {
                console.log('trying to register user');
                return auth.$createUser(user.email, user.password);
            },
            createProfile: function (user) {
                var profile = {
                    username: user.username,
                    uid: user.uid,
                    md5_hash: user.md5_hash // generated by firebase on user registration
                };

                var profileRef = $firebase(ref.child('profile'));
                return profileRef.$set(user.uid, profile);
            },
            /**
             * @param user User Object
             * $firebaseSimpleLogin.$login()
             */
            login: function (user) {
                console.log('trying to log in');
                return auth.$login('password', user);
            },
            /**
             * Logs out current user 
             * $firebaseSimpleLogin.$logout()
             */
            logout: function () {
                console.log('trying to log out');
                auth.$logout();
            },
            /**
             * @returns $firebaseSimpleLogin.$getCurrentUser()
             */
            resolveUser: function () {
                console.log('getting current user');
                return auth.$getCurrentUser();
            },
            /**
             * @returns {Boolean} True if user is logged in
             */
            signedIn: function () {
                return !!Auth.user.provider;
            },
            user: {} //placeholder for user object, created during login event
        };

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
        });

        return Auth;
    }]);





























































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