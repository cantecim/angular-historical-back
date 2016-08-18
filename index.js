(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else
    factory();
})(function() {
  'use strict';
  var _ = require('lodash');

  var __log = console.log.bind(console);

  function log() {
    return;
    __log.apply(undefined, arguments);
  }

  var module = angular.module('angular-historical-back', []);

  module.service('ngHistoricalBackUtils', ["$state", "ngHistoricalBack", function($state, ngHistoricalBack) {

    function goBack(prev, parent) {
      var parsedPrev = ngHistoricalBack.parsePreviousState();
      prev = _.defaultTo(prev, parsedPrev.prev);
      parent = _.defaultTo(parent, parsedPrev.parent);

      if (prev) {
        ngHistoricalBack.backButtonPressed();
        $state.go(prev.name, prev.param, {
          reload: (parent.length) ? parent : true
        });
      }
    }

    return {
      goBack: goBack
    };

  }]);

  module.provider('ngHistoricalBack', function() {

    stateDecorator.$inject = ["$delegate", "$rootScope", "ngHistoricalBack"];
    function stateDecorator($delegate, $rootScope, ngHistoricalBack) {
      log("decorating");
      $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
        ngHistoricalBack.push(toState, toParams, fromState, fromParams);
      });

      return $delegate;
    }

    this.$get = [function ngHistoricalBackFactory() {
      var routeStack = [],
        paramStack = [],
        ARRAY_CAP = 15;

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
          return {
            name: name,
            param: _.last(paramStack)
          };

        return undefined;
      }

      /**
       * internal push function
       *
       * @param name
       * @param params
       * @private
       */
      function __push(name, params) {
        routeStack.push(name);
        paramStack.push(params);
        if (routeStack.length > ARRAY_CAP) {
          _.drop(routeStack, routeStack.length - ARRAY_CAP);
          _.drop(paramStack, paramStack.length - ARRAY_CAP);
        }
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
        if (__backButtonPressed) {
          __backButtonPressed = false;

          realPop();
        } else if (fromState.name.length) {
          __push(fromState.name, fromParams);
        }
      }

      var __backButtonPressed = false;

      function backButtonPressed() {
        __backButtonPressed = true;
      }

      function parsePreviousState() {
        var prev = pop(),
          parent = (prev) ? prev.name.split('.') : [];
        if (parent) {
          parent.splice(parent.length - 1, 1);
          parent = parent.join('.');
        }

        return {
          prev: prev,
          parent: parent
        }
      }

      return {
        push: push,
        pop: pop,
        realPop: realPop,
        backButtonPressed: backButtonPressed,
        parsePreviousState: parsePreviousState
      };

    }],

      this.decorate = function decorate($provide) {
        $provide.decorator("$state", stateDecorator)
      };

  });

  module.directive('historicalBack', ['ngHistoricalBack', 'ngHistoricalBackUtils', function(ngHistoricalBack, ngHistoricalBackUtils) {
    function postLink(scope, el, attrs) {
      var parsedPrev = ngHistoricalBack.parsePreviousState();
      var reloadOption = attrs.historicalBack,
        prev = parsedPrev.prev,
        parent = parsedPrev.parent;

      if (reloadOption)
        parent = reloadOption;

      if (prev) {
        el.on('click', function() {
          ngHistoricalBackUtils.goBack(prev, parent);
        });
      } else {
        el.remove();
      }
    }

    return {
      restrict: 'A',
      link: postLink
    };
  }])
});
