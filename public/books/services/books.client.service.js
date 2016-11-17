angular.module('books').factory('Books', ['$resource',
	function($resource) {
		return $resource('api/books/:bookId', {
			bookId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);