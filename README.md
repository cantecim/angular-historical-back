## Welcome

Have you ever tried to go back to previous state ? Probably yes, and probably you beat it. There is a problem if you have more than one back button in a row.
Imagine you have 3 pages and they have back buttons. You will load the page A, then go to B, then C. So press the back button you will go to B
So now which is the previous page ? You are saying A but no. It's C because you asked for previous state.

This small library brings the navigation stack to you.

## Installation
bower install angular-historical-back or npm install angular-historical-back
Load the index.js into the page or bundled js file

## Usage
Use the historical-back directive as an attribute in any element. It will turn that element into button that goes to previous page on the stack
