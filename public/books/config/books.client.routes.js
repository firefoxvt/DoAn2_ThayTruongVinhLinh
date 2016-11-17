angular.module('books').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/books', {
			templateUrl: 'books/views/list-books.client.view.html'
		}).
		when('/books/create', {
			templateUrl: 'books/views/create-book.client.view.html'
		}).
		when('/books/:bookId', {
			templateUrl: 'books/views/view-book.client.view.html'
		}).
		when('/books/:bookId/edit', {
			templateUrl: 'books/views/edit-book.client.view.html'
		});
	}
]);