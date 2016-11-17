/*global angular */

/**
 * Services that persists and retrieves books from localStorage or a backend API
 * if available.
 *
 * They both follow the same API, returning promises for all changes to the
 * model.
 */
angular.module('bookmvc')
	.factory('bookStorage', function ($http, $injector) {
		'use strict';

		// Detect if an API backend is present. If so, return the API module, else
		// hand off the localStorage adapter
		return $http.get('/api')
			.then(function () {
				return $injector.get('api');
			}, function () {
				return $injector.get('localStorage');
			});
	})

	.factory('api', function ($http) {
		'use strict';

		var store = {
			books: [],

			clearCompleted: function () {
				var originalBooks = store.books.slice(0);

				var completeBooks = [];
				var incompleteBooks = [];
				store.books.forEach(function (book) {
					if (book.completed) {
						completeBooks.push(book);
					} else {
						incompleteBooks.push(book);
					}
				});

				angular.copy(incompleteBooks, store.books);

				return $http.delete('/api/books')
					.then(function success() {
						return store.books;
					}, function error() {
						angular.copy(originalBooks, store.books);
						return originalBooks;
					});
			},

			delete: function (book) {
				var originalBooks = store.books.slice(0);

				store.books.splice(store.books.indexOf(book), 1);

				return $http.delete('/api/books/' + book.id)
					.then(function success() {
						return store.books;
					}, function error() {
						angular.copy(originalBooks, store.books);
						return originalBooks;
					});
			},

			get: function () {
				return $http.get('/api/books')
					.then(function (resp) {
						angular.copy(resp.data, store.books);
						return store.books;
					});
			},

			insert: function (book) {
				var originalBooks = store.books.slice(0);

				return $http.post('/api/books', book)
					.then(function success(resp) {
						book.id = resp.data.id;
						store.books.push(book);
						return store.books;
					}, function error() {
						angular.copy(originalBooks, store.books);
						return store.books;
					});
			},

			put: function (book) {
				var originalBooks = store.books.slice(0);

				return $http.put('/api/books/' + book.id, book)
					.then(function success() {
						return store.books;
					}, function error() {
						angular.copy(originalBooks, store.books);
						return originalBooks;
					});
			}
		};

		return store;
	})

	.factory('localStorage', function ($q) {
		'use strict';

		var STORAGE_ID = 'books-angularjs';

		var store = {
			books: [],

			_getFromLocalStorage: function () {
				return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
			},

			_saveToLocalStorage: function (books) {
				localStorage.setItem(STORAGE_ID, JSON.stringify(books));
			},

			clearCompleted: function () {
				var deferred = $q.defer();

				var completeBooks = [];
				var incompleteBooks = [];
				store.books.forEach(function (book) {
					if (book.completed) {
						completeBooks.push(book);
					} else {
						incompleteBooks.push(book);
					}
				});

				angular.copy(incompleteBooks, store.books);

				store._saveToLocalStorage(store.books);
				deferred.resolve(store.books);

				return deferred.promise;
			},

			delete: function (book) {
				var deferred = $q.defer();

				store.books.splice(store.books.indexOf(book), 1);

				store._saveToLocalStorage(store.books);
				deferred.resolve(store.books);

				return deferred.promise;
			},

			get: function () {
				var deferred = $q.defer();

				angular.copy(store._getFromLocalStorage(), store.books);
				deferred.resolve(store.books);

				return deferred.promise;
			},

			insert: function (book) {
				var deferred = $q.defer();

				store.books.push(book);

				store._saveToLocalStorage(store.books);
				deferred.resolve(store.books);

				return deferred.promise;
			},

			put: function (book, index) {
				var deferred = $q.defer();

				store.books[index] = book;

				store._saveToLocalStorage(store.books);
				deferred.resolve(store.books);

				return deferred.promise;
			}
		};

		return store;
	});
