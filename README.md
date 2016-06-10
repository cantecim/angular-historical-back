## Welcome

Have you ever tried to go back to previous state ? Probably yes, and probably you beat it.  
There is a problem if you have more than one back button in a row.  
Imagine you have 3 pages and they have back buttons. You will load the page A, then go to B, then C. So press the back button you will go to B  
So now which is the previous page ? You are saying A but no. It's C because you asked for previous state at B. You came B from C :)

This small library brings the navigation stack to you. Prevents nagivation loops like above example

## Installation
bower install angular-historical-back or npm install angular-historical-back
Load the dist.min.js into the page or bundled js file

## Usage
* You are going to configure your app like below in the config phase. One line It's simple
```javascript
(function () {
	'use strict';

    angular.module('app').config(HistoricalBack);

    HistoricalBack.$inject = ["$provide", "ngHistoricalBackProvider"];

    function HistoricalBack($provide, ngHistoricalBackProvider) {
        ngHistoricalBackProvider.decorate($provide);
    }

})();
```
* Use the historical-back directive as an attribute in any element. It will turn that element into button that goes to previous page on the stack, additionally the attribute accepts parameters to specify reload option of $state.go

## License
MIT

## Contributions
All are welcome.
