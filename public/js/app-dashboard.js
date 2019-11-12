(function() {
    "use strict";
    angular.module("app-dashboard", ["ngRoute", "ngMaterial"]).controller("dashboardController", dashboardController);
    // inject dependencies
    function dashboardController($http, $scope, $interval, $mdSidenav, $mdDialog, $window, $timeout) {

        var vm = this;
        vm.errorMessage = "";

        vm.viewGet = false;
        vm.viewPost = false;
        vm.viewUpdateById = false;

        vm.physicianName = "";
        vm.physicianId = "";
        vm.createPatient = {
          firstname: "",
          lastname: "",
          email: "",
          physician: "",
        };
        vm.patientToUpdate = "";
        vm.patientToDelete = "";

        vm.emailError = "";
        vm.firstNameError = "";
        vm.lastNameError = "";
        vm.submitError = "";

        vm.loadingScreen = false;

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

        $scope.updateSingleResource = function(item) {
            vm.loadingScreen = true;
            vm.errorMessage = "";
            vm.emailError = "";
            vm.firstNameError = "";
            vm.lastNameError = "";
            vm.submitError = "";
            $scope.patientToUpdate = item;

            vm.checkDisplay("updatebyid");
            vm.loadingScreen = false;
        }

        $scope.deleteSingleResource = function(item) {
          $scope.patientToDelete = item.id;
        }

        vm.Logout = function() {
          sessionStorage.physician = null;
          $scope.user = null;
          $window.location.href = '/index.html';
        }

        /*
        Change PageView as per the navigation option
        */
        vm.checkDisplay = function(arg) {
            vm.viewGet = false;
            vm.viewUpdateById = false;
            vm.viewPost = false;

            switch (arg) {
                case "get":
                    vm.viewGet = true;
                    break;
                case "updatebyid":
                    vm.viewUpdateById = true;
                    break;
                case "post":
                    vm.viewPost = true;
                    break;
                default:
                    vm.errorMessage = "No argument matched in switch stmnt.";
                    break;
            }
        }

        vm.getHeaders = function() {
          const returnObj = {
            headers: {

              'Content-Type': 'application/json',
            }
          };
          return returnObj;
        }

        vm.DeletePatient = function(id) {
          $http.delete(`/Patient/${id}`,vm.getHeaders())
            .then((res) => {
              vm.errorMessage = "";
              vm.patientToDelete = "";
              vm.loadingScreen = true;

              vm.get();
            })
            .catch((err) => {
              console.log('deletev err: ', err);
            })
            .finally(() => {
              vm.patientToDelete = "";
            });
        }

        vm.HttpPost = function(data) {
          vm.submitError = "";

          if (vm.emailError !== "" || vm.createPatient.email === "") {
            vm.submitError = "Please enter a valid email.";
          } else if (vm.firstNameError !== "" || vm.createPatient.firstname === "" || vm.lastNameError !== "" || vm.createPatient.lastname === "") {
            vm.submitError = "Please enter a valid name.";
          } else {
            vm.loadingScreen = true;
            vm.submitError = "";
            vm.createPatient.physician = vm.physicianId;

            $http.post('/Patient', vm.createPatient, vm.getHeaders())
              .then((res) => {
                vm.loadingScreen = false;
                vm.get();
              })
              .catch((err) => {
                vm.loadingScreen = false;
                vm.submitError = `Failed to add patient. Error: ${err.data.Error}`;
              });
          }
        }

        vm.post = function() {
          vm.createPatient = {
            firstname: "",
            lastname: "",
            email: "",
            physician: "",
          };

          vm.emailError = "";
          vm.firstNameError = "";
          vm.lastNameError = "";
          vm.submitError = "";

          vm.loadingScreen = true;
          vm.checkDisplay("post");
          vm.loadingScreen = false;
        }

        vm.HttpUpdateById = function(data) {
            vm.submitError = "";

            if (vm.emailError !== "" || data.email === "") {
              vm.submitError = "Please enter a valid email.";
            } else if (vm.firstNameError !== "" || data.firstname === "" || vm.lastNameError !== "" || data.lastname === "") {
              vm.submitError = "Please enter a valid name.";
            } else {

              const payload = {
                patch: [
                  {
                    'op': 'replace',
                    'path': '/firstname',
                    'value':  data.firstname,
                  },
                  {
                    'op': 'replace',
                    'path': '/lastname',
                    'value':  data.lastname,
                  },
                  {
                    'op': 'replace',
                    'path': '/email',
                    'value':  data.email,
                  },
                ]
              };

              vm.submitError = "";
              vm.loadingScreen = true;
              $http.patch(`/Patient/${data.id}`, payload, vm.getHeaders())
                .then((res) => {
                  vm.loadingScreen = false;
                  vm.get();
                })
                .catch((err) => {
                  vm.loadingScreen = false;
                  vm.submitError = `Failed to update patient. Error: ${err.data.Error}`;
                });
            }
      }




        vm.HttpGet = function() {
            vm.loadingScreen = true;
            vm.getAllList = [];
            $http.get(`/Patient?physician=${vm.physicianId}`, vm.getHeaders())
              .then(function(response) {
                  vm.errorMessage = "";
                  angular.copy(response.data, vm.getAllList);
              }, function(error) {
              }).finally(function() {
                  vm.loadingScreen = false;
              });
        }

        vm.get = function() {
            vm.loadingScreen = true;
            vm.errorMessage = "";
            vm.HttpGet();
            vm.checkDisplay("get");
            vm.loadingScreen = false;
        }

        vm.onLoad = function() {
            try {
              // session code here
              $scope.user = JSON.parse(sessionStorage.physician);
              vm.physicianName = $scope.user.firstname + ' ' + $scope.user.lastname;
              vm.physicianId = $scope.user.id;
              vm.get();
            }
            catch (e) {
              $window.location.href = '/index.html';
            }


        };
        // on page load
        vm.onLoad();
    }
})();
