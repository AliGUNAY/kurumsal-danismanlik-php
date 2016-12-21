/* 20-08-2015 */
//! moment.js
//! version : 2.7.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (undefined) {

    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = "2.7.0",
        // the global-scope this is NOT the global object in Node.js
        globalScope = typeof global !== 'undefined' ? global : this,
        oldGlobalMoment,
        round = Math.round,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for language config files
        languages = {},

        // moment internal properties
        momentProperties = {
            _isAMomentObject: null,
            _i : null,
            _f : null,
            _l : null,
            _strict : null,
            _tzm : null,
            _isUTC : null,
            _offset : null,  // optional. Combine with _isUTC
            _pf : null,
            _lang : null  // optional
        },

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,

        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
        parseTokenOrdinal = /\d{1,2}/,

        //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],
            ['YYYY-DDD', /\d{4}-\d{3}/]
        ],

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        },

        unitAliases = {
            ms : 'millisecond',
            s : 'second',
            m : 'minute',
            h : 'hour',
            d : 'day',
            D : 'date',
            w : 'week',
            W : 'isoWeek',
            M : 'month',
            Q : 'quarter',
            y : 'year',
            DDD : 'dayOfYear',
            e : 'weekday',
            E : 'isoWeekday',
            gg: 'weekYear',
            GG: 'isoWeekYear'
        },

        camelFunctions = {
            dayofyear : 'dayOfYear',
            isoweekday : 'isoWeekday',
            isoweek : 'isoWeek',
            weekyear : 'weekYear',
            isoweekyear : 'isoWeekYear'
        },

        // format function strings
        formatFunctions = {},

        // default relative time thresholds
        relativeTimeThresholds = {
          s: 45,   //seconds to minutes
          m: 45,   //minutes to hours
          h: 22,   //hours to days
          dd: 25,  //days to month (month == 1)
          dm: 45,  //days to months (months > 1)
          dy: 345  //days to year
        },

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.lang().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.lang().months(this, format);
            },
            D    : function () {
                return this.date();
            },
            DDD  : function () {
                return this.dayOfYear();
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return this.lang().weekdaysMin(this, format);
            },
            ddd  : function (format) {
                return this.lang().weekdaysShort(this, format);
            },
            dddd : function (format) {
                return this.lang().weekdays(this, format);
            },
            w    : function () {
                return this.week();
            },
            W    : function () {
                return this.isoWeek();
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY : function () {
                return leftZeroFill(this.year(), 5);
            },
            YYYYYY : function () {
                var y = this.year(), sign = y >= 0 ? '+' : '-';
                return sign + leftZeroFill(Math.abs(y), 6);
            },
            gg   : function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg : function () {
                return leftZeroFill(this.weekYear(), 4);
            },
            ggggg : function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG   : function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 4);
            },
            GGGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e : function () {
                return this.weekday();
            },
            E : function () {
                return this.isoWeekday();
            },
            a    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return toInt(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS  : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z    : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ":" + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ   : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z : function () {
                return this.zoneAbbr();
            },
            zz : function () {
                return this.zoneName();
            },
            X    : function () {
                return this.unix();
            },
            Q : function () {
                return this.quarter();
            }
        },

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];

    // Pick the first defined of two or three arguments. dfl comes from
    // default.
    function dfl(a, b, c) {
        switch (arguments.length) {
            case 2: return a != null ? a : b;
            case 3: return a != null ? a : b != null ? b : c;
            default: throw new Error("Implement me");
        }
    }

    function defaultParsingFlags() {
        // We need to deep clone this object, and es5 standard is not very
        // helpful.
        return {
            empty : false,
            unusedTokens : [],
            unusedInput : [],
            overflow : -2,
            charsLeftOver : 0,
            nullInput : false,
            invalidMonth : null,
            invalidFormat : false,
            userInvalidated : false,
            iso: false
        };
    }

    function deprecate(msg, fn) {
        var firstTime = true;
        function printMsg() {
            if (moment.suppressDeprecationWarnings === false &&
                    typeof console !== 'undefined' && console.warn) {
                console.warn("Deprecation warning: " + msg);
            }
        }
        return extend(function () {
            if (firstTime) {
                printMsg();
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.lang().ordinal(func.call(this, a), period);
        };
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    /************************************
        Constructors
    ************************************/

    function Language() {

    }

    // Moment prototype object
    function Moment(config) {
        checkOverflow(config);
        extend(this, config);
    }

    // Duration Constructor
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._bubble();
    }

    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }

        if (b.hasOwnProperty("toString")) {
            a.toString = b.toString;
        }

        if (b.hasOwnProperty("valueOf")) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function cloneMoment(m) {
        var result = {}, i;
        for (i in m) {
            if (m.hasOwnProperty(i) && momentProperties.hasOwnProperty(i)) {
                result[i] = m[i];
            }
        }

        return result;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    // helper function for _.addTime and _.subtractTime
    function addOrSubtractDurationFromMoment(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            rawSetter(mom, 'Date', rawGetter(mom, 'Date') + days * isAdding);
        }
        if (months) {
            rawMonthSetter(mom, rawGetter(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            moment.updateOffset(mom, days || months);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return  Object.prototype.toString.call(input) === '[object Date]' ||
                input instanceof Date;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (inputObject.hasOwnProperty(prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment.fn._lang[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment.fn._lang, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function weeksInYear(year, dow, doy) {
        return weekOfYear(moment([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                m._a[HOUR] < 0 || m._a[HOUR] > 23 ? HOUR :
                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0;
            }
        }
        return m._isValid;
    }

    function normalizeLanguage(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function makeAs(input, model) {
        return model._isUTC ? moment(input).zone(model._offset || 0) :
            moment(input).local();
    }

    /************************************
        Languages
    ************************************/


    extend(Language.prototype, {

        set : function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        },

        _months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort : function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse : function (monthName) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                if (!this._monthsParse[i]) {
                    mom = moment.utc([2000, i]);
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin : function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse : function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat : {
            LT : "h:mm A",
            L : "MM/DD/YYYY",
            LL : "MMMM D YYYY",
            LLL : "MMMM D YYYY LT",
            LLLL : "dddd, MMMM D YYYY LT"
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM : function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse : /[ap]\.?m?\.?/i,
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },

        _calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        calendar : function (key, mom) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom) : output;
        },

        _relativeTime : {
            future : "in %s",
            past : "%s ago",
            s : "a few seconds",
            m : "a minute",
            mm : "%d minutes",
            h : "an hour",
            hh : "%d hours",
            d : "a day",
            dd : "%d days",
            M : "a month",
            MM : "%d months",
            y : "a year",
            yy : "%d years"
        },
        relativeTime : function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },
        pastFuture : function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal : function (number) {
            return this._ordinal.replace("%d", number);
        },
        _ordinal : "%d",

        preparse : function (string) {
            return string;
        },

        postformat : function (string) {
            return string;
        },

        week : function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 1st is the first week of the year.
        },

        _invalidDate: 'Invalid date',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    // Loads a language definition into the `languages` cache.  The function
    // takes a key and optionally values.  If not in the browser and no values
    // are provided, it will load the language file module.  As a convenience,
    // this function also returns the language values.
    function loadLang(key, values) {
        values.abbr = key;
        if (!languages[key]) {
            languages[key] = new Language();
        }
        languages[key].set(values);
        return languages[key];
    }

    // Remove a language from the `languages` cache. Mostly useful in tests.
    function unloadLang(key) {
        delete languages[key];
    }

    // Determines which language definition to use and returns it.
    //
    // With no parameters, it will return the global language.  If you
    // pass in a language key, such as 'en', it will return the
    // definition for 'en', so long as 'en' has already been loaded using
    // moment.lang.
    function getLangDefinition(key) {
        var i = 0, j, lang, next, split,
            get = function (k) {
                if (!languages[k] && hasModule) {
                    try {
                        require('./lang/' + k);
                    } catch (e) { }
                }
                return languages[k];
            };

        if (!key) {
            return moment.fn._lang;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            lang = get(key);
            if (lang) {
                return lang;
            }
            key = [key];
        }

        //pick the language from the array
        //try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
        //substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
        while (i < key.length) {
            split = normalizeLanguage(key[i]).split('-');
            j = split.length;
            next = normalizeLanguage(key[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                lang = get(split.slice(0, j).join('-'));
                if (lang) {
                    return lang;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return moment.fn._lang;
    }

    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, "");
        }
        return input.replace(/\\/g, "");
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = "";
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {

        if (!m.isValid()) {
            return m.lang().invalidDate();
        }

        format = expandFormat(format, m.lang());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, lang) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return lang.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
        case 'Q':
            return parseTokenOneDigit;
        case 'DDDD':
            return parseTokenThreeDigits;
        case 'YYYY':
        case 'GGGG':
        case 'gggg':
            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
        case 'Y':
        case 'G':
        case 'g':
            return parseTokenSignedNumber;
        case 'YYYYYY':
        case 'YYYYY':
        case 'GGGGG':
        case 'ggggg':
            return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
        case 'S':
            if (strict) { return parseTokenOneDigit; }
            /* falls through */
        case 'SS':
            if (strict) { return parseTokenTwoDigits; }
            /* falls through */
        case 'SSS':
            if (strict) { return parseTokenThreeDigits; }
            /* falls through */
        case 'DDD':
            return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
            return parseTokenWord;
        case 'a':
        case 'A':
            return getLangDefinition(config._l)._meridiemParse;
        case 'X':
            return parseTokenTimestampMs;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'SSSS':
            return parseTokenDigits;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'GG':
        case 'gg':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'ww':
        case 'WW':
            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
        case 'w':
        case 'W':
        case 'e':
        case 'E':
            return parseTokenOneOrTwoDigits;
        case 'Do':
            return parseTokenOrdinal;
        default :
            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), "i"));
            return a;
        }
    }

    function timezoneMinutesFromString(string) {
        string = string || "";
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? -minutes : minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
        // QUARTER
        case 'Q':
            if (input != null) {
                datePartArray[MONTH] = (toInt(input) - 1) * 3;
            }
            break;
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            if (input != null) {
                datePartArray[MONTH] = toInt(input) - 1;
            }
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            a = getLangDefinition(config._l).monthsParse(input);
            // if we didn't find a month name, mark the date as invalid.
            if (a != null) {
                datePartArray[MONTH] = a;
            } else {
                config._pf.invalidMonth = input;
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DD
        case 'DD' :
            if (input != null) {
                datePartArray[DATE] = toInt(input);
            }
            break;
        case 'Do' :
            if (input != null) {
                datePartArray[DATE] = toInt(parseInt(input, 10));
            }
            break;
        // DAY OF YEAR
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            if (input != null) {
                config._dayOfYear = toInt(input);
            }

            break;
        // YEAR
        case 'YY' :
            datePartArray[YEAR] = moment.parseTwoDigitYear(input);
            break;
        case 'YYYY' :
        case 'YYYYY' :
        case 'YYYYYY' :
            datePartArray[YEAR] = toInt(input);
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config._isPm = getLangDefinition(config._l).isPM(input);
            break;
        // 24 HOUR
        case 'H' : // fall through to hh
        case 'HH' : // fall through to hh
        case 'h' : // fall through to hh
        case 'hh' :
            datePartArray[HOUR] = toInt(input);
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[MINUTE] = toInt(input);
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[SECOND] = toInt(input);
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'SSS' :
        case 'SSSS' :
            datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
            break;
        // UNIX TIMESTAMP WITH MS
        case 'X':
            config._d = new Date(parseFloat(input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config._useUTC = true;
            config._tzm = timezoneMinutesFromString(input);
            break;
        // WEEKDAY - human
        case 'dd':
        case 'ddd':
        case 'dddd':
            a = getLangDefinition(config._l).weekdaysParse(input);
            // if we didn't get a weekday name, mark the date as invalid
            if (a != null) {
                config._w = config._w || {};
                config._w['d'] = a;
            } else {
                config._pf.invalidWeekday = input;
            }
            break;
        // WEEK, WEEK DAY - numeric
        case 'w':
        case 'ww':
        case 'W':
        case 'WW':
        case 'd':
        case 'e':
        case 'E':
            token = token.substr(0, 1);
            /* falls through */
        case 'gggg':
        case 'GGGG':
        case 'GGGGG':
            token = token.substr(0, 2);
            if (input) {
                config._w = config._w || {};
                config._w[token] = toInt(input);
            }
            break;
        case 'gg':
        case 'GG':
            config._w = config._w || {};
            config._w[token] = moment.parseTwoDigitYear(input);
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, lang;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = dfl(w.GG, config._a[YEAR], weekOfYear(moment(), 1, 4).year);
            week = dfl(w.W, 1);
            weekday = dfl(w.E, 1);
        } else {
            lang = getLangDefinition(config._l);
            dow = lang._week.dow;
            doy = lang._week.doy;

            weekYear = dfl(w.gg, config._a[YEAR], weekOfYear(moment(), dow, doy).year);
            week = dfl(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = dfl(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
        // Apply timezone offset from input. The actual zone can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() + config._tzm);
        }
    }

    function dateFromObject(config) {
        var normalizedInput;

        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];

        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {

        if (config._f === moment.ISO_8601) {
            parseISO(config);
            return;
        }

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var lang = getLangDefinition(config._l),
            string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, lang).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // handle am pm
        if (config._isPm && config._a[HOUR] < 12) {
            config._a[HOUR] += 12;
        }
        // if is 12 am, change hours to 0
        if (config._isPm === false && config._a[HOUR] === 12) {
            config._a[HOUR] = 0;
        }

        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = extend({}, config);
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function parseISO(config) {
        var i, l,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be "T" or undefined
                    config._f = isoDates[i][0] + (match[6] || " ");
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(parseTokenTimezone)) {
                config._f += "Z";
            }
            makeDateFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function makeDateFromString(config) {
        parseISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            moment.createFromInputFallback(config);
        }
    }

    function makeDateFromInput(config) {
        var input = config._i,
            matched = aspNetJsonRegex.exec(input);

        if (input === undefined) {
            config._d = new Date();
        } else if (matched) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = input.slice(0);
            dateFromConfig(config);
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof(input) === 'object') {
            dateFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            moment.createFromInputFallback(config);
        }
    }

    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, language) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = language.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
        return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(milliseconds, withoutSuffix, lang) {
        var seconds = round(Math.abs(milliseconds) / 1000),
            minutes = round(seconds / 60),
            hours = round(minutes / 60),
            days = round(hours / 24),
            years = round(days / 365),
            args = seconds < relativeTimeThresholds.s  && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < relativeTimeThresholds.m && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < relativeTimeThresholds.h && ['hh', hours] ||
                days === 1 && ['d'] ||
                days <= relativeTimeThresholds.dd && ['dd', days] ||
                days <= relativeTimeThresholds.dm && ['M'] ||
                days < relativeTimeThresholds.dy && ['MM', round(days / 30)] ||
                years === 1 && ['y'] || ['yy', years];
        args[2] = withoutSuffix;
        args[3] = milliseconds > 0;
        args[4] = lang;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Week of Year
    ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add('d', daysToDayOfWeek);
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;

        d = d === 0 ? 7 : d;
        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f;

        if (input === null || (format === undefined && input === '')) {
            return moment.invalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = getLangDefinition().preparse(input);
        }

        if (moment.isMoment(input)) {
            config = cloneMoment(input);

            config._d = new Date(+input._d);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        return new Moment(config);
    }

    moment = function (input, format, lang, strict) {
        var c;

        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = lang;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();

        return makeMoment(c);
    };

    moment.suppressDeprecationWarnings = false;

    moment.createFromInputFallback = deprecate(
            "moment construction falls back to js Date. This is " +
            "discouraged and will be removed in upcoming major " +
            "release. Please refer to " +
            "https://github.com/moment/moment/issues/1407 for more info.",
            function (config) {
        config._d = new Date(config._i);
    });

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return moment();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    moment.min = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    };

    moment.max = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    };

    // creating with utc
    moment.utc = function (input, format, lang, strict) {
        var c;

        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = lang;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return makeMoment(c).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            parseIso;

        if (moment.isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            parseIso = function (inp) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            };
            duration = {
                y: parseIso(match[2]),
                M: parseIso(match[3]),
                d: parseIso(match[4]),
                h: parseIso(match[5]),
                m: parseIso(match[6]),
                s: parseIso(match[7]),
                w: parseIso(match[8])
            };
        }

        ret = new Duration(duration);

        if (moment.isDuration(input) && input.hasOwnProperty('_lang')) {
            ret._lang = input._lang;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // constant that refers to the ISO standard
    moment.ISO_8601 = function () {};

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    moment.momentProperties = momentProperties;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () {};

    // This function allows you to set a threshold for relative time strings
    moment.relativeTimeThreshold = function(threshold, limit) {
      if (relativeTimeThresholds[threshold] === undefined) {
        return false;
      }
      relativeTimeThresholds[threshold] = limit;
      return true;
    };

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    moment.lang = function (key, values) {
        var r;
        if (!key) {
            return moment.fn._lang._abbr;
        }
        if (values) {
            loadLang(normalizeLanguage(key), values);
        } else if (values === null) {
            unloadLang(key);
            key = 'en';
        } else if (!languages[key]) {
            getLangDefinition(key);
        }
        r = moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);
        return r._abbr;
    };

    // returns language data
    moment.langData = function (key) {
        if (key && key._lang && key._lang._abbr) {
            key = key._lang._abbr;
        }
        return getLangDefinition(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null &&  obj.hasOwnProperty('_isAMomentObject'));
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function () {
        return moment.apply(null, arguments).parseZone();
    };

    moment.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    /************************************
        Moment Prototype
    ************************************/


    extend(moment.fn = Moment.prototype, {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d + ((this._offset || 0) * 60000);
        },

        unix : function () {
            return Math.floor(+this / 1000);
        },

        toString : function () {
            return this.clone().lang('en').format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
        },

        toDate : function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString : function () {
            var m = moment(this).utc();
            if (0 < m.year() && m.year() <= 9999) {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            } else {
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid : function () {
            return isValid(this);
        },

        isDSTShifted : function () {

            if (this._a) {
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }

            return false;
        },

        parsingFlags : function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc : function () {
            return this.zone(0);
        },

        local : function () {
            this.zone(0);
            this._isUTC = false;
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.lang().postformat(output);
        },

        add : function (input, val) {
            var dur;
            // switch args to support add('s', 1) and add(1, 's')
            if (typeof input === 'string' && typeof val === 'string') {
                dur = moment.duration(isNaN(+val) ? +input : +val, isNaN(+val) ? val : input);
            } else if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, 1);
            return this;
        },

        subtract : function (input, val) {
            var dur;
            // switch args to support subtract('s', 1) and subtract(1, 's')
            if (typeof input === 'string' && typeof val === 'string') {
                dur = moment.duration(isNaN(+val) ? +input : +val, isNaN(+val) ? val : input);
            } else if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, -1);
            return this;
        },

        diff : function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (this.zone() - that.zone()) * 6e4,
                diff, output;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month') {
                // average number of days in the months in the given dates
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                // difference in months
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                // adjust by taking difference in days, average number of days
                // and dst in the given months.
                output += ((this - moment(this).startOf('month')) -
                        (that - moment(that).startOf('month'))) / diff;
                // same as above but with zones, to negate all dst
                output -= ((this.zone() - moment(this).startOf('month').zone()) -
                        (that.zone() - moment(that).startOf('month').zone())) * 6e4 / diff;
                if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = (this - that);
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function (time) {
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're zone'd or not.
            var now = time || moment(),
                sod = makeAs(now, this).startOf('day'),
                diff = this.diff(sod, 'days', true),
                format = diff < -6 ? 'sameElse' :
                    diff < -1 ? 'lastWeek' :
                    diff < 0 ? 'lastDay' :
                    diff < 1 ? 'sameDay' :
                    diff < 2 ? 'nextDay' :
                    diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.lang().calendar(format, this));
        },

        isLeapYear : function () {
            return isLeapYear(this.year());
        },

        isDST : function () {
            return (this.zone() < this.clone().month(0).zone() ||
                this.zone() < this.clone().month(5).zone());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.lang());
                return this.add({ d : input - day });
            } else {
                return day;
            }
        },

        month : makeAccessor('Month', true),

        startOf: function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            } else if (units === 'isoWeek') {
                this.isoWeekday(1);
            }

            // quarters are also special
            if (units === 'quarter') {
                this.month(Math.floor(this.month() / 3) * 3);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            return this.startOf(units).add((units === 'isoWeek' ? 'week' : units), 1).subtract('ms', 1);
        },

        isAfter: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) > +moment(input).startOf(units);
        },

        isBefore: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) < +moment(input).startOf(units);
        },

        isSame: function (input, units) {
            units = units || 'ms';
            return +this.clone().startOf(units) === +makeAs(input, this).startOf(units);
        },

        min: deprecate(
                 "moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",
                 function (other) {
                     other = moment.apply(null, arguments);
                     return other < this ? this : other;
                 }
         ),

        max: deprecate(
                "moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",
                function (other) {
                    other = moment.apply(null, arguments);
                    return other > this ? this : other;
                }
        ),

        // keepTime = true means only change the timezone, without affecting
        // the local hour. So 5:31:26 +0300 --[zone(2, true)]--> 5:31:26 +0200
        // It is possible that 5:31:26 doesn't exist int zone +0200, so we
        // adjust the time as needed, to be valid.
        //
        // Keeping the time actually adds/subtracts (one hour)
        // from the actual represented time. That is why we call updateOffset
        // a second time. In case it wants us to change the offset again
        // _changeInProgress == true case, then we have to adjust, because
        // there is no such time in the given timezone.
        zone : function (input, keepTime) {
            var offset = this._offset || 0;
            if (input != null) {
                if (typeof input === "string") {
                    input = timezoneMinutesFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                this._offset = input;
                this._isUTC = true;
                if (offset !== input) {
                    if (!keepTime || this._changeInProgress) {
                        addOrSubtractDurationFromMoment(this,
                                moment.duration(offset - input, 'm'), 1, false);
                    } else if (!this._changeInProgress) {
                        this._changeInProgress = true;
                        moment.updateOffset(this, true);
                        this._changeInProgress = null;
                    }
                }
            } else {
                return this._isUTC ? offset : this._d.getTimezoneOffset();
            }
            return this;
        },

        zoneAbbr : function () {
            return this._isUTC ? "UTC" : "";
        },

        zoneName : function () {
            return this._isUTC ? "Coordinated Universal Time" : "";
        },

        parseZone : function () {
            if (this._tzm) {
                this.zone(this._tzm);
            } else if (typeof this._i === 'string') {
                this.zone(this._i);
            }
            return this;
        },

        hasAlignedHourOffset : function (input) {
            if (!input) {
                input = 0;
            }
            else {
                input = moment(input).zone();
            }

            return (this.zone() - input) % 60 === 0;
        },

        daysInMonth : function () {
            return daysInMonth(this.year(), this.month());
        },

        dayOfYear : function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add("d", (input - dayOfYear));
        },

        quarter : function (input) {
            return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
        },

        weekYear : function (input) {
            var year = weekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).year;
            return input == null ? year : this.add("y", (input - year));
        },

        isoWeekYear : function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add("y", (input - year));
        },

        week : function (input) {
            var week = this.lang().week(this);
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        isoWeek : function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        weekday : function (input) {
            var weekday = (this.day() + 7 - this.lang()._week.dow) % 7;
            return input == null ? weekday : this.add("d", input - weekday);
        },

        isoWeekday : function (input) {
            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },

        isoWeeksInYear : function () {
            return weeksInYear(this.year(), 1, 4);
        },

        weeksInYear : function () {
            var weekInfo = this._lang._week;
            return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set : function (units, value) {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                this[units](value);
            }
            return this;
        },

        // If passed a language key, it will set the language for this
        // instance.  Otherwise, it will return the language configuration
        // variables for this instance.
        lang : function (key) {
            if (key === undefined) {
                return this._lang;
            } else {
                this._lang = getLangDefinition(key);
                return this;
            }
        }
    });

    function rawMonthSetter(mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.lang().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(),
                daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function rawGetter(mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function rawSetter(mom, unit, value) {
        if (unit === 'Month') {
            return rawMonthSetter(mom, value);
        } else {
            return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    function makeAccessor(unit, keepTime) {
        return function (value) {
            if (value != null) {
                rawSetter(this, unit, value);
                moment.updateOffset(this, keepTime);
                return this;
            } else {
                return rawGetter(this, unit);
            }
        };
    }

    moment.fn.millisecond = moment.fn.milliseconds = makeAccessor('Milliseconds', false);
    moment.fn.second = moment.fn.seconds = makeAccessor('Seconds', false);
    moment.fn.minute = moment.fn.minutes = makeAccessor('Minutes', false);
    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    moment.fn.hour = moment.fn.hours = makeAccessor('Hours', true);
    // moment.fn.month is defined separately
    moment.fn.date = makeAccessor('Date', true);
    moment.fn.dates = deprecate("dates accessor is deprecated. Use date instead.", makeAccessor('Date', true));
    moment.fn.year = makeAccessor('FullYear', true);
    moment.fn.years = deprecate("years accessor is deprecated. Use year instead.", makeAccessor('FullYear', true));

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;
    moment.fn.quarters = moment.fn.quarter;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    /************************************
        Duration Prototype
    ************************************/


    extend(moment.duration.fn = Duration.prototype, {

        _bubble : function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years;

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absRound(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;

            hours = absRound(minutes / 60);
            data.hours = hours % 24;

            days += absRound(hours / 24);
            data.days = days % 30;

            months += absRound(days / 30);
            data.months = months % 12;

            years = absRound(months / 12);
            data.years = years;
        },

        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
              this._days * 864e5 +
              (this._months % 12) * 2592e6 +
              toInt(this._months / 12) * 31536e6;
        },

        humanize : function (withSuffix) {
            var difference = +this,
                output = relativeTime(difference, !withSuffix, this.lang());

            if (withSuffix) {
                output = this.lang().pastFuture(difference, output);
            }

            return this.lang().postformat(output);
        },

        add : function (input, val) {
            // supports only 2.0-style add(1, 's') or add(moment)
            var dur = moment.duration(input, val);

            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;

            this._bubble();

            return this;
        },

        subtract : function (input, val) {
            var dur = moment.duration(input, val);

            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;

            this._bubble();

            return this;
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as : function (units) {
            units = normalizeUnits(units);
            return this['as' + units.charAt(0).toUpperCase() + units.slice(1) + 's']();
        },

        lang : moment.fn.lang,

        toIsoString : function () {
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            var years = Math.abs(this.years()),
                months = Math.abs(this.months()),
                days = Math.abs(this.days()),
                hours = Math.abs(this.hours()),
                minutes = Math.abs(this.minutes()),
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);

            if (!this.asSeconds()) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            return (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (years ? years + 'Y' : '') +
                (months ? months + 'M' : '') +
                (days ? days + 'D' : '') +
                ((hours || minutes || seconds) ? 'T' : '') +
                (hours ? hours + 'H' : '') +
                (minutes ? minutes + 'M' : '') +
                (seconds ? seconds + 'S' : '');
        }
    });

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    function makeDurationAsGetter(name, factor) {
        moment.duration.fn['as' + name] = function () {
            return +this / factor;
        };
    }

    for (i in unitMillisecondFactors) {
        if (unitMillisecondFactors.hasOwnProperty(i)) {
            makeDurationAsGetter(i, unitMillisecondFactors[i]);
            makeDurationGetter(i.toLowerCase());
        }
    }

    makeDurationAsGetter('Weeks', 6048e5);
    moment.duration.fn.asMonths = function () {
        return (+this - this.years() * 31536e6) / 2592e6 + this.years() * 12;
    };


    /************************************
        Default Lang
    ************************************/


    // Set default language, other languages will inherit from English.
    moment.lang('en', {
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    /* EMBED_LANGUAGES */

    /************************************
        Exposing Moment
    ************************************/

    function makeGlobal(shouldDeprecate) {
        /*global ender:false */
        if (typeof ender !== 'undefined') {
            return;
        }
        oldGlobalMoment = globalScope.moment;
        if (shouldDeprecate) {
            globalScope.moment = deprecate(
                    "Accessing Moment through the global scope is " +
                    "deprecated, and will be removed in an upcoming " +
                    "release.",
                    moment);
        } else {
            globalScope.moment = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    } else if (typeof define === "function" && define.amd) {
        define("moment", function (require, exports, module) {
            if (module.config && module.config() && module.config().noGlobal === true) {
                // release the global variable
                globalScope.moment = oldGlobalMoment;
            }

            return moment;
        });
        makeGlobal(true);
    } else {
        makeGlobal();
    }
}).call(this);
;
/*
 * Improvement by CuGBabyBeaR @ 2013-09-12
 * 
 * Make it work in bootstrap v3
 */

!function ($) {

	function UTCDate() {
		return new Date(Date.UTC.apply(Date, arguments));
	}

	function UTCToday() {
		var today = new Date();
		return UTCDate(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds(), 0);
	}

	// Picker object

	var Datetimepicker = function (element, options) {
		var that = this;

		this.element = $(element);

		// add container for single page application
		// when page switch the datetimepicker div will be removed also.
		this.container = options.container || 'body';

		this.language = options.language || this.element.data('date-language') || "en";
		this.language = this.language in dates ? this.language : "en";
		this.isRTL = dates[this.language].rtl || false;
		this.formatType = options.formatType || this.element.data('format-type') || 'standard';
		this.format = DPGlobal.parseFormat(options.format || this.element.data('date-format') || dates[this.language].format || DPGlobal.getDefaultFormat(this.formatType, 'input'), this.formatType);
		this.isInline = false;
		this.isVisible = false;
		this.isInput = this.element.is('input');


		this.bootcssVer = this.isInput ? (this.element.is('.form-control') ? 3 : 2) : ( this.bootcssVer = this.element.is('.input-group') ? 3 : 2 );

		this.component = this.element.is('.date') ? ( this.bootcssVer == 3 ? this.element.find('.input-group-addon .glyphicon-th, .input-group-addon .glyphicon-time, .input-group-addon .glyphicon-calendar').parent() : this.element.find('.add-on .icon-th, .add-on .icon-time, .add-on .icon-calendar').parent()) : false;
		this.componentReset = this.element.is('.date') ? ( this.bootcssVer == 3 ? this.element.find('.input-group-addon .glyphicon-remove').parent() : this.element.find('.add-on .icon-remove').parent()) : false;
		this.hasInput = this.component && this.element.find('input').length;
		if (this.component && this.component.length === 0) {
			this.component = false;
		}
		this.linkField = options.linkField || this.element.data('link-field') || false;
		this.linkFormat = DPGlobal.parseFormat(options.linkFormat || this.element.data('link-format') || DPGlobal.getDefaultFormat(this.formatType, 'link'), this.formatType);
		this.minuteStep = options.minuteStep || this.element.data('minute-step') || 5;
		this.pickerPosition = options.pickerPosition || this.element.data('picker-position') || 'bottom-right';
		this.showMeridian = options.showMeridian || this.element.data('show-meridian') || false;
		this.initialDate = options.initialDate || new Date();

		this._attachEvents();

		this.formatViewType = "datetime";
		if ('formatViewType' in options) {
			this.formatViewType = options.formatViewType;
		} else if ('formatViewType' in this.element.data()) {
			this.formatViewType = this.element.data('formatViewType');
		}

		this.minView = 0;
		if ('minView' in options) {
			this.minView = options.minView;
		} else if ('minView' in this.element.data()) {
			this.minView = this.element.data('min-view');
		}
		this.minView = DPGlobal.convertViewMode(this.minView);

		this.maxView = DPGlobal.modes.length - 1;
		if ('maxView' in options) {
			this.maxView = options.maxView;
		} else if ('maxView' in this.element.data()) {
			this.maxView = this.element.data('max-view');
		}
		this.maxView = DPGlobal.convertViewMode(this.maxView);

		this.wheelViewModeNavigation = false;
		if ('wheelViewModeNavigation' in options) {
			this.wheelViewModeNavigation = options.wheelViewModeNavigation;
		} else if ('wheelViewModeNavigation' in this.element.data()) {
			this.wheelViewModeNavigation = this.element.data('view-mode-wheel-navigation');
		}

		this.wheelViewModeNavigationInverseDirection = false;

		if ('wheelViewModeNavigationInverseDirection' in options) {
			this.wheelViewModeNavigationInverseDirection = options.wheelViewModeNavigationInverseDirection;
		} else if ('wheelViewModeNavigationInverseDirection' in this.element.data()) {
			this.wheelViewModeNavigationInverseDirection = this.element.data('view-mode-wheel-navigation-inverse-dir');
		}

		this.wheelViewModeNavigationDelay = 100;
		if ('wheelViewModeNavigationDelay' in options) {
			this.wheelViewModeNavigationDelay = options.wheelViewModeNavigationDelay;
		} else if ('wheelViewModeNavigationDelay' in this.element.data()) {
			this.wheelViewModeNavigationDelay = this.element.data('view-mode-wheel-navigation-delay');
		}

		this.startViewMode = 2;
		if ('startView' in options) {
			this.startViewMode = options.startView;
		} else if ('startView' in this.element.data()) {
			this.startViewMode = this.element.data('start-view');
		}
		this.startViewMode = DPGlobal.convertViewMode(this.startViewMode);
		this.viewMode = this.startViewMode;

		this.viewSelect = this.minView;
		if ('viewSelect' in options) {
			this.viewSelect = options.viewSelect;
		} else if ('viewSelect' in this.element.data()) {
			this.viewSelect = this.element.data('view-select');
		}
		this.viewSelect = DPGlobal.convertViewMode(this.viewSelect);

		this.forceParse = true;
		if ('forceParse' in options) {
			this.forceParse = options.forceParse;
		} else if ('dateForceParse' in this.element.data()) {
			this.forceParse = this.element.data('date-force-parse');
		}

		this.picker = $((this.bootcssVer == 3) ? DPGlobal.templateV3 : DPGlobal.template)
			.appendTo(this.isInline ? this.element : this.container) // 'body')
			.on({
				click:     $.proxy(this.click, this),
				mousedown: $.proxy(this.mousedown, this)
			});

		if (this.wheelViewModeNavigation) {
			if ($.fn.mousewheel) {
				this.picker.on({mousewheel: $.proxy(this.mousewheel, this)});
			} else {
				console.log("Mouse Wheel event is not supported. Please include the jQuery Mouse Wheel plugin before enabling this option");
			}
		}

		if (this.isInline) {
			this.picker.addClass('datetimepicker-inline');
		} else {
			this.picker.addClass('datetimepicker-dropdown-' + this.pickerPosition + ' dropdown-menu');
		}
		if (this.isRTL) {
			this.picker.addClass('datetimepicker-rtl');
			if (this.bootcssVer == 3) {
				this.picker.find('.prev span, .next span')
					.toggleClass('glyphicon-arrow-left glyphicon-arrow-right');
			} else {
				this.picker.find('.prev i, .next i')
					.toggleClass('icon-arrow-left icon-arrow-right');
			}
			;

		}
		$(document).on('mousedown', function (e) {
			// Clicked outside the datetimepicker, hide it
			if ($(e.target).closest('.datetimepicker').length === 0) {
				that.hide();
			}
		});

		this.autoclose = false;
		if ('autoclose' in options) {
			this.autoclose = options.autoclose;
		} else if ('dateAutoclose' in this.element.data()) {
			this.autoclose = this.element.data('date-autoclose');
		}

		this.keyboardNavigation = true;
		if ('keyboardNavigation' in options) {
			this.keyboardNavigation = options.keyboardNavigation;
		} else if ('dateKeyboardNavigation' in this.element.data()) {
			this.keyboardNavigation = this.element.data('date-keyboard-navigation');
		}

		this.todayBtn = (options.todayBtn || this.element.data('date-today-btn') || false);
		this.todayHighlight = (options.todayHighlight || this.element.data('date-today-highlight') || false);

		this.weekStart = ((options.weekStart || this.element.data('date-weekstart') || dates[this.language].weekStart || 0) % 7);
		this.weekEnd = ((this.weekStart + 6) % 7);
		this.startDate = -Infinity;
		this.endDate = Infinity;
		this.daysOfWeekDisabled = [];
		this.setStartDate(options.startDate || this.element.data('date-startdate'));
		this.setEndDate(options.endDate || this.element.data('date-enddate'));
		this.setDaysOfWeekDisabled(options.daysOfWeekDisabled || this.element.data('date-days-of-week-disabled'));
		this.fillDow();
		this.fillMonths();
		this.update();
		this.showMode();

		if (this.isInline) {
			this.show();
		}
	};

	Datetimepicker.prototype = {
		constructor: Datetimepicker,

		_events:       [],
		_attachEvents: function () {
			this._detachEvents();
			if (this.isInput) { // single input
				this._events = [
					[this.element, {
						focus:   $.proxy(this.show, this),
						keyup:   $.proxy(this.update, this),
						keydown: $.proxy(this.keydown, this)
					}]
				];
			}
			else if (this.component && this.hasInput) { // component: input + button
				this._events = [
					// For components that are not readonly, allow keyboard nav
					[this.element.find('input'), {
						focus:   $.proxy(this.show, this),
						keyup:   $.proxy(this.update, this),
						keydown: $.proxy(this.keydown, this)
					}],
					[this.component, {
						click: $.proxy(this.show, this)
					}]
				];
				if (this.componentReset) {
					this._events.push([
						this.componentReset,
						{click: $.proxy(this.reset, this)}
					]);
				}
			}
			else if (this.element.is('div')) {  // inline datetimepicker
				this.isInline = true;
			}
			else {
				this._events = [
					[this.element, {
						click: $.proxy(this.show, this)
					}]
				];
			}
			for (var i = 0, el, ev; i < this._events.length; i++) {
				el = this._events[i][0];
				ev = this._events[i][1];
				el.on(ev);
			}
		},

		_detachEvents: function () {
			for (var i = 0, el, ev; i < this._events.length; i++) {
				el = this._events[i][0];
				ev = this._events[i][1];
				el.off(ev);
			}
			this._events = [];
		},

		show: function (e) {
			this.picker.show();
			this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
			if (this.forceParse) {
				this.update();
			}
			this.place();
			$(window).on('resize', $.proxy(this.place, this));
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			this.isVisible = true;
			this.element.trigger({
				type: 'show',
				date: this.date
			});
		},

		hide: function (e) {
			if (!this.isVisible) return;
			if (this.isInline) return;
			this.picker.hide();
			$(window).off('resize', this.place);
			this.viewMode = this.startViewMode;
			this.showMode();
			if (!this.isInput) {
				$(document).off('mousedown', this.hide);
			}

			if (
				this.forceParse &&
					(
						this.isInput && this.element.val() ||
							this.hasInput && this.element.find('input').val()
						)
				)
				this.setValue();
			this.isVisible = false;
			this.element.trigger({
				type: 'hide',
				date: this.date
			});
		},

		remove: function () {
			this._detachEvents();
			this.picker.remove();
			delete this.picker;
			delete this.element.data().datetimepicker;
		},

		getDate: function () {
			var d = this.getUTCDate();
			return new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
		},

		getUTCDate: function () {
			return this.date;
		},

		setDate: function (d) {
			this.setUTCDate(new Date(d.getTime() - (d.getTimezoneOffset() * 60000)));
		},

		setUTCDate: function (d) {
			if (d >= this.startDate && d <= this.endDate) {
				this.date = d;
				this.setValue();
				this.viewDate = this.date;
				this.fill();
			} else {
				this.element.trigger({
					type:      'outOfRange',
					date:      d,
					startDate: this.startDate,
					endDate:   this.endDate
				});
			}
		},

		setFormat: function (format) {
			this.format = DPGlobal.parseFormat(format, this.formatType);
			var element;
			if (this.isInput) {
				element = this.element;
			} else if (this.component) {
				element = this.element.find('input');
			}
			if (element && element.val()) {
				this.setValue();
			}
		},

		setValue: function () {
			var formatted = this.getFormattedDate();
			if (!this.isInput) {
				if (this.component) {
					this.element.find('input').val(formatted);
				}
				this.element.data('date', formatted);
			} else {
				this.element.val(formatted);
			}
			if (this.linkField) {
				$('#' + this.linkField).val(this.getFormattedDate(this.linkFormat));
			}
		},

		getFormattedDate: function (format) {
			if (format == undefined) format = this.format;
			return DPGlobal.formatDate(this.date, format, this.language, this.formatType);
		},

		setStartDate: function (startDate) {
			this.startDate = startDate || -Infinity;
			if (this.startDate !== -Infinity) {
				this.startDate = DPGlobal.parseDate(this.startDate, this.format, this.language, this.formatType);
			}
			this.update();
			this.updateNavArrows();
		},

		setEndDate: function (endDate) {
			this.endDate = endDate || Infinity;
			if (this.endDate !== Infinity) {
				this.endDate = DPGlobal.parseDate(this.endDate, this.format, this.language, this.formatType);
			}
			this.update();
			this.updateNavArrows();
		},

		setDaysOfWeekDisabled: function (daysOfWeekDisabled) {
			this.daysOfWeekDisabled = daysOfWeekDisabled || [];
			if (!$.isArray(this.daysOfWeekDisabled)) {
				this.daysOfWeekDisabled = this.daysOfWeekDisabled.split(/,\s*/);
			}
			this.daysOfWeekDisabled = $.map(this.daysOfWeekDisabled, function (d) {
				return parseInt(d, 10);
			});
			this.update();
			this.updateNavArrows();
		},

		place: function () {
			if (this.isInline) return;

			var index_highest = 0;
			$('div').each(function () {
				var index_current = parseInt($(this).css("zIndex"), 10);
				if (index_current > index_highest) {
					index_highest = index_current;
				}
			});
			var zIndex = index_highest + 10;

			var offset, top, left, containerOffset;
			if (this.container instanceof $) {
				containerOffset = this.container.offset();
			} else {
				containerOffset = $(this.container).offset();
			}

			if (this.component) {
				offset = this.component.offset();
				left = offset.left;
				if (this.pickerPosition == 'bottom-left' || this.pickerPosition == 'top-left') {
					left += this.component.outerWidth() - this.picker.outerWidth();
				}
			} else {
				offset = this.element.offset();
				left = offset.left;
			}
			
			if(left+220 > document.body.clientWidth){
            			left = document.body.clientWidth-220;
          		}
			
			if (this.pickerPosition == 'top-left' || this.pickerPosition == 'top-right') {
				top = offset.top - this.picker.outerHeight();
			} else {
				top = offset.top + this.height;
			}

			top = top - containerOffset.top;
			left = left - containerOffset.left;

			this.picker.css({
				top:    top,
				left:   left,
				zIndex: zIndex
			});
		},

		update: function () {
			var date, fromArgs = false;
			if (arguments && arguments.length && (typeof arguments[0] === 'string' || arguments[0] instanceof Date)) {
				date = arguments[0];
				fromArgs = true;
			} else {
				date = (this.isInput ? this.element.val() : this.element.find('input').val()) || this.element.data('date') || this.initialDate;
				if (typeof date == 'string' || date instanceof String) {
				  date = date.replace(/^\s+|\s+$/g,'');
				}
			}

			if (!date) {
				date = new Date();
				fromArgs = false;
			}

			this.date = DPGlobal.parseDate(date, this.format, this.language, this.formatType);

			if (fromArgs) this.setValue();

			if (this.date < this.startDate) {
				this.viewDate = new Date(this.startDate);
			} else if (this.date > this.endDate) {
				this.viewDate = new Date(this.endDate);
			} else {
				this.viewDate = new Date(this.date);
			}
			this.fill();
		},

		fillDow: function () {
			var dowCnt = this.weekStart,
				html = '<tr>';
			while (dowCnt < this.weekStart + 7) {
				html += '<th class="dow">' + dates[this.language].daysMin[(dowCnt++) % 7] + '</th>';
			}
			html += '</tr>';
			this.picker.find('.datetimepicker-days thead').append(html);
		},

		fillMonths: function () {
			var html = '',
				i = 0;
			while (i < 12) {
				html += '<span class="month">' + dates[this.language].monthsShort[i++] + '</span>';
			}
			this.picker.find('.datetimepicker-months td').html(html);
		},

		fill: function () {
			if (this.date == null || this.viewDate == null) {
				return;
			}
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				dayMonth = d.getUTCDate(),
				hours = d.getUTCHours(),
				minutes = d.getUTCMinutes(),
				startYear = this.startDate !== -Infinity ? this.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.startDate !== -Infinity ? this.startDate.getUTCMonth() : -Infinity,
				endYear = this.endDate !== Infinity ? this.endDate.getUTCFullYear() : Infinity,
				endMonth = this.endDate !== Infinity ? this.endDate.getUTCMonth() : Infinity,
				currentDate = (new UTCDate(this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getUTCDate())).valueOf(),
				today = new Date();
			this.picker.find('.datetimepicker-days thead th:eq(1)')
				.text(dates[this.language].months[month] + ' ' + year);
			if (this.formatViewType == "time") {
				var hourConverted = hours % 12 ? hours % 12 : 12;
				var hoursDisplay = (hourConverted < 10 ? '0' : '') + hourConverted;
				var minutesDisplay = (minutes < 10 ? '0' : '') + minutes;
				var meridianDisplay = dates[this.language].meridiem[hours < 12 ? 0 : 1];
				this.picker.find('.datetimepicker-hours thead th:eq(1)')
					.text(hoursDisplay + ':' + minutesDisplay + ' ' + (meridianDisplay ? meridianDisplay.toUpperCase() : ''));
				this.picker.find('.datetimepicker-minutes thead th:eq(1)')
					.text(hoursDisplay + ':' + minutesDisplay + ' ' + (meridianDisplay ? meridianDisplay.toUpperCase() : ''));
			} else {
				this.picker.find('.datetimepicker-hours thead th:eq(1)')
					.text(dayMonth + ' ' + dates[this.language].months[month] + ' ' + year);
				this.picker.find('.datetimepicker-minutes thead th:eq(1)')
					.text(dayMonth + ' ' + dates[this.language].months[month] + ' ' + year);
			}
			this.picker.find('tfoot th.today')
				.text(dates[this.language].today)
				.toggle(this.todayBtn !== false);
			this.updateNavArrows();
			this.fillMonths();
			/*var prevMonth = UTCDate(year, month, 0,0,0,0,0);
			 prevMonth.setUTCDate(prevMonth.getDate() - (prevMonth.getUTCDay() - this.weekStart + 7)%7);*/
			var prevMonth = UTCDate(year, month - 1, 28, 0, 0, 0, 0),
				day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
			prevMonth.setUTCDate(day);
			prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7) % 7);
			var nextMonth = new Date(prevMonth);
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var clsName;
			while (prevMonth.valueOf() < nextMonth) {
				if (prevMonth.getUTCDay() == this.weekStart) {
					html.push('<tr>');
				}
				clsName = '';
				if (prevMonth.getUTCFullYear() < year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() < month)) {
					clsName += ' old';
				} else if (prevMonth.getUTCFullYear() > year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() > month)) {
					clsName += ' new';
				}
				// Compare internal UTC date with local today, not UTC today
				if (this.todayHighlight &&
					prevMonth.getUTCFullYear() == today.getFullYear() &&
					prevMonth.getUTCMonth() == today.getMonth() &&
					prevMonth.getUTCDate() == today.getDate()) {
					clsName += ' today';
				}
				if (prevMonth.valueOf() == currentDate) {
					clsName += ' active';
				}
				if ((prevMonth.valueOf() + 86400000) <= this.startDate || prevMonth.valueOf() > this.endDate ||
					$.inArray(prevMonth.getUTCDay(), this.daysOfWeekDisabled) !== -1) {
					clsName += ' disabled';
				}
				html.push('<td class="day' + clsName + '">' + prevMonth.getUTCDate() + '</td>');
				if (prevMonth.getUTCDay() == this.weekEnd) {
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
			}
			this.picker.find('.datetimepicker-days tbody').empty().append(html.join(''));

			html = [];
			var txt = '', meridian = '', meridianOld = '';
			for (var i = 0; i < 24; i++) {
				var actual = UTCDate(year, month, dayMonth, i);
				clsName = '';
				// We want the previous hour for the startDate
				if ((actual.valueOf() + 3600000) <= this.startDate || actual.valueOf() > this.endDate) {
					clsName += ' disabled';
				} else if (hours == i) {
					clsName += ' active';
				}
				if (this.showMeridian && dates[this.language].meridiem.length == 2) {
					meridian = (i < 12 ? dates[this.language].meridiem[0] : dates[this.language].meridiem[1]);
					if (meridian != meridianOld) {
						if (meridianOld != '') {
							html.push('</fieldset>');
						}
						html.push('<fieldset class="hour"><legend>' + meridian.toUpperCase() + '</legend>');
					}
					meridianOld = meridian;
					txt = (i % 12 ? i % 12 : 12);
					html.push('<span class="hour' + clsName + ' hour_' + (i < 12 ? 'am' : 'pm') + '">' + txt + '</span>');
					if (i == 23) {
						html.push('</fieldset>');
					}
				} else {
					txt = i + ':00';
					html.push('<span class="hour' + clsName + '">' + txt + '</span>');
				}
			}
			this.picker.find('.datetimepicker-hours td').html(html.join(''));

			html = [];
			txt = '', meridian = '', meridianOld = '';
			for (var i = 0; i < 60; i += this.minuteStep) {
				var actual = UTCDate(year, month, dayMonth, hours, i, 0);
				clsName = '';
				if (actual.valueOf() < this.startDate || actual.valueOf() > this.endDate) {
					clsName += ' disabled';
				} else if (Math.floor(minutes / this.minuteStep) == Math.floor(i / this.minuteStep)) {
					clsName += ' active';
				}
				if (this.showMeridian && dates[this.language].meridiem.length == 2) {
					meridian = (hours < 12 ? dates[this.language].meridiem[0] : dates[this.language].meridiem[1]);
					if (meridian != meridianOld) {
						if (meridianOld != '') {
							html.push('</fieldset>');
						}
						html.push('<fieldset class="minute"><legend>' + meridian.toUpperCase() + '</legend>');
					}
					meridianOld = meridian;
					txt = (hours % 12 ? hours % 12 : 12);
					//html.push('<span class="minute'+clsName+' minute_'+(hours<12?'am':'pm')+'">'+txt+'</span>');
					html.push('<span class="minute' + clsName + '">' + txt + ':' + (i < 10 ? '0' + i : i) + '</span>');
					if (i == 59) {
						html.push('</fieldset>');
					}
				} else {
					txt = i + ':00';
					//html.push('<span class="hour'+clsName+'">'+txt+'</span>');
					html.push('<span class="minute' + clsName + '">' + hours + ':' + (i < 10 ? '0' + i : i) + '</span>');
				}
			}
			this.picker.find('.datetimepicker-minutes td').html(html.join(''));

			var currentYear = this.date.getUTCFullYear();
			var months = this.picker.find('.datetimepicker-months')
				.find('th:eq(1)')
				.text(year)
				.end()
				.find('span').removeClass('active');
			if (currentYear == year) {
				months.eq(this.date.getUTCMonth()).addClass('active');
			}
			if (year < startYear || year > endYear) {
				months.addClass('disabled');
			}
			if (year == startYear) {
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year == endYear) {
				months.slice(endMonth + 1).addClass('disabled');
			}

			html = '';
			year = parseInt(year / 10, 10) * 10;
			var yearCont = this.picker.find('.datetimepicker-years')
				.find('th:eq(1)')
				.text(year + '-' + (year + 9))
				.end()
				.find('td');
			year -= 1;
			for (var i = -1; i < 11; i++) {
				html += '<span class="year' + (i == -1 || i == 10 ? ' old' : '') + (currentYear == year ? ' active' : '') + (year < startYear || year > endYear ? ' disabled' : '') + '">' + year + '</span>';
				year += 1;
			}
			yearCont.html(html);
			this.place();
		},

		updateNavArrows: function () {
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				day = d.getUTCDate(),
				hour = d.getUTCHours();
			switch (this.viewMode) {
				case 0:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()
						&& month <= this.startDate.getUTCMonth()
						&& day <= this.startDate.getUTCDate()
						&& hour <= this.startDate.getUTCHours()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()
						&& month >= this.endDate.getUTCMonth()
						&& day >= this.endDate.getUTCDate()
						&& hour >= this.endDate.getUTCHours()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 1:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()
						&& month <= this.startDate.getUTCMonth()
						&& day <= this.startDate.getUTCDate()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()
						&& month >= this.endDate.getUTCMonth()
						&& day >= this.endDate.getUTCDate()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 2:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()
						&& month <= this.startDate.getUTCMonth()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()
						&& month >= this.endDate.getUTCMonth()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 3:
				case 4:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
			}
		},

		mousewheel: function (e) {

			e.preventDefault();
			e.stopPropagation();

			if (this.wheelPause) {
				return;
			}

			this.wheelPause = true;

			var originalEvent = e.originalEvent;

			var delta = originalEvent.wheelDelta;

			var mode = delta > 0 ? 1 : (delta === 0) ? 0 : -1;

			if (this.wheelViewModeNavigationInverseDirection) {
				mode = -mode;
			}

			this.showMode(mode);

			setTimeout($.proxy(function () {

				this.wheelPause = false

			}, this), this.wheelViewModeNavigationDelay);

		},

		click: function (e) {
			e.stopPropagation();
			e.preventDefault();
			var target = $(e.target).closest('span, td, th, legend');
			if (target.is('.glyphicon')) {
				target = $(target).parent().closest('span, td, th, legend');
			}
			if (target.length == 1) {
				if (target.is('.disabled')) {
					this.element.trigger({
						type:      'outOfRange',
						date:      this.viewDate,
						startDate: this.startDate,
						endDate:   this.endDate
					});
					return;
				}
				switch (target[0].nodeName.toLowerCase()) {
					case 'th':
						switch (target[0].className) {
							case 'switch':
								this.showMode(1);
								break;
							case 'prev':
							case 'next':
								var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className == 'prev' ? -1 : 1);
								switch (this.viewMode) {
									case 0:
										this.viewDate = this.moveHour(this.viewDate, dir);
										break;
									case 1:
										this.viewDate = this.moveDate(this.viewDate, dir);
										break;
									case 2:
										this.viewDate = this.moveMonth(this.viewDate, dir);
										break;
									case 3:
									case 4:
										this.viewDate = this.moveYear(this.viewDate, dir);
										break;
								}
								this.fill();
								this.element.trigger({
									type:      target[0].className + ':' + this.convertViewModeText(this.viewMode),
									date:      this.viewDate,
									startDate: this.startDate,
									endDate:   this.endDate
								});
								break;
							case 'today':
								var date = new Date();
								date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0);

								// Respect startDate and endDate.
								if (date < this.startDate) date = this.startDate;
								else if (date > this.endDate) date = this.endDate;

								this.viewMode = this.startViewMode;
								this.showMode(0);
								this._setDate(date);
								this.fill();
								if (this.autoclose) {
									this.hide();
								}
								break;
						}
						break;
					case 'span':
						if (!target.is('.disabled')) {
							var year = this.viewDate.getUTCFullYear(),
								month = this.viewDate.getUTCMonth(),
								day = this.viewDate.getUTCDate(),
								hours = this.viewDate.getUTCHours(),
								minutes = this.viewDate.getUTCMinutes(),
								seconds = this.viewDate.getUTCSeconds();

							if (target.is('.month')) {
								this.viewDate.setUTCDate(1);
								month = target.parent().find('span').index(target);
								day = this.viewDate.getUTCDate();
								this.viewDate.setUTCMonth(month);
								this.element.trigger({
									type: 'changeMonth',
									date: this.viewDate
								});
								if (this.viewSelect >= 3) {
									this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
								}
							} else if (target.is('.year')) {
								this.viewDate.setUTCDate(1);
								year = parseInt(target.text(), 10) || 0;
								this.viewDate.setUTCFullYear(year);
								this.element.trigger({
									type: 'changeYear',
									date: this.viewDate
								});
								if (this.viewSelect >= 4) {
									this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
								}
							} else if (target.is('.hour')) {
								hours = parseInt(target.text(), 10) || 0;
								if (target.hasClass('hour_am') || target.hasClass('hour_pm')) {
									if (hours == 12 && target.hasClass('hour_am')) {
										hours = 0;
									} else if (hours != 12 && target.hasClass('hour_pm')) {
										hours += 12;
									}
								}
								this.viewDate.setUTCHours(hours);
								this.element.trigger({
									type: 'changeHour',
									date: this.viewDate
								});
								if (this.viewSelect >= 1) {
									this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
								}
							} else if (target.is('.minute')) {
								minutes = parseInt(target.text().substr(target.text().indexOf(':') + 1), 10) || 0;
								this.viewDate.setUTCMinutes(minutes);
								this.element.trigger({
									type: 'changeMinute',
									date: this.viewDate
								});
								if (this.viewSelect >= 0) {
									this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
								}
							}
							if (this.viewMode != 0) {
								var oldViewMode = this.viewMode;
								this.showMode(-1);
								this.fill();
								if (oldViewMode == this.viewMode && this.autoclose) {
									this.hide();
								}
							} else {
								this.fill();
								if (this.autoclose) {
									this.hide();
								}
							}
						}
						break;
					case 'td':
						if (target.is('.day') && !target.is('.disabled')) {
							var day = parseInt(target.text(), 10) || 1;
							var year = this.viewDate.getUTCFullYear(),
								month = this.viewDate.getUTCMonth(),
								hours = this.viewDate.getUTCHours(),
								minutes = this.viewDate.getUTCMinutes(),
								seconds = this.viewDate.getUTCSeconds();
							if (target.is('.old')) {
								if (month === 0) {
									month = 11;
									year -= 1;
								} else {
									month -= 1;
								}
							} else if (target.is('.new')) {
								if (month == 11) {
									month = 0;
									year += 1;
								} else {
									month += 1;
								}
							}
							this.viewDate.setUTCFullYear(year);
							this.viewDate.setUTCMonth(month, day);
							this.element.trigger({
								type: 'changeDay',
								date: this.viewDate
							});
							if (this.viewSelect >= 2) {
								this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
							}
						}
						var oldViewMode = this.viewMode;
						this.showMode(-1);
						this.fill();
						if (oldViewMode == this.viewMode && this.autoclose) {
							this.hide();
						}
						break;
				}
			}
		},

		_setDate: function (date, which) {
			if (!which || which == 'date')
				this.date = date;
			if (!which || which == 'view')
				this.viewDate = date;
			this.fill();
			this.setValue();
			var element;
			if (this.isInput) {
				element = this.element;
			} else if (this.component) {
				element = this.element.find('input');
			}
			if (element) {
				element.change();
				if (this.autoclose && (!which || which == 'date')) {
					//this.hide();
				}
			}
			this.element.trigger({
				type: 'changeDate',
				date: this.date
			});
		},

		moveMinute: function (date, dir) {
			if (!dir) return date;
			var new_date = new Date(date.valueOf());
			//dir = dir > 0 ? 1 : -1;
			new_date.setUTCMinutes(new_date.getUTCMinutes() + (dir * this.minuteStep));
			return new_date;
		},

		moveHour: function (date, dir) {
			if (!dir) return date;
			var new_date = new Date(date.valueOf());
			//dir = dir > 0 ? 1 : -1;
			new_date.setUTCHours(new_date.getUTCHours() + dir);
			return new_date;
		},

		moveDate: function (date, dir) {
			if (!dir) return date;
			var new_date = new Date(date.valueOf());
			//dir = dir > 0 ? 1 : -1;
			new_date.setUTCDate(new_date.getUTCDate() + dir);
			return new_date;
		},

		moveMonth: function (date, dir) {
			if (!dir) return date;
			var new_date = new Date(date.valueOf()),
				day = new_date.getUTCDate(),
				month = new_date.getUTCMonth(),
				mag = Math.abs(dir),
				new_month, test;
			dir = dir > 0 ? 1 : -1;
			if (mag == 1) {
				test = dir == -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function () {
					return new_date.getUTCMonth() == month;
				}
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function () {
					return new_date.getUTCMonth() != new_month;
				};
				new_month = month + dir;
				new_date.setUTCMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				if (new_month < 0 || new_month > 11)
					new_month = (new_month + 12) % 12;
			} else {
				// For magnitudes >1, move one month at a time...
				for (var i = 0; i < mag; i++)
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				// ...then reset the day, keeping it in the new month
				new_month = new_date.getUTCMonth();
				new_date.setUTCDate(day);
				test = function () {
					return new_month != new_date.getUTCMonth();
				};
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()) {
				new_date.setUTCDate(--day);
				new_date.setUTCMonth(new_month);
			}
			return new_date;
		},

		moveYear: function (date, dir) {
			return this.moveMonth(date, dir * 12);
		},

		dateWithinRange: function (date) {
			return date >= this.startDate && date <= this.endDate;
		},

		keydown: function (e) {
			if (this.picker.is(':not(:visible)')) {
				if (e.keyCode == 27) // allow escape to hide and re-show picker
					this.show();
				return;
			}
			var dateChanged = false,
				dir, day, month,
				newDate, newViewDate;
			switch (e.keyCode) {
				case 27: // escape
					this.hide();
					e.preventDefault();
					break;
				case 37: // left
				case 39: // right
					if (!this.keyboardNavigation) break;
					dir = e.keyCode == 37 ? -1 : 1;
					viewMode = this.viewMode;
					if (e.ctrlKey) {
						viewMode += 2;
					} else if (e.shiftKey) {
						viewMode += 1;
					}
					if (viewMode == 4) {
						newDate = this.moveYear(this.date, dir);
						newViewDate = this.moveYear(this.viewDate, dir);
					} else if (viewMode == 3) {
						newDate = this.moveMonth(this.date, dir);
						newViewDate = this.moveMonth(this.viewDate, dir);
					} else if (viewMode == 2) {
						newDate = this.moveDate(this.date, dir);
						newViewDate = this.moveDate(this.viewDate, dir);
					} else if (viewMode == 1) {
						newDate = this.moveHour(this.date, dir);
						newViewDate = this.moveHour(this.viewDate, dir);
					} else if (viewMode == 0) {
						newDate = this.moveMinute(this.date, dir);
						newViewDate = this.moveMinute(this.viewDate, dir);
					}
					if (this.dateWithinRange(newDate)) {
						this.date = newDate;
						this.viewDate = newViewDate;
						this.setValue();
						this.update();
						e.preventDefault();
						dateChanged = true;
					}
					break;
				case 38: // up
				case 40: // down
					if (!this.keyboardNavigation) break;
					dir = e.keyCode == 38 ? -1 : 1;
					viewMode = this.viewMode;
					if (e.ctrlKey) {
						viewMode += 2;
					} else if (e.shiftKey) {
						viewMode += 1;
					}
					if (viewMode == 4) {
						newDate = this.moveYear(this.date, dir);
						newViewDate = this.moveYear(this.viewDate, dir);
					} else if (viewMode == 3) {
						newDate = this.moveMonth(this.date, dir);
						newViewDate = this.moveMonth(this.viewDate, dir);
					} else if (viewMode == 2) {
						newDate = this.moveDate(this.date, dir * 7);
						newViewDate = this.moveDate(this.viewDate, dir * 7);
					} else if (viewMode == 1) {
						if (this.showMeridian) {
							newDate = this.moveHour(this.date, dir * 6);
							newViewDate = this.moveHour(this.viewDate, dir * 6);
						} else {
							newDate = this.moveHour(this.date, dir * 4);
							newViewDate = this.moveHour(this.viewDate, dir * 4);
						}
					} else if (viewMode == 0) {
						newDate = this.moveMinute(this.date, dir * 4);
						newViewDate = this.moveMinute(this.viewDate, dir * 4);
					}
					if (this.dateWithinRange(newDate)) {
						this.date = newDate;
						this.viewDate = newViewDate;
						this.setValue();
						this.update();
						e.preventDefault();
						dateChanged = true;
					}
					break;
				case 13: // enter
					if (this.viewMode != 0) {
						var oldViewMode = this.viewMode;
						this.showMode(-1);
						this.fill();
						if (oldViewMode == this.viewMode && this.autoclose) {
							this.hide();
						}
					} else {
						this.fill();
						if (this.autoclose) {
							this.hide();
						}
					}
					e.preventDefault();
					break;
				case 9: // tab
					this.hide();
					break;
			}
			if (dateChanged) {
				var element;
				if (this.isInput) {
					element = this.element;
				} else if (this.component) {
					element = this.element.find('input');
				}
				if (element) {
					element.change();
				}
				this.element.trigger({
					type: 'changeDate',
					date: this.date
				});
			}
		},

		showMode: function (dir) {
			if (dir) {
				var newViewMode = Math.max(0, Math.min(DPGlobal.modes.length - 1, this.viewMode + dir));
				if (newViewMode >= this.minView && newViewMode <= this.maxView) {
					this.element.trigger({
						type:        'changeMode',
						date:        this.viewDate,
						oldViewMode: this.viewMode,
						newViewMode: newViewMode
					});

					this.viewMode = newViewMode;
				}
			}
			/*
			 vitalets: fixing bug of very special conditions:
			 jquery 1.7.1 + webkit + show inline datetimepicker in bootstrap popover.
			 Method show() does not set display css correctly and datetimepicker is not shown.
			 Changed to .css('display', 'block') solve the problem.
			 See https://github.com/vitalets/x-editable/issues/37

			 In jquery 1.7.2+ everything works fine.
			 */
			//this.picker.find('>div').hide().filter('.datetimepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
			this.picker.find('>div').hide().filter('.datetimepicker-' + DPGlobal.modes[this.viewMode].clsName).css('display', 'block');
			this.updateNavArrows();
		},

		reset: function (e) {
			this._setDate(null, 'date');
		},

		convertViewModeText:  function (viewMode) {
			switch (viewMode) {
				case 4:
					return 'decade';
				case 3:
					return 'year';
				case 2:
					return 'month';
				case 1:
					return 'day';
				case 0:
					return 'hour';
			}
		}
	};

	$.fn.datetimepicker = function (option) {
		var args = Array.apply(null, arguments);
		args.shift();
		var internal_return;
		this.each(function () {
			var $this = $(this),
				data = $this.data('datetimepicker'),
				options = typeof option == 'object' && option;
			if (!data) {
				$this.data('datetimepicker', (data = new Datetimepicker(this, $.extend({}, $.fn.datetimepicker.defaults, options))));
			}
			if (typeof option == 'string' && typeof data[option] == 'function') {
				internal_return = data[option].apply(data, args);
				if (internal_return !== undefined) {
					return false;
				}
			}
		});
		if (internal_return !== undefined)
			return internal_return;
		else
			return this;
	};

	$.fn.datetimepicker.defaults = {
	};
	$.fn.datetimepicker.Constructor = Datetimepicker;
	var dates = $.fn.datetimepicker.dates = {
		en: {
			days:        ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			daysShort:   ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			daysMin:     ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
			months:      ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			meridiem:    ["am", "pm"],
			suffix:      ["st", "nd", "rd", "th"],
			today:       "Today"
		}
	};

	var DPGlobal = {
		modes:            [
			{
				clsName: 'minutes',
				navFnc:  'Hours',
				navStep: 1
			},
			{
				clsName: 'hours',
				navFnc:  'Date',
				navStep: 1
			},
			{
				clsName: 'days',
				navFnc:  'Month',
				navStep: 1
			},
			{
				clsName: 'months',
				navFnc:  'FullYear',
				navStep: 1
			},
			{
				clsName: 'years',
				navFnc:  'FullYear',
				navStep: 10
			}
		],
		isLeapYear:       function (year) {
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
		},
		getDaysInMonth:   function (year, month) {
			return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
		},
		getDefaultFormat: function (type, field) {
			if (type == "standard") {
				if (field == 'input')
					return 'yyyy-mm-dd hh:ii';
				else
					return 'yyyy-mm-dd hh:ii:ss';
			} else if (type == "php") {
				if (field == 'input')
					return 'Y-m-d H:i';
				else
					return 'Y-m-d H:i:s';
			} else {
				throw new Error("Invalid format type.");
			}
		},
		validParts:       function (type) {
			if (type == "standard") {
				return /hh?|HH?|p|P|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g;
			} else if (type == "php") {
				return /[dDjlNwzFmMnStyYaABgGhHis]/g;
			} else {
				throw new Error("Invalid format type.");
			}
		},
		nonpunctuation:   /[^ -\/:-@\[-`{-~\t\n\rTZ]+/g,
		parseFormat:      function (format, type) {
			// IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts(type), '\0').split('\0'),
				parts = format.match(this.validParts(type));
			if (!separators || !separators.length || !parts || parts.length == 0) {
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		parseDate:        function (date, format, language, type) {
			if (date instanceof Date) {
				var dateUTC = new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
				dateUTC.setMilliseconds(0);
				return dateUTC;
			}
			if (/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(date)) {
				format = this.parseFormat('yyyy-mm-dd', type);
			}
			if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}$/.test(date)) {
				format = this.parseFormat('yyyy-mm-dd hh:ii', type);
			}
			if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}\:\d{1,2}[Z]{0,1}$/.test(date)) {
				format = this.parseFormat('yyyy-mm-dd hh:ii:ss', type);
			}
			if (/^[-+]\d+[dmwy]([\s,]+[-+]\d+[dmwy])*$/.test(date)) {
				var part_re = /([-+]\d+)([dmwy])/,
					parts = date.match(/([-+]\d+)([dmwy])/g),
					part, dir;
				date = new Date();
				for (var i = 0; i < parts.length; i++) {
					part = part_re.exec(parts[i]);
					dir = parseInt(part[1]);
					switch (part[2]) {
						case 'd':
							date.setUTCDate(date.getUTCDate() + dir);
							break;
						case 'm':
							date = Datetimepicker.prototype.moveMonth.call(Datetimepicker.prototype, date, dir);
							break;
						case 'w':
							date.setUTCDate(date.getUTCDate() + dir * 7);
							break;
						case 'y':
							date = Datetimepicker.prototype.moveYear.call(Datetimepicker.prototype, date, dir);
							break;
					}
				}
				return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), 0);
			}
			var parts = date && date.match(this.nonpunctuation) || [],
				date = new Date(0, 0, 0, 0, 0, 0, 0),
				parsed = {},
				setters_order = ['hh', 'h', 'ii', 'i', 'ss', 's', 'yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'D', 'DD', 'd', 'dd', 'H', 'HH', 'p', 'P'],
				setters_map = {
					hh:   function (d, v) {
						return d.setUTCHours(v);
					},
					h:    function (d, v) {
						return d.setUTCHours(v);
					},
					HH:   function (d, v) {
						return d.setUTCHours(v == 12 ? 0 : v);
					},
					H:    function (d, v) {
						return d.setUTCHours(v == 12 ? 0 : v);
					},
					ii:   function (d, v) {
						return d.setUTCMinutes(v);
					},
					i:    function (d, v) {
						return d.setUTCMinutes(v);
					},
					ss:   function (d, v) {
						return d.setUTCSeconds(v);
					},
					s:    function (d, v) {
						return d.setUTCSeconds(v);
					},
					yyyy: function (d, v) {
						return d.setUTCFullYear(v);
					},
					yy:   function (d, v) {
						return d.setUTCFullYear(2000 + v);
					},
					m:    function (d, v) {
						v -= 1;
						while (v < 0) v += 12;
						v %= 12;
						d.setUTCMonth(v);
						while (d.getUTCMonth() != v)
							if (isNaN(d.getUTCMonth()))
								return d;
							else
								d.setUTCDate(d.getUTCDate() - 1);
						return d;
					},
					d:    function (d, v) {
						return d.setUTCDate(v);
					},
					p:    function (d, v) {
						return d.setUTCHours(v == 1 ? d.getUTCHours() + 12 : d.getUTCHours());
					}
				},
				val, filtered, part;
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			setters_map['P'] = setters_map['p'];
			date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
			if (parts.length == format.parts.length) {
				for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
					val = parseInt(parts[i], 10);
					part = format.parts[i];
					if (isNaN(val)) {
						switch (part) {
							case 'MM':
								filtered = $(dates[language].months).filter(function () {
									var m = this.slice(0, parts[i].length),
										p = parts[i].slice(0, m.length);
									return m == p;
								});
								val = $.inArray(filtered[0], dates[language].months) + 1;
								break;
							case 'M':
								filtered = $(dates[language].monthsShort).filter(function () {
									var m = this.slice(0, parts[i].length),
										p = parts[i].slice(0, m.length);
									return m.toLowerCase() == p.toLowerCase();
								});
								val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
								break;
							case 'p':
							case 'P':
								val = $.inArray(parts[i].toLowerCase(), dates[language].meridiem);
								break;
						}
					}
					parsed[part] = val;
				}
				for (var i = 0, s; i < setters_order.length; i++) {
					s = setters_order[i];
					if (s in parsed && !isNaN(parsed[s]))
						setters_map[s](date, parsed[s])
				}
			}
			return date;
		},
		formatDate:       function (date, format, language, type) {
			if (date == null) {
				return '';
			}
			var val;
			if (type == 'standard') {
				val = {
					// year
					yy:   date.getUTCFullYear().toString().substring(2),
					yyyy: date.getUTCFullYear(),
					// month
					m:    date.getUTCMonth() + 1,
					M:    dates[language].monthsShort[date.getUTCMonth()],
					MM:   dates[language].months[date.getUTCMonth()],
					// day
					d:    date.getUTCDate(),
					D:    dates[language].daysShort[date.getUTCDay()],
					DD:   dates[language].days[date.getUTCDay()],
					p:    (dates[language].meridiem.length == 2 ? dates[language].meridiem[date.getUTCHours() < 12 ? 0 : 1] : ''),
					// hour
					h:    date.getUTCHours(),
					// minute
					i:    date.getUTCMinutes(),
					// second
					s:    date.getUTCSeconds()
				};

				if (dates[language].meridiem.length == 2) {
					val.H = (val.h % 12 == 0 ? 12 : val.h % 12);
				}
				else {
					val.H = val.h;
				}
				val.HH = (val.H < 10 ? '0' : '') + val.H;
				val.P = val.p.toUpperCase();
				val.hh = (val.h < 10 ? '0' : '') + val.h;
				val.ii = (val.i < 10 ? '0' : '') + val.i;
				val.ss = (val.s < 10 ? '0' : '') + val.s;
				val.dd = (val.d < 10 ? '0' : '') + val.d;
				val.mm = (val.m < 10 ? '0' : '') + val.m;
			} else if (type == 'php') {
				// php format
				val = {
					// year
					y: date.getUTCFullYear().toString().substring(2),
					Y: date.getUTCFullYear(),
					// month
					F: dates[language].months[date.getUTCMonth()],
					M: dates[language].monthsShort[date.getUTCMonth()],
					n: date.getUTCMonth() + 1,
					t: DPGlobal.getDaysInMonth(date.getUTCFullYear(), date.getUTCMonth()),
					// day
					j: date.getUTCDate(),
					l: dates[language].days[date.getUTCDay()],
					D: dates[language].daysShort[date.getUTCDay()],
					w: date.getUTCDay(), // 0 -> 6
					N: (date.getUTCDay() == 0 ? 7 : date.getUTCDay()),       // 1 -> 7
					S: (date.getUTCDate() % 10 <= dates[language].suffix.length ? dates[language].suffix[date.getUTCDate() % 10 - 1] : ''),
					// hour
					a: (dates[language].meridiem.length == 2 ? dates[language].meridiem[date.getUTCHours() < 12 ? 0 : 1] : ''),
					g: (date.getUTCHours() % 12 == 0 ? 12 : date.getUTCHours() % 12),
					G: date.getUTCHours(),
					// minute
					i: date.getUTCMinutes(),
					// second
					s: date.getUTCSeconds()
				};
				val.m = (val.n < 10 ? '0' : '') + val.n;
				val.d = (val.j < 10 ? '0' : '') + val.j;
				val.A = val.a.toString().toUpperCase();
				val.h = (val.g < 10 ? '0' : '') + val.g;
				val.H = (val.G < 10 ? '0' : '') + val.G;
				val.i = (val.i < 10 ? '0' : '') + val.i;
				val.s = (val.s < 10 ? '0' : '') + val.s;
			} else {
				throw new Error("Invalid format type.");
			}
			var date = [],
				seps = $.extend([], format.separators);
			for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
				if (seps.length) {
					date.push(seps.shift());
				}
				date.push(val[format.parts[i]]);
			}
			if (seps.length) {
				date.push(seps.shift());
			}
			return date.join('');
		},
		convertViewMode:  function (viewMode) {
			switch (viewMode) {
				case 4:
				case 'decade':
					viewMode = 4;
					break;
				case 3:
				case 'year':
					viewMode = 3;
					break;
				case 2:
				case 'month':
					viewMode = 2;
					break;
				case 1:
				case 'day':
					viewMode = 1;
					break;
				case 0:
				case 'hour':
					viewMode = 0;
					break;
			}

			return viewMode;
		},
		headTemplate:     '<thead>' +
							  '<tr>' +
							  '<th class="prev"><i class="icon-arrow-left"/></th>' +
							  '<th colspan="5" class="switch"></th>' +
							  '<th class="next"><i class="icon-arrow-right"/></th>' +
							  '</tr>' +
			'</thead>',
		headTemplateV3:   '<thead>' +
							  '<tr>' +
							  '<th class="prev"><span class="glyphicon glyphicon-arrow-left"></span> </th>' +
							  '<th colspan="5" class="switch"></th>' +
							  '<th class="next"><span class="glyphicon glyphicon-arrow-right"></span> </th>' +
							  '</tr>' +
			'</thead>',
		contTemplate:     '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate:     '<tfoot><tr><th colspan="7" class="today"></th></tr></tfoot>'
	};
	DPGlobal.template = '<div class="datetimepicker">' +
		'<div class="datetimepicker-minutes">' +
		'<table class=" table-condensed">' +
		DPGlobal.headTemplate +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-hours">' +
		'<table class=" table-condensed">' +
		DPGlobal.headTemplate +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-days">' +
		'<table class=" table-condensed">' +
		DPGlobal.headTemplate +
		'<tbody></tbody>' +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-months">' +
		'<table class="table-condensed">' +
		DPGlobal.headTemplate +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-years">' +
		'<table class="table-condensed">' +
		DPGlobal.headTemplate +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'</div>';
	DPGlobal.templateV3 = '<div class="datetimepicker">' +
		'<div class="datetimepicker-minutes">' +
		'<table class=" table-condensed">' +
		DPGlobal.headTemplateV3 +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-hours">' +
		'<table class=" table-condensed">' +
		DPGlobal.headTemplateV3 +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-days">' +
		'<table class=" table-condensed">' +
		DPGlobal.headTemplateV3 +
		'<tbody></tbody>' +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-months">' +
		'<table class="table-condensed">' +
		DPGlobal.headTemplateV3 +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-years">' +
		'<table class="table-condensed">' +
		DPGlobal.headTemplateV3 +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'</div>';
	$.fn.datetimepicker.DPGlobal = DPGlobal;

	/* DATETIMEPICKER NO CONFLICT
	 * =================== */

	$.fn.datetimepicker.noConflict = function () {
		$.fn.datetimepicker = old;
		return this;
	};

	/* DATETIMEPICKER DATA-API
	 * ================== */

	$(document).on(
		'focus.datetimepicker.data-api click.datetimepicker.data-api',
		'[data-provide="datetimepicker"]',
		function (e) {
			var $this = $(this);
			if ($this.data('datetimepicker')) return;
			e.preventDefault();
			// component click requires us to explicitly show it
			$this.datetimepicker('show');
		}
	);
	$(function () {
		$('[data-provide="datetimepicker-inline"]').datetimepicker();
	});

}(window.jQuery);
;
;(function($){
	$.fn.datetimepicker.dates['pt'] = {
		days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
		daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
		daysMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa", "Do"],
		months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
		monthsShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
		suffix: [],
		meridiem: ["am","pm"],
		today: "Hoje"
	};
}(jQuery));
;
/*! Bootstrap Growl - v1.0.6 - 2014-01-29
 * https://github.com/mouse0270/bootstrap-growl
 * Copyright (c) 2014 Remable Designs; Licensed MIT */

(function($, window, document, undefined) {
	'use strict';
	var bootstrap_growl_remove = [];

	$.growl = function(content, options) {
		var message = null,
			title = null,
			icon = null,
			$growl, growlClass, css, offsetAmount;

		if (typeof content == 'object') {
			message = content.message;
			title = content.title ? ' ' + content.title + ' ' : null;
			icon = content.icon ? content.icon : null;
			options = content;
		} else {
			message = content;
		}

		/* ===== CORRECT MISSING OPTIONS ===== */
		options = $.extend(true, {}, $.growl.default_options, options);

		// Set the template icon to be either a span or an image depending on icon_type
		if (options.template.icon_type === 'class') {
			options.template.icon = '<span class="">';
		} else {
			options.template.icon = '<img src="" />';
		}

		/* ===== BUILD GROWL CONTAINER ===== */
		growlClass = 'bootstrap-growl-' + options.position.from + '-' + options.position.align;
		$growl = $(options.template.container);
		$growl.addClass(growlClass);

		if (options.type) {
			$growl.addClass('alert-' + options.type);
		} else {
			$growl.addClass('alert-info');
		}

		if (options.allow_dismiss) {
			$growl.append($(options.template.dismiss));
		}

		if (icon) {
			if (options.template.icon) {
				if (options.template.icon_type == 'class') {
					$growl.append($(options.template.icon).addClass(icon));
				} else {
					$growl.append($(options.template.icon).attr('src', icon));
				}
			} else {
				$growl.append(icon);
			}
		}

		if (title) {
			if (options.template.title) {
				$growl.append($(options.template.title).html(title));
			} else {
				$growl.append(title);
			}
			$growl.append(options.template.title_divider);
		}

		if (options.template.message) {
			$growl.append($(options.template.message).html(message));
		} else {
			$growl.append(message);
		}

		/* ===== DETERMINE GROWL POSITION ===== */
		offsetAmount = options.offset;

		$('.' + growlClass).each(function() {
			return offsetAmount = Math.max(offsetAmount, parseInt($(this).css(options.position.from)) + $(this).outerHeight() + options.spacing);
		});

		css = {
			'position': (options.ele === 'body' ? 'fixed' : 'absolute'),
			'margin': 0,
			'z-index': options.z_index,
			'display': 'none'
		};

		css[options.position.from] = offsetAmount + 'px';
		$growl.css(css);
		$(options.ele).append($growl);

		switch (options.position.align) {
			case 'center':
				$growl.css({
					'left': '50%',
					'marginLeft': -($growl.outerWidth() / 2) + 'px'
				});
				break;
			case 'left':
				$growl.css('left', options.offset + 'px');
				break;
			case 'right':
				$growl.css('right', options.offset + 'px');
				break;
		}

		/* ===== DETERMINE GROWL POSITION ===== */
		if (options.onGrowlShow) {
			options.onGrowlShow(event);
		}

		var fadeIn = $growl.fadeIn(options.fade_in, function(event) {
			if (options.onGrowlShown) {
				options.onGrowlShown(event);
			}

			/* ===== HANDEL DELAY AND PAUSE ON MOUSE OVER ===== */
			if (options.delay > 0) {
				if (options.pause_on_mouseover == true) {
					$growl.on('mouseover', function() {
						clearTimeout(bootstrap_growl_remove[$growl.index()]);
					}).on('mouseleave', function() {
						bootstrap_growl_remove[$growl.index()] = setTimeout(function() {
							return $growl.alert('close');
						}, options.delay);
					});
				}

				bootstrap_growl_remove[$growl.index()] = setTimeout(function() {
					return $growl.alert('close');
				}, options.delay);
			}
		});

		$growl.bind('close.bs.alert', function(event) {
			if (options.onGrowlClose) {
				options.onGrowlClose(event);
			}
		});

		$growl.bind('closed.bs.alert', function(event) {
			if (options.onGrowlClosed) {
				options.onGrowlClosed(event);
			}

			var pos = $(this).css(options.position.from);
			$(this).nextAll('.' + growlClass).each(function() {
				$(this).css(options.position.from, pos);
				pos = (parseInt(pos) + (options.spacing)) + $(this).outerHeight();
			});
		});

		return $growl;

	};

	$.growl.default_options = {
		ele: 'body',
		type: 'info',
		allow_dismiss: true,
		position: {
			from: 'top',
			align: 'right'
		},
		offset: 20,
		spacing: 10,
		z_index: 1031,
		fade_in: 400,
		delay: 5000,
		pause_on_mouseover: false,
		onGrowlShow: null,
		onGrowlShown: null,
		onGrowlClose: null,
		onGrowlClosed: null,
		template: {
			icon_type: 'class',
			container: '<div class="col-xs-10 col-sm-4 col-md-3 alert notifications">',
			dismiss: '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>',
			title: '<strong>',
			title_divider: '',
			message: ''
		}
	};

})(jQuery, window, document);;
(function ($) {
  "use strict";

  var defaultOptions = {
    tagClass: function(item) {
      return 'label label-info';
    },
    itemValue: function(item) {
      return item ? item.toString() : item;
    },
    itemText: function(item) {
      return this.itemValue(item);
    },
    freeInput: true,
    maxTags: undefined,
    confirmKeys: [13],
    onTagExists: function(item, $tag) {
      $tag.hide().fadeIn();
    }
  };

  /**
   * Constructor function
   */
  function TagsInput(element, options) {
    this.itemsArray = [];

    this.$element = $(element);
    this.$element.hide();

    this.isSelect = (element.tagName === 'SELECT');
    this.multiple = (this.isSelect && element.hasAttribute('multiple'));
    this.objectItems = options && options.itemValue;
    this.placeholderText = element.hasAttribute('placeholder') ? this.$element.attr('placeholder') : '';
    this.inputSize = Math.max(1, this.placeholderText.length);

    this.$container = $('<div class="bootstrap-tagsinput"></div>');
    this.$input = $('<input size="' + this.inputSize + '" type="text" placeholder="' + this.placeholderText + '"/>').appendTo(this.$container);

    this.$element.after(this.$container);

    this.build(options);
  }

  TagsInput.prototype = {
    constructor: TagsInput,

    /**
     * Adds the given item as a new tag. Pass true to dontPushVal to prevent
     * updating the elements val()
     */
    add: function(item, dontPushVal) {
      var self = this;

      if (self.options.maxTags && self.itemsArray.length >= self.options.maxTags)
        return;

      // Ignore falsey values, except false
      if (item !== false && !item)
        return;

      // Throw an error when trying to add an object while the itemValue option was not set
      if (typeof item === "object" && !self.objectItems)
        throw("Can't add objects when itemValue option is not set");

      // Ignore strings only containg whitespace
      if (item.toString().match(/^\s*$/))
        return;

      // If SELECT but not multiple, remove current tag
      if (self.isSelect && !self.multiple && self.itemsArray.length > 0)
        self.remove(self.itemsArray[0]);

      if (typeof item === "string" && this.$element[0].tagName === 'INPUT') {
        var items = item.split(',');
        if (items.length > 1) {
          for (var i = 0; i < items.length; i++) {
            this.add(items[i], true);
          }

          if (!dontPushVal)
            self.pushVal();
          return;
        }
      }

      var itemValue = self.options.itemValue(item),
          itemText = self.options.itemText(item),
          tagClass = self.options.tagClass(item);

      // Ignore items allready added
      var existing = $.grep(self.itemsArray, function(item) { return self.options.itemValue(item) === itemValue; } )[0];
      if (existing) {
        // Invoke onTagExists
        if (self.options.onTagExists) {
          var $existingTag = $(".tag", self.$container).filter(function() { return $(this).data("item") === existing; });
          self.options.onTagExists(item, $existingTag);
        }
        return;
      }

      // register item in internal array and map
      self.itemsArray.push(item);

      // add a tag element
      var $tag = $('<span class="tag ' + htmlEncode(tagClass) + '">' + htmlEncode(itemText) + '<span data-role="remove"></span></span>');
      $tag.data('item', item);
      self.findInputWrapper().before($tag);
      $tag.after(' ');

      // add <option /> if item represents a value not present in one of the <select />'s options
      if (self.isSelect && !$('option[value="' + escape(itemValue) + '"]',self.$element)[0]) {
        var $option = $('<option selected>' + htmlEncode(itemText) + '</option>');
        $option.data('item', item);
        $option.attr('value', itemValue);
        self.$element.append($option);
      }

      if (!dontPushVal)
        self.pushVal();

      // Add class when reached maxTags
      if (self.options.maxTags === self.itemsArray.length)
        self.$container.addClass('bootstrap-tagsinput-max');

      self.$element.trigger($.Event('itemAdded', { item: item }));
    },

    /**
     * Removes the given item. Pass true to dontPushVal to prevent updating the
     * elements val()
     */
    remove: function(item, dontPushVal) {
      var self = this;

      if (self.objectItems) {
        if (typeof item === "object")
          item = $.grep(self.itemsArray, function(other) { return self.options.itemValue(other) ==  self.options.itemValue(item); } )[0];
        else
          item = $.grep(self.itemsArray, function(other) { return self.options.itemValue(other) ==  item; } )[0];
      }

      if (item) {
        $('.tag', self.$container).filter(function() { return $(this).data('item') === item; }).remove();
        $('option', self.$element).filter(function() { return $(this).data('item') === item; }).remove();
        self.itemsArray.splice($.inArray(item, self.itemsArray), 1);
      }

      if (!dontPushVal)
        self.pushVal();

      // Remove class when reached maxTags
      if (self.options.maxTags > self.itemsArray.length)
        self.$container.removeClass('bootstrap-tagsinput-max');

      self.$element.trigger($.Event('itemRemoved',  { item: item }));
    },

    /**
     * Removes all items
     */
    removeAll: function() {
      var self = this;

      $('.tag', self.$container).remove();
      $('option', self.$element).remove();

      while(self.itemsArray.length > 0)
        self.itemsArray.pop();

      self.pushVal();

      if (self.options.maxTags && !this.isEnabled())
        this.enable();
    },

    /**
     * Refreshes the tags so they match the text/value of their corresponding
     * item.
     */
    refresh: function() {
      var self = this;
      $('.tag', self.$container).each(function() {
        var $tag = $(this),
            item = $tag.data('item'),
            itemValue = self.options.itemValue(item),
            itemText = self.options.itemText(item),
            tagClass = self.options.tagClass(item);

          // Update tag's class and inner text
          $tag.attr('class', null);
          $tag.addClass('tag ' + htmlEncode(tagClass));
          $tag.contents().filter(function() {
            return this.nodeType == 3;
          })[0].nodeValue = htmlEncode(itemText);

          if (self.isSelect) {
            var option = $('option', self.$element).filter(function() { return $(this).data('item') === item; });
            option.attr('value', itemValue);
          }
      });
    },

    /**
     * Returns the items added as tags
     */
    items: function() {
      return this.itemsArray;
    },

    /**
     * Assembly value by retrieving the value of each item, and set it on the
     * element. 
     */
    pushVal: function() {
      var self = this,
          val = $.map(self.items(), function(item) {
            return self.options.itemValue(item).toString();
          });

      self.$element.val(val, true).trigger('change');
    },

    /**
     * Initializes the tags input behaviour on the element
     */
    build: function(options) {
      var self = this;

      self.options = $.extend({}, defaultOptions, options);
      var typeahead = self.options.typeahead || {};

      // When itemValue is set, freeInput should always be false
      if (self.objectItems)
        self.options.freeInput = false;

      makeOptionItemFunction(self.options, 'itemValue');
      makeOptionItemFunction(self.options, 'itemText');
      makeOptionItemFunction(self.options, 'tagClass');

      // for backwards compatibility, self.options.source is deprecated
      if (self.options.source)
        typeahead.source = self.options.source;

      if (typeahead.source && $.fn.typeahead) {
        makeOptionFunction(typeahead, 'source');

        self.$input.typeahead({
          source: function (query, process) {
            function processItems(items) {
              var texts = [];

              for (var i = 0; i < items.length; i++) {
                var text = self.options.itemText(items[i]);
                map[text] = items[i];
                texts.push(text);
              }
              process(texts);
            }

            this.map = {};
            var map = this.map,
                data = typeahead.source(query);

            if ($.isFunction(data.success)) {
              // support for Angular promises
              data.success(processItems);
            } else {
              // support for functions and jquery promises
              $.when(data)
               .then(processItems);
            }
          },
          updater: function (text) {
            self.add(this.map[text]);
          },
          matcher: function (text) {
            return (text.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1);
          },
          sorter: function (texts) {
            return texts.sort();
          },
          highlighter: function (text) {
            var regex = new RegExp( '(' + this.query + ')', 'gi' );
            return text.replace( regex, "<strong>$1</strong>" );
          }
        });
      }

      self.$container.on('click', $.proxy(function(event) {
        self.$input.focus();
      }, self));

      self.$container.on('keydown', 'input', $.proxy(function(event) {
        var $input = $(event.target),
            $inputWrapper = self.findInputWrapper();

        switch (event.which) {
          // BACKSPACE
          case 8:
            if (doGetCaretPosition($input[0]) === 0) {
              var prev = $inputWrapper.prev();
              if (prev) {
                self.remove(prev.data('item'));
              }
            }
            break;

          // DELETE
          case 46:
            if (doGetCaretPosition($input[0]) === 0) {
              var next = $inputWrapper.next();
              if (next) {
                self.remove(next.data('item'));
              }
            }
            break;

          // LEFT ARROW
          case 37:
            // Try to move the input before the previous tag
            var $prevTag = $inputWrapper.prev();
            if ($input.val().length === 0 && $prevTag[0]) {
              $prevTag.before($inputWrapper);
              $input.focus();
            }
            break;
          // RIGHT ARROW
          case 39:
            // Try to move the input after the next tag
            var $nextTag = $inputWrapper.next();
            if ($input.val().length === 0 && $nextTag[0]) {
              $nextTag.after($inputWrapper);
              $input.focus();
            }
            break;
         default:
            // When key corresponds one of the confirmKeys, add current input
            // as a new tag
            if (self.options.freeInput && $.inArray(event.which, self.options.confirmKeys) >= 0) {
              self.add($input.val());
              $input.val('');
              event.preventDefault();
            }
        }

        // Reset internal input's size
        $input.attr('size', Math.max(this.inputSize, $input.val().length));
      }, self));

      // Remove icon clicked
      self.$container.on('click', '[data-role=remove]', $.proxy(function(event) {
        self.remove($(event.target).closest('.tag').data('item'));
      }, self));

      // Only add existing value as tags when using strings as tags
      if (self.options.itemValue === defaultOptions.itemValue) {
        if (self.$element[0].tagName === 'INPUT') {
            self.add(self.$element.val());
        } else {
          $('option', self.$element).each(function() {
            self.add($(this).attr('value'), true);
          });
        }
      }
    },

    /**
     * Removes all tagsinput behaviour and unregsiter all event handlers
     */
    destroy: function() {
      var self = this;

      // Unbind events
      self.$container.off('keypress', 'input');
      self.$container.off('click', '[role=remove]');

      self.$container.remove();
      self.$element.removeData('tagsinput');
      self.$element.show();
    },

    /**
     * Sets focus on the tagsinput 
     */
    focus: function() {
      this.$input.focus();
    },

    /**
     * Returns the internal input element
     */
    input: function() {
      return this.$input;
    },

    /**
     * Returns the element which is wrapped around the internal input. This
     * is normally the $container, but typeahead.js moves the $input element.
     */
    findInputWrapper: function() {
      var elt = this.$input[0],
          container = this.$container[0];
      while(elt && elt.parentNode !== container)
        elt = elt.parentNode;

      return $(elt);
    }
  };

  /**
   * Register JQuery plugin
   */
  $.fn.tagsinput = function(arg1, arg2) {
    var results = [];

    this.each(function() {
      var tagsinput = $(this).data('tagsinput');

      // Initialize a new tags input
      if (!tagsinput) {
        tagsinput = new TagsInput(this, arg1);
        $(this).data('tagsinput', tagsinput);
        results.push(tagsinput);

        if (this.tagName === 'SELECT') {
          $('option', $(this)).attr('selected', 'selected');
        }

        // Init tags from $(this).val()
        $(this).val($(this).val());
      } else {
        // Invoke function on existing tags input
        var retVal = tagsinput[arg1](arg2);
        if (retVal !== undefined)
          results.push(retVal);
      }
    });

    if ( typeof arg1 == 'string') {
      // Return the results from the invoked function calls
      return results.length > 1 ? results : results[0];
    } else {
      return results;
    }
  };

  $.fn.tagsinput.Constructor = TagsInput;
  
  /**
   * Most options support both a string or number as well as a function as 
   * option value. This function makes sure that the option with the given
   * key in the given options is wrapped in a function
   */
  function makeOptionItemFunction(options, key) {
    if (typeof options[key] !== 'function') {
      var propertyName = options[key];
      options[key] = function(item) { return item[propertyName]; };
    }
  }
  function makeOptionFunction(options, key) {
    if (typeof options[key] !== 'function') {
      var value = options[key];
      options[key] = function() { return value; };
    }
  }
  /**
   * HtmlEncodes the given value
   */
  var htmlEncodeContainer = $('<div />');
  function htmlEncode(value) {
    if (value) {
      return htmlEncodeContainer.text(value).html();
    } else {
      return '';
    }
  }

  /**
   * Returns the position of the caret in the given input field
   * http://flightschool.acylt.com/devnotes/caret-position-woes/
   */
  function doGetCaretPosition(oField) {
    var iCaretPos = 0;
    if (document.selection) {
      oField.focus ();
      var oSel = document.selection.createRange();
      oSel.moveStart ('character', -oField.value.length);
      iCaretPos = oSel.text.length;
    } else if (oField.selectionStart || oField.selectionStart == '0') {
      iCaretPos = oField.selectionStart;
    }
    return (iCaretPos);
  }

  /**
   * Initialize tagsinput behaviour on inputs and selects which have
   * data-role=tagsinput
   */
  $(function() {
    $("input[data-role=tagsinput], select[multiple][data-role=tagsinput]").tagsinput();
  });
})(window.jQuery);
;
/*global jQuery, $, FileReader*/
/*jslint browser:true*/
(function ($) {
	'use strict';
	var readFileIntoDataUrl = function (fileInfo) {
		var loader = $.Deferred(),
			fReader = new FileReader();
		fReader.onload = function (e) {
			loader.resolve(e.target.result);
		};
		fReader.onerror = loader.reject;
		fReader.onprogress = loader.notify;
		fReader.readAsDataURL(fileInfo);
		return loader.promise();
	};
	$.fn.cleanHtml = function () {
		var html = $(this).html();
		return html && html.replace(/(<br>|\s|<div><br><\/div>|&nbsp;)*$/, '');
	};
	$.fn.wysiwyg = function (userOptions) {
		var editor = this,
			selectedRange,
			options,
			toolbarBtnSelector,
			updateToolbar = function () {
				if (options.activeToolbarClass) {
					$(options.toolbarSelector).find(toolbarBtnSelector).each(function () {
						var command = $(this).data(options.commandRole);
						if (document.queryCommandState(command)) {
							$(this).addClass(options.activeToolbarClass);
						} else {
							$(this).removeClass(options.activeToolbarClass);
						}
					});
				}
			},
			execCommand = function (commandWithArgs, valueArg) {
				var commandArr = commandWithArgs.split(' '),
					command = commandArr.shift(),
					args = commandArr.join(' ') + (valueArg || '');
				document.execCommand(command, 0, args);
				updateToolbar();
			},
			bindHotkeys = function (hotKeys) {
				$.each(hotKeys, function (hotkey, command) {
					editor.keydown(hotkey, function (e) {
						if (editor.attr('contenteditable') && editor.is(':visible')) {
							e.preventDefault();
							e.stopPropagation();
							execCommand(command);
						}
					}).keyup(hotkey, function (e) {
						if (editor.attr('contenteditable') && editor.is(':visible')) {
							e.preventDefault();
							e.stopPropagation();
						}
					});
				});
			},
			getCurrentRange = function () {
				var sel = window.getSelection();
				if (sel.getRangeAt && sel.rangeCount) {
					return sel.getRangeAt(0);
				}
			},
			saveSelection = function () {
				selectedRange = getCurrentRange();
			},
			restoreSelection = function () {
				var selection = window.getSelection();
				if (selectedRange) {
					try {
						selection.removeAllRanges();
					} catch (ex) {
						document.body.createTextRange().select();
						document.selection.empty();
					}

					selection.addRange(selectedRange);
				}
			},
			insertFiles = function (files) {
				editor.focus();
				$.each(files, function (idx, fileInfo) {
					if (/^image\//.test(fileInfo.type)) {
						$.when(readFileIntoDataUrl(fileInfo)).done(function (dataUrl) {
							execCommand('insertimage', dataUrl);
						}).fail(function (e) {
							options.fileUploadError("file-reader", e);
						});
					} else {
						options.fileUploadError("unsupported-file-type", fileInfo.type);
					}
				});
			},
			markSelection = function (input, color) {
				restoreSelection();
				if (document.queryCommandSupported('hiliteColor')) {
					document.execCommand('hiliteColor', 0, color || 'transparent');
				}
				saveSelection();
				input.data(options.selectionMarker, color);
			},
			bindToolbar = function (toolbar, options) {
				toolbar.find(toolbarBtnSelector).click(function () {
					restoreSelection();
					editor.focus();
					execCommand($(this).data(options.commandRole));
					saveSelection();
				});
				toolbar.find('[data-toggle=dropdown]').click(restoreSelection);

				toolbar.find('input[type=text][data-' + options.commandRole + ']').on('webkitspeechchange change', function () {
					var newValue = this.value; /* ugly but prevents fake double-calls due to selection restoration */
					this.value = '';
					restoreSelection();
					if (newValue) {
						editor.focus();
						execCommand($(this).data(options.commandRole), newValue);
					}
					saveSelection();
				}).on('focus', function () {
					var input = $(this);
					if (!input.data(options.selectionMarker)) {
						markSelection(input, options.selectionColor);
						input.focus();
					}
				}).on('blur', function () {
					var input = $(this);
					if (input.data(options.selectionMarker)) {
						markSelection(input, false);
					}
				});
				toolbar.find('input[type=file][data-' + options.commandRole + ']').change(function () {
					restoreSelection();
					if (this.type === 'file' && this.files && this.files.length > 0) {
						insertFiles(this.files);
					}
					saveSelection();
					this.value = '';
				});
			},
			initFileDrops = function () {
				editor.on('dragenter dragover', false)
					.on('drop', function (e) {
						var dataTransfer = e.originalEvent.dataTransfer;
						e.stopPropagation();
						e.preventDefault();
						if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
							insertFiles(dataTransfer.files);
						}
					});
			};
		options = $.extend({}, $.fn.wysiwyg.defaults, userOptions);
		toolbarBtnSelector = 'a[data-' + options.commandRole + '],button[data-' + options.commandRole + '],input[type=button][data-' + options.commandRole + ']';
		bindHotkeys(options.hotKeys);
		if (options.dragAndDropImages) {
			initFileDrops();
		}
		bindToolbar($(options.toolbarSelector), options);
		editor.attr('contenteditable', true)
			.on('mouseup keyup mouseout', function () {
				saveSelection();
				updateToolbar();
			});
		$(window).bind('touchend', function (e) {
			var isInside = (editor.is(e.target) || editor.has(e.target).length > 0),
				currentRange = getCurrentRange(),
				clear = currentRange && (currentRange.startContainer === currentRange.endContainer && currentRange.startOffset === currentRange.endOffset);
			if (!clear || isInside) {
				saveSelection();
				updateToolbar();
			}
		});
		return this;
	};
	$.fn.wysiwyg.defaults = {
		hotKeys: {
			'ctrl+b meta+b': 'bold',
			'ctrl+i meta+i': 'italic',
			'ctrl+u meta+u': 'underline',
			'ctrl+z meta+z': 'undo',
			'ctrl+y meta+y meta+shift+z': 'redo',
			'ctrl+l meta+l': 'justifyleft',
			'ctrl+r meta+r': 'justifyright',
			'ctrl+e meta+e': 'justifycenter',
			'ctrl+j meta+j': 'justifyfull',
			'shift+tab': 'outdent',
			'tab': 'indent'
		},
		toolbarSelector: '[data-role=editor-toolbar]',
		commandRole: 'edit',
		activeToolbarClass: 'btn-info',
		selectionMarker: 'edit-focus-marker',
		selectionColor: 'darkgrey',
		dragAndDropImages: true,
		fileUploadError: function (reason, detail) { console.log("File upload error", reason, detail); }
	};
}(window.jQuery));
;
!function ($, moment) {

    var DateRangePicker = function (element, options, cb) {

        // by default, the daterangepicker element is placed at the bottom of HTML body
        this.parentEl = 'body';

        //element that triggered the date range picker
        this.element = $(element);

        //create the picker HTML object
        var DRPTemplate = '<div class="daterangepicker dropdown-menu">' +
                '<div class="ranges">' +
                    '<div class="range_inputs">' +
                        '<div class="row">' +
                            '<div class="col-sm-6">' +
                                '<div class="daterangepicker_start_input">' +
                                  '<label for="daterangepicker_start"></label>' +
                                  '<input class="input-mini" type="text" name="daterangepicker_start" value="" disabled="disabled" />' +
                                '</div>' +
                                '<div class="calendar right"></div>' + 
                            '</div>' +
                            '<div class="col-sm-6">' +
                                '<div class="daterangepicker_end_input">' +
                                  '<label for="daterangepicker_end"></label>' +
                                  '<input class="input-mini" type="text" name="daterangepicker_end" value="" disabled="disabled" />' +
                                '</div>' +
                                '<div class="calendar left"></div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="row" id="daterange_button">' +
                            '<div class="col-sm-12">' +
                                '<button class="applyBtn" disabled="disabled"></button>&nbsp;' +
                                '<button class="cancelBtn"></button>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
              '</div>';

        //custom options
        if (typeof options !== 'object' || options === null)
            options = {};

        this.parentEl = (typeof options === 'object' && options.parentEl && $(options.parentEl).length) ? $(options.parentEl) : $(this.parentEl);
        this.container = $(DRPTemplate).appendTo(this.parentEl);

        this.setOptions(options, cb);

        //apply CSS classes and labels to buttons
        var c = this.container;
        $.each(this.buttonClasses, function (idx, val) {
            c.find('button').addClass(val);
        });
        this.container.find('.daterangepicker_start_input label').html(this.locale.fromLabel);
        this.container.find('.daterangepicker_end_input label').html(this.locale.toLabel);
        if (this.applyClass.length)
            this.container.find('.applyBtn').addClass(this.applyClass);
        if (this.cancelClass.length)
            this.container.find('.cancelBtn').addClass(this.cancelClass);
        this.container.find('.applyBtn').html(this.locale.applyLabel);
        this.container.find('.cancelBtn').html(this.locale.cancelLabel);

        //event listeners

        this.container.find('.calendar')
            .on('click.daterangepicker', '.prev', $.proxy(this.clickPrev, this))
            .on('click.daterangepicker', '.next', $.proxy(this.clickNext, this))
            .on('click.daterangepicker', 'td.available', $.proxy(this.clickDate, this))
            .on('mouseenter.daterangepicker', 'td.available', $.proxy(this.enterDate, this))
            .on('mouseleave.daterangepicker', 'td.available', $.proxy(this.updateFormInputs, this))
            .on('change.daterangepicker', 'select.yearselect', $.proxy(this.updateMonthYear, this))
            .on('change.daterangepicker', 'select.monthselect', $.proxy(this.updateMonthYear, this))
            .on('change.daterangepicker', 'select.hourselect,select.minuteselect,select.ampmselect', $.proxy(this.updateTime, this));

        this.container.find('.ranges')
            .on('click.daterangepicker', 'button.applyBtn', $.proxy(this.clickApply, this))
            .on('click.daterangepicker', 'button.cancelBtn', $.proxy(this.clickCancel, this))
            .on('click.daterangepicker', '.daterangepicker_start_input,.daterangepicker_end_input', $.proxy(this.showCalendars, this))
            .on('click.daterangepicker', 'li', $.proxy(this.clickRange, this))
            .on('mouseenter.daterangepicker', 'li', $.proxy(this.enterRange, this))
            .on('mouseleave.daterangepicker', 'li', $.proxy(this.updateFormInputs, this));

        if (this.element.is('input')) {
            this.element.on({
                'click.daterangepicker': $.proxy(this.show, this),
                'focus.daterangepicker': $.proxy(this.show, this),
                'keyup.daterangepicker': $.proxy(this.updateFromControl, this)
            });
        } else {
            this.element.on('click.daterangepicker', $.proxy(this.toggle, this));
        }

    };

    DateRangePicker.prototype = {

        constructor: DateRangePicker,

        setOptions: function(options, callback) {

            this.startDate = moment().startOf('day');
            this.endDate = moment().endOf('day');
            this.minDate = false;
            this.maxDate = false;
            this.dateLimit = false;

            this.showDropdowns = false;
            this.showWeekNumbers = false;
            this.timePicker = false;
            this.timePickerIncrement = 30;
            this.timePicker12Hour = true;
            this.singleDatePicker = false;
            this.ranges = {};

            this.opens = 'right';
            if (this.element.hasClass('pull-right'))
                this.opens = 'left';

            this.buttonClasses = ['btn', 'btn-small'];
            this.applyClass = 'btn-success';
            this.cancelClass = 'btn-default';

            this.format = 'MM/DD/YYYY';
            this.separator = ' - ';

            this.locale = {
                applyLabel: 'Apply',
                cancelLabel: 'Cancel',
                fromLabel: 'From',
                toLabel: 'To',
                weekLabel: 'W',
                customRangeLabel: 'Custom Range',
                daysOfWeek: moment()._lang._weekdaysMin.slice(),
                monthNames: moment()._lang._monthsShort.slice(),
                firstDay: 0
            };

            this.cb = function () { };

            if (typeof options.format === 'string')
                this.format = options.format;

            if (typeof options.separator === 'string')
                this.separator = options.separator;

            if (typeof options.startDate === 'string')
                this.startDate = moment(options.startDate, this.format);

            if (typeof options.endDate === 'string')
                this.endDate = moment(options.endDate, this.format);

            if (typeof options.minDate === 'string')
                this.minDate = moment(options.minDate, this.format);

            if (typeof options.maxDate === 'string')
                this.maxDate = moment(options.maxDate, this.format);

            if (typeof options.startDate === 'object')
                this.startDate = moment(options.startDate);

            if (typeof options.endDate === 'object')
                this.endDate = moment(options.endDate);

            if (typeof options.minDate === 'object')
                this.minDate = moment(options.minDate);

            if (typeof options.maxDate === 'object')
                this.maxDate = moment(options.maxDate);

            if (typeof options.applyClass === 'string')
                this.applyClass = options.applyClass;

            if (typeof options.cancelClass === 'string')
                this.cancelClass = options.cancelClass;

            if (typeof options.dateLimit === 'object')
                this.dateLimit = options.dateLimit;

            // update day names order to firstDay
            if (typeof options.locale === 'object') {

                if (typeof options.locale.daysOfWeek === 'object') {
                    // Create a copy of daysOfWeek to avoid modification of original
                    // options object for reusability in multiple daterangepicker instances
                    this.locale.daysOfWeek = options.locale.daysOfWeek.slice();
                }

                if (typeof options.locale.monthNames === 'object') {
                  this.locale.monthNames = options.locale.monthNames.slice();
                }

                if (typeof options.locale.firstDay === 'number') {
                    this.locale.firstDay = options.locale.firstDay;
                    var iterator = options.locale.firstDay;
                    while (iterator > 0) {
                        this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
                        iterator--;
                    }
                }

                if (typeof options.locale.applyLabel === 'string') {
                  this.locale.applyLabel = options.locale.applyLabel;
                }

                if (typeof options.locale.cancelLabel === 'string') {
                  this.locale.cancelLabel = options.locale.cancelLabel;
                }

                if (typeof options.locale.fromLabel === 'string') {
                  this.locale.fromLabel = options.locale.fromLabel;
                }

                if (typeof options.locale.toLabel === 'string') {
                  this.locale.toLabel = options.locale.toLabel;
                }

                if (typeof options.locale.weekLabel === 'string') {
                  this.locale.weekLabel = options.locale.weekLabel;
                }

                if (typeof options.locale.customRangeLabel === 'string') {
                  this.locale.customRangeLabel = options.locale.customRangeLabel;
                }
            }

            if (typeof options.opens === 'string')
                this.opens = options.opens;

            if (typeof options.showWeekNumbers === 'boolean') {
                this.showWeekNumbers = options.showWeekNumbers;
            }

            if (typeof options.buttonClasses === 'string') {
                this.buttonClasses = [options.buttonClasses];
            }

            if (typeof options.buttonClasses === 'object') {
                this.buttonClasses = options.buttonClasses;
            }

            if (typeof options.showDropdowns === 'boolean') {
                this.showDropdowns = options.showDropdowns;
            }

            if (typeof options.singleDatePicker === 'boolean') {
                this.singleDatePicker = options.singleDatePicker;
            }

            if (typeof options.timePicker === 'boolean') {
                this.timePicker = options.timePicker;
            }

            if (typeof options.timePickerIncrement === 'number') {
                this.timePickerIncrement = options.timePickerIncrement;
            }

            if (typeof options.timePicker12Hour === 'boolean') {
                this.timePicker12Hour = options.timePicker12Hour;
            }

            var start, end, range;

            //if no start/end dates set, check if an input element contains initial values
            if (typeof options.startDate === 'undefined' && typeof options.endDate === 'undefined') {
                if ($(this.element).is('input[type=text]')) {
                    var val = $(this.element).val();
                    var split = val.split(this.separator);
                    start = end = null;
                    if (split.length == 2) {
                        start = moment(split[0], this.format);
                        end = moment(split[1], this.format);
                    } else if (this.singleDatePicker) {
                        start = moment(val, this.format);
                        end = moment(val, this.format);
                    }
                    if (start !== null && end !== null) {
                        this.startDate = start;
                        this.endDate = end;
                    }
                }
            }

            if (typeof options.ranges === 'object') {
                for (range in options.ranges) {

                    start = moment(options.ranges[range][0]);
                    end = moment(options.ranges[range][1]);

                    // If we have a min/max date set, bound this range
                    // to it, but only if it would otherwise fall
                    // outside of the min/max.
                    if (this.minDate && start.isBefore(this.minDate))
                        start = moment(this.minDate);

                    if (this.maxDate && end.isAfter(this.maxDate))
                        end = moment(this.maxDate);

                    // If the end of the range is before the minimum (if min is set) OR
                    // the start of the range is after the max (also if set) don't display this
                    // range option.
                    if ((this.minDate && end.isBefore(this.minDate)) || (this.maxDate && start.isAfter(this.maxDate))) {
                        continue;
                    }

                    this.ranges[range] = [start, end];
                }

                var list = '<ul>';
                for (range in this.ranges) {
                    list += '<li>' + range + '</li>';
                }
                list += '<li>' + this.locale.customRangeLabel + '</li>';
                list += '</ul>';
                this.container.find('.ranges ul').remove();
                this.container.find('.ranges').prepend(list);
            }

            if (typeof callback === 'function') {
                this.cb = callback;
            }

            if (!this.timePicker) {
                this.startDate = this.startDate.startOf('day');
                this.endDate = this.endDate.endOf('day');
            }

            if (this.singleDatePicker) {
                this.opens = 'right';
                this.container.find('.calendar.right').show();
                this.container.find('.calendar.left').hide();
                this.container.find('.ranges').hide();
                if (!this.container.find('.calendar.right').hasClass('single'))
                    this.container.find('.calendar.right').addClass('single');
            } else {
                this.container.find('.calendar.right').removeClass('single');
                this.container.find('.ranges').show();
            }

            this.oldStartDate = this.startDate.clone();
            this.oldEndDate = this.endDate.clone();
            this.oldChosenLabel = this.chosenLabel;

            this.leftCalendar = {
                month: moment([this.startDate.year(), this.startDate.month(), 1, this.startDate.hour(), this.startDate.minute()]),
                calendar: []
            };

            this.rightCalendar = {
                month: moment([this.endDate.year(), this.endDate.month(), 1, this.endDate.hour(), this.endDate.minute()]),
                calendar: []
            };

            if (this.opens == 'right') {
                //swap calendar positions
                var left = this.container.find('.calendar.left');
                var right = this.container.find('.calendar.right');
                left.removeClass('left').addClass('right');
                right.removeClass('right').addClass('left');
            }

            if (typeof options.ranges === 'undefined' && !this.singleDatePicker) {
                this.container.addClass('show-calendar');
            }

            this.container.addClass('opens' + this.opens);

            this.updateView();
            this.updateCalendars();

        },

        setStartDate: function(startDate) {
            if (typeof startDate === 'string')
                this.startDate = moment(startDate, this.format);

            if (typeof startDate === 'object')
                this.startDate = moment(startDate);

            if (!this.timePicker)
                this.startDate = this.startDate.startOf('day');

            this.oldStartDate = this.startDate.clone();

            this.updateView();
            this.updateCalendars();
        },

        setEndDate: function(endDate) {
            if (typeof endDate === 'string')
                this.endDate = moment(endDate, this.format);

            if (typeof endDate === 'object')
                this.endDate = moment(endDate);

            if (!this.timePicker)
                this.endDate = this.endDate.endOf('day');

            this.oldEndDate = this.endDate.clone();

            this.updateView();
            this.updateCalendars();
        },

        updateView: function () {
            this.leftCalendar.month.month(this.startDate.month()).year(this.startDate.year());
            this.rightCalendar.month.month(this.endDate.month()).year(this.endDate.year());
            this.updateFormInputs();
        },

        updateFormInputs: function () {
            this.container.find('input[name=daterangepicker_start]').val(this.startDate.format(this.format));
            this.container.find('input[name=daterangepicker_end]').val(this.endDate.format(this.format));

            if (this.startDate.isSame(this.endDate) || this.startDate.isBefore(this.endDate)) {
                this.container.find('button.applyBtn').removeAttr('disabled');
            } else {
                this.container.find('button.applyBtn').attr('disabled', 'disabled');
            }
        },

        updateFromControl: function () {
            if (!this.element.is('input')) return;
            if (!this.element.val().length) return;

            var dateString = this.element.val().split(this.separator),
                start = null,
                end = null;
            
            if(dateString.length === 2) {
                start = moment(dateString[0], this.format);
                end = moment(dateString[1], this.format);
            }

            if (this.singleDatePicker || start === null || end === null) {
                start = moment(this.element.val(), this.format);
                end = start;
            }
            
            if (end.isBefore(start)) return;

            this.oldStartDate = this.startDate.clone();
            this.oldEndDate = this.endDate.clone();

            this.startDate = start;
            this.endDate = end;

            if (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate))
                this.notify();

            this.updateCalendars();
        },

        notify: function () {
            this.updateView();
            this.cb(this.startDate, this.endDate, this.chosenLabel);
        },

        move: function () {
            var parentOffset = { top: 0, left: 0 };
            if (!this.parentEl.is('body')) {
                parentOffset = {
                    top: this.parentEl.offset().top - this.parentEl.scrollTop(),
                    left: this.parentEl.offset().left - this.parentEl.scrollLeft()
                };
            }

            if (this.opens == 'left') {
                this.container.css({
                    top: this.element.offset().top + this.element.outerHeight() - parentOffset.top,
                    right: $(window).width() - this.element.offset().left - this.element.outerWidth() - parentOffset.left,
                    left: 'auto'
                });
                if (this.container.offset().left < 0) {
                    this.container.css({
                        right: 'auto',
                        left: 9
                    });
                }
            } else {
                this.container.css({
                    top: this.element.offset().top + this.element.outerHeight() - parentOffset.top,
                    left: this.element.offset().left - parentOffset.left,
                    right: 'auto'
                });
                if (this.container.offset().left + this.container.outerWidth() > $(window).width()) {
                    this.container.css({
                        left: 'auto',
                        right: 0
                    });
                }
            }
        },

        toggle: function (e) {
            if (this.element.hasClass('active')) {
                this.hide();
            } else {
                this.show();
            }
        },

        show: function (e) {
            this.element.addClass('active');
            this.container.show();
            this.move();

            // Create a click proxy that is private to this instance of datepicker, for unbinding
            this._outsideClickProxy = $.proxy(function (e) { this.outsideClick(e); }, this);
            // Bind global datepicker mousedown for hiding and
            $(document)
              .on('mousedown.daterangepicker', this._outsideClickProxy)
              // also explicitly play nice with Bootstrap dropdowns, which stopPropagation when clicking them
              .on('click.daterangepicker', '[data-toggle=dropdown]', this._outsideClickProxy)
              // and also close when focus changes to outside the picker (eg. tabbing between controls)
              .on('focusin.daterangepicker', this._outsideClickProxy);

            this.element.trigger('show.daterangepicker', this);
        },

        outsideClick: function (e) {
            var target = $(e.target);
            // if the page is clicked anywhere except within the daterangerpicker/button
            // itself then call this.hide()
            if (
                target.closest(this.element).length ||
                target.closest(this.container).length ||
                target.closest('.calendar-date').length
                ) return;
            this.hide();
        },

        hide: function (e) {
            $(document)
              .off('mousedown.daterangepicker', this._outsideClickProxy)
              .off('click.daterangepicker', this._outsideClickProxy)
              .off('focusin.daterangepicker', this._outsideClickProxy);

            this.element.removeClass('active');
            this.container.hide();

            if (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate))
                this.notify();

            this.oldStartDate = this.startDate.clone();
            this.oldEndDate = this.endDate.clone();

            this.element.trigger('hide.daterangepicker', this);
        },

        enterRange: function (e) {
            // mouse pointer has entered a range label
            var label = e.target.innerHTML;
            if (label == this.locale.customRangeLabel) {
                this.updateView();
            } else {
                var dates = this.ranges[label];
                this.container.find('input[name=daterangepicker_start]').val(dates[0].format(this.format));
                this.container.find('input[name=daterangepicker_end]').val(dates[1].format(this.format));
            }
        },

        showCalendars: function() {
            this.container.addClass('show-calendar');
            this.move();
        },

        hideCalendars: function() {
            this.container.removeClass('show-calendar');
        },

        updateInputText: function() {
            if (this.element.is('input') && !this.singleDatePicker) {
                this.element.val(this.startDate.format(this.format) + this.separator + this.endDate.format(this.format));
            } else if (this.element.is('input')) {
                this.element.val(this.startDate.format(this.format));
            }
        },

        clickRange: function (e) {
            var label = e.target.innerHTML;
            this.chosenLabel = label;
            if (label == this.locale.customRangeLabel) {
                this.showCalendars();
            } else {
                var dates = this.ranges[label];

                this.startDate = dates[0];
                this.endDate = dates[1];

                if (!this.timePicker) {
                    this.startDate.startOf('day');
                    this.endDate.endOf('day');
                }

                this.leftCalendar.month.month(this.startDate.month()).year(this.startDate.year()).hour(this.startDate.hour()).minute(this.startDate.minute());
                this.rightCalendar.month.month(this.endDate.month()).year(this.endDate.year()).hour(this.endDate.hour()).minute(this.endDate.minute());
                this.updateCalendars();

                this.updateInputText();

                this.hideCalendars();
                this.hide();
                this.element.trigger('apply.daterangepicker', this);
            }
        },

        clickPrev: function (e) {
            var cal = $(e.target).parents('.calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.subtract('month', 1);
            } else {
                this.rightCalendar.month.subtract('month', 1);
            }
            this.updateCalendars();
        },

        clickNext: function (e) {
            var cal = $(e.target).parents('.calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.add('month', 1);
            } else {
                this.rightCalendar.month.add('month', 1);
            }
            this.updateCalendars();
        },

        enterDate: function (e) {

            var title = $(e.target).attr('data-title');
            var row = title.substr(1, 1);
            var col = title.substr(3, 1);
            var cal = $(e.target).parents('.calendar');

            if (cal.hasClass('left')) {
                this.container.find('input[name=daterangepicker_start]').val(this.leftCalendar.calendar[row][col].format(this.format));
            } else {
                this.container.find('input[name=daterangepicker_end]').val(this.rightCalendar.calendar[row][col].format(this.format));
            }

        },

        clickDate: function (e) {
            var title = $(e.target).attr('data-title');
            var row = title.substr(1, 1);
            var col = title.substr(3, 1);
            var cal = $(e.target).parents('.calendar');

            var startDate, endDate;
            if (cal.hasClass('left')) {
                startDate = this.leftCalendar.calendar[row][col];
                endDate = this.endDate;
                if (typeof this.dateLimit === 'object') {
                    var maxDate = moment(startDate).add(this.dateLimit).startOf('day');
                    if (endDate.isAfter(maxDate)) {
                        endDate = maxDate;
                    }
                }
            } else {
                startDate = this.startDate;
                endDate = this.rightCalendar.calendar[row][col];
                if (typeof this.dateLimit === 'object') {
                    var minDate = moment(endDate).subtract(this.dateLimit).startOf('day');
                    if (startDate.isBefore(minDate)) {
                        startDate = minDate;
                    }
                }
            }

            if (this.singleDatePicker && cal.hasClass('left')) {
                endDate = startDate.clone();
            } else if (this.singleDatePicker && cal.hasClass('right')) {
                startDate = endDate.clone();
            }

            cal.find('td').removeClass('active');

            if (startDate.isSame(endDate) || startDate.isBefore(endDate)) {
                $(e.target).addClass('active');
                this.startDate = startDate;
                this.endDate = endDate;
                this.chosenLabel = this.locale.customRangeLabel;
            } else if (startDate.isAfter(endDate)) {
                $(e.target).addClass('active');
                var difference = this.endDate.diff(this.startDate);
                this.startDate = startDate;
                this.endDate = moment(startDate).add('ms', difference);
                this.chosenLabel = this.locale.customRangeLabel;
            }

            this.leftCalendar.month.month(this.startDate.month()).year(this.startDate.year());
            this.rightCalendar.month.month(this.endDate.month()).year(this.endDate.year());
            this.updateCalendars();

            if (!this.timePicker)
                endDate.endOf('day');

            if (this.singleDatePicker)
                this.clickApply();
        },

        clickApply: function (e) {
            this.updateInputText();
            this.hide();
            this.element.trigger('apply.daterangepicker', this);
        },

        clickCancel: function (e) {
            this.startDate = this.oldStartDate;
            this.endDate = this.oldEndDate;
            this.chosenLabel = this.oldChosenLabel;
            this.updateView();
            this.updateCalendars();
            this.hide();
            this.element.trigger('cancel.daterangepicker', this);
        },

        updateMonthYear: function (e) {
            var isLeft = $(e.target).closest('.calendar').hasClass('left'),
                leftOrRight = isLeft ? 'left' : 'right',
                cal = this.container.find('.calendar.'+leftOrRight);

            // Month must be Number for new moment versions
            var month = parseInt(cal.find('.monthselect').val(), 10);
            var year = cal.find('.yearselect').val();

            this[leftOrRight+'Calendar'].month.month(month).year(year);
            this.updateCalendars();
        },

        updateTime: function(e) {

            var cal = $(e.target).closest('.calendar'),
                isLeft = cal.hasClass('left');

            var hour = parseInt(cal.find('.hourselect').val(), 10);
            var minute = parseInt(cal.find('.minuteselect').val(), 10);

            if (this.timePicker12Hour) {
                var ampm = cal.find('.ampmselect').val();
                if (ampm === 'PM' && hour < 12)
                    hour += 12;
                if (ampm === 'AM' && hour === 12)
                    hour = 0;
            }

            if (isLeft) {
                var start = this.startDate.clone();
                start.hour(hour);
                start.minute(minute);
                this.startDate = start;
                this.leftCalendar.month.hour(hour).minute(minute);
            } else {
                var end = this.endDate.clone();
                end.hour(hour);
                end.minute(minute);
                this.endDate = end;
                this.rightCalendar.month.hour(hour).minute(minute);
            }

            this.updateCalendars();
        },

        updateCalendars: function () {
            this.leftCalendar.calendar = this.buildCalendar(this.leftCalendar.month.month(), this.leftCalendar.month.year(), this.leftCalendar.month.hour(), this.leftCalendar.month.minute(), 'left');
            this.rightCalendar.calendar = this.buildCalendar(this.rightCalendar.month.month(), this.rightCalendar.month.year(), this.rightCalendar.month.hour(), this.rightCalendar.month.minute(), 'right');
            this.container.find('.calendar.left').empty().html(this.renderCalendar(this.leftCalendar.calendar, this.startDate, this.minDate, this.maxDate));
            this.container.find('.calendar.right').empty().html(this.renderCalendar(this.rightCalendar.calendar, this.endDate, this.startDate, this.maxDate));

            this.container.find('.ranges li').removeClass('active');
            var customRange = true;
            var i = 0;
            for (var range in this.ranges) {
                if (this.timePicker) {
                    if (this.startDate.isSame(this.ranges[range][0]) && this.endDate.isSame(this.ranges[range][1])) {
                        customRange = false;
                        this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')')
                            .addClass('active').html();
                    }
                } else {
                    //ignore times when comparing dates if time picker is not enabled
                    if (this.startDate.format('YYYY-MM-DD') == this.ranges[range][0].format('YYYY-MM-DD') && this.endDate.format('YYYY-MM-DD') == this.ranges[range][1].format('YYYY-MM-DD')) {
                        customRange = false;
                        this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')')
                            .addClass('active').html();
                    }
                }
                i++;
            }
            if (customRange) {
                this.chosenLabel = this.container.find('.ranges li:last')
                    .addClass('active').html();
            }
        },

        buildCalendar: function (month, year, hour, minute, side) {
            var firstDay = moment([year, month, 1]);
            var lastMonth = moment(firstDay).subtract('month', 1).month();
            var lastYear = moment(firstDay).subtract('month', 1).year();

            var daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();

            var dayOfWeek = firstDay.day();

            var i;

            //initialize a 6 rows x 7 columns array for the calendar
            var calendar = [];
            for (i = 0; i < 6; i++) {
                calendar[i] = [];
            }

            //populate the calendar with date objects
            var startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
            if (startDay > daysInLastMonth)
                startDay -= 7;

            if (dayOfWeek == this.locale.firstDay)
                startDay = daysInLastMonth - 6;

            var curDate = moment([lastYear, lastMonth, startDay, 12, minute]);
            var col, row;
            for (i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add('hour', 24)) {
                if (i > 0 && col % 7 === 0) {
                    col = 0;
                    row++;
                }
                calendar[row][col] = curDate.clone().hour(hour);
                curDate.hour(12);
            }

            return calendar;
        },

        renderDropdowns: function (selected, minDate, maxDate) {
            var currentMonth = selected.month();
            var monthHtml = '<select class="monthselect">';
            var inMinYear = false;
            var inMaxYear = false;

            for (var m = 0; m < 12; m++) {
                if ((!inMinYear || m >= minDate.month()) && (!inMaxYear || m <= maxDate.month())) {
                    monthHtml += "<option value='" + m + "'" +
                        (m === currentMonth ? " selected='selected'" : "") +
                        ">" + this.locale.monthNames[m] + "</option>";
                }
            }
            monthHtml += "</select>";

            var currentYear = selected.year();
            var maxYear = (maxDate && maxDate.year()) || (currentYear + 5);
            var minYear = (minDate && minDate.year()) || (currentYear - 50);
            var yearHtml = '<select class="yearselect">';

            for (var y = minYear; y <= maxYear; y++) {
                yearHtml += '<option value="' + y + '"' +
                    (y === currentYear ? ' selected="selected"' : '') +
                    '>' + y + '</option>';
            }

            yearHtml += '</select>';

            return monthHtml + yearHtml;
        },

        renderCalendar: function (calendar, selected, minDate, maxDate) {

            var html = '<div class="calendar-date">';
            html += '<table class="table-condensed">';
            html += '<thead>';
            html += '<tr>';

            // add empty cell for week number
            if (this.showWeekNumbers)
                html += '<th></th>';

            if (!minDate || minDate.isBefore(calendar[1][1])) {
                html += '<th class="prev available"><i class="fa fa-arrow-left icon-arrow-left glyphicon glyphicon-arrow-left"></i></th>';
            } else {
                html += '<th></th>';
            }

            var dateHtml = this.locale.monthNames[calendar[1][1].month()] + calendar[1][1].format(" YYYY");

            if (this.showDropdowns) {
                dateHtml = this.renderDropdowns(calendar[1][1], minDate, maxDate);
            }

            html += '<th colspan="5" class="month">' + dateHtml + '</th>';
            if (!maxDate || maxDate.isAfter(calendar[1][1])) {
                html += '<th class="next available"><i class="fa fa-arrow-right icon-arrow-right glyphicon glyphicon-arrow-right"></i></th>';
            } else {
                html += '<th></th>';
            }

            html += '</tr>';
            html += '<tr>';

            // add week number label
            if (this.showWeekNumbers)
                html += '<th class="week">' + this.locale.weekLabel + '</th>';

            $.each(this.locale.daysOfWeek, function (index, dayOfWeek) {
                html += '<th>' + dayOfWeek + '</th>';
            });

            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';

            for (var row = 0; row < 6; row++) {
                html += '<tr>';

                // add week number
                if (this.showWeekNumbers)
                    html += '<td class="week">' + calendar[row][0].week() + '</td>';

                for (var col = 0; col < 7; col++) {
                    var cname = 'available ';
                    cname += (calendar[row][col].month() == calendar[1][1].month()) ? '' : 'off';

                    if ((minDate && calendar[row][col].isBefore(minDate, 'day')) || (maxDate && calendar[row][col].isAfter(maxDate, 'day'))) {
                        cname = ' off disabled ';
                    } else if (calendar[row][col].format('YYYY-MM-DD') == selected.format('YYYY-MM-DD')) {
                        cname += ' active ';
                        if (calendar[row][col].format('YYYY-MM-DD') == this.startDate.format('YYYY-MM-DD')) {
                            cname += ' start-date ';
                        }
                        if (calendar[row][col].format('YYYY-MM-DD') == this.endDate.format('YYYY-MM-DD')) {
                            cname += ' end-date ';
                        }
                    } else if (calendar[row][col] >= this.startDate && calendar[row][col] <= this.endDate) {
                        cname += ' in-range ';
                        if (calendar[row][col].isSame(this.startDate)) { cname += ' start-date '; }
                        if (calendar[row][col].isSame(this.endDate)) { cname += ' end-date '; }
                    }

                    var title = 'r' + row + 'c' + col;
                    html += '<td class="' + cname.replace(/\s+/g, ' ').replace(/^\s?(.*?)\s?$/, '$1') + '" data-title="' + title + '">' + calendar[row][col].date() + '</td>';
                }
                html += '</tr>';
            }

            html += '</tbody>';
            html += '</table>';
            html += '</div>';

            var i;
            if (this.timePicker) {

                html += '<div class="calendar-time">';
                html += '<select class="hourselect">';
                var start = 0;
                var end = 23;
                var selected_hour = selected.hour();
                if (this.timePicker12Hour) {
                    start = 1;
                    end = 12;
                    if (selected_hour >= 12)
                        selected_hour -= 12;
                    if (selected_hour === 0)
                        selected_hour = 12;
                }

                for (i = start; i <= end; i++) {
                    if (i == selected_hour) {
                        html += '<option value="' + i + '" selected="selected">' + i + '</option>';
                    } else {
                        html += '<option value="' + i + '">' + i + '</option>';
                    }
                }

                html += '</select> : ';

                html += '<select class="minuteselect">';

                for (i = 0; i < 60; i += this.timePickerIncrement) {
                    var num = i;
                    if (num < 10)
                        num = '0' + num;
                    if (i == selected.minute()) {
                        html += '<option value="' + i + '" selected="selected">' + num + '</option>';
                    } else {
                        html += '<option value="' + i + '">' + num + '</option>';
                    }
                }

                html += '</select> ';

                if (this.timePicker12Hour) {
                    html += '<select class="ampmselect">';
                    if (selected.hour() >= 12) {
                        html += '<option value="AM">AM</option><option value="PM" selected="selected">PM</option>';
                    } else {
                        html += '<option value="AM" selected="selected">AM</option><option value="PM">PM</option>';
                    }
                    html += '</select>';
                }

                html += '</div>';

            }

            return html;

        },

        remove: function() {

            this.container.remove();
            this.element.off('.daterangepicker');
            this.element.removeData('daterangepicker');

        }

    };

    $.fn.daterangepicker = function (options, cb) {
        this.each(function () {
            var el = $(this);
            if (el.data('daterangepicker'))
                el.data('daterangepicker').remove();
            el.data('daterangepicker', new DateRangePicker(el, options, cb));
        });
        return this;
    };

}(window.jQuery, window.moment);
;

;(function(){

/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};
require.register("component~emitter@1.1.2", function (exports, module) {

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});

require.register("dropzone", function (exports, module) {


/**
 * Exposing dropzone
 */
module.exports = require("dropzone/lib/dropzone.js");

});

require.register("dropzone/lib/dropzone.js", function (exports, module) {

/*
 *
 * More info at [www.dropzonejs.com](http://www.dropzonejs.com)
 *
 * Copyright (c) 2012, Matias Meno
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

(function() {
  var Dropzone, Em, camelize, contentLoaded, detectVerticalSquash, drawImageIOSFix, noop, without,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Em = typeof Emitter !== "undefined" && Emitter !== null ? Emitter : require("component~emitter@1.1.2");

  noop = function() {};

  Dropzone = (function(_super) {
    var extend;

    __extends(Dropzone, _super);


    /*
    This is a list of all available events you can register on a dropzone object.
    
    You can register an event handler like this:
    
        dropzone.on("dragEnter", function() { });
     */

    Dropzone.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "addedfile", "removedfile", "thumbnail", "error", "errormultiple", "processing", "processingmultiple", "uploadprogress", "totaluploadprogress", "sending", "sendingmultiple", "success", "successmultiple", "canceled", "canceledmultiple", "complete", "completemultiple", "reset", "maxfilesexceeded", "maxfilesreached"];

    Dropzone.prototype.defaultOptions = {
      url: null,
      method: "post",
      withCredentials: false,
      parallelUploads: 2,
      uploadMultiple: false,
      maxFilesize: 256,
      paramName: "file",
      createImageThumbnails: true,
      maxThumbnailFilesize: 10,
      thumbnailWidth: 100,
      thumbnailHeight: 100,
      maxFiles: null,
      params: {},
      clickable: true,
      ignoreHiddenFiles: true,
      acceptedFiles: null,
      acceptedMimeTypes: null,
      autoProcessQueue: true,
      autoQueue: true,
      addRemoveLinks: false,
      previewsContainer: null,
      dictDefaultMessage: "Drop files here to upload",
      dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
      dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
      dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
      dictInvalidFileType: "You can't upload files of this type.",
      dictResponseError: "Server responded with {{statusCode}} code.",
      dictCancelUpload: "Cancel upload",
      dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",
      dictRemoveFile: "Remove file",
      dictRemoveFileConfirmation: null,
      dictMaxFilesExceeded: "You can not upload any more files.",
      accept: function(file, done) {
        return done();
      },
      init: function() {
        return noop;
      },
      forceFallback: false,
      fallback: function() {
        var child, messageElement, span, _i, _len, _ref;
        this.element.className = "" + this.element.className + " dz-browser-not-supported";
        _ref = this.element.getElementsByTagName("div");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          if (/(^| )dz-message($| )/.test(child.className)) {
            messageElement = child;
            child.className = "dz-message";
            continue;
          }
        }
        if (!messageElement) {
          messageElement = Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");
          this.element.appendChild(messageElement);
        }
        span = messageElement.getElementsByTagName("span")[0];
        if (span) {
          span.textContent = this.options.dictFallbackMessage;
        }
        return this.element.appendChild(this.getFallbackForm());
      },
      resize: function(file) {
        var info, srcRatio, trgRatio;
        info = {
          srcX: 0,
          srcY: 0,
          srcWidth: file.width,
          srcHeight: file.height
        };
        srcRatio = file.width / file.height;
        info.optWidth = this.options.thumbnailWidth;
        info.optHeight = this.options.thumbnailHeight;
        if ((info.optWidth == null) && (info.optHeight == null)) {
          info.optWidth = info.srcWidth;
          info.optHeight = info.srcHeight;
        } else if (info.optWidth == null) {
          info.optWidth = srcRatio * info.optHeight;
        } else if (info.optHeight == null) {
          info.optHeight = (1 / srcRatio) * info.optWidth;
        }
        trgRatio = info.optWidth / info.optHeight;
        if (file.height < info.optHeight || file.width < info.optWidth) {
          info.trgHeight = info.srcHeight;
          info.trgWidth = info.srcWidth;
        } else {
          if (srcRatio > trgRatio) {
            info.srcHeight = file.height;
            info.srcWidth = info.srcHeight * trgRatio;
          } else {
            info.srcWidth = file.width;
            info.srcHeight = info.srcWidth / trgRatio;
          }
        }
        info.srcX = (file.width - info.srcWidth) / 2;
        info.srcY = (file.height - info.srcHeight) / 2;
        return info;
      },

      /*
      Those functions register themselves to the events on init and handle all
      the user interface specific stuff. Overwriting them won't break the upload
      but can break the way it's displayed.
      You can overwrite them if you don't like the default behavior. If you just
      want to add an additional event handler, register it on the dropzone object
      and don't overwrite those options.
       */
      drop: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      dragstart: noop,
      dragend: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      dragenter: function(e) {
        return this.element.classList.add("dz-drag-hover");
      },
      dragover: function(e) {
        return this.element.classList.add("dz-drag-hover");
      },
      dragleave: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      paste: noop,
      reset: function() {
        return this.element.classList.remove("dz-started");
      },
      addedfile: function(file) {
        var node, removeFileEvent, removeLink, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
        if (this.element === this.previewsContainer) {
          this.element.classList.add("dz-started");
        }
        if (this.previewsContainer) {
          file.previewElement = Dropzone.createElement(this.options.previewTemplate.trim());
          file.previewTemplate = file.previewElement;
          this.previewsContainer.appendChild(file.previewElement);
          _ref = file.previewElement.querySelectorAll("[data-dz-name]");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            node.textContent = file.name;
          }
          _ref1 = file.previewElement.querySelectorAll("[data-dz-size]");
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            node = _ref1[_j];
            node.innerHTML = this.filesize(file.size);
          }
          if (this.options.addRemoveLinks) {
            file._removeLink = Dropzone.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\" data-dz-remove>" + this.options.dictRemoveFile + "</a>");
            file.previewElement.appendChild(file._removeLink);
          }
          removeFileEvent = (function(_this) {
            return function(e) {
              e.preventDefault();
              e.stopPropagation();
              if (file.status === Dropzone.UPLOADING) {
                return Dropzone.confirm(_this.options.dictCancelUploadConfirmation, function() {
                  return _this.removeFile(file);
                });
              } else {
                if (_this.options.dictRemoveFileConfirmation) {
                  return Dropzone.confirm(_this.options.dictRemoveFileConfirmation, function() {
                    return _this.removeFile(file);
                  });
                } else {
                  return _this.removeFile(file);
                }
              }
            };
          })(this);
          _ref2 = file.previewElement.querySelectorAll("[data-dz-remove]");
          _results = [];
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            removeLink = _ref2[_k];
            _results.push(removeLink.addEventListener("click", removeFileEvent));
          }
          return _results;
        }
      },
      removedfile: function(file) {
        var _ref;
        if (file.previewElement) {
          if ((_ref = file.previewElement) != null) {
            _ref.parentNode.removeChild(file.previewElement);
          }
        }
        return this._updateMaxFilesReachedClass();
      },
      thumbnail: function(file, dataUrl) {
        var thumbnailElement, _i, _len, _ref, _results;
        if (file.previewElement) {
          file.previewElement.classList.remove("dz-file-preview");
          file.previewElement.classList.add("dz-image-preview");
          _ref = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            thumbnailElement = _ref[_i];
            thumbnailElement.alt = file.name;
            _results.push(thumbnailElement.src = dataUrl);
          }
          return _results;
        }
      },
      error: function(file, message) {
        var node, _i, _len, _ref, _results;
        if (file.previewElement) {
          file.previewElement.classList.add("dz-error");
          if (typeof message !== "String" && message.error) {
            message = message.error;
          }
          _ref = file.previewElement.querySelectorAll("[data-dz-errormessage]");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.textContent = message);
          }
          return _results;
        }
      },
      errormultiple: noop,
      processing: function(file) {
        if (file.previewElement) {
          file.previewElement.classList.add("dz-processing");
          if (file._removeLink) {
            return file._removeLink.textContent = this.options.dictCancelUpload;
          }
        }
      },
      processingmultiple: noop,
      uploadprogress: function(file, progress, bytesSent) {
        var node, _i, _len, _ref, _results;
        if (file.previewElement) {
          _ref = file.previewElement.querySelectorAll("[data-dz-uploadprogress]");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.style.width = "" + progress + "%");
          }
          return _results;
        }
      },
      totaluploadprogress: noop,
      sending: noop,
      sendingmultiple: noop,
      success: function(file) {
        if (file.previewElement) {
          return file.previewElement.classList.add("dz-success");
        }
      },
      successmultiple: noop,
      canceled: function(file) {
        return this.emit("error", file, "Upload canceled.");
      },
      canceledmultiple: noop,
      complete: function(file) {
        if (file._removeLink) {
          return file._removeLink.textContent = this.options.dictRemoveFile;
        }
      },
      completemultiple: noop,
      maxfilesexceeded: noop,
      maxfilesreached: noop,
      previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-details\">\n  <img data-dz-thumbnail />\n  <div class=\"dz-filename\"><span data-dz-name></span></div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-size\" data-dz-size></div>\n  <div class=\"dz-success-mark\"><span>✔</span></div>\n  <div class=\"dz-error-mark\"><span>✘</span></div>\n   </div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n <a href='javascript:void(0)' class=\"dz-mremove btn btn-block btn-xs btn-danger\" alt='click to remove file' data-dz-remove>delete <i class='fa fa-trash-o'></i><a/> \n </div>"
    };

    extend = function() {
      var key, object, objects, target, val, _i, _len;
      target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        object = objects[_i];
        for (key in object) {
          val = object[key];
          target[key] = val;
        }
      }
      return target;
    };

    function Dropzone(element, options) {
      var elementOptions, fallback, _ref;
      this.element = element;
      this.version = Dropzone.version;
      this.defaultOptions.previewTemplate = this.defaultOptions.previewTemplate.replace(/\n*/g, "");
      this.clickableElements = [];
      this.listeners = [];
      this.files = [];
      if (typeof this.element === "string") {
        this.element = document.querySelector(this.element);
      }
      if (!(this.element && (this.element.nodeType != null))) {
        throw new Error("Invalid dropzone element.");
      }
      if (this.element.dropzone) {
        throw new Error("Dropzone already attached.");
      }
      Dropzone.instances.push(this);
      this.element.dropzone = this;
      elementOptions = (_ref = Dropzone.optionsForElement(this.element)) != null ? _ref : {};
      this.options = extend({}, this.defaultOptions, elementOptions, options != null ? options : {});
      if (this.options.forceFallback || !Dropzone.isBrowserSupported()) {
        return this.options.fallback.call(this);
      }
      if (this.options.url == null) {
        this.options.url = this.element.getAttribute("action");
      }
      if (!this.options.url) {
        throw new Error("No URL provided.");
      }
      if (this.options.acceptedFiles && this.options.acceptedMimeTypes) {
        throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
      }
      if (this.options.acceptedMimeTypes) {
        this.options.acceptedFiles = this.options.acceptedMimeTypes;
        delete this.options.acceptedMimeTypes;
      }
      this.options.method = this.options.method.toUpperCase();
      if ((fallback = this.getExistingFallback()) && fallback.parentNode) {
        fallback.parentNode.removeChild(fallback);
      }
      if (this.options.previewsContainer !== false) {
        if (this.options.previewsContainer) {
          this.previewsContainer = Dropzone.getElement(this.options.previewsContainer, "previewsContainer");
        } else {
          this.previewsContainer = this.element;
        }
      }
      if (this.options.clickable) {
        if (this.options.clickable === true) {
          this.clickableElements = [this.element];
        } else {
          this.clickableElements = Dropzone.getElements(this.options.clickable, "clickable");
        }
      }
      this.init();
    }

    Dropzone.prototype.getAcceptedFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.accepted) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getRejectedFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (!file.accepted) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getFilesWithStatus = function(status) {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status === status) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getQueuedFiles = function() {
      return this.getFilesWithStatus(Dropzone.QUEUED);
    };

    Dropzone.prototype.getUploadingFiles = function() {
      return this.getFilesWithStatus(Dropzone.UPLOADING);
    };

    Dropzone.prototype.getActiveFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status === Dropzone.UPLOADING || file.status === Dropzone.QUEUED) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.init = function() {
      var eventName, noPropagation, setupHiddenFileInput, _i, _len, _ref, _ref1;
      if (this.element.tagName === "form") {
        this.element.setAttribute("enctype", "multipart/form-data");
      }
      if (this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message")) {
        this.element.appendChild(Dropzone.createElement("<div class=\"dz-default dz-message\"><span>" + this.options.dictDefaultMessage + "</span></div>"));
      }
      if (this.clickableElements.length) {
        setupHiddenFileInput = (function(_this) {
          return function() {
            if (_this.hiddenFileInput) {
              document.body.removeChild(_this.hiddenFileInput);
            }
            _this.hiddenFileInput = document.createElement("input");
            _this.hiddenFileInput.setAttribute("type", "file");
            if ((_this.options.maxFiles == null) || _this.options.maxFiles > 1) {
              _this.hiddenFileInput.setAttribute("multiple", "multiple");
            }
            _this.hiddenFileInput.className = "dz-hidden-input";
            if (_this.options.acceptedFiles != null) {
              _this.hiddenFileInput.setAttribute("accept", _this.options.acceptedFiles);
            }
            _this.hiddenFileInput.style.visibility = "hidden";
            _this.hiddenFileInput.style.position = "absolute";
            _this.hiddenFileInput.style.top = "0";
            _this.hiddenFileInput.style.left = "0";
            _this.hiddenFileInput.style.height = "0";
            _this.hiddenFileInput.style.width = "0";
            document.body.appendChild(_this.hiddenFileInput);
            return _this.hiddenFileInput.addEventListener("change", function() {
              var file, files, _i, _len;
              files = _this.hiddenFileInput.files;
              if (files.length) {
                for (_i = 0, _len = files.length; _i < _len; _i++) {
                  file = files[_i];
                  _this.addFile(file);
                }
              }
              return setupHiddenFileInput();
            });
          };
        })(this);
        setupHiddenFileInput();
      }
      this.URL = (_ref = window.URL) != null ? _ref : window.webkitURL;
      _ref1 = this.events;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        eventName = _ref1[_i];
        this.on(eventName, this.options[eventName]);
      }
      this.on("uploadprogress", (function(_this) {
        return function() {
          return _this.updateTotalUploadProgress();
        };
      })(this));
      this.on("removedfile", (function(_this) {
        return function() {
          return _this.updateTotalUploadProgress();
        };
      })(this));
      this.on("canceled", (function(_this) {
        return function(file) {
          return _this.emit("complete", file);
        };
      })(this));
      this.on("complete", (function(_this) {
        return function(file) {
          if (_this.getUploadingFiles().length === 0 && _this.getQueuedFiles().length === 0) {
            return setTimeout((function() {
              return _this.emit("queuecomplete");
            }), 0);
          }
        };
      })(this));
      noPropagation = function(e) {
        e.stopPropagation();
        if (e.preventDefault) {
          return e.preventDefault();
        } else {
          return e.returnValue = false;
        }
      };
      this.listeners = [
        {
          element: this.element,
          events: {
            "dragstart": (function(_this) {
              return function(e) {
                return _this.emit("dragstart", e);
              };
            })(this),
            "dragenter": (function(_this) {
              return function(e) {
                noPropagation(e);
                return _this.emit("dragenter", e);
              };
            })(this),
            "dragover": (function(_this) {
              return function(e) {
                var efct;
                try {
                  efct = e.dataTransfer.effectAllowed;
                } catch (_error) {}
                e.dataTransfer.dropEffect = 'move' === efct || 'linkMove' === efct ? 'move' : 'copy';
                noPropagation(e);
                return _this.emit("dragover", e);
              };
            })(this),
            "dragleave": (function(_this) {
              return function(e) {
                return _this.emit("dragleave", e);
              };
            })(this),
            "drop": (function(_this) {
              return function(e) {
                noPropagation(e);
                return _this.drop(e);
              };
            })(this),
            "dragend": (function(_this) {
              return function(e) {
                return _this.emit("dragend", e);
              };
            })(this)
          }
        }
      ];
      this.clickableElements.forEach((function(_this) {
        return function(clickableElement) {
          return _this.listeners.push({
            element: clickableElement,
            events: {
              "click": function(evt) {
                if ((clickableElement !== _this.element) || (evt.target === _this.element || Dropzone.elementInside(evt.target, _this.element.querySelector(".dz-message")))) {
                  return _this.hiddenFileInput.click();
                }
              }
            }
          });
        };
      })(this));
      this.enable();
      return this.options.init.call(this);
    };

    Dropzone.prototype.destroy = function() {
      var _ref;
      this.disable();
      this.removeAllFiles(true);
      if ((_ref = this.hiddenFileInput) != null ? _ref.parentNode : void 0) {
        this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
        this.hiddenFileInput = null;
      }
      delete this.element.dropzone;
      return Dropzone.instances.splice(Dropzone.instances.indexOf(this), 1);
    };

    Dropzone.prototype.updateTotalUploadProgress = function() {
      var activeFiles, file, totalBytes, totalBytesSent, totalUploadProgress, _i, _len, _ref;
      totalBytesSent = 0;
      totalBytes = 0;
      activeFiles = this.getActiveFiles();
      if (activeFiles.length) {
        _ref = this.getActiveFiles();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          totalBytesSent += file.upload.bytesSent;
          totalBytes += file.upload.total;
        }
        totalUploadProgress = 100 * totalBytesSent / totalBytes;
      } else {
        totalUploadProgress = 100;
      }
      return this.emit("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent);
    };

    Dropzone.prototype._getParamName = function(n) {
      if (typeof this.options.paramName === "function") {
        return this.options.paramName(n);
      } else {
        return "" + this.options.paramName + (this.options.uploadMultiple ? "[" + n + "]" : "");
      }
    };

    Dropzone.prototype.getFallbackForm = function() {
      var existingFallback, fields, fieldsString, form;
      if (existingFallback = this.getExistingFallback()) {
        return existingFallback;
      }
      fieldsString = "<div class=\"dz-fallback\">";
      if (this.options.dictFallbackText) {
        fieldsString += "<p>" + this.options.dictFallbackText + "</p>";
      }
      fieldsString += "<input type=\"file\" name=\"" + (this._getParamName(0)) + "\" " + (this.options.uploadMultiple ? 'multiple="multiple"' : void 0) + " /><input type=\"submit\" value=\"Upload!\"></div>";
      fields = Dropzone.createElement(fieldsString);
      if (this.element.tagName !== "FORM") {
        form = Dropzone.createElement("<form action=\"" + this.options.url + "\" enctype=\"multipart/form-data\" method=\"" + this.options.method + "\"></form>");
        form.appendChild(fields);
      } else {
        this.element.setAttribute("enctype", "multipart/form-data");
        this.element.setAttribute("method", this.options.method);
      }
      return form != null ? form : fields;
    };

    Dropzone.prototype.getExistingFallback = function() {
      var fallback, getFallback, tagName, _i, _len, _ref;
      getFallback = function(elements) {
        var el, _i, _len;
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          if (/(^| )fallback($| )/.test(el.className)) {
            return el;
          }
        }
      };
      _ref = ["div", "form"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tagName = _ref[_i];
        if (fallback = getFallback(this.element.getElementsByTagName(tagName))) {
          return fallback;
        }
      }
    };

    Dropzone.prototype.setupEventListeners = function() {
      var elementListeners, event, listener, _i, _len, _ref, _results;
      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elementListeners = _ref[_i];
        _results.push((function() {
          var _ref1, _results1;
          _ref1 = elementListeners.events;
          _results1 = [];
          for (event in _ref1) {
            listener = _ref1[event];
            _results1.push(elementListeners.element.addEventListener(event, listener, false));
          }
          return _results1;
        })());
      }
      return _results;
    };

    Dropzone.prototype.removeEventListeners = function() {
      var elementListeners, event, listener, _i, _len, _ref, _results;
      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elementListeners = _ref[_i];
        _results.push((function() {
          var _ref1, _results1;
          _ref1 = elementListeners.events;
          _results1 = [];
          for (event in _ref1) {
            listener = _ref1[event];
            _results1.push(elementListeners.element.removeEventListener(event, listener, false));
          }
          return _results1;
        })());
      }
      return _results;
    };

    Dropzone.prototype.disable = function() {
      var file, _i, _len, _ref, _results;
      this.clickableElements.forEach(function(element) {
        return element.classList.remove("dz-clickable");
      });
      this.removeEventListeners();
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        _results.push(this.cancelUpload(file));
      }
      return _results;
    };

    Dropzone.prototype.enable = function() {
      this.clickableElements.forEach(function(element) {
        return element.classList.add("dz-clickable");
      });
      return this.setupEventListeners();
    };

    Dropzone.prototype.filesize = function(size) {
      var string;
      if (size >= 1024 * 1024 * 1024 * 1024 / 10) {
        size = size / (1024 * 1024 * 1024 * 1024 / 10);
        string = "TiB";
      } else if (size >= 1024 * 1024 * 1024 / 10) {
        size = size / (1024 * 1024 * 1024 / 10);
        string = "GiB";
      } else if (size >= 1024 * 1024 / 10) {
        size = size / (1024 * 1024 / 10);
        string = "MiB";
      } else if (size >= 1024 / 10) {
        size = size / (1024 / 10);
        string = "KiB";
      } else {
        size = size * 10;
        string = "b";
      }
      return "<strong>" + (Math.round(size) / 10) + "</strong> " + string;
    };

    Dropzone.prototype._updateMaxFilesReachedClass = function() {
      if ((this.options.maxFiles != null) && this.getAcceptedFiles().length >= this.options.maxFiles) {
        if (this.getAcceptedFiles().length === this.options.maxFiles) {
          this.emit('maxfilesreached', this.files);
        }
        return this.element.classList.add("dz-max-files-reached");
      } else {
        return this.element.classList.remove("dz-max-files-reached");
      }
    };

    Dropzone.prototype.drop = function(e) {
      var files, items;
      if (!e.dataTransfer) {
        return;
      }
      this.emit("drop", e);
      files = e.dataTransfer.files;
      if (files.length) {
        items = e.dataTransfer.items;
        if (items && items.length && (items[0].webkitGetAsEntry != null)) {
          this._addFilesFromItems(items);
        } else {
          this.handleFiles(files);
        }
      }
    };

    Dropzone.prototype.paste = function(e) {
      var items, _ref;
      if ((e != null ? (_ref = e.clipboardData) != null ? _ref.items : void 0 : void 0) == null) {
        return;
      }
      this.emit("paste", e);
      items = e.clipboardData.items;
      if (items.length) {
        return this._addFilesFromItems(items);
      }
    };

    Dropzone.prototype.handleFiles = function(files) {
      var file, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        _results.push(this.addFile(file));
      }
      return _results;
    };

    Dropzone.prototype._addFilesFromItems = function(items) {
      var entry, item, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if ((item.webkitGetAsEntry != null) && (entry = item.webkitGetAsEntry())) {
          if (entry.isFile) {
            _results.push(this.addFile(item.getAsFile()));
          } else if (entry.isDirectory) {
            _results.push(this._addFilesFromDirectory(entry, entry.name));
          } else {
            _results.push(void 0);
          }
        } else if (item.getAsFile != null) {
          if ((item.kind == null) || item.kind === "file") {
            _results.push(this.addFile(item.getAsFile()));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Dropzone.prototype._addFilesFromDirectory = function(directory, path) {
      var dirReader, entriesReader;
      dirReader = directory.createReader();
      entriesReader = (function(_this) {
        return function(entries) {
          var entry, _i, _len;
          for (_i = 0, _len = entries.length; _i < _len; _i++) {
            entry = entries[_i];
            if (entry.isFile) {
              entry.file(function(file) {
                if (_this.options.ignoreHiddenFiles && file.name.substring(0, 1) === '.') {
                  return;
                }
                file.fullPath = "" + path + "/" + file.name;
                return _this.addFile(file);
              });
            } else if (entry.isDirectory) {
              _this._addFilesFromDirectory(entry, "" + path + "/" + entry.name);
            }
          }
        };
      })(this);
      return dirReader.readEntries(entriesReader, function(error) {
        return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log(error) : void 0 : void 0;
      });
    };

    Dropzone.prototype.accept = function(file, done) {
      if (file.size > this.options.maxFilesize * 1024 * 1024) {
        return done(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize));
      } else if (!Dropzone.isValidFile(file, this.options.acceptedFiles)) {
        return done(this.options.dictInvalidFileType);
      } else if ((this.options.maxFiles != null) && this.getAcceptedFiles().length >= this.options.maxFiles) {
        done(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles));
        return this.emit("maxfilesexceeded", file);
      } else {
        return this.options.accept.call(this, file, done);
      }
    };

    Dropzone.prototype.addFile = function(file) {
      file.upload = {
        progress: 0,
        total: file.size,
        bytesSent: 0
      };
      this.files.push(file);
      file.status = Dropzone.ADDED;
      this.emit("addedfile", file);
      this._enqueueThumbnail(file);
      return this.accept(file, (function(_this) {
        return function(error) {
          if (error) {
            file.accepted = false;
            _this._errorProcessing([file], error);
          } else {
            file.accepted = true;
            if (_this.options.autoQueue) {
              _this.enqueueFile(file);
            }
          }
          return _this._updateMaxFilesReachedClass();
        };
      })(this));
    };

    Dropzone.prototype.enqueueFiles = function(files) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        this.enqueueFile(file);
      }
      return null;
    };

    Dropzone.prototype.enqueueFile = function(file) {
      if (file.status === Dropzone.ADDED && file.accepted === true) {
        file.status = Dropzone.QUEUED;
        if (this.options.autoProcessQueue) {
          return setTimeout(((function(_this) {
            return function() {
              return _this.processQueue();
            };
          })(this)), 0);
        }
      } else {
        throw new Error("This file can't be queued because it has already been processed or was rejected.");
      }
    };

    Dropzone.prototype._thumbnailQueue = [];

    Dropzone.prototype._processingThumbnail = false;

    Dropzone.prototype._enqueueThumbnail = function(file) {
      if (this.options.createImageThumbnails && file.type.match(/image.*/) && file.size <= this.options.maxThumbnailFilesize * 1024 * 1024) {
        this._thumbnailQueue.push(file);
        return setTimeout(((function(_this) {
          return function() {
            return _this._processThumbnailQueue();
          };
        })(this)), 0);
      }
    };

    Dropzone.prototype._processThumbnailQueue = function() {
      if (this._processingThumbnail || this._thumbnailQueue.length === 0) {
        return;
      }
      this._processingThumbnail = true;
      return this.createThumbnail(this._thumbnailQueue.shift(), (function(_this) {
        return function() {
          _this._processingThumbnail = false;
          return _this._processThumbnailQueue();
        };
      })(this));
    };

    Dropzone.prototype.removeFile = function(file) {
      if (file.status === Dropzone.UPLOADING) {
        this.cancelUpload(file);
      }
      this.files = without(this.files, file);
      this.emit("removedfile", file);
      if (this.files.length === 0) {
        return this.emit("reset");
      }
    };

    Dropzone.prototype.removeAllFiles = function(cancelIfNecessary) {
      var file, _i, _len, _ref;
      if (cancelIfNecessary == null) {
        cancelIfNecessary = false;
      }
      _ref = this.files.slice();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status !== Dropzone.UPLOADING || cancelIfNecessary) {
          this.removeFile(file);
        }
      }
      return null;
    };

    Dropzone.prototype.createThumbnail = function(file, callback) {
      var fileReader;
      fileReader = new FileReader;
      fileReader.onload = (function(_this) {
        return function() {
          var img;
          img = document.createElement("img");
          img.onload = function() {
            var canvas, ctx, resizeInfo, thumbnail, _ref, _ref1, _ref2, _ref3;
            file.width = img.width;
            file.height = img.height;
            resizeInfo = _this.options.resize.call(_this, file);
            if (resizeInfo.trgWidth == null) {
              resizeInfo.trgWidth = resizeInfo.optWidth;
            }
            if (resizeInfo.trgHeight == null) {
              resizeInfo.trgHeight = resizeInfo.optHeight;
            }
            canvas = document.createElement("canvas");
            ctx = canvas.getContext("2d");
            canvas.width = resizeInfo.trgWidth;
            canvas.height = resizeInfo.trgHeight;
            drawImageIOSFix(ctx, img, (_ref = resizeInfo.srcX) != null ? _ref : 0, (_ref1 = resizeInfo.srcY) != null ? _ref1 : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, (_ref2 = resizeInfo.trgX) != null ? _ref2 : 0, (_ref3 = resizeInfo.trgY) != null ? _ref3 : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);
            thumbnail = canvas.toDataURL("image/png");
            _this.emit("thumbnail", file, thumbnail);
            if (callback != null) {
              return callback();
            }
          };
          return img.src = fileReader.result;
        };
      })(this);
      return fileReader.readAsDataURL(file);
    };

    Dropzone.prototype.processQueue = function() {
      var i, parallelUploads, processingLength, queuedFiles;
      parallelUploads = this.options.parallelUploads;
      processingLength = this.getUploadingFiles().length;
      i = processingLength;
      if (processingLength >= parallelUploads) {
        return;
      }
      queuedFiles = this.getQueuedFiles();
      if (!(queuedFiles.length > 0)) {
        return;
      }
      if (this.options.uploadMultiple) {
        return this.processFiles(queuedFiles.slice(0, parallelUploads - processingLength));
      } else {
        while (i < parallelUploads) {
          if (!queuedFiles.length) {
            return;
          }
          this.processFile(queuedFiles.shift());
          i++;
        }
      }
    };

    Dropzone.prototype.processFile = function(file) {
      return this.processFiles([file]);
    };

    Dropzone.prototype.processFiles = function(files) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.processing = true;
        file.status = Dropzone.UPLOADING;
        this.emit("processing", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("processingmultiple", files);
      }
      return this.uploadFiles(files);
    };

    Dropzone.prototype._getFilesWithXhr = function(xhr) {
      var file, files;
      return files = (function() {
        var _i, _len, _ref, _results;
        _ref = this.files;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          if (file.xhr === xhr) {
            _results.push(file);
          }
        }
        return _results;
      }).call(this);
    };

    Dropzone.prototype.cancelUpload = function(file) {
      var groupedFile, groupedFiles, _i, _j, _len, _len1, _ref;
      if (file.status === Dropzone.UPLOADING) {
        groupedFiles = this._getFilesWithXhr(file.xhr);
        for (_i = 0, _len = groupedFiles.length; _i < _len; _i++) {
          groupedFile = groupedFiles[_i];
          groupedFile.status = Dropzone.CANCELED;
        }
        file.xhr.abort();
        for (_j = 0, _len1 = groupedFiles.length; _j < _len1; _j++) {
          groupedFile = groupedFiles[_j];
          this.emit("canceled", groupedFile);
        }
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", groupedFiles);
        }
      } else if ((_ref = file.status) === Dropzone.ADDED || _ref === Dropzone.QUEUED) {
        file.status = Dropzone.CANCELED;
        this.emit("canceled", file);
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", [file]);
        }
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    Dropzone.prototype.uploadFile = function(file) {
      return this.uploadFiles([file]);
    };

    Dropzone.prototype.uploadFiles = function(files) {
      var file, formData, handleError, headerName, headerValue, headers, i, input, inputName, inputType, key, option, progressObj, response, updateProgress, value, xhr, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      xhr = new XMLHttpRequest();
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.xhr = xhr;
      }
      xhr.open(this.options.method, this.options.url, true);
      xhr.withCredentials = !!this.options.withCredentials;
      response = null;
      handleError = (function(_this) {
        return function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
            file = files[_j];
            _results.push(_this._errorProcessing(files, response || _this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr));
          }
          return _results;
        };
      })(this);
      updateProgress = (function(_this) {
        return function(e) {
          var allFilesFinished, progress, _j, _k, _l, _len1, _len2, _len3, _results;
          if (e != null) {
            progress = 100 * e.loaded / e.total;
            for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
              file = files[_j];
              file.upload = {
                progress: progress,
                total: e.total,
                bytesSent: e.loaded
              };
            }
          } else {
            allFilesFinished = true;
            progress = 100;
            for (_k = 0, _len2 = files.length; _k < _len2; _k++) {
              file = files[_k];
              if (!(file.upload.progress === 100 && file.upload.bytesSent === file.upload.total)) {
                allFilesFinished = false;
              }
              file.upload.progress = progress;
              file.upload.bytesSent = file.upload.total;
            }
            if (allFilesFinished) {
              return;
            }
          }
          _results = [];
          for (_l = 0, _len3 = files.length; _l < _len3; _l++) {
            file = files[_l];
            _results.push(_this.emit("uploadprogress", file, progress, file.upload.bytesSent));
          }
          return _results;
        };
      })(this);
      xhr.onload = (function(_this) {
        return function(e) {
          var _ref;
          if (files[0].status === Dropzone.CANCELED) {
            return;
          }
          if (xhr.readyState !== 4) {
            return;
          }
          response = xhr.responseText;
          if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
            try {
              response = JSON.parse(response);
            } catch (_error) {
              e = _error;
              response = "Invalid JSON response from server.";
            }
          }
          updateProgress();
          if (!((200 <= (_ref = xhr.status) && _ref < 300))) {
            return handleError();
          } else {
            return _this._finished(files, response, e);
          }
        };
      })(this);
      xhr.onerror = (function(_this) {
        return function() {
          if (files[0].status === Dropzone.CANCELED) {
            return;
          }
          return handleError();
        };
      })(this);
      progressObj = (_ref = xhr.upload) != null ? _ref : xhr;
      progressObj.onprogress = updateProgress;
      headers = {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest"
      };
      if (this.options.headers) {
        extend(headers, this.options.headers);
      }
      for (headerName in headers) {
        headerValue = headers[headerName];
        xhr.setRequestHeader(headerName, headerValue);
      }
      formData = new FormData();
      if (this.options.params) {
        _ref1 = this.options.params;
        for (key in _ref1) {
          value = _ref1[key];
          formData.append(key, value);
        }
      }
      for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
        file = files[_j];
        this.emit("sending", file, xhr, formData);
      }
      if (this.options.uploadMultiple) {
        this.emit("sendingmultiple", files, xhr, formData);
      }
      if (this.element.tagName === "FORM") {
        _ref2 = this.element.querySelectorAll("input, textarea, select, button");
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          input = _ref2[_k];
          inputName = input.getAttribute("name");
          inputType = input.getAttribute("type");
          if (input.tagName === "SELECT" && input.hasAttribute("multiple")) {
            _ref3 = input.options;
            for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
              option = _ref3[_l];
              if (option.selected) {
                formData.append(inputName, option.value);
              }
            }
          } else if (!inputType || ((_ref4 = inputType.toLowerCase()) !== "checkbox" && _ref4 !== "radio") || input.checked) {
            formData.append(inputName, input.value);
          }
        }
      }
      for (i = _m = 0, _ref5 = files.length - 1; 0 <= _ref5 ? _m <= _ref5 : _m >= _ref5; i = 0 <= _ref5 ? ++_m : --_m) {
        formData.append(this._getParamName(i), files[i], files[i].name);
      }
      return xhr.send(formData);
    };

    Dropzone.prototype._finished = function(files, responseText, e) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.status = Dropzone.SUCCESS;
        this.emit("success", file, responseText, e);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("successmultiple", files, responseText, e);
        this.emit("completemultiple", files);
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    Dropzone.prototype._errorProcessing = function(files, message, xhr) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.status = Dropzone.ERROR;
        this.emit("error", file, message, xhr);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("errormultiple", files, message, xhr);
        this.emit("completemultiple", files);
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    return Dropzone;

  })(Em);

  Dropzone.version = "3.10.1";

  Dropzone.options = {};

  Dropzone.optionsForElement = function(element) {
    if (element.getAttribute("id")) {
      return Dropzone.options[camelize(element.getAttribute("id"))];
    } else {
      return void 0;
    }
  };

  Dropzone.instances = [];

  Dropzone.forElement = function(element) {
    if (typeof element === "string") {
      element = document.querySelector(element);
    }
    if ((element != null ? element.dropzone : void 0) == null) {
      throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
    }
    return element.dropzone;
  };

  Dropzone.autoDiscover = true;

  Dropzone.discover = function() {
    var checkElements, dropzone, dropzones, _i, _len, _results;
    if (document.querySelectorAll) {
      dropzones = document.querySelectorAll(".dropzone");
    } else {
      dropzones = [];
      checkElements = function(elements) {
        var el, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          if (/(^| )dropzone($| )/.test(el.className)) {
            _results.push(dropzones.push(el));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      checkElements(document.getElementsByTagName("div"));
      checkElements(document.getElementsByTagName("form"));
    }
    _results = [];
    for (_i = 0, _len = dropzones.length; _i < _len; _i++) {
      dropzone = dropzones[_i];
      if (Dropzone.optionsForElement(dropzone) !== false) {
        _results.push(new Dropzone(dropzone));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Dropzone.blacklistedBrowsers = [/opera.*Macintosh.*version\/12/i];

  Dropzone.isBrowserSupported = function() {
    var capableBrowser, regex, _i, _len, _ref;
    capableBrowser = true;
    if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector) {
      if (!("classList" in document.createElement("a"))) {
        capableBrowser = false;
      } else {
        _ref = Dropzone.blacklistedBrowsers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          regex = _ref[_i];
          if (regex.test(navigator.userAgent)) {
            capableBrowser = false;
            continue;
          }
        }
      }
    } else {
      capableBrowser = false;
    }
    return capableBrowser;
  };

  without = function(list, rejectedItem) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      item = list[_i];
      if (item !== rejectedItem) {
        _results.push(item);
      }
    }
    return _results;
  };

  camelize = function(str) {
    return str.replace(/[\-_](\w)/g, function(match) {
      return match.charAt(1).toUpperCase();
    });
  };

  Dropzone.createElement = function(string) {
    var div;
    div = document.createElement("div");
    div.innerHTML = string;
    return div.childNodes[0];
  };

  Dropzone.elementInside = function(element, container) {
    if (element === container) {
      return true;
    }
    while (element = element.parentNode) {
      if (element === container) {
        return true;
      }
    }
    return false;
  };

  Dropzone.getElement = function(el, name) {
    var element;
    if (typeof el === "string") {
      element = document.querySelector(el);
    } else if (el.nodeType != null) {
      element = el;
    }
    if (element == null) {
      throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector or a plain HTML element.");
    }
    return element;
  };

  Dropzone.getElements = function(els, name) {
    var e, el, elements, _i, _j, _len, _len1, _ref;
    if (els instanceof Array) {
      elements = [];
      try {
        for (_i = 0, _len = els.length; _i < _len; _i++) {
          el = els[_i];
          elements.push(this.getElement(el, name));
        }
      } catch (_error) {
        e = _error;
        elements = null;
      }
    } else if (typeof els === "string") {
      elements = [];
      _ref = document.querySelectorAll(els);
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        el = _ref[_j];
        elements.push(el);
      }
    } else if (els.nodeType != null) {
      elements = [els];
    }
    if (!((elements != null) && elements.length)) {
      throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");
    }
    return elements;
  };

  Dropzone.confirm = function(question, accepted, rejected) {
    if (window.confirm(question)) {
      return accepted();
    } else if (rejected != null) {
      return rejected();
    }
  };

  Dropzone.isValidFile = function(file, acceptedFiles) {
    var baseMimeType, mimeType, validType, _i, _len;
    if (!acceptedFiles) {
      return true;
    }
    acceptedFiles = acceptedFiles.split(",");
    mimeType = file.type;
    baseMimeType = mimeType.replace(/\/.*$/, "");
    for (_i = 0, _len = acceptedFiles.length; _i < _len; _i++) {
      validType = acceptedFiles[_i];
      validType = validType.trim();
      if (validType.charAt(0) === ".") {
        if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) {
          return true;
        }
      } else if (/\/\*$/.test(validType)) {
        if (baseMimeType === validType.replace(/\/.*$/, "")) {
          return true;
        }
      } else {
        if (mimeType === validType) {
          return true;
        }
      }
    }
    return false;
  };

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    jQuery.fn.dropzone = function(options) {
      return this.each(function() {
        return new Dropzone(this, options);
      });
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Dropzone;
  } else {
    window.Dropzone = Dropzone;
  }

  Dropzone.ADDED = "added";

  Dropzone.QUEUED = "queued";

  Dropzone.ACCEPTED = Dropzone.QUEUED;

  Dropzone.UPLOADING = "uploading";

  Dropzone.PROCESSING = Dropzone.UPLOADING;

  Dropzone.CANCELED = "canceled";

  Dropzone.ERROR = "error";

  Dropzone.SUCCESS = "success";


  /*
  
  Bugfix for iOS 6 and 7
  Source: http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
  based on the work of https://github.com/stomita/ios-imagefile-megapixel
   */

  detectVerticalSquash = function(img) {
    var alpha, canvas, ctx, data, ey, ih, iw, py, ratio, sy;
    iw = img.naturalWidth;
    ih = img.naturalHeight;
    canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = ih;
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    data = ctx.getImageData(0, 0, 1, ih).data;
    sy = 0;
    ey = ih;
    py = ih;
    while (py > sy) {
      alpha = data[(py - 1) * 4 + 3];
      if (alpha === 0) {
        ey = py;
      } else {
        sy = py;
      }
      py = (ey + sy) >> 1;
    }
    ratio = py / ih;
    if (ratio === 0) {
      return 1;
    } else {
      return ratio;
    }
  };

  drawImageIOSFix = function(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
    var vertSquashRatio;
    vertSquashRatio = detectVerticalSquash(img);
    return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
  };


  /*
   * contentloaded.js
   *
   * Author: Diego Perini (diego.perini at gmail.com)
   * Summary: cross-browser wrapper for DOMContentLoaded
   * Updated: 20101020
   * License: MIT
   * Version: 1.2
   *
   * URL:
   * http://javascript.nwbox.com/ContentLoaded/
   * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
   */

  contentLoaded = function(win, fn) {
    var add, doc, done, init, poll, pre, rem, root, top;
    done = false;
    top = true;
    doc = win.document;
    root = doc.documentElement;
    add = (doc.addEventListener ? "addEventListener" : "attachEvent");
    rem = (doc.addEventListener ? "removeEventListener" : "detachEvent");
    pre = (doc.addEventListener ? "" : "on");
    init = function(e) {
      if (e.type === "readystatechange" && doc.readyState !== "complete") {
        return;
      }
      (e.type === "load" ? win : doc)[rem](pre + e.type, init, false);
      if (!done && (done = true)) {
        return fn.call(win, e.type || e);
      }
    };
    poll = function() {
      var e;
      try {
        root.doScroll("left");
      } catch (_error) {
        e = _error;
        setTimeout(poll, 50);
        return;
      }
      return init("poll");
    };
    if (doc.readyState !== "complete") {
      if (doc.createEventObject && root.doScroll) {
        try {
          top = !win.frameElement;
        } catch (_error) {}
        if (top) {
          poll();
        }
      }
      doc[add](pre + "DOMContentLoaded", init, false);
      doc[add](pre + "readystatechange", init, false);
      return win[add](pre + "load", init, false);
    }
  };

  Dropzone._autoDiscoverFunction = function() {
    if (Dropzone.autoDiscover) {
      return Dropzone.discover();
    }
  };

  contentLoaded(window, Dropzone._autoDiscoverFunction);

}).call(this);

});

if (typeof exports == "object") {
  module.exports = require("dropzone");
} else if (typeof define == "function" && define.amd) {
  define([], function(){ return require("dropzone"); });
} else {
  this["Dropzone"] = require("dropzone");
}
})()
;
var Extended = function() {
  'use strict';
  this.tableStack();
  this.fileUpload();
  this.colorPicker();
  this.selectInput();
  this.imageEffect();
  this.datetimePicker();
  this.dateRangePicker();
};

Extended.prototype.tableStack = function() {
  var tableHeaderText = [];
  var tableHeaders = document.querySelectorAll('.table-stack th');
  var tableRows = document.querySelectorAll('.table-stack th');
  var tableBody = document.querySelector('.table-stack tbody');
  if (tableHeaders.length > 0) {
    for (var i = 0; i < tableHeaders.length; i++) {
      var current = tableHeaders[i];
      tableHeaderText.push(current.textContent.replace(/\r?\n|\r/, ''));
    }
    for (var k = 0, row; row = tableBody.rows[k]; k++) {
      for (var j = 0, col; col = row.cells[j]; j++) {
        col.setAttribute('data-th', tableHeaderText[j]);
      }
    }
  }
};

Extended.prototype.fileUpload = function() {
  var fileUpload = $('.kd-upload');
  var fileInput = fileUpload.find('input[type="file"]');
  if (fileInput.length > 0) {
    fileInput.on('change', function() {
      fileUpload.css({
        'backgroundColor': '#EEEEEE',
        'color': '#666',
        'border': '2px solid #CCCCCC'
      });
      fileUpload.find('.upload-text').html('Upload');
    });
  }
};

Extended.prototype.datetimePicker = function() {
  var dateTimeElements = $('.kd-datetime');
  if (dateTimeElements.length > 0) {
    dateTimeElements.datetimepicker({
      format: 'hh:ii, dd/mm/yyyy',
      autoclose: true,
      todayBtn: true
    });
  }
};

Extended.prototype.colorPicker = function() {
  var colorPickerElements = $('.kd-colorpicker');
  if (colorPickerElements.length > 0) {
    colorPickerElements.minicolors({
      changeDelay: 200,
      theme: 'bootstrap',
      defaultValue: '#000',
      position: 'top right'
    });
  }
};

Extended.prototype.dateRangePicker = function() {
  var now = moment();
  var dateRangeElements = $('.kd-daterange');
  if (dateRangeElements.length > 0) {
    dateRangeElements.daterangepicker({
      format: 'DD/MM/YYYY',
      minDate: now
    });
  }
};

Extended.prototype.selectInput = function() {
  var selectElements = $('.kd-select');
  if (selectElements.length > 0) {
    selectElements.select2();
  }
};

Extended.prototype.imageEffect = function() {
  $('img.img-effect').load(function() {
    $(this).wrap(function() {
      return '<span class="image-wrap ' + $(this).attr('class') + '" style="position:relative; display:inline-block; background:url(' + $(this).attr('src') + ') no-repeat center center; width: ' + $(this).width() + 'px; height: ' + $(this).height() + 'px;" />';
    });
    $(this).css('opacity', '0');
  });
};
;
/*!
 * imagesLoaded PACKAGED v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */


/*!
 * EventEmitter v4.2.6 - git.io/ee
 * Oliver Caldwell
 * MIT license
 * @preserve
 */

(function () {
	

	/**
	 * Class for managing events.
	 * Can be extended to provide event functionality in other classes.
	 *
	 * @class EventEmitter Manages event registering and emitting.
	 */
	function EventEmitter() {}

	// Shortcuts to improve speed and size
	var proto = EventEmitter.prototype;
	var exports = this;
	var originalGlobalValue = exports.EventEmitter;

	/**
	 * Finds the index of the listener for the event in it's storage array.
	 *
	 * @param {Function[]} listeners Array of listeners to search through.
	 * @param {Function} listener Method to look for.
	 * @return {Number} Index of the specified listener, -1 if not found
	 * @api private
	 */
	function indexOfListener(listeners, listener) {
		var i = listeners.length;
		while (i--) {
			if (listeners[i].listener === listener) {
				return i;
			}
		}

		return -1;
	}

	/**
	 * Alias a method while keeping the context correct, to allow for overwriting of target method.
	 *
	 * @param {String} name The name of the target method.
	 * @return {Function} The aliased method
	 * @api private
	 */
	function alias(name) {
		return function aliasClosure() {
			return this[name].apply(this, arguments);
		};
	}

	/**
	 * Returns the listener array for the specified event.
	 * Will initialise the event object and listener arrays if required.
	 * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
	 * Each property in the object response is an array of listener functions.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Function[]|Object} All listener functions for the event.
	 */
	proto.getListeners = function getListeners(evt) {
		var events = this._getEvents();
		var response;
		var key;

		// Return a concatenated array of all matching events if
		// the selector is a regular expression.
		if (typeof evt === 'object') {
			response = {};
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					response[key] = events[key];
				}
			}
		}
		else {
			response = events[evt] || (events[evt] = []);
		}

		return response;
	};

	/**
	 * Takes a list of listener objects and flattens it into a list of listener functions.
	 *
	 * @param {Object[]} listeners Raw listener objects.
	 * @return {Function[]} Just the listener functions.
	 */
	proto.flattenListeners = function flattenListeners(listeners) {
		var flatListeners = [];
		var i;

		for (i = 0; i < listeners.length; i += 1) {
			flatListeners.push(listeners[i].listener);
		}

		return flatListeners;
	};

	/**
	 * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Object} All listener functions for an event in an object.
	 */
	proto.getListenersAsObject = function getListenersAsObject(evt) {
		var listeners = this.getListeners(evt);
		var response;

		if (listeners instanceof Array) {
			response = {};
			response[evt] = listeners;
		}

		return response || listeners;
	};

	/**
	 * Adds a listener function to the specified event.
	 * The listener will not be added if it is a duplicate.
	 * If the listener returns true then it will be removed after it is called.
	 * If you pass a regular expression as the event name then the listener will be added to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListener = function addListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var listenerIsWrapped = typeof listener === 'object';
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
				listeners[key].push(listenerIsWrapped ? listener : {
					listener: listener,
					once: false
				});
			}
		}

		return this;
	};

	/**
	 * Alias of addListener
	 */
	proto.on = alias('addListener');

	/**
	 * Semi-alias of addListener. It will add a listener that will be
	 * automatically removed after it's first execution.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addOnceListener = function addOnceListener(evt, listener) {
		return this.addListener(evt, {
			listener: listener,
			once: true
		});
	};

	/**
	 * Alias of addOnceListener.
	 */
	proto.once = alias('addOnceListener');

	/**
	 * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
	 * You need to tell it what event names should be matched by a regex.
	 *
	 * @param {String} evt Name of the event to create.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvent = function defineEvent(evt) {
		this.getListeners(evt);
		return this;
	};

	/**
	 * Uses defineEvent to define multiple events.
	 *
	 * @param {String[]} evts An array of event names to define.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvents = function defineEvents(evts) {
		for (var i = 0; i < evts.length; i += 1) {
			this.defineEvent(evts[i]);
		}
		return this;
	};

	/**
	 * Removes a listener function from the specified event.
	 * When passed a regular expression as the event name, it will remove the listener from all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to remove the listener from.
	 * @param {Function} listener Method to remove from the event.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListener = function removeListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var index;
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				index = indexOfListener(listeners[key], listener);

				if (index !== -1) {
					listeners[key].splice(index, 1);
				}
			}
		}

		return this;
	};

	/**
	 * Alias of removeListener
	 */
	proto.off = alias('removeListener');

	/**
	 * Adds listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
	 * You can also pass it a regular expression to add the array of listeners to all events that match it.
	 * Yeah, this function does quite a bit. That's probably a bad thing.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListeners = function addListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(false, evt, listeners);
	};

	/**
	 * Removes listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be removed.
	 * You can also pass it a regular expression to remove the listeners from all events that match it.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListeners = function removeListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(true, evt, listeners);
	};

	/**
	 * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
	 * The first argument will determine if the listeners are removed (true) or added (false).
	 * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be added/removed.
	 * You can also pass it a regular expression to manipulate the listeners of all events that match it.
	 *
	 * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
		var i;
		var value;
		var single = remove ? this.removeListener : this.addListener;
		var multiple = remove ? this.removeListeners : this.addListeners;

		// If evt is an object then pass each of it's properties to this method
		if (typeof evt === 'object' && !(evt instanceof RegExp)) {
			for (i in evt) {
				if (evt.hasOwnProperty(i) && (value = evt[i])) {
					// Pass the single listener straight through to the singular method
					if (typeof value === 'function') {
						single.call(this, i, value);
					}
					else {
						// Otherwise pass back to the multiple function
						multiple.call(this, i, value);
					}
				}
			}
		}
		else {
			// So evt must be a string
			// And listeners must be an array of listeners
			// Loop over it and pass each one to the multiple method
			i = listeners.length;
			while (i--) {
				single.call(this, evt, listeners[i]);
			}
		}

		return this;
	};

	/**
	 * Removes all listeners from a specified event.
	 * If you do not specify an event then all listeners will be removed.
	 * That means every event will be emptied.
	 * You can also pass a regex to remove all events that match it.
	 *
	 * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeEvent = function removeEvent(evt) {
		var type = typeof evt;
		var events = this._getEvents();
		var key;

		// Remove different things depending on the state of evt
		if (type === 'string') {
			// Remove all listeners for the specified event
			delete events[evt];
		}
		else if (type === 'object') {
			// Remove all events matching the regex.
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					delete events[key];
				}
			}
		}
		else {
			// Remove all listeners in all events
			delete this._events;
		}

		return this;
	};

	/**
	 * Alias of removeEvent.
	 *
	 * Added to mirror the node API.
	 */
	proto.removeAllListeners = alias('removeEvent');

	/**
	 * Emits an event of your choice.
	 * When emitted, every listener attached to that event will be executed.
	 * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
	 * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
	 * So they will not arrive within the array on the other side, they will be separate.
	 * You can also pass a regular expression to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {Array} [args] Optional array of arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emitEvent = function emitEvent(evt, args) {
		var listeners = this.getListenersAsObject(evt);
		var listener;
		var i;
		var key;
		var response;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				i = listeners[key].length;

				while (i--) {
					// If the listener returns true then it shall be removed from the event
					// The function is executed either with a basic call or an apply if there is an args array
					listener = listeners[key][i];

					if (listener.once === true) {
						this.removeListener(evt, listener.listener);
					}

					response = listener.listener.apply(this, args || []);

					if (response === this._getOnceReturnValue()) {
						this.removeListener(evt, listener.listener);
					}
				}
			}
		}

		return this;
	};

	/**
	 * Alias of emitEvent
	 */
	proto.trigger = alias('emitEvent');

	/**
	 * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
	 * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {...*} Optional additional arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emit = function emit(evt) {
		var args = Array.prototype.slice.call(arguments, 1);
		return this.emitEvent(evt, args);
	};

	/**
	 * Sets the current value to check against when executing listeners. If a
	 * listeners return value matches the one set here then it will be removed
	 * after execution. This value defaults to true.
	 *
	 * @param {*} value The new value to check for when executing listeners.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.setOnceReturnValue = function setOnceReturnValue(value) {
		this._onceReturnValue = value;
		return this;
	};

	/**
	 * Fetches the current value to check against when executing listeners. If
	 * the listeners return value matches this one then it should be removed
	 * automatically. It will return true by default.
	 *
	 * @return {*|Boolean} The current value to check for or the default, true.
	 * @api private
	 */
	proto._getOnceReturnValue = function _getOnceReturnValue() {
		if (this.hasOwnProperty('_onceReturnValue')) {
			return this._onceReturnValue;
		}
		else {
			return true;
		}
	};

	/**
	 * Fetches the events object and creates one if required.
	 *
	 * @return {Object} The events storage object.
	 * @api private
	 */
	proto._getEvents = function _getEvents() {
		return this._events || (this._events = {});
	};

	/**
	 * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
	 *
	 * @return {Function} Non conflicting EventEmitter class.
	 */
	EventEmitter.noConflict = function noConflict() {
		exports.EventEmitter = originalGlobalValue;
		return EventEmitter;
	};

	// Expose the class either via AMD, CommonJS or the global object
	if (typeof define === 'function' && define.amd) {
		define('eventEmitter/EventEmitter',[],function () {
			return EventEmitter;
		});
	}
	else if (typeof module === 'object' && module.exports){
		module.exports = EventEmitter;
	}
	else {
		this.EventEmitter = EventEmitter;
	}
}.call(this));

/*!
 * eventie v1.0.4
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false */

( function( window ) {



var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'eventie/eventie',eventie );
} else {
  // browser global
  window.eventie = eventie;
}

})( this );

/*!
 * imagesLoaded v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

( function( window, factory ) { 
  // universal module definition

  /*global define: false, module: false, require: false */

  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( [
      'eventEmitter/EventEmitter',
      'eventie/eventie'
    ], function( EventEmitter, eventie ) {
      return factory( window, EventEmitter, eventie );
    });
  } else if ( typeof exports === 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('wolfy87-eventemitter'),
      require('eventie')
    );
  } else {
    // browser global
    window.imagesLoaded = factory(
      window,
      window.EventEmitter,
      window.eventie
    );
  }

})( window,

// --------------------------  factory -------------------------- //

function factory( window, EventEmitter, eventie ) {



var $ = window.jQuery;
var console = window.console;
var hasConsole = typeof console !== 'undefined';

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

var objToString = Object.prototype.toString;
function isArray( obj ) {
  return objToString.call( obj ) === '[object Array]';
}

// turn element or nodeList into an array
function makeArray( obj ) {
  var ary = [];
  if ( isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( typeof obj.length === 'number' ) {
    // convert nodeList to array
    for ( var i=0, len = obj.length; i < len; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
}

  // -------------------------- imagesLoaded -------------------------- //

  /**
   * @param {Array, Element, NodeList, String} elem
   * @param {Object or Function} options - if function, use as callback
   * @param {Function} onAlways - callback function
   */
  function ImagesLoaded( elem, options, onAlways ) {
    // coerce ImagesLoaded() without new, to be new ImagesLoaded()
    if ( !( this instanceof ImagesLoaded ) ) {
      return new ImagesLoaded( elem, options );
    }
    // use elem as selector string
    if ( typeof elem === 'string' ) {
      elem = document.querySelectorAll( elem );
    }

    this.elements = makeArray( elem );
    this.options = extend( {}, this.options );

    if ( typeof options === 'function' ) {
      onAlways = options;
    } else {
      extend( this.options, options );
    }

    if ( onAlways ) {
      this.on( 'always', onAlways );
    }

    this.getImages();

    if ( $ ) {
      // add jQuery Deferred object
      this.jqDeferred = new $.Deferred();
    }

    // HACK check async to allow time to bind listeners
    var _this = this;
    setTimeout( function() {
      _this.check();
    });
  }

  ImagesLoaded.prototype = new EventEmitter();

  ImagesLoaded.prototype.options = {};

  ImagesLoaded.prototype.getImages = function() {
    this.images = [];

    // filter & find items if we have an item selector
    for ( var i=0, len = this.elements.length; i < len; i++ ) {
      var elem = this.elements[i];
      // filter siblings
      if ( elem.nodeName === 'IMG' ) {
        this.addImage( elem );
      }
      // find children
      // no non-element nodes, #143
      var nodeType = elem.nodeType;
      if ( !nodeType || !( nodeType === 1 || nodeType === 9 || nodeType === 11 ) ) {
        continue;
      }
      var childElems = elem.querySelectorAll('img');
      // concat childElems to filterFound array
      for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
        var img = childElems[j];
        this.addImage( img );
      }
    }
  };

  /**
   * @param {Image} img
   */
  ImagesLoaded.prototype.addImage = function( img ) {
    var loadingImage = new LoadingImage( img );
    this.images.push( loadingImage );
  };

  ImagesLoaded.prototype.check = function() {
    var _this = this;
    var checkedCount = 0;
    var length = this.images.length;
    this.hasAnyBroken = false;
    // complete if no images
    if ( !length ) {
      this.complete();
      return;
    }

    function onConfirm( image, message ) {
      if ( _this.options.debug && hasConsole ) {
        console.log( 'confirm', image, message );
      }

      _this.progress( image );
      checkedCount++;
      if ( checkedCount === length ) {
        _this.complete();
      }
      return true; // bind once
    }

    for ( var i=0; i < length; i++ ) {
      var loadingImage = this.images[i];
      loadingImage.on( 'confirm', onConfirm );
      loadingImage.check();
    }
  };

  ImagesLoaded.prototype.progress = function( image ) {
    this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
    // HACK - Chrome triggers event before object properties have changed. #83
    var _this = this;
    setTimeout( function() {
      _this.emit( 'progress', _this, image );
      if ( _this.jqDeferred && _this.jqDeferred.notify ) {
        _this.jqDeferred.notify( _this, image );
      }
    });
  };

  ImagesLoaded.prototype.complete = function() {
    var eventName = this.hasAnyBroken ? 'fail' : 'done';
    this.isComplete = true;
    var _this = this;
    // HACK - another setTimeout so that confirm happens after progress
    setTimeout( function() {
      _this.emit( eventName, _this );
      _this.emit( 'always', _this );
      if ( _this.jqDeferred ) {
        var jqMethod = _this.hasAnyBroken ? 'reject' : 'resolve';
        _this.jqDeferred[ jqMethod ]( _this );
      }
    });
  };

  // -------------------------- jquery -------------------------- //

  if ( $ ) {
    $.fn.imagesLoaded = function( options, callback ) {
      var instance = new ImagesLoaded( this, options, callback );
      return instance.jqDeferred.promise( $(this) );
    };
  }


  // --------------------------  -------------------------- //

  function LoadingImage( img ) {
    this.img = img;
  }

  LoadingImage.prototype = new EventEmitter();

  LoadingImage.prototype.check = function() {
    // first check cached any previous images that have same src
    var resource = cache[ this.img.src ] || new Resource( this.img.src );
    if ( resource.isConfirmed ) {
      this.confirm( resource.isLoaded, 'cached was confirmed' );
      return;
    }

    // If complete is true and browser supports natural sizes,
    // try to check for image status manually.
    if ( this.img.complete && this.img.naturalWidth !== undefined ) {
      // report based on naturalWidth
      this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
      return;
    }

    // If none of the checks above matched, simulate loading on detached element.
    var _this = this;
    resource.on( 'confirm', function( resrc, message ) {
      _this.confirm( resrc.isLoaded, message );
      return true;
    });

    resource.check();
  };

  LoadingImage.prototype.confirm = function( isLoaded, message ) {
    this.isLoaded = isLoaded;
    this.emit( 'confirm', this, message );
  };

  // -------------------------- Resource -------------------------- //

  // Resource checks each src, only once
  // separate class from LoadingImage to prevent memory leaks. See #115

  var cache = {};

  function Resource( src ) {
    this.src = src;
    // add to cache
    cache[ src ] = this;
  }

  Resource.prototype = new EventEmitter();

  Resource.prototype.check = function() {
    // only trigger checking once
    if ( this.isChecked ) {
      return;
    }
    // simulate loading on detached element
    var proxyImage = new Image();
    eventie.bind( proxyImage, 'load', this );
    eventie.bind( proxyImage, 'error', this );
    proxyImage.src = this.src;
    // set flag
    this.isChecked = true;
  };

  // ----- events ----- //

  // trigger specified handler for event type
  Resource.prototype.handleEvent = function( event ) {
    var method = 'on' + event.type;
    if ( this[ method ] ) {
      this[ method ]( event );
    }
  };

  Resource.prototype.onload = function( event ) {
    this.confirm( true, 'onload' );
    this.unbindProxyEvents( event );
  };

  Resource.prototype.onerror = function( event ) {
    this.confirm( false, 'onerror' );
    this.unbindProxyEvents( event );
  };

  // ----- confirm ----- //

  Resource.prototype.confirm = function( isLoaded, message ) {
    this.isConfirmed = true;
    this.isLoaded = isLoaded;
    this.emit( 'confirm', this, message );
  };

  Resource.prototype.unbindProxyEvents = function( event ) {
    eventie.unbind( event.target, 'load', this );
    eventie.unbind( event.target, 'error', this );
  };

  // -----  ----- //

  return ImagesLoaded;

});
;
(function($) {
	$.fn.countTo = function(options) {
		options = options || {};

		return $(this).each(function() {
			// set options for current element
			var settings = $.extend({}, $.fn.countTo.defaults, {
				from: $(this).data('from'),
				to: $(this).data('to'),
				speed: $(this).data('speed'),
				refreshInterval: $(this).data('refresh-interval'),
				decimals: $(this).data('decimals')
			}, options);

			// how many times to update the value, and how much to increment the value on each update
			var loops = Math.ceil(settings.speed / settings.refreshInterval),
				increment = (settings.to - settings.from) / loops;

			// references & variables that will change with each update
			var self = this,
				$self = $(this),
				loopCount = 0,
				value = settings.from,
				data = $self.data('countTo') || {};

			$self.data('countTo', data);

			// if an existing interval can be found, clear it first
			if (data.interval) {
				clearInterval(data.interval);
			}
			data.interval = setInterval(updateTimer, settings.refreshInterval);

			// initialize the element with the starting value
			render(value);

			function updateTimer() {
				value += increment;
				loopCount++;

				render(value);

				if (typeof(settings.onUpdate) == 'function') {
					settings.onUpdate.call(self, value);
				}

				if (loopCount >= loops) {
					// remove the interval
					$self.removeData('countTo');
					clearInterval(data.interval);
					value = settings.to;

					if (typeof(settings.onComplete) == 'function') {
						settings.onComplete.call(self, value);
					}
				}
			}

			function render(value) {
				var formattedValue = settings.formatter.call(self, value, settings);
				$self.text(formattedValue);
			}
		});
	};

	$.fn.countTo.defaults = {
		from: 0, // the number the element should start at
		to: 0, // the number the element should end at
		speed: 1000, // how long it should take to count between the target numbers
		refreshInterval: 100, // how often the element should be updated
		decimals: 0, // the number of decimal places to show
		formatter: formatter, // handler for formatting the value before rendering
		onUpdate: null, // callback method for every time the element is updated
		onComplete: null // callback method for when the element finishes updating
	};

	function formatter(value, settings) {
		return value.toFixed(settings.decimals);
	}
}(jQuery));
;
(function(jQuery){
	
	jQuery.hotkeys = {
		version: "0.8",

		specialKeys: {
			8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
			20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
			37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 
			96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
			104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/", 
			112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 
			120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
		},
	
		shiftNums: {
			"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", 
			"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<", 
			".": ">",  "/": "?",  "\\": "|"
		}
	};

	function keyHandler( handleObj ) {
		// Only care when a possible input has been specified
		if ( typeof handleObj.data !== "string" ) {
			return;
		}
		
		var origHandler = handleObj.handler,
			keys = handleObj.data.toLowerCase().split(" "),
			textAcceptingInputTypes = ["text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime", "datetime-local", "search", "color"];
	
		handleObj.handler = function( event ) {
			// Don't fire in text-accepting inputs that we didn't directly bind to
			if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
				jQuery.inArray(event.target.type, textAcceptingInputTypes) > -1 ) ) {
				return;
			}
			
			// Keypress represents characters, not special keys
			var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
				character = String.fromCharCode( event.which ).toLowerCase(),
				key, modif = "", possible = {};

			// check combinations (alt|ctrl|shift+anything)
			if ( event.altKey && special !== "alt" ) {
				modif += "alt+";
			}

			if ( event.ctrlKey && special !== "ctrl" ) {
				modif += "ctrl+";
			}
			
			// TODO: Need to make sure this works consistently across platforms
			if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
				modif += "meta+";
			}

			if ( event.shiftKey && special !== "shift" ) {
				modif += "shift+";
			}

			if ( special ) {
				possible[ modif + special ] = true;

			} else {
				possible[ modif + character ] = true;
				possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;

				// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
				if ( modif === "shift+" ) {
					possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
				}
			}

			for ( var i = 0, l = keys.length; i < l; i++ ) {
				if ( possible[ keys[i] ] ) {
					return origHandler.apply( this, arguments );
				}
			}
		};
	}

	jQuery.each([ "keydown", "keyup", "keypress" ], function() {
		jQuery.event.special[ this ] = { add: keyHandler };
	});

})( jQuery );;
/*!jQuery Knob*/
/**
 * Downward compatible, touchable dial
 *
 * Version: 1.2.8
 * Requires: jQuery v1.7+
 *
 * Copyright (c) 2012 Anthony Terrien
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Thanks to vor, eskimoblood, spiffistan, FabrizioC
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    /**
     * Kontrol library
     */
    "use strict";

    /**
     * Definition of globals and core
     */
    var k = {}, // kontrol
        max = Math.max,
        min = Math.min;

    k.c = {};
    k.c.d = $(document);
    k.c.t = function (e) {
        return e.originalEvent.touches.length - 1;
    };

    /**
     * Kontrol Object
     *
     * Definition of an abstract UI control
     *
     * Each concrete component must call this one.
     * <code>
     * k.o.call(this);
     * </code>
     */
    k.o = function () {
        var s = this;

        this.o = null; // array of options
        this.$ = null; // jQuery wrapped element
        this.i = null; // mixed HTMLInputElement or array of HTMLInputElement
        this.g = null; // deprecated 2D graphics context for 'pre-rendering'
        this.v = null; // value ; mixed array or integer
        this.cv = null; // change value ; not commited value
        this.x = 0; // canvas x position
        this.y = 0; // canvas y position
        this.w = 0; // canvas width
        this.h = 0; // canvas height
        this.$c = null; // jQuery canvas element
        this.c = null; // rendered canvas context
        this.t = 0; // touches index
        this.isInit = false;
        this.fgColor = null; // main color
        this.pColor = null; // previous color
        this.dH = null; // draw hook
        this.cH = null; // change hook
        this.eH = null; // cancel hook
        this.rH = null; // release hook
        this.scale = 1; // scale factor
        this.relative = false;
        this.relativeWidth = false;
        this.relativeHeight = false;
        this.$div = null; // component div

        this.run = function () {
            var cf = function (e, conf) {
                var k;
                for (k in conf) {
                    s.o[k] = conf[k];
                }
                s._carve().init();
                s._configure()
                 ._draw();
            };

            if(this.$.data('kontroled')) return;
            this.$.data('kontroled', true);

            this.extend();
            this.o = $.extend(
                {
                    // Config
                    min : this.$.data('min') !== undefined ? this.$.data('min') : 0,
                    max : this.$.data('max') !== undefined ? this.$.data('max') : 100,
                    stopper : true,
                    readOnly : this.$.data('readonly') || (this.$.attr('readonly') === 'readonly'),

                    // UI
                    cursor : (this.$.data('cursor') === true && 30) ||
                                this.$.data('cursor') || 0,
                    thickness : (
                                    this.$.data('thickness') &&
                                    Math.max(Math.min(this.$.data('thickness'), 1), 0.01)
                                ) || 0.35,
                    lineCap : this.$.data('linecap') || 'butt',
                    width : this.$.data('width') || 200,
                    height : this.$.data('height') || 100,
                    displayInput : this.$.data('displayinput') == null || this.$.data('displayinput'),
                    displayPrevious : this.$.data('displayprevious'),
                    fgColor : this.$.data('fgcolor') || '#87CEEB',
                    inputColor: this.$.data('inputcolor'),
                    font: this.$.data('font') || 'Arial',
                    fontWeight: this.$.data('font-weight') || 'bold',
                    inline : false,
                    step : this.$.data('step') || 1,
                    rotation: this.$.data('rotation'),

                    // Hooks
                    draw : null, // function () {}
                    change : null, // function (value) {}
                    cancel : null, // function () {}
                    release : null, // function (value) {}

                    // Output formatting, allows to add unit: %, ms ...
                    format: function(v) {
                        return v;
                    },
                    parse: function (v) {
                        return parseFloat(v);
                    }
                }, this.o
            );

            // finalize options
            this.o.flip = this.o.rotation === 'anticlockwise' || this.o.rotation === 'acw';
            if(!this.o.inputColor) {
                this.o.inputColor = this.o.fgColor;
            }

            // routing value
            if(this.$.is('fieldset')) {

                // fieldset = array of integer
                this.v = {};
                this.i = this.$.find('input');
                this.i.each(function(k) {
                    var $this = $(this);
                    s.i[k] = $this;
                    s.v[k] = s.o.parse($this.val());

                    $this.bind(
                        'change blur'
                        , function () {
                            var val = {};
                            val[k] = $this.val();
                            s.val(val);
                        }
                    );
                });
                this.$.find('legend').remove();

            } else {

                // input = integer
                this.i = this.$;
                this.v = this.o.parse(this.$.val());
                (this.v === '') && (this.v = this.o.min);

                this.$.bind(
                    'change blur'
                    , function () {
                        s.val(s._validate(s.o.parse(s.$.val())));
                    }
                );

            }

            (!this.o.displayInput) && this.$.hide();

            // adds needed DOM elements (canvas, div)
            this.$c = $(document.createElement('canvas')).attr({
                width: this.o.width,
                height: this.o.height
            });

            // wraps all elements in a div
            // add to DOM before Canvas init is triggered
            this.$div = $('<div style="'
                + (this.o.inline ? 'display:inline;' : '')
                + 'width:' + this.o.width + 'px;height:' + this.o.height + 'px;'
                + '"></div>');

            this.$.wrap(this.$div).before(this.$c);
            this.$div = this.$.parent();

            if (typeof G_vmlCanvasManager !== 'undefined') {
              G_vmlCanvasManager.initElement(this.$c[0]);
            }

            this.c = this.$c[0].getContext ? this.$c[0].getContext('2d') : null;

            if (!this.c) {
                throw {
                    name:        "CanvasNotSupportedException",
                    message:     "Canvas not supported. Please use excanvas on IE8.0.",
                    toString:    function(){return this.name + ": " + this.message}
                }
            }

            // hdpi support
            this.scale = (window.devicePixelRatio || 1) /
                        (
                            this.c.webkitBackingStorePixelRatio ||
                            this.c.mozBackingStorePixelRatio ||
                            this.c.msBackingStorePixelRatio ||
                            this.c.oBackingStorePixelRatio ||
                            this.c.backingStorePixelRatio || 1
                        );

            // detects relative width / height
            this.relativeWidth = ((this.o.width % 1 !== 0) &&
                this.o.width.indexOf('%'));
            this.relativeHeight = ((this.o.height % 1 !== 0) &&
                this.o.height.indexOf('%'));
            this.relative = (this.relativeWidth || this.relativeHeight);

            // computes size and carves the component
            this._carve();

            // prepares props for transaction
            if (this.v instanceof Object) {
                this.cv = {};
                this.copy(this.v, this.cv);
            } else {
                this.cv = this.v;
            }

            // binds configure event
            this.$
                .bind("configure", cf)
                .parent()
                .bind("configure", cf);

            // finalize init
            this._listen()
                ._configure()
                ._xy()
                .init();

            this.isInit = true;

            this.$.val(this.o.format(this.v));
            this._draw();

            return this;
        };

        this._carve = function() {
            if(this.relative) {
                var w = this.relativeWidth ?
                            this.$div.parent().width() *
                            parseInt(this.o.width) / 100 :
                            this.$div.parent().width(),
                    h = this.relativeHeight ?
                            this.$div.parent().height() *
                            parseInt(this.o.height) / 100 :
                            this.$div.parent().height();

                // apply relative
                this.w = this.h = Math.min(w, h);
            } else {
                this.w = this.o.width;
                this.h = this.o.height;
            }

            // finalize div
            this.$div.css({
                'width': this.w + 'px',
                'height': this.h + 'px'
            });

            // finalize canvas with computed width
            this.$c.attr({
                width: this.w,
                height: this.h
            });

            // scaling
            if (this.scale !== 1) {
                this.$c[0].width = this.$c[0].width * this.scale;
                this.$c[0].height = this.$c[0].height * this.scale;
                this.$c.width(this.w);
                this.$c.height(this.h);
            }

            return this;
        }

        this._draw = function () {

            // canvas pre-rendering
            var d = true;

            s.g = s.c;

            s.clear();

            s.dH
            && (d = s.dH());

            (d !== false) && s.draw();

        };

        this._touch = function (e) {

            var touchMove = function (e) {

                var v = s.xy2val(
                            e.originalEvent.touches[s.t].pageX,
                            e.originalEvent.touches[s.t].pageY
                            );

                if (v == s.cv) return;

                if (s.cH && (s.cH(v) === false)) return;

                s.change(s._validate(v));
                s._draw();
            };

            // get touches index
            this.t = k.c.t(e);

            // First touch
            touchMove(e);

            // Touch events listeners
            k.c.d
                .bind("touchmove.k", touchMove)
                .bind(
                    "touchend.k"
                    , function () {
                        k.c.d.unbind('touchmove.k touchend.k');
                        s.val(s.cv);
                    }
                );

            return this;
        };

        this._mouse = function (e) {

            var mouseMove = function (e) {
                var v = s.xy2val(e.pageX, e.pageY);

                if (v == s.cv) return;

                if (s.cH && (s.cH(v) === false)) return;

                s.change(s._validate(v));
                s._draw();
            };

            // First click
            mouseMove(e);

            // Mouse events listeners
            k.c.d
                .bind("mousemove.k", mouseMove)
                .bind(
                    // Escape key cancel current change
                    "keyup.k"
                    , function (e) {
                        if (e.keyCode === 27) {
                            k.c.d.unbind("mouseup.k mousemove.k keyup.k");

                            if (
                                s.eH
                                && (s.eH() === false)
                            ) return;

                            s.cancel();
                        }
                    }
                )
                .bind(
                    "mouseup.k"
                    , function (e) {
                        k.c.d.unbind('mousemove.k mouseup.k keyup.k');
                        s.val(s.cv);
                    }
                );

            return this;
        };

        this._xy = function () {
            var o = this.$c.offset();
            this.x = o.left;
            this.y = o.top;
            return this;
        };

        this._listen = function () {

            if (!this.o.readOnly) {
                this.$c
                    .bind(
                        "mousedown"
                        , function (e) {
                            e.preventDefault();
                            s._xy()._mouse(e);
                         }
                    )
                    .bind(
                        "touchstart"
                        , function (e) {
                            e.preventDefault();
                            s._xy()._touch(e);
                         }
                    );

                this.listen();
            } else {
                this.$.attr('readonly', 'readonly');
            }

            if(this.relative) {
                $(window).resize(function() {
                    s._carve()
                     .init();
                    s._draw();
                });
            }

            return this;
        };

        this._configure = function () {

            // Hooks
            if (this.o.draw) this.dH = this.o.draw;
            if (this.o.change) this.cH = this.o.change;
            if (this.o.cancel) this.eH = this.o.cancel;
            if (this.o.release) this.rH = this.o.release;

            if (this.o.displayPrevious) {
                this.pColor = this.h2rgba(this.o.fgColor, "0.4");
                this.fgColor = this.h2rgba(this.o.fgColor, "0.6");
            } else {
                this.fgColor = this.o.fgColor;
            }

            return this;
        };

        this._clear = function () {
            this.$c[0].width = this.$c[0].width;
        };

        this._validate = function(v) {
            return (~~ (((v < 0) ? -0.5 : 0.5) + (v/this.o.step))) * this.o.step;
        };

        // Abstract methods
        this.listen = function () {}; // on start, one time
        this.extend = function () {}; // each time configure triggered
        this.init = function () {}; // each time configure triggered
        this.change = function (v) {}; // on change
        this.val = function (v) {}; // on release
        this.xy2val = function (x, y) {}; //
        this.draw = function () {}; // on change / on release
        this.clear = function () { this._clear(); };

        // Utils
        this.h2rgba = function (h, a) {
            var rgb;
            h = h.substring(1,7)
            rgb = [parseInt(h.substring(0,2),16)
                   ,parseInt(h.substring(2,4),16)
                   ,parseInt(h.substring(4,6),16)];
            return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + a + ")";
        };

        this.copy = function (f, t) {
            for (var i in f) { t[i] = f[i]; }
        };
    };


    /**
     * k.Dial
     */
    k.Dial = function () {
        k.o.call(this);

        this.startAngle = null;
        this.xy = null;
        this.radius = null;
        this.lineWidth = null;
        this.cursorExt = null;
        this.w2 = null;
        this.PI2 = 2*Math.PI;

        this.extend = function () {
            this.o = $.extend(
                {
                    bgColor : this.$.data('bgcolor') || '#EEEEEE',
                    angleOffset : this.$.data('angleoffset') || 0,
                    angleArc : this.$.data('anglearc') || 360,
                    inline : true
                }, this.o
            );
        };

        this.val = function (v, triggerRelease) {
            if (null != v) {

                // reverse format
                v = this.o.parse(v);

                if (
                    triggerRelease !== false && (v != this.v) && this.rH &&
                        (this.rH(v) === false)
                ) return;

                this.cv = this.o.stopper ? max(min(v, this.o.max), this.o.min) : v;
                this.v = this.cv;
                this.$.val(this.o.format(this.v));
                this._draw();
            } else {
                return this.v;
            }
        };

        this.xy2val = function (x, y) {
            var a, ret;

            a = Math.atan2(
                        x - (this.x + this.w2)
                        , - (y - this.y - this.w2)
                    ) - this.angleOffset;

            if (this.o.flip) {
                a = this.angleArc - a - this.PI2;
            }

            if(this.angleArc != this.PI2 && (a < 0) && (a > -0.5)) {
                // if isset angleArc option, set to min if .5 under min
                a = 0;
            } else if (a < 0) {
                a += this.PI2;
            }

            ret = ~~ (0.5 + (a * (this.o.max - this.o.min) / this.angleArc))
                    + this.o.min;

            this.o.stopper && (ret = max(min(ret, this.o.max), this.o.min));

            return ret;
        };

        this.listen = function () {
            // bind MouseWheel
            var s = this, mwTimerStop, mwTimerRelease,
                mw = function (e) {
                    e.preventDefault();

                    var ori = e.originalEvent
                        ,deltaX = ori.detail || ori.wheelDeltaX
                        ,deltaY = ori.detail || ori.wheelDeltaY
                        ,v = s._validate(s.o.parse(s.$.val()))
                            + (deltaX>0 || deltaY>0 ? s.o.step : deltaX<0 || deltaY<0 ? -s.o.step : 0);

                    v = max(min(v, s.o.max), s.o.min);

                    s.val(v, false);

                    if(s.rH) {
                        // Handle mousewheel stop
                        clearTimeout(mwTimerStop);
                        mwTimerStop = setTimeout(function() {
                            s.rH(v);
                            mwTimerStop = null;
                        }, 100);

                        // Handle mousewheel releases
                        if(!mwTimerRelease) {
                            mwTimerRelease = setTimeout(function() {
                                if(mwTimerStop) s.rH(v);
                                mwTimerRelease = null;
                            }, 200);
                        }
                    }
                }
                , kval, to, m = 1, kv = {37:-s.o.step, 38:s.o.step, 39:s.o.step, 40:-s.o.step};

            this.$
                .bind(
                    "keydown"
                    ,function (e) {
                        var kc = e.keyCode;

                        // numpad support
                        if(kc >= 96 && kc <= 105) {
                            kc = e.keyCode = kc - 48;
                        }

                        kval = parseInt(String.fromCharCode(kc));

                        if (isNaN(kval)) {

                            (kc !== 13)         // enter
                            && (kc !== 8)       // bs
                            && (kc !== 9)       // tab
                            && (kc !== 189)     // -
                            && (kc !== 190 || s.$.val().match(/\./))     // . only allowed once
                            && e.preventDefault();

                            // arrows
                            if ($.inArray(kc,[37,38,39,40]) > -1) {
                                e.preventDefault();

                                var v = s.o.parse(s.$.val()) + kv[kc] * m;
                                s.o.stopper && (v = max(min(v, s.o.max), s.o.min));

                                s.change(v);
                                s._draw();

                                // long time keydown speed-up
                                to = window.setTimeout(
                                    function () { m *= 2; }, 30
                                );
                            }
                        }
                    }
                )
                .bind(
                    "keyup"
                    ,function (e) {
                        if (isNaN(kval)) {
                            if (to) {
                                window.clearTimeout(to);
                                to = null;
                                m = 1;
                                s.val(s.$.val());
                            }
                        } else {
                            // kval postcond
                            (s.$.val() > s.o.max && s.$.val(s.o.max))
                            || (s.$.val() < s.o.min && s.$.val(s.o.min));
                        }

                    }
                );

            this.$c.bind("mousewheel DOMMouseScroll", mw);
            this.$.bind("mousewheel DOMMouseScroll", mw)
        };

        this.init = function () {

            if (
                this.v < this.o.min
                || this.v > this.o.max
            ) this.v = this.o.min;

            this.$.val(this.v);
            this.w2 = this.w / 2;
            this.cursorExt = this.o.cursor / 100;
            this.xy = this.w2 * this.scale;
            this.lineWidth = this.xy * this.o.thickness;
            this.lineCap = this.o.lineCap;
            this.radius = this.xy - this.lineWidth / 2;

            this.o.angleOffset
            && (this.o.angleOffset = isNaN(this.o.angleOffset) ? 0 : this.o.angleOffset);

            this.o.angleArc
            && (this.o.angleArc = isNaN(this.o.angleArc) ? this.PI2 : this.o.angleArc);

            // deg to rad
            this.angleOffset = this.o.angleOffset * Math.PI / 180;
            this.angleArc = this.o.angleArc * Math.PI / 180;

            // compute start and end angles
            this.startAngle = 1.5 * Math.PI + this.angleOffset;
            this.endAngle = 1.5 * Math.PI + this.angleOffset + this.angleArc;

            var s = max(
                            String(Math.abs(this.o.max)).length
                            , String(Math.abs(this.o.min)).length
                            , 2
                            ) + 2;

            this.o.displayInput
                && this.i.css({
                        'width' : ((this.w / 2 + 4) >> 0) + 'px'
                        ,'height' : ((this.w / 3) >> 0) + 'px'
                        ,'position' : 'absolute'
                        ,'vertical-align' : 'middle'
                        ,'margin-top' : ((this.w / 3) >> 0) + 'px'
                        ,'margin-left' : '-' + ((this.w * 3 / 4 + 2) >> 0) + 'px'
                        ,'border' : 0
                        ,'background' : 'none'
                        ,'font' : this.o.fontWeight + ' ' + ((this.w / s) >> 0) + 'px ' + this.o.font
                        ,'text-align' : 'center'
                        ,'color' : this.o.inputColor || this.o.fgColor
                        ,'padding' : '0px'
                        ,'outline' : 0
                        ,'-webkit-appearance': 'none'
                        })
                || this.i.css({
                        'width' : '0px'
                        ,'visibility' : 'hidden'
                        });
        };

        this.change = function (v) {
            this.cv = v;
            this.$.val(this.o.format(v));
        };

        this.angle = function (v) {
            return (v - this.o.min) * this.angleArc / (this.o.max - this.o.min);
        };

        this.arc = function (v) {
          var sa, ea;
          v = this.angle(v);
          if (this.o.flip) {
              sa = this.endAngle + 0.00001;
              ea = sa - v - 0.00001;
          } else {
              sa = this.startAngle - 0.00001;
              ea = sa + v + 0.00001;
          }
          this.o.cursor
              && (sa = ea - this.cursorExt)
              && (ea = ea + this.cursorExt);
          return {
              s: sa,
              e: ea,
              d: this.o.flip && !this.o.cursor
          };
        };

        this.draw = function () {

            var c = this.g,                 // context
                a = this.arc(this.cv)       // Arc
                , pa                        // Previous arc
                , r = 1;

            c.lineWidth = this.lineWidth;
            c.lineCap = this.lineCap;

            c.beginPath();
                c.strokeStyle = this.o.bgColor;
                c.arc(this.xy, this.xy, this.radius, this.endAngle - 0.00001, this.startAngle + 0.00001, true);
            c.stroke();

            if (this.o.displayPrevious) {
                pa = this.arc(this.v);
                c.beginPath();
                    c.strokeStyle = this.pColor;
                    c.arc(this.xy, this.xy, this.radius, pa.s, pa.e, pa.d);
                c.stroke();
                r = (this.cv == this.v);
            }

            c.beginPath();
                c.strokeStyle = r ? this.o.fgColor : this.fgColor ;
                c.arc(this.xy, this.xy, this.radius, a.s, a.e, a.d);
            c.stroke();
        };

        this.cancel = function () {
            this.val(this.v);
        };
    };

    $.fn.dial = $.fn.knob = function (o) {
        return this.each(
            function () {
                var d = new k.Dial();
                d.o = o;
                d.$ = $(this);
                d.run();
            }
        ).parent();
    };

}));

;
/*
Copyright 2010 Manos Malihutsakis (email: manos@malihu.gr)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
The code below is fairly long, fully commented and should be normally used in development. 
For production, use either the minified jquery.mCustomScrollbar.min.js script or 
the production-ready jquery.mCustomScrollbar.concat.min.js which contains the plugin 
and dependencies (minified). 
*/

;(function($,window,document,undefined){
	
	/* 
	----------------------------------------
	PLUGIN NAMESPACE, PREFIX, DEFAULT SELECTOR(S) 
	----------------------------------------
	*/
	
	var pluginNS="mCustomScrollbar",
		pluginPfx="mCS",
		defaultSelector=".mCustomScrollbar",
	
	
		
	
	
	/* 
	----------------------------------------
	DEFAULT OPTIONS 
	----------------------------------------
	*/
	
		defaults={
			/* 
			set element/content width programmatically 
			values: boolean, pixels, percentage 
			*/
			setWidth:false,
			/* 
			set element/content height programmatically 
			values: boolean, pixels, percentage 
			*/
			setHeight:false,
			/*
			set the initial css top property of content  
			values: string (e.g. "-100px", "10%" etc.)
			*/
			setTop:0,
			/*
			set the initial css left property of content  
			values: string (e.g. "-100px", "10%" etc.)
			*/
			setLeft:0,
			/* 
			scrollbar axis (vertical and/or horizontal scrollbars) 
			values (string): "y", "x", "yx"
			*/
			axis:"y",
			/*
			position of scrollbar relative to content  
			values (string): "inside", "outside" ("outside" requires elements with position:relative)
			*/
			scrollbarPosition:"inside",
			/*
			scrolling inertia
			values: integer (milliseconds)
			*/
			scrollInertia:950,
			/* 
			auto-adjust scrollbar dragger length
			values: boolean
			*/
			autoDraggerLength:true,
			/*
			auto-hide scrollbar when idle 
			values: boolean
			*/
			autoHideScrollbar:false,
			/*
			auto-expands scrollbar on mouse-over and dragging
			*/
			autoExpandScrollbar:false,
			/*
			always show scrollbar, even when there's nothing to scroll 
			values: integer (0=disable, 1=always show dragger rail, 2=always show dragger rail, dragger and buttons), boolean
			*/
			alwaysShowScrollbar:0,
			/*
			scrolling always snaps to a multiple of this number in pixels
			values: integer
			*/
			snapAmount:null,
			/*
			when snapping, snap with this number in pixels as an offset 
			values: integer
			*/
			snapOffset:0,
			/* 
			mouse-wheel scrolling
			*/
			mouseWheel:{
				/* 
				enable mouse-wheel scrolling
				values: boolean
				*/
				enable:true,
				/* 
				scrolling amount in pixels
				values: "auto", integer 
				*/
				scrollAmount:"auto",
				/* 
				mouse-wheel scrolling axis 
				the default scrolling direction when both vertical and horizontal scrollbars are present 
				values (string): "y", "x" 
				*/
				axis:"y",
				/* 
				prevent the default behaviour which automatically scrolls the parent element(s) 
				when end of scrolling is reached 
				values: boolean
				*/
				preventDefault:false,
				/*
				the reported mouse-wheel delta value. The number of lines (translated to pixels) one wheel notch scrolls.  
				values: "auto", integer 
				"auto" uses the default OS/browser value 
				*/
				deltaFactor:"auto",
				/*
				normalize mouse-wheel delta to -1 or 1 (disables mouse-wheel acceleration) 
				values: boolean
				*/
				normalizeDelta:false,
				/*
				invert mouse-wheel scrolling direction 
				values: boolean
				*/
				invert:false,
				/*
				the tags that disable mouse-wheel when cursor is over them
				*/
				disableOver:["select","option","keygen","datalist","textarea"]
			},
			/* 
			scrollbar buttons
			*/
			scrollButtons:{ 
				/*
				enable scrollbar buttons
				values: boolean
				*/
				enable:false,
				/*
				scrollbar buttons scrolling type 
				values (string): "stepless", "stepped"
				*/
				scrollType:"stepless",
				/*
				scrolling amount in pixels
				values: "auto", integer 
				*/
				scrollAmount:"auto"
			},
			/* 
			keyboard scrolling
			*/
			keyboard:{ 
				/*
				enable scrolling via keyboard
				values: boolean
				*/
				enable:true,
				/*
				keyboard scrolling type 
				values (string): "stepless", "stepped"
				*/
				scrollType:"stepless",
				/*
				scrolling amount in pixels
				values: "auto", integer 
				*/
				scrollAmount:"auto"
			},
			/*
			enable content touch-swipe scrolling 
			values: boolean, integer, string (number)
			integer values define the axis-specific minimum amount required for scrolling momentum
			*/
			contentTouchScroll:25,
			/*
			advanced option parameters
			*/
			advanced:{
				/*
				auto-expand content horizontally (for "x" or "yx" axis) 
				values: boolean
				*/
				autoExpandHorizontalScroll:false,
				/*
				auto-scroll to elements with focus
				*/
				autoScrollOnFocus:"input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",
				/*
				auto-update scrollbars on content, element or viewport resize 
				should be true for fluid layouts/elements, adding/removing content dynamically, hiding/showing elements, content with images etc. 
				values: boolean
				*/
				updateOnContentResize:true,
				/*
				auto-update scrollbars each time each image inside the element is fully loaded 
				values: boolean
				*/
				updateOnImageLoad:true,
				/*
				auto-update scrollbars based on the amount and size changes of specific selectors 
				useful when you need to update the scrollbar(s) automatically, each time a type of element is added, removed or changes its size 
				values: boolean, string (e.g. "ul li" will auto-update scrollbars each time list-items inside the element are changed) 
				a value of true (boolean) will auto-update scrollbars each time any element is changed
				*/
				updateOnSelectorChange:false
			},
			/* 
			scrollbar theme 
			values: string 
			ready-to-use themes: "light", "dark", "light-2", "dark-2", "light-3", "dark-3", "light-thick", "dark-thick", "light-thin", "dark-thin", 
			"rounded", "rounded-dark", "rounded-dots", "rounded-dots-dark", "3d", "3d-dark", "3d-thick", "3d-thick-dark", "minimal", "minimal-dark", 
			"inset", "inset-dark", "inset-2", "inset-2-dark", "inset-3", "inset-3-dark"
			*/
			theme:"light",
			/*
			user defined callback functions
			*/
			callbacks:{
				/*
				function to call when a scroll event starts 
				values (function): function(){}
				*/
				onScrollStart:false,
				/*
				function to call when a scroll event is complete 
				values (function): function(){}
				*/
				onScroll:false,
				/*
				function to call when a scroll event is complete and content is scrolled all the way to the end (bottom/right)
				values (function): function(){}
				*/
				onTotalScroll:false,
				/*
				function to call when a scroll event is complete and content is scrolled back to the beginning (top/left)
				values (function): function(){}
				*/
				onTotalScrollBack:false,
				/*
				function to call when a scroll event is running 
				values (function): function(){}
				*/
				whileScrolling:false,
				/*
				onTotalScroll offset value
				values: integer (pixels)
				*/
				onTotalScrollOffset:0,
				/*
				onTotalScrollBack offset value
				values: integer (pixels)
				*/
				onTotalScrollBackOffset:0,
				/*
				callback offsets will trigger even if content is already scrolled to the end or beginning
				values: boolean
				*/
				alwaysTriggerOffsets:true
			},
			/*
			add scrollbar(s) on all elements matching the current selector, now and in the future 
			values: boolean, string 
			string values: "on" (enable), "once" (disable after first invocation), "off" (disable)
			*/
			live:false,
			/*
			the matching set of elements (instead of the current selector) to add scrollbar(s), now and in the future
			values: string (selector)
			*/
			liveSelector:null
		},
	
	
	
	
	
	/* 
	----------------------------------------
	VARS, CONSTANTS 
	----------------------------------------
	*/
	
		totalInstances=0, /* plugin instances amount */
		liveTimers={}, /* live option timers */
		/* live option timers removal */
		removeLiveTimers=function(selector){
			if(liveTimers[selector]){
				clearTimeout(liveTimers[selector]);
				functions._delete.call(null,liveTimers[selector]);
			}
		},
		oldIE=(window.attachEvent && !window.addEventListener) ? 1 : 0, /* detect IE < 9 */
		touchActive=false, /* global touch state (for touch and pointer events) */
		
	
	
	
	
	/* 
	----------------------------------------
	METHODS 
	----------------------------------------
	*/
	
		methods={
			
			/* 
			plugin initialization method 
			creates the scrollbar(s), plugin data object and options
			----------------------------------------
			*/
			
			init:function(options){
				
				var options=$.extend(true,{},defaults,options),
					selector=functions._selector.call(this); /* validate selector */
				
				/* 
				if live option is enabled, monitor for elements matching the current selector and 
				apply scrollbar(s) when found (now and in the future) 
				*/
				if(options.live){
					var liveSelector=options.liveSelector || this.selector || defaultSelector, /* live selector(s) */
						$liveSelector=$(liveSelector); /* live selector(s) as jquery object */
					if(options.live==="off"){
						/* 
						disable live if requested 
						usage: $(selector).mCustomScrollbar({live:"off"}); 
						*/
						removeLiveTimers(liveSelector);
						return;
					}
					liveTimers[liveSelector]=setTimeout(function(){
						/* call mCustomScrollbar fn on live selector(s) every half-second */
						$liveSelector.mCustomScrollbar(options);
						if(options.live==="once" && $liveSelector.length){
							/* disable live after first invocation */
							removeLiveTimers(liveSelector);
						}
					},500);
				}else{
					removeLiveTimers(liveSelector);
				}
				
				/* options backward compatibility (for versions < 3.0.0) and normalization */
				options.setWidth=(options.set_width) ? options.set_width : options.setWidth;
				options.setHeight=(options.set_height) ? options.set_height : options.setHeight;
				options.axis=(options.horizontalScroll) ? "x" : functions._findAxis.call(null,options.axis);
				options.scrollInertia=options.scrollInertia<17 ? 17 : options.scrollInertia;
				if(typeof options.mouseWheel!=="object" &&  options.mouseWheel==true){ /* old school mouseWheel option (non-object) */
					options.mouseWheel={enable:true,scrollAmount:"auto",axis:"y",preventDefault:false,deltaFactor:"auto",normalizeDelta:false,invert:false}
				}
				options.mouseWheel.scrollAmount=!options.mouseWheelPixels ? options.mouseWheel.scrollAmount : options.mouseWheelPixels;
				options.mouseWheel.normalizeDelta=!options.advanced.normalizeMouseWheelDelta ? options.mouseWheel.normalizeDelta : options.advanced.normalizeMouseWheelDelta;
				options.scrollButtons.scrollType=functions._findScrollButtonsType.call(null,options.scrollButtons.scrollType); 
				
				functions._theme.call(null,options); /* theme-specific options */
				
				/* plugin constructor */
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if(!$this.data(pluginPfx)){ /* prevent multiple instantiations */
					
						/* store options and create objects in jquery data */
						$this.data(pluginPfx,{
							idx:++totalInstances, /* instance index */
							opt:options, /* options */
							scrollRatio:{y:null,x:null}, /* scrollbar to content ratio */
							overflowed:null, /* overflowed axis */
							bindEvents:false, /* object to check if events are bound */
							tweenRunning:false, /* object to check if tween is running */
							sequential:{}, /* sequential scrolling object */
							langDir:$this.css("direction"), /* detect/store direction (ltr or rtl) */
							cbOffsets:null, /* object to check whether callback offsets always trigger */
							/* 
							object to check how scrolling events where last triggered 
							"internal" (default - triggered by this script), "external" (triggered by other scripts, e.g. via scrollTo method) 
							usage: object.data("mCS").trigger
							*/
							trigger:null
						});
						
						/* HTML data attributes */
						var o=$this.data(pluginPfx).opt,
							htmlDataAxis=$this.data("mcs-axis"),htmlDataSbPos=$this.data("mcs-scrollbar-position"),htmlDataTheme=$this.data("mcs-theme");
						if(htmlDataAxis){o.axis=htmlDataAxis;} /* usage example: data-mcs-axis="y" */
						if(htmlDataSbPos){o.scrollbarPosition=htmlDataSbPos;} /* usage example: data-mcs-scrollbar-position="outside" */
						if(htmlDataTheme){ /* usage example: data-mcs-theme="minimal" */
							o.theme=htmlDataTheme;
							functions._theme.call(null,o); /* theme-specific options */
						}
						
						functions._pluginMarkup.call(this); /* add plugin markup */
						
						methods.update.call(null,$this); /* call the update method */
					
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/* 
			plugin update method 
			updates content and scrollbar(s) values, events and status 
			----------------------------------------
			usage: $(selector).mCustomScrollbar("update");
			*/
			
			update:function(el){
				
				var selector=el || functions._selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
						
						var d=$this.data(pluginPfx),o=d.opt,
							mCSB_container=$("#mCSB_"+d.idx+"_container"),
							mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
						
						if(!mCSB_container.length){return;}
						
						if(d.tweenRunning){functions._stop.call(null,$this);} /* stop any running tweens while updating */
						
						/* if element was disabled or destroyed, remove class(es) */
						if($this.hasClass("mCS_disabled")){$this.removeClass("mCS_disabled");}
						if($this.hasClass("mCS_destroyed")){$this.removeClass("mCS_destroyed");}
						
						functions._maxHeight.call(this); /* detect/set css max-height value */
						
						functions._expandContentHorizontally.call(this); /* expand content horizontally */
						
						if(o.axis!=="y" && !o.advanced.autoExpandHorizontalScroll){
							mCSB_container.css("width",functions._contentWidth(mCSB_container.children()));
						}
						
						d.overflowed=functions._overflowed.call(this); /* determine if scrolling is required */
						
						functions._scrollbarVisibility.call(this); /* show/hide scrollbar(s) */
						
						/* auto-adjust scrollbar dragger length analogous to content */
						if(o.autoDraggerLength){functions._setDraggerLength.call(this);}
						
						functions._scrollRatio.call(this); /* calculate and store scrollbar to content ratio */
						
						functions._bindEvents.call(this); /* bind scrollbar events */
						
						/* reset scrolling position and/or events */
						var to=[Math.abs(mCSB_container[0].offsetTop),Math.abs(mCSB_container[0].offsetLeft)];
						if(o.axis!=="x"){ /* y/yx axis */
							if(!d.overflowed[0]){ /* y scrolling is not required */
								functions._resetContentPosition.call(this); /* reset content position */
								if(o.axis==="y"){
									functions._unbindEvents.call(this);
								}else if(o.axis==="yx" && d.overflowed[1]){
									functions._scrollTo.call(this,$this,to[1].toString(),{dir:"x",dur:0,overwrite:"none"});
								}
							}else if(mCSB_dragger[0].height()>mCSB_dragger[0].parent().height()){
								functions._resetContentPosition.call(this); /* reset content position */
							}else{ /* y scrolling is required */
								functions._scrollTo.call(this,$this,to[0].toString(),{dir:"y",dur:0,overwrite:"none"});
							}
						}
						if(o.axis!=="y"){ /* x/yx axis */
							if(!d.overflowed[1]){ /* x scrolling is not required */
								functions._resetContentPosition.call(this); /* reset content position */
								if(o.axis==="x"){
									functions._unbindEvents.call(this);
								}else if(o.axis==="yx" && d.overflowed[0]){
									functions._scrollTo.call(this,$this,to[0].toString(),{dir:"y",dur:0,overwrite:"none"});
								}
							}else if(mCSB_dragger[1].width()>mCSB_dragger[1].parent().width()){
								functions._resetContentPosition.call(this); /* reset content position */
							}else{ /* x scrolling is required */
								functions._scrollTo.call(this,$this,to[1].toString(),{dir:"x",dur:0,overwrite:"none"});
							}
						}
						
						functions._autoUpdate.call(this); /* initialize automatic updating (for dynamic content, fluid layouts etc.) */
						
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/* 
			plugin scrollTo method 
			triggers a scrolling event to a specific value
			----------------------------------------
			usage: $(selector).mCustomScrollbar("scrollTo",value,options);
			*/
		
			scrollTo:function(val,options){
				
				/* prevent silly things like $(selector).mCustomScrollbar("scrollTo",undefined); */
				if(typeof val=="undefined" || val==null){return;}
				
				var selector=functions._selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
					
						var d=$this.data(pluginPfx),o=d.opt,
							/* method default options */
							methodDefaults={
								trigger:"external", /* method is by default triggered externally (e.g. from other scripts) */
								scrollInertia:o.scrollInertia, /* scrolling inertia (animation duration) */
								scrollEasing:"mcsEaseInOut", /* animation easing */
								moveDragger:false, /* move dragger instead of content */
								callbacks:true, /* enable/disable callbacks */
								onStart:true,
								onUpdate:true,
								onComplete:true
							},
							methodOptions=$.extend(true,{},methodDefaults,options),
							to=functions._arr.call(this,val),dur=methodOptions.scrollInertia < 17 ? 17 : methodOptions.scrollInertia;
						
						/* translate yx values to actual scroll-to positions */
						to[0]=functions._to.call(this,to[0],"y");
						to[1]=functions._to.call(this,to[1],"x");
						
						/* 
						check if scroll-to value moves the dragger instead of content. 
						Only pixel values apply on dragger (e.g. 100, "100px", "-=100" etc.) 
						*/
						if(methodOptions.moveDragger){
							to[0]*=d.scrollRatio.y;
							to[1]*=d.scrollRatio.x;
						}
						
						methodOptions.dur=dur;
						
						setTimeout(function(){ 
							/* do the scrolling */
							if(to[0]!==null && typeof to[0]!=="undefined" && o.axis!=="x" && d.overflowed[0]){ /* scroll y */
								methodOptions.dir="y";
								methodOptions.overwrite="all";
								functions._scrollTo.call(this,$this,to[0].toString(),methodOptions);
							}
							if(to[1]!==null && typeof to[1]!=="undefined" && o.axis!=="y" && d.overflowed[1]){ /* scroll x */
								methodOptions.dir="x";
								methodOptions.overwrite="none";
								functions._scrollTo.call(this,$this,to[1].toString(),methodOptions);
							}
						},60);
						
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/*
			plugin stop method 
			stops scrolling animation
			----------------------------------------
			usage: $(selector).mCustomScrollbar("stop");
			*/
			stop:function(){
				
				var selector=functions._selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
										
						functions._stop.call(null,$this);
					
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/*
			plugin disable method 
			temporarily disables the scrollbar(s) 
			----------------------------------------
			usage: $(selector).mCustomScrollbar("disable",reset); 
			reset (boolean): resets content position to 0 
			*/
			disable:function(r){
				
				var selector=functions._selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
						
						var d=$this.data(pluginPfx),o=d.opt;
						
						functions._autoUpdate.call(this,"remove"); /* remove automatic updating */
						
						functions._unbindEvents.call(this); /* unbind events */
						
						if(r){functions._resetContentPosition.call(this);} /* reset content position */
						
						functions._scrollbarVisibility.call(this,true); /* show/hide scrollbar(s) */
						
						$this.addClass("mCS_disabled"); /* add disable class */
					
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/*
			plugin destroy method 
			completely removes the scrollbar(s) and returns the element to its original state
			----------------------------------------
			usage: $(selector).mCustomScrollbar("destroy"); 
			*/
			destroy:function(){
				
				var selector=functions._selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
					
						var d=$this.data(pluginPfx),o=d.opt,
							mCustomScrollBox=$("#mCSB_"+d.idx),
							mCSB_container=$("#mCSB_"+d.idx+"_container"),
							scrollbar=$(".mCSB_"+d.idx+"_scrollbar");
					
						if(o.live){removeLiveTimers(selector);} /* remove live timer */
						
						functions._autoUpdate.call(this,"remove"); /* remove automatic updating */
						
						functions._unbindEvents.call(this); /* unbind events */
						
						functions._resetContentPosition.call(this); /* reset content position */
						
						$this.removeData(pluginPfx); /* remove plugin data object */
						
						functions._delete.call(null,this.mcs); /* delete callbacks object */
						
						/* remove plugin markup */
						scrollbar.remove(); /* remove scrollbar(s) first (those can be either inside or outside plugin's inner wrapper) */
						mCustomScrollBox.replaceWith(mCSB_container.contents()); /* replace plugin's inner wrapper with the original content */
						/* remove plugin classes from the element and add destroy class */
						$this.removeClass(pluginNS+" _"+pluginPfx+"_"+d.idx+" mCS-autoHide mCS-dir-rtl mCS_no_scrollbar mCS_disabled").addClass("mCS_destroyed");
					
					}
					
				});
				
			}
			/* ---------------------------------------- */
			
		},
	
	
	
	
		
	/* 
	----------------------------------------
	FUNCTIONS
	----------------------------------------
	*/
	
		functions={
			
			/* validates selector (if selector is invalid or undefined uses the default one) */
			_selector:function(){
				return (typeof $(this)!=="object" || $(this).length<1) ? defaultSelector : this;
			},
			/* -------------------- */
			
			/* changes options according to theme */
			_theme:function(obj){
				var fixedSizeScrollbarThemes=["rounded","rounded-dark","rounded-dots","rounded-dots-dark"],
					nonExpandedScrollbarThemes=["rounded-dots","rounded-dots-dark","3d","3d-dark","3d-thick","3d-thick-dark","inset","inset-dark","inset-2","inset-2-dark","inset-3","inset-3-dark"],
					disabledScrollButtonsThemes=["minimal","minimal-dark"],
					enabledAutoHideScrollbarThemes=["minimal","minimal-dark"],
					scrollbarPositionOutsideThemes=["minimal","minimal-dark"];
				obj.autoDraggerLength=$.inArray(obj.theme,fixedSizeScrollbarThemes) > -1 ? false : obj.autoDraggerLength;
				obj.autoExpandScrollbar=$.inArray(obj.theme,nonExpandedScrollbarThemes) > -1 ? false : obj.autoExpandScrollbar;
				obj.scrollButtons.enable=$.inArray(obj.theme,disabledScrollButtonsThemes) > -1 ? false : obj.scrollButtons.enable;
				obj.autoHideScrollbar=$.inArray(obj.theme,enabledAutoHideScrollbarThemes) > -1 ? true : obj.autoHideScrollbar;
				obj.scrollbarPosition=$.inArray(obj.theme,scrollbarPositionOutsideThemes) > -1 ? "outside" : obj.scrollbarPosition;
			},
			/* -------------------- */
			
			
			/* normalizes axis option to valid values: "y", "x", "yx" */
			_findAxis:function(val){
				return (val==="yx" || val==="xy" || val==="auto") ? "yx" : (val==="x" || val==="horizontal") ? "x" : "y";
			},
			/* -------------------- */
			
			
			/* normalizes scrollButtons.scrollType option to valid values: "stepless", "stepped" */
			_findScrollButtonsType:function(val){
				return (val==="stepped" || val==="pixels" || val==="step" || val==="click") ? "stepped" : "stepless";
			},
			/* -------------------- */
			
			
			/* generates plugin markup */
			_pluginMarkup:function(){
				var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
					expandClass=o.autoExpandScrollbar ? " mCSB_scrollTools_onDrag_expand" : "",
					scrollbar=["<div id='mCSB_"+d.idx+"_scrollbar_vertical' class='mCSB_scrollTools mCSB_"+d.idx+"_scrollbar mCS-"+o.theme+" mCSB_scrollTools_vertical"+expandClass+"'><div class='mCSB_draggerContainer'><div id='mCSB_"+d.idx+"_dragger_vertical' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>","<div id='mCSB_"+d.idx+"_scrollbar_horizontal' class='mCSB_scrollTools mCSB_"+d.idx+"_scrollbar mCS-"+o.theme+" mCSB_scrollTools_horizontal"+expandClass+"'><div class='mCSB_draggerContainer'><div id='mCSB_"+d.idx+"_dragger_horizontal' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"],
					wrapperClass=o.axis==="yx" ? "mCSB_vertical_horizontal" : o.axis==="x" ? "mCSB_horizontal" : "mCSB_vertical",
					scrollbars=o.axis==="yx" ? scrollbar[0]+scrollbar[1] : o.axis==="x" ? scrollbar[1] : scrollbar[0],
					contentWrapper=o.axis==="yx" ? "<div id='mCSB_"+d.idx+"_container_wrapper' class='mCSB_container_wrapper' />" : "",
					autoHideClass=o.autoHideScrollbar ? " mCS-autoHide" : "",
					scrollbarDirClass=(o.axis!=="x" && d.langDir==="rtl") ? " mCS-dir-rtl" : "";
				if(o.setWidth){$this.css("width",o.setWidth);} /* set element width */
				if(o.setHeight){$this.css("height",o.setHeight);} /* set element height */
				o.setLeft=(o.axis!=="y" && d.langDir==="rtl") ? "989999px" : o.setLeft; /* adjust left position for rtl direction */
				$this.addClass(pluginNS+" _"+pluginPfx+"_"+d.idx+autoHideClass+scrollbarDirClass).wrapInner("<div id='mCSB_"+d.idx+"' class='mCustomScrollBox mCS-"+o.theme+" "+wrapperClass+"'><div id='mCSB_"+d.idx+"_container' class='mCSB_container' style='position:relative; top:"+o.setTop+"; left:"+o.setLeft+";' dir="+d.langDir+" /></div>");
				var mCustomScrollBox=$("#mCSB_"+d.idx),
					mCSB_container=$("#mCSB_"+d.idx+"_container");
				if(o.axis!=="y" && !o.advanced.autoExpandHorizontalScroll){
					mCSB_container.css("width",functions._contentWidth(mCSB_container.children()));
				}
				if(o.scrollbarPosition==="outside"){
					if($this.css("position")==="static"){ /* requires elements with non-static position */
						$this.css("position","relative");
					}
					$this.css("overflow","visible");
					mCustomScrollBox.addClass("mCSB_outside").after(scrollbars);
				}else{
					mCustomScrollBox.addClass("mCSB_inside").append(scrollbars);
					mCSB_container.wrap(contentWrapper);
				}
				functions._scrollButtons.call(this); /* add scrollbar buttons */
				/* minimum dragger length */
				var mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
				mCSB_dragger[0].css("min-height",mCSB_dragger[0].height());
				mCSB_dragger[1].css("min-width",mCSB_dragger[1].width());
			},
			/* -------------------- */
			
			
			/* calculates content width */
			_contentWidth:function(el){
				return Math.max.apply(Math,el.map(function(){return $(this).outerWidth(true);}).get());
			},
			/* -------------------- */
			
			
			/* expands content horizontally */
			_expandContentHorizontally:function(){
				var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
					mCSB_container=$("#mCSB_"+d.idx+"_container");
				if(o.advanced.autoExpandHorizontalScroll && o.axis!=="y"){
					/* 
					wrap content with an infinite width div and set its position to absolute and width to auto. 
					Setting width to auto before calculating the actual width is important! 
					We must let the browser set the width as browser zoom values are impossible to calculate.
					*/
					mCSB_container.css({"position":"absolute","width":"auto"})
						.wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />")
						.css({ /* set actual width, original position and un-wrap */
							/* 
							get the exact width (with decimals) and then round-up. 
							Using jquery outerWidth() will round the width value which will mess up with inner elements that have non-integer width
							*/
							"width":(Math.ceil(mCSB_container[0].getBoundingClientRect().right+0.4)-Math.floor(mCSB_container[0].getBoundingClientRect().left)),
							"position":"relative"
						}).unwrap();
				}
			},
			/* -------------------- */
			
			
			/* adds scrollbar buttons */
			_scrollButtons:function(){
				var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
					mCSB_scrollTools=$(".mCSB_"+d.idx+"_scrollbar:first"),
					btnHTML=[
						"<a href='#' class='mCSB_buttonUp' oncontextmenu='return false;' />","<a href='#' class='mCSB_buttonDown' oncontextmenu='return false;' />",
						"<a href='#' class='mCSB_buttonLeft' oncontextmenu='return false;' />","<a href='#' class='mCSB_buttonRight' oncontextmenu='return false;' />"
					],
					btn=[(o.axis==="x" ? btnHTML[2] : btnHTML[0]),(o.axis==="x" ? btnHTML[3] : btnHTML[1]),btnHTML[2],btnHTML[3]];
				if(o.scrollButtons.enable){
					mCSB_scrollTools.prepend(btn[0]).append(btn[1]).next(".mCSB_scrollTools").prepend(btn[2]).append(btn[3]);
				}
			},
			/* -------------------- */
			
			
			/* detects/sets css max-height value */
			_maxHeight:function(){
				var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
					mCustomScrollBox=$("#mCSB_"+d.idx),
					mh=$this.css("max-height"),pct=mh.indexOf("%")!==-1,
					bs=$this.css("box-sizing");
				if(mh!=="none"){
					var val=pct ? $this.parent().height()*parseInt(mh)/100 : parseInt(mh);
					/* if element's css box-sizing is "border-box", subtract any paddings and/or borders from max-height value */
					if(bs==="border-box"){val-=(($this.innerHeight()-$this.height())+($this.outerHeight()-$this.innerHeight()));}
					mCustomScrollBox.css("max-height",Math.round(val));
				}
			},
			/* -------------------- */
			
			
			/* auto-adjusts scrollbar dragger length */
			_setDraggerLength:function(){
				var $this=$(this),d=$this.data(pluginPfx),
					mCustomScrollBox=$("#mCSB_"+d.idx),
					mCSB_container=$("#mCSB_"+d.idx+"_container"),
					mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
					ratio=[mCustomScrollBox.height()/mCSB_container.outerHeight(false),mCustomScrollBox.width()/mCSB_container.outerWidth(false)],
					l=[
						parseInt(mCSB_dragger[0].css("min-height")),Math.round(ratio[0]*mCSB_dragger[0].parent().height()),
						parseInt(mCSB_dragger[1].css("min-width")),Math.round(ratio[1]*mCSB_dragger[1].parent().width())
					],
					h=oldIE && (l[1]<l[0]) ? l[0] : l[1],w=oldIE && (l[3]<l[2]) ? l[2] : l[3];
				mCSB_dragger[0].css({
					"height":h,"max-height":(mCSB_dragger[0].parent().height()-10)
				}).find(".mCSB_dragger_bar").css({"line-height":l[0]+"px"});
				mCSB_dragger[1].css({
					"width":w,"max-width":(mCSB_dragger[1].parent().width()-10)
				});
			},
			/* -------------------- */
			
			
			/* calculates scrollbar to content ratio */
			_scrollRatio:function(){
				var $this=$(this),d=$this.data(pluginPfx),
					mCustomScrollBox=$("#mCSB_"+d.idx),
					mCSB_container=$("#mCSB_"+d.idx+"_container"),
					mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
					scrollAmount=[mCSB_container.outerHeight(false)-mCustomScrollBox.height(),mCSB_container.outerWidth(false)-mCustomScrollBox.width()],
					ratio=[
						scrollAmount[0]/(mCSB_dragger[0].parent().height()-mCSB_dragger[0].height()),
						scrollAmount[1]/(mCSB_dragger[1].parent().width()-mCSB_dragger[1].width())
					];
				d.scrollRatio={y:ratio[0],x:ratio[1]};
			},
			/* -------------------- */
			
			
			/* toggles scrolling classes */
			_onDragClasses:function(el,action,xpnd){
				var expandClass=xpnd ? "mCSB_dragger_onDrag_expanded" : "",classes=["mCSB_dragger_onDrag","mCSB_scrollTools_onDrag"],
					scrollbar=el.closest(".mCSB_scrollTools");
				if(action==="active"){
					el.toggleClass(classes[0]+" "+expandClass); scrollbar.toggleClass(classes[1]); 
					el[0]._draggable=el[0]._draggable ? 0 : 1;
				}else{
					if(!el[0]._draggable){
						if(action==="hide"){
							el.removeClass(classes[0]); scrollbar.removeClass(classes[1]);
						}else{
							el.addClass(classes[0]); scrollbar.addClass(classes[1]);
						}
					}
				}
			},
			/* -------------------- */
			
			
			/* checks if content overflows its container to determine if scrolling is required */
			_overflowed:function(){
				var $this=$(this),d=$this.data(pluginPfx),
					mCustomScrollBox=$("#mCSB_"+d.idx),
					mCSB_container=$("#mCSB_"+d.idx+"_container"),
					contentHeight=d.overflowed==null ? mCSB_container.height() : mCSB_container.outerHeight(false),
					contentWidth=d.overflowed==null ? mCSB_container.width() : mCSB_container.outerWidth(false);
				return [contentHeight>mCustomScrollBox.height(),contentWidth>mCustomScrollBox.width()];
			},
			/* -------------------- */
			
			
			/* resets content position to 0 */
			_resetContentPosition:function(){
				var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
					mCustomScrollBox=$("#mCSB_"+d.idx),
					mCSB_container=$("#mCSB_"+d.idx+"_container"),
					mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
				functions._stop($this); /* stop any current scrolling before resetting */
				if((o.axis!=="x" && !d.overflowed[0]) || (o.axis==="y" && d.overflowed[0])){mCSB_dragger[0].add(mCSB_container).css("top",0);} /* reset y */
				if((o.axis!=="y" && !d.overflowed[1]) || (o.axis==="x" && d.overflowed[1])){ /* reset x */
					var cx=dx=0;
					if(d.langDir==="rtl"){ /* adjust left position for rtl direction */
						cx=mCustomScrollBox.width()-mCSB_container.outerWidth(false);
						dx=Math.abs(cx/d.scrollRatio.x);
					}
					mCSB_container.css("left",cx);
					mCSB_dragger[1].css("left",dx);
				}
			},
			/* -------------------- */
			
			
			/* binds scrollbar events */
			_bindEvents:function(){
				var $this=$(this),d=$this.data(pluginPfx),o=d.opt;
				if(!d.bindEvents){ /* check if events are already bound */
					functions._draggable.call(this);
					if(o.contentTouchScroll){functions._contentDraggable.call(this);}
					if(o.mouseWheel.enable){ /* bind mousewheel fn when plugin is available */
						function _mwt(){
							mousewheelTimeout=setTimeout(function(){
								if(!$.event.special.mousewheel){
									_mwt();
								}else{
									clearTimeout(mousewheelTimeout);
									functions._mousewheel.call($this[0]);
								}
							},1000);
						}
						var mousewheelTimeout;
						_mwt();
					}
					functions._draggerRail.call(this);
					functions._wrapperScroll.call(this);
					if(o.advanced.autoScrollOnFocus){functions._focus.call(this);}
					if(o.scrollButtons.enable){functions._buttons.call(this);}
					if(o.keyboard.enable){functions._keyboard.call(this);}
					d.bindEvents=true;
				}
			},
			/* -------------------- */
			
			
			/* unbinds scrollbar events */
			_unbindEvents:function(){
				var $this=$(this),d=$this.data(pluginPfx),
					namespace=pluginPfx+"_"+d.idx,
					sb=".mCSB_"+d.idx+"_scrollbar",
					sel=$("#mCSB_"+d.idx+",#mCSB_"+d.idx+"_container,#mCSB_"+d.idx+"_container_wrapper,"+sb+" .mCSB_draggerContainer,#mCSB_"+d.idx+"_dragger_vertical,#mCSB_"+d.idx+"_dragger_horizontal,"+sb+">a"),
					mCSB_container=$("#mCSB_"+d.idx+"_container");
				if(d.bindEvents){ /* check if events are bound */
					/* unbind namespaced events from document/selectors */
					$(document).unbind("."+namespace);
					sel.each(function(){
						$(this).unbind("."+namespace);
					});
					/* clear and delete timeouts/objects */
					clearTimeout($this[0]._focusTimeout); functions._delete.call(null,$this[0]._focusTimeout);
					clearTimeout(d.sequential.step); functions._delete.call(null,d.sequential.step);
					clearTimeout(mCSB_container[0].onCompleteTimeout); functions._delete.call(null,mCSB_container[0].onCompleteTimeout);
					d.bindEvents=false;
				}
			},
			/* -------------------- */
			
			
			/* toggles scrollbar visibility */
			_scrollbarVisibility:function(disabled){
				var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
					contentWrapper=$("#mCSB_"+d.idx+"_container_wrapper"),
					content=contentWrapper.length ? contentWrapper : $("#mCSB_"+d.idx+"_container"),
					scrollbar=[$("#mCSB_"+d.idx+"_scrollbar_vertical"),$("#mCSB_"+d.idx+"_scrollbar_horizontal")],
					mCSB_dragger=[scrollbar[0].find(".mCSB_dragger"),scrollbar[1].find(".mCSB_dragger")];
				if(o.axis!=="x"){
					if(d.overflowed[0] && !disabled){
						scrollbar[0].add(mCSB_dragger[0]).add(scrollbar[0].children("a")).css("display","block");
						content.removeClass("mCS_no_scrollbar_y mCS_y_hidden");
					}else{
						if(o.alwaysShowScrollbar){
							if(o.alwaysShowScrollbar!==2){mCSB_dragger[0].add(scrollbar[0].children("a")).css("display","none");}
							content.removeClass("mCS_y_hidden");
						}else{
							scrollbar[0].css("display","none");
							content.addClass("mCS_y_hidden");
						}
						content.addClass("mCS_no_scrollbar_y");
					}
				}
				if(o.axis!=="y"){
					if(d.overflowed[1] && !disabled){
						scrollbar[1].add(mCSB_dragger[1]).add(scrollbar[1].children("a")).css("display","block");
						content.removeClass("mCS_no_scrollbar_x mCS_x_hidden");
					}else{
						if(o.alwaysShowScrollbar){
							if(o.alwaysShowScrollbar!==2){mCSB_dragger[1].add(scrollbar[1].children("a")).css("display","none");}
							content.removeClass("mCS_x_hidden");
						}else{
							scrollbar[1].css("display","none");
							content.addClass("mCS_x_hidden");
						}
						content.addClass("mCS_no_scrollbar_x");
					}
				}
				if(!d.overflowed[0] && !d.overflowed[1]){
					$this.addClass("mCS_no_scrollbar");
				}else{
					$this.removeClass("mCS_no_scrollbar");
				}
			},
			/* -------------------- */
			
			
			/* returns input coordinates of pointer, touch and mouse events (relative to document) */
			_coordinates:function(e){
				var t=e.type;
				switch(t){
					case "pointerdown": case "MSPointerDown": case "pointermove": case "MSPointerMove": case "pointerup": case "MSPointerUp":
						return [e.originalEvent.pageY,e.originalEvent.pageX];
						break;
					case "touchstart": case "touchmove": case "touchend":
						var touch=e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
						return [touch.pageY,touch.pageX];
						break;
					default:
						return [e.pageY,e.pageX];
				}
			},
			/* -------------------- */
			
			
			/* 
			SCROLLBAR DRAG EVENTS
			scrolls content via scrollbar dragging 
			*/
			_draggable:function(){
				var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
					namespace=pluginPfx+"_"+d.idx,
					draggerId=["mCSB_"+d.idx+"_dragger_vertical","mCSB_"+d.idx+"_dragger_horizontal"],
					mCSB_container=$("#mCSB_"+d.idx+"_container"),
					mCSB_dragger=$("#"+draggerId[0]+",#"+draggerId[1]),
					draggable,dragY,dragX;
				mCSB_dragger.bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace,function(e){
					e.stopImmediatePropagation();
					e.preventDefault();
					if(!functions._mouseBtnLeft(e)){return;} /* left mouse button only */
					touchActive=true;
					if(oldIE){document.onselectstart=function(){return false;}} /* disable text selection for IE < 9 */
					_iframe(false); /* enable scrollbar dragging over iframes by disabling their events */
					functions._stop($this);
					draggable=$(this);
					var offset=draggable.offset(),y=functions._coordinates(e)[0]-offset.top,x=functions._coordinates(e)[1]-offset.left,
						h=draggable.height()+offset.top,w=draggable.width()+offset.left;
					if(y<h && y>0 && x<w && x>0){
						dragY=y; 
						dragX=x;
					}
					functions._onDragClasses(draggable,"active",o.autoExpandScrollbar); 
				}).bind("touchmove."+namespace,function(e){
					e.stopImmediatePropagation();
					e.preventDefault();
					var offset=draggable.offset(),y=functions._coordinates(e)[0]-offset.top,x=functions._coordinates(e)[1]-offset.left;
					_drag(dragY,dragX,y,x);
				});
				$(document).bind("mousemove."+namespace+" pointermove."+namespace+" MSPointerMove."+namespace,function(e){
					if(draggable){
						var offset=draggable.offset(),y=functions._coordinates(e)[0]-offset.top,x=functions._coordinates(e)[1]-offset.left;
						if(dragY===y){return;} /* has it really moved? */
						_drag(dragY,dragX,y,x);
					}
				}).add(mCSB_dragger).bind("mouseup."+namespace+" touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace,function(e){
					if(draggable){
						functions._onDragClasses(draggable,"active",o.autoExpandScrollbar); 
						draggable=null;
					}
					touchActive=false;
					if(oldIE){document.onselectstart=null;} /* enable text selection for IE < 9 */
					_iframe(true); /* enable iframes events */
				});
				function _iframe(evt){
					var el=mCSB_container.find("iframe");
					if(!el.length){return;} /* check if content contains iframes */
					var val=!evt ? "none" : "auto";
					el.css("pointer-events",val); /* for IE11, iframe's display property should not be "block" */
				}
				function _drag(dragY,dragX,y,x){
					mCSB_container[0].idleTimer=o.scrollInertia<233 ? 250 : 0;
					if(draggable.attr("id")===draggerId[1]){
						var dir="x",to=((draggable[0].offsetLeft-dragX)+x)*d.scrollRatio.x;
					}else{
						var dir="y",to=((draggable[0].offsetTop-dragY)+y)*d.scrollRatio.y;
					}
					functions._scrollTo($this,to.toString(),{dir:dir,drag:true});
				}
			},
			/* -------------------- */
			
			
			/* 
			TOUCH SWIPE EVENTS
			scrolls content via touch swipe 
			Emulates the native touch-swipe scrolling with momentum found in iOS, Android and WP devices 
			*/
			_contentDraggable:function(){
				var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
					namespace=pluginPfx+"_"+d.idx,
					mCustomScrollBox=$("#mCSB_"+d.idx),
					mCSB_container=$("#mCSB_"+d.idx+"_container"),
					mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
					dragY,dragX,touchStartY,touchStartX,touchMoveY=[],touchMoveX=[],startTime,runningTime,endTime,distance,speed,amount,
					durA=0,durB,overwrite=o.axis==="yx" ? "none" : "all";
				mCSB_container.bind("touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace,function(e){
					if(!functions._pointerTouch(e) || touchActive){return;}
					var offset=mCSB_container.offset();
					dragY=functions._coordinates(e)[0]-offset.top;
					dragX=functions._coordinates(e)[1]-offset.left;
				}).bind("touchmove."+namespace+" pointermove."+namespace+" MSPointerMove."+namespace,function(e){
					if(!functions._pointerTouch(e) || touchActive){return;}
					e.stopImmediatePropagation();
					runningTime=functions._getTime();
					var offset=mCustomScrollBox.offset(),y=functions._coordinates(e)[0]-offset.top,x=functions._coordinates(e)[1]-offset.left,
						easing="mcsLinearOut";
					touchMoveY.push(y);
					touchMoveX.push(x);
					if(d.overflowed[0]){
						var limit=mCSB_dragger[0].parent().height()-mCSB_dragger[0].height(),
							prevent=((dragY-y)>0 && (y-dragY)>-(limit*d.scrollRatio.y));
					}
					if(d.overflowed[1]){
						var limitX=mCSB_dragger[1].parent().width()-mCSB_dragger[1].width(),
							preventX=((dragX-x)>0 && (x-dragX)>-(limitX*d.scrollRatio.x));
					}
					if(prevent || preventX){e.preventDefault();} /* prevent native document scrolling */
					amount=o.axis==="yx" ? [(dragY-y),(dragX-x)] : o.axis==="x" ? [null,(dragX-x)] : [(dragY-y),null];
					mCSB_container[0].idleTimer=250;
					if(d.overflowed[0]){_drag(amount[0],durA,easing,"y","all",true);}
					if(d.overflowed[1]){_drag(amount[1],durA,easing,"x",overwrite,true);}
				});
				mCustomScrollBox.bind("touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace,function(e){
					if(!functions._pointerTouch(e) || touchActive){return;}
					e.stopImmediatePropagation();
					functions._stop($this);
					startTime=functions._getTime();
					var offset=mCustomScrollBox.offset();
					touchStartY=functions._coordinates(e)[0]-offset.top;
					touchStartX=functions._coordinates(e)[1]-offset.left;
					touchMoveY=[]; touchMoveX=[];
				}).bind("touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace,function(e){
					if(!functions._pointerTouch(e) || touchActive){return;}
					e.stopImmediatePropagation();
					endTime=functions._getTime();
					var offset=mCustomScrollBox.offset(),y=functions._coordinates(e)[0]-offset.top,x=functions._coordinates(e)[1]-offset.left;
					if((endTime-runningTime)>30){return;}
					speed=1000/(endTime-startTime);
					var easing="mcsEaseOut",slow=speed<2.5,
						diff=slow ? [touchMoveY[touchMoveY.length-2],touchMoveX[touchMoveX.length-2]] : [0,0];
					distance=slow ? [(y-diff[0]),(x-diff[1])] : [y-touchStartY,x-touchStartX];
					var absDistance=[Math.abs(distance[0]),Math.abs(distance[1])];
					speed=slow ? [Math.abs(distance[0]/4),Math.abs(distance[1]/4)] : [speed,speed];
					var a=[
						Math.abs(mCSB_container[0].offsetTop)-(distance[0]*_m((absDistance[0]/speed[0]),speed[0])),
						Math.abs(mCSB_container[0].offsetLeft)-(distance[1]*_m((absDistance[1]/speed[1]),speed[1]))
					];
					amount=o.axis==="yx" ? [a[0],a[1]] : o.axis==="x" ? [null,a[1]] : [a[0],null];
					durB=[(absDistance[0]*4)+o.scrollInertia,(absDistance[1]*4)+o.scrollInertia];
					var md=parseInt(o.contentTouchScroll) || 0; /* absolute minimum distance required */
					amount[0]=absDistance[0]>md ? amount[0] : 0;
					amount[1]=absDistance[1]>md ? amount[1] : 0;
					if(d.overflowed[0]){_drag(amount[0],durB[0],easing,"y",overwrite,false);}
					if(d.overflowed[1]){_drag(amount[1],durB[1],easing,"x",overwrite,false);}
				});
				function _m(ds,s){
					var r=[s*1.5,s*2,s/1.5,s/2];
					if(ds>90){
						return s>4 ? r[0] : r[3];
					}else if(ds>60){
						return s>3 ? r[3] : r[2];
					}else if(ds>30){
						return s>8 ? r[1] : s>6 ? r[0] : s>4 ? s : r[2];
					}else{
						return s>8 ? s : r[3];
					}
				}
				function _drag(amount,dur,easing,dir,overwrite,drag){
					if(!amount){return;}
					functions._scrollTo($this,amount.toString(),{dur:dur,scrollEasing:easing,dir:dir,overwrite:overwrite,drag:drag});
				}
			},
			/* -------------------- */
			
			
			/* 
			MOUSE WHEEL EVENT
			scrolls content via mouse-wheel 
			via mouse-wheel plugin (https://github.com/brandonaaron/jquery-mousewheel)
			*/
			_mousewheel:function(){
				var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
					namespace=pluginPfx+"_"+d.idx,
					mCustomScrollBox=$("#mCSB_"+d.idx),
					mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
				mCustomScrollBox.bind("mousewheel."+namespace,function(e,delta){
					functions._stop($this);
					if(functions._disableMousewheel($this,e.target)){return;} /* disables mouse-wheel when hovering specific elements */
					var deltaFactor=o.mouseWheel.deltaFactor!=="auto" ? parseInt(o.mouseWheel.deltaFactor) : (oldIE && e.deltaFactor<100) ? 100 : e.deltaFactor<40 ? 40 : e.deltaFactor || 100;
					if(o.axis==="x" || o.mouseWheel.axis==="x"){
						var dir="x",
							px=[Math.round(deltaFactor*d.scrollRatio.x),parseInt(o.mouseWheel.scrollAmount)],
							amount=o.mouseWheel.scrollAmount!=="auto" ? px[1] : px[0]>=mCustomScrollBox.width() ? mCustomScrollBox.width()*0.9 : px[0],
							contentPos=Math.abs($("#mCSB_"+d.idx+"_container")[0].offsetLeft),
							draggerPos=mCSB_dragger[1][0].offsetLeft,
							limit=mCSB_dragger[1].parent().width()-mCSB_dragger[1].width(),
							dlt=e.deltaX || e.deltaY || delta;
					}else{
						var dir="y",
							px=[Math.round(deltaFactor*d.scrollRatio.y),parseInt(o.mouseWheel.scrollAmount)],
							amount=o.mouseWheel.scrollAmount!=="auto" ? px[1] : px[0]>=mCustomScrollBox.height() ? mCustomScrollBox.height()*0.9 : px[0],
							contentPos=Math.abs($("#mCSB_"+d.idx+"_container")[0].offsetTop),
							draggerPos=mCSB_dragger[0][0].offsetTop,
							limit=mCSB_dragger[0].parent().height()-mCSB_dragger[0].height(),
							dlt=e.deltaY || delta;
					}
					if((dir==="y" && !d.overflowed[0]) || (dir==="x" && !d.overflowed[1])){return;}
					if(o.mouseWheel.invert){dlt=-dlt;}
					if(o.mouseWheel.normalizeDelta){dlt=dlt<0 ? -1 : 1;}
					if((dlt>0 && draggerPos!==0) || (dlt<0 && draggerPos!==limit) || o.mouseWheel.preventDefault){
						e.stopImmediatePropagation();
						e.preventDefault();
					}
					functions._scrollTo($this,(contentPos-(dlt*amount)).toString(),{dir:dir});
				});
			},
			/* -------------------- */
			
			
			/* disables mouse-wheel when hovering specific elements like select, datalist etc. */
			_disableMousewheel:function(el,target){
				var tag=target.nodeName.toLowerCase(),
					tags=el.data(pluginPfx).opt.mouseWheel.disableOver,
					/* elements that require focus */
					focusTags=["select","textarea"];
				return $.inArray(tag,tags) > -1 && !($.inArray(tag,focusTags) > -1 && !$(target).is(":focus"));
			},
			/* -------------------- */
			
			
			/* 
			DRAGGER RAIL CLICK EVENT
			scrolls content via dragger rail 
			*/
			_draggerRail:function(){
				var $this=$(this),d=$this.data(pluginPfx),
					namespace=pluginPfx+"_"+d.idx,
					mCSB_container=$("#mCSB_"+d.idx+"_container"),
					wrapper=mCSB_container.parent(),
					mCSB_draggerContainer=$(".mCSB_"+d.idx+"_scrollbar .mCSB_draggerContainer");
				mCSB_draggerContainer.bind("touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace,function(e){
					touchActive=true;
				}).bind("touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace,function(e){
					touchActive=false;
				}).bind("click."+namespace,function(e){
					if($(e.target).hasClass("mCSB_draggerContainer") || $(e.target).hasClass("mCSB_draggerRail")){
						functions._stop($this);
						var el=$(this),mCSB_dragger=el.find(".mCSB_dragger");
						if(el.parent(".mCSB_scrollTools_horizontal").length>0){
							if(!d.overflowed[1]){return;}
							var dir="x",
								clickDir=e.pageX>mCSB_dragger.offset().left ? -1 : 1,
								to=Math.abs(mCSB_container[0].offsetLeft)-(clickDir*(wrapper.width()*0.9));
						}else{
							if(!d.overflowed[0]){return;}
							var dir="y",
								clickDir=e.pageY>mCSB_dragger.offset().top ? -1 : 1,
								to=Math.abs(mCSB_container[0].offsetTop)-(clickDir*(wrapper.height()*0.9));
						}
						functions._scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
					}
				});
			},
			/* -------------------- */
			
			
			/* 
			FOCUS EVENT
			scrolls content via element focus (e.g. clicking an input, pressing TAB key etc.)
			*/
			_focus:function(){
				var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
					namespace=pluginPfx+"_"+d.idx,
					mCSB_container=$("#mCSB_"+d.idx+"_container"),
					wrapper=mCSB_container.parent();
				mCSB_container.bind("focusin."+namespace,function(e){
					var el=$(document.activeElement),
						nested=mCSB_container.find(".mCustomScrollBox").length,
						dur=0;
					if(!el.is(o.advanced.autoScrollOnFocus)){return;}
					functions._stop($this);
					clearTimeout($this[0]._focusTimeout);
					$this[0]._focusTimer=nested ? (dur+17)*nested : 0;
					$this[0]._focusTimeout=setTimeout(function(){
						var	to=[el.offset().top-mCSB_container.offset().top,el.offset().left-mCSB_container.offset().left],
							contentPos=[mCSB_container[0].offsetTop,mCSB_container[0].offsetLeft],
							isVisible=[
								(contentPos[0]+to[0]>=0 && contentPos[0]+to[0]<wrapper.height()-el.outerHeight(false)),
								(contentPos[1]+to[1]>=0 && contentPos[0]+to[1]<wrapper.width()-el.outerWidth(false))
							],
							overwrite=(o.axis==="yx" && !isVisible[0] && !isVisible[1]) ? "none" : "all";
						if(o.axis!=="x" && !isVisible[0]){
							functions._scrollTo($this,to[0].toString(),{dir:"y",scrollEasing:"mcsEaseInOut",overwrite:overwrite,dur:dur});
						}
						if(o.axis!=="y" && !isVisible[1]){
							functions._scrollTo($this,to[1].toString(),{dir:"x",scrollEasing:"mcsEaseInOut",overwrite:overwrite,dur:dur});
						}
					},$this[0]._focusTimer);
				});
			},
			/* -------------------- */
			
			
			/* sets content wrapper scrollTop/scrollLeft always to 0 */
			_wrapperScroll:function(){
				var $this=$(this),d=$this.data(pluginPfx),
					namespace=pluginPfx+"_"+d.idx,
					wrapper=$("#mCSB_"+d.idx+"_container").parent();
				wrapper.bind("scroll."+namespace,function(e){
					wrapper.scrollTop(0).scrollLeft(0);
				});
			},
			/* -------------------- */
			
			
			/* 
			BUTTONS EVENTS
			scrolls content via up, down, left and right buttons 
			*/
			_buttons:function(){
				var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
					namespace=pluginPfx+"_"+d.idx,
					mCSB_container=$("#mCSB_"+d.idx+"_container"),
					sel=".mCSB_"+d.idx+"_scrollbar",
					btn=$(sel+">a");
				btn.bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace+" mouseup."+namespace+" touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace+" mouseout."+namespace+" pointerout."+namespace+" MSPointerOut."+namespace+" click."+namespace,function(e){
					e.preventDefault();
					if(!functions._mouseBtnLeft(e)){return;} /* left mouse button only */
					var btnClass=$(this).attr("class");
					seq.type=o.scrollButtons.scrollType;
					switch(e.type){
						case "mousedown": case "touchstart": case "pointerdown": case "MSPointerDown":
							if(seq.type==="stepped"){return;}
							touchActive=true;
							d.tweenRunning=false;
							_seq("on",btnClass);
							break;
						case "mouseup": case "touchend": case "pointerup": case "MSPointerUp":
						case "mouseout": case "pointerout": case "MSPointerOut":
							if(seq.type==="stepped"){return;}
							touchActive=false;
							if(seq.dir){_seq("off",btnClass);}
							break;
						case "click":
							if(seq.type!=="stepped" || d.tweenRunning){return;}
							_seq("on",btnClass);
							break;
					}
					function _seq(a,c){
						seq.scrollAmount=o.snapAmount || o.scrollButtons.scrollAmount;
						functions._sequentialScroll.call(this,$this,a,c);
					}
				});
			},
			/* -------------------- */
			
			
			/* 
			KEYBOARD EVENTS
			scrolls content via keyboard 
			Keys: up arrow, down arrow, left arrow, right arrow, PgUp, PgDn, Home, End
			*/
			_keyboard:function(){
				var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
					namespace=pluginPfx+"_"+d.idx,
					mCustomScrollBox=$("#mCSB_"+d.idx),
					mCSB_container=$("#mCSB_"+d.idx+"_container"),
					wrapper=mCSB_container.parent(),
					editables="input,textarea,select,datalist,keygen,[contenteditable='true']";
				mCustomScrollBox.attr("tabindex","0").bind("blur."+namespace+" keydown."+namespace+" keyup."+namespace,function(e){
					switch(e.type){
						case "blur":
							if(d.tweenRunning && seq.dir){_seq("off",null);}
							break;
						case "keydown": case "keyup":
							var code=e.keyCode ? e.keyCode : e.which,action="on";
							if((o.axis!=="x" && (code===38 || code===40)) || (o.axis!=="y" && (code===37 || code===39))){
								/* up (38), down (40), left (37), right (39) arrows */
								if(((code===38 || code===40) && !d.overflowed[0]) || ((code===37 || code===39) && !d.overflowed[1])){return;}
								if(e.type==="keyup"){action="off";}
								if(!$(document.activeElement).is(editables)){
									e.preventDefault();
									e.stopImmediatePropagation();
									_seq(action,code);
								}
							}else if(code===33 || code===34){
								/* PgUp (33), PgDn (34) */
								if(d.overflowed[0] || d.overflowed[1]){
									e.preventDefault();
									e.stopImmediatePropagation();
								}
								if(e.type==="keyup"){
									functions._stop($this);
									var keyboardDir=code===34 ? -1 : 1;
									if(o.axis==="x" || (o.axis==="yx" && d.overflowed[1] && !d.overflowed[0])){
										var dir="x",to=Math.abs(mCSB_container[0].offsetLeft)-(keyboardDir*(wrapper.width()*0.9));
									}else{
										var dir="y",to=Math.abs(mCSB_container[0].offsetTop)-(keyboardDir*(wrapper.height()*0.9));
									}
									functions._scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
								}
							}else if(code===35 || code===36){
								/* End (35), Home (36) */
								if(!$(document.activeElement).is(editables)){
									if(d.overflowed[0] || d.overflowed[1]){
										e.preventDefault();
										e.stopImmediatePropagation();
									}
									if(e.type==="keyup"){
										if(o.axis==="x" || (o.axis==="yx" && d.overflowed[1] && !d.overflowed[0])){
											var dir="x",to=code===35 ? Math.abs(wrapper.width()-mCSB_container.outerWidth(false)) : 0;
										}else{
											var dir="y",to=code===35 ? Math.abs(wrapper.height()-mCSB_container.outerHeight(false)) : 0;
										}
										functions._scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
									}
								}
							}
							break;
					}
					function _seq(a,c){
						seq.type=o.keyboard.scrollType;
						seq.scrollAmount=o.snapAmount || o.keyboard.scrollAmount;
						if(seq.type==="stepped" && d.tweenRunning){return;}
						functions._sequentialScroll.call(this,$this,a,c);
					}
				});
			},
			/* -------------------- */
			
			
			/* scrolls content sequentially (used when scrolling via buttons, keyboard arrows etc.) */
			_sequentialScroll:function(el,action,trigger){
				var d=el.data(pluginPfx),o=d.opt,seq=d.sequential,
					mCSB_container=$("#mCSB_"+d.idx+"_container"),
					once=seq.type==="stepped" ? true : false;
				switch(action){
					case "on":
						seq.dir=[
							(trigger==="mCSB_buttonRight" || trigger==="mCSB_buttonLeft" || trigger===39 || trigger===37 ? "x" : "y"),
							(trigger==="mCSB_buttonUp" || trigger==="mCSB_buttonLeft" || trigger===38 || trigger===37 ? -1 : 1)
						];
						functions._stop(el);
						if(functions._isNumeric(trigger) && seq.type==="stepped"){return;}
						_start(once);
						break;
					case "off":
						_stop();
						if(once || (d.tweenRunning && seq.dir)){
							_start(true);
						}
						break;
				}
				/* starts sequence */
				function _start(once){
					var c=seq.type!=="stepped", /* continuous scrolling */
						t=!once ? 1000/60 : c ? o.scrollInertia/1.5 : o.scrollInertia, /* timer */
						m=!once ? 2.5 : c ? 7.5 : 40, /* multiplier */
						contentPos=[Math.abs(mCSB_container[0].offsetTop),Math.abs(mCSB_container[0].offsetLeft)],
						ratio=[d.scrollRatio.y>10 ? 10 : d.scrollRatio.y,d.scrollRatio.x>10 ? 10 : d.scrollRatio.x],
						amount=seq.dir[0]==="x" ? contentPos[1]+(seq.dir[1]*(ratio[1]*m)) : contentPos[0]+(seq.dir[1]*(ratio[0]*m)),
						px=seq.dir[0]==="x" ? contentPos[1]+(seq.dir[1]*parseInt(seq.scrollAmount)) : contentPos[0]+(seq.dir[1]*parseInt(seq.scrollAmount)),
						to=seq.scrollAmount!=="auto" ? px : amount,
						easing=!once ? "mcsLinear" : c ? "mcsLinearOut" : "mcsEaseInOut",
						onComplete=!once ? false : true;
					if(once && t<17){
						to=seq.dir[0]==="x" ? contentPos[1] : contentPos[0];
					}
					functions._scrollTo(el,to.toString(),{dir:seq.dir[0],scrollEasing:easing,dur:t,onComplete:onComplete});
					if(once){
						seq.dir=false;
						return;
					}
					clearTimeout(seq.step);
					seq.step=setTimeout(function(){
						_start();
					},t);
				}
				/* stops sequence */
				function _stop(){
					clearTimeout(seq.step);
					functions._stop(el);
				}
			},
			/* -------------------- */
			
			
			/* returns a yx array from value */
			_arr:function(val){
				var o=$(this).data(pluginPfx).opt,vals=[];
				if(typeof val==="function"){val=val();} /* check if the value is a single anonymous function */
				/* check if value is object or array, its length and create an array with yx values */
				if(!(val instanceof Array)){ /* object value (e.g. {y:"100",x:"100"}, 100 etc.) */
					vals[0]=val.y ? val.y : val.x || o.axis==="x" ? null : val;
					vals[1]=val.x ? val.x : val.y || o.axis==="y" ? null : val;
				}else{ /* array value (e.g. [100,100]) */
					vals=val.length>1 ? [val[0],val[1]] : o.axis==="x" ? [null,val[0]] : [val[0],null];
				}
				/* check if array values are anonymous functions */
				if(typeof vals[0]==="function"){vals[0]=vals[0]();}
				if(typeof vals[1]==="function"){vals[1]=vals[1]();}
				return vals;
			},
			/* -------------------- */
			
			
			/* translates values (e.g. "top", 100, "100px", "#id") to actual scroll-to positions */
			_to:function(val,dir){
				if(val==null || typeof val=="undefined"){return;}
				var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
					mCSB_container=$("#mCSB_"+d.idx+"_container"),
					wrapper=mCSB_container.parent(),
					t=typeof val;
				if(!dir){dir=o.axis==="x" ? "x" : "y";}
				var contentLength=dir==="x" ? mCSB_container.outerWidth(false) : mCSB_container.outerHeight(false),
					contentOffset=dir==="x" ? mCSB_container.offset().left : mCSB_container.offset().top,
					contentPos=dir==="x" ? mCSB_container[0].offsetLeft : mCSB_container[0].offsetTop,
					cssProp=dir==="x" ? "left" : "top";
				switch(t){
					case "function": /* this currently is not used. Consider removing it */
						return val();
						break;
					case "object":
						if(val.nodeType){ /* DOM */
							var objOffset=dir==="x" ? $(val).offset().left : $(val).offset().top;
						}else if(val.jquery){ /* jquery object */
							if(!val.length){return;}
							var objOffset=dir==="x" ? val.offset().left : val.offset().top;
						}
						return objOffset-contentOffset;
						break;
					case "string": case "number":
						if(functions._isNumeric.call(null,val)){ /* numeric value */
							return Math.abs(val);
						}else if(val.indexOf("%")!==-1){ /* percentage value */
							return Math.abs(contentLength*parseInt(val)/100);
						}else if(val.indexOf("-=")!==-1){ /* decrease value */
							return Math.abs(contentPos-parseInt(val.split("-=")[1]));
						}else if(val.indexOf("+=")!==-1){ /* inrease value */
							var p=(contentPos+parseInt(val.split("+=")[1]));
							return p>=0 ? 0 : Math.abs(p);
						}else if(val.indexOf("px")!==-1 && functions._isNumeric.call(null,val.split("px")[0])){ /* pixels string value (e.g. "100px") */
							return Math.abs(val.split("px")[0]);
						}else{
							if(val==="top" || val==="left"){ /* special strings */
								return 0;
							}else if(val==="bottom"){
								return Math.abs(wrapper.height()-mCSB_container.outerHeight(false));
							}else if(val==="right"){
								return Math.abs(wrapper.width()-mCSB_container.outerWidth(false));
							}else if(val==="first" || val==="last"){
								var obj=mCSB_container.find(":"+val),
									objOffset=dir==="x" ? $(obj).offset().left : $(obj).offset().top;
								return objOffset-contentOffset;
							}else{
								if($(val).length){ /* jquery selector */
									var objOffset=dir==="x" ? $(val).offset().left : $(val).offset().top;
									return objOffset-contentOffset;
								}else{ /* other values (e.g. "100em") */
									mCSB_container.css(cssProp,val);
									methods.update.call(null,$this[0]);
									return;
								}
							}
						}
						break;
				}
			},
			/* -------------------- */
			
			
			/* calls the update method automatically */
			_autoUpdate:function(rem){
				var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
					mCSB_container=$("#mCSB_"+d.idx+"_container");
				if(rem){
					/* 
					removes autoUpdate timer 
					usage: functions._autoUpdate.call(this,"remove");
					*/
					clearTimeout(mCSB_container[0].autoUpdate);
					functions._delete.call(null,mCSB_container[0].autoUpdate);
					return;
				}
				var	wrapper=mCSB_container.parent(),
					scrollbar=[$("#mCSB_"+d.idx+"_scrollbar_vertical"),$("#mCSB_"+d.idx+"_scrollbar_horizontal")],
					scrollbarSize=function(){return [
						scrollbar[0].is(":visible") ? scrollbar[0].outerHeight(true) : 0, /* returns y-scrollbar height */
						scrollbar[1].is(":visible") ? scrollbar[1].outerWidth(true) : 0 /* returns x-scrollbar width */
					]},
					oldSelSize=sizesSum(),newSelSize,
					os=[mCSB_container.outerHeight(false),mCSB_container.outerWidth(false),wrapper.height(),wrapper.width(),scrollbarSize()[0],scrollbarSize()[1]],ns,
					oldImgsLen=imgSum(),newImgsLen;
				upd();
				function upd(){
					clearTimeout(mCSB_container[0].autoUpdate);
					mCSB_container[0].autoUpdate=setTimeout(function(){
						/* update on specific selector(s) length and size change */
						if(o.advanced.updateOnSelectorChange){
							newSelSize=sizesSum();
							if(newSelSize!==oldSelSize){
								doUpd();
								oldSelSize=newSelSize;
								return;
							}
						}
						/* update on main element and scrollbar size changes */
						if(o.advanced.updateOnContentResize){
							ns=[mCSB_container.outerHeight(false),mCSB_container.outerWidth(false),wrapper.height(),wrapper.width(),scrollbarSize()[0],scrollbarSize()[1]];
							if(ns[0]!==os[0] || ns[1]!==os[1] || ns[2]!==os[2] || ns[3]!==os[3] || ns[4]!==os[4] || ns[5]!==os[5]){
								doUpd();
								os=ns;
							}
						}
						/* update on image load */
						if(o.advanced.updateOnImageLoad){
							newImgsLen=imgSum();
							if(newImgsLen!==oldImgsLen){
								mCSB_container.find("img").each(function(){
									imgLoader(this.src);
								});
								oldImgsLen=newImgsLen;
							}
						}
						if(o.advanced.updateOnSelectorChange || o.advanced.updateOnContentResize || o.advanced.updateOnImageLoad){upd();}
					},60);
				}
				/* returns images amount */
				function imgSum(){
					var total=0
					if(o.advanced.updateOnImageLoad){total=mCSB_container.find("img").length;}
					return total;
				}
				/* a tiny image loader */
				function imgLoader(src){
					var img=new Image();
					function createDelegate(contextObject,delegateMethod){
						return function(){return delegateMethod.apply(contextObject,arguments);}
					}
					function imgOnLoad(){
						this.onload=null;
						doUpd();
					}
					img.onload=createDelegate(img,imgOnLoad);
					img.src=src;
				}
				/* returns the total height and width sum of all elements matching the selector */
				function sizesSum(){
					if(o.advanced.updateOnSelectorChange===true){o.advanced.updateOnSelectorChange="*";}
					var total=0,sel=mCSB_container.find(o.advanced.updateOnSelectorChange);
					if(o.advanced.updateOnSelectorChange && sel.length>0){sel.each(function(){total+=$(this).height()+$(this).width();});}
					return total;
				}
				/* calls the update method */
				function doUpd(){
					clearTimeout(mCSB_container[0].autoUpdate); 
					methods.update.call(null,$this[0]);
				}
			},
			/* -------------------- */
			
			
			/* snaps scrolling to a multiple of a pixels number */
			_snapAmount:function(to,amount,offset){
				return (Math.round(to/amount)*amount-offset); 
			},
			/* -------------------- */
			
			
			/* stops content and scrollbar animations */
			_stop:function(el){
				var d=el.data(pluginPfx),
					sel=$("#mCSB_"+d.idx+"_container,#mCSB_"+d.idx+"_container_wrapper,#mCSB_"+d.idx+"_dragger_vertical,#mCSB_"+d.idx+"_dragger_horizontal");
				sel.each(function(){
					functions._stopTween.call(this);
				});
			},
			/* -------------------- */
			
			
			/* 
			ANIMATES CONTENT 
			This is where the actual scrolling happens
			*/
			_scrollTo:function(el,to,options){
				var d=el.data(pluginPfx),o=d.opt,
					defaults={
						trigger:"internal",
						dir:"y",
						scrollEasing:"mcsEaseOut",
						drag:false,
						dur:o.scrollInertia,
						overwrite:"all",
						callbacks:true,
						onStart:true,
						onUpdate:true,
						onComplete:true
					},
					options=$.extend(defaults,options),
					dur=[options.dur,(options.drag ? 0 : options.dur)],
					mCustomScrollBox=$("#mCSB_"+d.idx),
					mCSB_container=$("#mCSB_"+d.idx+"_container"),
					totalScrollOffsets=o.callbacks.onTotalScrollOffset ? functions._arr.call(el,o.callbacks.onTotalScrollOffset) : [0,0],
					totalScrollBackOffsets=o.callbacks.onTotalScrollBackOffset ? functions._arr.call(el,o.callbacks.onTotalScrollBackOffset) : [0,0];
				d.trigger=options.trigger;
				if(o.snapAmount){to=functions._snapAmount(to,o.snapAmount,o.snapOffset);} /* scrolling snapping */
				switch(options.dir){
					case "x":
						var mCSB_dragger=$("#mCSB_"+d.idx+"_dragger_horizontal"),
							property="left",
							contentPos=mCSB_container[0].offsetLeft,
							limit=[
								mCustomScrollBox.width()-mCSB_container.outerWidth(false),
								mCSB_dragger.parent().width()-mCSB_dragger.width()
							],
							scrollTo=[to,(to/d.scrollRatio.x)],
							tso=totalScrollOffsets[1],
							tsbo=totalScrollBackOffsets[1],
							totalScrollOffset=tso>0 ? tso/d.scrollRatio.x : 0,
							totalScrollBackOffset=tsbo>0 ? tsbo/d.scrollRatio.x : 0;
						break;
					case "y":
						var mCSB_dragger=$("#mCSB_"+d.idx+"_dragger_vertical"),
							property="top",
							contentPos=mCSB_container[0].offsetTop,
							limit=[
								mCustomScrollBox.height()-mCSB_container.outerHeight(false),
								mCSB_dragger.parent().height()-mCSB_dragger.height()
							],
							scrollTo=[to,(to/d.scrollRatio.y)],
							tso=totalScrollOffsets[0],
							tsbo=totalScrollBackOffsets[0],
							totalScrollOffset=tso>0 ? tso/d.scrollRatio.y : 0,
							totalScrollBackOffset=tsbo>0 ? tsbo/d.scrollRatio.y : 0;
						break;
				}
				if(scrollTo[1]<0){
					scrollTo=[0,0];
				}else if(scrollTo[1]>=limit[1]){
					scrollTo=[limit[0],limit[1]];
				}else{
					scrollTo[0]=-scrollTo[0];
				}
				clearTimeout(mCSB_container[0].onCompleteTimeout);
				if(!d.tweenRunning && ((contentPos===0 && scrollTo[0]>=0) || (contentPos===limit[0] && scrollTo[0]<=limit[0]))){return;}
				functions._tweenTo.call(null,mCSB_dragger[0],property,Math.round(scrollTo[1]),dur[1],options.scrollEasing);
				functions._tweenTo.call(null,mCSB_container[0],property,Math.round(scrollTo[0]),dur[0],options.scrollEasing,options.overwrite,{
					onStart:function(){
						if(options.callbacks && options.onStart && !d.tweenRunning){
							/* callbacks: onScrollStart */
							if(_cb("onScrollStart")){_mcs(); o.callbacks.onScrollStart.call(el[0]);}
							d.tweenRunning=true;
							functions._onDragClasses(mCSB_dragger);
							d.cbOffsets=_cbOffsets();
						}
					},onUpdate:function(){
						if(options.callbacks && options.onUpdate){
							/* callbacks: whileScrolling */
							if(_cb("whileScrolling")){_mcs(); o.callbacks.whileScrolling.call(el[0]);}
						}
					},onComplete:function(){
						if(options.callbacks && options.onComplete){
							if(o.axis==="yx"){clearTimeout(mCSB_container[0].onCompleteTimeout);}
							var t=mCSB_container[0].idleTimer || 0;
							mCSB_container[0].onCompleteTimeout=setTimeout(function(){
								/* callbacks: onScroll, onTotalScroll, onTotalScrollBack */
								if(_cb("onScroll")){_mcs(); o.callbacks.onScroll.call(el[0]);}
								if(_cb("onTotalScroll") && scrollTo[1]>=limit[1]-totalScrollOffset && d.cbOffsets[0]){_mcs(); o.callbacks.onTotalScroll.call(el[0]);}
								if(_cb("onTotalScrollBack") && scrollTo[1]<=totalScrollBackOffset && d.cbOffsets[1]){_mcs(); o.callbacks.onTotalScrollBack.call(el[0]);}
								d.tweenRunning=false;
								mCSB_container[0].idleTimer=0;
								functions._onDragClasses(mCSB_dragger,"hide");
							},t);
						}
					}
				});
				/* checks if callback function exists */
				function _cb(cb){
					return d && o.callbacks[cb] && typeof o.callbacks[cb]==="function";
				}
				/* checks whether callback offsets always trigger */
				function _cbOffsets(){
					return [o.callbacks.alwaysTriggerOffsets || contentPos>=limit[0]+tso,o.callbacks.alwaysTriggerOffsets || contentPos<=-tsbo];
				}
				/* 
				populates object with useful values for the user 
				values: 
					content: this.mcs.content
					content top position: this.mcs.top 
					content left position: this.mcs.left 
					dragger top position: this.mcs.draggerTop 
					dragger left position: this.mcs.draggerLeft 
					scrolling y percentage: this.mcs.topPct 
					scrolling x percentage: this.mcs.leftPct 
					scrolling direction: this.mcs.direction
				*/
				function _mcs(){
					var cp=[mCSB_container[0].offsetTop,mCSB_container[0].offsetLeft], /* content position */
						dp=[mCSB_dragger[0].offsetTop,mCSB_dragger[0].offsetLeft], /* dragger position */
						cl=[mCSB_container.outerHeight(false),mCSB_container.outerWidth(false)], /* content length */
						pl=[mCustomScrollBox.height(),mCustomScrollBox.width()]; /* content parent length */
					el[0].mcs={
						content:mCSB_container, /* original content wrapper as jquery object */
						top:cp[0],left:cp[1],draggerTop:dp[0],draggerLeft:dp[1],
						topPct:Math.round((100*Math.abs(cp[0]))/(Math.abs(cl[0])-pl[0])),leftPct:Math.round((100*Math.abs(cp[1]))/(Math.abs(cl[1])-pl[1])),
						direction:options.dir
					};
					/* 
					this refers to the original element containing the scrollbar(s)
					usage: this.mcs.top, this.mcs.leftPct etc. 
					*/
				}
			},
			/* -------------------- */
			
			
			/* 
			CUSTOM JAVASCRIPT ANIMATION TWEEN 
			Lighter and faster than jquery animate() and css transitions 
			Animates top/left properties and includes easings 
			*/
			_tweenTo:function(el,prop,to,duration,easing,overwrite,callbacks){
				var callbacks=callbacks || {},
					onStart=callbacks.onStart || function(){},onUpdate=callbacks.onUpdate || function(){},onComplete=callbacks.onComplete || function(){},
					startTime=functions._getTime(),_delay,progress=0,from=el.offsetTop,elStyle=el.style;
				if(prop==="left"){from=el.offsetLeft;}
				var diff=to-from;
				el._mcsstop=0;
				if(overwrite!=="none"){_cancelTween();}
				_startTween();
				function _step(){
					if(el._mcsstop){return;}
					if(!progress){onStart.call();}
					progress=functions._getTime()-startTime;
					_tween();
					if(progress>=el._mcstime){
						el._mcstime=(progress>el._mcstime) ? progress+_delay-(progress- el._mcstime) : progress+_delay-1;
						if(el._mcstime<progress+1){el._mcstime=progress+1;}
					}
					if(el._mcstime<duration){el._mcsid=_request(_step);}else{onComplete.call();}
				}
				function _tween(){
					if(duration>0){
						el._mcscurrVal=_ease(el._mcstime,from,diff,duration,easing);
						elStyle[prop]=Math.round(el._mcscurrVal)+"px";
					}else{
						elStyle[prop]=to+"px";
					}
					onUpdate.call();
				}
				function _startTween(){
					_delay=1000/60;
					el._mcstime=progress+_delay;
					_request=(!window.requestAnimationFrame) ? function(f){_tween(); return setTimeout(f,0.01);} : window.requestAnimationFrame;
					el._mcsid=_request(_step);
				}
				function _cancelTween(){
					if(el._mcsid==null){return;}
					if(!window.requestAnimationFrame){clearTimeout(el._mcsid);
					}else{window.cancelAnimationFrame(el._mcsid);}
					el._mcsid=null;
				}
				function _ease(t,b,c,d,type){
					switch(type){
						case "linear": case "mcsLinear":
							return c*t/d + b;
							break;
						case "mcsLinearOut":
							t/=d; t--; return c * Math.sqrt(1 - t*t) + b;
							break;
						case "easeInOutSmooth":
							t/=d/2;
							if(t<1) return c/2*t*t + b;
							t--;
							return -c/2 * (t*(t-2) - 1) + b;
							break;
						case "easeInOutStrong":
							t/=d/2;
							if(t<1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
							t--;
							return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
							break;
						case "easeInOut": case "mcsEaseInOut":
							t/=d/2;
							if(t<1) return c/2*t*t*t + b;
							t-=2;
							return c/2*(t*t*t + 2) + b;
							break;
						case "easeOutSmooth":
							t/=d; t--;
							return -c * (t*t*t*t - 1) + b;
							break;
						case "easeOutStrong":
							return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
							break;
						case "easeOut": case "mcsEaseOut": default:
							var ts=(t/=d)*t,tc=ts*t;
							return b+c*(0.499999999999997*tc*ts + -2.5*ts*ts + 5.5*tc + -6.5*ts + 4*t);
					}
				}
			},
			/* -------------------- */
			
			
			/* returns current time */
			_getTime:function(){
				if(window.performance && window.performance.now){
					return window.performance.now();
				}else{
					if(window.performance && window.performance.webkitNow){
						return window.performance.webkitNow();
					}else{
						if(Date.now){return Date.now();}else{return new Date().getTime();}
					}
				}
			},
			/* -------------------- */
			
			
			/* stops a tween */
			_stopTween:function(){
				var el=this;
				if(el._mcsid==null){return;}
				if(!window.requestAnimationFrame){clearTimeout(el._mcsid);
				}else{window.cancelAnimationFrame(el._mcsid);}
				el._mcsid=null;
				el._mcsstop=1;
			},
			/* -------------------- */
			
			
			/* deletes a property (avoiding the exception thrown by IE) */
			_delete:function(p){
				try{delete p;}catch(e){p=null;}
			},
			/* -------------------- */
			
			
			/* detects left mouse button */
			_mouseBtnLeft:function(e){
				return !(e.which && e.which!==1);
			},
			/* -------------------- */
			
			
			/* detects if pointer type event is touch */
			_pointerTouch:function(e){
				var t=e.originalEvent.pointerType;
				return !(t && t!=="touch" && t!==2);
			},
			/* -------------------- */
			
			
			/* checks if value is numeric */
			_isNumeric:function(val){
				return !isNaN(parseFloat(val)) && isFinite(val);
			}
			/* -------------------- */
			
		};
		
	
	
	
	
	/* 
	----------------------------------------
	PLUGIN SETUP 
	----------------------------------------
	*/
	
	/* plugin dependencies */
	var _dlp=("https:"==document.location.protocol) ? "https:" : "http:"; /* dependency location protocol */
	/* load jquery-mousewheel plugin (via CDN) if it's not present (works when mCustomScrollbar fn is called on window load) */
	$.event.special.mousewheel || $("head").append(decodeURI("%3Cscript src="+_dlp+"//cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.11/jquery.mousewheel.min.js%3E%3C/script%3E"));
	
	/* plugin constructor functions */
	$.fn[pluginNS]=function(method){ /* usage: $(selector).mCustomScrollbar(); */
		if(methods[method]){
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		}else if(typeof method==="object" || !method){
			return methods.init.apply(this,arguments);
		}else{
			$.error("Method "+method+" does not exist");
		}
	};
	$[pluginNS]=function(method){ /* usage: $.mCustomScrollbar(); */
		if(methods[method]){
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		}else if(typeof method==="object" || !method){
			return methods.init.apply(this,arguments);
		}else{
			$.error("Method "+method+" does not exist");
		}
	};
	
	/* 
	allow setting plugin default options. 
	usage: $.mCustomScrollbar.defaults.scrollInertia=500; 
	to apply any changed default options on default selectors (below), use inside document ready fn 
	e.g.: $(document).ready(function(){ $.mCustomScrollbar.defaults.scrollInertia=500; });
	*/
	$[pluginNS].defaults=defaults;
	
	/* 
	add window object (window.mCustomScrollbar) 
	usage: if(window.mCustomScrollbar){console.log("custom scrollbar plugin loaded");}
	*/
	window[pluginNS]=true;
	
	$(window).load(function(){
		$(defaultSelector)[pluginNS](); /* add scrollbars automatically on default selector */
	});
	
})(jQuery,window,document);;
if(jQuery) (function($) {

	// Defaults
	$.minicolors = {
		defaults: {
			animationSpeed: 50,
			animationEasing: 'swing',
			change: null,
			changeDelay: 0,
			control: 'hue',
			defaultValue: '',
			hide: null,
			hideSpeed: 100,
			inline: false,
			letterCase: 'lowercase',
			opacity: false,
			position: 'bottom left',
			show: null,
			showSpeed: 100,
			theme: 'default'
		}
	};

	// Public methods
	$.extend($.fn, {
		minicolors: function(method, data) {

			switch(method) {

				// Destroy the control
				case 'destroy':
					$(this).each( function() {
						destroy($(this));
					});
					return $(this);

				// Hide the color picker
				case 'hide':
					hide();
					return $(this);

				// Get/set opacity
				case 'opacity':
					// Getter
					if( data === undefined ) {
						// Getter
						return $(this).attr('data-opacity');
					} else {
						// Setter
						$(this).each( function() {
							updateFromInput($(this).attr('data-opacity', data));
						});
					}
					return $(this);

				// Get an RGB(A) object based on the current color/opacity
				case 'rgbObject':
					return rgbObject($(this), method === 'rgbaObject');

				// Get an RGB(A) string based on the current color/opacity
				case 'rgbString':
				case 'rgbaString':
					return rgbString($(this), method === 'rgbaString');

				// Get/set settings on the fly
				case 'settings':
					if( data === undefined ) {
						return $(this).data('minicolors-settings');
					} else {
						// Setter
						$(this).each( function() {
							var settings = $(this).data('minicolors-settings') || {};
							destroy($(this));
							$(this).minicolors($.extend(true, settings, data));
						});
					}
					return $(this);

				// Show the color picker
				case 'show':
					show( $(this).eq(0) );
					return $(this);

				// Get/set the hex color value
				case 'value':
					if( data === undefined ) {
						// Getter
						return $(this).val();
					} else {
						// Setter
						$(this).each( function() {
							updateFromInput($(this).val(data));
						});
					}
					return $(this);

				// Initializes the control
				default:
					if( method !== 'create' ) data = method;
					$(this).each( function() {
						init($(this), data);
					});
					return $(this);

			}

		}
	});

	// Initialize input elements
	function init(input, settings) {

		var minicolors = $('<div class="minicolors" />'),
			defaults = $.minicolors.defaults;

		// Do nothing if already initialized
		if( input.data('minicolors-initialized') ) return;

		// Handle settings
		settings = $.extend(true, {}, defaults, settings);

		// The wrapper
		minicolors
			.addClass('minicolors-theme-' + settings.theme)
			.toggleClass('minicolors-with-opacity', settings.opacity);

		// Custom positioning
		if( settings.position !== undefined ) {
			$.each(settings.position.split(' '), function() {
				minicolors.addClass('minicolors-position-' + this);
			});
		}

		// The input
		input
			.addClass('minicolors-input')
			.data('minicolors-initialized', false)
			.data('minicolors-settings', settings)
			.prop('size', 7)
			.wrap(minicolors)
			.after(
				'<div class="minicolors-panel minicolors-slider-' + settings.control + '">' +
					'<div class="minicolors-slider">' +
						'<div class="minicolors-picker"></div>' +
					'</div>' +
					'<div class="minicolors-opacity-slider">' +
						'<div class="minicolors-picker"></div>' +
					'</div>' +
					'<div class="minicolors-grid">' +
						'<div class="minicolors-grid-inner"></div>' +
						'<div class="minicolors-picker"><div></div></div>' +
					'</div>' +
				'</div>'
			);

		// The swatch
		if( !settings.inline ) {
			input.after('<span class="minicolors-swatch"><span class="minicolors-swatch-color"></span></span>');
			input.next('.minicolors-swatch').on('click', function(event) {
				event.preventDefault();
				input.focus();
			});
		}

		// Prevent text selection in IE
		input.parent().find('.minicolors-panel').on('selectstart', function() { return false; }).end();

		// Inline controls
		if( settings.inline ) input.parent().addClass('minicolors-inline');

		updateFromInput(input, false);

		input.data('minicolors-initialized', true);

	}

	// Returns the input back to its original state
	function destroy(input) {

		var minicolors = input.parent();

		// Revert the input element
		input
			.removeData('minicolors-initialized')
			.removeData('minicolors-settings')
			.removeProp('size')
			.removeClass('minicolors-input');

		// Remove the wrap and destroy whatever remains
		minicolors.before(input).remove();

	}

	// Shows the specified dropdown panel
	function show(input) {

		var minicolors = input.parent(),
			panel = minicolors.find('.minicolors-panel'),
			settings = input.data('minicolors-settings');

		// Do nothing if uninitialized, disabled, inline, or already open
		if( !input.data('minicolors-initialized') ||
			input.prop('disabled') ||
			minicolors.hasClass('minicolors-inline') ||
			minicolors.hasClass('minicolors-focus')
		) return;

		hide();

		minicolors.addClass('minicolors-focus');
		panel
			.stop(true, true)
			.fadeIn(settings.showSpeed, function() {
				if( settings.show ) settings.show.call(input.get(0));
			});

	}

	// Hides all dropdown panels
	function hide() {

		$('.minicolors-focus').each( function() {

			var minicolors = $(this),
				input = minicolors.find('.minicolors-input'),
				panel = minicolors.find('.minicolors-panel'),
				settings = input.data('minicolors-settings');

			panel.fadeOut(settings.hideSpeed, function() {
				if( settings.hide ) settings.hide.call(input.get(0));
				minicolors.removeClass('minicolors-focus');
			});

		});
	}

	// Moves the selected picker
	function move(target, event, animate) {

		var input = target.parents('.minicolors').find('.minicolors-input'),
			settings = input.data('minicolors-settings'),
			picker = target.find('[class$=-picker]'),
			offsetX = target.offset().left,
			offsetY = target.offset().top,
			x = Math.round(event.pageX - offsetX),
			y = Math.round(event.pageY - offsetY),
			duration = animate ? settings.animationSpeed : 0,
			wx, wy, r, phi;

		// Touch support
		if( event.originalEvent.changedTouches ) {
			x = event.originalEvent.changedTouches[0].pageX - offsetX;
			y = event.originalEvent.changedTouches[0].pageY - offsetY;
		}

		// Constrain picker to its container
		if( x < 0 ) x = 0;
		if( y < 0 ) y = 0;
		if( x > target.width() ) x = target.width();
		if( y > target.height() ) y = target.height();

		// Constrain color wheel values to the wheel
		if( target.parent().is('.minicolors-slider-wheel') && picker.parent().is('.minicolors-grid') ) {
			wx = 75 - x;
			wy = 75 - y;
			r = Math.sqrt(wx * wx + wy * wy);
			phi = Math.atan2(wy, wx);
			if( phi < 0 ) phi += Math.PI * 2;
			if( r > 75 ) {
				r = 75;
				x = 75 - (75 * Math.cos(phi));
				y = 75 - (75 * Math.sin(phi));
			}
			x = Math.round(x);
			y = Math.round(y);
		}

		// Move the picker
		if( target.is('.minicolors-grid') ) {
			picker
				.stop(true)
				.animate({
					top: y + 'px',
					left: x + 'px'
				}, duration, settings.animationEasing, function() {
					updateFromControl(input, target);
				});
		} else {
			picker
				.stop(true)
				.animate({
					top: y + 'px'
				}, duration, settings.animationEasing, function() {
					updateFromControl(input, target);
				});
		}

	}

	// Sets the input based on the color picker values
	function updateFromControl(input, target) {

		function getCoords(picker, container) {

			var left, top;
			if( !picker.length || !container ) return null;
			left = picker.offset().left;
			top = picker.offset().top;

			return {
				x: left - container.offset().left + (picker.outerWidth() / 2),
				y: top - container.offset().top + (picker.outerHeight() / 2)
			};

		}

		var hue, saturation, brightness, x, y, r, phi,

			hex = input.val(),
			opacity = input.attr('data-opacity'),

			// Helpful references
			minicolors = input.parent(),
			settings = input.data('minicolors-settings'),
			swatch = minicolors.find('.minicolors-swatch'),

			// Panel objects
			grid = minicolors.find('.minicolors-grid'),
			slider = minicolors.find('.minicolors-slider'),
			opacitySlider = minicolors.find('.minicolors-opacity-slider'),

			// Picker objects
			gridPicker = grid.find('[class$=-picker]'),
			sliderPicker = slider.find('[class$=-picker]'),
			opacityPicker = opacitySlider.find('[class$=-picker]'),

			// Picker positions
			gridPos = getCoords(gridPicker, grid),
			sliderPos = getCoords(sliderPicker, slider),
			opacityPos = getCoords(opacityPicker, opacitySlider);

		// Handle colors
		if( target.is('.minicolors-grid, .minicolors-slider') ) {

			// Determine HSB values
			switch(settings.control) {

				case 'wheel':
					// Calculate hue, saturation, and brightness
					x = (grid.width() / 2) - gridPos.x;
					y = (grid.height() / 2) - gridPos.y;
					r = Math.sqrt(x * x + y * y);
					phi = Math.atan2(y, x);
					if( phi < 0 ) phi += Math.PI * 2;
					if( r > 75 ) {
						r = 75;
						gridPos.x = 69 - (75 * Math.cos(phi));
						gridPos.y = 69 - (75 * Math.sin(phi));
					}
					saturation = keepWithin(r / 0.75, 0, 100);
					hue = keepWithin(phi * 180 / Math.PI, 0, 360);
					brightness = keepWithin(100 - Math.floor(sliderPos.y * (100 / slider.height())), 0, 100);
					hex = hsb2hex({
						h: hue,
						s: saturation,
						b: brightness
					});

					// Update UI
					slider.css('backgroundColor', hsb2hex({ h: hue, s: saturation, b: 100 }));
					break;

				case 'saturation':
					// Calculate hue, saturation, and brightness
					hue = keepWithin(parseInt(gridPos.x * (360 / grid.width()), 10), 0, 360);
					saturation = keepWithin(100 - Math.floor(sliderPos.y * (100 / slider.height())), 0, 100);
					brightness = keepWithin(100 - Math.floor(gridPos.y * (100 / grid.height())), 0, 100);
					hex = hsb2hex({
						h: hue,
						s: saturation,
						b: brightness
					});

					// Update UI
					slider.css('backgroundColor', hsb2hex({ h: hue, s: 100, b: brightness }));
					minicolors.find('.minicolors-grid-inner').css('opacity', saturation / 100);
					break;

				case 'brightness':
					// Calculate hue, saturation, and brightness
					hue = keepWithin(parseInt(gridPos.x * (360 / grid.width()), 10), 0, 360);
					saturation = keepWithin(100 - Math.floor(gridPos.y * (100 / grid.height())), 0, 100);
					brightness = keepWithin(100 - Math.floor(sliderPos.y * (100 / slider.height())), 0, 100);
					hex = hsb2hex({
						h: hue,
						s: saturation,
						b: brightness
					});

					// Update UI
					slider.css('backgroundColor', hsb2hex({ h: hue, s: saturation, b: 100 }));
					minicolors.find('.minicolors-grid-inner').css('opacity', 1 - (brightness / 100));
					break;

				default:
					// Calculate hue, saturation, and brightness
					hue = keepWithin(360 - parseInt(sliderPos.y * (360 / slider.height()), 10), 0, 360);
					saturation = keepWithin(Math.floor(gridPos.x * (100 / grid.width())), 0, 100);
					brightness = keepWithin(100 - Math.floor(gridPos.y * (100 / grid.height())), 0, 100);
					hex = hsb2hex({
						h: hue,
						s: saturation,
						b: brightness
					});

					// Update UI
					grid.css('backgroundColor', hsb2hex({ h: hue, s: 100, b: 100 }));
					break;

			}

			// Adjust case
			input.val( convertCase(hex, settings.letterCase) );

		}

		// Handle opacity
		if( target.is('.minicolors-opacity-slider') ) {
			if( settings.opacity ) {
				opacity = parseFloat(1 - (opacityPos.y / opacitySlider.height())).toFixed(2);
			} else {
				opacity = 1;
			}
			if( settings.opacity ) input.attr('data-opacity', opacity);
		}

		// Set swatch color
		swatch.find('SPAN').css({
			backgroundColor: hex,
			opacity: opacity
		});

		// Handle change event
		doChange(input, hex, opacity);

	}

	// Sets the color picker values from the input
	function updateFromInput(input, preserveInputValue) {

		var hex,
			hsb,
			opacity,
			x, y, r, phi,

			// Helpful references
			minicolors = input.parent(),
			settings = input.data('minicolors-settings'),
			swatch = minicolors.find('.minicolors-swatch'),

			// Panel objects
			grid = minicolors.find('.minicolors-grid'),
			slider = minicolors.find('.minicolors-slider'),
			opacitySlider = minicolors.find('.minicolors-opacity-slider'),

			// Picker objects
			gridPicker = grid.find('[class$=-picker]'),
			sliderPicker = slider.find('[class$=-picker]'),
			opacityPicker = opacitySlider.find('[class$=-picker]');

		// Determine hex/HSB values
		hex = convertCase(parseHex(input.val(), true), settings.letterCase);
		if( !hex ){
			hex = convertCase(parseHex(settings.defaultValue, true), settings.letterCase);
		}
		hsb = hex2hsb(hex);

		// Update input value
		if( !preserveInputValue ) input.val(hex);

		// Determine opacity value
		if( settings.opacity ) {
			// Get from data-opacity attribute and keep within 0-1 range
			opacity = input.attr('data-opacity') === '' ? 1 : keepWithin(parseFloat(input.attr('data-opacity')).toFixed(2), 0, 1);
			if( isNaN(opacity) ) opacity = 1;
			input.attr('data-opacity', opacity);
			swatch.find('SPAN').css('opacity', opacity);

			// Set opacity picker position
			y = keepWithin(opacitySlider.height() - (opacitySlider.height() * opacity), 0, opacitySlider.height());
			opacityPicker.css('top', y + 'px');
		}

		// Update swatch
		swatch.find('SPAN').css('backgroundColor', hex);

		// Determine picker locations
		switch(settings.control) {

			case 'wheel':
				// Set grid position
				r = keepWithin(Math.ceil(hsb.s * 0.75), 0, grid.height() / 2);
				phi = hsb.h * Math.PI / 180;
				x = keepWithin(75 - Math.cos(phi) * r, 0, grid.width());
				y = keepWithin(75 - Math.sin(phi) * r, 0, grid.height());
				gridPicker.css({
					top: y + 'px',
					left: x + 'px'
				});

				// Set slider position
				y = 150 - (hsb.b / (100 / grid.height()));
				if( hex === '' ) y = 0;
				sliderPicker.css('top', y + 'px');

				// Update panel color
				slider.css('backgroundColor', hsb2hex({ h: hsb.h, s: hsb.s, b: 100 }));
				break;

			case 'saturation':
				// Set grid position
				x = keepWithin((5 * hsb.h) / 12, 0, 150);
				y = keepWithin(grid.height() - Math.ceil(hsb.b / (100 / grid.height())), 0, grid.height());
				gridPicker.css({
					top: y + 'px',
					left: x + 'px'
				});

				// Set slider position
				y = keepWithin(slider.height() - (hsb.s * (slider.height() / 100)), 0, slider.height());
				sliderPicker.css('top', y + 'px');

				// Update UI
				slider.css('backgroundColor', hsb2hex({ h: hsb.h, s: 100, b: hsb.b }));
				minicolors.find('.minicolors-grid-inner').css('opacity', hsb.s / 100);
				break;

			case 'brightness':
				// Set grid position
				x = keepWithin((5 * hsb.h) / 12, 0, 150);
				y = keepWithin(grid.height() - Math.ceil(hsb.s / (100 / grid.height())), 0, grid.height());
				gridPicker.css({
					top: y + 'px',
					left: x + 'px'
				});

				// Set slider position
				y = keepWithin(slider.height() - (hsb.b * (slider.height() / 100)), 0, slider.height());
				sliderPicker.css('top', y + 'px');

				// Update UI
				slider.css('backgroundColor', hsb2hex({ h: hsb.h, s: hsb.s, b: 100 }));
				minicolors.find('.minicolors-grid-inner').css('opacity', 1 - (hsb.b / 100));
				break;

			default:
				// Set grid position
				x = keepWithin(Math.ceil(hsb.s / (100 / grid.width())), 0, grid.width());
				y = keepWithin(grid.height() - Math.ceil(hsb.b / (100 / grid.height())), 0, grid.height());
				gridPicker.css({
					top: y + 'px',
					left: x + 'px'
				});

				// Set slider position
				y = keepWithin(slider.height() - (hsb.h / (360 / slider.height())), 0, slider.height());
				sliderPicker.css('top', y + 'px');

				// Update panel color
				grid.css('backgroundColor', hsb2hex({ h: hsb.h, s: 100, b: 100 }));
				break;

		}

		// Fire change event, but only if minicolors is fully initialized
		if( input.data('minicolors-initialized') ) {
			doChange(input, hex, opacity);
		}

	}

	// Runs the change and changeDelay callbacks
	function doChange(input, hex, opacity) {

		var settings = input.data('minicolors-settings'),
			lastChange = input.data('minicolors-lastChange');

		// Only run if it actually changed
		if( !lastChange || lastChange.hex !== hex || lastChange.opacity !== opacity ) {

			// Remember last-changed value
			input.data('minicolors-lastChange', {
				hex: hex,
				opacity: opacity
			});

			// Fire change event
			if( settings.change ) {
				if( settings.changeDelay ) {
					// Call after a delay
					clearTimeout(input.data('minicolors-changeTimeout'));
					input.data('minicolors-changeTimeout', setTimeout( function() {
						settings.change.call(input.get(0), hex, opacity);
					}, settings.changeDelay));
				} else {
					// Call immediately
					settings.change.call(input.get(0), hex, opacity);
				}
			}
			input.trigger('change').trigger('input');
		}

	}

	// Generates an RGB(A) object based on the input's value
	function rgbObject(input) {
		var hex = parseHex($(input).val(), true),
			rgb = hex2rgb(hex),
			opacity = $(input).attr('data-opacity');
		if( !rgb ) return null;
		if( opacity !== undefined ) $.extend(rgb, { a: parseFloat(opacity) });
		return rgb;
	}

	// Genearates an RGB(A) string based on the input's value
	function rgbString(input, alpha) {
		var hex = parseHex($(input).val(), true),
			rgb = hex2rgb(hex),
			opacity = $(input).attr('data-opacity');
		if( !rgb ) return null;
		if( opacity === undefined ) opacity = 1;
		if( alpha ) {
			return 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + parseFloat(opacity) + ')';
		} else {
			return 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
		}
	}

	// Converts to the letter case specified in settings
	function convertCase(string, letterCase) {
		return letterCase === 'uppercase' ? string.toUpperCase() : string.toLowerCase();
	}

	// Parses a string and returns a valid hex string when possible
	function parseHex(string, expand) {
		string = string.replace(/[^A-F0-9]/ig, '');
		if( string.length !== 3 && string.length !== 6 ) return '';
		if( string.length === 3 && expand ) {
			string = string[0] + string[0] + string[1] + string[1] + string[2] + string[2];
		}
		return '#' + string;
	}

	// Keeps value within min and max
	function keepWithin(value, min, max) {
		if( value < min ) value = min;
		if( value > max ) value = max;
		return value;
	}

	// Converts an HSB object to an RGB object
	function hsb2rgb(hsb) {
		var rgb = {};
		var h = Math.round(hsb.h);
		var s = Math.round(hsb.s * 255 / 100);
		var v = Math.round(hsb.b * 255 / 100);
		if(s === 0) {
			rgb.r = rgb.g = rgb.b = v;
		} else {
			var t1 = v;
			var t2 = (255 - s) * v / 255;
			var t3 = (t1 - t2) * (h % 60) / 60;
			if( h === 360 ) h = 0;
			if( h < 60 ) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3; }
			else if( h < 120 ) {rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3; }
			else if( h < 180 ) {rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3; }
			else if( h < 240 ) {rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3; }
			else if( h < 300 ) {rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3; }
			else if( h < 360 ) {rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3; }
			else { rgb.r = 0; rgb.g = 0; rgb.b = 0; }
		}
		return {
			r: Math.round(rgb.r),
			g: Math.round(rgb.g),
			b: Math.round(rgb.b)
		};
	}

	// Converts an RGB object to a hex string
	function rgb2hex(rgb) {
		var hex = [
			rgb.r.toString(16),
			rgb.g.toString(16),
			rgb.b.toString(16)
		];
		$.each(hex, function(nr, val) {
			if (val.length === 1) hex[nr] = '0' + val;
		});
		return '#' + hex.join('');
	}

	// Converts an HSB object to a hex string
	function hsb2hex(hsb) {
		return rgb2hex(hsb2rgb(hsb));
	}

	// Converts a hex string to an HSB object
	function hex2hsb(hex) {
		var hsb = rgb2hsb(hex2rgb(hex));
		if( hsb.s === 0 ) hsb.h = 360;
		return hsb;
	}

	// Converts an RGB object to an HSB object
	function rgb2hsb(rgb) {
		var hsb = { h: 0, s: 0, b: 0 };
		var min = Math.min(rgb.r, rgb.g, rgb.b);
		var max = Math.max(rgb.r, rgb.g, rgb.b);
		var delta = max - min;
		hsb.b = max;
		hsb.s = max !== 0 ? 255 * delta / max : 0;
		if( hsb.s !== 0 ) {
			if( rgb.r === max ) {
				hsb.h = (rgb.g - rgb.b) / delta;
			} else if( rgb.g === max ) {
				hsb.h = 2 + (rgb.b - rgb.r) / delta;
			} else {
				hsb.h = 4 + (rgb.r - rgb.g) / delta;
			}
		} else {
			hsb.h = -1;
		}
		hsb.h *= 60;
		if( hsb.h < 0 ) {
			hsb.h += 360;
		}
		hsb.s *= 100/255;
		hsb.b *= 100/255;
		return hsb;
	}

	// Converts a hex string to an RGB object
	function hex2rgb(hex) {
		hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
		return {
			r: hex >> 16,
			g: (hex & 0x00FF00) >> 8,
			b: (hex & 0x0000FF)
		};
	}

	// Handle events
	$(document)
		// Hide on clicks outside of the control
		.on('mousedown.minicolors touchstart.minicolors', function(event) {
			if( !$(event.target).parents().add(event.target).hasClass('minicolors') ) {
				hide();
			}
		})
		// Start moving
		.on('mousedown.minicolors touchstart.minicolors', '.minicolors-grid, .minicolors-slider, .minicolors-opacity-slider', function(event) {
			var target = $(this);
			event.preventDefault();
			$(document).data('minicolors-target', target);
			move(target, event, true);
		})
		// Move pickers
		.on('mousemove.minicolors touchmove.minicolors', function(event) {
			var target = $(document).data('minicolors-target');
			if( target ) move(target, event);
		})
		// Stop moving
		.on('mouseup.minicolors touchend.minicolors', function() {
			$(this).removeData('minicolors-target');
		})
		// Show panel when swatch is clicked
		.on('mousedown.minicolors touchstart.minicolors', '.minicolors-swatch', function(event) {
			var input = $(this).parent().find('.minicolors-input');
			event.preventDefault();
			show(input);
		})
		// Show on focus
		.on('focus.minicolors', '.minicolors-input', function() {
			var input = $(this);
			if( !input.data('minicolors-initialized') ) return;
			show(input);
		})
		// Fix hex on blur
		.on('blur.minicolors', '.minicolors-input', function() {
			var input = $(this),
				settings = input.data('minicolors-settings');
			if( !input.data('minicolors-initialized') ) return;

			// Parse Hex
			input.val(parseHex(input.val(), true));

			// Is it blank?
			if( input.val() === '' ) input.val(parseHex(settings.defaultValue, true));

			// Adjust case
			input.val( convertCase(input.val(), settings.letterCase) );

		})
		// Handle keypresses
		.on('keydown.minicolors', '.minicolors-input', function(event) {
			var input = $(this);
			if( !input.data('minicolors-initialized') ) return;
			switch(event.keyCode) {
				case 9: // tab
					hide();
					break;
				case 13: // enter
				case 27: // esc
					hide();
					input.blur();
					break;
			}
		})
		// Update on keyup
		.on('keyup.minicolors', '.minicolors-input', function() {
			var input = $(this);
			if( !input.data('minicolors-initialized') ) return;
			updateFromInput(input, true);
		})
		// Update on paste
		.on('paste.minicolors', '.minicolors-input', function() {
			var input = $(this);
			if( !input.data('minicolors-initialized') ) return;
			setTimeout( function() {
				updateFromInput(input, true);
			}, 1);
		});

})(jQuery);;
(function(c){function m(a,c,d){if((a[c]||a[d])&&a[c]===a[d])throw Error("(Link) '"+c+"' can't match '"+d+"'.'");}function r(a){void 0===a&&(a={});if("object"!==typeof a)throw Error("(Format) 'format' option must be an object.");var h={};c(u).each(function(c,n){if(void 0===a[n])h[n]=A[c];else if(typeof a[n]===typeof A[c]){if("decimals"===n&&(0>a[n]||7<a[n]))throw Error("(Format) 'format.decimals' option must be between 0 and 7.");h[n]=a[n]}else throw Error("(Format) 'format."+n+"' must be a "+typeof A[c]+
".");});m(h,"mark","thousand");m(h,"prefix","negative");m(h,"prefix","negativeBefore");this.r=h}function k(a,h){"object"!==typeof a&&c.error("(Link) Initialize with an object.");return new k.prototype.p(a.target||function(){},a.method,a.format||{},h)}var u="decimals mark thousand prefix postfix encoder decoder negative negativeBefore to from".split(" "),A=[2,".","","","",function(a){return a},function(a){return a},"-","",function(a){return a},function(a){return a}];r.prototype.a=function(a){return this.r[a]};
r.prototype.L=function(a){function c(a){return a.split("").reverse().join("")}a=this.a("encoder")(a);var d=this.a("decimals"),n="",k="",m="",r="";0===parseFloat(a.toFixed(d))&&(a="0");0>a&&(n=this.a("negative"),k=this.a("negativeBefore"));a=Math.abs(a).toFixed(d).toString();a=a.split(".");this.a("thousand")?(m=c(a[0]).match(/.{1,3}/g),m=c(m.join(c(this.a("thousand"))))):m=a[0];this.a("mark")&&1<a.length&&(r=this.a("mark")+a[1]);return this.a("to")(k+this.a("prefix")+n+m+r+this.a("postfix"))};r.prototype.w=
function(a){function c(a){return a.replace(/[\-\/\\\^$*+?.()|\[\]{}]/g,"\\$&")}var d;if(null===a||void 0===a)return!1;a=this.a("from")(a);a=a.toString();d=a.replace(RegExp("^"+c(this.a("negativeBefore"))),"");a!==d?(a=d,d="-"):d="";a=a.replace(RegExp("^"+c(this.a("prefix"))),"");this.a("negative")&&(d="",a=a.replace(RegExp("^"+c(this.a("negative"))),"-"));a=a.replace(RegExp(c(this.a("postfix"))+"$"),"").replace(RegExp(c(this.a("thousand")),"g"),"").replace(this.a("mark"),".");a=this.a("decoder")(parseFloat(d+
a));return isNaN(a)?!1:a};k.prototype.K=function(a,h){this.method=h||"html";this.j=c(a.replace("-tooltip-","")||"<div/>")[0]};k.prototype.H=function(a){this.method="val";this.j=document.createElement("input");this.j.name=a;this.j.type="hidden"};k.prototype.G=function(a){function h(a,c){return[c?null:a,c?a:null]}var d=this;this.method="val";this.target=a.on("change",function(a){d.B.val(h(c(a.target).val(),d.t),{link:d,set:!0})})};k.prototype.p=function(a,h,d,k){this.g=d;this.update=!k;if("string"===
typeof a&&0===a.indexOf("-tooltip-"))this.K(a,h);else if("string"===typeof a&&0!==a.indexOf("-"))this.H(a);else if("function"===typeof a)this.target=!1,this.method=a;else{if(a instanceof c||c.zepto&&c.zepto.isZ(a)){if(!h){if(a.is("input, select, textarea")){this.G(a);return}h="html"}if("function"===typeof h||"string"===typeof h&&a[h]){this.method=h;this.target=a;return}}throw new RangeError("(Link) Invalid Link.");}};k.prototype.write=function(a,c,d,k){if(!this.update||!1!==k)if(this.u=a,this.F=a=
this.format(a),"function"===typeof this.method)this.method.call(this.target[0]||d[0],a,c,d);else this.target[this.method](a,c,d)};k.prototype.q=function(a){this.g=new r(c.extend({},a,this.g instanceof r?this.g.r:this.g))};k.prototype.J=function(a){this.B=a};k.prototype.I=function(a){this.t=a};k.prototype.format=function(a){return this.g.L(a)};k.prototype.A=function(a){return this.g.w(a)};k.prototype.p.prototype=k.prototype;c.Link=k})(window.jQuery||window.Zepto);/*

$.fn.noUiSlider - WTFPL - refreshless.com/nouislider/ */
(function(c){function m(e){return"number"===typeof e&&!isNaN(e)&&isFinite(e)}function r(e){return c.isArray(e)?e:[e]}function k(e,b){e.addClass(b);setTimeout(function(){e.removeClass(b)},300)}function u(e,b){return 100*b/(e[1]-e[0])}function A(e,b){if(b>=e.d.slice(-1)[0])return 100;for(var a=1,c,f,d;b>=e.d[a];)a++;c=e.d[a-1];f=e.d[a];d=e.c[a-1];c=[c,f];return d+u(c,0>c[0]?b+Math.abs(c[0]):b-c[0])/(100/(e.c[a]-d))}function a(e,b){if(100<=b)return e.d.slice(-1)[0];for(var a=1,c,f,d;b>=e.c[a];)a++;c=
e.d[a-1];f=e.d[a];d=e.c[a-1];c=[c,f];return 100/(e.c[a]-d)*(b-d)*(c[1]-c[0])/100+c[0]}function h(a,b){for(var c=1,g;(a.dir?100-b:b)>=a.c[c];)c++;if(a.m)return g=a.c[c-1],c=a.c[c],b-g>(c-g)/2?c:g;a.h[c-1]?(g=a.h[c-1],c=a.c[c-1]+Math.round((b-a.c[c-1])/g)*g):c=b;return c}function d(a,b){if(!m(b))throw Error("noUiSlider: 'step' is not numeric.");a.h[0]=b}function n(a,b){if("object"!==typeof b||c.isArray(b))throw Error("noUiSlider: 'range' is not an object.");if(void 0===b.min||void 0===b.max)throw Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
c.each(b,function(b,g){var d;"number"===typeof g&&(g=[g]);if(!c.isArray(g))throw Error("noUiSlider: 'range' contains invalid value.");d="min"===b?0:"max"===b?100:parseFloat(b);if(!m(d)||!m(g[0]))throw Error("noUiSlider: 'range' value isn't numeric.");a.c.push(d);a.d.push(g[0]);d?a.h.push(isNaN(g[1])?!1:g[1]):isNaN(g[1])||(a.h[0]=g[1])});c.each(a.h,function(b,c){if(!c)return!0;a.h[b]=u([a.d[b],a.d[b+1]],c)/(100/(a.c[b+1]-a.c[b]))})}function E(a,b){"number"===typeof b&&(b=[b]);if(!c.isArray(b)||!b.length||
2<b.length)throw Error("noUiSlider: 'start' option is incorrect.");a.b=b.length;a.start=b}function I(a,b){a.m=b;if("boolean"!==typeof b)throw Error("noUiSlider: 'snap' option must be a boolean.");}function J(a,b){if("lower"===b&&1===a.b)a.i=1;else if("upper"===b&&1===a.b)a.i=2;else if(!0===b&&2===a.b)a.i=3;else if(!1===b)a.i=0;else throw Error("noUiSlider: 'connect' option doesn't match handle count.");}function D(a,b){switch(b){case "horizontal":a.k=0;break;case "vertical":a.k=1;break;default:throw Error("noUiSlider: 'orientation' option is invalid.");
}}function K(a,b){if(2<a.c.length)throw Error("noUiSlider: 'margin' option is only supported on linear sliders.");a.margin=u(a.d,b);if(!m(b))throw Error("noUiSlider: 'margin' option must be numeric.");}function L(a,b){switch(b){case "ltr":a.dir=0;break;case "rtl":a.dir=1;a.i=[0,2,1,3][a.i];break;default:throw Error("noUiSlider: 'direction' option was not recognized.");}}function M(a,b){if("string"!==typeof b)throw Error("noUiSlider: 'behaviour' must be a string containing options.");var c=0<=b.indexOf("snap");
a.n={s:0<=b.indexOf("tap")||c,extend:0<=b.indexOf("extend"),v:0<=b.indexOf("drag"),fixed:0<=b.indexOf("fixed"),m:c}}function N(a,b,d){a.o=[b.lower,b.upper];a.g=b.format;c.each(a.o,function(a,e){if(!c.isArray(e))throw Error("noUiSlider: 'serialization."+(a?"upper":"lower")+"' must be an array.");c.each(e,function(){if(!(this instanceof c.Link))throw Error("noUiSlider: 'serialization."+(a?"upper":"lower")+"' can only contain Link instances.");this.I(a);this.J(d);this.q(b.format)})});a.dir&&1<a.b&&a.o.reverse()}
function O(a,b){var f={c:[],d:[],h:[!1],margin:0},g;g={step:{e:!1,f:d},start:{e:!0,f:E},connect:{e:!0,f:J},direction:{e:!0,f:L},range:{e:!0,f:n},snap:{e:!1,f:I},orientation:{e:!1,f:D},margin:{e:!1,f:K},behaviour:{e:!0,f:M},serialization:{e:!0,f:N}};a=c.extend({connect:!1,direction:"ltr",behaviour:"tap",orientation:"horizontal"},a);a.serialization=c.extend({lower:[],upper:[],format:{}},a.serialization);c.each(g,function(c,d){if(void 0===a[c]){if(d.e)throw Error("noUiSlider: '"+c+"' is required.");
return!0}d.f(f,a[c],b)});f.style=f.k?"top":"left";return f}function P(a,b){var d=c("<div><div/></div>").addClass(f[2]),g=["-lower","-upper"];a.dir&&g.reverse();d.children().addClass(f[3]+" "+f[3]+g[b]);return d}function Q(a,b){b.j&&(b=new c.Link({target:c(b.j).clone().appendTo(a),method:b.method,format:b.g},!0));return b}function R(a,b){var d,f=[];for(d=0;d<a.b;d++){var k=f,h=d,m=a.o[d],n=b[d].children(),r=a.g,s=void 0,v=[],s=new c.Link({},!0);s.q(r);v.push(s);for(s=0;s<m.length;s++)v.push(Q(n,m[s]));
k[h]=v}return f}function S(a,b,c){switch(a){case 1:b.addClass(f[7]);c[0].addClass(f[6]);break;case 3:c[1].addClass(f[6]);case 2:c[0].addClass(f[7]);case 0:b.addClass(f[6])}}function T(a,b){var c,d=[];for(c=0;c<a.b;c++)d.push(P(a,c).appendTo(b));return d}function U(a,b){b.addClass([f[0],f[8+a.dir],f[4+a.k]].join(" "));return c("<div/>").appendTo(b).addClass(f[1])}function V(d,b,m){function g(){return t[["width","height"][b.k]]()}function n(a){var b,c=[q.val()];for(b=0;b<a.length;b++)q.trigger(a[b],
c)}function u(d,p,e){var g=d[0]!==l[0][0]?1:0,H=x[0]+b.margin,k=x[1]-b.margin;e&&1<l.length&&(p=g?Math.max(p,H):Math.min(p,k));100>p&&(p=h(b,p));p=Math.max(Math.min(parseFloat(p.toFixed(7)),100),0);if(p===x[g])return 1===l.length?!1:p===H||p===k?0:!1;d.css(b.style,p+"%");d.is(":first-child")&&d.toggleClass(f[17],50<p);x[g]=p;b.dir&&(p=100-p);c(y[g]).each(function(){this.write(a(b,p),d.children(),q)});return!0}function B(a,b,c){c||k(q,f[14]);u(a,b,!1);n(["slide","set","change"])}function w(a,c,d,e){a=
a.replace(/\s/g,".nui ")+".nui";c.on(a,function(a){var c=q.attr("disabled");if(q.hasClass(f[14])||void 0!==c&&null!==c)return!1;a.preventDefault();var c=0===a.type.indexOf("touch"),p=0===a.type.indexOf("mouse"),F=0===a.type.indexOf("pointer"),g,k,l=a;0===a.type.indexOf("MSPointer")&&(F=!0);a.originalEvent&&(a=a.originalEvent);c&&(g=a.changedTouches[0].pageX,k=a.changedTouches[0].pageY);if(p||F)F||void 0!==window.pageXOffset||(window.pageXOffset=document.documentElement.scrollLeft,window.pageYOffset=
document.documentElement.scrollTop),g=a.clientX+window.pageXOffset,k=a.clientY+window.pageYOffset;l.C=[g,k];l.cursor=p;a=l;a.l=a.C[b.k];d(a,e)})}function C(a,c){var b=c.b||l,d,e=!1,e=100*(a.l-c.start)/g(),f=b[0][0]!==l[0][0]?1:0;var k=c.D;d=e+k[0];e+=k[1];1<b.length?(0>d&&(e+=Math.abs(d)),100<e&&(d-=e-100),d=[Math.max(Math.min(d,100),0),Math.max(Math.min(e,100),0)]):d=[d,e];e=u(b[0],d[f],1===b.length);1<b.length&&(e=u(b[1],d[f?0:1],!1)||e);e&&n(["slide"])}function s(a){c("."+f[15]).removeClass(f[15]);
a.cursor&&c("body").css("cursor","").off(".nui");G.off(".nui");q.removeClass(f[12]);n(["set","change"])}function v(a,b){1===b.b.length&&b.b[0].children().addClass(f[15]);a.stopPropagation();w(z.move,G,C,{start:a.l,b:b.b,D:[x[0],x[l.length-1]]});w(z.end,G,s,null);a.cursor&&(c("body").css("cursor",c(a.target).css("cursor")),1<l.length&&q.addClass(f[12]),c("body").on("selectstart.nui",!1))}function D(a){var d=a.l,e=0;a.stopPropagation();c.each(l,function(){e+=this.offset()[b.style]});e=d<e/2||1===l.length?
0:1;d-=t.offset()[b.style];d=100*d/g();B(l[e],d,b.n.m);b.n.m&&v(a,{b:[l[e]]})}function E(a){var c=(a=a.l<t.offset()[b.style])?0:100;a=a?0:l.length-1;B(l[a],c,!1)}var q=c(d),x=[-1,-1],t,y,l;if(q.hasClass(f[0]))throw Error("Slider was already initialized.");t=U(b,q);l=T(b,t);y=R(b,l);S(b.i,q,l);(function(a){var b;if(!a.fixed)for(b=0;b<l.length;b++)w(z.start,l[b].children(),v,{b:[l[b]]});a.s&&w(z.start,t,D,{b:l});a.extend&&(q.addClass(f[16]),a.s&&w(z.start,q,E,{b:l}));a.v&&(b=t.find("."+f[7]).addClass(f[10]),
a.fixed&&(b=b.add(t.children().not(b).children())),w(z.start,b,v,{b:l}))})(b.n);d.vSet=function(){var a=Array.prototype.slice.call(arguments,0),d,e,g,h,m,s,t=r(a[0]);"object"===typeof a[1]?(d=a[1].set,e=a[1].link,g=a[1].update,h=a[1].animate):!0===a[1]&&(d=!0);b.dir&&1<b.b&&t.reverse();h&&k(q,f[14]);a=1<l.length?3:1;1===t.length&&(a=1);for(m=0;m<a;m++)h=e||y[m%2][0],h=h.A(t[m%2]),!1!==h&&(h=A(b,h),b.dir&&(h=100-h),!0!==u(l[m%2],h,!0)&&c(y[m%2]).each(function(a){if(!a)return s=this.u,!0;this.write(s,
l[m%2].children(),q,g)}));!0===d&&n(["set"]);return this};d.vGet=function(){var a,c=[];for(a=0;a<b.b;a++)c[a]=y[a][0].F;return 1===c.length?c[0]:b.dir?c.reverse():c};d.destroy=function(){c.each(y,function(){c.each(this,function(){this.target&&this.target.off(".nui")})});c(this).off(".nui").removeClass(f.join(" ")).empty();return m};q.val(b.start)}function W(a){if(!this.length)throw Error("noUiSlider: Can't initialize slider on empty selection.");var b=O(a,this);return this.each(function(){V(this,
b,a)})}function X(a){return this.each(function(){var b=c(this).val(),d=this.destroy(),f=c.extend({},d,a);c(this).noUiSlider(f);d.start===f.start&&c(this).val(b)})}function B(){return this[0][arguments.length?"vSet":"vGet"].apply(this[0],arguments)}var G=c(document),C=c.fn.val,z=window.navigator.pointerEnabled?{start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled?{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}:{start:"mousedown touchstart",move:"mousemove touchmove",
end:"mouseup touchend"},f="noUi-target noUi-base noUi-origin noUi-handle noUi-horizontal noUi-vertical noUi-background noUi-connect noUi-ltr noUi-rtl noUi-dragable  noUi-state-drag  noUi-state-tap noUi-active noUi-extended noUi-stacking".split(" ");c.fn.val=function(){var a=arguments,b=c(this[0]);return arguments.length?this.each(function(){(c(this).hasClass(f[0])?B:C).apply(c(this),a)}):(b.hasClass(f[0])?B:C).call(b)};c.noUiSlider={Link:c.Link};c.fn.noUiSlider=function(a,b){return(b?X:W).call(this,
a)}})(window.jQuery||window.Zepto);
;
/*jslint regexp: true, browser: true, jquery: true, white: true, nomen: false, plusplus: false, maxerr: 500, indent: 4 */

(function(document, Math, undefined) { // performance/minified-size optimization
(function(factory) {
    if(typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (jQuery && !jQuery.fn.sparkline) {
        factory(jQuery);
    }
}
(function($) {
    'use strict';

    var UNSET_OPTION = {},
        getDefaults, createClass, SPFormat, clipval, quartile, normalizeValue, normalizeValues,
        remove, isNumber, all, sum, addCSS, ensureArray, formatNumber, RangeMap,
        MouseHandler, Tooltip, barHighlightMixin,
        line, bar, tristate, discrete, bullet, pie, box, defaultStyles, initStyles,
        VShape, VCanvas_base, VCanvas_canvas, VCanvas_vml, pending, shapeCount = 0;

    /**
     * Default configuration settings
     */
    getDefaults = function () {
        return {
            // Settings common to most/all chart types
            common: {
                type: 'line',
                lineColor: '#00f',
                fillColor: '#cdf',
                defaultPixelsPerValue: 3,
                width: 'auto',
                height: 'auto',
                composite: false,
                tagValuesAttribute: 'values',
                tagOptionsPrefix: 'spark',
                enableTagOptions: false,
                enableHighlight: true,
                highlightLighten: 1.4,
                tooltipSkipNull: true,
                tooltipPrefix: '',
                tooltipSuffix: '',
                disableHiddenCheck: false,
                numberFormatter: false,
                numberDigitGroupCount: 3,
                numberDigitGroupSep: ',',
                numberDecimalMark: '.',
                disableTooltips: false,
                disableInteraction: false
            },
            // Defaults for line charts
            line: {
                spotColor: '#f80',
                highlightSpotColor: '#5f5',
                highlightLineColor: '#f22',
                spotRadius: 1.5,
                minSpotColor: '#f80',
                maxSpotColor: '#f80',
                lineWidth: 1,
                normalRangeMin: undefined,
                normalRangeMax: undefined,
                normalRangeColor: '#ccc',
                drawNormalOnTop: false,
                chartRangeMin: undefined,
                chartRangeMax: undefined,
                chartRangeMinX: undefined,
                chartRangeMaxX: undefined,
                tooltipFormat: new SPFormat('<span style="color: {{color}}">&#9679;</span> {{prefix}}{{y}}{{suffix}}')
            },
            // Defaults for bar charts
            bar: {
                barColor: '#3366cc',
                negBarColor: '#f44',
                stackedBarColor: ['#3366cc', '#dc3912', '#ff9900', '#109618', '#66aa00',
                    '#dd4477', '#0099c6', '#990099'],
                zeroColor: undefined,
                nullColor: undefined,
                zeroAxis: true,
                barWidth: 4,
                barSpacing: 1,
                chartRangeMax: undefined,
                chartRangeMin: undefined,
                chartRangeClip: false,
                colorMap: undefined,
                tooltipFormat: new SPFormat('<span style="color: {{color}}">&#9679;</span> {{prefix}}{{value}}{{suffix}}')
            },
            // Defaults for tristate charts
            tristate: {
                barWidth: 4,
                barSpacing: 1,
                posBarColor: '#6f6',
                negBarColor: '#f44',
                zeroBarColor: '#999',
                colorMap: {},
                tooltipFormat: new SPFormat('<span style="color: {{color}}">&#9679;</span> {{value:map}}'),
                tooltipValueLookups: { map: { '-1': 'Loss', '0': 'Draw', '1': 'Win' } }
            },
            // Defaults for discrete charts
            discrete: {
                lineHeight: 'auto',
                thresholdColor: undefined,
                thresholdValue: 0,
                chartRangeMax: undefined,
                chartRangeMin: undefined,
                chartRangeClip: false,
                tooltipFormat: new SPFormat('{{prefix}}{{value}}{{suffix}}')
            },
            // Defaults for bullet charts
            bullet: {
                targetColor: '#f33',
                targetWidth: 3, // width of the target bar in pixels
                performanceColor: '#33f',
                rangeColors: ['#d3dafe', '#a8b6ff', '#7f94ff'],
                base: undefined, // set this to a number to change the base start number
                tooltipFormat: new SPFormat('{{fieldkey:fields}} - {{value}}'),
                tooltipValueLookups: { fields: {r: 'Range', p: 'Performance', t: 'Target'} }
            },
            // Defaults for pie charts
            pie: {
                offset: 0,
                sliceColors: ['#3366cc', '#dc3912', '#ff9900', '#109618', '#66aa00',
                    '#dd4477', '#0099c6', '#990099'],
                borderWidth: 0,
                borderColor: '#000',
                tooltipFormat: new SPFormat('<span style="color: {{color}}">&#9679;</span> {{value}} ({{percent.1}}%)')
            },
            // Defaults for box plots
            box: {
                raw: false,
                boxLineColor: '#000',
                boxFillColor: '#cdf',
                whiskerColor: '#000',
                outlierLineColor: '#333',
                outlierFillColor: '#fff',
                medianColor: '#f00',
                showOutliers: true,
                outlierIQR: 1.5,
                spotRadius: 1.5,
                target: undefined,
                targetColor: '#4a2',
                chartRangeMax: undefined,
                chartRangeMin: undefined,
                tooltipFormat: new SPFormat('{{field:fields}}: {{value}}'),
                tooltipFormatFieldlistKey: 'field',
                tooltipValueLookups: { fields: { lq: 'Lower Quartile', med: 'Median',
                    uq: 'Upper Quartile', lo: 'Left Outlier', ro: 'Right Outlier',
                    lw: 'Left Whisker', rw: 'Right Whisker'} }
            }
        };
    };

    // You can have tooltips use a css class other than jqstooltip by specifying tooltipClassname
    defaultStyles = '.jqstooltip { ' +
            'position: absolute;' +
            'left: 0px;' +
            'top: 0px;' +
            'visibility: hidden;' +
            'background: rgb(0, 0, 0) transparent;' +
            'background-color: rgba(0,0,0,0.6);' +
            'filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000);' +
            '-ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000)";' +
            'color: white;' +
            'font: 10px;' +
            'text-align: left;' +
            'white-space: nowrap;' +
            'padding: 5px;' +
            'border: 1px solid white;' +
            'z-index: 10000;' +
            '}' +
            '.jqsfield { ' +
            'color: white;' +
            'font: 10px arial, san serif;' +
            'text-align: left;' +
            '}';

    /**
     * Utilities
     */

    createClass = function (/* [baseclass, [mixin, ...]], definition */) {
        var Class, args;
        Class = function () {
            this.init.apply(this, arguments);
        };
        if (arguments.length > 1) {
            if (arguments[0]) {
                Class.prototype = $.extend(new arguments[0](), arguments[arguments.length - 1]);
                Class._super = arguments[0].prototype;
            } else {
                Class.prototype = arguments[arguments.length - 1];
            }
            if (arguments.length > 2) {
                args = Array.prototype.slice.call(arguments, 1, -1);
                args.unshift(Class.prototype);
                $.extend.apply($, args);
            }
        } else {
            Class.prototype = arguments[0];
        }
        Class.prototype.cls = Class;
        return Class;
    };

    /**
     * Wraps a format string for tooltips
     * {{x}}
     * {{x.2}
     * {{x:months}}
     */
    $.SPFormatClass = SPFormat = createClass({
        fre: /\{\{([\w.]+?)(:(.+?))?\}\}/g,
        precre: /(\w+)\.(\d+)/,

        init: function (format, fclass) {
            this.format = format;
            this.fclass = fclass;
        },

        render: function (fieldset, lookups, options) {
            var self = this,
                fields = fieldset,
                match, token, lookupkey, fieldvalue, prec;
            return this.format.replace(this.fre, function () {
                var lookup;
                token = arguments[1];
                lookupkey = arguments[3];
                match = self.precre.exec(token);
                if (match) {
                    prec = match[2];
                    token = match[1];
                } else {
                    prec = false;
                }
                fieldvalue = fields[token];
                if (fieldvalue === undefined) {
                    return '';
                }
                if (lookupkey && lookups && lookups[lookupkey]) {
                    lookup = lookups[lookupkey];
                    if (lookup.get) { // RangeMap
                        return lookups[lookupkey].get(fieldvalue) || fieldvalue;
                    } else {
                        return lookups[lookupkey][fieldvalue] || fieldvalue;
                    }
                }
                if (isNumber(fieldvalue)) {
                    if (options.get('numberFormatter')) {
                        fieldvalue = options.get('numberFormatter')(fieldvalue);
                    } else {
                        fieldvalue = formatNumber(fieldvalue, prec,
                            options.get('numberDigitGroupCount'),
                            options.get('numberDigitGroupSep'),
                            options.get('numberDecimalMark'));
                    }
                }
                return fieldvalue;
            });
        }
    });

    // convience method to avoid needing the new operator
    $.spformat = function(format, fclass) {
        return new SPFormat(format, fclass);
    };

    clipval = function (val, min, max) {
        if (val < min) {
            return min;
        }
        if (val > max) {
            return max;
        }
        return val;
    };

    quartile = function (values, q) {
        var vl;
        if (q === 2) {
            vl = Math.floor(values.length / 2);
            return values.length % 2 ? values[vl] : (values[vl-1] + values[vl]) / 2;
        } else {
            if (values.length % 2 ) { // odd
                vl = (values.length * q + q) / 4;
                return vl % 1 ? (values[Math.floor(vl)] + values[Math.floor(vl) - 1]) / 2 : values[vl-1];
            } else { //even
                vl = (values.length * q + 2) / 4;
                return vl % 1 ? (values[Math.floor(vl)] + values[Math.floor(vl) - 1]) / 2 :  values[vl-1];

            }
        }
    };

    normalizeValue = function (val) {
        var nf;
        switch (val) {
            case 'undefined':
                val = undefined;
                break;
            case 'null':
                val = null;
                break;
            case 'true':
                val = true;
                break;
            case 'false':
                val = false;
                break;
            default:
                nf = parseFloat(val);
                if (val == nf) {
                    val = nf;
                }
        }
        return val;
    };

    normalizeValues = function (vals) {
        var i, result = [];
        for (i = vals.length; i--;) {
            result[i] = normalizeValue(vals[i]);
        }
        return result;
    };

    remove = function (vals, filter) {
        var i, vl, result = [];
        for (i = 0, vl = vals.length; i < vl; i++) {
            if (vals[i] !== filter) {
                result.push(vals[i]);
            }
        }
        return result;
    };

    isNumber = function (num) {
        return !isNaN(parseFloat(num)) && isFinite(num);
    };

    formatNumber = function (num, prec, groupsize, groupsep, decsep) {
        var p, i;
        num = (prec === false ? parseFloat(num).toString() : num.toFixed(prec)).split('');
        p = (p = $.inArray('.', num)) < 0 ? num.length : p;
        if (p < num.length) {
            num[p] = decsep;
        }
        for (i = p - groupsize; i > 0; i -= groupsize) {
            num.splice(i, 0, groupsep);
        }
        return num.join('');
    };

    // determine if all values of an array match a value
    // returns true if the array is empty
    all = function (val, arr, ignoreNull) {
        var i;
        for (i = arr.length; i--; ) {
            if (ignoreNull && arr[i] === null) continue;
            if (arr[i] !== val) {
                return false;
            }
        }
        return true;
    };

    // sums the numeric values in an array, ignoring other values
    sum = function (vals) {
        var total = 0, i;
        for (i = vals.length; i--;) {
            total += typeof vals[i] === 'number' ? vals[i] : 0;
        }
        return total;
    };

    ensureArray = function (val) {
        return $.isArray(val) ? val : [val];
    };

    // http://paulirish.com/2008/bookmarklet-inject-new-css-rules/
    addCSS = function(css) {
        var tag;
        //if ('\v' == 'v') /* ie only */ {
        if (document.createStyleSheet) {
            document.createStyleSheet().cssText = css;
        } else {
            tag = document.createElement('style');
            tag.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(tag);
            tag[(typeof document.body.style.WebkitAppearance == 'string') /* webkit only */ ? 'innerText' : 'innerHTML'] = css;
        }
    };

    // Provide a cross-browser interface to a few simple drawing primitives
    $.fn.simpledraw = function (width, height, useExisting, interact) {
        var target, mhandler;
        if (useExisting && (target = this.data('_jqs_vcanvas'))) {
            return target;
        }

        if ($.fn.sparkline.canvas === false) {
            // We've already determined that neither Canvas nor VML are available
            return false;

        } else if ($.fn.sparkline.canvas === undefined) {
            // No function defined yet -- need to see if we support Canvas or VML
            var el = document.createElement('canvas');
            if (!!(el.getContext && el.getContext('2d'))) {
                // Canvas is available
                $.fn.sparkline.canvas = function(width, height, target, interact) {
                    return new VCanvas_canvas(width, height, target, interact);
                };
            } else if (document.namespaces && !document.namespaces.v) {
                // VML is available
                document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', '#default#VML');
                $.fn.sparkline.canvas = function(width, height, target, interact) {
                    return new VCanvas_vml(width, height, target);
                };
            } else {
                // Neither Canvas nor VML are available
                $.fn.sparkline.canvas = false;
                return false;
            }
        }

        if (width === undefined) {
            width = $(this).innerWidth();
        }
        if (height === undefined) {
            height = $(this).innerHeight();
        }

        target = $.fn.sparkline.canvas(width, height, this, interact);

        mhandler = $(this).data('_jqs_mhandler');
        if (mhandler) {
            mhandler.registerCanvas(target);
        }
        return target;
    };

    $.fn.cleardraw = function () {
        var target = this.data('_jqs_vcanvas');
        if (target) {
            target.reset();
        }
    };

    $.RangeMapClass = RangeMap = createClass({
        init: function (map) {
            var key, range, rangelist = [];
            for (key in map) {
                if (map.hasOwnProperty(key) && typeof key === 'string' && key.indexOf(':') > -1) {
                    range = key.split(':');
                    range[0] = range[0].length === 0 ? -Infinity : parseFloat(range[0]);
                    range[1] = range[1].length === 0 ? Infinity : parseFloat(range[1]);
                    range[2] = map[key];
                    rangelist.push(range);
                }
            }
            this.map = map;
            this.rangelist = rangelist || false;
        },

        get: function (value) {
            var rangelist = this.rangelist,
                i, range, result;
            if ((result = this.map[value]) !== undefined) {
                return result;
            }
            if (rangelist) {
                for (i = rangelist.length; i--;) {
                    range = rangelist[i];
                    if (range[0] <= value && range[1] >= value) {
                        return range[2];
                    }
                }
            }
            return undefined;
        }
    });

    // Convenience function
    $.range_map = function(map) {
        return new RangeMap(map);
    };

    MouseHandler = createClass({
        init: function (el, options) {
            var $el = $(el);
            this.$el = $el;
            this.options = options;
            this.currentPageX = 0;
            this.currentPageY = 0;
            this.el = el;
            this.splist = [];
            this.tooltip = null;
            this.over = false;
            this.displayTooltips = !options.get('disableTooltips');
            this.highlightEnabled = !options.get('disableHighlight');
        },

        registerSparkline: function (sp) {
            this.splist.push(sp);
            if (this.over) {
                this.updateDisplay();
            }
        },

        registerCanvas: function (canvas) {
            var $canvas = $(canvas.canvas);
            this.canvas = canvas;
            this.$canvas = $canvas;
            $canvas.mouseenter($.proxy(this.mouseenter, this));
            $canvas.mouseleave($.proxy(this.mouseleave, this));
            $canvas.click($.proxy(this.mouseclick, this));
        },

        reset: function (removeTooltip) {
            this.splist = [];
            if (this.tooltip && removeTooltip) {
                this.tooltip.remove();
                this.tooltip = undefined;
            }
        },

        mouseclick: function (e) {
            var clickEvent = $.Event('sparklineClick');
            clickEvent.originalEvent = e;
            clickEvent.sparklines = this.splist;
            this.$el.trigger(clickEvent);
        },

        mouseenter: function (e) {
            $(document.body).unbind('mousemove.jqs');
            $(document.body).bind('mousemove.jqs', $.proxy(this.mousemove, this));
            this.over = true;
            this.currentPageX = e.pageX;
            this.currentPageY = e.pageY;
            this.currentEl = e.target;
            if (!this.tooltip && this.displayTooltips) {
                this.tooltip = new Tooltip(this.options);
                this.tooltip.updatePosition(e.pageX, e.pageY);
            }
            this.updateDisplay();
        },

        mouseleave: function () {
            $(document.body).unbind('mousemove.jqs');
            var splist = this.splist,
                 spcount = splist.length,
                 needsRefresh = false,
                 sp, i;
            this.over = false;
            this.currentEl = null;

            if (this.tooltip) {
                this.tooltip.remove();
                this.tooltip = null;
            }

            for (i = 0; i < spcount; i++) {
                sp = splist[i];
                if (sp.clearRegionHighlight()) {
                    needsRefresh = true;
                }
            }

            if (needsRefresh) {
                this.canvas.render();
            }
        },

        mousemove: function (e) {
            this.currentPageX = e.pageX;
            this.currentPageY = e.pageY;
            this.currentEl = e.target;
            if (this.tooltip) {
                this.tooltip.updatePosition(e.pageX, e.pageY);
            }
            this.updateDisplay();
        },

        updateDisplay: function () {
            var splist = this.splist,
                 spcount = splist.length,
                 needsRefresh = false,
                 offset = this.$canvas.offset(),
                 localX = this.currentPageX - offset.left,
                 localY = this.currentPageY - offset.top,
                 tooltiphtml, sp, i, result, changeEvent;
            if (!this.over) {
                return;
            }
            for (i = 0; i < spcount; i++) {
                sp = splist[i];
                result = sp.setRegionHighlight(this.currentEl, localX, localY);
                if (result) {
                    needsRefresh = true;
                }
            }
            if (needsRefresh) {
                changeEvent = $.Event('sparklineRegionChange');
                changeEvent.sparklines = this.splist;
                this.$el.trigger(changeEvent);
                if (this.tooltip) {
                    tooltiphtml = '';
                    for (i = 0; i < spcount; i++) {
                        sp = splist[i];
                        tooltiphtml += sp.getCurrentRegionTooltip();
                    }
                    this.tooltip.setContent(tooltiphtml);
                }
                if (!this.disableHighlight) {
                    this.canvas.render();
                }
            }
            if (result === null) {
                this.mouseleave();
            }
        }
    });


    Tooltip = createClass({
        sizeStyle: 'position: static !important;' +
            'display: block !important;' +
            'visibility: hidden !important;' +
            'float: left !important;',

        init: function (options) {
            var tooltipClassname = options.get('tooltipClassname', 'jqstooltip'),
                sizetipStyle = this.sizeStyle,
                offset;
            this.container = options.get('tooltipContainer') || document.body;
            this.tooltipOffsetX = options.get('tooltipOffsetX', 10);
            this.tooltipOffsetY = options.get('tooltipOffsetY', 12);
            // remove any previous lingering tooltip
            $('#jqssizetip').remove();
            $('#jqstooltip').remove();
            this.sizetip = $('<div/>', {
                id: 'jqssizetip',
                style: sizetipStyle,
                'class': tooltipClassname
            });
            this.tooltip = $('<div/>', {
                id: 'jqstooltip',
                'class': tooltipClassname
            }).appendTo(this.container);
            // account for the container's location
            offset = this.tooltip.offset();
            this.offsetLeft = offset.left;
            this.offsetTop = offset.top;
            this.hidden = true;
            $(window).unbind('resize.jqs scroll.jqs');
            $(window).bind('resize.jqs scroll.jqs', $.proxy(this.updateWindowDims, this));
            this.updateWindowDims();
        },

        updateWindowDims: function () {
            this.scrollTop = $(window).scrollTop();
            this.scrollLeft = $(window).scrollLeft();
            this.scrollRight = this.scrollLeft + $(window).width();
            this.updatePosition();
        },

        getSize: function (content) {
            this.sizetip.html(content).appendTo(this.container);
            this.width = this.sizetip.width() + 1;
            this.height = this.sizetip.height();
            this.sizetip.remove();
        },

        setContent: function (content) {
            if (!content) {
                this.tooltip.css('visibility', 'hidden');
                this.hidden = true;
                return;
            }
            this.getSize(content);
            this.tooltip.html(content)
                .css({
                    'width': this.width + 12,
                    'height': this.height + 12,
                    'visibility': 'visible'
                });
            if (this.hidden) {
                this.hidden = false;
                this.updatePosition();
            }
        },

        updatePosition: function (x, y) {
            if (x === undefined) {
                if (this.mousex === undefined) {
                    return;
                }
                x = this.mousex - this.offsetLeft;
                y = this.mousey - this.offsetTop;

            } else {
                this.mousex = x = x - this.offsetLeft;
                this.mousey = y = y - this.offsetTop;
            }
            if (!this.height || !this.width || this.hidden) {
                return;
            }

            y -= this.height + this.tooltipOffsetY;
            x += this.tooltipOffsetX;

            if (y < this.scrollTop) {
                y = this.scrollTop;
            }
            if (x < this.scrollLeft) {
                x = this.scrollLeft;
            } else if (x + this.width > this.scrollRight) {
                x = this.scrollRight - this.width;
            }

            this.tooltip.css({
                'left': x,
                'top': y
            });
        },

        remove: function () {
            this.tooltip.remove();
            this.sizetip.remove();
            this.sizetip = this.tooltip = undefined;
            $(window).unbind('resize.jqs scroll.jqs');
        }
    });

    initStyles = function() {
        addCSS(defaultStyles);
    };

    $(initStyles);

    pending = [];
    $.fn.sparkline = function (userValues, userOptions) {
        return this.each(function () {
            var options = new $.fn.sparkline.options(this, userOptions),
                 $this = $(this),
                 render, i;
            render = function () {
                var values, width, height, tmp, mhandler, sp, vals;
                if (userValues === 'html' || userValues === undefined) {
                    vals = this.getAttribute(options.get('tagValuesAttribute'));
                    if (vals === undefined || vals === null) {
                        vals = $this.html();
                    }
                    values = vals.replace(/(^\s*<!--)|(-->\s*$)|\s+/g, '').split(',');
                } else {
                    values = userValues;
                }

                width = options.get('width') === 'auto' ? values.length * options.get('defaultPixelsPerValue') : options.get('width');
                if (options.get('height') === 'auto') {
                    if (!options.get('composite') || !$.data(this, '_jqs_vcanvas')) {
                        // must be a better way to get the line height
                        tmp = document.createElement('span');
                        tmp.innerHTML = 'a';
                        $this.html(tmp);
                        height = $(tmp).innerHeight() || $(tmp).height();
                        $(tmp).remove();
                        tmp = null;
                    }
                } else {
                    height = options.get('height');
                }

                if (!options.get('disableInteraction')) {
                    mhandler = $.data(this, '_jqs_mhandler');
                    if (!mhandler) {
                        mhandler = new MouseHandler(this, options);
                        $.data(this, '_jqs_mhandler', mhandler);
                    } else if (!options.get('composite')) {
                        mhandler.reset();
                    }
                } else {
                    mhandler = false;
                }

                if (options.get('composite') && !$.data(this, '_jqs_vcanvas')) {
                    if (!$.data(this, '_jqs_errnotify')) {
                        alert('Attempted to attach a composite sparkline to an element with no existing sparkline');
                        $.data(this, '_jqs_errnotify', true);
                    }
                    return;
                }

                sp = new $.fn.sparkline[options.get('type')](this, values, options, width, height);

                sp.render();

                if (mhandler) {
                    mhandler.registerSparkline(sp);
                }
            };
            if (($(this).html() && !options.get('disableHiddenCheck') && $(this).is(':hidden')) || !$(this).parents('body').length) {
                if (!options.get('composite') && $.data(this, '_jqs_pending')) {
                    // remove any existing references to the element
                    for (i = pending.length; i; i--) {
                        if (pending[i - 1][0] == this) {
                            pending.splice(i - 1, 1);
                        }
                    }
                }
                pending.push([this, render]);
                $.data(this, '_jqs_pending', true);
            } else {
                render.call(this);
            }
        });
    };

    $.fn.sparkline.defaults = getDefaults();


    $.sparkline_display_visible = function () {
        var el, i, pl;
        var done = [];
        for (i = 0, pl = pending.length; i < pl; i++) {
            el = pending[i][0];
            if ($(el).is(':visible') && !$(el).parents().is(':hidden')) {
                pending[i][1].call(el);
                $.data(pending[i][0], '_jqs_pending', false);
                done.push(i);
            } else if (!$(el).closest('html').length && !$.data(el, '_jqs_pending')) {
                // element has been inserted and removed from the DOM
                // If it was not yet inserted into the dom then the .data request
                // will return true.
                // removing from the dom causes the data to be removed.
                $.data(pending[i][0], '_jqs_pending', false);
                done.push(i);
            }
        }
        for (i = done.length; i; i--) {
            pending.splice(done[i - 1], 1);
        }
    };


    /**
     * User option handler
     */
    $.fn.sparkline.options = createClass({
        init: function (tag, userOptions) {
            var extendedOptions, defaults, base, tagOptionType;
            this.userOptions = userOptions = userOptions || {};
            this.tag = tag;
            this.tagValCache = {};
            defaults = $.fn.sparkline.defaults;
            base = defaults.common;
            this.tagOptionsPrefix = userOptions.enableTagOptions && (userOptions.tagOptionsPrefix || base.tagOptionsPrefix);

            tagOptionType = this.getTagSetting('type');
            if (tagOptionType === UNSET_OPTION) {
                extendedOptions = defaults[userOptions.type || base.type];
            } else {
                extendedOptions = defaults[tagOptionType];
            }
            this.mergedOptions = $.extend({}, base, extendedOptions, userOptions);
        },


        getTagSetting: function (key) {
            var prefix = this.tagOptionsPrefix,
                val, i, pairs, keyval;
            if (prefix === false || prefix === undefined) {
                return UNSET_OPTION;
            }
            if (this.tagValCache.hasOwnProperty(key)) {
                val = this.tagValCache.key;
            } else {
                val = this.tag.getAttribute(prefix + key);
                if (val === undefined || val === null) {
                    val = UNSET_OPTION;
                } else if (val.substr(0, 1) === '[') {
                    val = val.substr(1, val.length - 2).split(',');
                    for (i = val.length; i--;) {
                        val[i] = normalizeValue(val[i].replace(/(^\s*)|(\s*$)/g, ''));
                    }
                } else if (val.substr(0, 1) === '{') {
                    pairs = val.substr(1, val.length - 2).split(',');
                    val = {};
                    for (i = pairs.length; i--;) {
                        keyval = pairs[i].split(':', 2);
                        val[keyval[0].replace(/(^\s*)|(\s*$)/g, '')] = normalizeValue(keyval[1].replace(/(^\s*)|(\s*$)/g, ''));
                    }
                } else {
                    val = normalizeValue(val);
                }
                this.tagValCache.key = val;
            }
            return val;
        },

        get: function (key, defaultval) {
            var tagOption = this.getTagSetting(key),
                result;
            if (tagOption !== UNSET_OPTION) {
                return tagOption;
            }
            return (result = this.mergedOptions[key]) === undefined ? defaultval : result;
        }
    });


    $.fn.sparkline._base = createClass({
        disabled: false,

        init: function (el, values, options, width, height) {
            this.el = el;
            this.$el = $(el);
            this.values = values;
            this.options = options;
            this.width = width;
            this.height = height;
            this.currentRegion = undefined;
        },

        /**
         * Setup the canvas
         */
        initTarget: function () {
            var interactive = !this.options.get('disableInteraction');
            if (!(this.target = this.$el.simpledraw(this.width, this.height, this.options.get('composite'), interactive))) {
                this.disabled = true;
            } else {
                this.canvasWidth = this.target.pixelWidth;
                this.canvasHeight = this.target.pixelHeight;
            }
        },

        /**
         * Actually render the chart to the canvas
         */
        render: function () {
            if (this.disabled) {
                this.el.innerHTML = '';
                return false;
            }
            return true;
        },

        /**
         * Return a region id for a given x/y co-ordinate
         */
        getRegion: function (x, y) {
        },

        /**
         * Highlight an item based on the moused-over x,y co-ordinate
         */
        setRegionHighlight: function (el, x, y) {
            var currentRegion = this.currentRegion,
                highlightEnabled = !this.options.get('disableHighlight'),
                newRegion;
            if (x > this.canvasWidth || y > this.canvasHeight || x < 0 || y < 0) {
                return null;
            }
            newRegion = this.getRegion(el, x, y);
            if (currentRegion !== newRegion) {
                if (currentRegion !== undefined && highlightEnabled) {
                    this.removeHighlight();
                }
                this.currentRegion = newRegion;
                if (newRegion !== undefined && highlightEnabled) {
                    this.renderHighlight();
                }
                return true;
            }
            return false;
        },

        /**
         * Reset any currently highlighted item
         */
        clearRegionHighlight: function () {
            if (this.currentRegion !== undefined) {
                this.removeHighlight();
                this.currentRegion = undefined;
                return true;
            }
            return false;
        },

        renderHighlight: function () {
            this.changeHighlight(true);
        },

        removeHighlight: function () {
            this.changeHighlight(false);
        },

        changeHighlight: function (highlight)  {},

        /**
         * Fetch the HTML to display as a tooltip
         */
        getCurrentRegionTooltip: function () {
            var options = this.options,
                header = '',
                entries = [],
                fields, formats, formatlen, fclass, text, i,
                showFields, showFieldsKey, newFields, fv,
                formatter, format, fieldlen, j;
            if (this.currentRegion === undefined) {
                return '';
            }
            fields = this.getCurrentRegionFields();
            formatter = options.get('tooltipFormatter');
            if (formatter) {
                return formatter(this, options, fields);
            }
            if (options.get('tooltipChartTitle')) {
                header += '<div class="jqs jqstitle">' + options.get('tooltipChartTitle') + '</div>\n';
            }
            formats = this.options.get('tooltipFormat');
            if (!formats) {
                return '';
            }
            if (!$.isArray(formats)) {
                formats = [formats];
            }
            if (!$.isArray(fields)) {
                fields = [fields];
            }
            showFields = this.options.get('tooltipFormatFieldlist');
            showFieldsKey = this.options.get('tooltipFormatFieldlistKey');
            if (showFields && showFieldsKey) {
                // user-selected ordering of fields
                newFields = [];
                for (i = fields.length; i--;) {
                    fv = fields[i][showFieldsKey];
                    if ((j = $.inArray(fv, showFields)) != -1) {
                        newFields[j] = fields[i];
                    }
                }
                fields = newFields;
            }
            formatlen = formats.length;
            fieldlen = fields.length;
            for (i = 0; i < formatlen; i++) {
                format = formats[i];
                if (typeof format === 'string') {
                    format = new SPFormat(format);
                }
                fclass = format.fclass || 'jqsfield';
                for (j = 0; j < fieldlen; j++) {
                    if (!fields[j].isNull || !options.get('tooltipSkipNull')) {
                        $.extend(fields[j], {
                            prefix: options.get('tooltipPrefix'),
                            suffix: options.get('tooltipSuffix')
                        });
                        text = format.render(fields[j], options.get('tooltipValueLookups'), options);
                        entries.push('<div class="' + fclass + '">' + text + '</div>');
                    }
                }
            }
            if (entries.length) {
                return header + entries.join('\n');
            }
            return '';
        },

        getCurrentRegionFields: function () {},

        calcHighlightColor: function (color, options) {
            var highlightColor = options.get('highlightColor'),
                lighten = options.get('highlightLighten'),
                parse, mult, rgbnew, i;
            if (highlightColor) {
                return highlightColor;
            }
            if (lighten) {
                // extract RGB values
                parse = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(color) || /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(color);
                if (parse) {
                    rgbnew = [];
                    mult = color.length === 4 ? 16 : 1;
                    for (i = 0; i < 3; i++) {
                        rgbnew[i] = clipval(Math.round(parseInt(parse[i + 1], 16) * mult * lighten), 0, 255);
                    }
                    return 'rgb(' + rgbnew.join(',') + ')';
                }

            }
            return color;
        }

    });

    barHighlightMixin = {
        changeHighlight: function (highlight) {
            var currentRegion = this.currentRegion,
                target = this.target,
                shapeids = this.regionShapes[currentRegion],
                newShapes;
            // will be null if the region value was null
            if (shapeids) {
                newShapes = this.renderRegion(currentRegion, highlight);
                if ($.isArray(newShapes) || $.isArray(shapeids)) {
                    target.replaceWithShapes(shapeids, newShapes);
                    this.regionShapes[currentRegion] = $.map(newShapes, function (newShape) {
                        return newShape.id;
                    });
                } else {
                    target.replaceWithShape(shapeids, newShapes);
                    this.regionShapes[currentRegion] = newShapes.id;
                }
            }
        },

        render: function () {
            var values = this.values,
                target = this.target,
                regionShapes = this.regionShapes,
                shapes, ids, i, j;

            if (!this.cls._super.render.call(this)) {
                return;
            }
            for (i = values.length; i--;) {
                shapes = this.renderRegion(i);
                if (shapes) {
                    if ($.isArray(shapes)) {
                        ids = [];
                        for (j = shapes.length; j--;) {
                            shapes[j].append();
                            ids.push(shapes[j].id);
                        }
                        regionShapes[i] = ids;
                    } else {
                        shapes.append();
                        regionShapes[i] = shapes.id; // store just the shapeid
                    }
                } else {
                    // null value
                    regionShapes[i] = null;
                }
            }
            target.render();
        }
    };

    /**
     * Line charts
     */
    $.fn.sparkline.line = line = createClass($.fn.sparkline._base, {
        type: 'line',

        init: function (el, values, options, width, height) {
            line._super.init.call(this, el, values, options, width, height);
            this.vertices = [];
            this.regionMap = [];
            this.xvalues = [];
            this.yvalues = [];
            this.yminmax = [];
            this.hightlightSpotId = null;
            this.lastShapeId = null;
            this.initTarget();
        },

        getRegion: function (el, x, y) {
            var i,
                regionMap = this.regionMap; // maps regions to value positions
            for (i = regionMap.length; i--;) {
                if (regionMap[i] !== null && x >= regionMap[i][0] && x <= regionMap[i][1]) {
                    return regionMap[i][2];
                }
            }
            return undefined;
        },

        getCurrentRegionFields: function () {
            var currentRegion = this.currentRegion;
            return {
                isNull: this.yvalues[currentRegion] === null,
                x: this.xvalues[currentRegion],
                y: this.yvalues[currentRegion],
                color: this.options.get('lineColor'),
                fillColor: this.options.get('fillColor'),
                offset: currentRegion
            };
        },

        renderHighlight: function () {
            var currentRegion = this.currentRegion,
                target = this.target,
                vertex = this.vertices[currentRegion],
                options = this.options,
                spotRadius = options.get('spotRadius'),
                highlightSpotColor = options.get('highlightSpotColor'),
                highlightLineColor = options.get('highlightLineColor'),
                highlightSpot, highlightLine;

            if (!vertex) {
                return;
            }
            if (spotRadius && highlightSpotColor) {
                highlightSpot = target.drawCircle(vertex[0], vertex[1],
                    spotRadius, undefined, highlightSpotColor);
                this.highlightSpotId = highlightSpot.id;
                target.insertAfterShape(this.lastShapeId, highlightSpot);
            }
            if (highlightLineColor) {
                highlightLine = target.drawLine(vertex[0], this.canvasTop, vertex[0],
                    this.canvasTop + this.canvasHeight, highlightLineColor);
                this.highlightLineId = highlightLine.id;
                target.insertAfterShape(this.lastShapeId, highlightLine);
            }
        },

        removeHighlight: function () {
            var target = this.target;
            if (this.highlightSpotId) {
                target.removeShapeId(this.highlightSpotId);
                this.highlightSpotId = null;
            }
            if (this.highlightLineId) {
                target.removeShapeId(this.highlightLineId);
                this.highlightLineId = null;
            }
        },

        scanValues: function () {
            var values = this.values,
                valcount = values.length,
                xvalues = this.xvalues,
                yvalues = this.yvalues,
                yminmax = this.yminmax,
                i, val, isStr, isArray, sp;
            for (i = 0; i < valcount; i++) {
                val = values[i];
                isStr = typeof(values[i]) === 'string';
                isArray = typeof(values[i]) === 'object' && values[i] instanceof Array;
                sp = isStr && values[i].split(':');
                if (isStr && sp.length === 2) { // x:y
                    xvalues.push(Number(sp[0]));
                    yvalues.push(Number(sp[1]));
                    yminmax.push(Number(sp[1]));
                } else if (isArray) {
                    xvalues.push(val[0]);
                    yvalues.push(val[1]);
                    yminmax.push(val[1]);
                } else {
                    xvalues.push(i);
                    if (values[i] === null || values[i] === 'null') {
                        yvalues.push(null);
                    } else {
                        yvalues.push(Number(val));
                        yminmax.push(Number(val));
                    }
                }
            }
            if (this.options.get('xvalues')) {
                xvalues = this.options.get('xvalues');
            }

            this.maxy = this.maxyorg = Math.max.apply(Math, yminmax);
            this.miny = this.minyorg = Math.min.apply(Math, yminmax);

            this.maxx = Math.max.apply(Math, xvalues);
            this.minx = Math.min.apply(Math, xvalues);

            this.xvalues = xvalues;
            this.yvalues = yvalues;
            this.yminmax = yminmax;

        },

        processRangeOptions: function () {
            var options = this.options,
                normalRangeMin = options.get('normalRangeMin'),
                normalRangeMax = options.get('normalRangeMax');

            if (normalRangeMin !== undefined) {
                if (normalRangeMin < this.miny) {
                    this.miny = normalRangeMin;
                }
                if (normalRangeMax > this.maxy) {
                    this.maxy = normalRangeMax;
                }
            }
            if (options.get('chartRangeMin') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMin') < this.miny)) {
                this.miny = options.get('chartRangeMin');
            }
            if (options.get('chartRangeMax') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMax') > this.maxy)) {
                this.maxy = options.get('chartRangeMax');
            }
            if (options.get('chartRangeMinX') !== undefined && (options.get('chartRangeClipX') || options.get('chartRangeMinX') < this.minx)) {
                this.minx = options.get('chartRangeMinX');
            }
            if (options.get('chartRangeMaxX') !== undefined && (options.get('chartRangeClipX') || options.get('chartRangeMaxX') > this.maxx)) {
                this.maxx = options.get('chartRangeMaxX');
            }

        },

        drawNormalRange: function (canvasLeft, canvasTop, canvasHeight, canvasWidth, rangey) {
            var normalRangeMin = this.options.get('normalRangeMin'),
                normalRangeMax = this.options.get('normalRangeMax'),
                ytop = canvasTop + Math.round(canvasHeight - (canvasHeight * ((normalRangeMax - this.miny) / rangey))),
                height = Math.round((canvasHeight * (normalRangeMax - normalRangeMin)) / rangey);
            this.target.drawRect(canvasLeft, ytop, canvasWidth, height, undefined, this.options.get('normalRangeColor')).append();
        },

        render: function () {
            var options = this.options,
                target = this.target,
                canvasWidth = this.canvasWidth,
                canvasHeight = this.canvasHeight,
                vertices = this.vertices,
                spotRadius = options.get('spotRadius'),
                regionMap = this.regionMap,
                rangex, rangey, yvallast,
                canvasTop, canvasLeft,
                vertex, path, paths, x, y, xnext, xpos, xposnext,
                last, next, yvalcount, lineShapes, fillShapes, plen,
                valueSpots, hlSpotsEnabled, color, xvalues, yvalues, i;

            if (!line._super.render.call(this)) {
                return;
            }

            this.scanValues();
            this.processRangeOptions();

            xvalues = this.xvalues;
            yvalues = this.yvalues;

            if (!this.yminmax.length || this.yvalues.length < 2) {
                // empty or all null valuess
                return;
            }

            canvasTop = canvasLeft = 0;

            rangex = this.maxx - this.minx === 0 ? 1 : this.maxx - this.minx;
            rangey = this.maxy - this.miny === 0 ? 1 : this.maxy - this.miny;
            yvallast = this.yvalues.length - 1;

            if (spotRadius && (canvasWidth < (spotRadius * 4) || canvasHeight < (spotRadius * 4))) {
                spotRadius = 0;
            }
            if (spotRadius) {
                // adjust the canvas size as required so that spots will fit
                hlSpotsEnabled = options.get('highlightSpotColor') &&  !options.get('disableInteraction');
                if (hlSpotsEnabled || options.get('minSpotColor') || (options.get('spotColor') && yvalues[yvallast] === this.miny)) {
                    canvasHeight -= Math.ceil(spotRadius);
                }
                if (hlSpotsEnabled || options.get('maxSpotColor') || (options.get('spotColor') && yvalues[yvallast] === this.maxy)) {
                    canvasHeight -= Math.ceil(spotRadius);
                    canvasTop += Math.ceil(spotRadius);
                }
                if (hlSpotsEnabled ||
                     ((options.get('minSpotColor') || options.get('maxSpotColor')) && (yvalues[0] === this.miny || yvalues[0] === this.maxy))) {
                    canvasLeft += Math.ceil(spotRadius);
                    canvasWidth -= Math.ceil(spotRadius);
                }
                if (hlSpotsEnabled || options.get('spotColor') ||
                    (options.get('minSpotColor') || options.get('maxSpotColor') &&
                        (yvalues[yvallast] === this.miny || yvalues[yvallast] === this.maxy))) {
                    canvasWidth -= Math.ceil(spotRadius);
                }
            }


            canvasHeight--;

            if (options.get('normalRangeMin') !== undefined && !options.get('drawNormalOnTop')) {
                this.drawNormalRange(canvasLeft, canvasTop, canvasHeight, canvasWidth, rangey);
            }

            path = [];
            paths = [path];
            last = next = null;
            yvalcount = yvalues.length;
            for (i = 0; i < yvalcount; i++) {
                x = xvalues[i];
                xnext = xvalues[i + 1];
                y = yvalues[i];
                xpos = canvasLeft + Math.round((x - this.minx) * (canvasWidth / rangex));
                xposnext = i < yvalcount - 1 ? canvasLeft + Math.round((xnext - this.minx) * (canvasWidth / rangex)) : canvasWidth;
                next = xpos + ((xposnext - xpos) / 2);
                regionMap[i] = [last || 0, next, i];
                last = next;
                if (y === null) {
                    if (i) {
                        if (yvalues[i - 1] !== null) {
                            path = [];
                            paths.push(path);
                        }
                        vertices.push(null);
                    }
                } else {
                    if (y < this.miny) {
                        y = this.miny;
                    }
                    if (y > this.maxy) {
                        y = this.maxy;
                    }
                    if (!path.length) {
                        // previous value was null
                        path.push([xpos, canvasTop + canvasHeight]);
                    }
                    vertex = [xpos, canvasTop + Math.round(canvasHeight - (canvasHeight * ((y - this.miny) / rangey)))];
                    path.push(vertex);
                    vertices.push(vertex);
                }
            }

            lineShapes = [];
            fillShapes = [];
            plen = paths.length;
            for (i = 0; i < plen; i++) {
                path = paths[i];
                if (path.length) {
                    if (options.get('fillColor')) {
                        path.push([path[path.length - 1][0], (canvasTop + canvasHeight)]);
                        fillShapes.push(path.slice(0));
                        path.pop();
                    }
                    // if there's only a single point in this path, then we want to display it
                    // as a vertical line which means we keep path[0]  as is
                    if (path.length > 2) {
                        // else we want the first value
                        path[0] = [path[0][0], path[1][1]];
                    }
                    lineShapes.push(path);
                }
            }

            // draw the fill first, then optionally the normal range, then the line on top of that
            plen = fillShapes.length;
            for (i = 0; i < plen; i++) {
                target.drawShape(fillShapes[i],
                    options.get('fillColor'), options.get('fillColor')).append();
            }

            if (options.get('normalRangeMin') !== undefined && options.get('drawNormalOnTop')) {
                this.drawNormalRange(canvasLeft, canvasTop, canvasHeight, canvasWidth, rangey);
            }

            plen = lineShapes.length;
            for (i = 0; i < plen; i++) {
                target.drawShape(lineShapes[i], options.get('lineColor'), undefined,
                    options.get('lineWidth')).append();
            }

            if (spotRadius && options.get('valueSpots')) {
                valueSpots = options.get('valueSpots');
                if (valueSpots.get === undefined) {
                    valueSpots = new RangeMap(valueSpots);
                }
                for (i = 0; i < yvalcount; i++) {
                    color = valueSpots.get(yvalues[i]);
                    if (color) {
                        target.drawCircle(canvasLeft + Math.round((xvalues[i] - this.minx) * (canvasWidth / rangex)),
                            canvasTop + Math.round(canvasHeight - (canvasHeight * ((yvalues[i] - this.miny) / rangey))),
                            spotRadius, undefined,
                            color).append();
                    }
                }

            }
            if (spotRadius && options.get('spotColor') && yvalues[yvallast] !== null) {
                target.drawCircle(canvasLeft + Math.round((xvalues[xvalues.length - 1] - this.minx) * (canvasWidth / rangex)),
                    canvasTop + Math.round(canvasHeight - (canvasHeight * ((yvalues[yvallast] - this.miny) / rangey))),
                    spotRadius, undefined,
                    options.get('spotColor')).append();
            }
            if (this.maxy !== this.minyorg) {
                if (spotRadius && options.get('minSpotColor')) {
                    x = xvalues[$.inArray(this.minyorg, yvalues)];
                    target.drawCircle(canvasLeft + Math.round((x - this.minx) * (canvasWidth / rangex)),
                        canvasTop + Math.round(canvasHeight - (canvasHeight * ((this.minyorg - this.miny) / rangey))),
                        spotRadius, undefined,
                        options.get('minSpotColor')).append();
                }
                if (spotRadius && options.get('maxSpotColor')) {
                    x = xvalues[$.inArray(this.maxyorg, yvalues)];
                    target.drawCircle(canvasLeft + Math.round((x - this.minx) * (canvasWidth / rangex)),
                        canvasTop + Math.round(canvasHeight - (canvasHeight * ((this.maxyorg - this.miny) / rangey))),
                        spotRadius, undefined,
                        options.get('maxSpotColor')).append();
                }
            }

            this.lastShapeId = target.getLastShapeId();
            this.canvasTop = canvasTop;
            target.render();
        }
    });

    /**
     * Bar charts
     */
    $.fn.sparkline.bar = bar = createClass($.fn.sparkline._base, barHighlightMixin, {
        type: 'bar',

        init: function (el, values, options, width, height) {
            var barWidth = parseInt(options.get('barWidth'), 10),
                barSpacing = parseInt(options.get('barSpacing'), 10),
                chartRangeMin = options.get('chartRangeMin'),
                chartRangeMax = options.get('chartRangeMax'),
                chartRangeClip = options.get('chartRangeClip'),
                stackMin = Infinity,
                stackMax = -Infinity,
                isStackString, groupMin, groupMax, stackRanges,
                numValues, i, vlen, range, zeroAxis, xaxisOffset, min, max, clipMin, clipMax,
                stacked, vlist, j, slen, svals, val, yoffset, yMaxCalc, canvasHeightEf;
            bar._super.init.call(this, el, values, options, width, height);

            // scan values to determine whether to stack bars
            for (i = 0, vlen = values.length; i < vlen; i++) {
                val = values[i];
                isStackString = typeof(val) === 'string' && val.indexOf(':') > -1;
                if (isStackString || $.isArray(val)) {
                    stacked = true;
                    if (isStackString) {
                        val = values[i] = normalizeValues(val.split(':'));
                    }
                    val = remove(val, null); // min/max will treat null as zero
                    groupMin = Math.min.apply(Math, val);
                    groupMax = Math.max.apply(Math, val);
                    if (groupMin < stackMin) {
                        stackMin = groupMin;
                    }
                    if (groupMax > stackMax) {
                        stackMax = groupMax;
                    }
                }
            }

            this.stacked = stacked;
            this.regionShapes = {};
            this.barWidth = barWidth;
            this.barSpacing = barSpacing;
            this.totalBarWidth = barWidth + barSpacing;
            this.width = width = (values.length * barWidth) + ((values.length - 1) * barSpacing);

            this.initTarget();

            if (chartRangeClip) {
                clipMin = chartRangeMin === undefined ? -Infinity : chartRangeMin;
                clipMax = chartRangeMax === undefined ? Infinity : chartRangeMax;
            }

            numValues = [];
            stackRanges = stacked ? [] : numValues;
            var stackTotals = [];
            var stackRangesNeg = [];
            for (i = 0, vlen = values.length; i < vlen; i++) {
                if (stacked) {
                    vlist = values[i];
                    values[i] = svals = [];
                    stackTotals[i] = 0;
                    stackRanges[i] = stackRangesNeg[i] = 0;
                    for (j = 0, slen = vlist.length; j < slen; j++) {
                        val = svals[j] = chartRangeClip ? clipval(vlist[j], clipMin, clipMax) : vlist[j];
                        if (val !== null) {
                            if (val > 0) {
                                stackTotals[i] += val;
                            }
                            if (stackMin < 0 && stackMax > 0) {
                                if (val < 0) {
                                    stackRangesNeg[i] += Math.abs(val);
                                } else {
                                    stackRanges[i] += val;
                                }
                            } else {
                                stackRanges[i] += Math.abs(val - (val < 0 ? stackMax : stackMin));
                            }
                            numValues.push(val);
                        }
                    }
                } else {
                    val = chartRangeClip ? clipval(values[i], clipMin, clipMax) : values[i];
                    val = values[i] = normalizeValue(val);
                    if (val !== null) {
                        numValues.push(val);
                    }
                }
            }
            this.max = max = Math.max.apply(Math, numValues);
            this.min = min = Math.min.apply(Math, numValues);
            this.stackMax = stackMax = stacked ? Math.max.apply(Math, stackTotals) : max;
            this.stackMin = stackMin = stacked ? Math.min.apply(Math, numValues) : min;

            if (options.get('chartRangeMin') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMin') < min)) {
                min = options.get('chartRangeMin');
            }
            if (options.get('chartRangeMax') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMax') > max)) {
                max = options.get('chartRangeMax');
            }

            this.zeroAxis = zeroAxis = options.get('zeroAxis', true);
            if (min <= 0 && max >= 0 && zeroAxis) {
                xaxisOffset = 0;
            } else if (zeroAxis == false) {
                xaxisOffset = min;
            } else if (min > 0) {
                xaxisOffset = min;
            } else {
                xaxisOffset = max;
            }
            this.xaxisOffset = xaxisOffset;

            range = stacked ? (Math.max.apply(Math, stackRanges) + Math.max.apply(Math, stackRangesNeg)) : max - min;

            // as we plot zero/min values a single pixel line, we add a pixel to all other
            // values - Reduce the effective canvas size to suit
            this.canvasHeightEf = (zeroAxis && min < 0) ? this.canvasHeight - 2 : this.canvasHeight - 1;

            if (min < xaxisOffset) {
                yMaxCalc = (stacked && max >= 0) ? stackMax : max;
                yoffset = (yMaxCalc - xaxisOffset) / range * this.canvasHeight;
                if (yoffset !== Math.ceil(yoffset)) {
                    this.canvasHeightEf -= 2;
                    yoffset = Math.ceil(yoffset);
                }
            } else {
                yoffset = this.canvasHeight;
            }
            this.yoffset = yoffset;

            if ($.isArray(options.get('colorMap'))) {
                this.colorMapByIndex = options.get('colorMap');
                this.colorMapByValue = null;
            } else {
                this.colorMapByIndex = null;
                this.colorMapByValue = options.get('colorMap');
                if (this.colorMapByValue && this.colorMapByValue.get === undefined) {
                    this.colorMapByValue = new RangeMap(this.colorMapByValue);
                }
            }

            this.range = range;
        },

        getRegion: function (el, x, y) {
            var result = Math.floor(x / this.totalBarWidth);
            return (result < 0 || result >= this.values.length) ? undefined : result;
        },

        getCurrentRegionFields: function () {
            var currentRegion = this.currentRegion,
                values = ensureArray(this.values[currentRegion]),
                result = [],
                value, i;
            for (i = values.length; i--;) {
                value = values[i];
                result.push({
                    isNull: value === null,
                    value: value,
                    color: this.calcColor(i, value, currentRegion),
                    offset: currentRegion
                });
            }
            return result;
        },

        calcColor: function (stacknum, value, valuenum) {
            var colorMapByIndex = this.colorMapByIndex,
                colorMapByValue = this.colorMapByValue,
                options = this.options,
                color, newColor;
            if (this.stacked) {
                color = options.get('stackedBarColor');
            } else {
                color = (value < 0) ? options.get('negBarColor') : options.get('barColor');
            }
            if (value === 0 && options.get('zeroColor') !== undefined) {
                color = options.get('zeroColor');
            }
            if (colorMapByValue && (newColor = colorMapByValue.get(value))) {
                color = newColor;
            } else if (colorMapByIndex && colorMapByIndex.length > valuenum) {
                color = colorMapByIndex[valuenum];
            }
            return $.isArray(color) ? color[stacknum % color.length] : color;
        },

        /**
         * Render bar(s) for a region
         */
        renderRegion: function (valuenum, highlight) {
            var vals = this.values[valuenum],
                options = this.options,
                xaxisOffset = this.xaxisOffset,
                result = [],
                range = this.range,
                stacked = this.stacked,
                target = this.target,
                x = valuenum * this.totalBarWidth,
                canvasHeightEf = this.canvasHeightEf,
                yoffset = this.yoffset,
                y, height, color, isNull, yoffsetNeg, i, valcount, val, minPlotted, allMin;

            vals = $.isArray(vals) ? vals : [vals];
            valcount = vals.length;
            val = vals[0];
            isNull = all(null, vals);
            allMin = all(xaxisOffset, vals, true);

            if (isNull) {
                if (options.get('nullColor')) {
                    color = highlight ? options.get('nullColor') : this.calcHighlightColor(options.get('nullColor'), options);
                    y = (yoffset > 0) ? yoffset - 1 : yoffset;
                    return target.drawRect(x, y, this.barWidth - 1, 0, color, color);
                } else {
                    return undefined;
                }
            }
            yoffsetNeg = yoffset;
            for (i = 0; i < valcount; i++) {
                val = vals[i];

                if (stacked && val === xaxisOffset) {
                    if (!allMin || minPlotted) {
                        continue;
                    }
                    minPlotted = true;
                }

                if (range > 0) {
                    height = Math.floor(canvasHeightEf * ((Math.abs(val - xaxisOffset) / range))) + 1;
                } else {
                    height = 1;
                }
                if (val < xaxisOffset || (val === xaxisOffset && yoffset === 0)) {
                    y = yoffsetNeg;
                    yoffsetNeg += height;
                } else {
                    y = yoffset - height;
                    yoffset -= height;
                }
                color = this.calcColor(i, val, valuenum);
                if (highlight) {
                    color = this.calcHighlightColor(color, options);
                }
                result.push(target.drawRect(x, y, this.barWidth - 1, height - 1, color, color));
            }
            if (result.length === 1) {
                return result[0];
            }
            return result;
        }
    });

    /**
     * Tristate charts
     */
    $.fn.sparkline.tristate = tristate = createClass($.fn.sparkline._base, barHighlightMixin, {
        type: 'tristate',

        init: function (el, values, options, width, height) {
            var barWidth = parseInt(options.get('barWidth'), 10),
                barSpacing = parseInt(options.get('barSpacing'), 10);
            tristate._super.init.call(this, el, values, options, width, height);

            this.regionShapes = {};
            this.barWidth = barWidth;
            this.barSpacing = barSpacing;
            this.totalBarWidth = barWidth + barSpacing;
            this.values = $.map(values, Number);
            this.width = width = (values.length * barWidth) + ((values.length - 1) * barSpacing);

            if ($.isArray(options.get('colorMap'))) {
                this.colorMapByIndex = options.get('colorMap');
                this.colorMapByValue = null;
            } else {
                this.colorMapByIndex = null;
                this.colorMapByValue = options.get('colorMap');
                if (this.colorMapByValue && this.colorMapByValue.get === undefined) {
                    this.colorMapByValue = new RangeMap(this.colorMapByValue);
                }
            }
            this.initTarget();
        },

        getRegion: function (el, x, y) {
            return Math.floor(x / this.totalBarWidth);
        },

        getCurrentRegionFields: function () {
            var currentRegion = this.currentRegion;
            return {
                isNull: this.values[currentRegion] === undefined,
                value: this.values[currentRegion],
                color: this.calcColor(this.values[currentRegion], currentRegion),
                offset: currentRegion
            };
        },

        calcColor: function (value, valuenum) {
            var values = this.values,
                options = this.options,
                colorMapByIndex = this.colorMapByIndex,
                colorMapByValue = this.colorMapByValue,
                color, newColor;

            if (colorMapByValue && (newColor = colorMapByValue.get(value))) {
                color = newColor;
            } else if (colorMapByIndex && colorMapByIndex.length > valuenum) {
                color = colorMapByIndex[valuenum];
            } else if (values[valuenum] < 0) {
                color = options.get('negBarColor');
            } else if (values[valuenum] > 0) {
                color = options.get('posBarColor');
            } else {
                color = options.get('zeroBarColor');
            }
            return color;
        },

        renderRegion: function (valuenum, highlight) {
            var values = this.values,
                options = this.options,
                target = this.target,
                canvasHeight, height, halfHeight,
                x, y, color;

            canvasHeight = target.pixelHeight;
            halfHeight = Math.round(canvasHeight / 2);

            x = valuenum * this.totalBarWidth;
            if (values[valuenum] < 0) {
                y = halfHeight;
                height = halfHeight - 1;
            } else if (values[valuenum] > 0) {
                y = 0;
                height = halfHeight - 1;
            } else {
                y = halfHeight - 1;
                height = 2;
            }
            color = this.calcColor(values[valuenum], valuenum);
            if (color === null) {
                return;
            }
            if (highlight) {
                color = this.calcHighlightColor(color, options);
            }
            return target.drawRect(x, y, this.barWidth - 1, height - 1, color, color);
        }
    });

    /**
     * Discrete charts
     */
    $.fn.sparkline.discrete = discrete = createClass($.fn.sparkline._base, barHighlightMixin, {
        type: 'discrete',

        init: function (el, values, options, width, height) {
            discrete._super.init.call(this, el, values, options, width, height);

            this.regionShapes = {};
            this.values = values = $.map(values, Number);
            this.min = Math.min.apply(Math, values);
            this.max = Math.max.apply(Math, values);
            this.range = this.max - this.min;
            this.width = width = options.get('width') === 'auto' ? values.length * 2 : this.width;
            this.interval = Math.floor(width / values.length);
            this.itemWidth = width / values.length;
            if (options.get('chartRangeMin') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMin') < this.min)) {
                this.min = options.get('chartRangeMin');
            }
            if (options.get('chartRangeMax') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMax') > this.max)) {
                this.max = options.get('chartRangeMax');
            }
            this.initTarget();
            if (this.target) {
                this.lineHeight = options.get('lineHeight') === 'auto' ? Math.round(this.canvasHeight * 0.3) : options.get('lineHeight');
            }
        },

        getRegion: function (el, x, y) {
            return Math.floor(x / this.itemWidth);
        },

        getCurrentRegionFields: function () {
            var currentRegion = this.currentRegion;
            return {
                isNull: this.values[currentRegion] === undefined,
                value: this.values[currentRegion],
                offset: currentRegion
            };
        },

        renderRegion: function (valuenum, highlight) {
            var values = this.values,
                options = this.options,
                min = this.min,
                max = this.max,
                range = this.range,
                interval = this.interval,
                target = this.target,
                canvasHeight = this.canvasHeight,
                lineHeight = this.lineHeight,
                pheight = canvasHeight - lineHeight,
                ytop, val, color, x;

            val = clipval(values[valuenum], min, max);
            x = valuenum * interval;
            ytop = Math.round(pheight - pheight * ((val - min) / range));
            color = (options.get('thresholdColor') && val < options.get('thresholdValue')) ? options.get('thresholdColor') : options.get('lineColor');
            if (highlight) {
                color = this.calcHighlightColor(color, options);
            }
            return target.drawLine(x, ytop, x, ytop + lineHeight, color);
        }
    });

    /**
     * Bullet charts
     */
    $.fn.sparkline.bullet = bullet = createClass($.fn.sparkline._base, {
        type: 'bullet',

        init: function (el, values, options, width, height) {
            var min, max, vals;
            bullet._super.init.call(this, el, values, options, width, height);

            // values: target, performance, range1, range2, range3
            this.values = values = normalizeValues(values);
            // target or performance could be null
            vals = values.slice();
            vals[0] = vals[0] === null ? vals[2] : vals[0];
            vals[1] = values[1] === null ? vals[2] : vals[1];
            min = Math.min.apply(Math, values);
            max = Math.max.apply(Math, values);
            if (options.get('base') === undefined) {
                min = min < 0 ? min : 0;
            } else {
                min = options.get('base');
            }
            this.min = min;
            this.max = max;
            this.range = max - min;
            this.shapes = {};
            this.valueShapes = {};
            this.regiondata = {};
            this.width = width = options.get('width') === 'auto' ? '4.0em' : width;
            this.target = this.$el.simpledraw(width, height, options.get('composite'));
            if (!values.length) {
                this.disabled = true;
            }
            this.initTarget();
        },

        getRegion: function (el, x, y) {
            var shapeid = this.target.getShapeAt(el, x, y);
            return (shapeid !== undefined && this.shapes[shapeid] !== undefined) ? this.shapes[shapeid] : undefined;
        },

        getCurrentRegionFields: function () {
            var currentRegion = this.currentRegion;
            return {
                fieldkey: currentRegion.substr(0, 1),
                value: this.values[currentRegion.substr(1)],
                region: currentRegion
            };
        },

        changeHighlight: function (highlight) {
            var currentRegion = this.currentRegion,
                shapeid = this.valueShapes[currentRegion],
                shape;
            delete this.shapes[shapeid];
            switch (currentRegion.substr(0, 1)) {
                case 'r':
                    shape = this.renderRange(currentRegion.substr(1), highlight);
                    break;
                case 'p':
                    shape = this.renderPerformance(highlight);
                    break;
                case 't':
                    shape = this.renderTarget(highlight);
                    break;
            }
            this.valueShapes[currentRegion] = shape.id;
            this.shapes[shape.id] = currentRegion;
            this.target.replaceWithShape(shapeid, shape);
        },

        renderRange: function (rn, highlight) {
            var rangeval = this.values[rn],
                rangewidth = Math.round(this.canvasWidth * ((rangeval - this.min) / this.range)),
                color = this.options.get('rangeColors')[rn - 2];
            if (highlight) {
                color = this.calcHighlightColor(color, this.options);
            }
            return this.target.drawRect(0, 0, rangewidth - 1, this.canvasHeight - 1, color, color);
        },

        renderPerformance: function (highlight) {
            var perfval = this.values[1],
                perfwidth = Math.round(this.canvasWidth * ((perfval - this.min) / this.range)),
                color = this.options.get('performanceColor');
            if (highlight) {
                color = this.calcHighlightColor(color, this.options);
            }
            return this.target.drawRect(0, Math.round(this.canvasHeight * 0.3), perfwidth - 1,
                Math.round(this.canvasHeight * 0.4) - 1, color, color);
        },

        renderTarget: function (highlight) {
            var targetval = this.values[0],
                x = Math.round(this.canvasWidth * ((targetval - this.min) / this.range) - (this.options.get('targetWidth') / 2)),
                targettop = Math.round(this.canvasHeight * 0.10),
                targetheight = this.canvasHeight - (targettop * 2),
                color = this.options.get('targetColor');
            if (highlight) {
                color = this.calcHighlightColor(color, this.options);
            }
            return this.target.drawRect(x, targettop, this.options.get('targetWidth') - 1, targetheight - 1, color, color);
        },

        render: function () {
            var vlen = this.values.length,
                target = this.target,
                i, shape;
            if (!bullet._super.render.call(this)) {
                return;
            }
            for (i = 2; i < vlen; i++) {
                shape = this.renderRange(i).append();
                this.shapes[shape.id] = 'r' + i;
                this.valueShapes['r' + i] = shape.id;
            }
            if (this.values[1] !== null) {
                shape = this.renderPerformance().append();
                this.shapes[shape.id] = 'p1';
                this.valueShapes.p1 = shape.id;
            }
            if (this.values[0] !== null) {
                shape = this.renderTarget().append();
                this.shapes[shape.id] = 't0';
                this.valueShapes.t0 = shape.id;
            }
            target.render();
        }
    });

    /**
     * Pie charts
     */
    $.fn.sparkline.pie = pie = createClass($.fn.sparkline._base, {
        type: 'pie',

        init: function (el, values, options, width, height) {
            var total = 0, i;

            pie._super.init.call(this, el, values, options, width, height);

            this.shapes = {}; // map shape ids to value offsets
            this.valueShapes = {}; // maps value offsets to shape ids
            this.values = values = $.map(values, Number);

            if (options.get('width') === 'auto') {
                this.width = this.height;
            }

            if (values.length > 0) {
                for (i = values.length; i--;) {
                    total += values[i];
                }
            }
            this.total = total;
            this.initTarget();
            this.radius = Math.floor(Math.min(this.canvasWidth, this.canvasHeight) / 2);
        },

        getRegion: function (el, x, y) {
            var shapeid = this.target.getShapeAt(el, x, y);
            return (shapeid !== undefined && this.shapes[shapeid] !== undefined) ? this.shapes[shapeid] : undefined;
        },

        getCurrentRegionFields: function () {
            var currentRegion = this.currentRegion;
            return {
                isNull: this.values[currentRegion] === undefined,
                value: this.values[currentRegion],
                percent: this.values[currentRegion] / this.total * 100,
                color: this.options.get('sliceColors')[currentRegion % this.options.get('sliceColors').length],
                offset: currentRegion
            };
        },

        changeHighlight: function (highlight) {
            var currentRegion = this.currentRegion,
                 newslice = this.renderSlice(currentRegion, highlight),
                 shapeid = this.valueShapes[currentRegion];
            delete this.shapes[shapeid];
            this.target.replaceWithShape(shapeid, newslice);
            this.valueShapes[currentRegion] = newslice.id;
            this.shapes[newslice.id] = currentRegion;
        },

        renderSlice: function (valuenum, highlight) {
            var target = this.target,
                options = this.options,
                radius = this.radius,
                borderWidth = options.get('borderWidth'),
                offset = options.get('offset'),
                circle = 2 * Math.PI,
                values = this.values,
                total = this.total,
                next = offset ? (2*Math.PI)*(offset/360) : 0,
                start, end, i, vlen, color;

            vlen = values.length;
            for (i = 0; i < vlen; i++) {
                start = next;
                end = next;
                if (total > 0) {  // avoid divide by zero
                    end = next + (circle * (values[i] / total));
                }
                if (valuenum === i) {
                    color = options.get('sliceColors')[i % options.get('sliceColors').length];
                    if (highlight) {
                        color = this.calcHighlightColor(color, options);
                    }

                    return target.drawPieSlice(radius, radius, radius - borderWidth, start, end, undefined, color);
                }
                next = end;
            }
        },

        render: function () {
            var target = this.target,
                values = this.values,
                options = this.options,
                radius = this.radius,
                borderWidth = options.get('borderWidth'),
                shape, i;

            if (!pie._super.render.call(this)) {
                return;
            }
            if (borderWidth) {
                target.drawCircle(radius, radius, Math.floor(radius - (borderWidth / 2)),
                    options.get('borderColor'), undefined, borderWidth).append();
            }
            for (i = values.length; i--;) {
                if (values[i]) { // don't render zero values
                    shape = this.renderSlice(i).append();
                    this.valueShapes[i] = shape.id; // store just the shapeid
                    this.shapes[shape.id] = i;
                }
            }
            target.render();
        }
    });

    /**
     * Box plots
     */
    $.fn.sparkline.box = box = createClass($.fn.sparkline._base, {
        type: 'box',

        init: function (el, values, options, width, height) {
            box._super.init.call(this, el, values, options, width, height);
            this.values = $.map(values, Number);
            this.width = options.get('width') === 'auto' ? '4.0em' : width;
            this.initTarget();
            if (!this.values.length) {
                this.disabled = 1;
            }
        },

        /**
         * Simulate a single region
         */
        getRegion: function () {
            return 1;
        },

        getCurrentRegionFields: function () {
            var result = [
                { field: 'lq', value: this.quartiles[0] },
                { field: 'med', value: this.quartiles[1] },
                { field: 'uq', value: this.quartiles[2] }
            ];
            if (this.loutlier !== undefined) {
                result.push({ field: 'lo', value: this.loutlier});
            }
            if (this.routlier !== undefined) {
                result.push({ field: 'ro', value: this.routlier});
            }
            if (this.lwhisker !== undefined) {
                result.push({ field: 'lw', value: this.lwhisker});
            }
            if (this.rwhisker !== undefined) {
                result.push({ field: 'rw', value: this.rwhisker});
            }
            return result;
        },

        render: function () {
            var target = this.target,
                values = this.values,
                vlen = values.length,
                options = this.options,
                canvasWidth = this.canvasWidth,
                canvasHeight = this.canvasHeight,
                minValue = options.get('chartRangeMin') === undefined ? Math.min.apply(Math, values) : options.get('chartRangeMin'),
                maxValue = options.get('chartRangeMax') === undefined ? Math.max.apply(Math, values) : options.get('chartRangeMax'),
                canvasLeft = 0,
                lwhisker, loutlier, iqr, q1, q2, q3, rwhisker, routlier, i,
                size, unitSize;

            if (!box._super.render.call(this)) {
                return;
            }

            if (options.get('raw')) {
                if (options.get('showOutliers') && values.length > 5) {
                    loutlier = values[0];
                    lwhisker = values[1];
                    q1 = values[2];
                    q2 = values[3];
                    q3 = values[4];
                    rwhisker = values[5];
                    routlier = values[6];
                } else {
                    lwhisker = values[0];
                    q1 = values[1];
                    q2 = values[2];
                    q3 = values[3];
                    rwhisker = values[4];
                }
            } else {
                values.sort(function (a, b) { return a - b; });
                q1 = quartile(values, 1);
                q2 = quartile(values, 2);
                q3 = quartile(values, 3);
                iqr = q3 - q1;
                if (options.get('showOutliers')) {
                    lwhisker = rwhisker = undefined;
                    for (i = 0; i < vlen; i++) {
                        if (lwhisker === undefined && values[i] > q1 - (iqr * options.get('outlierIQR'))) {
                            lwhisker = values[i];
                        }
                        if (values[i] < q3 + (iqr * options.get('outlierIQR'))) {
                            rwhisker = values[i];
                        }
                    }
                    loutlier = values[0];
                    routlier = values[vlen - 1];
                } else {
                    lwhisker = values[0];
                    rwhisker = values[vlen - 1];
                }
            }
            this.quartiles = [q1, q2, q3];
            this.lwhisker = lwhisker;
            this.rwhisker = rwhisker;
            this.loutlier = loutlier;
            this.routlier = routlier;

            unitSize = canvasWidth / (maxValue - minValue + 1);
            if (options.get('showOutliers')) {
                canvasLeft = Math.ceil(options.get('spotRadius'));
                canvasWidth -= 2 * Math.ceil(options.get('spotRadius'));
                unitSize = canvasWidth / (maxValue - minValue + 1);
                if (loutlier < lwhisker) {
                    target.drawCircle((loutlier - minValue) * unitSize + canvasLeft,
                        canvasHeight / 2,
                        options.get('spotRadius'),
                        options.get('outlierLineColor'),
                        options.get('outlierFillColor')).append();
                }
                if (routlier > rwhisker) {
                    target.drawCircle((routlier - minValue) * unitSize + canvasLeft,
                        canvasHeight / 2,
                        options.get('spotRadius'),
                        options.get('outlierLineColor'),
                        options.get('outlierFillColor')).append();
                }
            }

            // box
            target.drawRect(
                Math.round((q1 - minValue) * unitSize + canvasLeft),
                Math.round(canvasHeight * 0.1),
                Math.round((q3 - q1) * unitSize),
                Math.round(canvasHeight * 0.8),
                options.get('boxLineColor'),
                options.get('boxFillColor')).append();
            // left whisker
            target.drawLine(
                Math.round((lwhisker - minValue) * unitSize + canvasLeft),
                Math.round(canvasHeight / 2),
                Math.round((q1 - minValue) * unitSize + canvasLeft),
                Math.round(canvasHeight / 2),
                options.get('lineColor')).append();
            target.drawLine(
                Math.round((lwhisker - minValue) * unitSize + canvasLeft),
                Math.round(canvasHeight / 4),
                Math.round((lwhisker - minValue) * unitSize + canvasLeft),
                Math.round(canvasHeight - canvasHeight / 4),
                options.get('whiskerColor')).append();
            // right whisker
            target.drawLine(Math.round((rwhisker - minValue) * unitSize + canvasLeft),
                Math.round(canvasHeight / 2),
                Math.round((q3 - minValue) * unitSize + canvasLeft),
                Math.round(canvasHeight / 2),
                options.get('lineColor')).append();
            target.drawLine(
                Math.round((rwhisker - minValue) * unitSize + canvasLeft),
                Math.round(canvasHeight / 4),
                Math.round((rwhisker - minValue) * unitSize + canvasLeft),
                Math.round(canvasHeight - canvasHeight / 4),
                options.get('whiskerColor')).append();
            // median line
            target.drawLine(
                Math.round((q2 - minValue) * unitSize + canvasLeft),
                Math.round(canvasHeight * 0.1),
                Math.round((q2 - minValue) * unitSize + canvasLeft),
                Math.round(canvasHeight * 0.9),
                options.get('medianColor')).append();
            if (options.get('target')) {
                size = Math.ceil(options.get('spotRadius'));
                target.drawLine(
                    Math.round((options.get('target') - minValue) * unitSize + canvasLeft),
                    Math.round((canvasHeight / 2) - size),
                    Math.round((options.get('target') - minValue) * unitSize + canvasLeft),
                    Math.round((canvasHeight / 2) + size),
                    options.get('targetColor')).append();
                target.drawLine(
                    Math.round((options.get('target') - minValue) * unitSize + canvasLeft - size),
                    Math.round(canvasHeight / 2),
                    Math.round((options.get('target') - minValue) * unitSize + canvasLeft + size),
                    Math.round(canvasHeight / 2),
                    options.get('targetColor')).append();
            }
            target.render();
        }
    });

    // Setup a very simple "virtual canvas" to make drawing the few shapes we need easier
    // This is accessible as $(foo).simpledraw()

    VShape = createClass({
        init: function (target, id, type, args) {
            this.target = target;
            this.id = id;
            this.type = type;
            this.args = args;
        },
        append: function () {
            this.target.appendShape(this);
            return this;
        }
    });

    VCanvas_base = createClass({
        _pxregex: /(\d+)(px)?\s*$/i,

        init: function (width, height, target) {
            if (!width) {
                return;
            }
            this.width = width;
            this.height = height;
            this.target = target;
            this.lastShapeId = null;
            if (target[0]) {
                target = target[0];
            }
            $.data(target, '_jqs_vcanvas', this);
        },

        drawLine: function (x1, y1, x2, y2, lineColor, lineWidth) {
            return this.drawShape([[x1, y1], [x2, y2]], lineColor, lineWidth);
        },

        drawShape: function (path, lineColor, fillColor, lineWidth) {
            return this._genShape('Shape', [path, lineColor, fillColor, lineWidth]);
        },

        drawCircle: function (x, y, radius, lineColor, fillColor, lineWidth) {
            return this._genShape('Circle', [x, y, radius, lineColor, fillColor, lineWidth]);
        },

        drawPieSlice: function (x, y, radius, startAngle, endAngle, lineColor, fillColor) {
            return this._genShape('PieSlice', [x, y, radius, startAngle, endAngle, lineColor, fillColor]);
        },

        drawRect: function (x, y, width, height, lineColor, fillColor) {
            return this._genShape('Rect', [x, y, width, height, lineColor, fillColor]);
        },

        getElement: function () {
            return this.canvas;
        },

        /**
         * Return the most recently inserted shape id
         */
        getLastShapeId: function () {
            return this.lastShapeId;
        },

        /**
         * Clear and reset the canvas
         */
        reset: function () {
            alert('reset not implemented');
        },

        _insert: function (el, target) {
            $(target).html(el);
        },

        /**
         * Calculate the pixel dimensions of the canvas
         */
        _calculatePixelDims: function (width, height, canvas) {
            // XXX This should probably be a configurable option
            var match;
            match = this._pxregex.exec(height);
            if (match) {
                this.pixelHeight = match[1];
            } else {
                this.pixelHeight = $(canvas).height();
            }
            match = this._pxregex.exec(width);
            if (match) {
                this.pixelWidth = match[1];
            } else {
                this.pixelWidth = $(canvas).width();
            }
        },

        /**
         * Generate a shape object and id for later rendering
         */
        _genShape: function (shapetype, shapeargs) {
            var id = shapeCount++;
            shapeargs.unshift(id);
            return new VShape(this, id, shapetype, shapeargs);
        },

        /**
         * Add a shape to the end of the render queue
         */
        appendShape: function (shape) {
            alert('appendShape not implemented');
        },

        /**
         * Replace one shape with another
         */
        replaceWithShape: function (shapeid, shape) {
            alert('replaceWithShape not implemented');
        },

        /**
         * Insert one shape after another in the render queue
         */
        insertAfterShape: function (shapeid, shape) {
            alert('insertAfterShape not implemented');
        },

        /**
         * Remove a shape from the queue
         */
        removeShapeId: function (shapeid) {
            alert('removeShapeId not implemented');
        },

        /**
         * Find a shape at the specified x/y co-ordinates
         */
        getShapeAt: function (el, x, y) {
            alert('getShapeAt not implemented');
        },

        /**
         * Render all queued shapes onto the canvas
         */
        render: function () {
            alert('render not implemented');
        }
    });

    VCanvas_canvas = createClass(VCanvas_base, {
        init: function (width, height, target, interact) {
            VCanvas_canvas._super.init.call(this, width, height, target);
            this.canvas = document.createElement('canvas');
            if (target[0]) {
                target = target[0];
            }
            $.data(target, '_jqs_vcanvas', this);
            $(this.canvas).css({ display: 'inline-block', width: width, height: height, verticalAlign: 'top' });
            this._insert(this.canvas, target);
            this._calculatePixelDims(width, height, this.canvas);
            this.canvas.width = this.pixelWidth;
            this.canvas.height = this.pixelHeight;
            this.interact = interact;
            this.shapes = {};
            this.shapeseq = [];
            this.currentTargetShapeId = undefined;
            $(this.canvas).css({width: this.pixelWidth, height: this.pixelHeight});
        },

        _getContext: function (lineColor, fillColor, lineWidth) {
            var context = this.canvas.getContext('2d');
            if (lineColor !== undefined) {
                context.strokeStyle = lineColor;
            }
            context.lineWidth = lineWidth === undefined ? 1 : lineWidth;
            if (fillColor !== undefined) {
                context.fillStyle = fillColor;
            }
            return context;
        },

        reset: function () {
            var context = this._getContext();
            context.clearRect(0, 0, this.pixelWidth, this.pixelHeight);
            this.shapes = {};
            this.shapeseq = [];
            this.currentTargetShapeId = undefined;
        },

        _drawShape: function (shapeid, path, lineColor, fillColor, lineWidth) {
            var context = this._getContext(lineColor, fillColor, lineWidth),
                i, plen;
            context.beginPath();
            context.moveTo(path[0][0] + 0.5, path[0][1] + 0.5);
            for (i = 1, plen = path.length; i < plen; i++) {
                context.lineTo(path[i][0] + 0.5, path[i][1] + 0.5); // the 0.5 offset gives us crisp pixel-width lines
            }
            if (lineColor !== undefined) {
                context.stroke();
            }
            if (fillColor !== undefined) {
                context.fill();
            }
            if (this.targetX !== undefined && this.targetY !== undefined &&
                context.isPointInPath(this.targetX, this.targetY)) {
                this.currentTargetShapeId = shapeid;
            }
        },

        _drawCircle: function (shapeid, x, y, radius, lineColor, fillColor, lineWidth) {
            var context = this._getContext(lineColor, fillColor, lineWidth);
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI, false);
            if (this.targetX !== undefined && this.targetY !== undefined &&
                context.isPointInPath(this.targetX, this.targetY)) {
                this.currentTargetShapeId = shapeid;
            }
            if (lineColor !== undefined) {
                context.stroke();
            }
            if (fillColor !== undefined) {
                context.fill();
            }
        },

        _drawPieSlice: function (shapeid, x, y, radius, startAngle, endAngle, lineColor, fillColor) {
            var context = this._getContext(lineColor, fillColor);
            context.beginPath();
            context.moveTo(x, y);
            context.arc(x, y, radius, startAngle, endAngle, false);
            context.lineTo(x, y);
            context.closePath();
            if (lineColor !== undefined) {
                context.stroke();
            }
            if (fillColor) {
                context.fill();
            }
            if (this.targetX !== undefined && this.targetY !== undefined &&
                context.isPointInPath(this.targetX, this.targetY)) {
                this.currentTargetShapeId = shapeid;
            }
        },

        _drawRect: function (shapeid, x, y, width, height, lineColor, fillColor) {
            return this._drawShape(shapeid, [[x, y], [x + width, y], [x + width, y + height], [x, y + height], [x, y]], lineColor, fillColor);
        },

        appendShape: function (shape) {
            this.shapes[shape.id] = shape;
            this.shapeseq.push(shape.id);
            this.lastShapeId = shape.id;
            return shape.id;
        },

        replaceWithShape: function (shapeid, shape) {
            var shapeseq = this.shapeseq,
                i;
            this.shapes[shape.id] = shape;
            for (i = shapeseq.length; i--;) {
                if (shapeseq[i] == shapeid) {
                    shapeseq[i] = shape.id;
                }
            }
            delete this.shapes[shapeid];
        },

        replaceWithShapes: function (shapeids, shapes) {
            var shapeseq = this.shapeseq,
                shapemap = {},
                sid, i, first;

            for (i = shapeids.length; i--;) {
                shapemap[shapeids[i]] = true;
            }
            for (i = shapeseq.length; i--;) {
                sid = shapeseq[i];
                if (shapemap[sid]) {
                    shapeseq.splice(i, 1);
                    delete this.shapes[sid];
                    first = i;
                }
            }
            for (i = shapes.length; i--;) {
                shapeseq.splice(first, 0, shapes[i].id);
                this.shapes[shapes[i].id] = shapes[i];
            }

        },

        insertAfterShape: function (shapeid, shape) {
            var shapeseq = this.shapeseq,
                i;
            for (i = shapeseq.length; i--;) {
                if (shapeseq[i] === shapeid) {
                    shapeseq.splice(i + 1, 0, shape.id);
                    this.shapes[shape.id] = shape;
                    return;
                }
            }
        },

        removeShapeId: function (shapeid) {
            var shapeseq = this.shapeseq,
                i;
            for (i = shapeseq.length; i--;) {
                if (shapeseq[i] === shapeid) {
                    shapeseq.splice(i, 1);
                    break;
                }
            }
            delete this.shapes[shapeid];
        },

        getShapeAt: function (el, x, y) {
            this.targetX = x;
            this.targetY = y;
            this.render();
            return this.currentTargetShapeId;
        },

        render: function () {
            var shapeseq = this.shapeseq,
                shapes = this.shapes,
                shapeCount = shapeseq.length,
                context = this._getContext(),
                shapeid, shape, i;
            context.clearRect(0, 0, this.pixelWidth, this.pixelHeight);
            for (i = 0; i < shapeCount; i++) {
                shapeid = shapeseq[i];
                shape = shapes[shapeid];
                this['_draw' + shape.type].apply(this, shape.args);
            }
            if (!this.interact) {
                // not interactive so no need to keep the shapes array
                this.shapes = {};
                this.shapeseq = [];
            }
        }

    });

    VCanvas_vml = createClass(VCanvas_base, {
        init: function (width, height, target) {
            var groupel;
            VCanvas_vml._super.init.call(this, width, height, target);
            if (target[0]) {
                target = target[0];
            }
            $.data(target, '_jqs_vcanvas', this);
            this.canvas = document.createElement('span');
            $(this.canvas).css({ display: 'inline-block', position: 'relative', overflow: 'hidden', width: width, height: height, margin: '0px', padding: '0px', verticalAlign: 'top'});
            this._insert(this.canvas, target);
            this._calculatePixelDims(width, height, this.canvas);
            this.canvas.width = this.pixelWidth;
            this.canvas.height = this.pixelHeight;
            groupel = '<v:group coordorigin="0 0" coordsize="' + this.pixelWidth + ' ' + this.pixelHeight + '"' +
                    ' style="position:absolute;top:0;left:0;width:' + this.pixelWidth + 'px;height=' + this.pixelHeight + 'px;"></v:group>';
            this.canvas.insertAdjacentHTML('beforeEnd', groupel);
            this.group = $(this.canvas).children()[0];
            this.rendered = false;
            this.prerender = '';
        },

        _drawShape: function (shapeid, path, lineColor, fillColor, lineWidth) {
            var vpath = [],
                initial, stroke, fill, closed, vel, plen, i;
            for (i = 0, plen = path.length; i < plen; i++) {
                vpath[i] = '' + (path[i][0]) + ',' + (path[i][1]);
            }
            initial = vpath.splice(0, 1);
            lineWidth = lineWidth === undefined ? 1 : lineWidth;
            stroke = lineColor === undefined ? ' stroked="false" ' : ' strokeWeight="' + lineWidth + 'px" strokeColor="' + lineColor + '" ';
            fill = fillColor === undefined ? ' filled="false"' : ' fillColor="' + fillColor + '" filled="true" ';
            closed = vpath[0] === vpath[vpath.length - 1] ? 'x ' : '';
            vel = '<v:shape coordorigin="0 0" coordsize="' + this.pixelWidth + ' ' + this.pixelHeight + '" ' +
                 ' id="jqsshape' + shapeid + '" ' +
                 stroke +
                 fill +
                ' style="position:absolute;left:0px;top:0px;height:' + this.pixelHeight + 'px;width:' + this.pixelWidth + 'px;padding:0px;margin:0px;" ' +
                ' path="m ' + initial + ' l ' + vpath.join(', ') + ' ' + closed + 'e">' +
                ' </v:shape>';
            return vel;
        },

        _drawCircle: function (shapeid, x, y, radius, lineColor, fillColor, lineWidth) {
            var stroke, fill, vel;
            x -= radius;
            y -= radius;
            stroke = lineColor === undefined ? ' stroked="false" ' : ' strokeWeight="' + lineWidth + 'px" strokeColor="' + lineColor + '" ';
            fill = fillColor === undefined ? ' filled="false"' : ' fillColor="' + fillColor + '" filled="true" ';
            vel = '<v:oval ' +
                 ' id="jqsshape' + shapeid + '" ' +
                stroke +
                fill +
                ' style="position:absolute;top:' + y + 'px; left:' + x + 'px; width:' + (radius * 2) + 'px; height:' + (radius * 2) + 'px"></v:oval>';
            return vel;

        },

        _drawPieSlice: function (shapeid, x, y, radius, startAngle, endAngle, lineColor, fillColor) {
            var vpath, startx, starty, endx, endy, stroke, fill, vel;
            if (startAngle === endAngle) {
                return '';  // VML seems to have problem when start angle equals end angle.
            }
            if ((endAngle - startAngle) === (2 * Math.PI)) {
                startAngle = 0.0;  // VML seems to have a problem when drawing a full circle that doesn't start 0
                endAngle = (2 * Math.PI);
            }

            startx = x + Math.round(Math.cos(startAngle) * radius);
            starty = y + Math.round(Math.sin(startAngle) * radius);
            endx = x + Math.round(Math.cos(endAngle) * radius);
            endy = y + Math.round(Math.sin(endAngle) * radius);

            if (startx === endx && starty === endy) {
                if ((endAngle - startAngle) < Math.PI) {
                    // Prevent very small slices from being mistaken as a whole pie
                    return '';
                }
                // essentially going to be the entire circle, so ignore startAngle
                startx = endx = x + radius;
                starty = endy = y;
            }

            if (startx === endx && starty === endy && (endAngle - startAngle) < Math.PI) {
                return '';
            }

            vpath = [x - radius, y - radius, x + radius, y + radius, startx, starty, endx, endy];
            stroke = lineColor === undefined ? ' stroked="false" ' : ' strokeWeight="1px" strokeColor="' + lineColor + '" ';
            fill = fillColor === undefined ? ' filled="false"' : ' fillColor="' + fillColor + '" filled="true" ';
            vel = '<v:shape coordorigin="0 0" coordsize="' + this.pixelWidth + ' ' + this.pixelHeight + '" ' +
                 ' id="jqsshape' + shapeid + '" ' +
                 stroke +
                 fill +
                ' style="position:absolute;left:0px;top:0px;height:' + this.pixelHeight + 'px;width:' + this.pixelWidth + 'px;padding:0px;margin:0px;" ' +
                ' path="m ' + x + ',' + y + ' wa ' + vpath.join(', ') + ' x e">' +
                ' </v:shape>';
            return vel;
        },

        _drawRect: function (shapeid, x, y, width, height, lineColor, fillColor) {
            return this._drawShape(shapeid, [[x, y], [x, y + height], [x + width, y + height], [x + width, y], [x, y]], lineColor, fillColor);
        },

        reset: function () {
            this.group.innerHTML = '';
        },

        appendShape: function (shape) {
            var vel = this['_draw' + shape.type].apply(this, shape.args);
            if (this.rendered) {
                this.group.insertAdjacentHTML('beforeEnd', vel);
            } else {
                this.prerender += vel;
            }
            this.lastShapeId = shape.id;
            return shape.id;
        },

        replaceWithShape: function (shapeid, shape) {
            var existing = $('#jqsshape' + shapeid),
                vel = this['_draw' + shape.type].apply(this, shape.args);
            existing[0].outerHTML = vel;
        },

        replaceWithShapes: function (shapeids, shapes) {
            // replace the first shapeid with all the new shapes then toast the remaining old shapes
            var existing = $('#jqsshape' + shapeids[0]),
                replace = '',
                slen = shapes.length,
                i;
            for (i = 0; i < slen; i++) {
                replace += this['_draw' + shapes[i].type].apply(this, shapes[i].args);
            }
            existing[0].outerHTML = replace;
            for (i = 1; i < shapeids.length; i++) {
                $('#jqsshape' + shapeids[i]).remove();
            }
        },

        insertAfterShape: function (shapeid, shape) {
            var existing = $('#jqsshape' + shapeid),
                 vel = this['_draw' + shape.type].apply(this, shape.args);
            existing[0].insertAdjacentHTML('afterEnd', vel);
        },

        removeShapeId: function (shapeid) {
            var existing = $('#jqsshape' + shapeid);
            this.group.removeChild(existing[0]);
        },

        getShapeAt: function (el, x, y) {
            var shapeid = el.id.substr(8);
            return shapeid;
        },

        render: function () {
            if (!this.rendered) {
                // batch the intial render into a single repaint
                this.group.innerHTML = this.prerender;
                this.rendered = true;
            }
        }
    });

}))}(document, Math));
;
/*! 
 * jQuery Steps v1.0.7 - 05/07/2014
 * Copyright (c) 2014 Rafael Staib (http://www.jquery-steps.com)
 * Licensed under MIT http://www.opensource.org/licenses/MIT
 */
;(function ($, undefined)
{
$.fn.extend({
    _aria: function (name, value)
    {
        return this.attr("aria-" + name, value);
    },

    _removeAria: function (name)
    {
        return this.removeAttr("aria-" + name);
    },

    _enableAria: function (enable)
    {
        return (enable == null || enable) ? 
            this.removeClass("disabled")._aria("disabled", "false") : 
            this.addClass("disabled")._aria("disabled", "true");
    },

    _showAria: function (show)
    {
        return (show == null || show) ? 
            this.show()._aria("hidden", "false") : 
            this.hide()._aria("hidden", "true");
    },

    _selectAria: function (select)
    {
        return (select == null || select) ? 
            this.addClass("current")._aria("selected", "true") : 
            this.removeClass("current")._aria("selected", "false");
    },

    _id: function (id)
    {
        return (id) ? this.attr("id", id) : this.attr("id");
    }
});

if (!String.prototype.format)
{
    String.prototype.format = function()
    {
        var args = (arguments.length === 1 && $.isArray(arguments[0])) ? arguments[0] : arguments;
        var formattedString = this;
        for (var i = 0; i < args.length; i++)
        {
            var pattern = new RegExp("\\{" + i + "\\}", "gm");
            formattedString = formattedString.replace(pattern, args[i]);
        }
        return formattedString;
    };
}

/**
 * A global unique id count.
 *
 * @static
 * @private
 * @property _uniqueId
 * @type Integer
 **/
var _uniqueId = 0;

/**
 * The plugin prefix for cookies.
 *
 * @final
 * @private
 * @property _cookiePrefix
 * @type String
 **/
var _cookiePrefix = "jQu3ry_5teps_St@te_";

/**
 * Suffix for the unique tab id.
 *
 * @final
 * @private
 * @property _tabSuffix
 * @type String
 * @since 0.9.7
 **/
var _tabSuffix = "-t-";

/**
 * Suffix for the unique tabpanel id.
 *
 * @final
 * @private
 * @property _tabpanelSuffix
 * @type String
 * @since 0.9.7
 **/
var _tabpanelSuffix = "-p-";

/**
 * Suffix for the unique title id.
 *
 * @final
 * @private
 * @property _titleSuffix
 * @type String
 * @since 0.9.7
 **/
var _titleSuffix = "-h-";

/**
 * An error message for an "index out of range" error.
 *
 * @final
 * @private
 * @property _indexOutOfRangeErrorMessage
 * @type String
 **/
var _indexOutOfRangeErrorMessage = "Index out of range.";

/**
 * An error message for an "missing corresponding element" error.
 *
 * @final
 * @private
 * @property _missingCorrespondingElementErrorMessage
 * @type String
 **/
var _missingCorrespondingElementErrorMessage = "One or more corresponding step {0} are missing.";

/**
 * Adds a step to the cache.
 *
 * @static
 * @private
 * @method addStepToCache
 * @param wizard {Object} A jQuery wizard object
 * @param step {Object} The step object to add
 **/
function addStepToCache(wizard, step)
{
    getSteps(wizard).push(step);
}

function analyzeData(wizard, options, state)
{
    var stepTitles = wizard.children(options.headerTag),
        stepContents = wizard.children(options.bodyTag);

    // Validate content
    if (stepTitles.length > stepContents.length)
    {
        throwError(_missingCorrespondingElementErrorMessage, "contents");
    }
    else if (stepTitles.length < stepContents.length)
    {
        throwError(_missingCorrespondingElementErrorMessage, "titles");
    }
        
    var startIndex = options.startIndex;

    state.stepCount = stepTitles.length;

    // Tries to load the saved state (step position)
    if (options.saveState && $.cookie)
    {
        var savedState = $.cookie(_cookiePrefix + getUniqueId(wizard));
        // Sets the saved position to the start index if not undefined or out of range 
        var savedIndex = parseInt(savedState, 0);
        if (!isNaN(savedIndex) && savedIndex < state.stepCount)
        {
            startIndex = savedIndex;
        }
    }

    state.currentIndex = startIndex;

    stepTitles.each(function (index)
    {
        var item = $(this), // item == header
            content = stepContents.eq(index),
            modeData = content.data("mode"),
            mode = (modeData == null) ? contentMode.html : getValidEnumValue(contentMode,
                (/^\s*$/.test(modeData) || isNaN(modeData)) ? modeData : parseInt(modeData, 0)),
            contentUrl = (mode === contentMode.html || content.data("url") === undefined) ?
                "" : content.data("url"),
            contentLoaded = (mode !== contentMode.html && content.data("loaded") === "1"),
            step = $.extend({}, stepModel, {
                title: item.html(),
                content: (mode === contentMode.html) ? content.html() : "",
                contentUrl: contentUrl,
                contentMode: mode,
                contentLoaded: contentLoaded
            });

        addStepToCache(wizard, step);
    });
}

/**
 * Triggers the onCanceled event.
 *
 * @static
 * @private
 * @method cancel
 * @param wizard {Object} The jQuery wizard object
 **/
function cancel(wizard)
{
    wizard.triggerHandler("canceled");
}

function decreaseCurrentIndexBy(state, decreaseBy)
{
    return state.currentIndex - decreaseBy;
}

/**
 * Removes the control functionality completely and transforms the current state to the initial HTML structure.
 *
 * @static
 * @private
 * @method destroy
 * @param wizard {Object} A jQuery wizard object
 **/
function destroy(wizard, options)
{
    var eventNamespace = getEventNamespace(wizard);

    // Remove virtual data objects from the wizard
    wizard.unbind(eventNamespace).removeData("uid").removeData("options")
        .removeData("state").removeData("steps").removeData("eventNamespace")
        .find(".actions a").unbind(eventNamespace);

    // Remove attributes and CSS classes from the wizard
    wizard.removeClass(options.clearFixCssClass + " vertical");

    var contents = wizard.find(".content > *");

    // Remove virtual data objects from panels and their titles
    contents.removeData("loaded").removeData("mode").removeData("url");

    // Remove attributes, CSS classes and reset inline styles on all panels and their titles
    contents.removeAttr("id").removeAttr("role").removeAttr("tabindex")
        .removeAttr("class").removeAttr("style")._removeAria("labelledby")
        ._removeAria("hidden");

    // Empty panels if the mode is set to 'async' or 'iframe'
    wizard.find(".content > [data-mode='async'],.content > [data-mode='iframe']").empty();

    var wizardSubstitute = $("<{0} class=\"{1}\"></{0}>".format(wizard.get(0).tagName, wizard.attr("class")));

    var wizardId = wizard._id();
    if (wizardId != null && wizardId !== "")
    {
        wizardSubstitute._id(wizardId);
    }

    wizardSubstitute.html(wizard.find(".content").html());
    wizard.after(wizardSubstitute);
    wizard.remove();

    return wizardSubstitute;
}

/**
 * Triggers the onFinishing and onFinished event.
 *
 * @static
 * @private
 * @method finishStep
 * @param wizard {Object} The jQuery wizard object
 * @param state {Object} The state container of the current wizard
 **/
function finishStep(wizard, state)
{
    var currentStep = wizard.find(".steps li").eq(state.currentIndex);

    if (wizard.triggerHandler("finishing", [state.currentIndex]))
    {
        currentStep.addClass("done").removeClass("error");
        wizard.triggerHandler("finished", [state.currentIndex]);
    }
    else
    {
        currentStep.addClass("error");
    }
}

/**
 * Gets or creates if not exist an unique event namespace for the given wizard instance.
 *
 * @static
 * @private
 * @method getEventNamespace
 * @param wizard {Object} A jQuery wizard object
 * @return {String} Returns the unique event namespace for the given wizard
 */
function getEventNamespace(wizard)
{
    var eventNamespace = wizard.data("eventNamespace");

    if (eventNamespace == null)
    {
        eventNamespace = "." + getUniqueId(wizard);
        wizard.data("eventNamespace", eventNamespace);
    }

    return eventNamespace;
}

function getStepAnchor(wizard, index)
{
    var uniqueId = getUniqueId(wizard);

    return wizard.find("#" + uniqueId + _tabSuffix + index);
}

function getStepPanel(wizard, index)
{
    var uniqueId = getUniqueId(wizard);

    return wizard.find("#" + uniqueId + _tabpanelSuffix + index);
}

function getStepTitle(wizard, index)
{
    var uniqueId = getUniqueId(wizard);

    return wizard.find("#" + uniqueId + _titleSuffix + index);
}

function getOptions(wizard)
{
    return wizard.data("options");
}

function getState(wizard)
{
    return wizard.data("state");
}

function getSteps(wizard)
{
    return wizard.data("steps");
}

/**
 * Gets a specific step object by index.
 *
 * @static
 * @private
 * @method getStep
 * @param index {Integer} An integer that belongs to the position of a step
 * @return {Object} A specific step object
 **/
function getStep(wizard, index)
{
    var steps = getSteps(wizard);

    if (index < 0 || index >= steps.length)
    {
        throwError(_indexOutOfRangeErrorMessage);
    }

    return steps[index];
}

/**
 * Gets or creates if not exist an unique id from the given wizard instance.
 *
 * @static
 * @private
 * @method getUniqueId
 * @param wizard {Object} A jQuery wizard object
 * @return {String} Returns the unique id for the given wizard
 */
function getUniqueId(wizard)
{
    var uniqueId = wizard.data("uid");

    if (uniqueId == null)
    {
        uniqueId = wizard._id();
        if (uniqueId == null)
        {
            uniqueId = "steps-uid-".concat(_uniqueId);
            wizard._id(uniqueId);
        }

        _uniqueId++;
        wizard.data("uid", uniqueId);
    }

    return uniqueId;
}

/**
 * Gets a valid enum value by checking a specific enum key or value.
 * 
 * @static
 * @private
 * @method getValidEnumValue
 * @param enumType {Object} Type of enum
 * @param keyOrValue {Object} Key as `String` or value as `Integer` to check for
 */
function getValidEnumValue(enumType, keyOrValue)
{
    validateArgument("enumType", enumType);
    validateArgument("keyOrValue", keyOrValue);

    // Is key
    if (typeof keyOrValue === "string")
    {
        var value = enumType[keyOrValue];
        if (value === undefined)
        {
            throwError("The enum key '{0}' does not exist.", keyOrValue);
        }

        return value;
    }
    // Is value
    else if (typeof keyOrValue === "number")
    {
        for (var key in enumType)
        {
            if (enumType[key] === keyOrValue)
            {
                return keyOrValue;
            }
        }

        throwError("Invalid enum value '{0}'.", keyOrValue);
    }
    // Type is not supported
    else
    {
        throwError("Invalid key or value type.");
    }
}

/**
 * Routes to the next step.
 *
 * @static
 * @private
 * @method goToNextStep
 * @param wizard {Object} The jQuery wizard object
 * @param options {Object} Settings of the current wizard
 * @param state {Object} The state container of the current wizard
 * @return {Boolean} Indicates whether the action executed
 **/
function goToNextStep(wizard, options, state)
{
    return paginationClick(wizard, options, state, increaseCurrentIndexBy(state, 1));
}

/**
 * Routes to the previous step.
 *
 * @static
 * @private
 * @method goToPreviousStep
 * @param wizard {Object} The jQuery wizard object
 * @param options {Object} Settings of the current wizard
 * @param state {Object} The state container of the current wizard
 * @return {Boolean} Indicates whether the action executed
 **/
function goToPreviousStep(wizard, options, state)
{
    return paginationClick(wizard, options, state, decreaseCurrentIndexBy(state, 1));
}

/**
 * Routes to a specific step by a given index.
 *
 * @static
 * @private
 * @method goToStep
 * @param wizard {Object} The jQuery wizard object
 * @param options {Object} Settings of the current wizard
 * @param state {Object} The state container of the current wizard
 * @param index {Integer} The position (zero-based) to route to
 * @return {Boolean} Indicates whether the action succeeded or failed
 **/
function goToStep(wizard, options, state, index)
{
    if (index < 0 || index >= state.stepCount)
    {
        throwError(_indexOutOfRangeErrorMessage);
    }

    if (options.forceMoveForward && index < state.currentIndex)
    {
        return;
    }

    var oldIndex = state.currentIndex;
    if (wizard.triggerHandler("stepChanging", [state.currentIndex, index]))
    {
        // Save new state
        state.currentIndex = index;
        saveCurrentStateToCookie(wizard, options, state);

        // Change visualisation
        refreshStepNavigation(wizard, options, state, oldIndex);
        refreshPagination(wizard, options, state);
        loadAsyncContent(wizard, options, state);
        startTransitionEffect(wizard, options, state, index, oldIndex);

        wizard.triggerHandler("stepChanged", [index, oldIndex]);
    }
    else
    {
        wizard.find(".steps li").eq(oldIndex).addClass("error");
    }

    return true;
}

function increaseCurrentIndexBy(state, increaseBy)
{
    return state.currentIndex + increaseBy;
}

/**
 * Initializes the component.
 *
 * @static
 * @private
 * @method initialize
 * @param options {Object} The component settings
 **/
function initialize(options)
{
    /*jshint -W040 */
    var opts = $.extend(true, {}, defaults, options);

    return this.each(function ()
    {
        var wizard = $(this);
        var state = {
            currentIndex: opts.startIndex,
            currentStep: null,
            stepCount: 0,
            transitionElement: null
        };

        // Create data container
        wizard.data("options", opts);
        wizard.data("state", state);
        wizard.data("steps", []);

        analyzeData(wizard, opts, state);
        render(wizard, opts, state);
        registerEvents(wizard, opts);

        // Trigger focus
        if (opts.autoFocus && _uniqueId === 0)
        {
            getStepAnchor(wizard, opts.startIndex).focus();
        }
    });
}

/**
 * Inserts a new step to a specific position.
 *
 * @static
 * @private
 * @method insertStep
 * @param wizard {Object} The jQuery wizard object
 * @param options {Object} Settings of the current wizard
 * @param state {Object} The state container of the current wizard
 * @param index {Integer} The position (zero-based) to add
 * @param step {Object} The step object to add
 * @example
 *     $("#wizard").steps().insert(0, {
 *         title: "Title",
 *         content: "", // optional
 *         contentMode: "async", // optional
 *         contentUrl: "/Content/Step/1" // optional
 *     });
 * @chainable
 **/
function insertStep(wizard, options, state, index, step)
{
    if (index < 0 || index > state.stepCount)
    {
        throwError(_indexOutOfRangeErrorMessage);
    }

    // TODO: Validate step object

    // Change data
    step = $.extend({}, stepModel, step);
    insertStepToCache(wizard, index, step);
    if (state.currentIndex !== state.stepCount && state.currentIndex >= index)
    {
        state.currentIndex++;
        saveCurrentStateToCookie(wizard, options, state);
    }
    state.stepCount++;

    var contentContainer = wizard.find(".content"),
        header = $("<{0}>{1}</{0}>".format(options.headerTag, step.title)),
        body = $("<{0}></{0}>".format(options.bodyTag));

    if (step.contentMode == null || step.contentMode === contentMode.html)
    {
        body.html(step.content);
    }

    if (index === 0)
    {
        contentContainer.prepend(body).prepend(header);
    }
    else
    {
        getStepPanel(wizard, (index - 1)).after(body).after(header);
    }

    renderBody(wizard, state, body, index);
    renderTitle(wizard, options, state, header, index);
    refreshSteps(wizard, options, state, index);
    if (index === state.currentIndex)
    {
        refreshStepNavigation(wizard, options, state);
    }
    refreshPagination(wizard, options, state);

    return wizard;
}

/**
 * Inserts a step object to the cache at a specific position.
 *
 * @static
 * @private
 * @method insertStepToCache
 * @param wizard {Object} A jQuery wizard object
 * @param index {Integer} The position (zero-based) to add
 * @param step {Object} The step object to add
 **/
function insertStepToCache(wizard, index, step)
{
    getSteps(wizard).splice(index, 0, step);
}

/**
 * Handles the keyup DOM event for pagination.
 *
 * @static
 * @private
 * @event keyup
 * @param event {Object} An event object
 */
function keyUpHandler(event)
{
    var wizard = $(this),
        options = getOptions(wizard),
        state = getState(wizard);

    if (options.suppressPaginationOnFocus && wizard.find(":focus").is(":input"))
    {
        event.preventDefault();
        return false;
    }

    var keyCodes = { left: 37, right: 39 };
    if (event.keyCode === keyCodes.left)
    {
        event.preventDefault();
        goToPreviousStep(wizard, options, state);
    }
    else if (event.keyCode === keyCodes.right)
    {
        event.preventDefault();
        goToNextStep(wizard, options, state);
    }
}

/**
 * Loads and includes async content.
 *
 * @static
 * @private
 * @method loadAsyncContent
 * @param wizard {Object} A jQuery wizard object
 * @param options {Object} Settings of the current wizard
 * @param state {Object} The state container of the current wizard
 */
function loadAsyncContent(wizard, options, state)
{
    if (state.stepCount > 0)
    {
        var currentStep = getStep(wizard, state.currentIndex);

        if (!options.enableContentCache || !currentStep.contentLoaded)
        {
            switch (getValidEnumValue(contentMode, currentStep.contentMode))
            {
                case contentMode.iframe:
                    wizard.find(".content > .body").eq(state.currentIndex).empty()
                        .html("<iframe src=\"" + currentStep.contentUrl + "\" frameborder=\"0\" scrolling=\"no\" />")
                        .data("loaded", "1");
                    break;

                case contentMode.async:
                    var currentStepContent = getStepPanel(wizard, state.currentIndex)._aria("busy", "true")
                        .empty().append(renderTemplate(options.loadingTemplate, { text: options.labels.loading }));

                    $.ajax({ url: currentStep.contentUrl, cache: false }).done(function (data)
                    {
                        currentStepContent.empty().html(data)._aria("busy", "false").data("loaded", "1");
                    });
                    break;
            }
        }
    }
}

/**
 * Fires the action next or previous click event.
 *
 * @static
 * @private
 * @method paginationClick
 * @param wizard {Object} The jQuery wizard object
 * @param options {Object} Settings of the current wizard
 * @param state {Object} The state container of the current wizard
 * @param index {Integer} The position (zero-based) to route to
 * @return {Boolean} Indicates whether the event fired successfully or not
 **/
function paginationClick(wizard, options, state, index)
{
    var oldIndex = state.currentIndex;

    if (index >= 0 && index < state.stepCount && !(options.forceMoveForward && index < state.currentIndex))
    {
        var anchor = getStepAnchor(wizard, index),
            parent = anchor.parent(),
            isDisabled = parent.hasClass("disabled");

        // Enable the step to make the anchor clickable!
        parent._enableAria();
        anchor.click();

        // An error occured
        if (oldIndex === state.currentIndex && isDisabled)
        {
            // Disable the step again if current index has not changed; prevents click action.
            parent._enableAria(false);
            return false;
        }

        return true;
    }

    return false;
}

/**
 * Fires when a pagination click happens.
 *
 * @static
 * @private
 * @event click
 * @param event {Object} An event object
 */
function paginationClickHandler(event)
{
    event.preventDefault();

    var anchor = $(this),
        wizard = anchor.parent().parent().parent().parent(),
        options = getOptions(wizard),
        state = getState(wizard),
        href = anchor.attr("href");

    switch (href.substring(href.lastIndexOf("#") + 1))
    {
        case "cancel":
            cancel(wizard);
            break;

        case "finish":
            finishStep(wizard, state);
            break;

        case "next":
            goToNextStep(wizard, options, state);
            break;

        case "previous":
            goToPreviousStep(wizard, options, state);
            break;
    }
}

/**
 * Refreshs the visualization state for the entire pagination.
 *
 * @static
 * @private
 * @method refreshPagination
 * @param wizard {Object} A jQuery wizard object
 * @param options {Object} Settings of the current wizard
 * @param state {Object} The state container of the current wizard
 */
function refreshPagination(wizard, options, state)
{
    if (options.enablePagination)
    {
        var finish = wizard.find(".actions a[href$='#finish']").parent(),
            next = wizard.find(".actions a[href$='#next']").parent();

        if (!options.forceMoveForward)
        {
            var previous = wizard.find(".actions a[href$='#previous']").parent();
            previous._enableAria(state.currentIndex > 0);
        }

        if (options.enableFinishButton && options.showFinishButtonAlways)
        {
            finish._enableAria(state.stepCount > 0);
            next._enableAria(state.stepCount > 1 && state.stepCount > (state.currentIndex + 1));
        }
        else
        {
            finish._showAria(options.enableFinishButton && state.stepCount === (state.currentIndex + 1));
            next._showAria(state.stepCount === 0 || state.stepCount > (state.currentIndex + 1)).
                _enableAria(state.stepCount > (state.currentIndex + 1) || !options.enableFinishButton);
        }
    }
}

/**
 * Refreshs the visualization state for the step navigation (tabs).
 *
 * @static
 * @private
 * @method refreshStepNavigation
 * @param wizard {Object} A jQuery wizard object
 * @param options {Object} Settings of the current wizard
 * @param state {Object} The state container of the current wizard
 * @param [oldIndex] {Integer} The index of the prior step
 */
function refreshStepNavigation(wizard, options, state, oldIndex)
{
    var currentOrNewStepAnchor = getStepAnchor(wizard, state.currentIndex),
        currentInfo = $("<span class=\"current-info audible\">" + options.labels.current + " </span>"),
        stepTitles = wizard.find(".content > .title");

    if (oldIndex != null)
    {
        var oldStepAnchor = getStepAnchor(wizard, oldIndex);
        oldStepAnchor.parent().addClass("done").removeClass("error")._selectAria(false);
        stepTitles.eq(oldIndex).removeClass("current").next(".body").removeClass("current");
        currentInfo = oldStepAnchor.find(".current-info");
        currentOrNewStepAnchor.focus();
    }

    currentOrNewStepAnchor.prepend(currentInfo).parent()._selectAria().removeClass("done")._enableAria();
    stepTitles.eq(state.currentIndex).addClass("current").next(".body").addClass("current");
}

/**
 * Refreshes step buttons and their related titles beyond a certain position.
 *
 * @static
 * @private
 * @method refreshSteps
 * @param wizard {Object} A jQuery wizard object
 * @param options {Object} Settings of the current wizard
 * @param state {Object} The state container of the current wizard
 * @param index {Integer} The start point for refreshing ids
 */
function refreshSteps(wizard, options, state, index)
{
    var uniqueId = getUniqueId(wizard);

    for (var i = index; i < state.stepCount; i++)
    {
        var uniqueStepId = uniqueId + _tabSuffix + i,
            uniqueBodyId = uniqueId + _tabpanelSuffix + i,
            uniqueHeaderId = uniqueId + _titleSuffix + i,
            title = wizard.find(".title").eq(i)._id(uniqueHeaderId);

        wizard.find(".steps a").eq(i)._id(uniqueStepId)
            ._aria("controls", uniqueBodyId).attr("href", "#" + uniqueHeaderId)
            .html(renderTemplate(options.titleTemplate, { index: i + 1, title: title.html() }));
        wizard.find(".body").eq(i)._id(uniqueBodyId)
            ._aria("labelledby", uniqueHeaderId);
    }
}

function registerEvents(wizard, options)
{
    var eventNamespace = getEventNamespace(wizard);

    wizard.bind("canceled" + eventNamespace, options.onCanceled);
    wizard.bind("finishing" + eventNamespace, options.onFinishing);
    wizard.bind("finished" + eventNamespace, options.onFinished);
    wizard.bind("stepChanging" + eventNamespace, options.onStepChanging);
    wizard.bind("stepChanged" + eventNamespace, options.onStepChanged);

    if (options.enableKeyNavigation)
    {
        wizard.bind("keyup" + eventNamespace, keyUpHandler);
    }

    wizard.find(".actions a").bind("click" + eventNamespace, paginationClickHandler);
}

/**
 * Removes a specific step by an given index.
 *
 * @static
 * @private
 * @method removeStep
 * @param wizard {Object} A jQuery wizard object
 * @param options {Object} Settings of the current wizard
 * @param state {Object} The state container of the current wizard
 * @param index {Integer} The position (zero-based) of the step to remove
 * @return Indecates whether the item is removed.
 **/
function removeStep(wizard, options, state, index)
{
    // Index out of range and try deleting current item will return false.
    if (index < 0 || index >= state.stepCount || state.currentIndex === index)
    {
        return false;
    }

    // Change data
    removeStepFromCache(wizard, index);
    if (state.currentIndex > index)
    {
        state.currentIndex--;
        saveCurrentStateToCookie(wizard, options, state);
    }
    state.stepCount--;

    getStepTitle(wizard, index).remove();
    getStepPanel(wizard, index).remove();
    getStepAnchor(wizard, index).parent().remove();

    // Set the "first" class to the new first step button 
    if (index === 0)
    {
        wizard.find(".steps li").first().addClass("first");
    }

    // Set the "last" class to the new last step button 
    if (index === state.stepCount)
    {
        wizard.find(".steps li").eq(index).addClass("last");
    }

    refreshSteps(wizard, options, state, index);
    refreshPagination(wizard, options, state);

    return true;
}

function removeStepFromCache(wizard, index)
{
    getSteps(wizard).splice(index, 1);
}

/**
 * Transforms the base html structure to a more sensible html structure.
 *
 * @static
 * @private
 * @method render
 * @param wizard {Object} A jQuery wizard object
 * @param options {Object} Settings of the current wizard
 * @param state {Object} The state container of the current wizard
 **/
function render(wizard, options, state)
{
    // Create a content wrapper and copy HTML from the intial wizard structure
    var wrapperTemplate = "<{0} class=\"{1}\">{2}</{0}>",
        orientation = getValidEnumValue(stepsOrientation, options.stepsOrientation),
        verticalCssClass = (orientation === stepsOrientation.vertical) ? " vertical" : "",
        contentWrapper = $(wrapperTemplate.format(options.contentContainerTag, "content " + options.clearFixCssClass, wizard.html())),
        stepsWrapper = $(wrapperTemplate.format(options.stepsContainerTag, "steps " + options.clearFixCssClass, "<ul role=\"tablist\"></ul>")),
        stepTitles = contentWrapper.children(options.headerTag),
        stepContents = contentWrapper.children(options.bodyTag);

    // Transform the wizard wrapper and remove the inner HTML
    wizard.attr("role", "application").empty().append(stepsWrapper).append(contentWrapper)
        .addClass(options.cssClass + " " + options.clearFixCssClass + verticalCssClass);

    // Add WIA-ARIA support
    stepContents.each(function (index)
    {
        renderBody(wizard, state, $(this), index);
    });

    stepTitles.each(function (index)
    {
        renderTitle(wizard, options, state, $(this), index);
    });

    refreshStepNavigation(wizard, options, state);
    renderPagination(wizard, options, state);
}

/**
 * Transforms the body to a proper tabpanel.
 *
 * @static
 * @private
 * @method renderBody
 * @param wizard {Object} A jQuery wizard object
 * @param body {Object} A jQuery body object
 * @param index {Integer} The position of the body
 */
function renderBody(wizard, state, body, index)
{
    var uniqueId = getUniqueId(wizard),
        uniqueBodyId = uniqueId + _tabpanelSuffix + index,
        uniqueHeaderId = uniqueId + _titleSuffix + index;

    body._id(uniqueBodyId).attr("role", "tabpanel")._aria("labelledby", uniqueHeaderId)
        .addClass("body")._showAria(state.currentIndex === index);
}

/**
 * Renders a pagination if enabled.
 *
 * @static
 * @private
 * @method renderPagination
 * @param wizard {Object} A jQuery wizard object
 * @param options {Object} Settings of the current wizard
 * @param state {Object} The state container of the current wizard
 */
function renderPagination(wizard, options, state)
{
    if (options.enablePagination)
    {
        var pagination = "<{0} class=\"actions {1}\"><ul role=\"menu\" aria-label=\"{2}\">{3}</ul></{0}>",
            buttonTemplate = "<li><a href=\"#{0}\" role=\"menuitem\">{1}</a></li>",
            buttons = "";

        if (!options.forceMoveForward)
        {
            buttons += buttonTemplate.format("previous", options.labels.previous);
        }

        buttons += buttonTemplate.format("next", options.labels.next);

        if (options.enableFinishButton)
        {
            buttons += buttonTemplate.format("finish", options.labels.finish);
        }

        if (options.enableCancelButton)
        {
            buttons += buttonTemplate.format("cancel", options.labels.cancel);
        }

        wizard.append(pagination.format(options.actionContainerTag, options.clearFixCssClass,
            options.labels.pagination, buttons));

        refreshPagination(wizard, options, state);
        loadAsyncContent(wizard, options, state);
    }
}

/**
 * Renders a template and replaces all placeholder.
 *
 * @static
 * @private
 * @method renderTemplate
 * @param template {String} A template
 * @param substitutes {Object} A list of substitute
 * @return {String} The rendered template
 */
function renderTemplate(template, substitutes)
{
    var matches = template.match(/#([a-z]*)#/gi);

    for (var i = 0; i < matches.length; i++)
    {
        var match = matches[i], 
            key = match.substring(1, match.length - 1);

        if (substitutes[key] === undefined)
        {
            throwError("The key '{0}' does not exist in the substitute collection!", key);
        }

        template = template.replace(match, substitutes[key]);
    }

    return template;
}

/**
 * Transforms the title to a step item button.
 *
 * @static
 * @private
 * @method renderTitle
 * @param wizard {Object} A jQuery wizard object
 * @param options {Object} Settings of the current wizard
 * @param state {Object} The state container of the current wizard
 * @param header {Object} A jQuery header object
 * @param index {Integer} The position of the header
 */
function renderTitle(wizard, options, state, header, index)
{
    var uniqueId = getUniqueId(wizard),
        uniqueStepId = uniqueId + _tabSuffix + index,
        uniqueBodyId = uniqueId + _tabpanelSuffix + index,
        uniqueHeaderId = uniqueId + _titleSuffix + index,
        stepCollection = wizard.find(".steps > ul"),
        title = renderTemplate(options.titleTemplate, {
            index: index + 1,
            title: header.html()
        }),
        stepItem = $("<li role=\"tab\"><a id=\"" + uniqueStepId + "\" href=\"#" + uniqueHeaderId + 
            "\" aria-controls=\"" + uniqueBodyId + "\">" + title + "</a></li>");
        
    stepItem._enableAria(options.enableAllSteps || state.currentIndex > index);

    if (state.currentIndex > index)
    {
        stepItem.addClass("done");
    }

    header._id(uniqueHeaderId).attr("tabindex", "-1").addClass("title");

    if (index === 0)
    {
        stepCollection.prepend(stepItem);
    }
    else
    {
        stepCollection.find("li").eq(index - 1).after(stepItem);
    }

    // Set the "first" class to the new first step button
    if (index === 0)
    {
        stepCollection.find("li").removeClass("first").eq(index).addClass("first");
    }

    // Set the "last" class to the new last step button
    if (index === (state.stepCount - 1))
    {
        stepCollection.find("li").removeClass("last").eq(index).addClass("last");
    }

    // Register click event
    stepItem.children("a").bind("click" + getEventNamespace(wizard), stepClickHandler);
}

/**
 * Saves the current state to a cookie.
 *
 * @static
 * @private
 * @method saveCurrentStateToCookie
 * @param wizard {Object} A jQuery wizard object
 * @param options {Object} Settings of the current wizard
 * @param state {Object} The state container of the current wizard
 */
function saveCurrentStateToCookie(wizard, options, state)
{
    if (options.saveState && $.cookie)
    {
        $.cookie(_cookiePrefix + getUniqueId(wizard), state.currentIndex);
    }
}

function startTransitionEffect(wizard, options, state, index, oldIndex)
{
    var stepContents = wizard.find(".content > .body"),
        effect = getValidEnumValue(transitionEffect, options.transitionEffect),
        effectSpeed = options.transitionEffectSpeed,
        newStep = stepContents.eq(index),
        currentStep = stepContents.eq(oldIndex);

    switch (effect)
    {
        case transitionEffect.fade:
        case transitionEffect.slide:
            var hide = (effect === transitionEffect.fade) ? "fadeOut" : "slideUp",
                show = (effect === transitionEffect.fade) ? "fadeIn" : "slideDown";

            state.transitionElement = newStep;
            currentStep[hide](effectSpeed, function ()
            {
                var wizard = $(this)._showAria(false).parent().parent(),
                    state = getState(wizard);

                if (state.transitionElement)
                {
                    state.transitionElement[show](effectSpeed, function ()
                    {
                        $(this)._showAria();
                    });
                    state.transitionElement = null;
                }
            }).promise();
            break;

        case transitionEffect.slideLeft:
            var outerWidth = currentStep.outerWidth(true),
                posFadeOut = (index > oldIndex) ? -(outerWidth) : outerWidth,
                posFadeIn = (index > oldIndex) ? outerWidth : -(outerWidth);

            currentStep.animate({ left: posFadeOut }, effectSpeed, 
                function () { $(this)._showAria(false); }).promise();
            newStep.css("left", posFadeIn + "px")._showAria()
                .animate({ left: 0 }, effectSpeed).promise();
            break;

        default:
            currentStep._showAria(false);
            newStep._showAria();
            break;
    }
}

/**
 * Fires when a step click happens.
 *
 * @static
 * @private
 * @event click
 * @param event {Object} An event object
 */
function stepClickHandler(event)
{
    event.preventDefault();

    var anchor = $(this),
        wizard = anchor.parent().parent().parent().parent(),
        options = getOptions(wizard),
        state = getState(wizard),
        oldIndex = state.currentIndex;

    if (anchor.parent().is(":not(.disabled):not(.current)"))
    {
        var href = anchor.attr("href"),
            position = parseInt(href.substring(href.lastIndexOf("-") + 1), 0);

        goToStep(wizard, options, state, position);
    }

    // If nothing has changed
    if (oldIndex === state.currentIndex)
    {
        getStepAnchor(wizard, oldIndex).focus();
        return false;
    }
}

function throwError(message)
{
    if (arguments.length > 1)
    {
        message = message.format(Array.prototype.slice.call(arguments, 1));
    }

    throw new Error(message);
}

/**
 * Checks an argument for null or undefined and throws an error if one check applies.
 *
 * @static
 * @private
 * @method validateArgument
 * @param argumentName {String} The name of the given argument
 * @param argumentValue {Object} The argument itself
 */
function validateArgument(argumentName, argumentValue)
{
    if (argumentValue == null)
    {
        throwError("The argument '{0}' is null or undefined.", argumentName);
    }
}

/**
 * Represents a jQuery wizard plugin.
 *
 * @class steps
 * @constructor
 * @param [method={}] The name of the method as `String` or an JSON object for initialization
 * @param [params=]* {Array} Additional arguments for a method call
 * @chainable
 **/
$.fn.steps = function (method)
{
    if ($.fn.steps[method])
    {
        return $.fn.steps[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if (typeof method === "object" || !method)
    {
        return initialize.apply(this, arguments);
    }
    else
    {
        $.error("Method " + method + " does not exist on jQuery.steps");
    }
};

/**
 * Adds a new step.
 *
 * @method add
 * @param step {Object} The step object to add
 * @chainable
 **/
$.fn.steps.add = function (step)
{
    var state = getState(this);
    return insertStep(this, getOptions(this), state, state.stepCount, step);
};

/**
 * Removes the control functionality completely and transforms the current state to the initial HTML structure.
 *
 * @method destroy
 * @chainable
 **/
$.fn.steps.destroy = function ()
{
    return destroy(this, getOptions(this));
};

/**
 * Triggers the onFinishing and onFinished event.
 *
 * @method finish
 **/
$.fn.steps.finish = function ()
{
    finishStep(this, getState(this));
};

/**
 * Gets the current step index.
 *
 * @method getCurrentIndex
 * @return {Integer} The actual step index (zero-based)
 * @for steps
 **/
$.fn.steps.getCurrentIndex = function ()
{
    return getState(this).currentIndex;
};

/**
 * Gets the current step object.
 *
 * @method getCurrentStep
 * @return {Object} The actual step object
 **/
$.fn.steps.getCurrentStep = function ()
{
    return getStep(this, getState(this).currentIndex);
};

/**
 * Gets a specific step object by index.
 *
 * @method getStep
 * @param index {Integer} An integer that belongs to the position of a step
 * @return {Object} A specific step object
 **/
$.fn.steps.getStep = function (index)
{
    return getStep(this, index);
};

/**
 * Inserts a new step to a specific position.
 *
 * @method insert
 * @param index {Integer} The position (zero-based) to add
 * @param step {Object} The step object to add
 * @example
 *     $("#wizard").steps().insert(0, {
 *         title: "Title",
 *         content: "", // optional
 *         contentMode: "async", // optional
 *         contentUrl: "/Content/Step/1" // optional
 *     });
 * @chainable
 **/
$.fn.steps.insert = function (index, step)
{
    return insertStep(this, getOptions(this), getState(this), index, step);
};

/**
 * Routes to the next step.
 *
 * @method next
 * @return {Boolean} Indicates whether the action executed
 **/
$.fn.steps.next = function ()
{
    return goToNextStep(this, getOptions(this), getState(this));
};

/**
 * Routes to the previous step.
 *
 * @method previous
 * @return {Boolean} Indicates whether the action executed
 **/
$.fn.steps.previous = function ()
{
    return goToPreviousStep(this, getOptions(this), getState(this));
};

/**
 * Removes a specific step by an given index.
 *
 * @method remove
 * @param index {Integer} The position (zero-based) of the step to remove
 * @return Indecates whether the item is removed.
 **/
$.fn.steps.remove = function (index)
{
    return removeStep(this, getOptions(this), getState(this), index);
};

/**
 * Sets a specific step object by index.
 *
 * @method setStep
 * @param index {Integer} An integer that belongs to the position of a step
 * @param step {Object} The step object to change
 **/
$.fn.steps.setStep = function (index, step)
{
    throw new Error("Not yet implemented!");
};

/**
 * Skips an certain amount of steps.
 *
 * @method skip
 * @param count {Integer} The amount of steps that should be skipped
 * @return {Boolean} Indicates whether the action executed
 **/
$.fn.steps.skip = function (count)
{
    throw new Error("Not yet implemented!");
};

/**
 * An enum represents the different content types of a step and their loading mechanisms.
 *
 * @class contentMode
 * @for steps
 **/
var contentMode = $.fn.steps.contentMode = {
    /**
     * HTML embedded content
     *
     * @readOnly
     * @property html
     * @type Integer
     * @for contentMode
     **/
    html: 0,

    /**
     * IFrame embedded content
     *
     * @readOnly
     * @property iframe
     * @type Integer
     * @for contentMode
     **/
    iframe: 1,

    /**
     * Async embedded content
     *
     * @readOnly
     * @property async
     * @type Integer
     * @for contentMode
     **/
    async: 2
};

/**
 * An enum represents the orientation of the steps navigation.
 *
 * @class stepsOrientation
 * @for steps
 **/
var stepsOrientation = $.fn.steps.stepsOrientation = {
    /**
     * Horizontal orientation
     *
     * @readOnly
     * @property horizontal
     * @type Integer
     * @for stepsOrientation
     **/
    horizontal: 0,

    /**
     * Vertical orientation
     *
     * @readOnly
     * @property vertical
     * @type Integer
     * @for stepsOrientation
     **/
    vertical: 1
};

/**
 * An enum that represents the various transition animations.
 *
 * @class transitionEffect
 * @for steps
 **/
var transitionEffect = $.fn.steps.transitionEffect = {
    /**
     * No transition animation
     *
     * @readOnly
     * @property none
     * @type Integer
     * @for transitionEffect
     **/
    none: 0,

    /**
     * Fade in transition
     *
     * @readOnly
     * @property fade
     * @type Integer
     * @for transitionEffect
     **/
    fade: 1,

    /**
     * Slide up transition
     *
     * @readOnly
     * @property slide
     * @type Integer
     * @for transitionEffect
     **/
    slide: 2,

    /**
     * Slide left transition
     *
     * @readOnly
     * @property slideLeft
     * @type Integer
     * @for transitionEffect
     **/
    slideLeft: 3
};

var stepModel = $.fn.steps.stepModel = {
    title: "",
    content: "",
    contentUrl: "",
    contentMode: contentMode.html,
    contentLoaded: false
};

/**
 * An object that represents the default settings.
 * There are two possibities to override the sub-properties.
 * Either by doing it generally (global) or on initialization.
 *
 * @static
 * @class defaults
 * @for steps
 * @example
 *   // Global approach
 *   $.steps.defaults.headerTag = "h3";
 * @example
 *   // Initialization approach
 *   $("#wizard").steps({ headerTag: "h3" });
 **/
var defaults = $.fn.steps.defaults = {
    /**
     * The header tag is used to find the step button text within the declared wizard area.
     *
     * @property headerTag
     * @type String
     * @default "h1"
     * @for defaults
     **/
    headerTag: "h1",

    /**
     * The body tag is used to find the step content within the declared wizard area.
     *
     * @property bodyTag
     * @type String
     * @default "div"
     * @for defaults
     **/
    bodyTag: "div",

    /**
     * The content container tag which will be used to wrap all step contents.
     *
     * @property contentContainerTag
     * @type String
     * @default "div"
     * @for defaults
     **/
    contentContainerTag: "div",

    /**
     * The action container tag which will be used to wrap the pagination navigation.
     *
     * @property actionContainerTag
     * @type String
     * @default "div"
     * @for defaults
     **/
    actionContainerTag: "div",

    /**
     * The steps container tag which will be used to wrap the steps navigation.
     *
     * @property stepsContainerTag
     * @type String
     * @default "div"
     * @for defaults
     **/
    stepsContainerTag: "div",

    /**
     * The css class which will be added to the outer component wrapper.
     *
     * @property cssClass
     * @type String
     * @default "wizard"
     * @for defaults
     * @example
     *     <div class="wizard">
     *         ...
     *     </div>
     **/
    cssClass: "wizard",

    /**
     * The css class which will be used for floating scenarios.
     *
     * @property clearFixCssClass
     * @type String
     * @default "clearfix"
     * @for defaults
     **/
    clearFixCssClass: "clearfix",

    /**
     * Determines whether the steps are vertically or horizontally oriented.
     *
     * @property stepsOrientation
     * @type stepsOrientation
     * @default horizontal
     * @for defaults
     * @since 1.0.0
     **/
    stepsOrientation: stepsOrientation.horizontal,

    /*
     * Tempplates
     */

    /**
     * The title template which will be used to create a step button.
     *
     * @property titleTemplate
     * @type String
     * @default "<span class=\"number\">#index#.</span> #title#"
     * @for defaults
     **/
    titleTemplate: "<span class=\"number\">#index#.</span> #title#",

    /**
     * The loading template which will be used to create the loading animation.
     *
     * @property loadingTemplate
     * @type String
     * @default "<span class=\"spinner\"></span> #text#"
     * @for defaults
     **/
    loadingTemplate: "<span class=\"spinner\"></span> #text#",

    /*
     * Behaviour
     */

    /**
     * Sets the focus to the first wizard instance in order to enable the key navigation from the begining if `true`. 
     *
     * @property autoFocus
     * @type Boolean
     * @default false
     * @for defaults
     * @since 0.9.4
     **/
    autoFocus: false,

    /**
     * Enables all steps from the begining if `true` (all steps are clickable).
     *
     * @property enableAllSteps
     * @type Boolean
     * @default false
     * @for defaults
     **/
    enableAllSteps: false,

    /**
     * Enables keyboard navigation if `true` (arrow left and arrow right).
     *
     * @property enableKeyNavigation
     * @type Boolean
     * @default true
     * @for defaults
     **/
    enableKeyNavigation: true,

    /**
     * Enables pagination if `true`.
     *
     * @property enablePagination
     * @type Boolean
     * @default true
     * @for defaults
     **/
    enablePagination: true,

    /**
     * Suppresses pagination if a form field is focused.
     *
     * @property suppressPaginationOnFocus
     * @type Boolean
     * @default true
     * @for defaults
     **/
    suppressPaginationOnFocus: true,

    /**
     * Enables cache for async loaded or iframe embedded content.
     *
     * @property enableContentCache
     * @type Boolean
     * @default true
     * @for defaults
     **/
    enableContentCache: true,

    /**
     * Shows the cancel button if enabled.
     *
     * @property enableCancelButton
     * @type Boolean
     * @default false
     * @for defaults
     **/
    enableCancelButton: false,

    /**
     * Shows the finish button if enabled.
     *
     * @property enableFinishButton
     * @type Boolean
     * @default true
     * @for defaults
     **/
    enableFinishButton: true,

    /**
     * Not yet implemented.
     *
     * @property preloadContent
     * @type Boolean
     * @default false
     * @for defaults
     **/
    preloadContent: false,

    /**
     * Shows the finish button always (on each step; right beside the next button) if `true`. 
     * Otherwise the next button will be replaced by the finish button if the last step becomes active.
     *
     * @property showFinishButtonAlways
     * @type Boolean
     * @default false
     * @for defaults
     **/
    showFinishButtonAlways: false,

    /**
     * Prevents jumping to a previous step.
     *
     * @property forceMoveForward
     * @type Boolean
     * @default false
     * @for defaults
     **/
    forceMoveForward: false,

    /**
     * Saves the current state (step position) to a cookie.
     * By coming next time the last active step becomes activated.
     *
     * @property saveState
     * @type Boolean
     * @default false
     * @for defaults
     **/
    saveState: false,

    /**
     * The position to start on (zero-based).
     *
     * @property startIndex
     * @type Integer
     * @default 0
     * @for defaults
     **/
    startIndex: 0,

    /*
     * Animation Effect Configuration
     */

    /**
     * The animation effect which will be used for step transitions.
     *
     * @property transitionEffect
     * @type transitionEffect
     * @default none
     * @for defaults
     **/
    transitionEffect: transitionEffect.none,

    /**
     * Animation speed for step transitions (in milliseconds).
     *
     * @property transitionEffectSpeed
     * @type Integer
     * @default 200
     * @for defaults
     **/
    transitionEffectSpeed: 200,

    /*
     * Events
     */

    /**
     * Fires before the step changes and can be used to prevent step changing by returning `false`. 
     * Very useful for form validation. 
     *
     * @property onStepChanging
     * @type Event
     * @default function (event, currentIndex, newIndex) { return true; }
     * @for defaults
     **/
    onStepChanging: function (event, currentIndex, newIndex) { return true; },

    /**
     * Fires after the step has change. 
     *
     * @property onStepChanged
     * @type Event
     * @default function (event, currentIndex, priorIndex) { }
     * @for defaults
     **/
    onStepChanged: function (event, currentIndex, priorIndex) { },

    /**
     * Fires after cancelation. 
     *
     * @property onCanceled
     * @type Event
     * @default function (event) { }
     * @for defaults
     **/
    onCanceled: function (event) { },

    /**
     * Fires before finishing and can be used to prevent completion by returning `false`. 
     * Very useful for form validation. 
     *
     * @property onFinishing
     * @type Event
     * @default function (event, currentIndex) { return true; }
     * @for defaults
     **/
    onFinishing: function (event, currentIndex) { return true; },

    /**
     * Fires after completion. 
     *
     * @property onFinished
     * @type Event
     * @default function (event, currentIndex) { }
     * @for defaults
     **/
    onFinished: function (event, currentIndex) { },

    /**
     * Contains all labels. 
     *
     * @property labels
     * @type Object
     * @for defaults
     **/
    labels: {
        /**
         * Label for the cancel button.
         *
         * @property cancel
         * @type String
         * @default "Cancel"
         * @for defaults
         **/
        cancel: "Cancel",

        /**
         * This label is important for accessability reasons.
         * Indicates which step is activated.
         *
         * @property current
         * @type String
         * @default "current step:"
         * @for defaults
         **/
        current: "current step:",

        /**
         * This label is important for accessability reasons and describes the kind of navigation.
         *
         * @property pagination
         * @type String
         * @default "Pagination"
         * @for defaults
         * @since 0.9.7
         **/
        pagination: "Pagination",

        /**
         * Label for the finish button.
         *
         * @property finish
         * @type String
         * @default "Finish"
         * @for defaults
         **/
        finish: "Finish",

        /**
         * Label for the next button.
         *
         * @property next
         * @type String
         * @default "Next"
         * @for defaults
         **/
        next: "Next",

        /**
         * Label for the previous button.
         *
         * @property previous
         * @type String
         * @default "Previous"
         * @for defaults
         **/
        previous: "Previous",

        /**
         * Label for the loading animation.
         *
         * @property loading
         * @type String
         * @default "Loading ..."
         * @for defaults
         **/
        loading: "Loading ..."
    }
};
})(jQuery);;
(function( $ ){

	$.fn.videoBG = function( selector, options ) { 
		
		var options = {};
		if (typeof selector == "object") {
			options = $.extend({}, $.fn.videoBG.defaults, selector);
		}
		else if (!selector) {
			options = $.fn.videoBG.defaults;
		}
		else {
			return $(selector).videoBG(options);		
		}
		
		var container = $(this);
		
		// check if elements available otherwise it will cause issues
		if (!container.length)
			return;
		
		// container to be at least relative
		if (container.css('position') == 'static' || !container.css('position'))
			container.css('position','relative');
		
		// we need a width
		if (options.width == 0)
			options.width = container.width();
		
		// we need a height
		if (options.height == 0)
			options.height = container.height();	
		
		// get the wrapper
		var wrap = $.fn.videoBG.wrapper();
		wrap.height(options.height)
			.width(options.width);
		
		// if is a text replacement
		if (options.textReplacement) {
		
			// force sizes
			options.scale = true;
			
			// set sizes and forcing text out
			container.width(options.width)
				.height(options.height)
				.css('text-indent','-9999px');
		}
		else {
		
			// set the wrapper above the video
			wrap.css('z-index',options.zIndex+1);
		}
		
		// move the contents into the wrapper
		wrap.html(container.clone(true));
		
		// get the video
		var video = $.fn.videoBG.video(options);
		
		// if we are forcing width / height
		if (options.scale) {
			
			// overlay wrapper
			wrap.height(options.height)
				.width(options.width);
			
			// video
			video.height(options.height)
				.width(options.width);
		}
		
		// add it all to the container
		container.html(wrap);
		container.append(video);
		
		return video.find("video")[0];
	}

	// set to fullscreen
	$.fn.videoBG.setFullscreen = function($el) {
		var windowWidth = $(window).width(),
			windowHeight = $(window).height();

		$el.css('min-height',0).css('min-width',0);
		$el.parent().width(windowWidth).height(windowHeight);
		// if by width 
		if (windowWidth / windowHeight > $el.aspectRatio) {
			$el.width(windowWidth).height('auto');
			// shift the element up
			var height = $el.height();
			var shift = (height - windowHeight) / 2;
			if (shift < 0) shift = 0;
			$el.css("top",-shift);
		} else {
			$el.width('auto').height(windowHeight);			
			// shift the element left
			var width = $el.width();
			var shift = (width - windowWidth) / 2;
			if (shift < 0) shift = 0;
			$el.css("left",-shift);
			
			// this is a hack mainly due to the iphone
			if (shift === 0) {
				var t = setTimeout(function() {
					$.fn.videoBG.setFullscreen($el);
				},500);
			}
		}

		$('body > .videoBG_wrapper').width(windowWidth).height(windowHeight);
			
	}

	// get the formatted video element
	$.fn.videoBG.video = function(options) {
		
		$('html, body').scrollTop(-1);

		// video container
		var $div = $('<div/>');
		$div.addClass('videoBG')
			.css('position',options.position)
			.css('z-index',options.zIndex)
			.css('top',0)
			.css('left',0)
			.css('height',options.height)
			.css('width',options.width)
			.css('opacity',options.opacity)
			.css('overflow','hidden');
		
		// video element
		var $video = $('<video/>');
		$video.css('position','absolute')
			.css('z-index',options.zIndex)
			.attr('poster',options.poster)
			.css('top',0)
			.css('left',0)
			.css('min-width','100%')
			.css('min-height','100%');
		
		if (options.autoplay) {
			$video.attr('autoplay',options.autoplay);
		}

		// if fullscreen
		if (options.fullscreen) {
			$video.bind('canplay',function() {
				// set the aspect ratio
				$video.aspectRatio = $video.width() / $video.height();
				$.fn.videoBG.setFullscreen($video);
			})

			// listen out for screenresize
			var resizeTimeout;
			$(window).resize(function() {
				clearTimeout(resizeTimeout);
				resizeTimeout = setTimeout(function() {
					$.fn.videoBG.setFullscreen($video);
				},100);	
			});
			$.fn.videoBG.setFullscreen($video);
		}
			
		
		// video standard element
		var v = $video[0];
		
		// if meant to loop
		if (options.loop) {
			loops_left = options.loop;
		
			// cant use the loop attribute as firefox doesnt support it
			$video.bind('ended', function(){
				
				// if we have some loops to throw
				if (loops_left)
					// replay that bad boy
					v.play();
				
				// if not forever
				if (loops_left !== true)
					// one less loop
					loops_left--;
  			});
		}
		
		// when can play, play
		$video.bind('canplay', function(){
			
			if (options.autoplay)
				// replay that bad boy
				v.play();
				
		});
		
		
		// if supports video
		if ($.fn.videoBG.supportsVideo()) {

		  	// supports webm
		  	if ($.fn.videoBG.supportType('webm')){
		  		
		  		// play webm
		  		$video.attr('src',options.webm);
		  	}
		  	// supports mp4
		  	else if ($.fn.videoBG.supportType('mp4')) {	  	
		  		
		  		// play mp4
		  		$video.attr('src',options.mp4);
		  		
		  	//	$video.html('<source src="'.options.mp4.'" />');
		  		
		  	}
		  	// throw ogv at it then
		  	else {
		  		
		  		// play ogv
		  		$video.attr('src',options.ogv);
		  	}
	  	
	  	}
	  	
	  	
		
		// image for those that dont support the video	
		var $img = $('<img/>');
		$img.attr('src',options.poster)
			.css('position','absolute')
			.css('z-index',options.zIndex)
			.css('top',0)
			.css('left',0)
			.css('min-width','100%')
			.css('min-height','100%');
		
		// add the image to the video
		// if suuports video
		if ($.fn.videoBG.supportsVideo()) {
			// add the video to the wrapper
			$div.html($video);
		}
		
		// nope - whoa old skool
		else {
			
			// add the image instead
			$div.html($img);
		}
		
		// if text replacement
		if (options.textReplacement) {
	
			// force the heights and widths
			$div.css('min-height',1).css('min-width',1);
			$video.css('min-height',1).css('min-width',1);
			$img.css('min-height',1).css('min-width',1);
			
			$div.height(options.height).width(options.width);
			$video.height(options.height).width(options.width);
			$img.height(options.height).width(options.width);	
		}
		
		if ($.fn.videoBG.supportsVideo()) {
			v.play();
		}
		return $div;
	}
	
	// check if suuports video
	$.fn.videoBG.supportsVideo = function() {
		return (document.createElement('video').canPlayType);
	}
	
	// check which type is supported
	$.fn.videoBG.supportType = function(str) {
		
		// if not at all supported
		if (!$.fn.videoBG.supportsVideo())
			return false;
		
		// create video
		var v = document.createElement('video');
		
		// check which?
		switch (str) {
			case 'webm' :
				return (v.canPlayType('video/webm; codecs="vp8, vorbis"'));
				break;
			case 'mp4' :
				return (v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'));
				break;
			case 'ogv' :
				return (v.canPlayType('video/ogg; codecs="theora, vorbis"'));
				break;			
		}
		// nope
		return false;	
	}
	
	// get the overlay wrapper
	$.fn.videoBG.wrapper = function() {
		var $wrap = $('<div/>');
		$wrap.addClass('videoBG_wrapper')
			.css('position','absolute')
			.css('top',0)
			.css('left',0);
		return $wrap;
	}
	
	// these are the defaults
	$.fn.videoBG.defaults = {
			mp4:'',
			ogv:'',
			webm:'',
			poster:'',
			autoplay:true,
			loop:true,
			scale:false,
			position:"absolute",
			opacity:1,
			textReplacement:false,
			zIndex:0,
			width:0,
			height:0,
			fullscreen:false,
			imgFallback:true
		}

})( jQuery );;
/*! Magnific Popup - v0.9.9 - 2013-12-27
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2013 Dmitry Semenov; */
;(function($) {

/*>>core*/
/**
 * 
 * Magnific Popup Core JS file
 * 
 */


/**
 * Private static constants
 */
var CLOSE_EVENT = 'Close',
  BEFORE_CLOSE_EVENT = 'BeforeClose',
  AFTER_CLOSE_EVENT = 'AfterClose',
  BEFORE_APPEND_EVENT = 'BeforeAppend',
  MARKUP_PARSE_EVENT = 'MarkupParse',
  OPEN_EVENT = 'Open',
  CHANGE_EVENT = 'Change',
  NS = 'mfp',
  EVENT_NS = '.' + NS,
  READY_CLASS = 'mfp-ready',
  REMOVING_CLASS = 'mfp-removing',
  PREVENT_CLOSE_CLASS = 'mfp-prevent-close';


/**
 * Private vars 
 */
var mfp, // As we have only one instance of MagnificPopup object, we define it locally to not to use 'this'
  MagnificPopup = function(){},
  _isJQ = !!(window.jQuery),
  _prevStatus,
  _window = $(window),
  _body,
  _document,
  _prevContentType,
  _wrapClasses,
  _currPopupType;


/**
 * Private functions
 */
var _mfpOn = function(name, f) {
    mfp.ev.on(NS + name + EVENT_NS, f);
  },
  _getEl = function(className, appendTo, html, raw) {
    var el = document.createElement('div');
    el.className = 'mfp-'+className;
    if(html) {
      el.innerHTML = html;
    }
    if(!raw) {
      el = $(el);
      if(appendTo) {
        el.appendTo(appendTo);
      }
    } else if(appendTo) {
      appendTo.appendChild(el);
    }
    return el;
  },
  _mfpTrigger = function(e, data) {
    mfp.ev.triggerHandler(NS + e, data);

    if(mfp.st.callbacks) {
      // converts "mfpEventName" to "eventName" callback and triggers it if it's present
      e = e.charAt(0).toLowerCase() + e.slice(1);
      if(mfp.st.callbacks[e]) {
        mfp.st.callbacks[e].apply(mfp, $.isArray(data) ? data : [data]);
      }
    }
  },
  _getCloseBtn = function(type) {
    if(type !== _currPopupType || !mfp.currTemplate.closeBtn) {
      mfp.currTemplate.closeBtn = $( mfp.st.closeMarkup.replace('%title%', mfp.st.tClose ) );
      _currPopupType = type;
    }
    return mfp.currTemplate.closeBtn;
  },
  // Initialize Magnific Popup only when called at least once
  _checkInstance = function() {
    if(!$.magnificPopup.instance) {
      mfp = new MagnificPopup();
      mfp.init();
      $.magnificPopup.instance = mfp;
    }
  },
  // CSS transition detection, http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
  supportsTransitions = function() {
    var s = document.createElement('p').style, // 's' for style. better to create an element if body yet to exist
      v = ['ms','O','Moz','Webkit']; // 'v' for vendor

    if( s['transition'] !== undefined ) {
      return true; 
    }
      
    while( v.length ) {
      if( v.pop() + 'Transition' in s ) {
        return true;
      }
    }
        
    return false;
  };



/**
 * Public functions
 */
MagnificPopup.prototype = {

  constructor: MagnificPopup,

  /**
   * Initializes Magnific Popup plugin. 
   * This function is triggered only once when $.fn.magnificPopup or $.magnificPopup is executed
   */
  init: function() {
    var appVersion = navigator.appVersion;
    mfp.isIE7 = appVersion.indexOf("MSIE 7.") !== -1; 
    mfp.isIE8 = appVersion.indexOf("MSIE 8.") !== -1;
    mfp.isLowIE = mfp.isIE7 || mfp.isIE8;
    mfp.isAndroid = (/android/gi).test(appVersion);
    mfp.isIOS = (/iphone|ipad|ipod/gi).test(appVersion);
    mfp.supportsTransition = supportsTransitions();

    // We disable fixed positioned lightbox on devices that don't handle it nicely.
    // If you know a better way of detecting this - let me know.
    mfp.probablyMobile = (mfp.isAndroid || mfp.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent) );
    _document = $(document);

    mfp.popupsCache = {};
  },

  /**
   * Opens popup
   * @param  data [description]
   */
  open: function(data) {

    if(!_body) {
      _body = $(document.body);
    }

    var i;

    if(data.isObj === false) { 
      // convert jQuery collection to array to avoid conflicts later
      mfp.items = data.items.toArray();

      mfp.index = 0;
      var items = data.items,
        item;
      for(i = 0; i < items.length; i++) {
        item = items[i];
        if(item.parsed) {
          item = item.el[0];
        }
        if(item === data.el[0]) {
          mfp.index = i;
          break;
        }
      }
    } else {
      mfp.items = $.isArray(data.items) ? data.items : [data.items];
      mfp.index = data.index || 0;
    }

    // if popup is already opened - we just update the content
    if(mfp.isOpen) {
      mfp.updateItemHTML();
      return;
    }
    
    mfp.types = []; 
    _wrapClasses = '';
    if(data.mainEl && data.mainEl.length) {
      mfp.ev = data.mainEl.eq(0);
    } else {
      mfp.ev = _document;
    }

    if(data.key) {
      if(!mfp.popupsCache[data.key]) {
        mfp.popupsCache[data.key] = {};
      }
      mfp.currTemplate = mfp.popupsCache[data.key];
    } else {
      mfp.currTemplate = {};
    }



    mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data ); 
    mfp.fixedContentPos = mfp.st.fixedContentPos === 'auto' ? !mfp.probablyMobile : mfp.st.fixedContentPos;

    if(mfp.st.modal) {
      mfp.st.closeOnContentClick = false;
      mfp.st.closeOnBgClick = false;
      mfp.st.showCloseBtn = false;
      mfp.st.enableEscapeKey = false;
    }
    

    // Building markup
    // main containers are created only once
    if(!mfp.bgOverlay) {

      // Dark overlay
      mfp.bgOverlay = _getEl('bg').on('click'+EVENT_NS, function() {
        mfp.close();
      });

      mfp.wrap = _getEl('wrap').attr('tabindex', -1).on('click'+EVENT_NS, function(e) {
        if(mfp._checkIfClose(e.target)) {
          mfp.close();
        }
      });

      mfp.container = _getEl('container', mfp.wrap);
    }

    mfp.contentContainer = _getEl('content');
    if(mfp.st.preloader) {
      mfp.preloader = _getEl('preloader', mfp.container, mfp.st.tLoading);
    }


    // Initializing modules
    var modules = $.magnificPopup.modules;
    for(i = 0; i < modules.length; i++) {
      var n = modules[i];
      n = n.charAt(0).toUpperCase() + n.slice(1);
      mfp['init'+n].call(mfp);
    }
    _mfpTrigger('BeforeOpen');


    if(mfp.st.showCloseBtn) {
      // Close button
      if(!mfp.st.closeBtnInside) {
        mfp.wrap.append( _getCloseBtn() );
      } else {
        _mfpOn(MARKUP_PARSE_EVENT, function(e, template, values, item) {
          values.close_replaceWith = _getCloseBtn(item.type);
        });
        _wrapClasses += ' mfp-close-btn-in';
      }
    }

    if(mfp.st.alignTop) {
      _wrapClasses += ' mfp-align-top';
    }

  

    if(mfp.fixedContentPos) {
      mfp.wrap.css({
        overflow: mfp.st.overflowY,
        overflowX: 'hidden',
        overflowY: mfp.st.overflowY
      });
    } else {
      mfp.wrap.css({ 
        top: _window.scrollTop(),
        position: 'absolute'
      });
    }
    if( mfp.st.fixedBgPos === false || (mfp.st.fixedBgPos === 'auto' && !mfp.fixedContentPos) ) {
      mfp.bgOverlay.css({
        height: _document.height(),
        position: 'absolute'
      });
    }

    

    if(mfp.st.enableEscapeKey) {
      // Close on ESC key
      _document.on('keyup' + EVENT_NS, function(e) {
        if(e.keyCode === 27) {
          mfp.close();
        }
      });
    }

    _window.on('resize' + EVENT_NS, function() {
      mfp.updateSize();
    });


    if(!mfp.st.closeOnContentClick) {
      _wrapClasses += ' mfp-auto-cursor';
    }
    
    if(_wrapClasses)
      mfp.wrap.addClass(_wrapClasses);


    // this triggers recalculation of layout, so we get it once to not to trigger twice
    var windowHeight = mfp.wH = _window.height();

    
    var windowStyles = {};

    if( mfp.fixedContentPos ) {
            if(mfp._hasScrollBar(windowHeight)){
                var s = mfp._getScrollbarSize();
                if(s) {
                    windowStyles.marginRight = s;
                }
            }
        }

    if(mfp.fixedContentPos) {
      if(!mfp.isIE7) {
        windowStyles.overflow = 'hidden';
      } else {
        // ie7 double-scroll bug
        $('body, html').css('overflow', 'hidden');
      }
    }

    
    
    var classesToadd = mfp.st.mainClass;
    if(mfp.isIE7) {
      classesToadd += ' mfp-ie7';
    }
    if(classesToadd) {
      mfp._addClassToMFP( classesToadd );
    }

    // add content
    mfp.updateItemHTML();

    _mfpTrigger('BuildControls');

    // remove scrollbar, add margin e.t.c
    $('html').css(windowStyles);
    
    // add everything to DOM
    mfp.bgOverlay.add(mfp.wrap).prependTo( mfp.st.prependTo || _body );

    // Save last focused element
    mfp._lastFocusedEl = document.activeElement;
    
    // Wait for next cycle to allow CSS transition
    setTimeout(function() {
      
      if(mfp.content) {
        mfp._addClassToMFP(READY_CLASS);
        mfp._setFocus();
      } else {
        // if content is not defined (not loaded e.t.c) we add class only for BG
        mfp.bgOverlay.addClass(READY_CLASS);
      }
      
      // Trap the focus in popup
      _document.on('focusin' + EVENT_NS, mfp._onFocusIn);

    }, 16);

    mfp.isOpen = true;
    mfp.updateSize(windowHeight);
    _mfpTrigger(OPEN_EVENT);

    return data;
  },

  /**
   * Closes the popup
   */
  close: function() {
    if(!mfp.isOpen) return;
    _mfpTrigger(BEFORE_CLOSE_EVENT);

    mfp.isOpen = false;
    // for CSS3 animation
    if(mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition )  {
      mfp._addClassToMFP(REMOVING_CLASS);
      setTimeout(function() {
        mfp._close();
      }, mfp.st.removalDelay);
    } else {
      mfp._close();
    }
  },

  /**
   * Helper for close() function
   */
  _close: function() {
    _mfpTrigger(CLOSE_EVENT);

    var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' ';

    mfp.bgOverlay.detach();
    mfp.wrap.detach();
    mfp.container.empty();

    if(mfp.st.mainClass) {
      classesToRemove += mfp.st.mainClass + ' ';
    }

    mfp._removeClassFromMFP(classesToRemove);

    if(mfp.fixedContentPos) {
      var windowStyles = {marginRight: ''};
      if(mfp.isIE7) {
        $('body, html').css('overflow', '');
      } else {
        windowStyles.overflow = '';
      }
      $('html').css(windowStyles);
    }
    
    _document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS);
    mfp.ev.off(EVENT_NS);

    // clean up DOM elements that aren't removed
    mfp.wrap.attr('class', 'mfp-wrap').removeAttr('style');
    mfp.bgOverlay.attr('class', 'mfp-bg');
    mfp.container.attr('class', 'mfp-container');

    // remove close button from target element
    if(mfp.st.showCloseBtn &&
    (!mfp.st.closeBtnInside || mfp.currTemplate[mfp.currItem.type] === true)) {
      if(mfp.currTemplate.closeBtn)
        mfp.currTemplate.closeBtn.detach();
    }


    if(mfp._lastFocusedEl) {
      $(mfp._lastFocusedEl).focus(); // put tab focus back
    }
    mfp.currItem = null;  
    mfp.content = null;
    mfp.currTemplate = null;
    mfp.prevHeight = 0;

    _mfpTrigger(AFTER_CLOSE_EVENT);
  },
  
  updateSize: function(winHeight) {

    if(mfp.isIOS) {
      // fixes iOS nav bars https://github.com/dimsemenov/Magnific-Popup/issues/2
      var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
      var height = window.innerHeight * zoomLevel;
      mfp.wrap.css('height', height);
      mfp.wH = height;
    } else {
      mfp.wH = winHeight || _window.height();
    }
    // Fixes #84: popup incorrectly positioned with position:relative on body
    if(!mfp.fixedContentPos) {
      mfp.wrap.css('height', mfp.wH);
    }

    _mfpTrigger('Resize');

  },

  /**
   * Set content of popup based on current index
   */
  updateItemHTML: function() {
    var item = mfp.items[mfp.index];

    // Detach and perform modifications
    mfp.contentContainer.detach();

    if(mfp.content)
      mfp.content.detach();

    if(!item.parsed) {
      item = mfp.parseEl( mfp.index );
    }

    var type = item.type; 

    _mfpTrigger('BeforeChange', [mfp.currItem ? mfp.currItem.type : '', type]);
    // BeforeChange event works like so:
    // _mfpOn('BeforeChange', function(e, prevType, newType) { });
    
    mfp.currItem = item;

    

    

    if(!mfp.currTemplate[type]) {
      var markup = mfp.st[type] ? mfp.st[type].markup : false;

      // allows to modify markup
      _mfpTrigger('FirstMarkupParse', markup);

      if(markup) {
        mfp.currTemplate[type] = $(markup);
      } else {
        // if there is no markup found we just define that template is parsed
        mfp.currTemplate[type] = true;
      }
    }

    if(_prevContentType && _prevContentType !== item.type) {
      mfp.container.removeClass('mfp-'+_prevContentType+'-holder');
    }
    
    var newContent = mfp['get' + type.charAt(0).toUpperCase() + type.slice(1)](item, mfp.currTemplate[type]);
    mfp.appendContent(newContent, type);

    item.preloaded = true;

    _mfpTrigger(CHANGE_EVENT, item);
    _prevContentType = item.type;
    
    // Append container back after its content changed
    mfp.container.prepend(mfp.contentContainer);

    _mfpTrigger('AfterChange');
  },


  /**
   * Set HTML content of popup
   */
  appendContent: function(newContent, type) {
    mfp.content = newContent;
    
    if(newContent) {
      if(mfp.st.showCloseBtn && mfp.st.closeBtnInside &&
        mfp.currTemplate[type] === true) {
        // if there is no markup, we just append close button element inside
        if(!mfp.content.find('.mfp-close').length) {
          mfp.content.append(_getCloseBtn());
        }
      } else {
        mfp.content = newContent;
      }
    } else {
      mfp.content = '';
    }

    _mfpTrigger(BEFORE_APPEND_EVENT);
    mfp.container.addClass('mfp-'+type+'-holder');

    mfp.contentContainer.append(mfp.content);
  },



  
  /**
   * Creates Magnific Popup data object based on given data
   * @param  {int} index Index of item to parse
   */
  parseEl: function(index) {
    var item = mfp.items[index],
      type;

    if(item.tagName) {
      item = { el: $(item) };
    } else {
      type = item.type;
      item = { data: item, src: item.src };
    }

    if(item.el) {
      var types = mfp.types;

      // check for 'mfp-TYPE' class
      for(var i = 0; i < types.length; i++) {
        if( item.el.hasClass('mfp-'+types[i]) ) {
          type = types[i];
          break;
        }
      }

      item.src = item.el.attr('data-mfp-src');
      if(!item.src) {
        item.src = item.el.attr('href');
      }
    }

    item.type = type || mfp.st.type || 'inline';
    item.index = index;
    item.parsed = true;
    mfp.items[index] = item;
    _mfpTrigger('ElementParse', item);

    return mfp.items[index];
  },


  /**
   * Initializes single popup or a group of popups
   */
  addGroup: function(el, options) {
    var eHandler = function(e) {
      e.mfpEl = this;
      mfp._openClick(e, el, options);
    };

    if(!options) {
      options = {};
    } 

    var eName = 'click.magnificPopup';
    options.mainEl = el;
    
    if(options.items) {
      options.isObj = true;
      el.off(eName).on(eName, eHandler);
    } else {
      options.isObj = false;
      if(options.delegate) {
        el.off(eName).on(eName, options.delegate , eHandler);
      } else {
        options.items = el;
        el.off(eName).on(eName, eHandler);
      }
    }
  },
  _openClick: function(e, el, options) {
    var midClick = options.midClick !== undefined ? options.midClick : $.magnificPopup.defaults.midClick;


    if(!midClick && ( e.which === 2 || e.ctrlKey || e.metaKey ) ) {
      return;
    }

    var disableOn = options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn;

    if(disableOn) {
      if($.isFunction(disableOn)) {
        if( !disableOn.call(mfp) ) {
          return true;
        }
      } else { // else it's number
        if( _window.width() < disableOn ) {
          return true;
        }
      }
    }
    
    if(e.type) {
      e.preventDefault();

      // This will prevent popup from closing if element is inside and popup is already opened
      if(mfp.isOpen) {
        e.stopPropagation();
      }
    }
      

    options.el = $(e.mfpEl);
    if(options.delegate) {
      options.items = el.find(options.delegate);
    }
    mfp.open(options);
  },


  /**
   * Updates text on preloader
   */
  updateStatus: function(status, text) {

    if(mfp.preloader) {
      if(_prevStatus !== status) {
        mfp.container.removeClass('mfp-s-'+_prevStatus);
      }

      if(!text && status === 'loading') {
        text = mfp.st.tLoading;
      }

      var data = {
        status: status,
        text: text
      };
      // allows to modify status
      _mfpTrigger('UpdateStatus', data);

      status = data.status;
      text = data.text;

      mfp.preloader.html(text);

      mfp.preloader.find('a').on('click', function(e) {
        e.stopImmediatePropagation();
      });

      mfp.container.addClass('mfp-s-'+status);
      _prevStatus = status;
    }
  },


  /*
    "Private" helpers that aren't private at all
   */
  // Check to close popup or not
  // "target" is an element that was clicked
  _checkIfClose: function(target) {

    if($(target).hasClass(PREVENT_CLOSE_CLASS)) {
      return;
    }

    var closeOnContent = mfp.st.closeOnContentClick;
    var closeOnBg = mfp.st.closeOnBgClick;

    if(closeOnContent && closeOnBg) {
      return true;
    } else {

      // We close the popup if click is on close button or on preloader. Or if there is no content.
      if(!mfp.content || $(target).hasClass('mfp-close') || (mfp.preloader && target === mfp.preloader[0]) ) {
        return true;
      }

      // if click is outside the content
      if(  (target !== mfp.content[0] && !$.contains(mfp.content[0], target))  ) {
        if(closeOnBg) {
          // last check, if the clicked element is in DOM, (in case it's removed onclick)
          if( $.contains(document, target) ) {
            return true;
          }
        }
      } else if(closeOnContent) {
        return true;
      }

    }
    return false;
  },
  _addClassToMFP: function(cName) {
    mfp.bgOverlay.addClass(cName);
    mfp.wrap.addClass(cName);
  },
  _removeClassFromMFP: function(cName) {
    this.bgOverlay.removeClass(cName);
    mfp.wrap.removeClass(cName);
  },
  _hasScrollBar: function(winHeight) {
    return (  (mfp.isIE7 ? _document.height() : document.body.scrollHeight) > (winHeight || _window.height()) );
  },
  _setFocus: function() {
    (mfp.st.focus ? mfp.content.find(mfp.st.focus).eq(0) : mfp.wrap).focus();
  },
  _onFocusIn: function(e) {
    if( e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target) ) {
      mfp._setFocus();
      return false;
    }
  },
  _parseMarkup: function(template, values, item) {
    var arr;
    if(item.data) {
      values = $.extend(item.data, values);
    }
    _mfpTrigger(MARKUP_PARSE_EVENT, [template, values, item] );

    $.each(values, function(key, value) {
      if(value === undefined || value === false) {
        return true;
      }
      arr = key.split('_');
      if(arr.length > 1) {
        var el = template.find(EVENT_NS + '-'+arr[0]);

        if(el.length > 0) {
          var attr = arr[1];
          if(attr === 'replaceWith') {
            if(el[0] !== value[0]) {
              el.replaceWith(value);
            }
          } else if(attr === 'img') {
            if(el.is('img')) {
              el.attr('src', value);
            } else {
              el.replaceWith( '<img src="'+value+'" class="' + el.attr('class') + '" />' );
            }
          } else {
            el.attr(arr[1], value);
          }
        }

      } else {
        template.find(EVENT_NS + '-'+key).html(value);
      }
    });
  },

  _getScrollbarSize: function() {
    // thx David
    if(mfp.scrollbarSize === undefined) {
      var scrollDiv = document.createElement("div");
      scrollDiv.id = "mfp-sbm";
      scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
      document.body.appendChild(scrollDiv);
      mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
    }
    return mfp.scrollbarSize;
  }

}; /* MagnificPopup core prototype end */




/**
 * Public static functions
 */
$.magnificPopup = {
  instance: null,
  proto: MagnificPopup.prototype,
  modules: [],

  open: function(options, index) {
    _checkInstance(); 

    if(!options) {
      options = {};
    } else {
      options = $.extend(true, {}, options);
    }
      

    options.isObj = true;
    options.index = index || 0;
    return this.instance.open(options);
  },

  close: function() {
    return $.magnificPopup.instance && $.magnificPopup.instance.close();
  },

  registerModule: function(name, module) {
    if(module.options) {
      $.magnificPopup.defaults[name] = module.options;
    }
    $.extend(this.proto, module.proto);     
    this.modules.push(name);
  },

  defaults: {   

    // Info about options is in docs:
    // http://dimsemenov.com/plugins/magnific-popup/documentation.html#options
    
    disableOn: 0, 

    key: null,

    midClick: false,

    mainClass: '',

    preloader: true,

    focus: '', // CSS selector of input to focus after popup is opened
    
    closeOnContentClick: false,

    closeOnBgClick: true,

    closeBtnInside: true, 

    showCloseBtn: true,

    enableEscapeKey: true,

    modal: false,

    alignTop: false,
  
    removalDelay: 0,

    prependTo: null,
    
    fixedContentPos: 'auto', 
  
    fixedBgPos: 'auto',

    overflowY: 'auto',

    closeMarkup: '<button title="%title%" type="button" class="mfp-close">&times;</button>',

    tClose: 'Close (Esc)',

    tLoading: 'Loading...'

  }
};



$.fn.magnificPopup = function(options) {
  _checkInstance();

  var jqEl = $(this);

  // We call some API method of first param is a string
  if (typeof options === "string" ) {

    if(options === 'open') {
      var items,
        itemOpts = _isJQ ? jqEl.data('magnificPopup') : jqEl[0].magnificPopup,
        index = parseInt(arguments[1], 10) || 0;

      if(itemOpts.items) {
        items = itemOpts.items[index];
      } else {
        items = jqEl;
        if(itemOpts.delegate) {
          items = items.find(itemOpts.delegate);
        }
        items = items.eq( index );
      }
      mfp._openClick({mfpEl:items}, jqEl, itemOpts);
    } else {
      if(mfp.isOpen)
        mfp[options].apply(mfp, Array.prototype.slice.call(arguments, 1));
    }

  } else {
    // clone options obj
    options = $.extend(true, {}, options);
    
    /*
     * As Zepto doesn't support .data() method for objects 
     * and it works only in normal browsers
     * we assign "options" object directly to the DOM element. FTW!
     */
    if(_isJQ) {
      jqEl.data('magnificPopup', options);
    } else {
      jqEl[0].magnificPopup = options;
    }

    mfp.addGroup(jqEl, options);

  }
  return jqEl;
};


//Quick benchmark
/*
var start = performance.now(),
  i,
  rounds = 1000;

for(i = 0; i < rounds; i++) {

}
console.log('Test #1:', performance.now() - start);

start = performance.now();
for(i = 0; i < rounds; i++) {

}
console.log('Test #2:', performance.now() - start);
*/


/*>>core*/

/*>>inline*/

var INLINE_NS = 'inline',
  _hiddenClass,
  _inlinePlaceholder, 
  _lastInlineElement,
  _putInlineElementsBack = function() {
    if(_lastInlineElement) {
      _inlinePlaceholder.after( _lastInlineElement.addClass(_hiddenClass) ).detach();
      _lastInlineElement = null;
    }
  };

$.magnificPopup.registerModule(INLINE_NS, {
  options: {
    hiddenClass: 'hide', // will be appended with `mfp-` prefix
    markup: '',
    tNotFound: 'Content not found'
  },
  proto: {

    initInline: function() {
      mfp.types.push(INLINE_NS);

      _mfpOn(CLOSE_EVENT+'.'+INLINE_NS, function() {
        _putInlineElementsBack();
      });
    },

    getInline: function(item, template) {

      _putInlineElementsBack();

      if(item.src) {
        var inlineSt = mfp.st.inline,
          el = $(item.src);

        if(el.length) {

          // If target element has parent - we replace it with placeholder and put it back after popup is closed
          var parent = el[0].parentNode;
          if(parent && parent.tagName) {
            if(!_inlinePlaceholder) {
              _hiddenClass = inlineSt.hiddenClass;
              _inlinePlaceholder = _getEl(_hiddenClass);
              _hiddenClass = 'mfp-'+_hiddenClass;
            }
            // replace target inline element with placeholder
            _lastInlineElement = el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass);
          }

          mfp.updateStatus('ready');
        } else {
          mfp.updateStatus('error', inlineSt.tNotFound);
          el = $('<div>');
        }

        item.inlineElement = el;
        return el;
      }

      mfp.updateStatus('ready');
      mfp._parseMarkup(template, {}, item);
      return template;
    }
  }
});

/*>>inline*/

/*>>ajax*/
var AJAX_NS = 'ajax',
  _ajaxCur,
  _removeAjaxCursor = function() {
    if(_ajaxCur) {
      _body.removeClass(_ajaxCur);
    }
  },
  _destroyAjaxRequest = function() {
    _removeAjaxCursor();
    if(mfp.req) {
      mfp.req.abort();
    }
  };

$.magnificPopup.registerModule(AJAX_NS, {

  options: {
    settings: null,
    cursor: 'mfp-ajax-cur',
    tError: '<a href="%url%">The content</a> could not be loaded.'
  },

  proto: {
    initAjax: function() {
      mfp.types.push(AJAX_NS);
      _ajaxCur = mfp.st.ajax.cursor;

      _mfpOn(CLOSE_EVENT+'.'+AJAX_NS, _destroyAjaxRequest);
      _mfpOn('BeforeChange.' + AJAX_NS, _destroyAjaxRequest);
    },
    getAjax: function(item) {

      if(_ajaxCur)
        _body.addClass(_ajaxCur);

      mfp.updateStatus('loading');

      var opts = $.extend({
        url: item.src,
        success: function(data, textStatus, jqXHR) {
          var temp = {
            data:data,
            xhr:jqXHR
          };

          _mfpTrigger('ParseAjax', temp);

          mfp.appendContent( $(temp.data), AJAX_NS );

          item.finished = true;

          _removeAjaxCursor();

          mfp._setFocus();

          setTimeout(function() {
            mfp.wrap.addClass(READY_CLASS);
          }, 16);

          mfp.updateStatus('ready');

          _mfpTrigger('AjaxContentAdded');
        },
        error: function() {
          _removeAjaxCursor();
          item.finished = item.loadError = true;
          mfp.updateStatus('error', mfp.st.ajax.tError.replace('%url%', item.src));
        }
      }, mfp.st.ajax.settings);

      mfp.req = $.ajax(opts);

      return '';
    }
  }
});





  

/*>>ajax*/

/*>>image*/
var _imgInterval,
  _getTitle = function(item) {
    if(item.data && item.data.title !== undefined) 
      return item.data.title;

    var src = mfp.st.image.titleSrc;

    if(src) {
      if($.isFunction(src)) {
        return src.call(mfp, item);
      } else if(item.el) {
        return item.el.attr(src) || '';
      }
    }
    return '';
  };

$.magnificPopup.registerModule('image', {

  options: {
    markup: '<div class="mfp-figure">'+
          '<div class="mfp-close"></div>'+
          '<figure>'+
            '<div class="mfp-img"></div>'+
            '<figcaption>'+
              '<div class="mfp-bottom-bar">'+
                '<div class="mfp-title"></div>'+
                '<div class="mfp-counter"></div>'+
              '</div>'+
            '</figcaption>'+
          '</figure>'+
        '</div>',
    cursor: 'mfp-zoom-out-cur',
    titleSrc: 'title', 
    verticalFit: true,
    tError: '<a href="%url%">The image</a> could not be loaded.'
  },

  proto: {
    initImage: function() {
      var imgSt = mfp.st.image,
        ns = '.image';

      mfp.types.push('image');

      _mfpOn(OPEN_EVENT+ns, function() {
        if(mfp.currItem.type === 'image' && imgSt.cursor) {
          _body.addClass(imgSt.cursor);
        }
      });

      _mfpOn(CLOSE_EVENT+ns, function() {
        if(imgSt.cursor) {
          _body.removeClass(imgSt.cursor);
        }
        _window.off('resize' + EVENT_NS);
      });

      _mfpOn('Resize'+ns, mfp.resizeImage);
      if(mfp.isLowIE) {
        _mfpOn('AfterChange', mfp.resizeImage);
      }
    },
    resizeImage: function() {
      var item = mfp.currItem;
      if(!item || !item.img) return;

      if(mfp.st.image.verticalFit) {
        var decr = 0;
        // fix box-sizing in ie7/8
        if(mfp.isLowIE) {
          decr = parseInt(item.img.css('padding-top'), 10) + parseInt(item.img.css('padding-bottom'),10);
        }
        item.img.css('max-height', mfp.wH-decr);
      }
    },
    _onImageHasSize: function(item) {
      if(item.img) {
        
        item.hasSize = true;

        if(_imgInterval) {
          clearInterval(_imgInterval);
        }
        
        item.isCheckingImgSize = false;

        _mfpTrigger('ImageHasSize', item);

        if(item.imgHidden) {
          if(mfp.content)
            mfp.content.removeClass('mfp-loading');
          
          item.imgHidden = false;
        }

      }
    },

    /**
     * Function that loops until the image has size to display elements that rely on it asap
     */
    findImageSize: function(item) {

      var counter = 0,
        img = item.img[0],
        mfpSetInterval = function(delay) {

          if(_imgInterval) {
            clearInterval(_imgInterval);
          }
          // decelerating interval that checks for size of an image
          _imgInterval = setInterval(function() {
            if(img.naturalWidth > 0) {
              mfp._onImageHasSize(item);
              return;
            }

            if(counter > 200) {
              clearInterval(_imgInterval);
            }

            counter++;
            if(counter === 3) {
              mfpSetInterval(10);
            } else if(counter === 40) {
              mfpSetInterval(50);
            } else if(counter === 100) {
              mfpSetInterval(500);
            }
          }, delay);
        };

      mfpSetInterval(1);
    },

    getImage: function(item, template) {

      var guard = 0,

        // image load complete handler
        onLoadComplete = function() {
          if(item) {
            if (item.img[0].complete) {
              item.img.off('.mfploader');
              
              if(item === mfp.currItem){
                mfp._onImageHasSize(item);

                mfp.updateStatus('ready');
              }

              item.hasSize = true;
              item.loaded = true;

              _mfpTrigger('ImageLoadComplete');
              
            }
            else {
              // if image complete check fails 200 times (20 sec), we assume that there was an error.
              guard++;
              if(guard < 200) {
                setTimeout(onLoadComplete,100);
              } else {
                onLoadError();
              }
            }
          }
        },

        // image error handler
        onLoadError = function() {
          if(item) {
            item.img.off('.mfploader');
            if(item === mfp.currItem){
              mfp._onImageHasSize(item);
              mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
            }

            item.hasSize = true;
            item.loaded = true;
            item.loadError = true;
          }
        },
        imgSt = mfp.st.image;


      var el = template.find('.mfp-img');
      if(el.length) {
        var img = document.createElement('img');
        img.className = 'mfp-img';
        item.img = $(img).on('load.mfploader', onLoadComplete).on('error.mfploader', onLoadError);
        img.src = item.src;

        // without clone() "error" event is not firing when IMG is replaced by new IMG
        // TODO: find a way to avoid such cloning
        if(el.is('img')) {
          item.img = item.img.clone();
        }

        img = item.img[0];
        if(img.naturalWidth > 0) {
          item.hasSize = true;
        } else if(!img.width) {                   
          item.hasSize = false;
        }
      }

      mfp._parseMarkup(template, {
        title: _getTitle(item),
        img_replaceWith: item.img
      }, item);

      mfp.resizeImage();

      if(item.hasSize) {
        if(_imgInterval) clearInterval(_imgInterval);

        if(item.loadError) {
          template.addClass('mfp-loading');
          mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
        } else {
          template.removeClass('mfp-loading');
          mfp.updateStatus('ready');
        }
        return template;
      }

      mfp.updateStatus('loading');
      item.loading = true;

      if(!item.hasSize) {
        item.imgHidden = true;
        template.addClass('mfp-loading');
        mfp.findImageSize(item);
      } 

      return template;
    }
  }
});



/*>>image*/

/*>>zoom*/
var hasMozTransform,
  getHasMozTransform = function() {
    if(hasMozTransform === undefined) {
      hasMozTransform = document.createElement('p').style.MozTransform !== undefined;
    }
    return hasMozTransform;   
  };

$.magnificPopup.registerModule('zoom', {

  options: {
    enabled: false,
    easing: 'ease-in-out',
    duration: 300,
    opener: function(element) {
      return element.is('img') ? element : element.find('img');
    }
  },

  proto: {

    initZoom: function() {
      var zoomSt = mfp.st.zoom,
        ns = '.zoom',
        image;
        
      if(!zoomSt.enabled || !mfp.supportsTransition) {
        return;
      }

      var duration = zoomSt.duration,
        getElToAnimate = function(image) {
          var newImg = image.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'),
            transition = 'all '+(zoomSt.duration/1000)+'s ' + zoomSt.easing,
            cssObj = {
              position: 'fixed',
              zIndex: 9999,
              left: 0,
              top: 0,
              '-webkit-backface-visibility': 'hidden'
            },
            t = 'transition';

          cssObj['-webkit-'+t] = cssObj['-moz-'+t] = cssObj['-o-'+t] = cssObj[t] = transition;

          newImg.css(cssObj);
          return newImg;
        },
        showMainContent = function() {
          mfp.content.css('visibility', 'visible');
        },
        openTimeout,
        animatedImg;

      _mfpOn('BuildControls'+ns, function() {
        if(mfp._allowZoom()) {

          clearTimeout(openTimeout);
          mfp.content.css('visibility', 'hidden');

          // Basically, all code below does is clones existing image, puts in on top of the current one and animated it
          
          image = mfp._getItemToZoom();

          if(!image) {
            showMainContent();
            return;
          }

          animatedImg = getElToAnimate(image); 
          
          animatedImg.css( mfp._getOffset() );

          mfp.wrap.append(animatedImg);

          openTimeout = setTimeout(function() {
            animatedImg.css( mfp._getOffset( true ) );
            openTimeout = setTimeout(function() {

              showMainContent();

              setTimeout(function() {
                animatedImg.remove();
                image = animatedImg = null;
                _mfpTrigger('ZoomAnimationEnded');
              }, 16); // avoid blink when switching images 

            }, duration); // this timeout equals animation duration

          }, 16); // by adding this timeout we avoid short glitch at the beginning of animation


          // Lots of timeouts...
        }
      });
      _mfpOn(BEFORE_CLOSE_EVENT+ns, function() {
        if(mfp._allowZoom()) {

          clearTimeout(openTimeout);

          mfp.st.removalDelay = duration;

          if(!image) {
            image = mfp._getItemToZoom();
            if(!image) {
              return;
            }
            animatedImg = getElToAnimate(image);
          }
          
          
          animatedImg.css( mfp._getOffset(true) );
          mfp.wrap.append(animatedImg);
          mfp.content.css('visibility', 'hidden');
          
          setTimeout(function() {
            animatedImg.css( mfp._getOffset() );
          }, 16);
        }

      });

      _mfpOn(CLOSE_EVENT+ns, function() {
        if(mfp._allowZoom()) {
          showMainContent();
          if(animatedImg) {
            animatedImg.remove();
          }
          image = null;
        } 
      });
    },

    _allowZoom: function() {
      return mfp.currItem.type === 'image';
    },

    _getItemToZoom: function() {
      if(mfp.currItem.hasSize) {
        return mfp.currItem.img;
      } else {
        return false;
      }
    },

    // Get element postion relative to viewport
    _getOffset: function(isLarge) {
      var el;
      if(isLarge) {
        el = mfp.currItem.img;
      } else {
        el = mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem);
      }

      var offset = el.offset();
      var paddingTop = parseInt(el.css('padding-top'),10);
      var paddingBottom = parseInt(el.css('padding-bottom'),10);
      offset.top -= ( $(window).scrollTop() - paddingTop );


      /*
      
      Animating left + top + width/height looks glitchy in Firefox, but perfect in Chrome. And vice-versa.

       */
      var obj = {
        width: el.width(),
        // fix Zepto height+padding issue
        height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop
      };

      // I hate to do this, but there is no another option
      if( getHasMozTransform() ) {
        obj['-moz-transform'] = obj['transform'] = 'translate(' + offset.left + 'px,' + offset.top + 'px)';
      } else {
        obj.left = offset.left;
        obj.top = offset.top;
      }
      return obj;
    }

  }
});



/*>>zoom*/

/*>>iframe*/

var IFRAME_NS = 'iframe',
  _emptyPage = '//about:blank',
  
  _fixIframeBugs = function(isShowing) {
    if(mfp.currTemplate[IFRAME_NS]) {
      var el = mfp.currTemplate[IFRAME_NS].find('iframe');
      if(el.length) { 
        // reset src after the popup is closed to avoid "video keeps playing after popup is closed" bug
        if(!isShowing) {
          el[0].src = _emptyPage;
        }

        // IE8 black screen bug fix
        if(mfp.isIE8) {
          el.css('display', isShowing ? 'block' : 'none');
        }
      }
    }
  };

$.magnificPopup.registerModule(IFRAME_NS, {

  options: {
    markup: '<div class="mfp-iframe-scaler">'+
          '<div class="mfp-close"></div>'+
          '<iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>'+
        '</div>',

    srcAction: 'iframe_src',

    // we don't care and support only one default type of URL by default
    patterns: {
      youtube: {
        index: 'youtube.com', 
        id: 'v=', 
        src: '//www.youtube.com/embed/%id%?autoplay=1'
      },
      vimeo: {
        index: 'vimeo.com/',
        id: '/',
        src: '//player.vimeo.com/video/%id%?autoplay=1'
      },
      gmaps: {
        index: '//maps.google.',
        src: '%id%&output=embed'
      }
    }
  },

  proto: {
    initIframe: function() {
      mfp.types.push(IFRAME_NS);

      _mfpOn('BeforeChange', function(e, prevType, newType) {
        if(prevType !== newType) {
          if(prevType === IFRAME_NS) {
            _fixIframeBugs(); // iframe if removed
          } else if(newType === IFRAME_NS) {
            _fixIframeBugs(true); // iframe is showing
          } 
        }// else {
          // iframe source is switched, don't do anything
        //}
      });

      _mfpOn(CLOSE_EVENT + '.' + IFRAME_NS, function() {
        _fixIframeBugs();
      });
    },

    getIframe: function(item, template) {
      var embedSrc = item.src;
      var iframeSt = mfp.st.iframe;
        
      $.each(iframeSt.patterns, function() {
        if(embedSrc.indexOf( this.index ) > -1) {
          if(this.id) {
            if(typeof this.id === 'string') {
              embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id)+this.id.length, embedSrc.length);
            } else {
              embedSrc = this.id.call( this, embedSrc );
            }
          }
          embedSrc = this.src.replace('%id%', embedSrc );
          return false; // break;
        }
      });
      
      var dataObj = {};
      if(iframeSt.srcAction) {
        dataObj[iframeSt.srcAction] = embedSrc;
      }
      mfp._parseMarkup(template, dataObj, item);

      mfp.updateStatus('ready');

      return template;
    }
  }
});



/*>>iframe*/

/*>>gallery*/
/**
 * Get looped index depending on number of slides
 */
var _getLoopedId = function(index) {
    var numSlides = mfp.items.length;
    if(index > numSlides - 1) {
      return index - numSlides;
    } else  if(index < 0) {
      return numSlides + index;
    }
    return index;
  },
  _replaceCurrTotal = function(text, curr, total) {
    return text.replace(/%curr%/gi, curr + 1).replace(/%total%/gi, total);
  };

$.magnificPopup.registerModule('gallery', {

  options: {
    enabled: false,
    arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
    preload: [0,2],
    navigateByImgClick: true,
    arrows: true,

    tPrev: 'Previous (Left arrow key)',
    tNext: 'Next (Right arrow key)',
    tCounter: '%curr% of %total%'
  },

  proto: {
    initGallery: function() {

      var gSt = mfp.st.gallery,
        ns = '.mfp-gallery',
        supportsFastClick = Boolean($.fn.mfpFastClick);

      mfp.direction = true; // true - next, false - prev
      
      if(!gSt || !gSt.enabled ) return false;

      _wrapClasses += ' mfp-gallery';

      _mfpOn(OPEN_EVENT+ns, function() {

        if(gSt.navigateByImgClick) {
          mfp.wrap.on('click'+ns, '.mfp-img', function() {
            if(mfp.items.length > 1) {
              mfp.next();
              return false;
            }
          });
        }

        _document.on('keydown'+ns, function(e) {
          if (e.keyCode === 37) {
            mfp.prev();
          } else if (e.keyCode === 39) {
            mfp.next();
          }
        });
      });

      _mfpOn('UpdateStatus'+ns, function(e, data) {
        if(data.text) {
          data.text = _replaceCurrTotal(data.text, mfp.currItem.index, mfp.items.length);
        }
      });

      _mfpOn(MARKUP_PARSE_EVENT+ns, function(e, element, values, item) {
        var l = mfp.items.length;
        values.counter = l > 1 ? _replaceCurrTotal(gSt.tCounter, item.index, l) : '';
      });

      _mfpOn('BuildControls' + ns, function() {
        if(mfp.items.length > 1 && gSt.arrows && !mfp.arrowLeft) {
          var markup = gSt.arrowMarkup,
            arrowLeft = mfp.arrowLeft = $( markup.replace(/%title%/gi, gSt.tPrev).replace(/%dir%/gi, 'left') ).addClass(PREVENT_CLOSE_CLASS),     
            arrowRight = mfp.arrowRight = $( markup.replace(/%title%/gi, gSt.tNext).replace(/%dir%/gi, 'right') ).addClass(PREVENT_CLOSE_CLASS);

          var eName = supportsFastClick ? 'mfpFastClick' : 'click';
          arrowLeft[eName](function() {
            mfp.prev();
          });     
          arrowRight[eName](function() {
            mfp.next();
          }); 

          // Polyfill for :before and :after (adds elements with classes mfp-a and mfp-b)
          if(mfp.isIE7) {
            _getEl('b', arrowLeft[0], false, true);
            _getEl('a', arrowLeft[0], false, true);
            _getEl('b', arrowRight[0], false, true);
            _getEl('a', arrowRight[0], false, true);
          }

          mfp.container.append(arrowLeft.add(arrowRight));
        }
      });

      _mfpOn(CHANGE_EVENT+ns, function() {
        if(mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout);

        mfp._preloadTimeout = setTimeout(function() {
          mfp.preloadNearbyImages();
          mfp._preloadTimeout = null;
        }, 16);   
      });


      _mfpOn(CLOSE_EVENT+ns, function() {
        _document.off(ns);
        mfp.wrap.off('click'+ns);
      
        if(mfp.arrowLeft && supportsFastClick) {
          mfp.arrowLeft.add(mfp.arrowRight).destroyMfpFastClick();
        }
        mfp.arrowRight = mfp.arrowLeft = null;
      });

    }, 
    next: function() {
      mfp.direction = true;
      mfp.index = _getLoopedId(mfp.index + 1);
      mfp.updateItemHTML();
    },
    prev: function() {
      mfp.direction = false;
      mfp.index = _getLoopedId(mfp.index - 1);
      mfp.updateItemHTML();
    },
    goTo: function(newIndex) {
      mfp.direction = (newIndex >= mfp.index);
      mfp.index = newIndex;
      mfp.updateItemHTML();
    },
    preloadNearbyImages: function() {
      var p = mfp.st.gallery.preload,
        preloadBefore = Math.min(p[0], mfp.items.length),
        preloadAfter = Math.min(p[1], mfp.items.length),
        i;

      for(i = 1; i <= (mfp.direction ? preloadAfter : preloadBefore); i++) {
        mfp._preloadItem(mfp.index+i);
      }
      for(i = 1; i <= (mfp.direction ? preloadBefore : preloadAfter); i++) {
        mfp._preloadItem(mfp.index-i);
      }
    },
    _preloadItem: function(index) {
      index = _getLoopedId(index);

      if(mfp.items[index].preloaded) {
        return;
      }

      var item = mfp.items[index];
      if(!item.parsed) {
        item = mfp.parseEl( index );
      }

      _mfpTrigger('LazyLoad', item);

      if(item.type === 'image') {
        item.img = $('<img class="mfp-img" />').on('load.mfploader', function() {
          item.hasSize = true;
        }).on('error.mfploader', function() {
          item.hasSize = true;
          item.loadError = true;
          _mfpTrigger('LazyLoadError', item);
        }).attr('src', item.src);
      }


      item.preloaded = true;
    }
  }
});

/*
Touch Support that might be implemented some day

addSwipeGesture: function() {
  var startX,
    moved,
    multipleTouches;

    return;

  var namespace = '.mfp',
    addEventNames = function(pref, down, move, up, cancel) {
      mfp._tStart = pref + down + namespace;
      mfp._tMove = pref + move + namespace;
      mfp._tEnd = pref + up + namespace;
      mfp._tCancel = pref + cancel + namespace;
    };

  if(window.navigator.msPointerEnabled) {
    addEventNames('MSPointer', 'Down', 'Move', 'Up', 'Cancel');
  } else if('ontouchstart' in window) {
    addEventNames('touch', 'start', 'move', 'end', 'cancel');
  } else {
    return;
  }
  _window.on(mfp._tStart, function(e) {
    var oE = e.originalEvent;
    multipleTouches = moved = false;
    startX = oE.pageX || oE.changedTouches[0].pageX;
  }).on(mfp._tMove, function(e) {
    if(e.originalEvent.touches.length > 1) {
      multipleTouches = e.originalEvent.touches.length;
    } else {
      //e.preventDefault();
      moved = true;
    }
  }).on(mfp._tEnd + ' ' + mfp._tCancel, function(e) {
    if(moved && !multipleTouches) {
      var oE = e.originalEvent,
        diff = startX - (oE.pageX || oE.changedTouches[0].pageX);

      if(diff > 20) {
        mfp.next();
      } else if(diff < -20) {
        mfp.prev();
      }
    }
  });
},
*/


/*>>gallery*/

/*>>retina*/

var RETINA_NS = 'retina';

$.magnificPopup.registerModule(RETINA_NS, {
  options: {
    replaceSrc: function(item) {
      return item.src.replace(/\.\w+$/, function(m) { return '@2x' + m; });
    },
    ratio: 1 // Function or number.  Set to 1 to disable.
  },
  proto: {
    initRetina: function() {
      if(window.devicePixelRatio > 1) {

        var st = mfp.st.retina,
          ratio = st.ratio;

        ratio = !isNaN(ratio) ? ratio : ratio();

        if(ratio > 1) {
          _mfpOn('ImageHasSize' + '.' + RETINA_NS, function(e, item) {
            item.img.css({
              'max-width': item.img[0].naturalWidth / ratio,
              'width': '100%'
            });
          });
          _mfpOn('ElementParse' + '.' + RETINA_NS, function(e, item) {
            item.src = st.replaceSrc(item, ratio);
          });
        }
      }

    }
  }
});

/*>>retina*/

/*>>fastclick*/
/**
 * FastClick event implementation. (removes 300ms delay on touch devices)
 * Based on https://developers.google.com/mobile/articles/fast_buttons
 *
 * You may use it outside the Magnific Popup by calling just:
 *
 * $('.your-el').mfpFastClick(function() {
 *     console.log('Clicked!');
 * });
 *
 * To unbind:
 * $('.your-el').destroyMfpFastClick();
 * 
 * 
 * Note that it's a very basic and simple implementation, it blocks ghost click on the same element where it was bound.
 * If you need something more advanced, use plugin by FT Labs https://github.com/ftlabs/fastclick
 * 
 */

(function() {
  var ghostClickDelay = 1000,
    supportsTouch = 'ontouchstart' in window,
    unbindTouchMove = function() {
      _window.off('touchmove'+ns+' touchend'+ns);
    },
    eName = 'mfpFastClick',
    ns = '.'+eName;


  // As Zepto.js doesn't have an easy way to add custom events (like jQuery), so we implement it in this way
  $.fn.mfpFastClick = function(callback) {

    return $(this).each(function() {

      var elem = $(this),
        lock;

      if( supportsTouch ) {

        var timeout,
          startX,
          startY,
          pointerMoved,
          point,
          numPointers;

        elem.on('touchstart' + ns, function(e) {
          pointerMoved = false;
          numPointers = 1;

          point = e.originalEvent ? e.originalEvent.touches[0] : e.touches[0];
          startX = point.clientX;
          startY = point.clientY;

          _window.on('touchmove'+ns, function(e) {
            point = e.originalEvent ? e.originalEvent.touches : e.touches;
            numPointers = point.length;
            point = point[0];
            if (Math.abs(point.clientX - startX) > 10 ||
              Math.abs(point.clientY - startY) > 10) {
              pointerMoved = true;
              unbindTouchMove();
            }
          }).on('touchend'+ns, function(e) {
            unbindTouchMove();
            if(pointerMoved || numPointers > 1) {
              return;
            }
            lock = true;
            e.preventDefault();
            clearTimeout(timeout);
            timeout = setTimeout(function() {
              lock = false;
            }, ghostClickDelay);
            callback();
          });
        });

      }

      elem.on('click' + ns, function() {
        if(!lock) {
          callback();
        }
      });
    });
  };

  $.fn.destroyMfpFastClick = function() {
    $(this).off('touchstart' + ns + ' click' + ns);
    if(supportsTouch) _window.off('touchmove'+ns+' touchend'+ns);
  };
})();

/*>>fastclick*/
 _checkInstance(); })(window.jQuery || window.Zepto);;
/*!
 * Masonry PACKAGED v3.1.5
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

/**
 * Bridget makes jQuery widgets
 * v1.0.1
 */

( function( window ) {



// -------------------------- utils -------------------------- //

var slice = Array.prototype.slice;

function noop() {}

// -------------------------- definition -------------------------- //

function defineBridget( $ ) {

// bail if no jQuery
if ( !$ ) {
  return;
}

// -------------------------- addOptionMethod -------------------------- //

/**
 * adds option method -> $().plugin('option', {...})
 * @param {Function} PluginClass - constructor class
 */
function addOptionMethod( PluginClass ) {
  // don't overwrite original option method
  if ( PluginClass.prototype.option ) {
    return;
  }

  // option setter
  PluginClass.prototype.option = function( opts ) {
    // bail out if not an object
    if ( !$.isPlainObject( opts ) ){
      return;
    }
    this.options = $.extend( true, this.options, opts );
  };
}


// -------------------------- plugin bridge -------------------------- //

// helper function for logging errors
// $.error breaks jQuery chaining
var logError = typeof console === 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

/**
 * jQuery plugin bridge, access methods like $elem.plugin('method')
 * @param {String} namespace - plugin name
 * @param {Function} PluginClass - constructor class
 */
function bridge( namespace, PluginClass ) {
  // add to jQuery fn namespace
  $.fn[ namespace ] = function( options ) {
    if ( typeof options === 'string' ) {
      // call plugin method when first argument is a string
      // get arguments for method
      var args = slice.call( arguments, 1 );

      for ( var i=0, len = this.length; i < len; i++ ) {
        var elem = this[i];
        var instance = $.data( elem, namespace );
        if ( !instance ) {
          logError( "cannot call methods on " + namespace + " prior to initialization; " +
            "attempted to call '" + options + "'" );
          continue;
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === '_' ) {
          logError( "no such method '" + options + "' for " + namespace + " instance" );
          continue;
        }

        // trigger method with arguments
        var returnValue = instance[ options ].apply( instance, args );

        // break look and return first value if provided
        if ( returnValue !== undefined ) {
          return returnValue;
        }
      }
      // return this if no return value
      return this;
    } else {
      return this.each( function() {
        var instance = $.data( this, namespace );
        if ( instance ) {
          // apply options & init
          instance.option( options );
          instance._init();
        } else {
          // initialize new instance
          instance = new PluginClass( this, options );
          $.data( this, namespace, instance );
        }
      });
    }
  };

}

// -------------------------- bridget -------------------------- //

/**
 * converts a Prototypical class into a proper jQuery plugin
 *   the class must have a ._init method
 * @param {String} namespace - plugin name, used in $().pluginName
 * @param {Function} PluginClass - constructor class
 */
$.bridget = function( namespace, PluginClass ) {
  addOptionMethod( PluginClass );
  bridge( namespace, PluginClass );
};

return $.bridget;

}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'jquery-bridget/jquery.bridget',[ 'jquery' ], defineBridget );
} else {
  // get jquery from browser global
  defineBridget( window.jQuery );
}

})( window );

/*!
 * eventie v1.0.5
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {



var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// ----- module definition ----- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'eventie/eventie',eventie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = eventie;
} else {
  // browser global
  window.eventie = eventie;
}

})( this );

/*!
 * docReady
 * Cross browser DOMContentLoaded event emitter
 */

/*jshint browser: true, strict: true, undef: true, unused: true*/
/*global define: false */

( function( window ) {



var document = window.document;
// collection of functions to be triggered on ready
var queue = [];

function docReady( fn ) {
  // throw out non-functions
  if ( typeof fn !== 'function' ) {
    return;
  }

  if ( docReady.isReady ) {
    // ready now, hit it
    fn();
  } else {
    // queue function when ready
    queue.push( fn );
  }
}

docReady.isReady = false;

// triggered on various doc ready events
function init( event ) {
  // bail if IE8 document is not ready just yet
  var isIE8NotReady = event.type === 'readystatechange' && document.readyState !== 'complete';
  if ( docReady.isReady || isIE8NotReady ) {
    return;
  }
  docReady.isReady = true;

  // process queue
  for ( var i=0, len = queue.length; i < len; i++ ) {
    var fn = queue[i];
    fn();
  }
}

function defineDocReady( eventie ) {
  eventie.bind( document, 'DOMContentLoaded', init );
  eventie.bind( document, 'readystatechange', init );
  eventie.bind( window, 'load', init );

  return docReady;
}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  // if RequireJS, then doc is already ready
  docReady.isReady = typeof requirejs === 'function';
  define( 'doc-ready/doc-ready',[ 'eventie/eventie' ], defineDocReady );
} else {
  // browser global
  window.docReady = defineDocReady( window.eventie );
}

})( this );

/*!
 * EventEmitter v4.2.7 - git.io/ee
 * Oliver Caldwell
 * MIT license
 * @preserve
 */

(function () {
	

	/**
	 * Class for managing events.
	 * Can be extended to provide event functionality in other classes.
	 *
	 * @class EventEmitter Manages event registering and emitting.
	 */
	function EventEmitter() {}

	// Shortcuts to improve speed and size
	var proto = EventEmitter.prototype;
	var exports = this;
	var originalGlobalValue = exports.EventEmitter;

	/**
	 * Finds the index of the listener for the event in it's storage array.
	 *
	 * @param {Function[]} listeners Array of listeners to search through.
	 * @param {Function} listener Method to look for.
	 * @return {Number} Index of the specified listener, -1 if not found
	 * @api private
	 */
	function indexOfListener(listeners, listener) {
		var i = listeners.length;
		while (i--) {
			if (listeners[i].listener === listener) {
				return i;
			}
		}

		return -1;
	}

	/**
	 * Alias a method while keeping the context correct, to allow for overwriting of target method.
	 *
	 * @param {String} name The name of the target method.
	 * @return {Function} The aliased method
	 * @api private
	 */
	function alias(name) {
		return function aliasClosure() {
			return this[name].apply(this, arguments);
		};
	}

	/**
	 * Returns the listener array for the specified event.
	 * Will initialise the event object and listener arrays if required.
	 * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
	 * Each property in the object response is an array of listener functions.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Function[]|Object} All listener functions for the event.
	 */
	proto.getListeners = function getListeners(evt) {
		var events = this._getEvents();
		var response;
		var key;

		// Return a concatenated array of all matching events if
		// the selector is a regular expression.
		if (evt instanceof RegExp) {
			response = {};
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					response[key] = events[key];
				}
			}
		}
		else {
			response = events[evt] || (events[evt] = []);
		}

		return response;
	};

	/**
	 * Takes a list of listener objects and flattens it into a list of listener functions.
	 *
	 * @param {Object[]} listeners Raw listener objects.
	 * @return {Function[]} Just the listener functions.
	 */
	proto.flattenListeners = function flattenListeners(listeners) {
		var flatListeners = [];
		var i;

		for (i = 0; i < listeners.length; i += 1) {
			flatListeners.push(listeners[i].listener);
		}

		return flatListeners;
	};

	/**
	 * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Object} All listener functions for an event in an object.
	 */
	proto.getListenersAsObject = function getListenersAsObject(evt) {
		var listeners = this.getListeners(evt);
		var response;

		if (listeners instanceof Array) {
			response = {};
			response[evt] = listeners;
		}

		return response || listeners;
	};

	/**
	 * Adds a listener function to the specified event.
	 * The listener will not be added if it is a duplicate.
	 * If the listener returns true then it will be removed after it is called.
	 * If you pass a regular expression as the event name then the listener will be added to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListener = function addListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var listenerIsWrapped = typeof listener === 'object';
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
				listeners[key].push(listenerIsWrapped ? listener : {
					listener: listener,
					once: false
				});
			}
		}

		return this;
	};

	/**
	 * Alias of addListener
	 */
	proto.on = alias('addListener');

	/**
	 * Semi-alias of addListener. It will add a listener that will be
	 * automatically removed after it's first execution.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addOnceListener = function addOnceListener(evt, listener) {
		return this.addListener(evt, {
			listener: listener,
			once: true
		});
	};

	/**
	 * Alias of addOnceListener.
	 */
	proto.once = alias('addOnceListener');

	/**
	 * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
	 * You need to tell it what event names should be matched by a regex.
	 *
	 * @param {String} evt Name of the event to create.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvent = function defineEvent(evt) {
		this.getListeners(evt);
		return this;
	};

	/**
	 * Uses defineEvent to define multiple events.
	 *
	 * @param {String[]} evts An array of event names to define.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvents = function defineEvents(evts) {
		for (var i = 0; i < evts.length; i += 1) {
			this.defineEvent(evts[i]);
		}
		return this;
	};

	/**
	 * Removes a listener function from the specified event.
	 * When passed a regular expression as the event name, it will remove the listener from all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to remove the listener from.
	 * @param {Function} listener Method to remove from the event.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListener = function removeListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var index;
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				index = indexOfListener(listeners[key], listener);

				if (index !== -1) {
					listeners[key].splice(index, 1);
				}
			}
		}

		return this;
	};

	/**
	 * Alias of removeListener
	 */
	proto.off = alias('removeListener');

	/**
	 * Adds listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
	 * You can also pass it a regular expression to add the array of listeners to all events that match it.
	 * Yeah, this function does quite a bit. That's probably a bad thing.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListeners = function addListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(false, evt, listeners);
	};

	/**
	 * Removes listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be removed.
	 * You can also pass it a regular expression to remove the listeners from all events that match it.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListeners = function removeListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(true, evt, listeners);
	};

	/**
	 * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
	 * The first argument will determine if the listeners are removed (true) or added (false).
	 * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be added/removed.
	 * You can also pass it a regular expression to manipulate the listeners of all events that match it.
	 *
	 * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
		var i;
		var value;
		var single = remove ? this.removeListener : this.addListener;
		var multiple = remove ? this.removeListeners : this.addListeners;

		// If evt is an object then pass each of it's properties to this method
		if (typeof evt === 'object' && !(evt instanceof RegExp)) {
			for (i in evt) {
				if (evt.hasOwnProperty(i) && (value = evt[i])) {
					// Pass the single listener straight through to the singular method
					if (typeof value === 'function') {
						single.call(this, i, value);
					}
					else {
						// Otherwise pass back to the multiple function
						multiple.call(this, i, value);
					}
				}
			}
		}
		else {
			// So evt must be a string
			// And listeners must be an array of listeners
			// Loop over it and pass each one to the multiple method
			i = listeners.length;
			while (i--) {
				single.call(this, evt, listeners[i]);
			}
		}

		return this;
	};

	/**
	 * Removes all listeners from a specified event.
	 * If you do not specify an event then all listeners will be removed.
	 * That means every event will be emptied.
	 * You can also pass a regex to remove all events that match it.
	 *
	 * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeEvent = function removeEvent(evt) {
		var type = typeof evt;
		var events = this._getEvents();
		var key;

		// Remove different things depending on the state of evt
		if (type === 'string') {
			// Remove all listeners for the specified event
			delete events[evt];
		}
		else if (evt instanceof RegExp) {
			// Remove all events matching the regex.
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					delete events[key];
				}
			}
		}
		else {
			// Remove all listeners in all events
			delete this._events;
		}

		return this;
	};

	/**
	 * Alias of removeEvent.
	 *
	 * Added to mirror the node API.
	 */
	proto.removeAllListeners = alias('removeEvent');

	/**
	 * Emits an event of your choice.
	 * When emitted, every listener attached to that event will be executed.
	 * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
	 * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
	 * So they will not arrive within the array on the other side, they will be separate.
	 * You can also pass a regular expression to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {Array} [args] Optional array of arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emitEvent = function emitEvent(evt, args) {
		var listeners = this.getListenersAsObject(evt);
		var listener;
		var i;
		var key;
		var response;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				i = listeners[key].length;

				while (i--) {
					// If the listener returns true then it shall be removed from the event
					// The function is executed either with a basic call or an apply if there is an args array
					listener = listeners[key][i];

					if (listener.once === true) {
						this.removeListener(evt, listener.listener);
					}

					response = listener.listener.apply(this, args || []);

					if (response === this._getOnceReturnValue()) {
						this.removeListener(evt, listener.listener);
					}
				}
			}
		}

		return this;
	};

	/**
	 * Alias of emitEvent
	 */
	proto.trigger = alias('emitEvent');

	/**
	 * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
	 * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {...*} Optional additional arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emit = function emit(evt) {
		var args = Array.prototype.slice.call(arguments, 1);
		return this.emitEvent(evt, args);
	};

	/**
	 * Sets the current value to check against when executing listeners. If a
	 * listeners return value matches the one set here then it will be removed
	 * after execution. This value defaults to true.
	 *
	 * @param {*} value The new value to check for when executing listeners.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.setOnceReturnValue = function setOnceReturnValue(value) {
		this._onceReturnValue = value;
		return this;
	};

	/**
	 * Fetches the current value to check against when executing listeners. If
	 * the listeners return value matches this one then it should be removed
	 * automatically. It will return true by default.
	 *
	 * @return {*|Boolean} The current value to check for or the default, true.
	 * @api private
	 */
	proto._getOnceReturnValue = function _getOnceReturnValue() {
		if (this.hasOwnProperty('_onceReturnValue')) {
			return this._onceReturnValue;
		}
		else {
			return true;
		}
	};

	/**
	 * Fetches the events object and creates one if required.
	 *
	 * @return {Object} The events storage object.
	 * @api private
	 */
	proto._getEvents = function _getEvents() {
		return this._events || (this._events = {});
	};

	/**
	 * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
	 *
	 * @return {Function} Non conflicting EventEmitter class.
	 */
	EventEmitter.noConflict = function noConflict() {
		exports.EventEmitter = originalGlobalValue;
		return EventEmitter;
	};

	// Expose the class either via AMD, CommonJS or the global object
	if (typeof define === 'function' && define.amd) {
		define('eventEmitter/EventEmitter',[],function () {
			return EventEmitter;
		});
	}
	else if (typeof module === 'object' && module.exports){
		module.exports = EventEmitter;
	}
	else {
		this.EventEmitter = EventEmitter;
	}
}.call(this));

/*!
 * getStyleProperty v1.0.3
 * original by kangax
 * http://perfectionkills.com/feature-testing-css-properties/
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false, exports: false, module: false */

( function( window ) {



var prefixes = 'Webkit Moz ms Ms O'.split(' ');
var docElemStyle = document.documentElement.style;

function getStyleProperty( propName ) {
  if ( !propName ) {
    return;
  }

  // test standard property first
  if ( typeof docElemStyle[ propName ] === 'string' ) {
    return propName;
  }

  // capitalize
  propName = propName.charAt(0).toUpperCase() + propName.slice(1);

  // test vendor specific properties
  var prefixed;
  for ( var i=0, len = prefixes.length; i < len; i++ ) {
    prefixed = prefixes[i] + propName;
    if ( typeof docElemStyle[ prefixed ] === 'string' ) {
      return prefixed;
    }
  }
}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'get-style-property/get-style-property',[],function() {
    return getStyleProperty;
  });
} else if ( typeof exports === 'object' ) {
  // CommonJS for Component
  module.exports = getStyleProperty;
} else {
  // browser global
  window.getStyleProperty = getStyleProperty;
}

})( window );

/**
 * getSize v1.1.7
 * measure size of elements
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, exports: false, require: false, module: false */

( function( window, undefined ) {



// -------------------------- helpers -------------------------- //

var getComputedStyle = window.getComputedStyle;
var getStyle = getComputedStyle ?
  function( elem ) {
    return getComputedStyle( elem, null );
  } :
  function( elem ) {
    return elem.currentStyle;
  };

// get a number from a string, not a percentage
function getStyleSize( value ) {
  var num = parseFloat( value );
  // not a percent like '100%', and a number
  var isValid = value.indexOf('%') === -1 && !isNaN( num );
  return isValid && num;
}

// -------------------------- measurements -------------------------- //

var measurements = [
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth'
];

function getZeroSize() {
  var size = {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    outerWidth: 0,
    outerHeight: 0
  };
  for ( var i=0, len = measurements.length; i < len; i++ ) {
    var measurement = measurements[i];
    size[ measurement ] = 0;
  }
  return size;
}



function defineGetSize( getStyleProperty ) {

// -------------------------- box sizing -------------------------- //

var boxSizingProp = getStyleProperty('boxSizing');
var isBoxSizeOuter;

/**
 * WebKit measures the outer-width on style.width on border-box elems
 * IE & Firefox measures the inner-width
 */
( function() {
  if ( !boxSizingProp ) {
    return;
  }

  var div = document.createElement('div');
  div.style.width = '200px';
  div.style.padding = '1px 2px 3px 4px';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px 2px 3px 4px';
  div.style[ boxSizingProp ] = 'border-box';

  var body = document.body || document.documentElement;
  body.appendChild( div );
  var style = getStyle( div );

  isBoxSizeOuter = getStyleSize( style.width ) === 200;
  body.removeChild( div );
})();


// -------------------------- getSize -------------------------- //

function getSize( elem ) {
  // use querySeletor if elem is string
  if ( typeof elem === 'string' ) {
    elem = document.querySelector( elem );
  }

  // do not proceed on non-objects
  if ( !elem || typeof elem !== 'object' || !elem.nodeType ) {
    return;
  }

  var style = getStyle( elem );

  // if hidden, everything is 0
  if ( style.display === 'none' ) {
    return getZeroSize();
  }

  var size = {};
  size.width = elem.offsetWidth;
  size.height = elem.offsetHeight;

  var isBorderBox = size.isBorderBox = !!( boxSizingProp &&
    style[ boxSizingProp ] && style[ boxSizingProp ] === 'border-box' );

  // get all measurements
  for ( var i=0, len = measurements.length; i < len; i++ ) {
    var measurement = measurements[i];
    var value = style[ measurement ];
    value = mungeNonPixel( elem, value );
    var num = parseFloat( value );
    // any 'auto', 'medium' value will be 0
    size[ measurement ] = !isNaN( num ) ? num : 0;
  }

  var paddingWidth = size.paddingLeft + size.paddingRight;
  var paddingHeight = size.paddingTop + size.paddingBottom;
  var marginWidth = size.marginLeft + size.marginRight;
  var marginHeight = size.marginTop + size.marginBottom;
  var borderWidth = size.borderLeftWidth + size.borderRightWidth;
  var borderHeight = size.borderTopWidth + size.borderBottomWidth;

  var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

  // overwrite width and height if we can get it from style
  var styleWidth = getStyleSize( style.width );
  if ( styleWidth !== false ) {
    size.width = styleWidth +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
  }

  var styleHeight = getStyleSize( style.height );
  if ( styleHeight !== false ) {
    size.height = styleHeight +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
  }

  size.innerWidth = size.width - ( paddingWidth + borderWidth );
  size.innerHeight = size.height - ( paddingHeight + borderHeight );

  size.outerWidth = size.width + marginWidth;
  size.outerHeight = size.height + marginHeight;

  return size;
}

// IE8 returns percent values, not pixels
// taken from jQuery's curCSS
function mungeNonPixel( elem, value ) {
  // IE8 and has percent value
  if ( getComputedStyle || value.indexOf('%') === -1 ) {
    return value;
  }
  var style = elem.style;
  // Remember the original values
  var left = style.left;
  var rs = elem.runtimeStyle;
  var rsLeft = rs && rs.left;

  // Put in the new values to get a computed value out
  if ( rsLeft ) {
    rs.left = elem.currentStyle.left;
  }
  style.left = value;
  value = style.pixelLeft;

  // Revert the changed values
  style.left = left;
  if ( rsLeft ) {
    rs.left = rsLeft;
  }

  return value;
}

return getSize;

}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD for RequireJS
  define( 'get-size/get-size',[ 'get-style-property/get-style-property' ], defineGetSize );
} else if ( typeof exports === 'object' ) {
  // CommonJS for Component
  module.exports = defineGetSize( require('get-style-property') );
} else {
  // browser global
  window.getSize = defineGetSize( window.getStyleProperty );
}

})( window );

/**
 * matchesSelector helper v1.0.1
 *
 * @name matchesSelector
 *   @param {Element} elem
 *   @param {String} selector
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false */

( function( global, ElemProto ) {

  

  var matchesMethod = ( function() {
    // check un-prefixed
    if ( ElemProto.matchesSelector ) {
      return 'matchesSelector';
    }
    // check vendor prefixes
    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

    for ( var i=0, len = prefixes.length; i < len; i++ ) {
      var prefix = prefixes[i];
      var method = prefix + 'MatchesSelector';
      if ( ElemProto[ method ] ) {
        return method;
      }
    }
  })();

  // ----- match ----- //

  function match( elem, selector ) {
    return elem[ matchesMethod ]( selector );
  }

  // ----- appendToFragment ----- //

  function checkParent( elem ) {
    // not needed if already has parent
    if ( elem.parentNode ) {
      return;
    }
    var fragment = document.createDocumentFragment();
    fragment.appendChild( elem );
  }

  // ----- query ----- //

  // fall back to using QSA
  // thx @jonathantneal https://gist.github.com/3062955
  function query( elem, selector ) {
    // append to fragment if no parent
    checkParent( elem );

    // match elem with all selected elems of parent
    var elems = elem.parentNode.querySelectorAll( selector );
    for ( var i=0, len = elems.length; i < len; i++ ) {
      // return true if match
      if ( elems[i] === elem ) {
        return true;
      }
    }
    // otherwise return false
    return false;
  }

  // ----- matchChild ----- //

  function matchChild( elem, selector ) {
    checkParent( elem );
    return match( elem, selector );
  }

  // ----- matchesSelector ----- //

  var matchesSelector;

  if ( matchesMethod ) {
    // IE9 supports matchesSelector, but doesn't work on orphaned elems
    // check for that
    var div = document.createElement('div');
    var supportsOrphans = match( div, 'div' );
    matchesSelector = supportsOrphans ? match : matchChild;
  } else {
    matchesSelector = query;
  }

  // transport
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( 'matches-selector/matches-selector',[],function() {
      return matchesSelector;
    });
  } else {
    // browser global
    window.matchesSelector = matchesSelector;
  }

})( this, Element.prototype );

/**
 * Outlayer Item
 */

( function( window ) {



// ----- get style ----- //

var getComputedStyle = window.getComputedStyle;
var getStyle = getComputedStyle ?
  function( elem ) {
    return getComputedStyle( elem, null );
  } :
  function( elem ) {
    return elem.currentStyle;
  };


// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

function isEmptyObj( obj ) {
  for ( var prop in obj ) {
    return false;
  }
  prop = null;
  return true;
}

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
function toDash( str ) {
  return str.replace( /([A-Z])/g, function( $1 ){
    return '-' + $1.toLowerCase();
  });
}

// -------------------------- Outlayer definition -------------------------- //

function outlayerItemDefinition( EventEmitter, getSize, getStyleProperty ) {

// -------------------------- CSS3 support -------------------------- //

var transitionProperty = getStyleProperty('transition');
var transformProperty = getStyleProperty('transform');
var supportsCSS3 = transitionProperty && transformProperty;
var is3d = !!getStyleProperty('perspective');

var transitionEndEvent = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'otransitionend',
  transition: 'transitionend'
}[ transitionProperty ];

// properties that could have vendor prefix
var prefixableProperties = [
  'transform',
  'transition',
  'transitionDuration',
  'transitionProperty'
];

// cache all vendor properties
var vendorProperties = ( function() {
  var cache = {};
  for ( var i=0, len = prefixableProperties.length; i < len; i++ ) {
    var prop = prefixableProperties[i];
    var supportedProp = getStyleProperty( prop );
    if ( supportedProp && supportedProp !== prop ) {
      cache[ prop ] = supportedProp;
    }
  }
  return cache;
})();

// -------------------------- Item -------------------------- //

function Item( element, layout ) {
  if ( !element ) {
    return;
  }

  this.element = element;
  // parent layout class, i.e. Masonry, Isotope, or Packery
  this.layout = layout;
  this.position = {
    x: 0,
    y: 0
  };

  this._create();
}

// inherit EventEmitter
extend( Item.prototype, EventEmitter.prototype );

Item.prototype._create = function() {
  // transition objects
  this._transn = {
    ingProperties: {},
    clean: {},
    onEnd: {}
  };

  this.css({
    position: 'absolute'
  });
};

// trigger specified handler for event type
Item.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

Item.prototype.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * apply CSS styles to element
 * @param {Object} style
 */
Item.prototype.css = function( style ) {
  var elemStyle = this.element.style;

  for ( var prop in style ) {
    // use vendor property if available
    var supportedProp = vendorProperties[ prop ] || prop;
    elemStyle[ supportedProp ] = style[ prop ];
  }
};

 // measure position, and sets it
Item.prototype.getPosition = function() {
  var style = getStyle( this.element );
  var layoutOptions = this.layout.options;
  var isOriginLeft = layoutOptions.isOriginLeft;
  var isOriginTop = layoutOptions.isOriginTop;
  var x = parseInt( style[ isOriginLeft ? 'left' : 'right' ], 10 );
  var y = parseInt( style[ isOriginTop ? 'top' : 'bottom' ], 10 );

  // clean up 'auto' or other non-integer values
  x = isNaN( x ) ? 0 : x;
  y = isNaN( y ) ? 0 : y;
  // remove padding from measurement
  var layoutSize = this.layout.size;
  x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
  y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;

  this.position.x = x;
  this.position.y = y;
};

// set settled position, apply padding
Item.prototype.layoutPosition = function() {
  var layoutSize = this.layout.size;
  var layoutOptions = this.layout.options;
  var style = {};

  if ( layoutOptions.isOriginLeft ) {
    style.left = ( this.position.x + layoutSize.paddingLeft ) + 'px';
    // reset other property
    style.right = '';
  } else {
    style.right = ( this.position.x + layoutSize.paddingRight ) + 'px';
    style.left = '';
  }

  if ( layoutOptions.isOriginTop ) {
    style.top = ( this.position.y + layoutSize.paddingTop ) + 'px';
    style.bottom = '';
  } else {
    style.bottom = ( this.position.y + layoutSize.paddingBottom ) + 'px';
    style.top = '';
  }

  this.css( style );
  this.emitEvent( 'layout', [ this ] );
};


// transform translate function
var translate = is3d ?
  function( x, y ) {
    return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
  } :
  function( x, y ) {
    return 'translate(' + x + 'px, ' + y + 'px)';
  };


Item.prototype._transitionTo = function( x, y ) {
  this.getPosition();
  // get current x & y from top/left
  var curX = this.position.x;
  var curY = this.position.y;

  var compareX = parseInt( x, 10 );
  var compareY = parseInt( y, 10 );
  var didNotMove = compareX === this.position.x && compareY === this.position.y;

  // save end position
  this.setPosition( x, y );

  // if did not move and not transitioning, just go to layout
  if ( didNotMove && !this.isTransitioning ) {
    this.layoutPosition();
    return;
  }

  var transX = x - curX;
  var transY = y - curY;
  var transitionStyle = {};
  // flip cooridinates if origin on right or bottom
  var layoutOptions = this.layout.options;
  transX = layoutOptions.isOriginLeft ? transX : -transX;
  transY = layoutOptions.isOriginTop ? transY : -transY;
  transitionStyle.transform = translate( transX, transY );

  this.transition({
    to: transitionStyle,
    onTransitionEnd: {
      transform: this.layoutPosition
    },
    isCleaning: true
  });
};

// non transition + transform support
Item.prototype.goTo = function( x, y ) {
  this.setPosition( x, y );
  this.layoutPosition();
};

// use transition and transforms if supported
Item.prototype.moveTo = supportsCSS3 ?
  Item.prototype._transitionTo : Item.prototype.goTo;

Item.prototype.setPosition = function( x, y ) {
  this.position.x = parseInt( x, 10 );
  this.position.y = parseInt( y, 10 );
};

// ----- transition ----- //

/**
 * @param {Object} style - CSS
 * @param {Function} onTransitionEnd
 */

// non transition, just trigger callback
Item.prototype._nonTransition = function( args ) {
  this.css( args.to );
  if ( args.isCleaning ) {
    this._removeStyles( args.to );
  }
  for ( var prop in args.onTransitionEnd ) {
    args.onTransitionEnd[ prop ].call( this );
  }
};

/**
 * proper transition
 * @param {Object} args - arguments
 *   @param {Object} to - style to transition to
 *   @param {Object} from - style to start transition from
 *   @param {Boolean} isCleaning - removes transition styles after transition
 *   @param {Function} onTransitionEnd - callback
 */
Item.prototype._transition = function( args ) {
  // redirect to nonTransition if no transition duration
  if ( !parseFloat( this.layout.options.transitionDuration ) ) {
    this._nonTransition( args );
    return;
  }

  var _transition = this._transn;
  // keep track of onTransitionEnd callback by css property
  for ( var prop in args.onTransitionEnd ) {
    _transition.onEnd[ prop ] = args.onTransitionEnd[ prop ];
  }
  // keep track of properties that are transitioning
  for ( prop in args.to ) {
    _transition.ingProperties[ prop ] = true;
    // keep track of properties to clean up when transition is done
    if ( args.isCleaning ) {
      _transition.clean[ prop ] = true;
    }
  }

  // set from styles
  if ( args.from ) {
    this.css( args.from );
    // force redraw. http://blog.alexmaccaw.com/css-transitions
    var h = this.element.offsetHeight;
    // hack for JSHint to hush about unused var
    h = null;
  }
  // enable transition
  this.enableTransition( args.to );
  // set styles that are transitioning
  this.css( args.to );

  this.isTransitioning = true;

};

var itemTransitionProperties = transformProperty && ( toDash( transformProperty ) +
  ',opacity' );

Item.prototype.enableTransition = function(/* style */) {
  // only enable if not already transitioning
  // bug in IE10 were re-setting transition style will prevent
  // transitionend event from triggering
  if ( this.isTransitioning ) {
    return;
  }

  // make transition: foo, bar, baz from style object
  // TODO uncomment this bit when IE10 bug is resolved
  // var transitionValue = [];
  // for ( var prop in style ) {
  //   // dash-ify camelCased properties like WebkitTransition
  //   transitionValue.push( toDash( prop ) );
  // }
  // enable transition styles
  // HACK always enable transform,opacity for IE10
  this.css({
    transitionProperty: itemTransitionProperties,
    transitionDuration: this.layout.options.transitionDuration
  });
  // listen for transition end event
  this.element.addEventListener( transitionEndEvent, this, false );
};

Item.prototype.transition = Item.prototype[ transitionProperty ? '_transition' : '_nonTransition' ];

// ----- events ----- //

Item.prototype.onwebkitTransitionEnd = function( event ) {
  this.ontransitionend( event );
};

Item.prototype.onotransitionend = function( event ) {
  this.ontransitionend( event );
};

// properties that I munge to make my life easier
var dashedVendorProperties = {
  '-webkit-transform': 'transform',
  '-moz-transform': 'transform',
  '-o-transform': 'transform'
};

Item.prototype.ontransitionend = function( event ) {
  // disregard bubbled events from children
  if ( event.target !== this.element ) {
    return;
  }
  var _transition = this._transn;
  // get property name of transitioned property, convert to prefix-free
  var propertyName = dashedVendorProperties[ event.propertyName ] || event.propertyName;

  // remove property that has completed transitioning
  delete _transition.ingProperties[ propertyName ];
  // check if any properties are still transitioning
  if ( isEmptyObj( _transition.ingProperties ) ) {
    // all properties have completed transitioning
    this.disableTransition();
  }
  // clean style
  if ( propertyName in _transition.clean ) {
    // clean up style
    this.element.style[ event.propertyName ] = '';
    delete _transition.clean[ propertyName ];
  }
  // trigger onTransitionEnd callback
  if ( propertyName in _transition.onEnd ) {
    var onTransitionEnd = _transition.onEnd[ propertyName ];
    onTransitionEnd.call( this );
    delete _transition.onEnd[ propertyName ];
  }

  this.emitEvent( 'transitionEnd', [ this ] );
};

Item.prototype.disableTransition = function() {
  this.removeTransitionStyles();
  this.element.removeEventListener( transitionEndEvent, this, false );
  this.isTransitioning = false;
};

/**
 * removes style property from element
 * @param {Object} style
**/
Item.prototype._removeStyles = function( style ) {
  // clean up transition styles
  var cleanStyle = {};
  for ( var prop in style ) {
    cleanStyle[ prop ] = '';
  }
  this.css( cleanStyle );
};

var cleanTransitionStyle = {
  transitionProperty: '',
  transitionDuration: ''
};

Item.prototype.removeTransitionStyles = function() {
  // remove transition
  this.css( cleanTransitionStyle );
};

// ----- show/hide/remove ----- //

// remove element from DOM
Item.prototype.removeElem = function() {
  this.element.parentNode.removeChild( this.element );
  this.emitEvent( 'remove', [ this ] );
};

Item.prototype.remove = function() {
  // just remove element if no transition support or no transition
  if ( !transitionProperty || !parseFloat( this.layout.options.transitionDuration ) ) {
    this.removeElem();
    return;
  }

  // start transition
  var _this = this;
  this.on( 'transitionEnd', function() {
    _this.removeElem();
    return true; // bind once
  });
  this.hide();
};

Item.prototype.reveal = function() {
  delete this.isHidden;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;
  this.transition({
    from: options.hiddenStyle,
    to: options.visibleStyle,
    isCleaning: true
  });
};

Item.prototype.hide = function() {
  // set flag
  this.isHidden = true;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;
  this.transition({
    from: options.visibleStyle,
    to: options.hiddenStyle,
    // keep hidden stuff hidden
    isCleaning: true,
    onTransitionEnd: {
      opacity: function() {
        // check if still hidden
        // during transition, item may have been un-hidden
        if ( this.isHidden ) {
          this.css({ display: 'none' });
        }
      }
    }
  });
};

Item.prototype.destroy = function() {
  this.css({
    position: '',
    left: '',
    right: '',
    top: '',
    bottom: '',
    transition: '',
    transform: ''
  });
};

return Item;

}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'outlayer/item',[
      'eventEmitter/EventEmitter',
      'get-size/get-size',
      'get-style-property/get-style-property'
    ],
    outlayerItemDefinition );
} else {
  // browser global
  window.Outlayer = {};
  window.Outlayer.Item = outlayerItemDefinition(
    window.EventEmitter,
    window.getSize,
    window.getStyleProperty
  );
}

})( window );

/*!
 * Outlayer v1.2.0
 * the brains and guts of a layout library
 * MIT license
 */

( function( window ) {



// ----- vars ----- //

var document = window.document;
var console = window.console;
var jQuery = window.jQuery;

var noop = function() {};

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}


var objToString = Object.prototype.toString;
function isArray( obj ) {
  return objToString.call( obj ) === '[object Array]';
}

// turn element or nodeList into an array
function makeArray( obj ) {
  var ary = [];
  if ( isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( obj && typeof obj.length === 'number' ) {
    // convert nodeList to array
    for ( var i=0, len = obj.length; i < len; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
}

// http://stackoverflow.com/a/384380/182183
var isElement = ( typeof HTMLElement === 'object' ) ?
  function isElementDOM2( obj ) {
    return obj instanceof HTMLElement;
  } :
  function isElementQuirky( obj ) {
    return obj && typeof obj === 'object' &&
      obj.nodeType === 1 && typeof obj.nodeName === 'string';
  };

// index of helper cause IE8
var indexOf = Array.prototype.indexOf ? function( ary, obj ) {
    return ary.indexOf( obj );
  } : function( ary, obj ) {
    for ( var i=0, len = ary.length; i < len; i++ ) {
      if ( ary[i] === obj ) {
        return i;
      }
    }
    return -1;
  };

function removeFrom( obj, ary ) {
  var index = indexOf( ary, obj );
  if ( index !== -1 ) {
    ary.splice( index, 1 );
  }
}

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
function toDashed( str ) {
  return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
    return $1 + '-' + $2;
  }).toLowerCase();
}


function outlayerDefinition( eventie, docReady, EventEmitter, getSize, matchesSelector, Item ) {

// -------------------------- Outlayer -------------------------- //

// globally unique identifiers
var GUID = 0;
// internal store of all Outlayer intances
var instances = {};


/**
 * @param {Element, String} element
 * @param {Object} options
 * @constructor
 */
function Outlayer( element, options ) {
  // use element as selector string
  if ( typeof element === 'string' ) {
    element = document.querySelector( element );
  }

  // bail out if not proper element
  if ( !element || !isElement( element ) ) {
    if ( console ) {
      console.error( 'Bad ' + this.constructor.namespace + ' element: ' + element );
    }
    return;
  }

  this.element = element;

  // options
  this.options = extend( {}, this.constructor.defaults );
  this.option( options );

  // add id for Outlayer.getFromElement
  var id = ++GUID;
  this.element.outlayerGUID = id; // expando
  instances[ id ] = this; // associate via id

  // kick it off
  this._create();

  if ( this.options.isInitLayout ) {
    this.layout();
  }
}

// settings are for internal use only
Outlayer.namespace = 'outlayer';
Outlayer.Item = Item;

// default options
Outlayer.defaults = {
  containerStyle: {
    position: 'relative'
  },
  isInitLayout: true,
  isOriginLeft: true,
  isOriginTop: true,
  isResizeBound: true,
  isResizingContainer: true,
  // item options
  transitionDuration: '0.4s',
  hiddenStyle: {
    opacity: 0,
    transform: 'scale(0.001)'
  },
  visibleStyle: {
    opacity: 1,
    transform: 'scale(1)'
  }
};

// inherit EventEmitter
extend( Outlayer.prototype, EventEmitter.prototype );

/**
 * set options
 * @param {Object} opts
 */
Outlayer.prototype.option = function( opts ) {
  extend( this.options, opts );
};

Outlayer.prototype._create = function() {
  // get items from children
  this.reloadItems();
  // elements that affect layout, but are not laid out
  this.stamps = [];
  this.stamp( this.options.stamp );
  // set container style
  extend( this.element.style, this.options.containerStyle );

  // bind resize method
  if ( this.options.isResizeBound ) {
    this.bindResize();
  }
};

// goes through all children again and gets bricks in proper order
Outlayer.prototype.reloadItems = function() {
  // collection of item elements
  this.items = this._itemize( this.element.children );
};


/**
 * turn elements into Outlayer.Items to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - collection of new Outlayer Items
 */
Outlayer.prototype._itemize = function( elems ) {

  var itemElems = this._filterFindItemElements( elems );
  var Item = this.constructor.Item;

  // create new Outlayer Items for collection
  var items = [];
  for ( var i=0, len = itemElems.length; i < len; i++ ) {
    var elem = itemElems[i];
    var item = new Item( elem, this );
    items.push( item );
  }

  return items;
};

/**
 * get item elements to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - item elements
 */
Outlayer.prototype._filterFindItemElements = function( elems ) {
  // make array of elems
  elems = makeArray( elems );
  var itemSelector = this.options.itemSelector;
  var itemElems = [];

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    // check that elem is an actual element
    if ( !isElement( elem ) ) {
      continue;
    }
    // filter & find items if we have an item selector
    if ( itemSelector ) {
      // filter siblings
      if ( matchesSelector( elem, itemSelector ) ) {
        itemElems.push( elem );
      }
      // find children
      var childElems = elem.querySelectorAll( itemSelector );
      // concat childElems to filterFound array
      for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
        itemElems.push( childElems[j] );
      }
    } else {
      itemElems.push( elem );
    }
  }

  return itemElems;
};

/**
 * getter method for getting item elements
 * @returns {Array} elems - collection of item elements
 */
Outlayer.prototype.getItemElements = function() {
  var elems = [];
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    elems.push( this.items[i].element );
  }
  return elems;
};

// ----- init & layout ----- //

/**
 * lays out all items
 */
Outlayer.prototype.layout = function() {
  this._resetLayout();
  this._manageStamps();

  // don't animate first layout
  var isInstant = this.options.isLayoutInstant !== undefined ?
    this.options.isLayoutInstant : !this._isLayoutInited;
  this.layoutItems( this.items, isInstant );

  // flag for initalized
  this._isLayoutInited = true;
};

// _init is alias for layout
Outlayer.prototype._init = Outlayer.prototype.layout;

/**
 * logic before any new layout
 */
Outlayer.prototype._resetLayout = function() {
  this.getSize();
};


Outlayer.prototype.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * get measurement from option, for columnWidth, rowHeight, gutter
 * if option is String -> get element from selector string, & get size of element
 * if option is Element -> get size of element
 * else use option as a number
 *
 * @param {String} measurement
 * @param {String} size - width or height
 * @private
 */
Outlayer.prototype._getMeasurement = function( measurement, size ) {
  var option = this.options[ measurement ];
  var elem;
  if ( !option ) {
    // default to 0
    this[ measurement ] = 0;
  } else {
    // use option as an element
    if ( typeof option === 'string' ) {
      elem = this.element.querySelector( option );
    } else if ( isElement( option ) ) {
      elem = option;
    }
    // use size of element, if element
    this[ measurement ] = elem ? getSize( elem )[ size ] : option;
  }
};

/**
 * layout a collection of item elements
 * @api public
 */
Outlayer.prototype.layoutItems = function( items, isInstant ) {
  items = this._getItemsForLayout( items );

  this._layoutItems( items, isInstant );

  this._postLayout();
};

/**
 * get the items to be laid out
 * you may want to skip over some items
 * @param {Array} items
 * @returns {Array} items
 */
Outlayer.prototype._getItemsForLayout = function( items ) {
  var layoutItems = [];
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    if ( !item.isIgnored ) {
      layoutItems.push( item );
    }
  }
  return layoutItems;
};

/**
 * layout items
 * @param {Array} items
 * @param {Boolean} isInstant
 */
Outlayer.prototype._layoutItems = function( items, isInstant ) {
  var _this = this;
  function onItemsLayout() {
    _this.emitEvent( 'layoutComplete', [ _this, items ] );
  }

  if ( !items || !items.length ) {
    // no items, emit event with empty array
    onItemsLayout();
    return;
  }

  // emit layoutComplete when done
  this._itemsOn( items, 'layout', onItemsLayout );

  var queue = [];

  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    // get x/y object from method
    var position = this._getItemLayoutPosition( item );
    // enqueue
    position.item = item;
    position.isInstant = isInstant || item.isLayoutInstant;
    queue.push( position );
  }

  this._processLayoutQueue( queue );
};

/**
 * get item layout position
 * @param {Outlayer.Item} item
 * @returns {Object} x and y position
 */
Outlayer.prototype._getItemLayoutPosition = function( /* item */ ) {
  return {
    x: 0,
    y: 0
  };
};

/**
 * iterate over array and position each item
 * Reason being - separating this logic prevents 'layout invalidation'
 * thx @paul_irish
 * @param {Array} queue
 */
Outlayer.prototype._processLayoutQueue = function( queue ) {
  for ( var i=0, len = queue.length; i < len; i++ ) {
    var obj = queue[i];
    this._positionItem( obj.item, obj.x, obj.y, obj.isInstant );
  }
};

/**
 * Sets position of item in DOM
 * @param {Outlayer.Item} item
 * @param {Number} x - horizontal position
 * @param {Number} y - vertical position
 * @param {Boolean} isInstant - disables transitions
 */
Outlayer.prototype._positionItem = function( item, x, y, isInstant ) {
  if ( isInstant ) {
    // if not transition, just set CSS
    item.goTo( x, y );
  } else {
    item.moveTo( x, y );
  }
};

/**
 * Any logic you want to do after each layout,
 * i.e. size the container
 */
Outlayer.prototype._postLayout = function() {
  this.resizeContainer();
};

Outlayer.prototype.resizeContainer = function() {
  if ( !this.options.isResizingContainer ) {
    return;
  }
  var size = this._getContainerSize();
  if ( size ) {
    this._setContainerMeasure( size.width, true );
    this._setContainerMeasure( size.height, false );
  }
};

/**
 * Sets width or height of container if returned
 * @returns {Object} size
 *   @param {Number} width
 *   @param {Number} height
 */
Outlayer.prototype._getContainerSize = noop;

/**
 * @param {Number} measure - size of width or height
 * @param {Boolean} isWidth
 */
Outlayer.prototype._setContainerMeasure = function( measure, isWidth ) {
  if ( measure === undefined ) {
    return;
  }

  var elemSize = this.size;
  // add padding and border width if border box
  if ( elemSize.isBorderBox ) {
    measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
      elemSize.borderLeftWidth + elemSize.borderRightWidth :
      elemSize.paddingBottom + elemSize.paddingTop +
      elemSize.borderTopWidth + elemSize.borderBottomWidth;
  }

  measure = Math.max( measure, 0 );
  this.element.style[ isWidth ? 'width' : 'height' ] = measure + 'px';
};

/**
 * trigger a callback for a collection of items events
 * @param {Array} items - Outlayer.Items
 * @param {String} eventName
 * @param {Function} callback
 */
Outlayer.prototype._itemsOn = function( items, eventName, callback ) {
  var doneCount = 0;
  var count = items.length;
  // event callback
  var _this = this;
  function tick() {
    doneCount++;
    if ( doneCount === count ) {
      callback.call( _this );
    }
    return true; // bind once
  }
  // bind callback
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    item.on( eventName, tick );
  }
};

// -------------------------- ignore & stamps -------------------------- //


/**
 * keep item in collection, but do not lay it out
 * ignored items do not get skipped in layout
 * @param {Element} elem
 */
Outlayer.prototype.ignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    item.isIgnored = true;
  }
};

/**
 * return item to layout collection
 * @param {Element} elem
 */
Outlayer.prototype.unignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    delete item.isIgnored;
  }
};

/**
 * adds elements to stamps
 * @param {NodeList, Array, Element, or String} elems
 */
Outlayer.prototype.stamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ) {
    return;
  }

  this.stamps = this.stamps.concat( elems );
  // ignore
  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    this.ignore( elem );
  }
};

/**
 * removes elements to stamps
 * @param {NodeList, Array, or Element} elems
 */
Outlayer.prototype.unstamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ){
    return;
  }

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    // filter out removed stamp elements
    removeFrom( elem, this.stamps );
    this.unignore( elem );
  }

};

/**
 * finds child elements
 * @param {NodeList, Array, Element, or String} elems
 * @returns {Array} elems
 */
Outlayer.prototype._find = function( elems ) {
  if ( !elems ) {
    return;
  }
  // if string, use argument as selector string
  if ( typeof elems === 'string' ) {
    elems = this.element.querySelectorAll( elems );
  }
  elems = makeArray( elems );
  return elems;
};

Outlayer.prototype._manageStamps = function() {
  if ( !this.stamps || !this.stamps.length ) {
    return;
  }

  this._getBoundingRect();

  for ( var i=0, len = this.stamps.length; i < len; i++ ) {
    var stamp = this.stamps[i];
    this._manageStamp( stamp );
  }
};

// update boundingLeft / Top
Outlayer.prototype._getBoundingRect = function() {
  // get bounding rect for container element
  var boundingRect = this.element.getBoundingClientRect();
  var size = this.size;
  this._boundingRect = {
    left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
    top: boundingRect.top + size.paddingTop + size.borderTopWidth,
    right: boundingRect.right - ( size.paddingRight + size.borderRightWidth ),
    bottom: boundingRect.bottom - ( size.paddingBottom + size.borderBottomWidth )
  };
};

/**
 * @param {Element} stamp
**/
Outlayer.prototype._manageStamp = noop;

/**
 * get x/y position of element relative to container element
 * @param {Element} elem
 * @returns {Object} offset - has left, top, right, bottom
 */
Outlayer.prototype._getElementOffset = function( elem ) {
  var boundingRect = elem.getBoundingClientRect();
  var thisRect = this._boundingRect;
  var size = getSize( elem );
  var offset = {
    left: boundingRect.left - thisRect.left - size.marginLeft,
    top: boundingRect.top - thisRect.top - size.marginTop,
    right: thisRect.right - boundingRect.right - size.marginRight,
    bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
  };
  return offset;
};

// -------------------------- resize -------------------------- //

// enable event handlers for listeners
// i.e. resize -> onresize
Outlayer.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

/**
 * Bind layout to window resizing
 */
Outlayer.prototype.bindResize = function() {
  // bind just one listener
  if ( this.isResizeBound ) {
    return;
  }
  eventie.bind( window, 'resize', this );
  this.isResizeBound = true;
};

/**
 * Unbind layout to window resizing
 */
Outlayer.prototype.unbindResize = function() {
  if ( this.isResizeBound ) {
    eventie.unbind( window, 'resize', this );
  }
  this.isResizeBound = false;
};

// original debounce by John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/

// this fires every resize
Outlayer.prototype.onresize = function() {
  if ( this.resizeTimeout ) {
    clearTimeout( this.resizeTimeout );
  }

  var _this = this;
  function delayed() {
    _this.resize();
    delete _this.resizeTimeout;
  }

  this.resizeTimeout = setTimeout( delayed, 100 );
};

// debounced, layout on resize
Outlayer.prototype.resize = function() {
  // don't trigger if size did not change
  // or if resize was unbound. See #9

  if ( !this.isResizeBound || !this.needsResizeLayout() ) {
    return;
  }

  this.layout();
};

/**
 * check if layout is needed post layout
 * @returns Boolean
 */
Outlayer.prototype.needsResizeLayout = function() {
  var size = getSize( this.element );
  // check that this.size and size are there
  // IE8 triggers resize on body size change, so they might not be
  var hasSizes = this.size && size;
  return hasSizes && size.innerWidth !== this.size.innerWidth;
};

// -------------------------- methods -------------------------- //

/**
 * add items to Outlayer instance
 * @param {Array or NodeList or Element} elems
 * @returns {Array} items - Outlayer.Items
**/
Outlayer.prototype.addItems = function( elems ) {
  var items = this._itemize( elems );
  // add items to collection
  if ( items.length ) {
    this.items = this.items.concat( items );
  }
  return items;
};

/**
 * Layout newly-appended item elements
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.appended = function( elems ) {
  var items = this.addItems( elems );
  if ( !items.length ) {
    return;
  }
  // layout and reveal just the new items
  this.layoutItems( items, true );
  this.reveal( items );
};

/**
 * Layout prepended elements
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.prepended = function( elems ) {
  var items = this._itemize( elems );
  if ( !items.length ) {
    return;
  }
  // add items to beginning of collection
  var previousItems = this.items.slice(0);
  this.items = items.concat( previousItems );
  // start new layout
  this._resetLayout();
  this._manageStamps();
  // layout new stuff without transition
  this.layoutItems( items, true );
  this.reveal( items );
  // layout previous items
  this.layoutItems( previousItems );
};

/**
 * reveal a collection of items
 * @param {Array of Outlayer.Items} items
 */
Outlayer.prototype.reveal = function( items ) {
  var len = items && items.length;
  if ( !len ) {
    return;
  }
  for ( var i=0; i < len; i++ ) {
    var item = items[i];
    item.reveal();
  }
};

/**
 * hide a collection of items
 * @param {Array of Outlayer.Items} items
 */
Outlayer.prototype.hide = function( items ) {
  var len = items && items.length;
  if ( !len ) {
    return;
  }
  for ( var i=0; i < len; i++ ) {
    var item = items[i];
    item.hide();
  }
};

/**
 * get Outlayer.Item, given an Element
 * @param {Element} elem
 * @param {Function} callback
 * @returns {Outlayer.Item} item
 */
Outlayer.prototype.getItem = function( elem ) {
  // loop through items to get the one that matches
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    var item = this.items[i];
    if ( item.element === elem ) {
      // return item
      return item;
    }
  }
};

/**
 * get collection of Outlayer.Items, given Elements
 * @param {Array} elems
 * @returns {Array} items - Outlayer.Items
 */
Outlayer.prototype.getItems = function( elems ) {
  if ( !elems || !elems.length ) {
    return;
  }
  var items = [];
  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    var item = this.getItem( elem );
    if ( item ) {
      items.push( item );
    }
  }

  return items;
};

/**
 * remove element(s) from instance and DOM
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.remove = function( elems ) {
  elems = makeArray( elems );

  var removeItems = this.getItems( elems );
  // bail if no items to remove
  if ( !removeItems || !removeItems.length ) {
    return;
  }

  this._itemsOn( removeItems, 'remove', function() {
    this.emitEvent( 'removeComplete', [ this, removeItems ] );
  });

  for ( var i=0, len = removeItems.length; i < len; i++ ) {
    var item = removeItems[i];
    item.remove();
    // remove item from collection
    removeFrom( item, this.items );
  }
};

// ----- destroy ----- //

// remove and disable Outlayer instance
Outlayer.prototype.destroy = function() {
  // clean up dynamic styles
  var style = this.element.style;
  style.height = '';
  style.position = '';
  style.width = '';
  // destroy items
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    var item = this.items[i];
    item.destroy();
  }

  this.unbindResize();

  delete this.element.outlayerGUID;
  // remove data for jQuery
  if ( jQuery ) {
    jQuery.removeData( this.element, this.constructor.namespace );
  }

};

// -------------------------- data -------------------------- //

/**
 * get Outlayer instance from element
 * @param {Element} elem
 * @returns {Outlayer}
 */
Outlayer.data = function( elem ) {
  var id = elem && elem.outlayerGUID;
  return id && instances[ id ];
};


// -------------------------- create Outlayer class -------------------------- //

/**
 * create a layout class
 * @param {String} namespace
 */
Outlayer.create = function( namespace, options ) {
  // sub-class Outlayer
  function Layout() {
    Outlayer.apply( this, arguments );
  }
  // inherit Outlayer prototype, use Object.create if there
  if ( Object.create ) {
    Layout.prototype = Object.create( Outlayer.prototype );
  } else {
    extend( Layout.prototype, Outlayer.prototype );
  }
  // set contructor, used for namespace and Item
  Layout.prototype.constructor = Layout;

  Layout.defaults = extend( {}, Outlayer.defaults );
  // apply new options
  extend( Layout.defaults, options );
  // keep prototype.settings for backwards compatibility (Packery v1.2.0)
  Layout.prototype.settings = {};

  Layout.namespace = namespace;

  Layout.data = Outlayer.data;

  // sub-class Item
  Layout.Item = function LayoutItem() {
    Item.apply( this, arguments );
  };

  Layout.Item.prototype = new Item();

  // -------------------------- declarative -------------------------- //

  /**
   * allow user to initialize Outlayer via .js-namespace class
   * options are parsed from data-namespace-option attribute
   */
  docReady( function() {
    var dashedNamespace = toDashed( namespace );
    var elems = document.querySelectorAll( '.js-' + dashedNamespace );
    var dataAttr = 'data-' + dashedNamespace + '-options';

    for ( var i=0, len = elems.length; i < len; i++ ) {
      var elem = elems[i];
      var attr = elem.getAttribute( dataAttr );
      var options;
      try {
        options = attr && JSON.parse( attr );
      } catch ( error ) {
        // log error, do not initialize
        if ( console ) {
          console.error( 'Error parsing ' + dataAttr + ' on ' +
            elem.nodeName.toLowerCase() + ( elem.id ? '#' + elem.id : '' ) + ': ' +
            error );
        }
        continue;
      }
      // initialize
      var instance = new Layout( elem, options );
      // make available via $().data('layoutname')
      if ( jQuery ) {
        jQuery.data( elem, namespace, instance );
      }
    }
  });

  // -------------------------- jQuery bridge -------------------------- //

  // make into jQuery plugin
  if ( jQuery && jQuery.bridget ) {
    jQuery.bridget( namespace, Layout );
  }

  return Layout;
};

// ----- fin ----- //

// back in global
Outlayer.Item = Item;

return Outlayer;

}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'outlayer/outlayer',[
      'eventie/eventie',
      'doc-ready/doc-ready',
      'eventEmitter/EventEmitter',
      'get-size/get-size',
      'matches-selector/matches-selector',
      './item'
    ],
    outlayerDefinition );
} else {
  // browser global
  window.Outlayer = outlayerDefinition(
    window.eventie,
    window.docReady,
    window.EventEmitter,
    window.getSize,
    window.matchesSelector,
    window.Outlayer.Item
  );
}

})( window );

/*!
 * Masonry v3.1.5
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

( function( window ) {



// -------------------------- helpers -------------------------- //

var indexOf = Array.prototype.indexOf ?
  function( items, value ) {
    return items.indexOf( value );
  } :
  function ( items, value ) {
    for ( var i=0, len = items.length; i < len; i++ ) {
      var item = items[i];
      if ( item === value ) {
        return i;
      }
    }
    return -1;
  };

// -------------------------- masonryDefinition -------------------------- //

// used for AMD definition and requires
function masonryDefinition( Outlayer, getSize ) {
  // create an Outlayer layout class
  var Masonry = Outlayer.create('masonry');

  Masonry.prototype._resetLayout = function() {
    this.getSize();
    this._getMeasurement( 'columnWidth', 'outerWidth' );
    this._getMeasurement( 'gutter', 'outerWidth' );
    this.measureColumns();

    // reset column Y
    var i = this.cols;
    this.colYs = [];
    while (i--) {
      this.colYs.push( 0 );
    }

    this.maxY = 0;
  };

  Masonry.prototype.measureColumns = function() {
    this.getContainerWidth();
    // if columnWidth is 0, default to outerWidth of first item
    if ( !this.columnWidth ) {
      var firstItem = this.items[0];
      var firstItemElem = firstItem && firstItem.element;
      // columnWidth fall back to item of first element
      this.columnWidth = firstItemElem && getSize( firstItemElem ).outerWidth ||
        // if first elem has no width, default to size of container
        this.containerWidth;
    }

    this.columnWidth += this.gutter;

    this.cols = Math.floor( ( this.containerWidth + this.gutter ) / this.columnWidth );
    this.cols = Math.max( this.cols, 1 );
  };

  Masonry.prototype.getContainerWidth = function() {
    // container is parent if fit width
    var container = this.options.isFitWidth ? this.element.parentNode : this.element;
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var size = getSize( container );
    this.containerWidth = size && size.innerWidth;
  };

  Masonry.prototype._getItemLayoutPosition = function( item ) {
    item.getSize();
    // how many columns does this brick span
    var remainder = item.size.outerWidth % this.columnWidth;
    var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
    // round if off by 1 pixel, otherwise use ceil
    var colSpan = Math[ mathMethod ]( item.size.outerWidth / this.columnWidth );
    colSpan = Math.min( colSpan, this.cols );

    var colGroup = this._getColGroup( colSpan );
    // get the minimum Y value from the columns
    var minimumY = Math.min.apply( Math, colGroup );
    var shortColIndex = indexOf( colGroup, minimumY );

    // position the brick
    var position = {
      x: this.columnWidth * shortColIndex,
      y: minimumY
    };

    // apply setHeight to necessary columns
    var setHeight = minimumY + item.size.outerHeight;
    var setSpan = this.cols + 1 - colGroup.length;
    for ( var i = 0; i < setSpan; i++ ) {
      this.colYs[ shortColIndex + i ] = setHeight;
    }

    return position;
  };

  /**
   * @param {Number} colSpan - number of columns the element spans
   * @returns {Array} colGroup
   */
  Masonry.prototype._getColGroup = function( colSpan ) {
    if ( colSpan < 2 ) {
      // if brick spans only one column, use all the column Ys
      return this.colYs;
    }

    var colGroup = [];
    // how many different places could this brick fit horizontally
    var groupCount = this.cols + 1 - colSpan;
    // for each group potential horizontal position
    for ( var i = 0; i < groupCount; i++ ) {
      // make an array of colY values for that one group
      var groupColYs = this.colYs.slice( i, i + colSpan );
      // and get the max value of the array
      colGroup[i] = Math.max.apply( Math, groupColYs );
    }
    return colGroup;
  };

  Masonry.prototype._manageStamp = function( stamp ) {
    var stampSize = getSize( stamp );
    var offset = this._getElementOffset( stamp );
    // get the columns that this stamp affects
    var firstX = this.options.isOriginLeft ? offset.left : offset.right;
    var lastX = firstX + stampSize.outerWidth;
    var firstCol = Math.floor( firstX / this.columnWidth );
    firstCol = Math.max( 0, firstCol );
    var lastCol = Math.floor( lastX / this.columnWidth );
    // lastCol should not go over if multiple of columnWidth #425
    lastCol -= lastX % this.columnWidth ? 0 : 1;
    lastCol = Math.min( this.cols - 1, lastCol );
    // set colYs to bottom of the stamp
    var stampMaxY = ( this.options.isOriginTop ? offset.top : offset.bottom ) +
      stampSize.outerHeight;
    for ( var i = firstCol; i <= lastCol; i++ ) {
      this.colYs[i] = Math.max( stampMaxY, this.colYs[i] );
    }
  };

  Masonry.prototype._getContainerSize = function() {
    this.maxY = Math.max.apply( Math, this.colYs );
    var size = {
      height: this.maxY
    };

    if ( this.options.isFitWidth ) {
      size.width = this._getContainerFitWidth();
    }

    return size;
  };

  Masonry.prototype._getContainerFitWidth = function() {
    var unusedCols = 0;
    // count unused columns
    var i = this.cols;
    while ( --i ) {
      if ( this.colYs[i] !== 0 ) {
        break;
      }
      unusedCols++;
    }
    // fit container to columns that have been used
    return ( this.cols - unusedCols ) * this.columnWidth - this.gutter;
  };

  Masonry.prototype.needsResizeLayout = function() {
    var previousWidth = this.containerWidth;
    this.getContainerWidth();
    return previousWidth !== this.containerWidth;
  };

  return Masonry;
}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      'outlayer/outlayer',
      'get-size/get-size'
    ],
    masonryDefinition );
} else {
  // browser global
  window.Masonry = masonryDefinition(
    window.Outlayer,
    window.getSize
  );
}

})( window );

;
(function($){


var Checker,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Checker = (function() {

  function Checker($el, field) {
    this.run = __bind(this.run, this);

    var sel;
    sel = field[0], this.metric = field[1];
    this.getVal = this.makeGetVal($el, sel);
  }

  Checker.prototype.run = function() {
    return this.verify(this.metric, this.getVal());
  };

  Checker.prototype.makeGetVal = function($el, sel) {
    var inputs, name, type;
    type = $el.attr('type');
    if (type === 'checkbox') {
      return function() {
        return $el.is(':checked');
      };
    } else if (type === 'radio') {
      name = $el.attr('name');
      return function() {
        return $('[name="' + name + '"]').filter(':checked').val();
      };
    } else {
      if (this.metric === 'one-of') {
        inputs = $(sel);
        return function() {
          return inputs.map(function() {
            return $.trim(this.value);
          }).get().join('');
        };
      } else {
        return function() {
          return $.trim($el.val());
        };
      }
    }
  };

  Checker.prototype.verify = function(m, v) {
    var arg, sec, type, _ref;
    if (!!(m && m.constructor && m.call && m.apply)) {
      return m(v);
    }
    if (m instanceof RegExp) {
      return m.test(v);
    }
    _ref = $.map(m.split(':'), $.trim), type = _ref[0], arg = _ref[1], sec = _ref[2];
    if (type === 'same-as' && $(arg).length !== 1) {
      throw new Error('same-as selector must target one and only one element');
    }
    if (!v && type !== 'presence' && type !== 'one-of') {
      return true;
    }
    switch (type) {
      case 'presence':
        return !!v;
      case 'one-of':
        return !!v;
      case 'exact':
        return v === arg;
      case 'not':
        return v !== arg;
      case 'same-as':
        return v === $(arg).val();
      case 'min-num':
        return +v >= +arg;
      case 'max-num':
        return +v <= +arg;
      case 'between-num':
        return +v >= +arg && +v <= +sec;
      case 'min-length':
        return v.length >= +arg;
      case 'max-length':
        return v.length <= +arg;
      case 'exact-length':
        return v.length === +arg;
      case 'between':
        return v.length >= +arg && v.length <= +sec;
      case 'integer':
        return /^\s*\d+\s*$/.test(v);
      case 'float':
        return /^[-+]?[0-9]+(\.[0-9]+)?$/.test(v);
      case 'email':
        return this.email(v);
      default:
        throw new Error('I don\'t know ' + type + ', sorry.');
    }
  };

  Checker.prototype.email = function(v) {
    var RFC822;
    RFC822 = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;
    return RFC822.test(v);
  };

  return Checker;

})();

var Listener,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Listener = (function() {

  function Listener(el, get, field) {
    this.get = get;
    this.field = field;
    this.change_status = __bind(this.change_status, this);

    this.runCheck = __bind(this.runCheck, this);

    this.delayedCheck = __bind(this.delayedCheck, this);

    this.events = __bind(this.events, this);

    this.$el = $(el);
    this.delayId = "";
    this.status = null;
    this.checker = new Checker(this.$el, this.field);
    this.msg = new Msg(this.$el, this.get, this.field);
    this.events();
  }

  Listener.prototype.events = function() {
    if (this.$el.attr('type') === 'radio') {
      return $('[name="' + this.$el.attr("name") + '"]').on('change', this.runCheck);
    } else {
      this.$el.on('change', this.runCheck);
      this.$el.on('blur', this.runCheck);
      if (this.field[1] === 'one-of') {
        $(window).on('nod-run-one-of', this.runCheck);
      }
      if (this.get.delay) {
        return this.$el.on('keyup', this.delayedCheck);
      }
    }
  };

  Listener.prototype.delayedCheck = function() {
    clearTimeout(this.delayId);
    return this.delayId = setTimeout(this.runCheck, this.get.delay);
  };

  Listener.prototype.runCheck = function() {
    return $.when(this.checker.run()).then(this.change_status);
  };

  Listener.prototype.change_status = function(status) {
    var isCorrect;
    try {
      status = eval(status);
    } catch (_error) {}
    isCorrect = !!status;
    if (this.status === isCorrect) {
      return;
    }
    this.status = isCorrect;
    this.msg.toggle(this.status);
    $(this).trigger('nod_toggle');
    if (this.field[1] === 'one-of' && status) {
      return $(window).trigger('nod-run-one-of');
    }
  };

  return Listener;

})();

var Msg,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Msg = (function() {

  function Msg($el, get, field) {
    this.$el = $el;
    this.get = get;
    this.createShowMsg = __bind(this.createShowMsg, this);

    this.toggle = __bind(this.toggle, this);

    this.createMsg = __bind(this.createMsg, this);

    this.$msg = this.createMsg(field[2]);
    this.showMsg = this.createShowMsg();
  }

  Msg.prototype.createMsg = function(msg) {
    return $('<span/>', {
      'html': msg,
      'class': this.get.helpSpanDisplay + ' ' + this.get.errorClass
    });
  };

  Msg.prototype.toggle = function(status) {
    if (status) {
      return this.$msg.remove();
    } else {
      this.showMsg();
      if (this.get.broadcastError) {
        return this.broadcast();
      }
    }
  };

  Msg.prototype.createShowMsg = function() {
    var pos, type;
    type = this.$el.attr('type');
    if (type === 'checkbox' || type === 'radio') {
      return function() {
        return this.$el.parent().append(this.$msg);
      };
    } else {
      pos = this.findPos(this.$el);
      return function() {
        return pos.after(this.$msg);
      };
    }
  };

  Msg.prototype.findPos = function($el) {
    if (this.elHasClass('parent', $el)) {
      return this.findPos($el.parent());
    }
    if (this.elHasClass('next', $el)) {
      return this.findPos($el.next());
    }
    return $el;
  };

  Msg.prototype.elHasClass = function(dir, $el) {
    var sel, _i, _len, _ref;
    _ref = this.get.errorPosClasses;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      sel = _ref[_i];
      if ($el[dir](sel).length) {
        return true;
      }
    }
    return false;
  };

  Msg.prototype.broadcast = function() {
    return $(window).trigger('nod_error_fired', {
      el: this.$el,
      msg: this.$msg.html()
    });
  };

  return Msg;

})();

var Nod,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Nod = (function() {

  function Nod(form, fields, options) {
    this.form = form;
    this.formIsErrorFree = __bind(this.formIsErrorFree, this);

    this.submitForm = __bind(this.submitForm, this);

    this.toggleSubmitBtnText = __bind(this.toggleSubmitBtnText, this);

    this.toggleSubmitBtn = __bind(this.toggleSubmitBtn, this);

    this.toggleGroupClass = __bind(this.toggleGroupClass, this);

    this.toggle_status = __bind(this.toggle_status, this);

    this.massCheck = __bind(this.massCheck, this);

    this.listenForEnter = __bind(this.listenForEnter, this);

    this.events = __bind(this.events, this);

    this.createListeners = __bind(this.createListeners, this);

    if (!fields) {
      return;
    }
    this.form[0].__nod = this;
    this.get = $.extend({
      'delay': 700,
      'disableSubmitBtn': true,
      'helpSpanDisplay': 'help-inline',
      'groupClass': 'error',
      'submitBtnSelector': '[type=submit]',
      'metricsSplitter': ':',
      'errorPosClasses': ['.help-inline', '.add-on', 'button', '.input-append'],
      'silentSubmit': false,
      'broadcastError': false,
      'errorClass': 'nod_msg',
      'groupSelector': '.control-group'
    }, options);
    this.listeners = this.createListeners(fields);
    this.submit = this.form.find(this.get.submitBtnSelector);
    this.checkIfElementsExist(this.form, this.submit, this.get.disableSubmitBtn);
    this.events();
  }

  Nod.prototype.createListeners = function(fields) {
    var el, field, listeners, _i, _j, _len, _len1, _ref;
    listeners = [];
    for (_i = 0, _len = fields.length; _i < _len; _i++) {
      field = fields[_i];
      if (field.length !== 3) {
        this["throw"]('field', field);
      }
      _ref = this.form.find(field[0]);
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        el = _ref[_j];
        listeners.push(new Listener(el, this.get, field));
      }
    }
    return listeners;
  };

  Nod.prototype.events = function() {
    var l, _i, _len, _ref;
    _ref = this.listeners;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      l = _ref[_i];
      $(l).on('nod_toggle', this.toggle_status);
    }
    if (this.submit.length) {
      return this.submit.on('click', this.massCheck);
    } else {
      return this.form.on('keyup', this.listenForEnter);
    }
  };

  Nod.prototype.listenForEnter = function(event) {
    if (event.keyCode === 13) {
      return this.massCheck();
    }
  };

  Nod.prototype.massCheck = function(event) {
    var checks, l, _i, _len, _ref;
    if (event != null) {
      event.preventDefault();
    }
    checks = [];
    _ref = this.listeners;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      l = _ref[_i];
      checks.push(l.runCheck());
    }
    this.toggleSubmitBtnText();
    return $.when.apply($, checks).then(this.submitForm).then(this.toggleSubmitBtnText);
  };

  Nod.prototype.toggle_status = function(event) {
    this.toggleGroupClass(event.target.$el.parents(this.get.groupSelector));
    if (this.get.disableSubmitBtn) {
      return this.toggleSubmitBtn();
    }
  };

  Nod.prototype.toggleGroupClass = function($group) {
    if ($group.find('.' + this.get.errorClass).length) {
      return $group.addClass(this.get.groupClass);
    } else {
      return $group.removeClass(this.get.groupClass);
    }
  };

  Nod.prototype.toggleSubmitBtn = function() {
    if (this.formIsErrorFree()) {
      return this.submit.removeClass('disabled').removeAttr('disabled');
    } else {
      return this.submit.addClass('disabled').attr('disabled', 'disabled');
    }
  };

  Nod.prototype.toggleSubmitBtnText = function() {
    var tmp;
    tmp = this.submit.attr('data-loading-text');
    if (tmp) {
      this.submit.attr('data-loading-text', this.submit.html());
      return this.submit.html(tmp);
    }
  };

  Nod.prototype.submitForm = function() {
    var $form;
    if (!this.formIsErrorFree()) {
      return;
    }
    if (this.get.silentSubmit) {
      $form = $(this.form);
      return $form.trigger('silentSubmit', $form.serialize());
    } else {
      return this.form.submit();
    }
  };

  Nod.prototype.formIsErrorFree = function() {
    return !$(this.listeners).filter(function() {
      if (this.status === null) {
        this.runCheck();
      }
      return !this.status;
    }).length;
  };

  Nod.prototype.checkIfElementsExist = function(form, submit, disableSubmitBtn) {
    if (!form.selector || !form.length) {
      this["throw"]('form', form);
    }
    if (!submit.length && disableSubmitBtn) {
      return this["throw"]('submit', submit);
    }
  };

  Nod.prototype["throw"] = function(type, el) {
    var txt;
    switch (type) {
      case 'form':
        txt = 'Couldn\'t find form: ';
        break;
      case 'submit':
        txt = 'Couldn\'t find submit button: ';
        break;
      case 'field':
        txt = 'Metrics for each field must have three parts: ';
    }
    throw new Error(txt + el);
  };

  return Nod;

})();


$.fn.nod = function(fields, settings) {
  if (!(fields || settings)) {
    return this[0].__nod;
  }
  new Nod(this, fields, settings);
  return this;
};

})(jQuery);
;
/*JS Lint helpers: */
/*global dragMove: false, dragEnd: false, $, jQuery, alert, window, document */
/*jslint nomen: true, continue:true */

if (typeof Object.create !== "function") {
    Object.create = function (obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}
(function ($, window, document) {

    var Carousel = {
        init : function (options, el) {
            var base = this;

            base.$elem = $(el);
            base.options = $.extend({}, $.fn.owlCarousel.options, base.$elem.data(), options);

            base.userOptions = options;
            base.loadContent();
        },

        loadContent : function () {
            var base = this, url;

            function getData(data) {
                var i, content = "";
                if (typeof base.options.jsonSuccess === "function") {
                    base.options.jsonSuccess.apply(this, [data]);
                } else {
                    for (i in data.owl) {
                        if (data.owl.hasOwnProperty(i)) {
                            content += data.owl[i].item;
                        }
                    }
                    base.$elem.html(content);
                }
                base.logIn();
            }

            if (typeof base.options.beforeInit === "function") {
                base.options.beforeInit.apply(this, [base.$elem]);
            }

            if (typeof base.options.jsonPath === "string") {
                url = base.options.jsonPath;
                $.getJSON(url, getData);
            } else {
                base.logIn();
            }
        },

        logIn : function () {
            var base = this;

            base.$elem.data("owl-originalStyles", base.$elem.attr("style"));
            base.$elem.data("owl-originalClasses", base.$elem.attr("class"));

            base.$elem.css({opacity: 0});
            base.orignalItems = base.options.items;
            base.checkBrowser();
            base.wrapperWidth = 0;
            base.checkVisible = null;
            base.setVars();
        },

        setVars : function () {
            var base = this;
            if (base.$elem.children().length === 0) {return false; }
            base.baseClass();
            base.eventTypes();
            base.$userItems = base.$elem.children();
            base.itemsAmount = base.$userItems.length;
            base.wrapItems();
            base.$owlItems = base.$elem.find(".owl-item");
            base.$owlWrapper = base.$elem.find(".owl-wrapper");
            base.playDirection = "next";
            base.prevItem = 0;
            base.prevArr = [0];
            base.currentItem = 0;
            base.customEvents();
            base.onStartup();
        },

        onStartup : function () {
            var base = this;
            base.updateItems();
            base.calculateAll();
            base.buildControls();
            base.updateControls();
            base.response();
            base.moveEvents();
            base.stopOnHover();
            base.owlStatus();

            if (base.options.transitionStyle !== false) {
                base.transitionTypes(base.options.transitionStyle);
            }
            if (base.options.autoPlay === true) {
                base.options.autoPlay = 5000;
            }
            base.play();

            base.$elem.find(".owl-wrapper").css("display", "block");

            if (!base.$elem.is(":visible")) {
                base.watchVisibility();
            } else {
                base.$elem.css("opacity", 1);
            }
            base.onstartup = false;
            base.eachMoveUpdate();
            if (typeof base.options.afterInit === "function") {
                base.options.afterInit.apply(this, [base.$elem]);
            }
        },

        eachMoveUpdate : function () {
            var base = this;

            if (base.options.lazyLoad === true) {
                base.lazyLoad();
            }
            if (base.options.autoHeight === true) {
                base.autoHeight();
            }
            base.onVisibleItems();

            if (typeof base.options.afterAction === "function") {
                base.options.afterAction.apply(this, [base.$elem]);
            }
        },

        updateVars : function () {
            var base = this;
            if (typeof base.options.beforeUpdate === "function") {
                base.options.beforeUpdate.apply(this, [base.$elem]);
            }
            base.watchVisibility();
            base.updateItems();
            base.calculateAll();
            base.updatePosition();
            base.updateControls();
            base.eachMoveUpdate();
            if (typeof base.options.afterUpdate === "function") {
                base.options.afterUpdate.apply(this, [base.$elem]);
            }
        },

        reload : function () {
            var base = this;
            window.setTimeout(function () {
                base.updateVars();
            }, 0);
        },

        watchVisibility : function () {
            var base = this;

            if (base.$elem.is(":visible") === false) {
                base.$elem.css({opacity: 0});
                window.clearInterval(base.autoPlayInterval);
                window.clearInterval(base.checkVisible);
            } else {
                return false;
            }
            base.checkVisible = window.setInterval(function () {
                if (base.$elem.is(":visible")) {
                    base.reload();
                    base.$elem.animate({opacity: 1}, 200);
                    window.clearInterval(base.checkVisible);
                }
            }, 500);
        },

        wrapItems : function () {
            var base = this;
            base.$userItems.wrapAll("<div class=\"owl-wrapper\">").wrap("<div class=\"owl-item\"></div>");
            base.$elem.find(".owl-wrapper").wrap("<div class=\"owl-wrapper-outer\">");
            base.wrapperOuter = base.$elem.find(".owl-wrapper-outer");
            base.$elem.css("display", "block");
        },

        baseClass : function () {
            var base = this,
                hasBaseClass = base.$elem.hasClass(base.options.baseClass),
                hasThemeClass = base.$elem.hasClass(base.options.theme);

            if (!hasBaseClass) {
                base.$elem.addClass(base.options.baseClass);
            }

            if (!hasThemeClass) {
                base.$elem.addClass(base.options.theme);
            }
        },

        updateItems : function () {
            var base = this, width, i;

            if (base.options.responsive === false) {
                return false;
            }
            if (base.options.singleItem === true) {
                base.options.items = base.orignalItems = 1;
                base.options.itemsCustom = false;
                base.options.itemsDesktop = false;
                base.options.itemsDesktopSmall = false;
                base.options.itemsTablet = false;
                base.options.itemsTabletSmall = false;
                base.options.itemsMobile = false;
                return false;
            }

            width = $(base.options.responsiveBaseWidth).width();

            if (width > (base.options.itemsDesktop[0] || base.orignalItems)) {
                base.options.items = base.orignalItems;
            }
            if (base.options.itemsCustom !== false) {
                //Reorder array by screen size
                base.options.itemsCustom.sort(function (a, b) {return a[0] - b[0]; });

                for (i = 0; i < base.options.itemsCustom.length; i += 1) {
                    if (base.options.itemsCustom[i][0] <= width) {
                        base.options.items = base.options.itemsCustom[i][1];
                    }
                }

            } else {

                if (width <= base.options.itemsDesktop[0] && base.options.itemsDesktop !== false) {
                    base.options.items = base.options.itemsDesktop[1];
                }

                if (width <= base.options.itemsDesktopSmall[0] && base.options.itemsDesktopSmall !== false) {
                    base.options.items = base.options.itemsDesktopSmall[1];
                }

                if (width <= base.options.itemsTablet[0] && base.options.itemsTablet !== false) {
                    base.options.items = base.options.itemsTablet[1];
                }

                if (width <= base.options.itemsTabletSmall[0] && base.options.itemsTabletSmall !== false) {
                    base.options.items = base.options.itemsTabletSmall[1];
                }

                if (width <= base.options.itemsMobile[0] && base.options.itemsMobile !== false) {
                    base.options.items = base.options.itemsMobile[1];
                }
            }

            //if number of items is less than declared
            if (base.options.items > base.itemsAmount && base.options.itemsScaleUp === true) {
                base.options.items = base.itemsAmount;
            }
        },

        response : function () {
            var base = this,
                smallDelay,
                lastWindowWidth;

            if (base.options.responsive !== true) {
                return false;
            }
            lastWindowWidth = $(window).width();

            base.resizer = function () {
                if ($(window).width() !== lastWindowWidth) {
                    if (base.options.autoPlay !== false) {
                        window.clearInterval(base.autoPlayInterval);
                    }
                    window.clearTimeout(smallDelay);
                    smallDelay = window.setTimeout(function () {
                        lastWindowWidth = $(window).width();
                        base.updateVars();
                    }, base.options.responsiveRefreshRate);
                }
            };
            $(window).resize(base.resizer);
        },

        updatePosition : function () {
            var base = this;
            base.jumpTo(base.currentItem);
            if (base.options.autoPlay !== false) {
                base.checkAp();
            }
        },

        appendItemsSizes : function () {
            var base = this,
                roundPages = 0,
                lastItem = base.itemsAmount - base.options.items;

            base.$owlItems.each(function (index) {
                var $this = $(this);
                $this
                    .css({"width": base.itemWidth})
                    .data("owl-item", Number(index));

                if (index % base.options.items === 0 || index === lastItem) {
                    if (!(index > lastItem)) {
                        roundPages += 1;
                    }
                }
                $this.data("owl-roundPages", roundPages);
            });
        },

        appendWrapperSizes : function () {
            var base = this,
                width = base.$owlItems.length * base.itemWidth;

            base.$owlWrapper.css({
                "width": width * 2,
                "left": 0
            });
            base.appendItemsSizes();
        },

        calculateAll : function () {
            var base = this;
            base.calculateWidth();
            base.appendWrapperSizes();
            base.loops();
            base.max();
        },

        calculateWidth : function () {
            var base = this;
            base.itemWidth = Math.round(base.$elem.width() / base.options.items);
        },

        max : function () {
            var base = this,
                maximum = ((base.itemsAmount * base.itemWidth) - base.options.items * base.itemWidth) * -1;
            if (base.options.items > base.itemsAmount) {
                base.maximumItem = 0;
                maximum = 0;
                base.maximumPixels = 0;
            } else {
                base.maximumItem = base.itemsAmount - base.options.items;
                base.maximumPixels = maximum;
            }
            return maximum;
        },

        min : function () {
            return 0;
        },

        loops : function () {
            var base = this,
                prev = 0,
                elWidth = 0,
                i,
                item,
                roundPageNum;

            base.positionsInArray = [0];
            base.pagesInArray = [];

            for (i = 0; i < base.itemsAmount; i += 1) {
                elWidth += base.itemWidth;
                base.positionsInArray.push(-elWidth);

                if (base.options.scrollPerPage === true) {
                    item = $(base.$owlItems[i]);
                    roundPageNum = item.data("owl-roundPages");
                    if (roundPageNum !== prev) {
                        base.pagesInArray[prev] = base.positionsInArray[i];
                        prev = roundPageNum;
                    }
                }
            }
        },

        buildControls : function () {
            var base = this;
            if (base.options.navigation === true || base.options.pagination === true) {
                base.owlControls = $("<div class=\"owl-controls\"/>").toggleClass("clickable", !base.browser.isTouch).appendTo(base.$elem);
            }
            if (base.options.pagination === true) {
                base.buildPagination();
            }
            if (base.options.navigation === true) {
                base.buildButtons();
            }
        },

        buildButtons : function () {
            var base = this,
                buttonsWrapper = $("<div class=\"owl-buttons\"/>");
            base.owlControls.append(buttonsWrapper);

            base.buttonPrev = $("<div/>", {
                "class" : "owl-prev",
                "html" : base.options.navigationText[0] || ""
            });

            base.buttonNext = $("<div/>", {
                "class" : "owl-next",
                "html" : base.options.navigationText[1] || ""
            });

            buttonsWrapper
                .append(base.buttonPrev)
                .append(base.buttonNext);

            buttonsWrapper.on("touchstart.owlControls mousedown.owlControls", "div[class^=\"owl\"]", function (event) {
                event.preventDefault();
            });

            buttonsWrapper.on("touchend.owlControls mouseup.owlControls", "div[class^=\"owl\"]", function (event) {
                event.preventDefault();
                if ($(this).hasClass("owl-next")) {
                    base.next();
                } else {
                    base.prev();
                }
            });
        },

        buildPagination : function () {
            var base = this;

            base.paginationWrapper = $("<div class=\"owl-pagination\"/>");
            base.owlControls.append(base.paginationWrapper);

            base.paginationWrapper.on("touchend.owlControls mouseup.owlControls", ".owl-page", function (event) {
                event.preventDefault();
                if (Number($(this).data("owl-page")) !== base.currentItem) {
                    base.goTo(Number($(this).data("owl-page")), true);
                }
            });
        },

        updatePagination : function () {
            var base = this,
                counter,
                lastPage,
                lastItem,
                i,
                paginationButton,
                paginationButtonInner;

            if (base.options.pagination === false) {
                return false;
            }

            base.paginationWrapper.html("");

            counter = 0;
            lastPage = base.itemsAmount - base.itemsAmount % base.options.items;

            for (i = 0; i < base.itemsAmount; i += 1) {
                if (i % base.options.items === 0) {
                    counter += 1;
                    if (lastPage === i) {
                        lastItem = base.itemsAmount - base.options.items;
                    }
                    paginationButton = $("<div/>", {
                        "class" : "owl-page"
                    });
                    paginationButtonInner = $("<span></span>", {
                        "text": base.options.paginationNumbers === true ? counter : "",
                        "class": base.options.paginationNumbers === true ? "owl-numbers" : ""
                    });
                    paginationButton.append(paginationButtonInner);

                    paginationButton.data("owl-page", lastPage === i ? lastItem : i);
                    paginationButton.data("owl-roundPages", counter);

                    base.paginationWrapper.append(paginationButton);
                }
            }
            base.checkPagination();
        },
        checkPagination : function () {
            var base = this;
            if (base.options.pagination === false) {
                return false;
            }
            base.paginationWrapper.find(".owl-page").each(function () {
                if ($(this).data("owl-roundPages") === $(base.$owlItems[base.currentItem]).data("owl-roundPages")) {
                    base.paginationWrapper
                        .find(".owl-page")
                        .removeClass("active");
                    $(this).addClass("active");
                }
            });
        },

        checkNavigation : function () {
            var base = this;

            if (base.options.navigation === false) {
                return false;
            }
            if (base.options.rewindNav === false) {
                if (base.currentItem === 0 && base.maximumItem === 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem === 0 && base.maximumItem !== 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.removeClass("disabled");
                } else if (base.currentItem === base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem !== 0 && base.currentItem !== base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.removeClass("disabled");
                }
            }
        },

        updateControls : function () {
            var base = this;
            base.updatePagination();
            base.checkNavigation();
            if (base.owlControls) {
                if (base.options.items >= base.itemsAmount) {
                    base.owlControls.hide();
                } else {
                    base.owlControls.show();
                }
            }
        },

        destroyControls : function () {
            var base = this;
            if (base.owlControls) {
                base.owlControls.remove();
            }
        },

        next : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            base.currentItem += base.options.scrollPerPage === true ? base.options.items : 1;
            if (base.currentItem > base.maximumItem + (base.options.scrollPerPage === true ? (base.options.items - 1) : 0)) {
                if (base.options.rewindNav === true) {
                    base.currentItem = 0;
                    speed = "rewind";
                } else {
                    base.currentItem = base.maximumItem;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        prev : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            if (base.options.scrollPerPage === true && base.currentItem > 0 && base.currentItem < base.options.items) {
                base.currentItem = 0;
            } else {
                base.currentItem -= base.options.scrollPerPage === true ? base.options.items : 1;
            }
            if (base.currentItem < 0) {
                if (base.options.rewindNav === true) {
                    base.currentItem = base.maximumItem;
                    speed = "rewind";
                } else {
                    base.currentItem = 0;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        goTo : function (position, speed, drag) {
            var base = this,
                goToPixel;

            if (base.isTransition) {
                return false;
            }
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }

            base.currentItem = base.owl.currentItem = position;
            if (base.options.transitionStyle !== false && drag !== "drag" && base.options.items === 1 && base.browser.support3d === true) {
                base.swapSpeed(0);
                if (base.browser.support3d === true) {
                    base.transition3d(base.positionsInArray[position]);
                } else {
                    base.css2slide(base.positionsInArray[position], 1);
                }
                base.afterGo();
                base.singleItemTransition();
                return false;
            }
            goToPixel = base.positionsInArray[position];

            if (base.browser.support3d === true) {
                base.isCss3Finish = false;

                if (speed === true) {
                    base.swapSpeed("paginationSpeed");
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.paginationSpeed);

                } else if (speed === "rewind") {
                    base.swapSpeed(base.options.rewindSpeed);
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.rewindSpeed);

                } else {
                    base.swapSpeed("slideSpeed");
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.slideSpeed);
                }
                base.transition3d(goToPixel);
            } else {
                if (speed === true) {
                    base.css2slide(goToPixel, base.options.paginationSpeed);
                } else if (speed === "rewind") {
                    base.css2slide(goToPixel, base.options.rewindSpeed);
                } else {
                    base.css2slide(goToPixel, base.options.slideSpeed);
                }
            }
            base.afterGo();
        },

        jumpTo : function (position) {
            var base = this;
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem || position === -1) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }
            base.swapSpeed(0);
            if (base.browser.support3d === true) {
                base.transition3d(base.positionsInArray[position]);
            } else {
                base.css2slide(base.positionsInArray[position], 1);
            }
            base.currentItem = base.owl.currentItem = position;
            base.afterGo();
        },

        afterGo : function () {
            var base = this;

            base.prevArr.push(base.currentItem);
            base.prevItem = base.owl.prevItem = base.prevArr[base.prevArr.length - 2];
            base.prevArr.shift(0);

            if (base.prevItem !== base.currentItem) {
                base.checkPagination();
                base.checkNavigation();
                base.eachMoveUpdate();

                if (base.options.autoPlay !== false) {
                    base.checkAp();
                }
            }
            if (typeof base.options.afterMove === "function" && base.prevItem !== base.currentItem) {
                base.options.afterMove.apply(this, [base.$elem]);
            }
        },

        stop : function () {
            var base = this;
            base.apStatus = "stop";
            window.clearInterval(base.autoPlayInterval);
        },

        checkAp : function () {
            var base = this;
            if (base.apStatus !== "stop") {
                base.play();
            }
        },

        play : function () {
            var base = this;
            base.apStatus = "play";
            if (base.options.autoPlay === false) {
                return false;
            }
            window.clearInterval(base.autoPlayInterval);
            base.autoPlayInterval = window.setInterval(function () {
                base.next(true);
            }, base.options.autoPlay);
        },

        swapSpeed : function (action) {
            var base = this;
            if (action === "slideSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.slideSpeed));
            } else if (action === "paginationSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.paginationSpeed));
            } else if (typeof action !== "string") {
                base.$owlWrapper.css(base.addCssSpeed(action));
            }
        },

        addCssSpeed : function (speed) {
            return {
                "-webkit-transition": "all " + speed + "ms ease",
                "-moz-transition": "all " + speed + "ms ease",
                "-o-transition": "all " + speed + "ms ease",
                "transition": "all " + speed + "ms ease"
            };
        },

        removeTransition : function () {
            return {
                "-webkit-transition": "",
                "-moz-transition": "",
                "-o-transition": "",
                "transition": ""
            };
        },

        doTranslate : function (pixels) {
            return {
                "-webkit-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-moz-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-o-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-ms-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "transform": "translate3d(" + pixels + "px, 0px,0px)"
            };
        },

        transition3d : function (value) {
            var base = this;
            base.$owlWrapper.css(base.doTranslate(value));
        },

        css2move : function (value) {
            var base = this;
            base.$owlWrapper.css({"left" : value});
        },

        css2slide : function (value, speed) {
            var base = this;

            base.isCssFinish = false;
            base.$owlWrapper.stop(true, true).animate({
                "left" : value
            }, {
                duration : speed || base.options.slideSpeed,
                complete : function () {
                    base.isCssFinish = true;
                }
            });
        },

        checkBrowser : function () {
            var base = this,
                translate3D = "translate3d(0px, 0px, 0px)",
                tempElem = document.createElement("div"),
                regex,
                asSupport,
                support3d,
                isTouch;

            tempElem.style.cssText = "  -moz-transform:" + translate3D +
                                  "; -ms-transform:"     + translate3D +
                                  "; -o-transform:"      + translate3D +
                                  "; -webkit-transform:" + translate3D +
                                  "; transform:"         + translate3D;
            regex = /translate3d\(0px, 0px, 0px\)/g;
            asSupport = tempElem.style.cssText.match(regex);
            support3d = (asSupport !== null && asSupport.length === 1);

            isTouch = "ontouchstart" in window || window.navigator.msMaxTouchPoints;

            base.browser = {
                "support3d" : support3d,
                "isTouch" : isTouch
            };
        },

        moveEvents : function () {
            var base = this;
            if (base.options.mouseDrag !== false || base.options.touchDrag !== false) {
                base.gestures();
                base.disabledEvents();
            }
        },

        eventTypes : function () {
            var base = this,
                types = ["s", "e", "x"];

            base.ev_types = {};

            if (base.options.mouseDrag === true && base.options.touchDrag === true) {
                types = [
                    "touchstart.owl mousedown.owl",
                    "touchmove.owl mousemove.owl",
                    "touchend.owl touchcancel.owl mouseup.owl"
                ];
            } else if (base.options.mouseDrag === false && base.options.touchDrag === true) {
                types = [
                    "touchstart.owl",
                    "touchmove.owl",
                    "touchend.owl touchcancel.owl"
                ];
            } else if (base.options.mouseDrag === true && base.options.touchDrag === false) {
                types = [
                    "mousedown.owl",
                    "mousemove.owl",
                    "mouseup.owl"
                ];
            }

            base.ev_types.start = types[0];
            base.ev_types.move = types[1];
            base.ev_types.end = types[2];
        },

        disabledEvents :  function () {
            var base = this;
            base.$elem.on("dragstart.owl", function (event) { event.preventDefault(); });
            base.$elem.on("mousedown.disableTextSelect", function (e) {
                return $(e.target).is('input, textarea, select, option');
            });
        },

        gestures : function () {
            /*jslint unparam: true*/
            var base = this,
                locals = {
                    offsetX : 0,
                    offsetY : 0,
                    baseElWidth : 0,
                    relativePos : 0,
                    position: null,
                    minSwipe : null,
                    maxSwipe: null,
                    sliding : null,
                    dargging: null,
                    targetElement : null
                };

            base.isCssFinish = true;

            function getTouches(event) {
                if (event.touches !== undefined) {
                    return {
                        x : event.touches[0].pageX,
                        y : event.touches[0].pageY
                    };
                }

                if (event.touches === undefined) {
                    if (event.pageX !== undefined) {
                        return {
                            x : event.pageX,
                            y : event.pageY
                        };
                    }
                    if (event.pageX === undefined) {
                        return {
                            x : event.clientX,
                            y : event.clientY
                        };
                    }
                }
            }

            function swapEvents(type) {
                if (type === "on") {
                    $(document).on(base.ev_types.move, dragMove);
                    $(document).on(base.ev_types.end, dragEnd);
                } else if (type === "off") {
                    $(document).off(base.ev_types.move);
                    $(document).off(base.ev_types.end);
                }
            }

            function dragStart(event) {
                var ev = event.originalEvent || event || window.event,
                    position;

                if (ev.which === 3) {
                    return false;
                }
                if (base.itemsAmount <= base.options.items) {
                    return;
                }
                if (base.isCssFinish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }
                if (base.isCss3Finish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }

                if (base.options.autoPlay !== false) {
                    window.clearInterval(base.autoPlayInterval);
                }

                if (base.browser.isTouch !== true && !base.$owlWrapper.hasClass("grabbing")) {
                    base.$owlWrapper.addClass("grabbing");
                }

                base.newPosX = 0;
                base.newRelativeX = 0;

                $(this).css(base.removeTransition());

                position = $(this).position();
                locals.relativePos = position.left;

                locals.offsetX = getTouches(ev).x - position.left;
                locals.offsetY = getTouches(ev).y - position.top;

                swapEvents("on");

                locals.sliding = false;
                locals.targetElement = ev.target || ev.srcElement;
            }

            function dragMove(event) {
                var ev = event.originalEvent || event || window.event,
                    minSwipe,
                    maxSwipe;

                base.newPosX = getTouches(ev).x - locals.offsetX;
                base.newPosY = getTouches(ev).y - locals.offsetY;
                base.newRelativeX = base.newPosX - locals.relativePos;

                if (typeof base.options.startDragging === "function" && locals.dragging !== true && base.newRelativeX !== 0) {
                    locals.dragging = true;
                    base.options.startDragging.apply(base, [base.$elem]);
                }

                if ((base.newRelativeX > 8 || base.newRelativeX < -8) && (base.browser.isTouch === true)) {
                    if (ev.preventDefault !== undefined) {
                        ev.preventDefault();
                    } else {
                        ev.returnValue = false;
                    }
                    locals.sliding = true;
                }

                if ((base.newPosY > 10 || base.newPosY < -10) && locals.sliding === false) {
                    $(document).off("touchmove.owl");
                }

                minSwipe = function () {
                    return base.newRelativeX / 5;
                };

                maxSwipe = function () {
                    return base.maximumPixels + base.newRelativeX / 5;
                };

                base.newPosX = Math.max(Math.min(base.newPosX, minSwipe()), maxSwipe());
                if (base.browser.support3d === true) {
                    base.transition3d(base.newPosX);
                } else {
                    base.css2move(base.newPosX);
                }
            }

            function dragEnd(event) {
                var ev = event.originalEvent || event || window.event,
                    newPosition,
                    handlers,
                    owlStopEvent;

                ev.target = ev.target || ev.srcElement;

                locals.dragging = false;

                if (base.browser.isTouch !== true) {
                    base.$owlWrapper.removeClass("grabbing");
                }

                if (base.newRelativeX < 0) {
                    base.dragDirection = base.owl.dragDirection = "left";
                } else {
                    base.dragDirection = base.owl.dragDirection = "right";
                }

                if (base.newRelativeX !== 0) {
                    newPosition = base.getNewPosition();
                    base.goTo(newPosition, false, "drag");
                    if (locals.targetElement === ev.target && base.browser.isTouch !== true) {
                        $(ev.target).on("click.disable", function (ev) {
                            ev.stopImmediatePropagation();
                            ev.stopPropagation();
                            ev.preventDefault();
                            $(ev.target).off("click.disable");
                        });
                        handlers = $._data(ev.target, "events").click;
                        owlStopEvent = handlers.pop();
                        handlers.splice(0, 0, owlStopEvent);
                    }
                }
                swapEvents("off");
            }
            base.$elem.on(base.ev_types.start, ".owl-wrapper", dragStart);
        },

        getNewPosition : function () {
            var base = this,
                newPosition = base.closestItem();

            if (newPosition > base.maximumItem) {
                base.currentItem = base.maximumItem;
                newPosition  = base.maximumItem;
            } else if (base.newPosX >= 0) {
                newPosition = 0;
                base.currentItem = 0;
            }
            return newPosition;
        },
        closestItem : function () {
            var base = this,
                array = base.options.scrollPerPage === true ? base.pagesInArray : base.positionsInArray,
                goal = base.newPosX,
                closest = null;

            $.each(array, function (i, v) {
                if (goal - (base.itemWidth / 20) > array[i + 1] && goal - (base.itemWidth / 20) < v && base.moveDirection() === "left") {
                    closest = v;
                    if (base.options.scrollPerPage === true) {
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        base.currentItem = i;
                    }
                } else if (goal + (base.itemWidth / 20) < v && goal + (base.itemWidth / 20) > (array[i + 1] || array[i] - base.itemWidth) && base.moveDirection() === "right") {
                    if (base.options.scrollPerPage === true) {
                        closest = array[i + 1] || array[array.length - 1];
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        closest = array[i + 1];
                        base.currentItem = i + 1;
                    }
                }
            });
            return base.currentItem;
        },

        moveDirection : function () {
            var base = this,
                direction;
            if (base.newRelativeX < 0) {
                direction = "right";
                base.playDirection = "next";
            } else {
                direction = "left";
                base.playDirection = "prev";
            }
            return direction;
        },

        customEvents : function () {
            /*jslint unparam: true*/
            var base = this;
            base.$elem.on("owl.next", function () {
                base.next();
            });
            base.$elem.on("owl.prev", function () {
                base.prev();
            });
            base.$elem.on("owl.play", function (event, speed) {
                base.options.autoPlay = speed;
                base.play();
                base.hoverStatus = "play";
            });
            base.$elem.on("owl.stop", function () {
                base.stop();
                base.hoverStatus = "stop";
            });
            base.$elem.on("owl.goTo", function (event, item) {
                base.goTo(item);
            });
            base.$elem.on("owl.jumpTo", function (event, item) {
                base.jumpTo(item);
            });
        },

        stopOnHover : function () {
            var base = this;
            if (base.options.stopOnHover === true && base.browser.isTouch !== true && base.options.autoPlay !== false) {
                base.$elem.on("mouseover", function () {
                    base.stop();
                });
                base.$elem.on("mouseout", function () {
                    if (base.hoverStatus !== "stop") {
                        base.play();
                    }
                });
            }
        },

        lazyLoad : function () {
            var base = this,
                i,
                $item,
                itemNumber,
                $lazyImg,
                follow;

            if (base.options.lazyLoad === false) {
                return false;
            }
            for (i = 0; i < base.itemsAmount; i += 1) {
                $item = $(base.$owlItems[i]);

                if ($item.data("owl-loaded") === "loaded") {
                    continue;
                }

                itemNumber = $item.data("owl-item");
                $lazyImg = $item.find(".lazyOwl");

                if (typeof $lazyImg.data("src") !== "string") {
                    $item.data("owl-loaded", "loaded");
                    continue;
                }
                if ($item.data("owl-loaded") === undefined) {
                    $lazyImg.hide();
                    $item.addClass("loading").data("owl-loaded", "checked");
                }
                if (base.options.lazyFollow === true) {
                    follow = itemNumber >= base.currentItem;
                } else {
                    follow = true;
                }
                if (follow && itemNumber < base.currentItem + base.options.items && $lazyImg.length) {
                    base.lazyPreload($item, $lazyImg);
                }
            }
        },

        lazyPreload : function ($item, $lazyImg) {
            var base = this,
                iterations = 0,
                isBackgroundImg;

            if ($lazyImg.prop("tagName") === "DIV") {
                $lazyImg.css("background-image", "url(" + $lazyImg.data("src") + ")");
                isBackgroundImg = true;
            } else {
                $lazyImg[0].src = $lazyImg.data("src");
            }

            function showImage() {
                $item.data("owl-loaded", "loaded").removeClass("loading");
                $lazyImg.removeAttr("data-src");
                if (base.options.lazyEffect === "fade") {
                    $lazyImg.fadeIn(400);
                } else {
                    $lazyImg.show();
                }
                if (typeof base.options.afterLazyLoad === "function") {
                    base.options.afterLazyLoad.apply(this, [base.$elem]);
                }
            }

            function checkLazyImage() {
                iterations += 1;
                if (base.completeImg($lazyImg.get(0)) || isBackgroundImg === true) {
                    showImage();
                } else if (iterations <= 100) {//if image loads in less than 10 seconds 
                    window.setTimeout(checkLazyImage, 100);
                } else {
                    showImage();
                }
            }

            checkLazyImage();
        },

        autoHeight : function () {
            var base = this,
                $currentimg = $(base.$owlItems[base.currentItem]).find("img"),
                iterations;

            function addHeight() {
                var $currentItem = $(base.$owlItems[base.currentItem]).height();
                base.wrapperOuter.css("height", $currentItem + "px");
                if (!base.wrapperOuter.hasClass("autoHeight")) {
                    window.setTimeout(function () {
                        base.wrapperOuter.addClass("autoHeight");
                    }, 0);
                }
            }

            function checkImage() {
                iterations += 1;
                if (base.completeImg($currentimg.get(0))) {
                    addHeight();
                } else if (iterations <= 100) { //if image loads in less than 10 seconds 
                    window.setTimeout(checkImage, 100);
                } else {
                    base.wrapperOuter.css("height", ""); //Else remove height attribute
                }
            }

            if ($currentimg.get(0) !== undefined) {
                iterations = 0;
                checkImage();
            } else {
                addHeight();
            }
        },

        completeImg : function (img) {
            var naturalWidthType;

            if (!img.complete) {
                return false;
            }
            naturalWidthType = typeof img.naturalWidth;
            if (naturalWidthType !== "undefined" && img.naturalWidth === 0) {
                return false;
            }
            return true;
        },

        onVisibleItems : function () {
            var base = this,
                i;

            if (base.options.addClassActive === true) {
                base.$owlItems.removeClass("active");
            }
            base.visibleItems = [];
            for (i = base.currentItem; i < base.currentItem + base.options.items; i += 1) {
                base.visibleItems.push(i);

                if (base.options.addClassActive === true) {
                    $(base.$owlItems[i]).addClass("active");
                }
            }
            base.owl.visibleItems = base.visibleItems;
        },

        transitionTypes : function (className) {
            var base = this;
            //Currently available: "fade", "backSlide", "goDown", "fadeUp"
            base.outClass = "owl-" + className + "-out";
            base.inClass = "owl-" + className + "-in";
        },

        singleItemTransition : function () {
            var base = this,
                outClass = base.outClass,
                inClass = base.inClass,
                $currentItem = base.$owlItems.eq(base.currentItem),
                $prevItem = base.$owlItems.eq(base.prevItem),
                prevPos = Math.abs(base.positionsInArray[base.currentItem]) + base.positionsInArray[base.prevItem],
                origin = Math.abs(base.positionsInArray[base.currentItem]) + base.itemWidth / 2,
                animEnd = 'webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend';

            base.isTransition = true;

            base.$owlWrapper
                .addClass('owl-origin')
                .css({
                    "-webkit-transform-origin" : origin + "px",
                    "-moz-perspective-origin" : origin + "px",
                    "perspective-origin" : origin + "px"
                });
            function transStyles(prevPos) {
                return {
                    "position" : "relative",
                    "left" : prevPos + "px"
                };
            }

            $prevItem
                .css(transStyles(prevPos, 10))
                .addClass(outClass)
                .on(animEnd, function () {
                    base.endPrev = true;
                    $prevItem.off(animEnd);
                    base.clearTransStyle($prevItem, outClass);
                });

            $currentItem
                .addClass(inClass)
                .on(animEnd, function () {
                    base.endCurrent = true;
                    $currentItem.off(animEnd);
                    base.clearTransStyle($currentItem, inClass);
                });
        },

        clearTransStyle : function (item, classToRemove) {
            var base = this;
            item.css({
                "position" : "",
                "left" : ""
            }).removeClass(classToRemove);

            if (base.endPrev && base.endCurrent) {
                base.$owlWrapper.removeClass('owl-origin');
                base.endPrev = false;
                base.endCurrent = false;
                base.isTransition = false;
            }
        },

        owlStatus : function () {
            var base = this;
            base.owl = {
                "userOptions"   : base.userOptions,
                "baseElement"   : base.$elem,
                "userItems"     : base.$userItems,
                "owlItems"      : base.$owlItems,
                "currentItem"   : base.currentItem,
                "prevItem"      : base.prevItem,
                "visibleItems"  : base.visibleItems,
                "isTouch"       : base.browser.isTouch,
                "browser"       : base.browser,
                "dragDirection" : base.dragDirection
            };
        },

        clearEvents : function () {
            var base = this;
            base.$elem.off(".owl owl mousedown.disableTextSelect");
            $(document).off(".owl owl");
            $(window).off("resize", base.resizer);
        },

        unWrap : function () {
            var base = this;
            if (base.$elem.children().length !== 0) {
                base.$owlWrapper.unwrap();
                base.$userItems.unwrap().unwrap();
                if (base.owlControls) {
                    base.owlControls.remove();
                }
            }
            base.clearEvents();
            base.$elem
                .attr("style", base.$elem.data("owl-originalStyles") || "")
                .attr("class", base.$elem.data("owl-originalClasses"));
        },

        destroy : function () {
            var base = this;
            base.stop();
            window.clearInterval(base.checkVisible);
            base.unWrap();
            base.$elem.removeData();
        },

        reinit : function (newOptions) {
            var base = this,
                options = $.extend({}, base.userOptions, newOptions);
            base.unWrap();
            base.init(options, base.$elem);
        },

        addItem : function (htmlString, targetPosition) {
            var base = this,
                position;

            if (!htmlString) {return false; }

            if (base.$elem.children().length === 0) {
                base.$elem.append(htmlString);
                base.setVars();
                return false;
            }
            base.unWrap();
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }
            if (position >= base.$userItems.length || position === -1) {
                base.$userItems.eq(-1).after(htmlString);
            } else {
                base.$userItems.eq(position).before(htmlString);
            }

            base.setVars();
        },

        removeItem : function (targetPosition) {
            var base = this,
                position;

            if (base.$elem.children().length === 0) {
                return false;
            }
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }

            base.unWrap();
            base.$userItems.eq(position).remove();
            base.setVars();
        }

    };

    $.fn.owlCarousel = function (options) {
        return this.each(function () {
            if ($(this).data("owl-init") === true) {
                return false;
            }
            $(this).data("owl-init", true);
            var carousel = Object.create(Carousel);
            carousel.init(options, this);
            $.data(this, "owlCarousel", carousel);
        });
    };

    $.fn.owlCarousel.options = {

        items : 5,
        itemsCustom : false,
        itemsDesktop : [1199, 4],
        itemsDesktopSmall : [979, 3],
        itemsTablet : [768, 2],
        itemsTabletSmall : false,
        itemsMobile : [479, 1],
        singleItem : false,
        itemsScaleUp : false,

        slideSpeed : 200,
        paginationSpeed : 800,
        rewindSpeed : 1000,

        autoPlay : false,
        stopOnHover : false,

        navigation : false,
        navigationText : ["prev", "next"],
        rewindNav : true,
        scrollPerPage : false,

        pagination : true,
        paginationNumbers : false,

        responsive : true,
        responsiveRefreshRate : 200,
        responsiveBaseWidth : window,

        baseClass : "owl-carousel",
        theme : "owl-theme",

        lazyLoad : false,
        lazyFollow : true,
        lazyEffect : "fade",

        autoHeight : false,

        jsonPath : false,
        jsonSuccess : false,

        dragBeforeAnimFinish : true,
        mouseDrag : true,
        touchDrag : true,

        addClassActive : false,
        transitionStyle : false,

        beforeUpdate : false,
        afterUpdate : false,
        beforeInit : false,
        afterInit : false,
        beforeMove : false,
        afterMove : false,
        afterAction : false,
        startDragging : false,
        afterLazyLoad: false
    };
}(jQuery, window, document));;
(function ($) {
    if(typeof $.fn.each2 == "undefined") {
        $.extend($.fn, {
            /*
            * 4-10 times faster .each replacement
            * use it carefully, as it overrides jQuery context of element on each iteration
            */
            each2 : function (c) {
                var j = $([0]), i = -1, l = this.length;
                while (
                    ++i < l
                    && (j.context = j[0] = this[i])
                    && c.call(j[0], i, j) !== false //"this"=DOM, i=index, j=jQuery object
                );
                return this;
            }
        });
    }
})(jQuery);

(function ($, undefined) {
    "use strict";
    /*global document, window, jQuery, console */

    if (window.Select2 !== undefined) {
        return;
    }

    var KEY, AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer,
        lastMousePosition={x:0,y:0}, $document, scrollBarDimensions,

    KEY = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        HOME: 36,
        END: 35,
        BACKSPACE: 8,
        DELETE: 46,
        isArrow: function (k) {
            k = k.which ? k.which : k;
            switch (k) {
            case KEY.LEFT:
            case KEY.RIGHT:
            case KEY.UP:
            case KEY.DOWN:
                return true;
            }
            return false;
        },
        isControl: function (e) {
            var k = e.which;
            switch (k) {
            case KEY.SHIFT:
            case KEY.CTRL:
            case KEY.ALT:
                return true;
            }

            if (e.metaKey) return true;

            return false;
        },
        isFunctionKey: function (k) {
            k = k.which ? k.which : k;
            return k >= 112 && k <= 123;
        }
    },
    MEASURE_SCROLLBAR_TEMPLATE = "<div class='select2-measure-scrollbar'></div>",

    DIACRITICS = {"\u24B6":"A","\uFF21":"A","\u00C0":"A","\u00C1":"A","\u00C2":"A","\u1EA6":"A","\u1EA4":"A","\u1EAA":"A","\u1EA8":"A","\u00C3":"A","\u0100":"A","\u0102":"A","\u1EB0":"A","\u1EAE":"A","\u1EB4":"A","\u1EB2":"A","\u0226":"A","\u01E0":"A","\u00C4":"A","\u01DE":"A","\u1EA2":"A","\u00C5":"A","\u01FA":"A","\u01CD":"A","\u0200":"A","\u0202":"A","\u1EA0":"A","\u1EAC":"A","\u1EB6":"A","\u1E00":"A","\u0104":"A","\u023A":"A","\u2C6F":"A","\uA732":"AA","\u00C6":"AE","\u01FC":"AE","\u01E2":"AE","\uA734":"AO","\uA736":"AU","\uA738":"AV","\uA73A":"AV","\uA73C":"AY","\u24B7":"B","\uFF22":"B","\u1E02":"B","\u1E04":"B","\u1E06":"B","\u0243":"B","\u0182":"B","\u0181":"B","\u24B8":"C","\uFF23":"C","\u0106":"C","\u0108":"C","\u010A":"C","\u010C":"C","\u00C7":"C","\u1E08":"C","\u0187":"C","\u023B":"C","\uA73E":"C","\u24B9":"D","\uFF24":"D","\u1E0A":"D","\u010E":"D","\u1E0C":"D","\u1E10":"D","\u1E12":"D","\u1E0E":"D","\u0110":"D","\u018B":"D","\u018A":"D","\u0189":"D","\uA779":"D","\u01F1":"DZ","\u01C4":"DZ","\u01F2":"Dz","\u01C5":"Dz","\u24BA":"E","\uFF25":"E","\u00C8":"E","\u00C9":"E","\u00CA":"E","\u1EC0":"E","\u1EBE":"E","\u1EC4":"E","\u1EC2":"E","\u1EBC":"E","\u0112":"E","\u1E14":"E","\u1E16":"E","\u0114":"E","\u0116":"E","\u00CB":"E","\u1EBA":"E","\u011A":"E","\u0204":"E","\u0206":"E","\u1EB8":"E","\u1EC6":"E","\u0228":"E","\u1E1C":"E","\u0118":"E","\u1E18":"E","\u1E1A":"E","\u0190":"E","\u018E":"E","\u24BB":"F","\uFF26":"F","\u1E1E":"F","\u0191":"F","\uA77B":"F","\u24BC":"G","\uFF27":"G","\u01F4":"G","\u011C":"G","\u1E20":"G","\u011E":"G","\u0120":"G","\u01E6":"G","\u0122":"G","\u01E4":"G","\u0193":"G","\uA7A0":"G","\uA77D":"G","\uA77E":"G","\u24BD":"H","\uFF28":"H","\u0124":"H","\u1E22":"H","\u1E26":"H","\u021E":"H","\u1E24":"H","\u1E28":"H","\u1E2A":"H","\u0126":"H","\u2C67":"H","\u2C75":"H","\uA78D":"H","\u24BE":"I","\uFF29":"I","\u00CC":"I","\u00CD":"I","\u00CE":"I","\u0128":"I","\u012A":"I","\u012C":"I","\u0130":"I","\u00CF":"I","\u1E2E":"I","\u1EC8":"I","\u01CF":"I","\u0208":"I","\u020A":"I","\u1ECA":"I","\u012E":"I","\u1E2C":"I","\u0197":"I","\u24BF":"J","\uFF2A":"J","\u0134":"J","\u0248":"J","\u24C0":"K","\uFF2B":"K","\u1E30":"K","\u01E8":"K","\u1E32":"K","\u0136":"K","\u1E34":"K","\u0198":"K","\u2C69":"K","\uA740":"K","\uA742":"K","\uA744":"K","\uA7A2":"K","\u24C1":"L","\uFF2C":"L","\u013F":"L","\u0139":"L","\u013D":"L","\u1E36":"L","\u1E38":"L","\u013B":"L","\u1E3C":"L","\u1E3A":"L","\u0141":"L","\u023D":"L","\u2C62":"L","\u2C60":"L","\uA748":"L","\uA746":"L","\uA780":"L","\u01C7":"LJ","\u01C8":"Lj","\u24C2":"M","\uFF2D":"M","\u1E3E":"M","\u1E40":"M","\u1E42":"M","\u2C6E":"M","\u019C":"M","\u24C3":"N","\uFF2E":"N","\u01F8":"N","\u0143":"N","\u00D1":"N","\u1E44":"N","\u0147":"N","\u1E46":"N","\u0145":"N","\u1E4A":"N","\u1E48":"N","\u0220":"N","\u019D":"N","\uA790":"N","\uA7A4":"N","\u01CA":"NJ","\u01CB":"Nj","\u24C4":"O","\uFF2F":"O","\u00D2":"O","\u00D3":"O","\u00D4":"O","\u1ED2":"O","\u1ED0":"O","\u1ED6":"O","\u1ED4":"O","\u00D5":"O","\u1E4C":"O","\u022C":"O","\u1E4E":"O","\u014C":"O","\u1E50":"O","\u1E52":"O","\u014E":"O","\u022E":"O","\u0230":"O","\u00D6":"O","\u022A":"O","\u1ECE":"O","\u0150":"O","\u01D1":"O","\u020C":"O","\u020E":"O","\u01A0":"O","\u1EDC":"O","\u1EDA":"O","\u1EE0":"O","\u1EDE":"O","\u1EE2":"O","\u1ECC":"O","\u1ED8":"O","\u01EA":"O","\u01EC":"O","\u00D8":"O","\u01FE":"O","\u0186":"O","\u019F":"O","\uA74A":"O","\uA74C":"O","\u01A2":"OI","\uA74E":"OO","\u0222":"OU","\u24C5":"P","\uFF30":"P","\u1E54":"P","\u1E56":"P","\u01A4":"P","\u2C63":"P","\uA750":"P","\uA752":"P","\uA754":"P","\u24C6":"Q","\uFF31":"Q","\uA756":"Q","\uA758":"Q","\u024A":"Q","\u24C7":"R","\uFF32":"R","\u0154":"R","\u1E58":"R","\u0158":"R","\u0210":"R","\u0212":"R","\u1E5A":"R","\u1E5C":"R","\u0156":"R","\u1E5E":"R","\u024C":"R","\u2C64":"R","\uA75A":"R","\uA7A6":"R","\uA782":"R","\u24C8":"S","\uFF33":"S","\u1E9E":"S","\u015A":"S","\u1E64":"S","\u015C":"S","\u1E60":"S","\u0160":"S","\u1E66":"S","\u1E62":"S","\u1E68":"S","\u0218":"S","\u015E":"S","\u2C7E":"S","\uA7A8":"S","\uA784":"S","\u24C9":"T","\uFF34":"T","\u1E6A":"T","\u0164":"T","\u1E6C":"T","\u021A":"T","\u0162":"T","\u1E70":"T","\u1E6E":"T","\u0166":"T","\u01AC":"T","\u01AE":"T","\u023E":"T","\uA786":"T","\uA728":"TZ","\u24CA":"U","\uFF35":"U","\u00D9":"U","\u00DA":"U","\u00DB":"U","\u0168":"U","\u1E78":"U","\u016A":"U","\u1E7A":"U","\u016C":"U","\u00DC":"U","\u01DB":"U","\u01D7":"U","\u01D5":"U","\u01D9":"U","\u1EE6":"U","\u016E":"U","\u0170":"U","\u01D3":"U","\u0214":"U","\u0216":"U","\u01AF":"U","\u1EEA":"U","\u1EE8":"U","\u1EEE":"U","\u1EEC":"U","\u1EF0":"U","\u1EE4":"U","\u1E72":"U","\u0172":"U","\u1E76":"U","\u1E74":"U","\u0244":"U","\u24CB":"V","\uFF36":"V","\u1E7C":"V","\u1E7E":"V","\u01B2":"V","\uA75E":"V","\u0245":"V","\uA760":"VY","\u24CC":"W","\uFF37":"W","\u1E80":"W","\u1E82":"W","\u0174":"W","\u1E86":"W","\u1E84":"W","\u1E88":"W","\u2C72":"W","\u24CD":"X","\uFF38":"X","\u1E8A":"X","\u1E8C":"X","\u24CE":"Y","\uFF39":"Y","\u1EF2":"Y","\u00DD":"Y","\u0176":"Y","\u1EF8":"Y","\u0232":"Y","\u1E8E":"Y","\u0178":"Y","\u1EF6":"Y","\u1EF4":"Y","\u01B3":"Y","\u024E":"Y","\u1EFE":"Y","\u24CF":"Z","\uFF3A":"Z","\u0179":"Z","\u1E90":"Z","\u017B":"Z","\u017D":"Z","\u1E92":"Z","\u1E94":"Z","\u01B5":"Z","\u0224":"Z","\u2C7F":"Z","\u2C6B":"Z","\uA762":"Z","\u24D0":"a","\uFF41":"a","\u1E9A":"a","\u00E0":"a","\u00E1":"a","\u00E2":"a","\u1EA7":"a","\u1EA5":"a","\u1EAB":"a","\u1EA9":"a","\u00E3":"a","\u0101":"a","\u0103":"a","\u1EB1":"a","\u1EAF":"a","\u1EB5":"a","\u1EB3":"a","\u0227":"a","\u01E1":"a","\u00E4":"a","\u01DF":"a","\u1EA3":"a","\u00E5":"a","\u01FB":"a","\u01CE":"a","\u0201":"a","\u0203":"a","\u1EA1":"a","\u1EAD":"a","\u1EB7":"a","\u1E01":"a","\u0105":"a","\u2C65":"a","\u0250":"a","\uA733":"aa","\u00E6":"ae","\u01FD":"ae","\u01E3":"ae","\uA735":"ao","\uA737":"au","\uA739":"av","\uA73B":"av","\uA73D":"ay","\u24D1":"b","\uFF42":"b","\u1E03":"b","\u1E05":"b","\u1E07":"b","\u0180":"b","\u0183":"b","\u0253":"b","\u24D2":"c","\uFF43":"c","\u0107":"c","\u0109":"c","\u010B":"c","\u010D":"c","\u00E7":"c","\u1E09":"c","\u0188":"c","\u023C":"c","\uA73F":"c","\u2184":"c","\u24D3":"d","\uFF44":"d","\u1E0B":"d","\u010F":"d","\u1E0D":"d","\u1E11":"d","\u1E13":"d","\u1E0F":"d","\u0111":"d","\u018C":"d","\u0256":"d","\u0257":"d","\uA77A":"d","\u01F3":"dz","\u01C6":"dz","\u24D4":"e","\uFF45":"e","\u00E8":"e","\u00E9":"e","\u00EA":"e","\u1EC1":"e","\u1EBF":"e","\u1EC5":"e","\u1EC3":"e","\u1EBD":"e","\u0113":"e","\u1E15":"e","\u1E17":"e","\u0115":"e","\u0117":"e","\u00EB":"e","\u1EBB":"e","\u011B":"e","\u0205":"e","\u0207":"e","\u1EB9":"e","\u1EC7":"e","\u0229":"e","\u1E1D":"e","\u0119":"e","\u1E19":"e","\u1E1B":"e","\u0247":"e","\u025B":"e","\u01DD":"e","\u24D5":"f","\uFF46":"f","\u1E1F":"f","\u0192":"f","\uA77C":"f","\u24D6":"g","\uFF47":"g","\u01F5":"g","\u011D":"g","\u1E21":"g","\u011F":"g","\u0121":"g","\u01E7":"g","\u0123":"g","\u01E5":"g","\u0260":"g","\uA7A1":"g","\u1D79":"g","\uA77F":"g","\u24D7":"h","\uFF48":"h","\u0125":"h","\u1E23":"h","\u1E27":"h","\u021F":"h","\u1E25":"h","\u1E29":"h","\u1E2B":"h","\u1E96":"h","\u0127":"h","\u2C68":"h","\u2C76":"h","\u0265":"h","\u0195":"hv","\u24D8":"i","\uFF49":"i","\u00EC":"i","\u00ED":"i","\u00EE":"i","\u0129":"i","\u012B":"i","\u012D":"i","\u00EF":"i","\u1E2F":"i","\u1EC9":"i","\u01D0":"i","\u0209":"i","\u020B":"i","\u1ECB":"i","\u012F":"i","\u1E2D":"i","\u0268":"i","\u0131":"i","\u24D9":"j","\uFF4A":"j","\u0135":"j","\u01F0":"j","\u0249":"j","\u24DA":"k","\uFF4B":"k","\u1E31":"k","\u01E9":"k","\u1E33":"k","\u0137":"k","\u1E35":"k","\u0199":"k","\u2C6A":"k","\uA741":"k","\uA743":"k","\uA745":"k","\uA7A3":"k","\u24DB":"l","\uFF4C":"l","\u0140":"l","\u013A":"l","\u013E":"l","\u1E37":"l","\u1E39":"l","\u013C":"l","\u1E3D":"l","\u1E3B":"l","\u017F":"l","\u0142":"l","\u019A":"l","\u026B":"l","\u2C61":"l","\uA749":"l","\uA781":"l","\uA747":"l","\u01C9":"lj","\u24DC":"m","\uFF4D":"m","\u1E3F":"m","\u1E41":"m","\u1E43":"m","\u0271":"m","\u026F":"m","\u24DD":"n","\uFF4E":"n","\u01F9":"n","\u0144":"n","\u00F1":"n","\u1E45":"n","\u0148":"n","\u1E47":"n","\u0146":"n","\u1E4B":"n","\u1E49":"n","\u019E":"n","\u0272":"n","\u0149":"n","\uA791":"n","\uA7A5":"n","\u01CC":"nj","\u24DE":"o","\uFF4F":"o","\u00F2":"o","\u00F3":"o","\u00F4":"o","\u1ED3":"o","\u1ED1":"o","\u1ED7":"o","\u1ED5":"o","\u00F5":"o","\u1E4D":"o","\u022D":"o","\u1E4F":"o","\u014D":"o","\u1E51":"o","\u1E53":"o","\u014F":"o","\u022F":"o","\u0231":"o","\u00F6":"o","\u022B":"o","\u1ECF":"o","\u0151":"o","\u01D2":"o","\u020D":"o","\u020F":"o","\u01A1":"o","\u1EDD":"o","\u1EDB":"o","\u1EE1":"o","\u1EDF":"o","\u1EE3":"o","\u1ECD":"o","\u1ED9":"o","\u01EB":"o","\u01ED":"o","\u00F8":"o","\u01FF":"o","\u0254":"o","\uA74B":"o","\uA74D":"o","\u0275":"o","\u01A3":"oi","\u0223":"ou","\uA74F":"oo","\u24DF":"p","\uFF50":"p","\u1E55":"p","\u1E57":"p","\u01A5":"p","\u1D7D":"p","\uA751":"p","\uA753":"p","\uA755":"p","\u24E0":"q","\uFF51":"q","\u024B":"q","\uA757":"q","\uA759":"q","\u24E1":"r","\uFF52":"r","\u0155":"r","\u1E59":"r","\u0159":"r","\u0211":"r","\u0213":"r","\u1E5B":"r","\u1E5D":"r","\u0157":"r","\u1E5F":"r","\u024D":"r","\u027D":"r","\uA75B":"r","\uA7A7":"r","\uA783":"r","\u24E2":"s","\uFF53":"s","\u00DF":"s","\u015B":"s","\u1E65":"s","\u015D":"s","\u1E61":"s","\u0161":"s","\u1E67":"s","\u1E63":"s","\u1E69":"s","\u0219":"s","\u015F":"s","\u023F":"s","\uA7A9":"s","\uA785":"s","\u1E9B":"s","\u24E3":"t","\uFF54":"t","\u1E6B":"t","\u1E97":"t","\u0165":"t","\u1E6D":"t","\u021B":"t","\u0163":"t","\u1E71":"t","\u1E6F":"t","\u0167":"t","\u01AD":"t","\u0288":"t","\u2C66":"t","\uA787":"t","\uA729":"tz","\u24E4":"u","\uFF55":"u","\u00F9":"u","\u00FA":"u","\u00FB":"u","\u0169":"u","\u1E79":"u","\u016B":"u","\u1E7B":"u","\u016D":"u","\u00FC":"u","\u01DC":"u","\u01D8":"u","\u01D6":"u","\u01DA":"u","\u1EE7":"u","\u016F":"u","\u0171":"u","\u01D4":"u","\u0215":"u","\u0217":"u","\u01B0":"u","\u1EEB":"u","\u1EE9":"u","\u1EEF":"u","\u1EED":"u","\u1EF1":"u","\u1EE5":"u","\u1E73":"u","\u0173":"u","\u1E77":"u","\u1E75":"u","\u0289":"u","\u24E5":"v","\uFF56":"v","\u1E7D":"v","\u1E7F":"v","\u028B":"v","\uA75F":"v","\u028C":"v","\uA761":"vy","\u24E6":"w","\uFF57":"w","\u1E81":"w","\u1E83":"w","\u0175":"w","\u1E87":"w","\u1E85":"w","\u1E98":"w","\u1E89":"w","\u2C73":"w","\u24E7":"x","\uFF58":"x","\u1E8B":"x","\u1E8D":"x","\u24E8":"y","\uFF59":"y","\u1EF3":"y","\u00FD":"y","\u0177":"y","\u1EF9":"y","\u0233":"y","\u1E8F":"y","\u00FF":"y","\u1EF7":"y","\u1E99":"y","\u1EF5":"y","\u01B4":"y","\u024F":"y","\u1EFF":"y","\u24E9":"z","\uFF5A":"z","\u017A":"z","\u1E91":"z","\u017C":"z","\u017E":"z","\u1E93":"z","\u1E95":"z","\u01B6":"z","\u0225":"z","\u0240":"z","\u2C6C":"z","\uA763":"z"};

    $document = $(document);

    nextUid=(function() { var counter=1; return function() { return counter++; }; }());


    function reinsertElement(element) {
        var placeholder = $(document.createTextNode(''));

        element.before(placeholder);
        placeholder.before(element);
        placeholder.remove();
    }

    function stripDiacritics(str) {
        // Used 'uni range + named function' from http://jsperf.com/diacritics/18
        function match(a) {
            return DIACRITICS[a] || a;
        }

        return str.replace(/[^\u0000-\u007E]/g, match);
    }

    function indexOf(value, array) {
        var i = 0, l = array.length;
        for (; i < l; i = i + 1) {
            if (equal(value, array[i])) return i;
        }
        return -1;
    }

    function measureScrollbar () {
        var $template = $( MEASURE_SCROLLBAR_TEMPLATE );
        $template.appendTo('body');

        var dim = {
            width: $template.width() - $template[0].clientWidth,
            height: $template.height() - $template[0].clientHeight
        };
        $template.remove();

        return dim;
    }

    /**
     * Compares equality of a and b
     * @param a
     * @param b
     */
    function equal(a, b) {
        if (a === b) return true;
        if (a === undefined || b === undefined) return false;
        if (a === null || b === null) return false;
        // Check whether 'a' or 'b' is a string (primitive or object).
        // The concatenation of an empty string (+'') converts its argument to a string's primitive.
        if (a.constructor === String) return a+'' === b+''; // a+'' - in case 'a' is a String object
        if (b.constructor === String) return b+'' === a+''; // b+'' - in case 'b' is a String object
        return false;
    }

    /**
     * Splits the string into an array of values, trimming each value. An empty array is returned for nulls or empty
     * strings
     * @param string
     * @param separator
     */
    function splitVal(string, separator) {
        var val, i, l;
        if (string === null || string.length < 1) return [];
        val = string.split(separator);
        for (i = 0, l = val.length; i < l; i = i + 1) val[i] = $.trim(val[i]);
        return val;
    }

    function getSideBorderPadding(element) {
        return element.outerWidth(false) - element.width();
    }

    function installKeyUpChangeEvent(element) {
        var key="keyup-change-value";
        element.on("keydown", function () {
            if ($.data(element, key) === undefined) {
                $.data(element, key, element.val());
            }
        });
        element.on("keyup", function () {
            var val= $.data(element, key);
            if (val !== undefined && element.val() !== val) {
                $.removeData(element, key);
                element.trigger("keyup-change");
            }
        });
    }

    $document.on("mousemove", function (e) {
        lastMousePosition.x = e.pageX;
        lastMousePosition.y = e.pageY;
    });

    /**
     * filters mouse events so an event is fired only if the mouse moved.
     *
     * filters out mouse events that occur when mouse is stationary but
     * the elements under the pointer are scrolled.
     */
    function installFilteredMouseMove(element) {
        element.on("mousemove", function (e) {
            var lastpos = lastMousePosition;
            if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
                $(e.target).trigger("mousemove-filtered", e);
            }
        });
    }

    /**
     * Debounces a function. Returns a function that calls the original fn function only if no invocations have been made
     * within the last quietMillis milliseconds.
     *
     * @param quietMillis number of milliseconds to wait before invoking fn
     * @param fn function to be debounced
     * @param ctx object to be used as this reference within fn
     * @return debounced version of fn
     */
    function debounce(quietMillis, fn, ctx) {
        ctx = ctx || undefined;
        var timeout;
        return function () {
            var args = arguments;
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function() {
                fn.apply(ctx, args);
            }, quietMillis);
        };
    }

    function installDebouncedScroll(threshold, element) {
        var notify = debounce(threshold, function (e) { element.trigger("scroll-debounced", e);});
        element.on("scroll", function (e) {
            if (indexOf(e.target, element.get()) >= 0) notify(e);
        });
    }

    function focus($el) {
        if ($el[0] === document.activeElement) return;

        /* set the focus in a 0 timeout - that way the focus is set after the processing
            of the current event has finished - which seems like the only reliable way
            to set focus */
        window.setTimeout(function() {
            var el=$el[0], pos=$el.val().length, range;

            $el.focus();

            /* make sure el received focus so we do not error out when trying to manipulate the caret.
                sometimes modals or others listeners may steal it after its set */
            var isVisible = (el.offsetWidth > 0 || el.offsetHeight > 0);
            if (isVisible && el === document.activeElement) {

                /* after the focus is set move the caret to the end, necessary when we val()
                    just before setting focus */
                if(el.setSelectionRange)
                {
                    el.setSelectionRange(pos, pos);
                }
                else if (el.createTextRange) {
                    range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                }
            }
        }, 0);
    }

    function getCursorInfo(el) {
        el = $(el)[0];
        var offset = 0;
        var length = 0;
        if ('selectionStart' in el) {
            offset = el.selectionStart;
            length = el.selectionEnd - offset;
        } else if ('selection' in document) {
            el.focus();
            var sel = document.selection.createRange();
            length = document.selection.createRange().text.length;
            sel.moveStart('character', -el.value.length);
            offset = sel.text.length - length;
        }
        return { offset: offset, length: length };
    }

    function killEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    function killEventImmediately(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    function measureTextWidth(e) {
        if (!sizer){
            var style = e[0].currentStyle || window.getComputedStyle(e[0], null);
            sizer = $(document.createElement("div")).css({
                position: "absolute",
                left: "-10000px",
                top: "-10000px",
                display: "none",
                fontSize: style.fontSize,
                fontFamily: style.fontFamily,
                fontStyle: style.fontStyle,
                fontWeight: style.fontWeight,
                letterSpacing: style.letterSpacing,
                textTransform: style.textTransform,
                whiteSpace: "nowrap"
            });
            sizer.attr("class","select2-sizer");
            $("body").append(sizer);
        }
        sizer.text(e.val());
        return sizer.width();
    }

    function syncCssClasses(dest, src, adapter) {
        var classes, replacements = [], adapted;

        classes = dest.attr("class");
        if (classes) {
            classes = '' + classes; // for IE which returns object
            $(classes.split(" ")).each2(function() {
                if (this.indexOf("select2-") === 0) {
                    replacements.push(this);
                }
            });
        }
        classes = src.attr("class");
        if (classes) {
            classes = '' + classes; // for IE which returns object
            $(classes.split(" ")).each2(function() {
                if (this.indexOf("select2-") !== 0) {
                    adapted = adapter(this);
                    if (adapted) {
                        replacements.push(adapted);
                    }
                }
            });
        }
        dest.attr("class", replacements.join(" "));
    }


    function markMatch(text, term, markup, escapeMarkup) {
        var match=stripDiacritics(text.toUpperCase()).indexOf(stripDiacritics(term.toUpperCase())),
            tl=term.length;

        if (match<0) {
            markup.push(escapeMarkup(text));
            return;
        }

        markup.push(escapeMarkup(text.substring(0, match)));
        markup.push("<span class='select2-match'>");
        markup.push(escapeMarkup(text.substring(match, match + tl)));
        markup.push("</span>");
        markup.push(escapeMarkup(text.substring(match + tl, text.length)));
    }

    function defaultEscapeMarkup(markup) {
        var replace_map = {
            '\\': '&#92;',
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#47;'
        };

        return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
            return replace_map[match];
        });
    }

    /**
     * Produces an ajax-based query function
     *
     * @param options object containing configuration parameters
     * @param options.params parameter map for the transport ajax call, can contain such options as cache, jsonpCallback, etc. see $.ajax
     * @param options.transport function that will be used to execute the ajax request. must be compatible with parameters supported by $.ajax
     * @param options.url url for the data
     * @param options.data a function(searchTerm, pageNumber, context) that should return an object containing query string parameters for the above url.
     * @param options.dataType request data type: ajax, jsonp, other datatypes supported by jQuery's $.ajax function or the transport function if specified
     * @param options.quietMillis (optional) milliseconds to wait before making the ajaxRequest, helps debounce the ajax function if invoked too often
     * @param options.results a function(remoteData, pageNumber) that converts data returned form the remote request to the format expected by Select2.
     *      The expected format is an object containing the following keys:
     *      results array of objects that will be used as choices
     *      more (optional) boolean indicating whether there are more results available
     *      Example: {results:[{id:1, text:'Red'},{id:2, text:'Blue'}], more:true}
     */
    function ajax(options) {
        var timeout, // current scheduled but not yet executed request
            handler = null,
            quietMillis = options.quietMillis || 100,
            ajaxUrl = options.url,
            self = this;

        return function (query) {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                var data = options.data, // ajax data function
                    url = ajaxUrl, // ajax url string or function
                    transport = options.transport || $.fn.select2.ajaxDefaults.transport,
                    // deprecated - to be removed in 4.0  - use params instead
                    deprecated = {
                        type: options.type || 'GET', // set type of request (GET or POST)
                        cache: options.cache || false,
                        jsonpCallback: options.jsonpCallback||undefined,
                        dataType: options.dataType||"json"
                    },
                    params = $.extend({}, $.fn.select2.ajaxDefaults.params, deprecated);

                data = data ? data.call(self, query.term, query.page, query.context) : null;
                url = (typeof url === 'function') ? url.call(self, query.term, query.page, query.context) : url;

                if (handler && typeof handler.abort === "function") { handler.abort(); }

                if (options.params) {
                    if ($.isFunction(options.params)) {
                        $.extend(params, options.params.call(self));
                    } else {
                        $.extend(params, options.params);
                    }
                }

                $.extend(params, {
                    url: url,
                    dataType: options.dataType,
                    data: data,
                    success: function (data) {
                        // TODO - replace query.page with query so users have access to term, page, etc.
                        var results = options.results(data, query.page);
                        query.callback(results);
                    }
                });
                handler = transport.call(self, params);
            }, quietMillis);
        };
    }

    /**
     * Produces a query function that works with a local array
     *
     * @param options object containing configuration parameters. The options parameter can either be an array or an
     * object.
     *
     * If the array form is used it is assumed that it contains objects with 'id' and 'text' keys.
     *
     * If the object form is used it is assumed that it contains 'data' and 'text' keys. The 'data' key should contain
     * an array of objects that will be used as choices. These objects must contain at least an 'id' key. The 'text'
     * key can either be a String in which case it is expected that each element in the 'data' array has a key with the
     * value of 'text' which will be used to match choices. Alternatively, text can be a function(item) that can extract
     * the text.
     */
    function local(options) {
        var data = options, // data elements
            dataText,
            tmp,
            text = function (item) { return ""+item.text; }; // function used to retrieve the text portion of a data item that is matched against the search

         if ($.isArray(data)) {
            tmp = data;
            data = { results: tmp };
        }

         if ($.isFunction(data) === false) {
            tmp = data;
            data = function() { return tmp; };
        }

        var dataItem = data();
        if (dataItem.text) {
            text = dataItem.text;
            // if text is not a function we assume it to be a key name
            if (!$.isFunction(text)) {
                dataText = dataItem.text; // we need to store this in a separate variable because in the next step data gets reset and data.text is no longer available
                text = function (item) { return item[dataText]; };
            }
        }

        return function (query) {
            var t = query.term, filtered = { results: [] }, process;
            if (t === "") {
                query.callback(data());
                return;
            }

            process = function(datum, collection) {
                var group, attr;
                datum = datum[0];
                if (datum.children) {
                    group = {};
                    for (attr in datum) {
                        if (datum.hasOwnProperty(attr)) group[attr]=datum[attr];
                    }
                    group.children=[];
                    $(datum.children).each2(function(i, childDatum) { process(childDatum, group.children); });
                    if (group.children.length || query.matcher(t, text(group), datum)) {
                        collection.push(group);
                    }
                } else {
                    if (query.matcher(t, text(datum), datum)) {
                        collection.push(datum);
                    }
                }
            };

            $(data().results).each2(function(i, datum) { process(datum, filtered.results); });
            query.callback(filtered);
        };
    }

    // TODO javadoc
    function tags(data) {
        var isFunc = $.isFunction(data);
        return function (query) {
            var t = query.term, filtered = {results: []};
            var result = isFunc ? data(query) : data;
            if ($.isArray(result)) {
                $(result).each(function () {
                    var isObject = this.text !== undefined,
                        text = isObject ? this.text : this;
                    if (t === "" || query.matcher(t, text)) {
                        filtered.results.push(isObject ? this : {id: this, text: this});
                    }
                });
                query.callback(filtered);
            }
        };
    }

    /**
     * Checks if the formatter function should be used.
     *
     * Throws an error if it is not a function. Returns true if it should be used,
     * false if no formatting should be performed.
     *
     * @param formatter
     */
    function checkFormatter(formatter, formatterName) {
        if ($.isFunction(formatter)) return true;
        if (!formatter) return false;
        if (typeof(formatter) === 'string') return true;
        throw new Error(formatterName +" must be a string, function, or falsy value");
    }

    function evaluate(val) {
        if ($.isFunction(val)) {
            var args = Array.prototype.slice.call(arguments, 1);
            return val.apply(null, args);
        }
        return val;
    }

    function countResults(results) {
        var count = 0;
        $.each(results, function(i, item) {
            if (item.children) {
                count += countResults(item.children);
            } else {
                count++;
            }
        });
        return count;
    }

    /**
     * Default tokenizer. This function uses breaks the input on substring match of any string from the
     * opts.tokenSeparators array and uses opts.createSearchChoice to create the choice object. Both of those
     * two options have to be defined in order for the tokenizer to work.
     *
     * @param input text user has typed so far or pasted into the search field
     * @param selection currently selected choices
     * @param selectCallback function(choice) callback tho add the choice to selection
     * @param opts select2's opts
     * @return undefined/null to leave the current input unchanged, or a string to change the input to the returned value
     */
    function defaultTokenizer(input, selection, selectCallback, opts) {
        var original = input, // store the original so we can compare and know if we need to tell the search to update its text
            dupe = false, // check for whether a token we extracted represents a duplicate selected choice
            token, // token
            index, // position at which the separator was found
            i, l, // looping variables
            separator; // the matched separator

        if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1) return undefined;

        while (true) {
            index = -1;

            for (i = 0, l = opts.tokenSeparators.length; i < l; i++) {
                separator = opts.tokenSeparators[i];
                index = input.indexOf(separator);
                if (index >= 0) break;
            }

            if (index < 0) break; // did not find any token separator in the input string, bail

            token = input.substring(0, index);
            input = input.substring(index + separator.length);

            if (token.length > 0) {
                token = opts.createSearchChoice.call(this, token, selection);
                if (token !== undefined && token !== null && opts.id(token) !== undefined && opts.id(token) !== null) {
                    dupe = false;
                    for (i = 0, l = selection.length; i < l; i++) {
                        if (equal(opts.id(token), opts.id(selection[i]))) {
                            dupe = true; break;
                        }
                    }

                    if (!dupe) selectCallback(token);
                }
            }
        }

        if (original!==input) return input;
    }

    function cleanupJQueryElements() {
        var self = this;

        Array.prototype.forEach.call(arguments, function (element) {
            self[element].remove();
            self[element] = null;
        });
    }

    /**
     * Creates a new class
     *
     * @param superClass
     * @param methods
     */
    function clazz(SuperClass, methods) {
        var constructor = function () {};
        constructor.prototype = new SuperClass;
        constructor.prototype.constructor = constructor;
        constructor.prototype.parent = SuperClass.prototype;
        constructor.prototype = $.extend(constructor.prototype, methods);
        return constructor;
    }

    AbstractSelect2 = clazz(Object, {

        // abstract
        bind: function (func) {
            var self = this;
            return function () {
                func.apply(self, arguments);
            };
        },

        // abstract
        init: function (opts) {
            var results, search, resultsSelector = ".select2-results";

            // prepare options
            this.opts = opts = this.prepareOpts(opts);

            this.id=opts.id;

            // destroy if called on an existing component
            if (opts.element.data("select2") !== undefined &&
                opts.element.data("select2") !== null) {
                opts.element.data("select2").destroy();
            }

            this.container = this.createContainer();

            this.liveRegion = $("<span>", {
                    role: "status",
                    "aria-live": "polite"
                })
                .addClass("select2-hidden-accessible")
                .appendTo(document.body);

            this.containerId="s2id_"+(opts.element.attr("id") || "autogen"+nextUid());
            this.containerEventName= this.containerId
                .replace(/([.])/g, '_')
                .replace(/([;&,\-\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
            this.container.attr("id", this.containerId);

            this.container.attr("title", opts.element.attr("title"));

            this.body = $("body");

            syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);

            this.container.attr("style", opts.element.attr("style"));
            this.container.css(evaluate(opts.containerCss));
            this.container.addClass(evaluate(opts.containerCssClass));

            this.elementTabIndex = this.opts.element.attr("tabindex");

            // swap container for the element
            this.opts.element
                .data("select2", this)
                .attr("tabindex", "-1")
                .before(this.container)
                .on("click.select2", killEvent); // do not leak click events

            this.container.data("select2", this);

            this.dropdown = this.container.find(".select2-drop");

            syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);

            this.dropdown.addClass(evaluate(opts.dropdownCssClass));
            this.dropdown.data("select2", this);
            this.dropdown.on("click", killEvent);

            this.results = results = this.container.find(resultsSelector);
            this.search = search = this.container.find("input.select2-input");

            this.queryCount = 0;
            this.resultsPage = 0;
            this.context = null;

            // initialize the container
            this.initContainer();

            this.container.on("click", killEvent);

            installFilteredMouseMove(this.results);

            this.dropdown.on("mousemove-filtered", resultsSelector, this.bind(this.highlightUnderEvent));
            this.dropdown.on("touchstart touchmove touchend", resultsSelector, this.bind(function (event) {
                this._touchEvent = true;
                this.highlightUnderEvent(event);
            }));
            this.dropdown.on("touchmove", resultsSelector, this.bind(this.touchMoved));
            this.dropdown.on("touchstart touchend", resultsSelector, this.bind(this.clearTouchMoved));

            // Waiting for a click event on touch devices to select option and hide dropdown
            // otherwise click will be triggered on an underlying element
            this.dropdown.on('click', this.bind(function (event) {
                if (this._touchEvent) {
                    this._touchEvent = false;
                    this.selectHighlighted();
                }
            }));

            installDebouncedScroll(80, this.results);
            this.dropdown.on("scroll-debounced", resultsSelector, this.bind(this.loadMoreIfNeeded));

            // do not propagate change event from the search field out of the component
            $(this.container).on("change", ".select2-input", function(e) {e.stopPropagation();});
            $(this.dropdown).on("change", ".select2-input", function(e) {e.stopPropagation();});

            // if jquery.mousewheel plugin is installed we can prevent out-of-bounds scrolling of results via mousewheel
            if ($.fn.mousewheel) {
                results.mousewheel(function (e, delta, deltaX, deltaY) {
                    var top = results.scrollTop();
                    if (deltaY > 0 && top - deltaY <= 0) {
                        results.scrollTop(0);
                        killEvent(e);
                    } else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) {
                        results.scrollTop(results.get(0).scrollHeight - results.height());
                        killEvent(e);
                    }
                });
            }

            installKeyUpChangeEvent(search);
            search.on("keyup-change input paste", this.bind(this.updateResults));
            search.on("focus", function () { search.addClass("select2-focused"); });
            search.on("blur", function () { search.removeClass("select2-focused");});

            this.dropdown.on("mouseup", resultsSelector, this.bind(function (e) {
                if ($(e.target).closest(".select2-result-selectable").length > 0) {
                    this.highlightUnderEvent(e);
                    this.selectHighlighted(e);
                }
            }));

            // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is listening
            // for mouse events outside of itself so it can close itself. since the dropdown is now outside the select2's
            // dom it will trigger the popup close, which is not what we want
            // focusin can cause focus wars between modals and select2 since the dropdown is outside the modal.
            this.dropdown.on("click mouseup mousedown touchstart touchend focusin", function (e) { e.stopPropagation(); });

            this.nextSearchTerm = undefined;

            if ($.isFunction(this.opts.initSelection)) {
                // initialize selection based on the current value of the source element
                this.initSelection();

                // if the user has provided a function that can set selection based on the value of the source element
                // we monitor the change event on the element and trigger it, allowing for two way synchronization
                this.monitorSource();
            }

            if (opts.maximumInputLength !== null) {
                this.search.attr("maxlength", opts.maximumInputLength);
            }

            var disabled = opts.element.prop("disabled");
            if (disabled === undefined) disabled = false;
            this.enable(!disabled);

            var readonly = opts.element.prop("readonly");
            if (readonly === undefined) readonly = false;
            this.readonly(readonly);

            // Calculate size of scrollbar
            scrollBarDimensions = scrollBarDimensions || measureScrollbar();

            this.autofocus = opts.element.prop("autofocus");
            opts.element.prop("autofocus", false);
            if (this.autofocus) this.focus();

            this.search.attr("placeholder", opts.searchInputPlaceholder);
        },

        // abstract
        destroy: function () {
            var element=this.opts.element, select2 = element.data("select2");

            this.close();

            if (this.propertyObserver) {
                this.propertyObserver.disconnect();
                this.propertyObserver = null;
            }

            if (select2 !== undefined) {
                select2.container.remove();
                select2.liveRegion.remove();
                select2.dropdown.remove();
                element
                    .removeClass("select2-offscreen")
                    .removeData("select2")
                    .off(".select2")
                    .prop("autofocus", this.autofocus || false);
                if (this.elementTabIndex) {
                    element.attr({tabindex: this.elementTabIndex});
                } else {
                    element.removeAttr("tabindex");
                }
                element.show();
            }

            cleanupJQueryElements.call(this,
                "container",
                "liveRegion",
                "dropdown",
                "results",
                "search"
            );
        },

        // abstract
        optionToData: function(element) {
            if (element.is("option")) {
                return {
                    id:element.prop("value"),
                    text:element.text(),
                    element: element.get(),
                    css: element.attr("class"),
                    disabled: element.prop("disabled"),
                    locked: equal(element.attr("locked"), "locked") || equal(element.data("locked"), true)
                };
            } else if (element.is("optgroup")) {
                return {
                    text:element.attr("label"),
                    children:[],
                    element: element.get(),
                    css: element.attr("class")
                };
            }
        },

        // abstract
        prepareOpts: function (opts) {
            var element, select, idKey, ajaxUrl, self = this;

            element = opts.element;

            if (element.get(0).tagName.toLowerCase() === "select") {
                this.select = select = opts.element;
            }

            if (select) {
                // these options are not allowed when attached to a select because they are picked up off the element itself
                $.each(["id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags"], function () {
                    if (this in opts) {
                        throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
                    }
                });
            }

            opts = $.extend({}, {
                populateResults: function(container, results, query) {
                    var populate, id=this.opts.id, liveRegion=this.liveRegion;

                    populate=function(results, container, depth) {

                        var i, l, result, selectable, disabled, compound, node, label, innerContainer, formatted;

                        results = opts.sortResults(results, container, query);

                        for (i = 0, l = results.length; i < l; i = i + 1) {

                            result=results[i];

                            disabled = (result.disabled === true);
                            selectable = (!disabled) && (id(result) !== undefined);

                            compound=result.children && result.children.length > 0;

                            node=$("<li></li>");
                            node.addClass("select2-results-dept-"+depth);
                            node.addClass("select2-result");
                            node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable");
                            if (disabled) { node.addClass("select2-disabled"); }
                            if (compound) { node.addClass("select2-result-with-children"); }
                            node.addClass(self.opts.formatResultCssClass(result));
                            node.attr("role", "presentation");

                            label=$(document.createElement("div"));
                            label.addClass("select2-result-label");
                            label.attr("id", "select2-result-label-" + nextUid());
                            label.attr("role", "option");

                            formatted=opts.formatResult(result, label, query, self.opts.escapeMarkup);
                            if (formatted!==undefined) {
                                label.html(formatted);
                                node.append(label);
                            }


                            if (compound) {

                                innerContainer=$("<ul></ul>");
                                innerContainer.addClass("select2-result-sub");
                                populate(result.children, innerContainer, depth+1);
                                node.append(innerContainer);
                            }

                            node.data("select2-data", result);
                            container.append(node);
                        }

                        liveRegion.text(opts.formatMatches(results.length));
                    };

                    populate(results, container, 0);
                }
            }, $.fn.select2.defaults, opts);

            if (typeof(opts.id) !== "function") {
                idKey = opts.id;
                opts.id = function (e) { return e[idKey]; };
            }

            if ($.isArray(opts.element.data("select2Tags"))) {
                if ("tags" in opts) {
                    throw "tags specified as both an attribute 'data-select2-tags' and in options of Select2 " + opts.element.attr("id");
                }
                opts.tags=opts.element.data("select2Tags");
            }

            if (select) {
                opts.query = this.bind(function (query) {
                    var data = { results: [], more: false },
                        term = query.term,
                        children, placeholderOption, process;

                    process=function(element, collection) {
                        var group;
                        if (element.is("option")) {
                            if (query.matcher(term, element.text(), element)) {
                                collection.push(self.optionToData(element));
                            }
                        } else if (element.is("optgroup")) {
                            group=self.optionToData(element);
                            element.children().each2(function(i, elm) { process(elm, group.children); });
                            if (group.children.length>0) {
                                collection.push(group);
                            }
                        }
                    };

                    children=element.children();

                    // ignore the placeholder option if there is one
                    if (this.getPlaceholder() !== undefined && children.length > 0) {
                        placeholderOption = this.getPlaceholderOption();
                        if (placeholderOption) {
                            children=children.not(placeholderOption);
                        }
                    }

                    children.each2(function(i, elm) { process(elm, data.results); });

                    query.callback(data);
                });
                // this is needed because inside val() we construct choices from options and there id is hardcoded
                opts.id=function(e) { return e.id; };
            } else {
                if (!("query" in opts)) {

                    if ("ajax" in opts) {
                        ajaxUrl = opts.element.data("ajax-url");
                        if (ajaxUrl && ajaxUrl.length > 0) {
                            opts.ajax.url = ajaxUrl;
                        }
                        opts.query = ajax.call(opts.element, opts.ajax);
                    } else if ("data" in opts) {
                        opts.query = local(opts.data);
                    } else if ("tags" in opts) {
                        opts.query = tags(opts.tags);
                        if (opts.createSearchChoice === undefined) {
                            opts.createSearchChoice = function (term) { return {id: $.trim(term), text: $.trim(term)}; };
                        }
                        if (opts.initSelection === undefined) {
                            opts.initSelection = function (element, callback) {
                                var data = [];
                                $(splitVal(element.val(), opts.separator)).each(function () {
                                    var obj = { id: this, text: this },
                                        tags = opts.tags;
                                    if ($.isFunction(tags)) tags=tags();
                                    $(tags).each(function() { if (equal(this.id, obj.id)) { obj = this; return false; } });
                                    data.push(obj);
                                });

                                callback(data);
                            };
                        }
                    }
                }
            }
            if (typeof(opts.query) !== "function") {
                throw "query function not defined for Select2 " + opts.element.attr("id");
            }

            if (opts.createSearchChoicePosition === 'top') {
                opts.createSearchChoicePosition = function(list, item) { list.unshift(item); };
            }
            else if (opts.createSearchChoicePosition === 'bottom') {
                opts.createSearchChoicePosition = function(list, item) { list.push(item); };
            }
            else if (typeof(opts.createSearchChoicePosition) !== "function")  {
                throw "invalid createSearchChoicePosition option must be 'top', 'bottom' or a custom function";
            }

            return opts;
        },

        /**
         * Monitor the original element for changes and update select2 accordingly
         */
        // abstract
        monitorSource: function () {
            var el = this.opts.element, sync, observer;

            el.on("change.select2", this.bind(function (e) {
                if (this.opts.element.data("select2-change-triggered") !== true) {
                    this.initSelection();
                }
            }));

            sync = this.bind(function () {

                // sync enabled state
                var disabled = el.prop("disabled");
                if (disabled === undefined) disabled = false;
                this.enable(!disabled);

                var readonly = el.prop("readonly");
                if (readonly === undefined) readonly = false;
                this.readonly(readonly);

                syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);
                this.container.addClass(evaluate(this.opts.containerCssClass));

                syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);
                this.dropdown.addClass(evaluate(this.opts.dropdownCssClass));

            });

            // IE8-10 (IE9/10 won't fire propertyChange via attachEventListener)
            if (el.length && el[0].attachEvent) {
                el.each(function() {
                    this.attachEvent("onpropertychange", sync);
                });
            }
            
            // safari, chrome, firefox, IE11
            observer = window.MutationObserver || window.WebKitMutationObserver|| window.MozMutationObserver;
            if (observer !== undefined) {
                if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }
                this.propertyObserver = new observer(function (mutations) {
                    mutations.forEach(sync);
                });
                this.propertyObserver.observe(el.get(0), { attributes:true, subtree:false });
            }
        },

        // abstract
        triggerSelect: function(data) {
            var evt = $.Event("select2-selecting", { val: this.id(data), object: data });
            this.opts.element.trigger(evt);
            return !evt.isDefaultPrevented();
        },

        /**
         * Triggers the change event on the source element
         */
        // abstract
        triggerChange: function (details) {

            details = details || {};
            details= $.extend({}, details, { type: "change", val: this.val() });
            // prevents recursive triggering
            this.opts.element.data("select2-change-triggered", true);
            this.opts.element.trigger(details);
            this.opts.element.data("select2-change-triggered", false);

            // some validation frameworks ignore the change event and listen instead to keyup, click for selects
            // so here we trigger the click event manually
            this.opts.element.click();

            // ValidationEngine ignores the change event and listens instead to blur
            // so here we trigger the blur event manually if so desired
            if (this.opts.blurOnChange)
                this.opts.element.blur();
        },

        //abstract
        isInterfaceEnabled: function()
        {
            return this.enabledInterface === true;
        },

        // abstract
        enableInterface: function() {
            var enabled = this._enabled && !this._readonly,
                disabled = !enabled;

            if (enabled === this.enabledInterface) return false;

            this.container.toggleClass("select2-container-disabled", disabled);
            this.close();
            this.enabledInterface = enabled;

            return true;
        },

        // abstract
        enable: function(enabled) {
            if (enabled === undefined) enabled = true;
            if (this._enabled === enabled) return;
            this._enabled = enabled;

            this.opts.element.prop("disabled", !enabled);
            this.enableInterface();
        },

        // abstract
        disable: function() {
            this.enable(false);
        },

        // abstract
        readonly: function(enabled) {
            if (enabled === undefined) enabled = false;
            if (this._readonly === enabled) return;
            this._readonly = enabled;

            this.opts.element.prop("readonly", enabled);
            this.enableInterface();
        },

        // abstract
        opened: function () {
            return this.container.hasClass("select2-dropdown-open");
        },

        // abstract
        positionDropdown: function() {
            var $dropdown = this.dropdown,
                offset = this.container.offset(),
                height = this.container.outerHeight(false),
                width = this.container.outerWidth(false),
                dropHeight = $dropdown.outerHeight(false),
                $window = $(window),
                windowWidth = $window.width(),
                windowHeight = $window.height(),
                viewPortRight = $window.scrollLeft() + windowWidth,
                viewportBottom = $window.scrollTop() + windowHeight,
                dropTop = offset.top + height,
                dropLeft = offset.left,
                enoughRoomBelow = dropTop + dropHeight <= viewportBottom,
                enoughRoomAbove = (offset.top - dropHeight) >= $window.scrollTop(),
                dropWidth = $dropdown.outerWidth(false),
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight,
                aboveNow = $dropdown.hasClass("select2-drop-above"),
                bodyOffset,
                above,
                changeDirection,
                css,
                resultsListNode;

            // always prefer the current above/below alignment, unless there is not enough room
            if (aboveNow) {
                above = true;
                if (!enoughRoomAbove && enoughRoomBelow) {
                    changeDirection = true;
                    above = false;
                }
            } else {
                above = false;
                if (!enoughRoomBelow && enoughRoomAbove) {
                    changeDirection = true;
                    above = true;
                }
            }

            //if we are changing direction we need to get positions when dropdown is hidden;
            if (changeDirection) {
                $dropdown.hide();
                offset = this.container.offset();
                height = this.container.outerHeight(false);
                width = this.container.outerWidth(false);
                dropHeight = $dropdown.outerHeight(false);
                viewPortRight = $window.scrollLeft() + windowWidth;
                viewportBottom = $window.scrollTop() + windowHeight;
                dropTop = offset.top + height;
                dropLeft = offset.left;
                dropWidth = $dropdown.outerWidth(false);
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;
                $dropdown.show();

                // fix so the cursor does not move to the left within the search-textbox in IE
                this.focusSearch();
            }

            if (this.opts.dropdownAutoWidth) {
                resultsListNode = $('.select2-results', $dropdown)[0];
                $dropdown.addClass('select2-drop-auto-width');
                $dropdown.css('width', '');
                // Add scrollbar width to dropdown if vertical scrollbar is present
                dropWidth = $dropdown.outerWidth(false) + (resultsListNode.scrollHeight === resultsListNode.clientHeight ? 0 : scrollBarDimensions.width);
                dropWidth > width ? width = dropWidth : dropWidth = width;
                dropHeight = $dropdown.outerHeight(false);
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;
            }
            else {
                this.container.removeClass('select2-drop-auto-width');
            }

            //console.log("below/ droptop:", dropTop, "dropHeight", dropHeight, "sum", (dropTop+dropHeight)+" viewport bottom", viewportBottom, "enough?", enoughRoomBelow);
            //console.log("above/ offset.top", offset.top, "dropHeight", dropHeight, "top", (offset.top-dropHeight), "scrollTop", this.body.scrollTop(), "enough?", enoughRoomAbove);

            // fix positioning when body has an offset and is not position: static
            if (this.body.css('position') !== 'static') {
                bodyOffset = this.body.offset();
                dropTop -= bodyOffset.top;
                dropLeft -= bodyOffset.left;
            }

            if (!enoughRoomOnRight) {
                dropLeft = offset.left + this.container.outerWidth(false) - dropWidth;
            }

            css =  {
                left: dropLeft,
                width: width
            };

            if (above) {
                css.top = offset.top - dropHeight;
                css.bottom = 'auto';
                this.container.addClass("select2-drop-above");
                $dropdown.addClass("select2-drop-above");
            }
            else {
                css.top = dropTop;
                css.bottom = 'auto';
                this.container.removeClass("select2-drop-above");
                $dropdown.removeClass("select2-drop-above");
            }
            css = $.extend(css, evaluate(this.opts.dropdownCss));

            $dropdown.css(css);
        },

        // abstract
        shouldOpen: function() {
            var event;

            if (this.opened()) return false;

            if (this._enabled === false || this._readonly === true) return false;

            event = $.Event("select2-opening");
            this.opts.element.trigger(event);
            return !event.isDefaultPrevented();
        },

        // abstract
        clearDropdownAlignmentPreference: function() {
            // clear the classes used to figure out the preference of where the dropdown should be opened
            this.container.removeClass("select2-drop-above");
            this.dropdown.removeClass("select2-drop-above");
        },

        /**
         * Opens the dropdown
         *
         * @return {Boolean} whether or not dropdown was opened. This method will return false if, for example,
         * the dropdown is already open, or if the 'open' event listener on the element called preventDefault().
         */
        // abstract
        open: function () {

            if (!this.shouldOpen()) return false;

            this.opening();

            return true;
        },

        /**
         * Performs the opening of the dropdown
         */
        // abstract
        opening: function() {
            var cid = this.containerEventName,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid,
                mask;

            this.container.addClass("select2-dropdown-open").addClass("select2-container-active");

            this.clearDropdownAlignmentPreference();

            if(this.dropdown[0] !== this.body.children().last()[0]) {
                this.dropdown.detach().appendTo(this.body);
            }

            // create the dropdown mask if doesn't already exist
            mask = $("#select2-drop-mask");
            if (mask.length == 0) {
                mask = $(document.createElement("div"));
                mask.attr("id","select2-drop-mask").attr("class","select2-drop-mask");
                mask.hide();
                mask.appendTo(this.body);
                mask.on("mousedown touchstart click", function (e) {
                    // Prevent IE from generating a click event on the body
                    reinsertElement(mask);

                    var dropdown = $("#select2-drop"), self;
                    if (dropdown.length > 0) {
                        self=dropdown.data("select2");
                        if (self.opts.selectOnBlur) {
                            self.selectHighlighted({noFocus: true});
                        }
                        self.close();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
            }

            // ensure the mask is always right before the dropdown
            if (this.dropdown.prev()[0] !== mask[0]) {
                this.dropdown.before(mask);
            }

            // move the global id to the correct dropdown
            $("#select2-drop").removeAttr("id");
            this.dropdown.attr("id", "select2-drop");

            // show the elements
            mask.show();

            this.positionDropdown();
            this.dropdown.show();
            this.positionDropdown();

            this.dropdown.addClass("select2-drop-active");

            // attach listeners to events that can change the position of the container and thus require
            // the position of the dropdown to be updated as well so it does not come unglued from the container
            var that = this;
            this.container.parents().add(window).each(function () {
                $(this).on(resize+" "+scroll+" "+orient, function (e) {
                    if (that.opened()) that.positionDropdown();
                });
            });


        },

        // abstract
        close: function () {
            if (!this.opened()) return;

            var cid = this.containerEventName,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid;

            // unbind event listeners
            this.container.parents().add(window).each(function () { $(this).off(scroll).off(resize).off(orient); });

            this.clearDropdownAlignmentPreference();

            $("#select2-drop-mask").hide();
            this.dropdown.removeAttr("id"); // only the active dropdown has the select2-drop id
            this.dropdown.hide();
            this.container.removeClass("select2-dropdown-open").removeClass("select2-container-active");
            this.results.empty();


            this.clearSearch();
            this.search.removeClass("select2-active");
            this.opts.element.trigger($.Event("select2-close"));
        },

        /**
         * Opens control, sets input value, and updates results.
         */
        // abstract
        externalSearch: function (term) {
            this.open();
            this.search.val(term);
            this.updateResults(false);
        },

        // abstract
        clearSearch: function () {

        },

        //abstract
        getMaximumSelectionSize: function() {
            return evaluate(this.opts.maximumSelectionSize);
        },

        // abstract
        ensureHighlightVisible: function () {
            var results = this.results, children, index, child, hb, rb, y, more;

            index = this.highlight();

            if (index < 0) return;

            if (index == 0) {

                // if the first element is highlighted scroll all the way to the top,
                // that way any unselectable headers above it will also be scrolled
                // into view

                results.scrollTop(0);
                return;
            }

            children = this.findHighlightableChoices().find('.select2-result-label');

            child = $(children[index]);

            hb = child.offset().top + child.outerHeight(true);

            // if this is the last child lets also make sure select2-more-results is visible
            if (index === children.length - 1) {
                more = results.find("li.select2-more-results");
                if (more.length > 0) {
                    hb = more.offset().top + more.outerHeight(true);
                }
            }

            rb = results.offset().top + results.outerHeight(true);
            if (hb > rb) {
                results.scrollTop(results.scrollTop() + (hb - rb));
            }
            y = child.offset().top - results.offset().top;

            // make sure the top of the element is visible
            if (y < 0 && child.css('display') != 'none' ) {
                results.scrollTop(results.scrollTop() + y); // y is negative
            }
        },

        // abstract
        findHighlightableChoices: function() {
            return this.results.find(".select2-result-selectable:not(.select2-disabled):not(.select2-selected)");
        },

        // abstract
        moveHighlight: function (delta) {
            var choices = this.findHighlightableChoices(),
                index = this.highlight();

            while (index > -1 && index < choices.length) {
                index += delta;
                var choice = $(choices[index]);
                if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled") && !choice.hasClass("select2-selected")) {
                    this.highlight(index);
                    break;
                }
            }
        },

        // abstract
        highlight: function (index) {
            var choices = this.findHighlightableChoices(),
                choice,
                data;

            if (arguments.length === 0) {
                return indexOf(choices.filter(".select2-highlighted")[0], choices.get());
            }

            if (index >= choices.length) index = choices.length - 1;
            if (index < 0) index = 0;

            this.removeHighlight();

            choice = $(choices[index]);
            choice.addClass("select2-highlighted");

            // ensure assistive technology can determine the active choice
            this.search.attr("aria-activedescendant", choice.find(".select2-result-label").attr("id"));

            this.ensureHighlightVisible();

            this.liveRegion.text(choice.text());

            data = choice.data("select2-data");
            if (data) {
                this.opts.element.trigger({ type: "select2-highlight", val: this.id(data), choice: data });
            }
        },

        removeHighlight: function() {
            this.results.find(".select2-highlighted").removeClass("select2-highlighted");
        },

        touchMoved: function() {
            this._touchMoved = true;
        },

        clearTouchMoved: function() {
          this._touchMoved = false;
        },

        // abstract
        countSelectableResults: function() {
            return this.findHighlightableChoices().length;
        },

        // abstract
        highlightUnderEvent: function (event) {
            var el = $(event.target).closest(".select2-result-selectable");
            if (el.length > 0 && !el.is(".select2-highlighted")) {
                var choices = this.findHighlightableChoices();
                this.highlight(choices.index(el));
            } else if (el.length == 0) {
                // if we are over an unselectable item remove all highlights
                this.removeHighlight();
            }
        },

        // abstract
        loadMoreIfNeeded: function () {
            var results = this.results,
                more = results.find("li.select2-more-results"),
                below, // pixels the element is below the scroll fold, below==0 is when the element is starting to be visible
                page = this.resultsPage + 1,
                self=this,
                term=this.search.val(),
                context=this.context;

            if (more.length === 0) return;
            below = more.offset().top - results.offset().top - results.height();

            if (below <= this.opts.loadMorePadding) {
                more.addClass("select2-active");
                this.opts.query({
                        element: this.opts.element,
                        term: term,
                        page: page,
                        context: context,
                        matcher: this.opts.matcher,
                        callback: this.bind(function (data) {

                    // ignore a response if the select2 has been closed before it was received
                    if (!self.opened()) return;


                    self.opts.populateResults.call(this, results, data.results, {term: term, page: page, context:context});
                    self.postprocessResults(data, false, false);

                    if (data.more===true) {
                        more.detach().appendTo(results).text(evaluate(self.opts.formatLoadMore, page+1));
                        window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                    } else {
                        more.remove();
                    }
                    self.positionDropdown();
                    self.resultsPage = page;
                    self.context = data.context;
                    this.opts.element.trigger({ type: "select2-loaded", items: data });
                })});
            }
        },

        /**
         * Default tokenizer function which does nothing
         */
        tokenize: function() {

        },

        /**
         * @param initial whether or not this is the call to this method right after the dropdown has been opened
         */
        // abstract
        updateResults: function (initial) {
            var search = this.search,
                results = this.results,
                opts = this.opts,
                data,
                self = this,
                input,
                term = search.val(),
                lastTerm = $.data(this.container, "select2-last-term"),
                // sequence number used to drop out-of-order responses
                queryNumber;

            // prevent duplicate queries against the same term
            if (initial !== true && lastTerm && equal(term, lastTerm)) return;

            $.data(this.container, "select2-last-term", term);

            // if the search is currently hidden we do not alter the results
            if (initial !== true && (this.showSearchInput === false || !this.opened())) {
                return;
            }

            function postRender() {
                search.removeClass("select2-active");
                self.positionDropdown();
                if (results.find('.select2-no-results,.select2-selection-limit,.select2-searching').length) {
                    self.liveRegion.text(results.text());
                }
                else {
                    self.liveRegion.text(self.opts.formatMatches(results.find('.select2-result-selectable').length));
                }
            }

            function render(html) {
                results.html(html);
                postRender();
            }

            queryNumber = ++this.queryCount;

            var maxSelSize = this.getMaximumSelectionSize();
            if (maxSelSize >=1) {
                data = this.data();
                if ($.isArray(data) && data.length >= maxSelSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig")) {
                    render("<li class='select2-selection-limit'>" + evaluate(opts.formatSelectionTooBig, maxSelSize) + "</li>");
                    return;
                }
            }

            if (search.val().length < opts.minimumInputLength) {
                if (checkFormatter(opts.formatInputTooShort, "formatInputTooShort")) {
                    render("<li class='select2-no-results'>" + evaluate(opts.formatInputTooShort, search.val(), opts.minimumInputLength) + "</li>");
                } else {
                    render("");
                }
                if (initial && this.showSearch) this.showSearch(true);
                return;
            }

            if (opts.maximumInputLength && search.val().length > opts.maximumInputLength) {
                if (checkFormatter(opts.formatInputTooLong, "formatInputTooLong")) {
                    render("<li class='select2-no-results'>" + evaluate(opts.formatInputTooLong, search.val(), opts.maximumInputLength) + "</li>");
                } else {
                    render("");
                }
                return;
            }

            if (opts.formatSearching && this.findHighlightableChoices().length === 0) {
                render("<li class='select2-searching'>" + evaluate(opts.formatSearching) + "</li>");
            }

            search.addClass("select2-active");

            this.removeHighlight();

            // give the tokenizer a chance to pre-process the input
            input = this.tokenize();
            if (input != undefined && input != null) {
                search.val(input);
            }

            this.resultsPage = 1;

            opts.query({
                element: opts.element,
                    term: search.val(),
                    page: this.resultsPage,
                    context: null,
                    matcher: opts.matcher,
                    callback: this.bind(function (data) {
                var def; // default choice

                // ignore old responses
                if (queryNumber != this.queryCount) {
                  return;
                }

                // ignore a response if the select2 has been closed before it was received
                if (!this.opened()) {
                    this.search.removeClass("select2-active");
                    return;
                }

                // save context, if any
                this.context = (data.context===undefined) ? null : data.context;
                // create a default choice and prepend it to the list
                if (this.opts.createSearchChoice && search.val() !== "") {
                    def = this.opts.createSearchChoice.call(self, search.val(), data.results);
                    if (def !== undefined && def !== null && self.id(def) !== undefined && self.id(def) !== null) {
                        if ($(data.results).filter(
                            function () {
                                return equal(self.id(this), self.id(def));
                            }).length === 0) {
                            this.opts.createSearchChoicePosition(data.results, def);
                        }
                    }
                }

                if (data.results.length === 0 && checkFormatter(opts.formatNoMatches, "formatNoMatches")) {
                    render("<li class='select2-no-results'>" + evaluate(opts.formatNoMatches, search.val()) + "</li>");
                    return;
                }

                results.empty();
                self.opts.populateResults.call(this, results, data.results, {term: search.val(), page: this.resultsPage, context:null});

                if (data.more === true && checkFormatter(opts.formatLoadMore, "formatLoadMore")) {
                    results.append("<li class='select2-more-results'>" + self.opts.escapeMarkup(evaluate(opts.formatLoadMore, this.resultsPage)) + "</li>");
                    window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                }

                this.postprocessResults(data, initial);

                postRender();

                this.opts.element.trigger({ type: "select2-loaded", items: data });
            })});
        },

        // abstract
        cancel: function () {
            this.close();
        },

        // abstract
        blur: function () {
            // if selectOnBlur == true, select the currently highlighted option
            if (this.opts.selectOnBlur)
                this.selectHighlighted({noFocus: true});

            this.close();
            this.container.removeClass("select2-container-active");
            // synonymous to .is(':focus'), which is available in jquery >= 1.6
            if (this.search[0] === document.activeElement) { this.search.blur(); }
            this.clearSearch();
            this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
        },

        // abstract
        focusSearch: function () {
            focus(this.search);
        },

        // abstract
        selectHighlighted: function (options) {
            if (this._touchMoved) {
              this.clearTouchMoved();
              return;
            }
            var index=this.highlight(),
                highlighted=this.results.find(".select2-highlighted"),
                data = highlighted.closest('.select2-result').data("select2-data");

            if (data) {
                this.highlight(index);
                this.onSelect(data, options);
            } else if (options && options.noFocus) {
                this.close();
            }
        },

        // abstract
        getPlaceholder: function () {
            var placeholderOption;
            return this.opts.element.attr("placeholder") ||
                this.opts.element.attr("data-placeholder") || // jquery 1.4 compat
                this.opts.element.data("placeholder") ||
                this.opts.placeholder ||
                ((placeholderOption = this.getPlaceholderOption()) !== undefined ? placeholderOption.text() : undefined);
        },

        // abstract
        getPlaceholderOption: function() {
            if (this.select) {
                var firstOption = this.select.children('option').first();
                if (this.opts.placeholderOption !== undefined ) {
                    //Determine the placeholder option based on the specified placeholderOption setting
                    return (this.opts.placeholderOption === "first" && firstOption) ||
                           (typeof this.opts.placeholderOption === "function" && this.opts.placeholderOption(this.select));
                } else if ($.trim(firstOption.text()) === "" && firstOption.val() === "") {
                    //No explicit placeholder option specified, use the first if it's blank
                    return firstOption;
                }
            }
        },

        /**
         * Get the desired width for the container element.  This is
         * derived first from option `width` passed to select2, then
         * the inline 'style' on the original element, and finally
         * falls back to the jQuery calculated element width.
         */
        // abstract
        initContainerWidth: function () {
            function resolveContainerWidth() {
                var style, attrs, matches, i, l, attr;

                if (this.opts.width === "off") {
                    return null;
                } else if (this.opts.width === "element"){
                    return this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px';
                } else if (this.opts.width === "copy" || this.opts.width === "resolve") {
                    // check if there is inline style on the element that contains width
                    style = this.opts.element.attr('style');
                    if (style !== undefined) {
                        attrs = style.split(';');
                        for (i = 0, l = attrs.length; i < l; i = i + 1) {
                            attr = attrs[i].replace(/\s/g, '');
                            matches = attr.match(/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i);
                            if (matches !== null && matches.length >= 1)
                                return matches[1];
                        }
                    }

                    if (this.opts.width === "resolve") {
                        // next check if css('width') can resolve a width that is percent based, this is sometimes possible
                        // when attached to input type=hidden or elements hidden via css
                        style = this.opts.element.css('width');
                        if (style.indexOf("%") > 0) return style;

                        // finally, fallback on the calculated width of the element
                        return (this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px');
                    }

                    return null;
                } else if ($.isFunction(this.opts.width)) {
                    return this.opts.width();
                } else {
                    return this.opts.width;
               }
            };

            var width = resolveContainerWidth.call(this);
            if (width !== null) {
                this.container.css("width", width);
            }
        }
    });

    SingleSelect2 = clazz(AbstractSelect2, {

        // single

        createContainer: function () {
            var container = $(document.createElement("div")).attr({
                "class": "select2-container"
            }).html([
                "<a href='javascript:void(0)' class='select2-choice' tabindex='-1'>",
                "   <span class='select2-chosen'>&#160;</span><abbr class='select2-search-choice-close'></abbr>",
                "   <span class='select2-arrow' role='presentation'><b role='presentation'></b></span>",
                "</a>",
                "<label for='' class='select2-offscreen'></label>",
                "<input class='select2-focusser select2-offscreen' type='text' aria-haspopup='true' role='button' />",
                "<div class='select2-drop select2-display-none'>",
                "   <div class='select2-search'>",
                "       <label for='' class='select2-offscreen'></label>",
                "       <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input' role='combobox' aria-expanded='true'",
                "       aria-autocomplete='list' />",
                "   </div>",
                "   <ul class='select2-results' role='listbox'>",
                "   </ul>",
                "</div>"].join(""));
            return container;
        },

        // single
        enableInterface: function() {
            if (this.parent.enableInterface.apply(this, arguments)) {
                this.focusser.prop("disabled", !this.isInterfaceEnabled());
            }
        },

        // single
        opening: function () {
            var el, range, len;

            if (this.opts.minimumResultsForSearch >= 0) {
                this.showSearch(true);
            }

            this.parent.opening.apply(this, arguments);

            if (this.showSearchInput !== false) {
                // IE appends focusser.val() at the end of field :/ so we manually insert it at the beginning using a range
                // all other browsers handle this just fine

                this.search.val(this.focusser.val());
            }
            if (this.opts.shouldFocusInput(this)) {
                this.search.focus();
                // move the cursor to the end after focussing, otherwise it will be at the beginning and
                // new text will appear *before* focusser.val()
                el = this.search.get(0);
                if (el.createTextRange) {
                    range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                } else if (el.setSelectionRange) {
                    len = this.search.val().length;
                    el.setSelectionRange(len, len);
                }
            }

            // initializes search's value with nextSearchTerm (if defined by user)
            // ignore nextSearchTerm if the dropdown is opened by the user pressing a letter
            if(this.search.val() === "") {
                if(this.nextSearchTerm != undefined){
                    this.search.val(this.nextSearchTerm);
                    this.search.select();
                }
            }

            this.focusser.prop("disabled", true).val("");
            this.updateResults(true);
            this.opts.element.trigger($.Event("select2-open"));
        },

        // single
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);

            this.focusser.prop("disabled", false);

            if (this.opts.shouldFocusInput(this)) {
                this.focusser.focus();
            }
        },

        // single
        focus: function () {
            if (this.opened()) {
                this.close();
            } else {
                this.focusser.prop("disabled", false);
                if (this.opts.shouldFocusInput(this)) {
                    this.focusser.focus();
                }
            }
        },

        // single
        isFocused: function () {
            return this.container.hasClass("select2-container-active");
        },

        // single
        cancel: function () {
            this.parent.cancel.apply(this, arguments);
            this.focusser.prop("disabled", false);

            if (this.opts.shouldFocusInput(this)) {
                this.focusser.focus();
            }
        },

        // single
        destroy: function() {
            $("label[for='" + this.focusser.attr('id') + "']")
                .attr('for', this.opts.element.attr("id"));
            this.parent.destroy.apply(this, arguments);

            cleanupJQueryElements.call(this,
                "selection",
                "focusser"
            );
        },

        // single
        initContainer: function () {

            var selection,
                container = this.container,
                dropdown = this.dropdown,
                idSuffix = nextUid(),
                elementLabel;

            if (this.opts.minimumResultsForSearch < 0) {
                this.showSearch(false);
            } else {
                this.showSearch(true);
            }

            this.selection = selection = container.find(".select2-choice");

            this.focusser = container.find(".select2-focusser");

            // add aria associations
            selection.find(".select2-chosen").attr("id", "select2-chosen-"+idSuffix);
            this.focusser.attr("aria-labelledby", "select2-chosen-"+idSuffix);
            this.results.attr("id", "select2-results-"+idSuffix);
            this.search.attr("aria-owns", "select2-results-"+idSuffix);

            // rewrite labels from original element to focusser
            this.focusser.attr("id", "s2id_autogen"+idSuffix);

            elementLabel = $("label[for='" + this.opts.element.attr("id") + "']");

            this.focusser.prev()
                .text(elementLabel.text())
                .attr('for', this.focusser.attr('id'));

            // Ensure the original element retains an accessible name
            var originalTitle = this.opts.element.attr("title");
            this.opts.element.attr("title", (originalTitle || elementLabel.text()));

            this.focusser.attr("tabindex", this.elementTabIndex);

            // write label for search field using the label from the focusser element
            this.search.attr("id", this.focusser.attr('id') + '_search');

            this.search.prev()
                .text($("label[for='" + this.focusser.attr('id') + "']").text())
                .attr('for', this.search.attr('id'));

            this.search.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                    return;
                }

                switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.TAB:
                        this.selectHighlighted({noFocus: true});
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                }
            }));

            this.search.on("blur", this.bind(function(e) {
                // a workaround for chrome to keep the search field focussed when the scroll bar is used to scroll the dropdown.
                // without this the search field loses focus which is annoying
                if (document.activeElement === this.body.get(0)) {
                    window.setTimeout(this.bind(function() {
                        if (this.opened()) {
                            this.search.focus();
                        }
                    }), 0);
                }
            }));

            this.focusser.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                    return;
                }

                if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DOWN || e.which == KEY.UP
                    || (e.which == KEY.ENTER && this.opts.openOnEnter)) {

                    if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;

                    this.open();
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DELETE || e.which == KEY.BACKSPACE) {
                    if (this.opts.allowClear) {
                        this.clear();
                    }
                    killEvent(e);
                    return;
                }
            }));


            installKeyUpChangeEvent(this.focusser);
            this.focusser.on("keyup-change input", this.bind(function(e) {
                if (this.opts.minimumResultsForSearch >= 0) {
                    e.stopPropagation();
                    if (this.opened()) return;
                    this.open();
                }
            }));

            selection.on("mousedown touchstart", "abbr", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;
                this.clear();
                killEventImmediately(e);
                this.close();
                this.selection.focus();
            }));

            selection.on("mousedown touchstart", this.bind(function (e) {
                // Prevent IE from generating a click event on the body
                reinsertElement(selection);

                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }

                if (this.opened()) {
                    this.close();
                } else if (this.isInterfaceEnabled()) {
                    this.open();
                }

                killEvent(e);
            }));

            dropdown.on("mousedown touchstart", this.bind(function() {
                if (this.opts.shouldFocusInput(this)) {
                    this.search.focus();
                }
            }));

            selection.on("focus", this.bind(function(e) {
                killEvent(e);
            }));

            this.focusser.on("focus", this.bind(function(){
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
            })).on("blur", this.bind(function() {
                if (!this.opened()) {
                    this.container.removeClass("select2-container-active");
                    this.opts.element.trigger($.Event("select2-blur"));
                }
            }));
            this.search.on("focus", this.bind(function(){
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
            }));

            this.initContainerWidth();
            this.opts.element.addClass("select2-offscreen");
            this.setPlaceholder();

        },

        // single
        clear: function(triggerChange) {
            var data=this.selection.data("select2-data");
            if (data) { // guard against queued quick consecutive clicks
                var evt = $.Event("select2-clearing");
                this.opts.element.trigger(evt);
                if (evt.isDefaultPrevented()) {
                    return;
                }
                var placeholderOption = this.getPlaceholderOption();
                this.opts.element.val(placeholderOption ? placeholderOption.val() : "");
                this.selection.find(".select2-chosen").empty();
                this.selection.removeData("select2-data");
                this.setPlaceholder();

                if (triggerChange !== false){
                    this.opts.element.trigger({ type: "select2-removed", val: this.id(data), choice: data });
                    this.triggerChange({removed:data});
                }
            }
        },

        /**
         * Sets selection based on source element's value
         */
        // single
        initSelection: function () {
            var selected;
            if (this.isPlaceholderOptionSelected()) {
                this.updateSelection(null);
                this.close();
                this.setPlaceholder();
            } else {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(selected){
                    if (selected !== undefined && selected !== null) {
                        self.updateSelection(selected);
                        self.close();
                        self.setPlaceholder();
                        self.nextSearchTerm = self.opts.nextSearchTerm(selected, self.search.val());
                    }
                });
            }
        },

        isPlaceholderOptionSelected: function() {
            var placeholderOption;
            if (this.getPlaceholder() === undefined) return false; // no placeholder specified so no option should be considered
            return ((placeholderOption = this.getPlaceholderOption()) !== undefined && placeholderOption.prop("selected"))
                || (this.opts.element.val() === "")
                || (this.opts.element.val() === undefined)
                || (this.opts.element.val() === null);
        },

        // single
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments),
                self=this;

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install the selection initializer
                opts.initSelection = function (element, callback) {
                    var selected = element.find("option").filter(function() { return this.selected && !this.disabled });
                    // a single select box always has a value, no need to null check 'selected'
                    callback(self.optionToData(selected));
                };
            } else if ("data" in opts) {
                // install default initSelection when applied to hidden input and data is local
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var id = element.val();
                    //search in data by id, storing the actual matching item
                    var match = null;
                    opts.query({
                        matcher: function(term, text, el){
                            var is_match = equal(id, opts.id(el));
                            if (is_match) {
                                match = el;
                            }
                            return is_match;
                        },
                        callback: !$.isFunction(callback) ? $.noop : function() {
                            callback(match);
                        }
                    });
                };
            }

            return opts;
        },

        // single
        getPlaceholder: function() {
            // if a placeholder is specified on a single select without a valid placeholder option ignore it
            if (this.select) {
                if (this.getPlaceholderOption() === undefined) {
                    return undefined;
                }
            }

            return this.parent.getPlaceholder.apply(this, arguments);
        },

        // single
        setPlaceholder: function () {
            var placeholder = this.getPlaceholder();

            if (this.isPlaceholderOptionSelected() && placeholder !== undefined) {

                // check for a placeholder option if attached to a select
                if (this.select && this.getPlaceholderOption() === undefined) return;

                this.selection.find(".select2-chosen").html(this.opts.escapeMarkup(placeholder));

                this.selection.addClass("select2-default");

                this.container.removeClass("select2-allowclear");
            }
        },

        // single
        postprocessResults: function (data, initial, noHighlightUpdate) {
            var selected = 0, self = this, showSearchInput = true;

            // find the selected element in the result list

            this.findHighlightableChoices().each2(function (i, elm) {
                if (equal(self.id(elm.data("select2-data")), self.opts.element.val())) {
                    selected = i;
                    return false;
                }
            });

            // and highlight it
            if (noHighlightUpdate !== false) {
                if (initial === true && selected >= 0) {
                    this.highlight(selected);
                } else {
                    this.highlight(0);
                }
            }

            // hide the search box if this is the first we got the results and there are enough of them for search

            if (initial === true) {
                var min = this.opts.minimumResultsForSearch;
                if (min >= 0) {
                    this.showSearch(countResults(data.results) >= min);
                }
            }
        },

        // single
        showSearch: function(showSearchInput) {
            if (this.showSearchInput === showSearchInput) return;

            this.showSearchInput = showSearchInput;

            this.dropdown.find(".select2-search").toggleClass("select2-search-hidden", !showSearchInput);
            this.dropdown.find(".select2-search").toggleClass("select2-offscreen", !showSearchInput);
            //add "select2-with-searchbox" to the container if search box is shown
            $(this.dropdown, this.container).toggleClass("select2-with-searchbox", showSearchInput);
        },

        // single
        onSelect: function (data, options) {

            if (!this.triggerSelect(data)) { return; }

            var old = this.opts.element.val(),
                oldData = this.data();

            this.opts.element.val(this.id(data));
            this.updateSelection(data);

            this.opts.element.trigger({ type: "select2-selected", val: this.id(data), choice: data });

            this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());
            this.close();

            if ((!options || !options.noFocus) && this.opts.shouldFocusInput(this)) {
                this.focusser.focus();
            }

            if (!equal(old, this.id(data))) {
                this.triggerChange({ added: data, removed: oldData });
            }
        },

        // single
        updateSelection: function (data) {

            var container=this.selection.find(".select2-chosen"), formatted, cssClass;

            this.selection.data("select2-data", data);

            container.empty();
            if (data !== null) {
                formatted=this.opts.formatSelection(data, container, this.opts.escapeMarkup);
            }
            if (formatted !== undefined) {
                container.append(formatted);
            }
            cssClass=this.opts.formatSelectionCssClass(data, container);
            if (cssClass !== undefined) {
                container.addClass(cssClass);
            }

            this.selection.removeClass("select2-default");

            if (this.opts.allowClear && this.getPlaceholder() !== undefined) {
                this.container.addClass("select2-allowclear");
            }
        },

        // single
        val: function () {
            var val,
                triggerChange = false,
                data = null,
                self = this,
                oldData = this.data();

            if (arguments.length === 0) {
                return this.opts.element.val();
            }

            val = arguments[0];

            if (arguments.length > 1) {
                triggerChange = arguments[1];
            }

            if (this.select) {
                this.select
                    .val(val)
                    .find("option").filter(function() { return this.selected }).each2(function (i, elm) {
                        data = self.optionToData(elm);
                        return false;
                    });
                this.updateSelection(data);
                this.setPlaceholder();
                if (triggerChange) {
                    this.triggerChange({added: data, removed:oldData});
                }
            } else {
                // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
                if (!val && val !== 0) {
                    this.clear(triggerChange);
                    return;
                }
                if (this.opts.initSelection === undefined) {
                    throw new Error("cannot call val() if initSelection() is not defined");
                }
                this.opts.element.val(val);
                this.opts.initSelection(this.opts.element, function(data){
                    self.opts.element.val(!data ? "" : self.id(data));
                    self.updateSelection(data);
                    self.setPlaceholder();
                    if (triggerChange) {
                        self.triggerChange({added: data, removed:oldData});
                    }
                });
            }
        },

        // single
        clearSearch: function () {
            this.search.val("");
            this.focusser.val("");
        },

        // single
        data: function(value) {
            var data,
                triggerChange = false;

            if (arguments.length === 0) {
                data = this.selection.data("select2-data");
                if (data == undefined) data = null;
                return data;
            } else {
                if (arguments.length > 1) {
                    triggerChange = arguments[1];
                }
                if (!value) {
                    this.clear(triggerChange);
                } else {
                    data = this.data();
                    this.opts.element.val(!value ? "" : this.id(value));
                    this.updateSelection(value);
                    if (triggerChange) {
                        this.triggerChange({added: value, removed:data});
                    }
                }
            }
        }
    });

    MultiSelect2 = clazz(AbstractSelect2, {

        // multi
        createContainer: function () {
            var container = $(document.createElement("div")).attr({
                "class": "select2-container select2-container-multi"
            }).html([
                "<ul class='select2-choices'>",
                "  <li class='select2-search-field'>",
                "    <label for='' class='select2-offscreen'></label>",
                "    <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'>",
                "  </li>",
                "</ul>",
                "<div class='select2-drop select2-drop-multi select2-display-none'>",
                "   <ul class='select2-results'>",
                "   </ul>",
                "</div>"].join(""));
            return container;
        },

        // multi
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments),
                self=this;

            // TODO validate placeholder is a string if specified

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install the selection initializer
                opts.initSelection = function (element, callback) {

                    var data = [];

                    element.find("option").filter(function() { return this.selected && !this.disabled }).each2(function (i, elm) {
                        data.push(self.optionToData(elm));
                    });
                    callback(data);
                };
            } else if ("data" in opts) {
                // install default initSelection when applied to hidden input and data is local
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var ids = splitVal(element.val(), opts.separator);
                    //search in data by array of ids, storing matching items in a list
                    var matches = [];
                    opts.query({
                        matcher: function(term, text, el){
                            var is_match = $.grep(ids, function(id) {
                                return equal(id, opts.id(el));
                            }).length;
                            if (is_match) {
                                matches.push(el);
                            }
                            return is_match;
                        },
                        callback: !$.isFunction(callback) ? $.noop : function() {
                            // reorder matches based on the order they appear in the ids array because right now
                            // they are in the order in which they appear in data array
                            var ordered = [];
                            for (var i = 0; i < ids.length; i++) {
                                var id = ids[i];
                                for (var j = 0; j < matches.length; j++) {
                                    var match = matches[j];
                                    if (equal(id, opts.id(match))) {
                                        ordered.push(match);
                                        matches.splice(j, 1);
                                        break;
                                    }
                                }
                            }
                            callback(ordered);
                        }
                    });
                };
            }

            return opts;
        },

        // multi
        selectChoice: function (choice) {

            var selected = this.container.find(".select2-search-choice-focus");
            if (selected.length && choice && choice[0] == selected[0]) {

            } else {
                if (selected.length) {
                    this.opts.element.trigger("choice-deselected", selected);
                }
                selected.removeClass("select2-search-choice-focus");
                if (choice && choice.length) {
                    this.close();
                    choice.addClass("select2-search-choice-focus");
                    this.opts.element.trigger("choice-selected", choice);
                }
            }
        },

        // multi
        destroy: function() {
            $("label[for='" + this.search.attr('id') + "']")
                .attr('for', this.opts.element.attr("id"));
            this.parent.destroy.apply(this, arguments);

            cleanupJQueryElements.call(this,
                "searchContainer",
                "selection"
            );
        },

        // multi
        initContainer: function () {

            var selector = ".select2-choices", selection;

            this.searchContainer = this.container.find(".select2-search-field");
            this.selection = selection = this.container.find(selector);

            var _this = this;
            this.selection.on("click", ".select2-search-choice:not(.select2-locked)", function (e) {
                //killEvent(e);
                _this.search[0].focus();
                _this.selectChoice($(this));
            });

            // rewrite labels from original element to focusser
            this.search.attr("id", "s2id_autogen"+nextUid());

            this.search.prev()
                .text($("label[for='" + this.opts.element.attr("id") + "']").text())
                .attr('for', this.search.attr('id'));

            this.search.on("input paste", this.bind(function() {
                if (!this.isInterfaceEnabled()) return;
                if (!this.opened()) {
                    this.open();
                }
            }));

            this.search.attr("tabindex", this.elementTabIndex);

            this.keydowns = 0;
            this.search.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                ++this.keydowns;
                var selected = selection.find(".select2-search-choice-focus");
                var prev = selected.prev(".select2-search-choice:not(.select2-locked)");
                var next = selected.next(".select2-search-choice:not(.select2-locked)");
                var pos = getCursorInfo(this.search);

                if (selected.length &&
                    (e.which == KEY.LEFT || e.which == KEY.RIGHT || e.which == KEY.BACKSPACE || e.which == KEY.DELETE || e.which == KEY.ENTER)) {
                    var selectedChoice = selected;
                    if (e.which == KEY.LEFT && prev.length) {
                        selectedChoice = prev;
                    }
                    else if (e.which == KEY.RIGHT) {
                        selectedChoice = next.length ? next : null;
                    }
                    else if (e.which === KEY.BACKSPACE) {
                        if (this.unselect(selected.first())) {
                            this.search.width(10);
                            selectedChoice = prev.length ? prev : next;
                        }
                    } else if (e.which == KEY.DELETE) {
                        if (this.unselect(selected.first())) {
                            this.search.width(10);
                            selectedChoice = next.length ? next : null;
                        }
                    } else if (e.which == KEY.ENTER) {
                        selectedChoice = null;
                    }

                    this.selectChoice(selectedChoice);
                    killEvent(e);
                    if (!selectedChoice || !selectedChoice.length) {
                        this.open();
                    }
                    return;
                } else if (((e.which === KEY.BACKSPACE && this.keydowns == 1)
                    || e.which == KEY.LEFT) && (pos.offset == 0 && !pos.length)) {

                    this.selectChoice(selection.find(".select2-search-choice:not(.select2-locked)").last());
                    killEvent(e);
                    return;
                } else {
                    this.selectChoice(null);
                }

                if (this.opened()) {
                    switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.TAB:
                        this.selectHighlighted({noFocus:true});
                        this.close();
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                    }
                }

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e)
                 || e.which === KEY.BACKSPACE || e.which === KEY.ESC) {
                    return;
                }

                if (e.which === KEY.ENTER) {
                    if (this.opts.openOnEnter === false) {
                        return;
                    } else if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
                        return;
                    }
                }

                this.open();

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                }

                if (e.which === KEY.ENTER) {
                    // prevent form from being submitted
                    killEvent(e);
                }

            }));

            this.search.on("keyup", this.bind(function (e) {
                this.keydowns = 0;
                this.resizeSearch();
            })
            );

            this.search.on("blur", this.bind(function(e) {
                this.container.removeClass("select2-container-active");
                this.search.removeClass("select2-focused");
                this.selectChoice(null);
                if (!this.opened()) this.clearSearch();
                e.stopImmediatePropagation();
                this.opts.element.trigger($.Event("select2-blur"));
            }));

            this.container.on("click", selector, this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;
                if ($(e.target).closest(".select2-search-choice").length > 0) {
                    // clicked inside a select2 search choice, do not open
                    return;
                }
                this.selectChoice(null);
                this.clearPlaceholder();
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.open();
                this.focusSearch();
                e.preventDefault();
            }));

            this.container.on("focus", selector, this.bind(function () {
                if (!this.isInterfaceEnabled()) return;
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
                this.dropdown.addClass("select2-drop-active");
                this.clearPlaceholder();
            }));

            this.initContainerWidth();
            this.opts.element.addClass("select2-offscreen");

            // set the placeholder if necessary
            this.clearSearch();
        },

        // multi
        enableInterface: function() {
            if (this.parent.enableInterface.apply(this, arguments)) {
                this.search.prop("disabled", !this.isInterfaceEnabled());
            }
        },

        // multi
        initSelection: function () {
            var data;
            if (this.opts.element.val() === "" && this.opts.element.text() === "") {
                this.updateSelection([]);
                this.close();
                // set the placeholder if necessary
                this.clearSearch();
            }
            if (this.select || this.opts.element.val() !== "") {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(data){
                    if (data !== undefined && data !== null) {
                        self.updateSelection(data);
                        self.close();
                        // set the placeholder if necessary
                        self.clearSearch();
                    }
                });
            }
        },

        // multi
        clearSearch: function () {
            var placeholder = this.getPlaceholder(),
                maxWidth = this.getMaxSearchWidth();

            if (placeholder !== undefined  && this.getVal().length === 0 && this.search.hasClass("select2-focused") === false) {
                this.search.val(placeholder).addClass("select2-default");
                // stretch the search box to full width of the container so as much of the placeholder is visible as possible
                // we could call this.resizeSearch(), but we do not because that requires a sizer and we do not want to create one so early because of a firefox bug, see #944
                this.search.width(maxWidth > 0 ? maxWidth : this.container.css("width"));
            } else {
                this.search.val("").width(10);
            }
        },

        // multi
        clearPlaceholder: function () {
            if (this.search.hasClass("select2-default")) {
                this.search.val("").removeClass("select2-default");
            }
        },

        // multi
        opening: function () {
            this.clearPlaceholder(); // should be done before super so placeholder is not used to search
            this.resizeSearch();

            this.parent.opening.apply(this, arguments);

            this.focusSearch();

            // initializes search's value with nextSearchTerm (if defined by user)
            // ignore nextSearchTerm if the dropdown is opened by the user pressing a letter
            if(this.search.val() === "") {
                if(this.nextSearchTerm != undefined){
                    this.search.val(this.nextSearchTerm);
                    this.search.select();
                }
            }

            this.updateResults(true);
            if (this.opts.shouldFocusInput(this)) {
                this.search.focus();
            }
            this.opts.element.trigger($.Event("select2-open"));
        },

        // multi
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);
        },

        // multi
        focus: function () {
            this.close();
            this.search.focus();
        },

        // multi
        isFocused: function () {
            return this.search.hasClass("select2-focused");
        },

        // multi
        updateSelection: function (data) {
            var ids = [], filtered = [], self = this;

            // filter out duplicates
            $(data).each(function () {
                if (indexOf(self.id(this), ids) < 0) {
                    ids.push(self.id(this));
                    filtered.push(this);
                }
            });
            data = filtered;

            this.selection.find(".select2-search-choice").remove();
            $(data).each(function () {
                self.addSelectedChoice(this);
            });
            self.postprocessResults();
        },

        // multi
        tokenize: function() {
            var input = this.search.val();
            input = this.opts.tokenizer.call(this, input, this.data(), this.bind(this.onSelect), this.opts);
            if (input != null && input != undefined) {
                this.search.val(input);
                if (input.length > 0) {
                    this.open();
                }
            }

        },

        // multi
        onSelect: function (data, options) {

            if (!this.triggerSelect(data)) { return; }

            this.addSelectedChoice(data);

            this.opts.element.trigger({ type: "selected", val: this.id(data), choice: data });

            // keep track of the search's value before it gets cleared
            this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());

            this.clearSearch();
            this.updateResults();

            if (this.select || !this.opts.closeOnSelect) this.postprocessResults(data, false, this.opts.closeOnSelect===true);

            if (this.opts.closeOnSelect) {
                this.close();
                this.search.width(10);
            } else {
                if (this.countSelectableResults()>0) {
                    this.search.width(10);
                    this.resizeSearch();
                    if (this.getMaximumSelectionSize() > 0 && this.val().length >= this.getMaximumSelectionSize()) {
                        // if we reached max selection size repaint the results so choices
                        // are replaced with the max selection reached message
                        this.updateResults(true);
                    } else {
                        // initializes search's value with nextSearchTerm and update search result
                        if(this.nextSearchTerm != undefined){
                            this.search.val(this.nextSearchTerm);
                            this.updateResults();
                            this.search.select();
                        }
                    }
                    this.positionDropdown();
                } else {
                    // if nothing left to select close
                    this.close();
                    this.search.width(10);
                }
            }

            // since its not possible to select an element that has already been
            // added we do not need to check if this is a new element before firing change
            this.triggerChange({ added: data });

            if (!options || !options.noFocus)
                this.focusSearch();
        },

        // multi
        cancel: function () {
            this.close();
            this.focusSearch();
        },

        addSelectedChoice: function (data) {
            var enableChoice = !data.locked,
                enabledItem = $(
                    "<li class='select2-search-choice'>" +
                    "    <div></div>" +
                    "    <a href='#' class='select2-search-choice-close' tabindex='-1'></a>" +
                    "</li>"),
                disabledItem = $(
                    "<li class='select2-search-choice select2-locked'>" +
                    "<div></div>" +
                    "</li>");
            var choice = enableChoice ? enabledItem : disabledItem,
                id = this.id(data),
                val = this.getVal(),
                formatted,
                cssClass;

            formatted=this.opts.formatSelection(data, choice.find("div"), this.opts.escapeMarkup);
            if (formatted != undefined) {
                choice.find("div").replaceWith("<div>"+formatted+"</div>");
            }
            cssClass=this.opts.formatSelectionCssClass(data, choice.find("div"));
            if (cssClass != undefined) {
                choice.addClass(cssClass);
            }

            if(enableChoice){
              choice.find(".select2-search-choice-close")
                  .on("mousedown", killEvent)
                  .on("click dblclick", this.bind(function (e) {
                  if (!this.isInterfaceEnabled()) return;

                  this.unselect($(e.target));
                  this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                  killEvent(e);
                  this.close();
                  this.focusSearch();
              })).on("focus", this.bind(function () {
                  if (!this.isInterfaceEnabled()) return;
                  this.container.addClass("select2-container-active");
                  this.dropdown.addClass("select2-drop-active");
              }));
            }

            choice.data("select2-data", data);
            choice.insertBefore(this.searchContainer);

            val.push(id);
            this.setVal(val);
        },

        // multi
        unselect: function (selected) {
            var val = this.getVal(),
                data,
                index;
            selected = selected.closest(".select2-search-choice");

            if (selected.length === 0) {
                throw "Invalid argument: " + selected + ". Must be .select2-search-choice";
            }

            data = selected.data("select2-data");

            if (!data) {
                // prevent a race condition when the 'x' is clicked really fast repeatedly the event can be queued
                // and invoked on an element already removed
                return;
            }

            var evt = $.Event("select2-removing");
            evt.val = this.id(data);
            evt.choice = data;
            this.opts.element.trigger(evt);

            if (evt.isDefaultPrevented()) {
                return false;
            }

            while((index = indexOf(this.id(data), val)) >= 0) {
                val.splice(index, 1);
                this.setVal(val);
                if (this.select) this.postprocessResults();
            }

            selected.remove();

            this.opts.element.trigger({ type: "select2-removed", val: this.id(data), choice: data });
            this.triggerChange({ removed: data });

            return true;
        },

        // multi
        postprocessResults: function (data, initial, noHighlightUpdate) {
            var val = this.getVal(),
                choices = this.results.find(".select2-result"),
                compound = this.results.find(".select2-result-with-children"),
                self = this;

            choices.each2(function (i, choice) {
                var id = self.id(choice.data("select2-data"));
                if (indexOf(id, val) >= 0) {
                    choice.addClass("select2-selected");
                    // mark all children of the selected parent as selected
                    choice.find(".select2-result-selectable").addClass("select2-selected");
                }
            });

            compound.each2(function(i, choice) {
                // hide an optgroup if it doesn't have any selectable children
                if (!choice.is('.select2-result-selectable')
                    && choice.find(".select2-result-selectable:not(.select2-selected)").length === 0) {
                    choice.addClass("select2-selected");
                }
            });

            if (this.highlight() == -1 && noHighlightUpdate !== false){
                self.highlight(0);
            }

            //If all results are chosen render formatNoMatches
            if(!this.opts.createSearchChoice && !choices.filter('.select2-result:not(.select2-selected)').length > 0){
                if(!data || data && !data.more && this.results.find(".select2-no-results").length === 0) {
                    if (checkFormatter(self.opts.formatNoMatches, "formatNoMatches")) {
                        this.results.append("<li class='select2-no-results'>" + evaluate(self.opts.formatNoMatches, self.search.val()) + "</li>");
                    }
                }
            }

        },

        // multi
        getMaxSearchWidth: function() {
            return this.selection.width() - getSideBorderPadding(this.search);
        },

        // multi
        resizeSearch: function () {
            var minimumWidth, left, maxWidth, containerLeft, searchWidth,
                sideBorderPadding = getSideBorderPadding(this.search);

            minimumWidth = measureTextWidth(this.search) + 10;

            left = this.search.offset().left;

            maxWidth = this.selection.width();
            containerLeft = this.selection.offset().left;

            searchWidth = maxWidth - (left - containerLeft) - sideBorderPadding;

            if (searchWidth < minimumWidth) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth < 40) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth <= 0) {
              searchWidth = minimumWidth;
            }

            this.search.width(Math.floor(searchWidth));
        },

        // multi
        getVal: function () {
            var val;
            if (this.select) {
                val = this.select.val();
                return val === null ? [] : val;
            } else {
                val = this.opts.element.val();
                return splitVal(val, this.opts.separator);
            }
        },

        // multi
        setVal: function (val) {
            var unique;
            if (this.select) {
                this.select.val(val);
            } else {
                unique = [];
                // filter out duplicates
                $(val).each(function () {
                    if (indexOf(this, unique) < 0) unique.push(this);
                });
                this.opts.element.val(unique.length === 0 ? "" : unique.join(this.opts.separator));
            }
        },

        // multi
        buildChangeDetails: function (old, current) {
            var current = current.slice(0),
                old = old.slice(0);

            // remove intersection from each array
            for (var i = 0; i < current.length; i++) {
                for (var j = 0; j < old.length; j++) {
                    if (equal(this.opts.id(current[i]), this.opts.id(old[j]))) {
                        current.splice(i, 1);
                        if(i>0){
                        	i--;
                        }
                        old.splice(j, 1);
                        j--;
                    }
                }
            }

            return {added: current, removed: old};
        },


        // multi
        val: function (val, triggerChange) {
            var oldData, self=this;

            if (arguments.length === 0) {
                return this.getVal();
            }

            oldData=this.data();
            if (!oldData.length) oldData=[];

            // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
            if (!val && val !== 0) {
                this.opts.element.val("");
                this.updateSelection([]);
                this.clearSearch();
                if (triggerChange) {
                    this.triggerChange({added: this.data(), removed: oldData});
                }
                return;
            }

            // val is a list of ids
            this.setVal(val);

            if (this.select) {
                this.opts.initSelection(this.select, this.bind(this.updateSelection));
                if (triggerChange) {
                    this.triggerChange(this.buildChangeDetails(oldData, this.data()));
                }
            } else {
                if (this.opts.initSelection === undefined) {
                    throw new Error("val() cannot be called if initSelection() is not defined");
                }

                this.opts.initSelection(this.opts.element, function(data){
                    var ids=$.map(data, self.id);
                    self.setVal(ids);
                    self.updateSelection(data);
                    self.clearSearch();
                    if (triggerChange) {
                        self.triggerChange(self.buildChangeDetails(oldData, self.data()));
                    }
                });
            }
            this.clearSearch();
        },

        // multi
        onSortStart: function() {
            if (this.select) {
                throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
            }

            // collapse search field into 0 width so its container can be collapsed as well
            this.search.width(0);
            // hide the container
            this.searchContainer.hide();
        },

        // multi
        onSortEnd:function() {

            var val=[], self=this;

            // show search and move it to the end of the list
            this.searchContainer.show();
            // make sure the search container is the last item in the list
            this.searchContainer.appendTo(this.searchContainer.parent());
            // since we collapsed the width in dragStarted, we resize it here
            this.resizeSearch();

            // update selection
            this.selection.find(".select2-search-choice").each(function() {
                val.push(self.opts.id($(this).data("select2-data")));
            });
            this.setVal(val);
            this.triggerChange();
        },

        // multi
        data: function(values, triggerChange) {
            var self=this, ids, old;
            if (arguments.length === 0) {
                 return this.selection
                     .children(".select2-search-choice")
                     .map(function() { return $(this).data("select2-data"); })
                     .get();
            } else {
                old = this.data();
                if (!values) { values = []; }
                ids = $.map(values, function(e) { return self.opts.id(e); });
                this.setVal(ids);
                this.updateSelection(values);
                this.clearSearch();
                if (triggerChange) {
                    this.triggerChange(this.buildChangeDetails(old, this.data()));
                }
            }
        }
    });

    $.fn.select2 = function () {

        var args = Array.prototype.slice.call(arguments, 0),
            opts,
            select2,
            method, value, multiple,
            allowedMethods = ["val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "dropdown", "onSortStart", "onSortEnd", "enable", "disable", "readonly", "positionDropdown", "data", "search"],
            valueMethods = ["opened", "isFocused", "container", "dropdown"],
            propertyMethods = ["val", "data"],
            methodsMap = { search: "externalSearch" };

        this.each(function () {
            if (args.length === 0 || typeof(args[0]) === "object") {
                opts = args.length === 0 ? {} : $.extend({}, args[0]);
                opts.element = $(this);

                if (opts.element.get(0).tagName.toLowerCase() === "select") {
                    multiple = opts.element.prop("multiple");
                } else {
                    multiple = opts.multiple || false;
                    if ("tags" in opts) {opts.multiple = multiple = true;}
                }

                select2 = multiple ? new window.Select2["class"].multi() : new window.Select2["class"].single();
                select2.init(opts);
            } else if (typeof(args[0]) === "string") {

                if (indexOf(args[0], allowedMethods) < 0) {
                    throw "Unknown method: " + args[0];
                }

                value = undefined;
                select2 = $(this).data("select2");
                if (select2 === undefined) return;

                method=args[0];

                if (method === "container") {
                    value = select2.container;
                } else if (method === "dropdown") {
                    value = select2.dropdown;
                } else {
                    if (methodsMap[method]) method = methodsMap[method];

                    value = select2[method].apply(select2, args.slice(1));
                }
                if (indexOf(args[0], valueMethods) >= 0
                    || (indexOf(args[0], propertyMethods) >= 0 && args.length == 1)) {
                    return false; // abort the iteration, ready to return first matched value
                }
            } else {
                throw "Invalid arguments to select2 plugin: " + args;
            }
        });
        return (value === undefined) ? this : value;
    };

    // plugin defaults, accessible to users
    $.fn.select2.defaults = {
        width: "copy",
        loadMorePadding: 0,
        closeOnSelect: true,
        openOnEnter: true,
        containerCss: {},
        dropdownCss: {},
        containerCssClass: "",
        dropdownCssClass: "",
        formatResult: function(result, container, query, escapeMarkup) {
            var markup=[];
            markMatch(result.text, query.term, markup, escapeMarkup);
            return markup.join("");
        },
        formatSelection: function (data, container, escapeMarkup) {
            return data ? escapeMarkup(data.text) : undefined;
        },
        sortResults: function (results, container, query) {
            return results;
        },
        formatResultCssClass: function(data) {return data.css;},
        formatSelectionCssClass: function(data, container) {return undefined;},
        formatMatches: function (matches) { return matches + " results are available, use up and down arrow keys to navigate."; },
        formatNoMatches: function () { return "No matches found"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "Please enter " + n + " or more character" + (n == 1? "" : "s"); },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "Please delete " + n + " character" + (n == 1? "" : "s"); },
        formatSelectionTooBig: function (limit) { return "You can only select " + limit + " item" + (limit == 1 ? "" : "s"); },
        formatLoadMore: function (pageNumber) { return "Loading more results…"; },
        formatSearching: function () { return "Searching…"; },
        minimumResultsForSearch: 0,
        minimumInputLength: 0,
        maximumInputLength: null,
        maximumSelectionSize: 0,
        id: function (e) { return e == undefined ? null : e.id; },
        matcher: function(term, text) {
            return stripDiacritics(''+text).toUpperCase().indexOf(stripDiacritics(''+term).toUpperCase()) >= 0;
        },
        separator: ",",
        tokenSeparators: [],
        tokenizer: defaultTokenizer,
        escapeMarkup: defaultEscapeMarkup,
        blurOnChange: false,
        selectOnBlur: false,
        adaptContainerCssClass: function(c) { return c; },
        adaptDropdownCssClass: function(c) { return null; },
        nextSearchTerm: function(selectedObject, currentSearchTerm) { return undefined; },
        searchInputPlaceholder: '',
        createSearchChoicePosition: 'top',
        shouldFocusInput: function (instance) {
            // Attempt to detect touch devices
            var supportsTouchEvents = (('ontouchstart' in window) ||
                                       (navigator.msMaxTouchPoints > 0));

            // Only devices which support touch events should be special cased
            if (!supportsTouchEvents) {
                return true;
            }

            // Never focus the input if search is disabled
            if (instance.opts.minimumResultsForSearch < 0) {
                return false;
            }

            return true;
        }
    };

    $.fn.select2.ajaxDefaults = {
        transport: $.ajax,
        params: {
            type: "GET",
            cache: false,
            dataType: "json"
        }
    };

    // exports
    window.Select2 = {
        query: {
            ajax: ajax,
            local: local,
            tags: tags
        }, util: {
            debounce: debounce,
            markMatch: markMatch,
            escapeMarkup: defaultEscapeMarkup,
            stripDiacritics: stripDiacritics
        }, "class": {
            "abstract": AbstractSelect2,
            "single": SingleSelect2,
            "multi": MultiSelect2
        }
    };

}(jQuery));
;
/*!
 * strength.js
 * Original author: @aaronlumsden
 * Further changes, comments: @aaronlumsden
 * Licensed under the MIT license
 */
;(function ( $, window, document, undefined ) {

    var pluginName = "strength",
        defaults = {
            strengthClass: 'strength',
            strengthMeterClass: 'strength_meter',
            strengthButtonClass: 'button_strength',
            strengthButtonText: 'Show Password',
            strengthButtonTextToggle: 'Hide Password'
        };

       // $('<style>body { background-color: red; color: white; }</style>').appendTo('head');

    function Plugin( element, options ) {
        this.element = element;
        this.$elem = $(this.element);
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {

        init: function() {


            var characters = 0;
            var capitalletters = 0;
            var loweletters = 0;
            var number = 0;
            var special = 0;

            var upperCase= new RegExp('[A-Z]');
            var lowerCase= new RegExp('[a-z]');
            var numbers = new RegExp('[0-9]');
            var specialchars = new RegExp('([!,%,&,@,#,$,^,*,?,_,~])');

            function GetPercentage(a, b) {
                    return ((b / a) * 100);
                }

                function check_strength(thisval,thisid){
                     if (thisval.length > 8) { characters = 1; } else { characters = 0; };
                    if (thisval.match(upperCase)) { capitalletters = 1} else { capitalletters = 0; };
                    if (thisval.match(lowerCase)) { loweletters = 1}  else { loweletters = 0; };
                    if (thisval.match(numbers)) { number = 1}  else { number = 0; };

                    var total = characters + capitalletters + loweletters + number + special;
                    var totalpercent = GetPercentage(7, total).toFixed(0);

                  

                    get_total(total,thisid);
                }

            function get_total(total,thisid){

                  var thismeter = $('div[data-meter="'+thisid+'"]');
                    if (total <= 1) {
                   thismeter.removeClass();
                   thismeter.addClass('veryweak').html('');
                } else if (total == 2){
                    thismeter.removeClass();
                   thismeter.addClass('weak').html('');
                } else if(total == 3){
                    thismeter.removeClass();
                   thismeter.addClass('medium').html('');

                } else {
                     thismeter.removeClass();
                   thismeter.addClass('strong').html('');
                }
            }





            var isShown = false;
            var strengthButtonText = this.options.strengthButtonText;
            var strengthButtonTextToggle = this.options.strengthButtonTextToggle;


            thisid = this.$elem.attr('id');

            this.$elem.addClass(this.options.strengthClass).attr('data-password',thisid).after('<input style="display:none" class="'+this.options.strengthClass+'" data-password="'+thisid+'" type="text" name="" value=""><a data-password-button="'+thisid+'" href="" class="'+this.options.strengthButtonClass+'">'+this.options.strengthButtonText+'</a><div class="'+this.options.strengthMeterClass+'"><div data-meter="'+thisid+'"></div></div>');
             
            this.$elem.bind('keyup keydown', function(event) {
                thisval = $('#'+thisid).val();
                $('input[type="text"][data-password="'+thisid+'"]').val(thisval);
                check_strength(thisval,thisid);
                
            });

             $('input[type="text"][data-password="'+thisid+'"]').bind('keyup keydown', function(event) {
                thisval = $('input[type="text"][data-password="'+thisid+'"]').val();
                console.log(thisval);
                $('input[type="password"][data-password="'+thisid+'"]').val(thisval);
                check_strength(thisval,thisid);
                
            });



            $(document.body).on('click', '.'+this.options.strengthButtonClass, function(e) {
                e.preventDefault();

               thisclass = 'hide_'+$(this).attr('class');




                if (isShown) {
                    $('input[type="text"][data-password="'+thisid+'"]').hide();
                    $('input[type="password"][data-password="'+thisid+'"]').show().focus();
                    $('a[data-password-button="'+thisid+'"]').removeClass(thisclass).html(strengthButtonText);
                    isShown = false;

                } else {
                    $('input[type="text"][data-password="'+thisid+'"]').show().focus();
                    $('input[type="password"][data-password="'+thisid+'"]').hide();
                    $('a[data-password-button="'+thisid+'"]').addClass(thisclass).html(strengthButtonTextToggle);
                    isShown = true;
   
                }


               
            });


         
            
        },

        yourOtherFunction: function(el, options) {
            // some logic
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );


