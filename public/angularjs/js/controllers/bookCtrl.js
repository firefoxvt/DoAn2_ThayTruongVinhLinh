/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the bookStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('bookmvc')
	.controller('BookCtrl', function BookCtrl($scope, $routeParams, $filter, store) {
		'use strict';

		var books = $scope.books = store.books;

		$scope.newBook = '';
		$scope.editedBook = null;

		$scope.$watch('books', function () {
			$scope.remainingCount = $filter('filter')(books, { completed: false }).length;
			$scope.completedCount = books.length - $scope.remainingCount;
			$scope.allChecked = !$scope.remainingCount;
		}, true);

		// Monitor the current route for changes and adjust the filter accordingly.
		$scope.$on('$routeChangeSuccess', function () {
			var status = $scope.status = $routeParams.status || '';

			$scope.statusFilter = (status === 'active') ?
				{ completed: false } : (status === 'completed') ?
				{ completed: true } : null;
		});

		$scope.addBook = function () {
			var newBook = {
				title: $scope.newBook.trim(),
				completed: false
			};

			if (!newBook.title) {
				return;
			}

			$scope.saving = true;
			store.insert(newBook)
				.then(function success() {
					$scope.newBook = '';
				})
				.finally(function () {
					$scope.saving = false;
				});
		};

		$scope.editBook = function (book) {
			$scope.editedBook = book;
			// Clone the original book to restore it on demand.
			$scope.originalBook = angular.extend({}, book);
		};

		$scope.saveEdits = function (book, event) {
			// Blur events are automatically triggered after the form submit event.
			// This does some unfortunate logic handling to prevent saving twice.
			if (event === 'blur' && $scope.saveEvent === 'submit') {
				$scope.saveEvent = null;
				return;
			}

			$scope.saveEvent = event;

			if ($scope.reverted) {
				// Book edits were reverted-- don't save.
				$scope.reverted = null;
				return;
			}

			book.title = book.title.trim();

			if (book.title === $scope.originalBook.title) {
				$scope.editedBook = null;
				return;
			}

			store[book.title ? 'put' : 'delete'](book)
				.then(function success() {}, function error() {
					book.title = $scope.originalBook.title;
				})
				.finally(function () {
					$scope.editedBook = null;
				});
		};

		$scope.revertEdits = function (book) {
			books[books.indexOf(book)] = $scope.originalBook;
			$scope.editedBook = null;
			$scope.originalBook = null;
			$scope.reverted = true;
		};

		$scope.removeBook = function (book) {
			store.delete(book);
		};

		$scope.saveBook = function (book) {
			store.put(book);
		};

		$scope.toggleCompleted = function (book, completed) {
			if (angular.isDefined(completed)) {
				book.completed = completed;
			}
			store.put(book, books.indexOf(book))
				.then(function success() {}, function error() {
					book.completed = !book.completed;
				});
		};

		$scope.clearCompletedBooks = function () {
			store.clearCompleted();
		};

		$scope.markAll = function (completed) {
			books.forEach(function (book) {
				if (book.completed !== completed) {
					$scope.toggleCompleted(book, completed);
				}
			});
		};
	});
