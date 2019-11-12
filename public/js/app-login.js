(function() {
    "use strict";
    angular.module("app-login", ["ngRoute", "ngMaterial"]).controller("loginController", loginController);
    //Controller- add dependencies
    function loginController($http, $scope, $interval, $mdSidenav, $mdDialog, $window, $timeout) {
        var vm = this;

        vm.emailError = "";
        vm.submitError = "";

        vm.getHeaders = function() {
          const returnObj = {
            headers: {
              'Content-Type': 'application/json',
            }
          };

          return returnObj;
        }

        vm.validateEmail = function(email) {
          const regex = /\S+@\S+\.\S+/;
          if (!email) {
            vm.emailError = "Email is required";
          } else if (!regex.test(email)) {
            vm.emailError = "Email is invalid. Format: xxx@yyy.zzz";
          } else {
            vm.emailError = "";
          }
        }

        vm.Login = function() {
          vm.submitError = "";

          if (vm.emailError !== "" || vm.email === "" || vm.email === undefined) {
            vm.submitError = "Please enter a valid email.";
          } else {
            $http.get(`/Physician?username=${vm.email}&password=${vm.password}`, vm.getHeaders())
              .then((response) => {
                  if (response.data.length === 1) {
                    // session code here
                    $scope.user = response.data[0];
                    sessionStorage.physician = JSON.stringify($scope.user);

                    $window.location.href = '/dashboard.html';
                  } else {
                    throw Error('User Invalid.');
                  }
              })
              .catch((err) => {
                if (err.message){
                  vm.submitError = `Login failed. ${err.message}`;
                } else if (err.data) {
                  vm.submitError = `Login failed. ${err.data.Error}`;
                } else {
                  vm.submitError = `Login failed.`;
                }
              });
          }

        }
    }
})();
