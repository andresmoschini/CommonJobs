/* =========================================================
 * MomentDatepicker 
 * Based on http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Copyright 2012 Andres Moschini 
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

!function ($) {

    // Picker object

    var Datepicker = function (element, options) {
        this.element = $(element);
        this.format = options.format || this.element.data('date-format') || 'MM/DD/YYYY';
        this.picker = $(DPGlobal.template)
							.appendTo('body')
							.on({
							    click: $.proxy(this.click, this),
							    mousedown: $.proxy(this.mousedown, this)
							});
        this.isInput = this.element.is('input');
        this.component = this.element.is('.date') ? this.element.find('.add-on') : false;

        if (this.isInput) {
            this.element.on({
                focus: $.proxy(this.show, this),
                blur: $.proxy(this.hide, this),
                keyup: $.proxy(function () { this.update(); }, this)
            });
        } else {
            if (this.component) {
                this.component.on('click', $.proxy(this.show, this));
            } else {
                this.element.on('click', $.proxy(this.show, this));
            }
        }
        this.minViewMode = options.minViewMode || this.element.data('date-minviewmode') || 0;
        if (typeof this.minViewMode === 'string') {
            switch (this.minViewMode) {
                case 'months':
                    this.minViewMode = 1;
                    break;
                case 'years':
                    this.minViewMode = 2;
                    break;
                default:
                    this.minViewMode = 0;
                    break;
            }
        }
        this.viewMode = options.viewMode || this.element.data('date-viewmode') || 0;
        if (typeof this.viewMode === 'string') {
            switch (this.viewMode) {
                case 'months':
                    this.viewMode = 1;
                    break;
                case 'years':
                    this.viewMode = 2;
                    break;
                default:
                    this.viewMode = 0;
                    break;
            }
        }
        this.startViewMode = this.viewMode;
        this.weekStart = options.weekStart || this.element.data('date-weekstart') || 0;
        this.weekEnd = this.weekStart === 0 ? 6 : this.weekStart - 1;
        this.fillDow();
        this.fillMonths();
        this.update();
        this.showMode();
    };

    Datepicker.prototype = {
        constructor: Datepicker,
        getMoment: function () {
            return this.moment ? this.moment.clone() : null;
        },
        getDate: function () {
            return this.moment ? this.moment.toDate() : null;
        },
        getFormated: function () {
            return this.moment ? this.moment.format(this.format) : "";
        },
        getIso: function () {
            return this.moment ? this.moment.format('YYYY-MM-DDT00:00:00') : null;
        },
        getValueOf: function () {
            return this.moment ? this.moment.valueOf() : null;
        },
        show: function (e) {
            this.picker.show();
            this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
            this.place();
            $(window).on('resize', $.proxy(this.place, this));
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            if (!this.isInput) {
                $(document).on('mousedown', $.proxy(this.hide, this));
            }
            this.element.trigger({
                type: 'show'
            });
        },

        hide: function () {
            this.picker.hide();
            $(window).off('resize', this.place);
            this.viewMode = this.startViewMode;
            this.showMode();
            if (!this.isInput) {
                $(document).off('mousedown', this.hide);
            }
            this.set();
            this.element.trigger({
                type: 'hide'
            });
        },

        set: function (newDate) {
            if (typeof newDate !== 'undefined') {
                this.update(newDate);
            }
            var formated = this.getFormated();

            if (!this.isInput) {
                if (this.component) {
                    this.element.find('input').prop('value', formated);
                }
                this.element.data('date', formated);
            } else {
                this.element.prop('value', formated);
            }
        },
        
        place: function () {
            var offset = this.component ? this.component.offset() : this.element.offset();
            this.picker.css({
                top: offset.top + this.height,
                left: offset.left
            });
        },

        update: function (newDate) {
            var originalValue = this.getValueOf();

            var date = typeof newDate === 'undefined'
                ? (this.isInput ? this.element.prop('value') : this.element.data('date'))
                : newDate;

            this.moment = DPGlobal.parseDate(
				date,
				this.format
			);

            var newValue = this.getValueOf();
            
            if (!this.viewDate || originalValue != newValue) {
                this.viewDate = this.getMoment() || moment().hours(0).minutes(0).seconds(0).milliseconds(0);
                this.fill();
                this.element.trigger({
                    type: 'changeDate'
                });
            }
        },

        fillDow: function () {
            var dowCnt = this.weekStart;
            var html = '<tr>';
            var daysMin = moment.weekdaysMin;
            while (dowCnt < this.weekStart + 7) {
                html += '<th class="dow">' + daysMin[(dowCnt++) % 7] + '</th>';
            }
            html += '</tr>';
            this.picker.find('.datepicker-days thead').append(html);
        },

        fillMonths: function () {
            var html = '';
            var i = 0
            var monthsShort = moment.monthsShort;
            while (i < 12) {
                html += '<span class="month">' + monthsShort[i++] + '</span>';
            }
            this.picker.find('.datepicker-months td').append(html);
        },

        fill: function () {
            var year = this.viewDate.year();
            var month = this.viewDate.month();
            var currentMoment = this.getMoment();
            var currentDate = currentMoment ? currentMoment.valueOf() : null; //TODO: use diff
            var currentYear = currentMoment ? currentMoment.year() : null;
            var currentMonth = currentMoment ? currentMoment.month() : null;
            
            this.picker.find('.datepicker-days th:eq(1)')
						.text(moment.months[month] + ' ' + year);

            var prevMonth = moment([year, month, 0]);
            prevMonth.day(prevMonth.day() - (prevMonth.day() - this.weekStart + 7) % 7);

            //TODO: use diff
            var nextMonthVal = moment(prevMonth).add('days', 42).valueOf();

            html = [];
            var clsName;
            //TODO: use diff
            while (prevMonth.valueOf() < nextMonthVal) {
                if (prevMonth.day() === this.weekStart) {
                    html.push('<tr>');
                }
                clsName = '';
                //TODO: use diff
                if (prevMonth.month() < month) {
                    clsName += ' old';
                } else if (prevMonth.month() > month) {
                    clsName += ' new';
                }
                //TODO: use diff
                if (prevMonth.valueOf() === currentDate) {
                    clsName += ' active';
                }
                html.push('<td class="day' + clsName + '">' + prevMonth.date() + '</td>');
                if (prevMonth.day() === this.weekEnd) {
                    html.push('</tr>');
                }
                prevMonth.add('days', 1);
            }
            this.picker.find('.datepicker-days tbody').empty().append(html.join(''));

            var months = this.picker.find('.datepicker-months')
						.find('th:eq(1)')
							.text(year)
							.end()
						.find('span').removeClass('active');
            if (currentYear === year) {
                months.eq(currentMonth).addClass('active');
            }

            html = '';
            year = parseInt(year / 10, 10) * 10;
            var yearCont = this.picker.find('.datepicker-years')
								.find('th:eq(1)')
									.text(year + '-' + (year + 9))
									.end()
								.find('td');
            year -= 1;
            for (var i = -1; i < 11; i++) {
                html += '<span class="year' + (i === -1 || i === 10 ? ' old' : '') + (currentYear === year ? ' active' : '') + '">' + year + '</span>';
                year += 1;
            }
            yearCont.html(html);
        },

        click: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.target).closest('span, td, th');
            if (target.length === 1) {
                switch (target[0].nodeName.toLowerCase()) {
                    case 'th':
                        switch (target[0].className) {
                            case 'switch':
                                this.showMode(1);
                                break;
                            case 'prev':
                            case 'next':
                                var nav = DPGlobal.modes[this.viewMode];
                                this.viewDate.add(nav.navFnc, nav.navStep * (target[0].className === 'prev' ? -1 : 1));
                                this.fill();
                                this.set();
                                break;
                        }
                        break;
                    case 'span':
                        if (target.is('.month')) {
                            
                            var newMonth = target.parent().find('span').index(target);
                            //this.viewDate.month(newMonth); I do not like how it works when the new month have less days
                            this.viewDate.add('months', newMonth - this.viewDate.month());

                        } else {
                            var year = parseInt(target.text(), 10) || 0;
                            this.viewDate.year(year);
                        }
                        
                        if (this.viewMode !== 0) {
                            this.showMode(-1);
                            this.set(this.viewDate);
                        } else {
                            //Cuando ocurre?
                            this.showMode(-1);
                            this.fill();
                            this.set();
                        }
                        
                        break;
                    case 'td':
                        if (target.is('.day')) {
                            var day = parseInt(target.text(), 10) || 1;
                            var month = this.viewDate.month();
                            if (target.is('.old')) {
                                month -= 1;
                            } else if (target.is('.new')) {
                                month += 1;
                            }
                            var year = this.viewDate.year();
                            this.set([year, month, day]);
                        }
                        break;
                }
            }
        },

        mousedown: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },

        showMode: function (dir) {
            if (dir) {
                this.viewMode = Math.max(this.minViewMode, Math.min(2, this.viewMode + dir));
            }
            this.picker.find('>div').hide().filter('.datepicker-' + DPGlobal.modes[this.viewMode].clsName).show();
        }
    };

    $.fn.datepicker = function (option, val) {
        var results = [];
        var chain = this.each(function () {
            var $this = $(this),
				data = $this.data('datepicker'),
				options = typeof option === 'object' && option;
            if (typeof option === 'string') {
                if (data) {
                    var result = data[option](val);
                    if (typeof result !== 'undefined')
                        results.push(result);
                }
            } else if (!data) {
                $this.data('datepicker', (data = new Datepicker(this, $.extend({}, $.fn.datepicker.defaults, options))));
            }
        });
        return results.length == 1 ? results[0]
            : results.length ? results
            : chain;
    };

    $.fn.datepicker.defaults = {
    };
    $.fn.datepicker.Constructor = Datepicker;

    var DPGlobal = {
        modes: [
			{
			    clsName: 'days',
			    navFnc: 'months',
			    navStep: 1
			},
			{
			    clsName: 'months',
			    navFnc: 'years',
			    navStep: 1
			},
			{
			    clsName: 'years',
			    navFnc: 'years',
			    navStep: 10
			}],
        parseDate: function (value, format) {
            var mmnt = null;
            if (typeof value === "string") {
                mmnt = moment(value, format);
            }
            if (!mmnt || !mmnt.isValid()) {
                mmnt = moment(value);
            }
            if (!mmnt || !mmnt.isValid()) {
                return null;
            }
            return mmnt.hours(0).minutes(0).seconds(0).milliseconds(0);
        },
        headTemplate: '<thead>' +
							'<tr>' +
								'<th class="prev">&lsaquo;</th>' +
								'<th colspan="5" class="switch"></th>' +
								'<th class="next">&rsaquo;</th>' +
							'</tr>' +
						'</thead>',
        contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>'
    };
    DPGlobal.template = '<div class="datepicker dropdown-menu">' +
							'<div class="datepicker-days">' +
								'<table class=" table-condensed">' +
									DPGlobal.headTemplate +
									'<tbody></tbody>' +
								'</table>' +
							'</div>' +
							'<div class="datepicker-months">' +
								'<table class="table-condensed">' +
									DPGlobal.headTemplate +
									DPGlobal.contTemplate +
								'</table>' +
							'</div>' +
							'<div class="datepicker-years">' +
								'<table class="table-condensed">' +
									DPGlobal.headTemplate +
									DPGlobal.contTemplate +
								'</table>' +
							'</div>' +
						'</div>';

}(window.jQuery)