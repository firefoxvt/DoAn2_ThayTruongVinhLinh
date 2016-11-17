angular.module('books').controller('BooksController', ['$scope', '$routeParams', '$location', 'Authentication', 'Books',
	function($scope, $routeParams, $location, Authentication, Books) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var book = new Books({
				title: this.title,
				comment: this.comment
			});

			book.$save(function(response) {
				$location.path('books/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.books = Books.query();
		};

		$scope.findOne = function() {
			$scope.book = Books.get({
				bookId: $routeParams.bookId
			});
		};

		$scope.update = function() {
			$scope.book.$update(function() {
				$location.path('books/' + $scope.book._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.delete = function(book) {
			if (book) {
				book.$remove(function() {
					for (var i in $scope.books) {
						if ($scope.books[i] === book) {
							$scope.books.splice(i, 1);
						}
					}
				});
			} else {
				$scope.book.$remove(function() {
					$location.path('books');
				});
			}
		};
	}
]);