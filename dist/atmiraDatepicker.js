angular.module('atmira.ui.date', [])

.directive('atDate', ['$timeout', function($timeout) {
	'use strict';

	var setScopeValues = function (scope, attrs) {

		scope.format = attrs.format || 'YYYY-MM-DD';
		scope.viewFormat = attrs.viewFormat || 'Do MMMM YYYY';
		scope.locale = attrs.locale || 'es';
		scope.firstWeekDaySunday = scope.$eval(attrs.firstWeekDaySunday) || false;
		scope.viewPlaceholder = attrs.placeholder || null;
		scope.viewValue = attrs.value || null;
	};

	return {
		restrict: 'EA',
		require: '?ngModel',
		scope: {},
		templateUrl:'bower_components/atmira-ui-date/dist/atmiraDatepicker.html',
		link: function (scope, element, attrs, ngModel) {

			var inputDate = angular.element(element).find('input');

			inputDate[0].addEventListener('keyup', function () {

				if(inputDate[0].value.length === 2){
					inputDate[0].value += '/';
				}else if(inputDate[0].value.length > 2 && inputDate[0].value.length === 5){
					inputDate[0].value += '/';
				}else if(inputDate[0].value.length>5 && inputDate[0].value.length===10){
					inputDate[0].blur();
				}
			});


			setScopeValues(scope, attrs);

			scope.calendarOpened = false;
			scope.days = [];
			scope.dayNames = [];
			scope.viewValue = scope.viewValue;
			scope.viewValue2 = null;
			scope.dateValue = null;
			scope.pYear = '';
			scope.nYear = '';
			scope.close = true;

			moment.updateLocale('es', {
				weekdaysMin : ['D','L', 'M', 'M', 'J', 'V', 'S']
			});


			moment.locale(scope.locale);
			var date = moment();

			var generateCalendar = function (date) {
				//set de date scope.dateValue if you click in a day
				function setDatevalue() {
					// number of currently month -1
					var p= date.month();
					//number of currently month +1
					var q = p+1;
					//number of selected month
					var w = scope.viewValue2;
					//if selected month exist
					if(w){
						//if selected month exist and is less than currently Month
						if(w<q){
							//check for selected month if equal to 1 January
							if(w == 1){
								date.add(1,'M');
								scope.dateValue = date.format('MMMM YYYY');
							}else{
								date.subtract(1,'M');
								scope.dateValue = date.format('MMMM YYYY');
							}

						}else if(w>q){
							if(q == 1 && w ==12){
								date.subtract(1,'M');
								scope.dateValue = date.format('MMMM YYYY');
							}else{
								date.add(1,'M');
								scope.dateValue = date.format('MMMM YYYY');
							}
						}else if (w == q){
							scope.dateValue = date.format('MMMM YYYY');
						}
					}else{
						scope.dateValue = date.format('MMMM YYYY');
					}
				};
			//	setDatevalue();
			scope.dateValue = date.format('MMMM YYYY');

				var currentDay = moment().format('D');
				var currentMonth = moment().format('M');
				var currentYear = moment().format('Y');
				var lastDayOfMonth = date.endOf('month').date();

				var LastMonth = date.month();
				console.log(LastMonth);
				var	currentlyMonth = LastMonth +1;
				var nextMonth = LastMonth +2;

				var year = date.year();
				var	n = 1;
				scope.pYear = year-1;
				scope.nYear = year+1;
				//code to fix issues
				function setDate() {
					//months
					if(nextMonth == 13){
						nextMonth = 1;
						if(nextMonth == 2){
							year +=1;
						}
					}else if(LastMonth == 0){
						LastMonth = 12;
						if(LastMonth == 11){
							year -= 1;
						}
					}
				}
				setDate();

				var firstWeekDay = scope.firstWeekDaySunday === true ? date.set('date', 2	).day() : date.set('date', 1).day();
				if (firstWeekDay !== 1) {
					n -= firstWeekDay - 1;
				}

				//Code to fix date issue
				if(n===2){
					n = -5;
				}

				scope.days = [];
				var daysPrevMonth = 0;
				var totalDays = 0;
				function getLastDayofMonth() {
					var x;
					date.subtract(1, 'M');
					x = date.endOf('month').date();
					date.add(1,'M');
					return x;
				}

				function getDaysNextMonth() {
					var y;
					y = 7 - (date.clone().date(lastDayOfMonth).format('d'));
					return y;
				}
				function getTotalDaysToPrint() {
					var a = getDaysNextMonth();
					if(a === 7){
						totalDays = lastDayOfMonth;
					}else{
						totalDays = lastDayOfMonth + a;
					}
				}
				getTotalDaysToPrint();

				daysPrevMonth = getLastDayofMonth();
				for (var i = n; i <= totalDays; i += 1) {
					if (i > 0 && i <= lastDayOfMonth) {
						// Dias mes actual
						var w = date.clone().date(i).format('d');
						if(w === '6' || w === '0'){
							if(currentDay == i && currentMonth == currentlyMonth && currentYear == year){
								scope.days.push({day: i, month: currentlyMonth, year: year, enabled: true, class: 'weekendCurrent'});
							}else{
								scope.days.push({day: i, month: currentlyMonth, year: year, enabled: false, class: 'weekend'});
							}
							//Dias mes actual y fin de semana
						}else{
							//Dias mes actual entre semana
							if(currentDay == i && currentMonth == currentlyMonth && currentYear == year){
								scope.days.push({day: i, month: currentlyMonth, year: year, enabled: true, class: 'inMonthCurrent'});
							}else{
								scope.days.push({day: i, month: currentlyMonth, year: year, enabled: true, class: 'inMonth'});
							}
						}
					} else if(i<=0){
						//Dias mes anterior
						scope.days.push({day: i + daysPrevMonth, month: LastMonth, year: year, enabled: true, class: 'outMonth'});
					}else{
						//Dias mes siguiente
						scope.days.push({day: i - lastDayOfMonth, month: nextMonth, year: year, enabled: true, class: 'outMonth'});
					}
				}
			};

			var generateDayNames = function () {
				var date = scope.firstWeekDaySunday === true ?  moment('2015-06-07') : moment('2015-06-01');
				for (var i = 0; i < 7; i += 1) {
					scope.dayNames.push(date.format('dd'));
					date.add('1', 'd');
				}
			};

			generateDayNames();
			scope.showCalendar = function () {
				if(scope.calendarOpened){
					scope.calendarOpened = false;
				}else{
					scope.calendarOpened = true;
					date = moment();
					generateCalendar(date);
				}
			};

			scope.closeCalendar = function () {
				if(scope.close){
					scope.calendarOpened = false;
				}else{
					return;
				}

			};
			var setClose = function () {
				var button = angular.element(element).find('button');
				button[0].focus();
				scope.close = true;
			}
			scope.prevYear = function () {
				date.subtract(1, 'Y');
				generateCalendar(date);
				scope.close = false;
				$timeout(setClose, 500);
			};

			scope.prevMonth = function () {
				date.subtract(1, 'M');
				generateCalendar(date);
				scope.close = false;
				$timeout(setClose, 500);
			};

			scope.nextMonth = function () {
				date.add(1, 'M');
				generateCalendar(date);
				scope.close = false;
				$timeout(setClose, 500);

			};

			scope.nextYear = function () {
				date.add(1, 'Y');
				generateCalendar(date);
				scope.close = false;
				$timeout(setClose, 500);
			};

			scope.selectDate = function (event, date) {
				event.preventDefault();
				var selectedDate = moment(date.day + '.' + date.month + '.' + date.year, 'DD/MM/YYYY');
				ngModel.$setViewValue(selectedDate.format(scope.format));
				scope.viewValue = selectedDate.format(scope.viewFormat);
				scope.viewValue2 = selectedDate.format('M');
				scope.close = true;
				scope.closeCalendar();
			};



		}
	};



}]);
