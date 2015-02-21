'use strict';

app.factory('Auth', ['$firebase', '$firebaseAuth', 'FIREBASE_URL', '$rootScope', '$q', function ($firebase, $firebaseAuth, FIREBASE_URL, $rootScope, $q) {
        var oldref = new Firebase(FIREBASE_URL);
        var refProfile = oldref.child('profile');

        var ref = $firebaseAuth(oldref);
        var defer = $q.defer();

        var Auth = {
            /**
             * @param user object. Should contain email and password fields
             * @returns $firebaseSimpleLogin.$login()
             */
            register: function (user, callback) {
                console.log('trying to register user');
                ref.$createUser({
                    email: user.email,
                    password: user.password
                }).then(function success() {
                    console.log('register user success');
                    callback(null, user);
                }, function error(error) {
                    console.log('register user error');
                    callback(error, user);
                });

            },
            createProfile: function (user, callback) {
                var profile = {
                    username: user.username,
                    uid: user.uid,
                    md5_hash: user.md5_hash // generated by firebase on user registration
                };

                console.log('Auth.createProfile(): trying to write user profile', user.uid, profile);
                $firebase(refProfile).$set(user.uid, profile).then(function () {
                    console.log('Auth.createProfile() Succesful creation event');
                    callback(null);
                }, function (error) {
                    console.log('Auth.createProfile() Error');
                    callback(error);
                });
            },
            /**
             * @param user User Object
             * $firebaseSimpleLogin.$login()
             */
            login: function (user, successCallback, failCallback) {
                console.log('trying to log in');
                ref.$authWithPassword(user).then(function (authData) {
                    console.log('Auth.login() success');
                    successCallback(authData);
                }, function (error) {
                    console.log('Auth.login() error');
                    failCallback(error);
                });
            },
            /**
             * Logs out current user 
             * $firebaseSimpleLogin.$logout()
             */
            logout: function () {
                console.log('trying to log out');
                oldref.unauth();
            },
            /**
             * @returns $firebaseSimpleLogin.$getCurrentUser()
             */
            resolveUser: function () {
                console.log('getting current user');
                //return ref.$getCurrentUser();
                return defer.promise; // resolved by ref.$onAuth
            },
            /**
             * @returns {Boolean} True if user is logged in
             */
            signedIn: function () {
                return (Auth.user && Auth.user.provider);
            },
            user: {} //placeholder for user object, created during login event
        };

        ref.$onAuth(function (authData) {
            // called whenever the login status is changed.

            if (authData) {
                Auth.user = authData;

                Auth.user.profile = $firebase(oldref.child('profile').child(Auth.user.uid)).$asObject();
                Auth.user.profile.uid = Auth.user.uid;
                console.group('User logged in ' + authData.password.email);
                console.log(Auth.user.profile);
                console.groupEnd();
            }
            else {
                console.log('logged out');

                if (Auth.user && Auth.user.profile) {
                    Auth.user.profile.$destroy(); // Ensure that profile data is destroyed when user logs out
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