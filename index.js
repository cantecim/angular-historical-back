(function () {
	'use strict';

	var __log = console.log.bind(console);

	function log() {
		__log.apply(undefined, arguments);
	}

	var module = angular.module('angular-historical-back', []);

	module.provider('ngHistoricalBack', function () {

		stateDecorator.$inject = ["$delegate", "$rootScope", "ngHistoricalBack"];
		function stateDecorator($delegate, $rootScope, ngHistoricalBack) {
			log("lol decorating");
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
			 *
			 * @returns {{name: T, param: T}}
			 */
			function pop() {
				var name = routeStack.pop();
				if (name)
					return lastPopped = {
						name: name,
						param: paramStack.pop()
					};
				else
					return undefined;
			}

			/**
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
				pop: pop
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

})(angular);