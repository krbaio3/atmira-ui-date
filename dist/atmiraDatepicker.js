(function () {
	'use strict';
	angular
	.module("atmira.ui.date", [])
	.component('atDate', {
		bindings: {
			atPlaceholder:'@',
			atRequired: "<",
			atDisabled: "<",
			format: "@",
			viewFormat: "@",
			locale: "@",
			viewValue: "@",
			invalid: '=',
			selected: '=?ngModel',
		},
		controller: datePickerCtrl,
		templateUrl: 'bower_components/atmira-ui-date/dist/atmiraDatepicker.html'
	});

	function datePickerCtrl($scope,$element, $timeout) {
		/* jshint validthis: true */
		var vm = this;
		vm.format = vm.format !== undefined ? vm.format : 'YYYY-MM-DD';
		vm.viewFormat = vm.viewFormat !== undefined ? vm.viewFormat : 'DD/MM/YYYY';
		vm.locale = vm.locale !== undefined ? vm.locale : 'es';
		// vm.firstWeekDaySunday = vm.$eval(attrs.firstWeekDaySunday) || false;
		vm.atPlaceholder = vm.atPlaceholder !== undefined ? vm.atPlaceholder : null;
		vm.viewValue = vm.viewValue !== undefined ? vm.viewValue : null;


		vm.invalid = (vm.selected !== undefined || vm.selected !== '') ? false : true;
		var required = null;

		vm.calendarOpened = false;
		vm.days = [];
		vm.dayNames = [];
		vm.pYear = '';
		vm.nYear = '';
		vm.close = true;
		var empty;
		moment.updateLocale('es', {
			weekdaysMin : ['D','L', 'M', 'M', 'J', 'V', 'S']
		});

		vm.$onChanges = function (changesObj) {
			if (changesObj.hasOwnProperty('atRequired')){
				required = vm.atRequired;
				if(changesObj.atRequired.hasOwnProperty('currentValue')){
					if(!changesObj.atRequired.currentValue){
						if(empty){
							vm.invalid = false;
						}
					}
				}
			}
		};

		//comprobaciones de fecha valida
		var pattern = /^([0-2]\d|3[0-1])\/(0\d|1[0-2])\/[1-2]\d\d\d/;
		var el = angular.element($element).find('input');
		el.on('keyup', function(e){
			if(e.which !== 8) {
				var numChars = el[0].value.length;
				if(numChars === 2 || numChars === 5){
					var thisVal = el[0].value;
					thisVal += '/';
					el[0].value = thisVal;
				}
			}
			empty = el[0].value.length === 0 ? true : false;
			var macth = pattern.test(vm.viewValue);
			var date ={
				day: null,
				month: null,
				year: null
			};
			$scope.$apply(function(){
				vm.selected = vm.viewValue;
				vm.invalid = macth ? false : true;
				if(macth){
					var dateSplited = vm.viewValue.split('/');
					date.day = dateSplited[0];
					date.month = dateSplited[1];
					date.year = dateSplited[2];
					var selectedDate = moment(date.day + '.' + date.month + '.' + date.year, 'DD/MM/YYYY');
					vm.selected = selectedDate.format(vm.format);
					vm.atRequired = false;
				}else{
					console.log('entro');
					vm.atRequired = required ? true: false;
				}

				if(empty && vm.atRequired === true){
					vm.invalid = true;
				}
				if(empty && vm.atRequired === false){
					vm.invalid = false;
				}
			});
		});

		moment.locale(vm.locale);
		var date = moment();

		var generateCalendar = function (date) {
			//set de date vm.dateValue if you click in a day
			// function setDatevalue() {
			// 	// number of currently month -1
			// 	var p= date.month();
			// 	//number of currently month +1
			// 	var q = p+1;
			// 	//number of selected month
			// 	var w = vm.viewValue2;
			// 	//if selected month exist
			// 	if(w){
			// 		//if selected month exist and is less than currently Month
			// 		if(w<q){
			// 			// check for selected month if equal to 1 January
			// 			if(w == 1){
			// 				date.add(1,'M');
			// 				vm.dateValue = date.format('MMMM YYYY');
			// 			}else{
			// 				date.subtract(1,'M');
			// 				vm.dateValue = date.format('MMMM YYYY');
			// 			}
			//
			// 		}else if(w>q){
			// 			if(q == 1 && w ==12){
			// 				date.subtract(1,'M');
			// 				vm.dateValue = date.format('MMMM YYYY');
			// 			}else{
			// 				date.add(1,'M');
			// 				vm.dateValue = date.format('MMMM YYYY');
			// 			}
			// 		}else if (w == q){
			// 			vm.dateValue = date.format('MMMM YYYY');
			// 		}
			// 	}else{
			// 		vm.dateValue = date.format('MMMM YYYY');
			// 	}
			// };
			// 	setDatevalue();
			vm.dateValue = date.format('MMMM YYYY');

			var currentDay = moment().format('D');
			var currentMonth = moment().format('M');
			var currentYear = moment().format('Y');
			var lastDayOfMonth = date.endOf('month').date();

			var LastMonth = date.month();
			var	currentlyMonth = LastMonth +1;
			var nextMonth = LastMonth +2;

			var year = date.year();
			var	n = 1;
			vm.pYear = year-1;
			vm.nYear = year+1;
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

			var firstWeekDay = vm.firstWeekDaySunday === true ? date.set('date', 2	).day() : date.set('date', 1).day();
			if (firstWeekDay !== 1) {
				n -= firstWeekDay - 1;
			}

			//Code to fix date issue
			if(n===2){
				n = -5;
			}

			vm.days = [];
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
							vm.days.push({day: i, month: currentlyMonth, year: year, enabled: true, class: 'weekendCurrent'});
						}else{
							vm.days.push({day: i, month: currentlyMonth, year: year, enabled: false, class: 'weekend'});
						}
						//Dias mes actual y fin de semana
					}else{
						//Dias mes actual entre semana
						if(currentDay == i && currentMonth == currentlyMonth && currentYear == year){
							vm.days.push({day: i, month: currentlyMonth, year: year, enabled: true, class: 'inMonthCurrent'});
						}else{
							vm.days.push({day: i, month: currentlyMonth, year: year, enabled: true, class: 'inMonth'});
						}
					}
				} else if(i<=0){
					//Dias mes anterior
					vm.days.push({day: i + daysPrevMonth, month: LastMonth, year: year, enabled: true, class: 'outMonth'});
				}else{
					//Dias mes siguiente
					vm.days.push({day: i - lastDayOfMonth, month: nextMonth, year: year, enabled: true, class: 'outMonth'});
				}
			}
		};

		var generateDayNames = function () {
			var date = vm.firstWeekDaySunday === true ?  moment('2015-06-07') : moment('2015-06-01');
			for (var i = 0; i < 7; i += 1) {
				vm.dayNames.push(date.format('dd'));
				date.add('1', 'd');
			}
		};

		generateDayNames();
		vm.showCalendar = function () {
			if(vm.calendarOpened){
				vm.calendarOpened = false;
			}else{
				vm.calendarOpened = true;
				date = moment();
				generateCalendar(date);
			}
		};

		vm.closeCalendar = function () {
			if(vm.close){
				vm.calendarOpened = false;
			}else{
				return;
			}

		};
		var setClose = function () {
			var button = angular.element($element).find('button');
			button[0].focus();
			vm.close = true;
		}
		vm.prevYear = function () {
			date.subtract(1, 'Y');
			generateCalendar(date);
			vm.close = false;
			$timeout(setClose, 500);
		};

		vm.prevMonth = function () {
			date.subtract(1, 'M');
			generateCalendar(date);
			vm.close = false;
			$timeout(setClose, 500);
		};

		vm.nextMonth = function () {
			date.add(1, 'M');
			generateCalendar(date);
			vm.close = false;
			$timeout(setClose, 500);

		};

		vm.nextYear = function () {
			date.add(1, 'Y');
			generateCalendar(date);
			vm.close = false;
			$timeout(setClose, 500);
		};

		vm.selectDate = function (event, date) {
			event.preventDefault();
			var selectedDate = moment(date.day + '.' + date.month + '.' + date.year, 'DD/MM/YYYY');
			vm.selected = selectedDate.format(vm.format);
			vm.viewValue = selectedDate.format(vm.viewFormat);
			vm.viewValue2 = selectedDate.format('M');
			vm.close = true;
			vm.invalid = false;
			vm.atRequired = false;
			vm.closeCalendar();
		};

	}

})();
