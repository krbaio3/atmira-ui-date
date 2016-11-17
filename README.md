Atmira Datepicker Component.

inject in your module angular.module('myapp', ['atmira-ui-date']);

inject in your html<at-date ng-model="ctrl.date2" locale="es" format="DD/MM/YYYY" view-format="DD/MM/YYYY"></at-date>

-- use ng-model to get the value.
-- use locale to set the language. Default set to Spanish
-- use format to format the date and view-format to view the date in that format.

include moment-with-locale.js in your index.html

put it whereever you want it.
