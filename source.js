/**
 * angular-historical-back - Smart way to place back buttons
 * @version v0.0.16
 * @author Can Tecim, can.tecim@gmail.com
 * @license MIT
 */
(function (root, factory) {
	if(typeof define === "function" && define.amd) {
		define(factory);
	} else
		factory();
})(this, function() {
	'use strict';
	var _ = require('lodash');

	var __log = console.log.bind(console);

	function log() {
		//return;
		__log.apply(undefined, arguments);
	}

	var module = angular.module('angular-historical-back', []);

	module.provider('ngHistoricalBack', function () {

		stateDecorator.$inject = ["$delegate", "$rootScope", "ngHistoricalBack"];
		function stateDecorator($delegate, $rootScope, ngHistoricalBack) {
			log("decorating");
			$rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
				ngHistoricalBack.push(toState, toParams, fromState, fromParams);
			});

			return $delegate;
		}

		this.decorate = function decorate($provide) {
			$provide.decorator("$state", stateDecorator)
		};

		this.$get = [function ngHistoricalBackFactory() {
			var routeStack = [],
				paramStack = [],
				lastPopped;

			/**
			 * Pop once
			 */
			function realPop() {
				routeStack.pop();
				paramStack.pop();
			}

			/**
			 *  Return the last
			 *  It's not popping actually
			 *
			 * @returns {{name: T, param: T}}
			 */
			function pop() {
				// Actually we will not pop here
				var name = _.last(routeStack);
				if (name)
					return lastPopped = {
						name: name,
						param: _.last(paramStack)
					};
				else
					return undefined;
			}

			/**
			 * Push onto stack
			 *
			 * @param toState
			 * @param toParams
			 * @param fromState
			 * @param fromParams
			 */
			function push(toState, toParams, fromState, fromParams) {
				if (fromState.name.length) {
					if (!lastPopped || lastPopped.name != toState.name) {
						routeStack.push(fromState.name);
						paramStack.push(fromParams);
						lastPopped = undefined;
					}
				} else {
					// first one
					routeStack.push(toState.name);
					paramStack.push(toParams);
				}
			}

			return {
				push: push,
				pop: pop,
				realPop: realPop
			};

		}]

	});

	module.directive('historicalBack', ['$state', 'ngHistoricalBack', function ($state, ngHistoricalBack) {
		function compile(el, attrs, transclude) {
			var prev = ngHistoricalBack.pop(),
				parent = (prev) ? prev.name.split('.') : [];
			if (parent) {
				parent.splice(parent.length - 1, 1);
				parent = parent.join('.');
			}

			if (prev) {
				angular.element(el).click(function () {
					ngHistoricalBack.realPop();
					$state.go(prev.name, prev.param, {
						reload: (parent.length) ? parent : true
					});
				});
			} else {
				angular.element(el).remove();
			}
		}

		return {
			restrict: 'A',
			compile: compile
		};
	}])
});