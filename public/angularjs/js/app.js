/*global angular */

/**
 * The main BookMVC app module
 *
 * @type {angular.Module}
 */
angular.module('bookmvc', ['ngRoute'])
	.config(function ($routeProvider) {
		'use strict';

		var routeConfig = {
			controller: 'BookCtrl',
			templateUrl: 'bookmvc-index.html',
			resolve: {
				store: function (bookStorage) {
					// Get the correct module (API or localStorage).
					return bookStorage.then(function (module) {
						module.get(); // Fetch the book records in the background.
						return module;
					});
				}
			}
		};

		$routeProvider
			.when('/', routeConfig)
			.when('/:status', routeConfig)
			.otherwise({
				redirectTo: '/'
			});
	});
