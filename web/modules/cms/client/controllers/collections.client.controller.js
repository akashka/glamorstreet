(function() {
    'use strict';

    angular
        .module('cms')
        .controller('collectionsController', collectionsController);

    collectionsController.$inject = ['$scope', 'Authentication', '$rootScope','Notification', '$http',
      'propertyTypes', 'selectedCollections', 'Collections', 'HEADING', 'heading',
      'Heading', '$uibModal', 'CLIENT'];

    function collectionsController($scope, Authentication, $rootScope, Notification, $http,
                                   propertyTypes, selectedCollections, Collections, HEADING, heading,
                                   Heading, $uibModal, CLIENT) {

      $rootScope.page = 'collections';
      $scope.collections = propertyTypes.data.PropertyList;

      $scope.rightSectionVisibility = false;
      $scope.duplicateflag = false;
      $scope.currentIndex = 1;
      $scope.selectedCollection = {};
      $scope.myCollections = [];
      $scope.heading = heading.data ? heading.data : {'type': HEADING.collections};
      _(selectedCollections.data).forEach(function (collection) {
        $scope.myCollections[collection.position] = _.find(selectedCollections.data, {'id': collection.collection_id});
      });

      $scope.addCollection = function (sectionIndex) {
        $scope.rightSectionVisibility = true;
        $scope.currentIndex = sectionIndex;
        $scope.editing = false;
        $scope.selectedCollection = {};
      };

      $scope.editCollection = function (collectionSectionIndex, collectionId) {
        $scope.rightSectionVisibility = true;
        $scope.currentIndex = collectionSectionIndex;
        $scope.selectedCollection.id = $scope.myCollections[collectionSectionIndex].collection_id;
        $scope.selectedCollection.description = $scope.myCollections[collectionSectionIndex].description;
        $scope.selectedCollection.image = $scope.myCollections[collectionSectionIndex].image;
        $scope.selectedCollection._id = collectionId;
        $scope.editing = true;
      };

      $scope.saveCollection = function () {
        $scope.duplicateflag = false;
        for (var CollectionIndex = 1; CollectionIndex < $scope.myCollections.length; CollectionIndex++) { //checking for duplication
          if ($scope.myCollections[CollectionIndex] != undefined && $scope.myCollections[CollectionIndex] != null
            && $scope.myCollections[CollectionIndex].collection_id == $scope.selectedCollection.id) {
            $scope.duplicateflag = true;
          }
        }
        if (!$scope.duplicateflag) {
          var selectedCollection = {
            collection_id: $scope.selectedCollection.id,
            position: $scope.currentIndex,
            description: $scope.selectedCollection.description,
            image: $scope.selectedCollection.image
          };

          Collections.post(selectedCollection).success(function (res) {
            $scope.myCollections[$scope.currentIndex] = res;
            var PropertyName = _.find($scope.collections, {'id': $scope.myCollections[$scope.currentIndex].collection_id});
            $scope.myCollections[$scope.currentIndex].name = PropertyName.name;
            $scope.rightSectionVisibility = false;
            $scope.selectedCollection = {};
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Saved Successfully!'});
          });
        }
      };

      $scope.updateCollection = function () {
        $scope.duplicateflag = false;
        for (var CollectionIndex = 1; CollectionIndex < $scope.myCollections.length; CollectionIndex++) { //checking for duplication
          if ($scope.myCollections[CollectionIndex] != undefined && $scope.myCollections[CollectionIndex] != null
            && $scope.myCollections[CollectionIndex].collection_id == $scope.selectedCollection.id && 
            $scope.myCollections[CollectionIndex]._id != $scope.selectedCollection._id) {
            $scope.duplicateflag = true;
          }
        }
          if(!$scope.duplicateflag) {
            var selectedCollection = {
              collection_id: $scope.selectedCollection.id,
              position: $scope.currentIndex,
              description: $scope.selectedCollection.description,
              image: $scope.selectedCollection.image
            };
            Collections.put(selectedCollection, $scope.myCollections[$scope.currentIndex]._id).success(function (res) {
              $scope.myCollections[$scope.currentIndex] = res;
              var PropertyName = _.find($scope.collections, {'id': $scope.myCollections[$scope.currentIndex].collection_id});
              $scope.myCollections[$scope.currentIndex].name = PropertyName.name;
              $scope.rightSectionVisibility = false;
              $scope.selectedCollection = {};
              Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Updated Successfully!'});
            });
          }
      };
      $scope.openImageModal = function () {
          var $ctrl = this;
          var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            ariaLabelledBy: 'modal-title-bottom',
            ariaDescribedBy: 'modal-body-bottom',
            templateUrl: '/views/' + CLIENT.name + '/modules/cms/client/views/models/imageUploadModal/imageUploadModal.html',
            size: 'lg',
            controller: "ImageUploadController",
            resolve: {
              'image': function () {
                return $scope.selectedCollection.image;
              }
            }
          });

          modalInstance.result.then(function (resultImage) {
            $scope.selectedCollection.image = resultImage;
          });
        };
      }
}());
