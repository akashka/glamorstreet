(function() {
    'use strict';

    angular
        .module('cms')
        .controller('blogController', blogController);

    blogController.$inject = ['$scope', 'Authentication', '$rootScope', '$http', 'blogsData', 'Blogs', 'selectedBlogs', 'SelectedBlogs', 'SelectedBlogs', 'toastr', 'HEADING', 'heading'];

    function blogController($scope, Authentication, $rootScope, $http, blogsData, Blogs, selectedBlogs, SelectedBlogs, toastr, HEADING, heading) {

      $scope.blogs = blogsData.data.posts;
      $scope.blogSectionVisibility = false;
      var currentBlogIndex;
      $scope.selectedBlog = {};
      $scope.selectedBlogs = [];
      $scope.heading = heading.data ? heading.data : {'type': HEADING.blogs};

      _(selectedBlogs.data).forEach(function (blog) {
        $scope.selectedBlogs[blog.position] = _.find(selectedBlogs.data, {'id': blog.blog_id});
      });

      $scope.addBlog = function(blogSectionIndex){
        $scope.blogSectionVisibility = true;
        currentBlogIndex = blogSectionIndex;
        $scope.editing = false;
      };

      $scope.editBlog = function(blogSectionIndex){
        $scope.blogSectionVisibility = true;
        currentBlogIndex = blogSectionIndex;
        $scope.selectedBlog.id = $scope.selectedBlogs[blogSectionIndex].id;
        $scope.editing = true;
      };

      $scope.saveBlog = function () {
        var selectedBlog = {
          blog_id: $scope.selectedBlog.id,
          position: currentBlogIndex
        };

        Blogs.post(selectedBlog).success(function (res) {
          $scope.selectedBlogs[currentBlogIndex] = _.find($scope.blogs, ['id', res.blog_id]);
          $scope.blogSectionVisibility = false;
          toastr.success('Saved Successfully');
        });
      };

      $scope.updateBlog = function () {
        var selectedBlog = {
          blog_id: $scope.selectedBlog.id,
          position: currentBlogIndex
        };

        Blogs.put(selectedBlog, $scope.selectedBlogs[currentBlogIndex]._id).success(function (res) {
          $scope.selectedBlogs[currentBlogIndex] = _.find($scope.blogs, ['id', res.blog_id]);
          $scope.blogSectionVisibility = false;
          toastr.success('Updated Successfully');
        });
      };
    }
}());
