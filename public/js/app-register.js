(function() {
    "use strict";
    angular.module("app-register", ["ngRoute", "ngMaterial"]).controller("registerController", registerController);
    // inject dependencies
    function registerController($http, $scope, $interval, $mdSidenav, $mdDialog, $window, $timeout) {

        var vm = this;

        vm.emailError = "";
        vm.firstNameError = "";
        vm.lastNameError = "";
        vm.password1Error = "";
        vm.password2Error = "";
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

        vm.validateFirstName = function(name) {
          const regex = /^[a-zA-Z\s]*$/;
          if (!name) {
            vm.firstNameError = "First name is required";
          } else if (!regex.test(name)) {
            vm.firstNameError = "First name is invalid. Expects only letters and Spaces.";
          } else {
            vm.firstNameError = "";
          }
        }

        vm.validateLastName = function(name) {
          const regex = /^[a-zA-Z\s]*$/;
          if (!name) {
            vm.lastNameError = "Last name is required";
          } else if (!regex.test(name)) {
            vm.lastNameError = "Last name is invalid. Expects only letters and Spaces.";
          } else {
            vm.lastNameError = "";
          }
        }

        vm.validatePassword1 = function(pwd) {
          vm.password1Error = "";

          const regex = /^(?=.{6,})(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$^&+=]).*$/;

          if (!pwd) {
            vm.password1Error = "Please enter Password";
          } else if (!regex.test(pwd)) {
            vm.password1Error = "Password requires: Minimum 6 characters, atleast 1 uppercase, atleast 1 special case (!@#$^&+=), atleast 1 number";
          } else {
            vm.password1Error = "";
          }
        }

        vm.validatePassword2 = function(pwd) {
          vm.password2Error = "";

          const regex = /^(?=.{6,})(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$^&+=]).*$/;

          if (!pwd) {
            vm.password2Error = "Please enter Password";
          } else if (!regex.test(pwd)) {
            vm.password2Error = "Password requires: Minimum 6 characters, atleast 1 uppercase, atleast 1 special case (!@#$^&+=), atleast 1 number";
          } else {
            vm.password2Error = "";
          }
        }


        vm.Register = function() {
          vm.submitError = "";

            vm.body = {
              firstname: vm.firstname,
              lastname: vm.lastname,
              username: vm.email,
              password: vm.password,
              password2: vm.password2,
            };

            if (vm.emailError !== "" || vm.email === "" || vm.email === undefined) {
              vm.submitError = "Please enter a valid email.";
            } else if (vm.firstNameError !== "" || vm.firstname === "" || vm.firstname === undefined || vm.lastNameError !== "" || vm.lastname === "" || vm.lastname === undefined) {
              vm.submitError = "Please enter a valid name.";
            } else if (vm.password1Error !== "" || vm.password2Error !== "" || vm.password === "" || vm.password2 === "" || vm.password === undefined || vm.password2 === undefined) {
              vm.submitError = "Please enter valid passwords";
            } else if (vm.password !== vm.password2) {
              vm.submitError = "Passwords do not match.";
            } else {
              $http.post(`/Physician`, vm.body, vm.getHeaders())
                .then(function(res) {
                  if (res.data.id) {
                    $scope.user = res.data;
                    sessionStorage.physician = JSON.stringify($scope.user);

                    $window.location.href = '/dashboard.html';
                  }
                })
                .catch((err) => {
                  if (err.message){
                    vm.submitError = `Registration failed. Error: ${err.message}`;
                  } else if (err.data) {
                    vm.submitError = `Registration failed. ${err.data.Error}`;
                  } else {
                    vm.submitError = `Registration failed.`;
                  }
                })
                .finally(() => {
                  vm.passwordError = "";
                  vm.emailError = "";
                  vm.firstNameError = "";
                  vm.lastNameError = "";
                  vm.submitError = "";
                });
            }
        }
    }
})();
